const { PupPlugin, segment, http } = require('@pupbot/core')
const { version, name } = require('./package.json')
const plugin = new PupPlugin(name.replace("pupbot-plugin-", ''), version)


let data_json = {
    // 获取概率
    rate: 50,
    msg: []
}

plugin.onMounted((bot) => {
    plugin.saveConfig(Object.assign(data_json, plugin.loadConfig()))
    data_json = plugin.loadConfig()
    plugin.onMatch(/^漂流瓶.+/, msg => {
        let m = msg.raw_message.replace(/^漂流瓶/, '').trim()
        // 检测规范
        if (m.length < 5) {
            msg.reply("字数太少了捏，再多写一点吧,漂流瓶字数必须大于五个字", true)
            return
        }
        let arr = [
            /傻 *逼/,
            /你 *爹/,
            /你 *妈/,
            /畜 *生/,
            /^\w{20,}$/
        ]
        if (arr.some(e => {
            return e.test(m)
        })) {
            msg.reply("漂流瓶检测不合法，请检查漂流瓶内容", true)
            return
        }
        data_json.msg.push(m)
        msg.reply([segment.at(msg.sender.user_id), "你的漂流瓶已扔出"])
        plugin.saveConfig(data_json)


    })

    plugin.onMatch(/^漂流瓶$/, msg => {
        if (data_json.msg.length == 0 || !getD()) {
            msg.reply('（没捞到漂流瓶）', true)
        } else {
            let n = Math.floor(Math.random() * data_json.msg.length)
            let str = data_json.msg[n]
            data_json.msg.splice(n, 1)
            plugin.saveConfig(data_json)
            msg.reply(["你收到一个漂流瓶：\n" + str], true)
        }

    })

    ///////
    function getD() {
        let n = Math.floor(Math.random() * 100) + 1
        return n <= data_json.rate
    }
})

module.exports = { plugin }

