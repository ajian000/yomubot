# 复读插件

bot会复读连续有人发送N次的消息，或者打断连续有人发送M次的消息

**安装/启用**

- `/p add reread`
- `/p on reread`

配置文件

```javascript
{
    // 要开启的群,如果第一个元素是1则全部开启，0则全部关闭
    group: [1],
    // 选择不要匹配的消息
    noMatch: [],
    // 复读出发次数,-1则关闭该功能
    rereadNum: 2,
    // 打断出发次数,-1则关闭该功能
    rereadBreak: 5,
    // 打断词
    breakMsg: "打断施法"
}
```

修改配置文件后需要重载插件`/p reload reread`

打断复读的触发次数不应和复读触发的次数一致