## 基础知识
* 本插件支持commonjs语法
* 在运行时会自动调用main函数
* 在js脚本最后请 `module.exports = { main }`, 避免main函数无法调用

## main函数详解
* 传入参数: `event`
    * 详见 *[oicq MessageEvent](https://oicqjs.github.io/oicq/interfaces/MessageEvent.html)*

* 返回值: `{value: <value>, type: <type>}` / `undefined`
    * 当返回值为 `undefined` 时我们不会进行任何操作
    * `value`支持的类型`string, arr, oicq.segment`, 使用`arr`或`oicq.sengment`请将模式改为`oicq`
    * `type`支持内容(均为string):
      * `img` -> 仅图片(`segment.image(value)`发送, `value`应为图片直链)
      * `text` -> 仅文本(`value.toString()`发送)
      * <del>`codeFile` -> 脚本文件</del> 不支持二次回调
      * `oicq` -> oicq模式, 支持所有oicq内容(包括`segment.*`)

## 示例
```js
function main(event) {
    // 进行一些操作
    return {value: <您的数据>, type: <您的类型(推荐oicq)>}
    // 或者
    return 
}

module.exports = { main }
```

## 添加方式
qq发送
```
/bkw add <关键词/触发词> <js相对于机器人根目录路径> codefile
```
