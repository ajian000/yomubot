"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSearchResult = void 0;
const core_1 = require("@pupbot/core");
async function fetchSearchResult(word) {
    const api = 'https://m.baidu.com/sf/vsearch/image/search/wisesearchresult';
    const params = { word, pn: (0, core_1.randomInt)(1, 3), rn: 100 };
    const { data } = await core_1.http.get(api, { params });
    const images = data?.linkData?.map(({ objurl, hoverURL, thumbnailUrl }) => {
        return objurl || hoverURL || thumbnailUrl;
    });
    return images.length ? (0, core_1.randomItem)(images) : '';
}
exports.fetchSearchResult = fetchSearchResult;
