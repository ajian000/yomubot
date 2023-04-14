const { PupPlugin } = require('@pupbot/core')
const { version, name } = require('./package.json')
const plugin = new PupPlugin(name.replace("pupbot-plugin-", ''), version)
function L(s) {
    // console.log(s)
}
// 插件被启用调用函数
plugin.onMounted(() => {
    let msgarr = []
    let nomatch = []
    let data_json = {
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
    plugin.saveConfig(Object.assign(data_json, plugin.loadConfig()))
    data_json = plugin.loadConfig()
    if (data_json.rereadBreak == -1 && data_json.rereadNum == -1) return
    L(data_json)
    // 初始化不排列列表
    data_json.noMatch.forEach(e => { nomatch.push(new RegExp(e)) })
    plugin.onGroupMessage(msg => {
        // 筛选群
        if (data_json.group[0] == 0 || (data_json.group[0] != 1 && !data_json.group.includes(msg.group_id))) { return }
        // 筛选非匹配词
        if (nomatch.some(e => { return e.test(msg.raw_message) })) return
        // 查询群消息
        let indexOfGroup = msgarr.findIndex(e => { return e.gid == msg.group_id })
        // 没有就新建一个
        if (indexOfGroup == -1) {
            msgarr.push({
                gid: msg.group_id,
                num: 1,
                message: msg.message,
            })
            return
        }
        let group = msgarr[indexOfGroup]
        if (isSimply(group.message, msg.message)) {
            group.num++
            L(group)
            // 检查是否到阈值
            if (group.num == data_json.rereadBreak) {
                // 打断
                msg.reply(data_json.breakMsg)
                group.num = 0
            } else if (group.num == data_json.rereadNum) {
                // 复读
                msg.reply(msg.message)
                group.num++
            }
        } else {
            group.message = msg.message
            group.num = 1
        }
    })
})

module.exports = { plugin }

// 判断2条消息是否相同
function isSimply(a, b) {
    if (a.length != b.length) return false
    for (let i = 0; i < a.length; i++) {
        if (a[i].type != b[i].type) return false
        // 图片消息特殊处理
        if (a[i].type == 'image') {
            if (a[i].file != b[i].file) return false
        }
        else {
            if (JSON.stringify(a[i]) != JSON.stringify(b[i])) return false
        }
    }
    return true
}