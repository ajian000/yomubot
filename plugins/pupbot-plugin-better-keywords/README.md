## pupbot-plugin-better-keywords

## 用于自定义关键字并回复(有分群、私聊功能)

## 安装
```
/plugin add better-keywords
```

## 启用
```
/plugin on better-keywords
```

## 指令
* `/bkw` 或 `/bkw help` -> 获取帮助
```
帮助菜单
	/bkw add <keyword> <info> [permissonGroup] [valueType] -> 增加自定义回复
	/bkw rm <keyword> [permissonGroup]-> 删除自定义回复
	permissonGroup: 不填 -> 当前群聊, g -> 所有群聊, gf -> 所有群聊和私信, f -> 所有私信(*不区分大小写)
	valueType: 不填/text -> 仅文本, codefile/jsfile/f/jsf -> js脚本文件(*不区分大小写)
注意: permissonGroup必须在valueType之前, 在脚本模式时, info为js脚本相对于机器人根目录的路径, 脚本最后记得module.exports = { main }, 脚本最后记得module.exports = { main }
本插件会自动调用脚本main函数并以其返回值为消息内容
```
* `/bkw about` 或 `/bkwabut` 或 `#bkwabout` -> 关于界面

## 特色
* 支持加载js脚本(自动调用main函数) *[js脚本开发文档](./jsdocxs/START.md)*
* 支持js脚本热加载(在调用前自动刷新)
* 支持js脚本使用 oicq 的 segment 等内置方法发送消息
* 支持自定义提升文本(在插件安装目录`./docs/docs.json`中)

## 配置文件详解

```json
{
    "keywords": {  // 主键(root)
        "groups": {},  // 当前群聊{<gid(群号)>: {<key>: {value: <value>, type: <type>}}}
        "global-g": {}, // 全局群聊{<key>: {value: <value>, type: <type>}
        "global-f": {}, // 全局私聊{<key>: {value: <value>, type: <type>}
        "global": {} // 全局群聊和私聊{<key>: {value: <value>, type: <type>}
    }
}
```
* 兼容 `{<key>: <value>}`, 默认type为text(仅文本)
