# 点歌 for pupbot

[![npm-version](https://img.shields.io/npm/v/pupbot-plugin-music?color=527dec&label=pupbot-plugin-music&style=flat-square)](https://npm.im/pupbot-plugin-music)
[![dm](https://shields.io/npm/dm/pupbot-plugin-music?style=flat-square)](https://npm.im/pupbot-plugin-music)

[`pupbot`](https://gouzbot.com) 的点歌插件，支持六大主流平台的歌曲分享和查歌词的功能。BY Viki

**安装**

```shell
/plugin add music
```

**启用**

```shell
/plugin on music
```

**使用**

基本用法：

```shell
点歌周杰伦
```

命令列表：

```shell
点歌
```

指定平台：

```shell
qq点歌晴天
网易点歌晚安
酷狗点歌稻香
咪咕点歌安静
酷我点歌七里香
b站点歌孤勇者
```

查歌词：

```shell
查歌词明天你好
```

查看指令和默认平台：

```shell
/music
```

切换默认平台：

> 切换完需要重载插件才能生效

```shell
/music <platform>
```

`platform` 可选：

- `qq`：QQ 音乐
- `163`：网易云音乐
- `migu`：咪咕音乐
- `kugou`：酷狗音乐
- `kuwo`：酷我音乐
- `bili`：BiliBili 音乐
