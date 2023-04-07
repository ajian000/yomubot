"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shareMiGuSong = exports.shareKuwoSong = exports.fetchLyric = exports.fetchBiliShare = exports.fetchSongId = void 0;
const core_1 = require("@pupbot/core");
const html_entities_1 = require("html-entities");
async function fetchSongId(songName, platform) {
    if (platform === 'qq')
        return fetchQQId(songName);
    if (platform === '163')
        return fetch163Id(songName);
    if (platform === 'migu')
        return fetchMiguId(songName);
    if (platform === 'kugou')
        return fetchKugouId(songName);
    if (platform === 'kuwo')
        return fetchKuwoId(songName);
}
exports.fetchSongId = fetchSongId;
async function fetchBiliShare(songName) {
    const api = 'https://api.bilibili.com/audio/music-service-c/s';
    const params = {
        page: 1,
        pagesize: 1,
        search_type: 'music',
        keyword: songName
    };
    const { data } = await core_1.http.get(api, { params });
    const song = data?.data?.result?.[0];
    if (song) {
        const link = `https://www.bilibili.com/audio/au${song.id || ''}`;
        return {
            url: link,
            title: song.title,
            image: song.cover,
            content: song.author
        };
    }
    else {
        return null;
    }
}
exports.fetchBiliShare = fetchBiliShare;
async function fetchLyric(songName) {
    const mid = await fetchQQId(songName, true);
    if (!mid) {
        return '';
    }
    const api = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg';
    const params = {
        format: 'json',
        nobase64: 1,
        type: 1,
        songmid: mid
    };
    const { data } = await core_1.http.get(api, { params, headers: { Referer: 'https://y.qq.com' } });
    const ls = (data?.lyric ?? '').replace(/\[(.*?)]/g, '').replace(/\n(\n)*/g, '\n');
    return (0, html_entities_1.decode)(ls.trim());
}
exports.fetchLyric = fetchLyric;
async function fetchQQId(songName, isMid = false) {
    const api = 'https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg';
    const params = { key: songName };
    const { data } = await core_1.http.get(api, { params });
    return data?.data?.song?.itemlist[0]?.[isMid ? 'mid' : 'id'] ?? '';
}
async function fetch163Id(songName) {
    const api = 'https://music.163.com/api/cloudsearch/pc';
    const params = { s: songName, type: 1, offset: 0 };
    const { data } = await core_1.http.get(api, { params, headers: { 'Accept-Encoding': '*' } });
    return data?.result?.songs?.[0]?.id ?? '';
}
async function fetchMiguId(songName) {
    const api = 'https://m.music.migu.cn/migu/remoting/scr_search_tag';
    const params = { rows: 1, type: 2, keyword: songName, pgc: 1 };
    const { data } = await core_1.http.get(api, { params, headers: { Referer: 'https://m.music.migu.cn' } });
    return data?.musics?.[0]?.copyrightId ?? '';
}
async function fetchKugouId(songName) {
    const api = 'http://mobilecdn.kugou.com/api/v3/search/song';
    const params = { keyword: songName };
    const { data } = await core_1.http.get(api, { params });
    const info = data?.data?.info[0];
    return (info?.sqhash || info?.hash) ?? '';
}
async function fetchKuwoId(songName) {
    const api = 'https://search.kuwo.cn/r.s';
    const params = {
        all: songName,
        ft: 'music',
        rformat: 'json',
        encoding: 'utf8',
        pcjson: '1',
        vipver: 'MUSIC_9.1.1.2_BCS2'
    };
    const { data } = await core_1.http.get(api, { params });
    return data?.abslist?.[0]?.MUSICRID?.replace('MUSIC_', '') ?? '';
}
// fix from https://github.com/takayama-lily/oicq/blob/main/lib/message/music.ts#L65-L77
async function shareKuwoSong(id, target, isGroup = true) {
    let rsp = await core_1.http.get(`http://yinyue.kuwo.cn/api/www/music/musicInfo?mid=${id}&httpsStatus=1`, { responseType: 'json', headers: { csrf: id, cookie: ' kw_token=' + id } });
    rsp = rsp.data.data;
    const url = await core_1.http.get(`http://www.kuwo.cn/api/v1/www/music/playUrl?mid=${id}&type=music&httpsStatus=1`);
    const title = rsp.name;
    const singer = rsp.artist;
    const jumpUrl = 'http://yinyue.kuwo.cn/play_detail/' + id;
    const musicUrl = url.data.data.url || 'https://win-web-ra01-sycdn.kuwo.cn';
    const preview = rsp.pic;
    const style = 4;
    const appid = 100243533;
    const appname = 'cn.kuwo.player';
    const appsign = 'bf9ff4ffb4c558a34ee3fd52c223ebf5';
    const body = {
        1: appid,
        2: 1,
        3: style,
        5: {
            1: 1,
            2: '0.0.0',
            3: appname,
            4: appsign
        },
        10: isGroup ? 1 : 0,
        11: target,
        12: {
            10: title,
            11: singer,
            12: '[分享]' + title,
            13: jumpUrl,
            14: preview,
            16: musicUrl
        }
    };
    await this.sendOidb('OidbSvc.0xb77_9', core_1.core.pb.encode(body));
}
exports.shareKuwoSong = shareKuwoSong;
// use `encodeURIComponent` to fix axios `ERR_UNESCAPED_CHARACTERS` error
// fix from https://github.com/takayama-lily/oicq/blob/main/lib/message/music.ts#L30-L47
async function shareMiGuSong(id, target, isGroup = true) {
    let rsp = await core_1.http.get(`https://c.musicapp.migu.cn/MIGUM2.0/v1.0/content/resourceinfo.do?copyrightId=${id}&resourceType=2`, { responseType: 'json' });
    rsp = rsp.data.resource[0];
    let preview = '';
    try {
        let a = await core_1.http.get(`https://music.migu.cn/v3/api/music/audioPlayer/getSongPic?songId=${rsp.songId}`, { responseType: 'json', headers: { referer: 'https://music.migu.cn/v3/music/player/audio' } });
        preview = a.data.smallPic || '';
    }
    catch { }
    let url = await core_1.http.get(`https://app.c.nf.migu.cn/MIGUM2.0/v1.0/content/shareInfo.do?contentId=${rsp.contentId}&contentName=${encodeURIComponent(rsp.songName)}&resourceType=2&targetUserName=${encodeURIComponent(rsp.singer)}`, { responseType: 'json' });
    const title = rsp.songName;
    const singer = rsp.singer;
    const jumpUrl = url.data.url || 'http://c.migu.cn/';
    const musicUrl = rsp.newRateFormats
        ? rsp.newRateFormats[0].url.replace(/ftp:\/\/[^/]+/, 'https://freetyst.nf.migu.cn')
        : rsp.rateFormats[0].url.replace(/ftp:\/\/[^/]+/, 'https://freetyst.nf.migu.cn');
    const style = 4;
    const appid = 1101053067;
    const appname = 'cmccwm.mobilemusic';
    const appsign = '6cdc72a439cef99a3418d2a78aa28c73';
    const body = {
        1: appid,
        2: 1,
        3: style,
        5: {
            1: 1,
            2: '0.0.0',
            3: appname,
            4: appsign
        },
        10: isGroup ? 1 : 0,
        11: target,
        12: {
            10: title,
            11: singer,
            12: '[分享]' + title,
            13: jumpUrl,
            14: preview,
            16: musicUrl
        }
    };
    await this.sendOidb('OidbSvc.0xb77_9', core_1.core.pb.encode(body));
}
exports.shareMiGuSong = shareMiGuSong;
