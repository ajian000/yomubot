"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = void 0;
const core_1 = require("@pupbot/core");
const serviecs_1 = require("./serviecs");
const { version } = require('../package.json');
const plugin = new core_1.PupPlugin('搜图', version);
exports.plugin = plugin;
const config = {
    /** 忽略群 */
    ignoreGroups: [],
    /** 忽略 QQ */
    ignoreQQs: [],
    /** 忽略关键词 */
    ignoreWords: []
};
const cmd = /^\s*(百度)?搜索?图片?/;
plugin.onMounted(() => {
    plugin.saveConfig(Object.assign(config, plugin.loadConfig()));
    plugin.onAdminCmd('/soutu', (e, params, options) => {
        const [cmd, target] = params;
        const { g, q } = options;
        if (!cmd || !target || !['i'].includes(cmd)) {
            return e.reply('/soutu i <忽略词>\n/soutu i -g <忽略群>\n/soutu i -q <忽略qq>', true);
        }
        if (g) {
            if (!/^[1-9][0-9]{4,9}$/.test(target)) {
                return e.reply('无效的群号', true);
            }
            config.ignoreGroups = [...new Set([...config.ignoreGroups, Number(target)])];
        }
        else if (q) {
            if (!/^[1-9][0-9]{4,9}$/.test(target)) {
                return e.reply('无效的 QQ 号', true);
            }
            config.ignoreQQs = [...new Set([...config.ignoreQQs, Number(target)])];
        }
        else {
            config.ignoreWords = [...new Set([...config.ignoreWords, target])];
        }
        plugin.saveConfig(config);
        e.reply('操作成功，已忽略', true);
    });
    plugin.onMatch(cmd, async (e) => {
        // 屏蔽忽略 QQ
        if (config.ignoreQQs.includes(e.sender.user_id)) {
            return;
        }
        // 屏蔽忽略群
        if (e.message_type === 'group' && config.ignoreGroups.includes(e.group_id)) {
            return;
        }
        // 屏蔽忽略词
        if (config.ignoreWords.some(word => e.raw_message.includes(word))) {
            return;
        }
        const word = e.raw_message.replace(/\[.*\]/g, '').replace(cmd, '');
        if (!word) {
            return e.reply('搜图<关键词>', true);
        }
        const imageUrl = await (0, serviecs_1.fetchSearchResult)(word);
        e.reply(core_1.segment.image(imageUrl));
    });
});
