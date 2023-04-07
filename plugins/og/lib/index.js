"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = void 0;
const core_1 = require("@pupbot/core");
const fetchOgInfo_1 = require("./fetchOgInfo");
const { version } = require('../package.json');
const plugin = new core_1.PupPlugin('og', version);
exports.plugin = plugin;
const config = {
    bili: true,
    github: true
};
const map = {
    bili: [
        // 短链: https://b23.tv/LPtGiR3
        /(https?:\/\/)?b23\.tv\/[a-z0-9]+/gi,
        // 投稿视频页: https://www.bilibili.com/video/BV1wV4y1w7rf
        /(https?:\/\/)?(www\.)?bilibili\.com\/video\/((av)|(bv))[a-z0-9]+/gi,
        // 番剧播放页: https://www.bilibili.com/bangumi/play/ss28770
        /(https?:\/\/)?(www\.)?bilibili\.com\/bangumi\/media\/md[a-z0-9]+/gi,
        // 番剧介绍页: https://www.bilibili.com/bangumi/media/md28339619
        /(https?:\/\/)?(www\.)?bilibili\.com\/bangumi\/play\/ss[a-z0-9]+/gi,
        // 漫画介绍页: https://manga.bilibili.com/detail/mc28241
        // 漫画查看页: https://manga.bilibili.com/mc28241/468498
        /(https?:\/\/)?manga\.bilibili\.com(\/detail)?\/mc[a-z0-9]+(\/[a-z0-9]+)?/gi
    ],
    github: [/(https?:\/\/)?(www\.)?github\.com\/[a-z0-9-]{1,39}\/[a-z0-9_-]{1,100}/gi]
};
plugin.onMounted(() => {
    plugin.saveConfig(Object.assign(config, plugin.loadConfig()));
    plugin.onMessage(async (event) => {
        const msg = event.toString();
        for (const [key, regs] of Object.entries(map)) {
            if (!config[key]) {
                continue;
            }
            for (const exp of regs) {
                const url = exp.exec(msg)?.[0]?.replace('github.com', 'gh-proxy.deno.dev');
                if (!url) {
                    continue;
                }
                const { image, type } = await (0, fetchOgInfo_1.fetchOgInfo)(url);
                if (key === 'github' && type !== 'object') {
                    return;
                }
                if (image) {
                    return event.reply(core_1.segment.image(image));
                }
            }
        }
    });
});
