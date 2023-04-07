# pupbot-plugin-title
![npm (scoped)](https://img.shields.io/npm/v/pupbot-plugin-title?color=527dec&label=pupbot-plugin-title&style=flat-square)
[![dm](https://shields.io/npm/dm/pupbot-plugin-title?style=flat-square)](https://npm.im/pupbot-plugin-title)
<br>

## 简介
快速设置`群头衔`，请确定机器人为**群主**.<br>
## 默认指令
- `我要头衔`+`内容`
- 指令默认为**我要头衔**,若要更改请在data中更改cmd。

## 安装

对机器人发送
```js
/plugin add title
```
启用插件，生成配置文件
```js
/plugin on title
```
## 配置
- **框架文件夹 >data >plugins >title >config.json**
- 设置`cmd`内容
- 设置后 **重载插件**
```js
/plugin reload title
```