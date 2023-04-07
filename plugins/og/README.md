# OG 图 for PupBot

[![npm-version](https://img.shields.io/npm/v/pupbot-plugin-og?color=527dec&label=pupbot-plugin-og&style=flat-square)](https://npm.im/pupbot-plugin-og)
[![dm](https://shields.io/npm/dm/pupbot-plugin-og?style=flat-square)](https://npm.im/pupbot-plugin-og)

`pupBot` 的 og 图插件，检测到常见网站（B 站, GitHub 等）链接自动发送 og 社交分享图。

> og 图，其实就是 HTML head 标签里的 `og:image`，参考 [The Open Graph protocol](https://ogp.me/)。

**安装**

```shell
/plugin add og
```

**启用**

```shell
/plugin on og
```

**使用**

检测到相关链接时，按照配置的网站开关自动获取 og 图并发送。

**配置**

编辑 `框架目录/data/plugins/og/config.json` 文件。

```jsonc
{
  // 是否开启 B 站检测，默认开启，不开启改为 false
  "bili": true,
  // 是否开启 GitHub 检测，默认开启，不开启改为 false
  "github": true
}
```

使用以下命令重载插件生效。

```shell
/plugin reload og
```
