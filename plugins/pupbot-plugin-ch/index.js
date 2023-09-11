const { PupPlugin, segment, http } = require('@pupbot/core')
const { version } = require("./package.json")
const plugin = new PupPlugin('撤回消息', version)

// 默认的参数
let data_json = { admin_only: false }

//插件被启用调用函数
plugin.onMounted((bot, admins) => {
    plugin.saveConfig(Object.assign(data_json, plugin.loadConfig()))
    data_json = plugin.loadConfig()


    plugin.onGroupMessage(msg => {

        if (msg.message[0].type == 'at'
            && msg.message[0].qq == plugin.bot.uin
            && msg.message[1].type == 'text'
            && /^ ?ch$/.test(msg.message[1].text)
        ) {
            if (data_json.admin_only && admins.includes(msg.sender.user_id) || !data_json.admin_only) {
                msg.group.recallMsg(msg.source.seq, msg.source.rand)
            }
        }
        // 修改为只有bot管理员能撤回
        else if (msg.raw_message == 'ch admin only' && admins.includes(msg.sender.user_id)) {
            if (data_json.admin_only) {
                msg.reply(`ch is already admin only`)
            } else {
                data_json.admin_only = true
                msg.reply('ch is admin only now')
                plugin.saveConfig(data_json)
            }
        }
        // 修改为大家都能撤回
        else if (msg.raw_message == 'ch everyone' && plugin.admins.includes(msg.sender.user_id)) {
            if (!data_json.admin_only) {
                msg.reply(`ch is already for everyone`)
            } else {
                data_json.admin_only = false
                msg.reply('everyone can use ch now')
                plugin.saveConfig(data_json)
            }
        }
    })
})

module.exports = { plugin }