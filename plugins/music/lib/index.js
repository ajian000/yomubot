"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = void 0;
const core_1 = require("@pupbot/core");
const services_1 = require("./services");
const { version } = require('../package.json');
const plugin = new core_1.PupPlugin('点歌', version);
exports.plugin = plugin;
const config = {
    /** 默认点歌平台，可选：qq 163 migu kugou kuwo bili */
    default: 'qq'
};
const sources = [
    {
        platform: 'qq',
        name: 'qq',
        defaultCmd: /^\s*(qq)?((音乐)|(music))?点歌\s*/i,
        cmd: /^\s*qq((音乐)|(music))?点歌\s*/i
    },
    {
        platform: '163',
        name: '网易云',
        defaultCmd: /^\s*((网[抑易]云?)|(163)|(wyy?)|(wangyi(yun)?))?((音乐)|(music))?点歌\s*/i,
        cmd: /^\s*((网[抑易]云?)|(163)|(wyy?)|(wangyi(yun)?))((音乐)|(music))?点歌\s*/i
    },
    {
        platform: 'migu',
        name: '咪咕',
        defaultCmd: /^\s*((咪咕)|(migu)|(mg))?((音乐)|(music))?点歌\s*/i,
        cmd: /^\s*((咪咕)|(migu)|(mg))((音乐)|(music))?点歌\s*/i
    },
    {
        platform: 'kugou',
        name: '酷狗',
        defaultCmd: /^\s*((酷狗)|(kugou)|(kg))?((音乐)|(music))?点歌\s*/i,
        cmd: /^\s*((酷狗)|(kugou)|(kg))((音乐)|(music))?点歌\s*/i
    },
    {
        platform: 'kuwo',
        name: '酷我',
        defaultCmd: /^\s*((酷我)|(kuwo)|(kw))?((音乐)|(music))?点歌\s*/i,
        cmd: /^\s*((酷我)|(kuwo)|(kw))((音乐)|(music))?点歌\s*/i
    },
    {
        platform: 'bili',
        name: 'b站',
        defaultCmd: /^\s*((小?[破b]站)|(bili)|(bl)|(bilibili))?((音乐)|(music))?点歌\s*/i,
        cmd: /^\s*((小?[破b]站)|(bili)|(bl)|(bilibili))((音乐)|(music))?点歌\s*/i
    }
];
const lyricCmd = /^\s*((查?找?)|(搜索?))?歌词\s*/;
plugin.onMounted(bot => {
    Object.assign(config, plugin.loadConfig());
    plugin.saveConfig(config);
    plugin.onAdminCmd('/music', (e, params) => {
        const platform = String(params[0]);
        if (platform && sources.map(e => e.platform).includes(platform)) {
            config.default = platform;
            plugin.saveConfig(config);
            e.reply(`已切换平台为 ${platform}，重载后生效`, true);
        }
        else {
            e.reply(`/music <platform>\n当前平台：${config.default}`, true);
        }
    });
    sources.forEach(({ platform, cmd, defaultCmd }) => {
        if (platform === config.default) {
            cmd = defaultCmd;
        }
        const NotFound = `找不到搜索结果，请尝试更换平台\n当前搜索平台：${platform}`;
        plugin.onMatch(cmd, async (e) => {
            const songName = e.raw_message.replace(cmd, '').trim();
            if (!songName) {
                const list = [...sources.map(e => `${e.name}点歌<歌曲名>`), '搜歌词<歌曲名>'].join('\n');
                return e.reply(list, true);
            }
            if (platform === 'bili') {
                const share = await (0, services_1.fetchBiliShare)(songName);
                if (!share) {
                    e.reply(NotFound, true);
                }
                else {
                    plugin.log('bili share: ', share.title);
                    const { url, title, image, content } = share;
                    e.reply(core_1.segment.share(url, title, image, content));
                }
            }
            else {
                const id = await (0, services_1.fetchSongId)(songName, platform);
                plugin.log('songId: ', id, 'platform: ', platform);
                if (!id) {
                    return e.reply(NotFound, true);
                }
                if (e.message_type === 'group') {
                    if (platform === 'migu') {
                        services_1.shareMiGuSong.bind(bot)(id, e.group_id, true);
                    }
                    else if (platform === 'kuwo') {
                        services_1.shareKuwoSong.bind(bot)(id, e.group_id, true);
                    }
                    else {
                        e.group.shareMusic(platform, id);
                    }
                }
                else if (e.message_type === 'private') {
                    if (platform === 'migu') {
                        services_1.shareMiGuSong.bind(bot)(id, e.friend.uid, false);
                    }
                    else if (platform === 'kuwo') {
                        services_1.shareKuwoSong.bind(bot)(id, e.friend.uid, false);
                    }
                    else {
                        e.friend.shareMusic(platform, id);
                    }
                }
            }
        });
    });
    plugin.onMatch(lyricCmd, async (e) => {
        const songName = e.raw_message.replace(lyricCmd, '').trim();
        if (!songName) {
            return e.reply('歌曲名不能为空', true);
        }
        const lyric = await (0, services_1.fetchLyric)(songName);
        if (!lyric) {
            return e.reply('歌词搜索结果为空', true);
        }
        const lyricMsg = [lyric, '歌词数据来源于 QQ 音乐'].map(msg => ({
            nickname: bot.nickname,
            user_id: bot.uin,
            message: msg
        }));
        const msg = await core_1.makeForwardMsg.bind(bot)(lyricMsg, `【${songName}】的歌词`, '轻按查看详情');
        e.reply(msg);
    });
});
