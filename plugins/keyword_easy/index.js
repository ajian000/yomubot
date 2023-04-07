const { PupPlugin, segment, http } = require('@pupbot/core');
const { version } = require('./package.json');
const plugin = new PupPlugin('keyword_easy', version)


let data_json = [
    ["关键词1", "回复1"],
    ["关键词2", "回复2"],
    ["关键词3", "回复3"],
]

//插件被启用调用函数
plugin.onMounted(() => {

    plugin.saveConfig(Object.assign(data_json, plugin.loadConfig()))
    data_json = plugin.loadConfig()

    plugin.onMessage(msg => {
        data_json.some(ele => {
            if (ele[0] == msg.raw_message) {
                msg.reply(ele[1])
                return true
            }
        })
    })
    // 添加
    plugin.onAdminMatch(/^ty add keyword/, (msg) => {
        let str_msg = msg.message[0].text.replace(/^ty add keyword ?/, '')
        let arr_msg = str_msg.trim().split(" ")
        if (arr_msg.length < 2) {
            arr_msg.push(msg.message[1])
        }
        else {
            arr_msg.splice(2)
        }

        data_json.push(arr_msg)
        plugin.saveConfig(data_json)
        msg.reply(["已添加：", arr_msg[0], " => ", arr_msg[1]])
    })
    // 打印列表
    plugin.onAdminMatch(/^ty keyword list$/, (msg) => {
        let str_out = ["关键词回复列表：\n"]
        data_json.forEach((ele, index) => {
            str_out.push(`${index + 1}:${ele[0]} => `, ele[1], "\n")
        })
        msg.reply(str_out)
    })
    // 删除
    plugin.onAdminMatch(/^ty del rule ?[0-9]{1,3}$/, (msg) => {
        let inde = new Number(msg.raw_message.match(/^\d{1,3}$/))
        data_json.splice(inde - 1, 1)
        plugin.saveConfig(data_json)

        let str_out = ["关键词回复列表：\n"]
        data_json.forEach((ele, index) => {
            str_out.push(`${index + 1}:${ele[0]} => `, ele[1], "\n")
        })
        msg.reply(str_out)
    })
})

module.exports = { plugin }