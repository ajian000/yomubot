"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchOgInfo = void 0;
const core_1 = require("@pupbot/core");
const cheerio = __importStar(require("cheerio"));
const attrs = ['title', 'type', 'image', 'url'];
async function fetchOgInfo(link) {
    if (!link.startsWith('http')) {
        link = `https://${link}`;
    }
    const { data: html } = await core_1.http.get(link);
    const $ = cheerio.load(html);
    const info = {};
    attrs.forEach(attr => {
        const value = $(`head meta[property="og:${attr}"]`).attr('content') ?? '';
        if (['image'].includes(attr)) {
            const url = value.split('@')[0];
            info[attr] = value?.startsWith('//') ? `https:${url}` : url;
        }
        else {
            info[attr] = value;
        }
    });
    return info;
}
exports.fetchOgInfo = fetchOgInfo;
