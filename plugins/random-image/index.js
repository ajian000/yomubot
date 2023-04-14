const os = require('node:os')
const path = require('path')
const { segment } = require("oicq")
const { PupPlugin, PluginDataDir } = require('@pupbot/core')
const { name, version } = require('./package.json')

const botRoot = path.join(PluginDataDir, "../../") // 机器人根目录
const authorQQ = 3088420339

const config = {
    'cd': 0,
    'cdmod': 'wait',
    'cdstring': '太...太快啦! 等我{time}秒行不行?AwQ',
    'use-permisson': 'admins',
    'recall-time': 90,
    'random-api': [
        'http://www.dmoe.cc/random.php',
        'http://img.xjh.me/random_img.php?return=302',
        'https://api.vvhan.com/api/acgimg',
        'https://api.yimian.xyz/img',
        'https://api.anosu.top/api',
        'https://api.ixiaowai.cn/api/api.php',
        'http://www.dmoe.cc/random.php',
        'http://api.btstu.cn/sjbz/?lx=suiji',
        "http://api.btstu.cn/sjbz/?lx=meizi",
        "http://api.btstu.cn/sjbz/?lx=m_meizi",
        "https://api.ixiaowai.cn/api/api2.php",
        "https://api.r10086.com/img-api.php?type=动漫综合1",
        "https://api.paugram.com/wallpaper",
        "https://img.paulzzh.tech/touhou/random",
        "https://api.dujin.org/pic/yuanshen/",
    ],
    'command': [
        '来张图'
    ]
}

const cdtimes = {
    group: {},
    private: {}
}

async function hooker(event, params, plugin, func, args) {
    /**
     * 本函数用于hook错误, 在发生错误时发送错误信息到qq
     */
    let funcname = '[Unknown]'
    try {
        await func(event, params, plugin, args)
    } catch (error) {
        try {
            funcname = func.name
        } catch (err) {
            funcname = '[Unknown]'
        }
        let msg = `〓 ${plugin.name} 〓\n是谁都会有难处的...\n函数"${funcname}"发生错误\n${error.stack}\n(虫子反馈: public.zhuhansan666@outlook.com | QQ: ${authorQQ})`
        event.reply(msg)
        plugin.logger.error(error)
        try {
            plugin.bot.sendPrivateMsg(authorQQ, `At ${new Date().getTime()}, funcname ${funcname}()\nbotQQ: ${plugin.bot.nickname} (${plugin.bot.uin})\nmainAdmin: ${await (await plugin.bot.getStrangerInfo(plugin.mainAdmin)).nickname} (${plugin.mainAdmin})\nPluginname: ${plugin.name}\nHostname: ${os.hostname()}\nSystem: ${os.platform()} ${os.release()} ${os.arch()}\nCPU: ${os.cpus()[0].model}\nMem: ${os.totalmem() / (1024 ** 3)} Gib\n${error.stack}`)
        } catch (error) {
            plugin.logger.error(error)
        }
    }
}

var tools = {
    getPluginName: function(nameFromPackageJson) {
        let _arr = nameFromPackageJson.split('-')
        _arr = _arr.slice(2, _arr.length)
        return _arr.join("-")
    }
}

var commands = {
    _setStartTime: function(event, key, value) {
        if (event.message_type == 'group') {
            cdtimes.group[key] = value
        } else {
            cdtimes.private[key] = value
        }
    },
    _checkCdTime: function(event, id) {
        let lastTime = -1
        let residue = null

        if (event.message_type == 'group') {
            lastTime = cdtimes.group[id]
            lastTime = lastTime == undefined ? 0 : lastTime
            residue = config.cd - (new Date().getTime() - lastTime) / 1000
            if (lastTime >= 0 && residue <= 0) {
                return [true, 0]
            }
        } else {
            lastTime = cdtimes.private[id]
            lastTime = lastTime == undefined ? 0 : lastTime
            residue = config.cd - (new Date().getTime() - lastTime) / 1000
            if (lastTime >= 0 && residue <= 0) {
                return [true, 0]
            }
        }

        return [false, lastTime >= 0 ? Math.ceil(residue) : Math.ceil(config['recall-time'] + config.cd)]
    },
    randomImage: async function(event, params, plugin) {
        plugin.saveConfig(Object.assign(config, plugin.loadConfig()))

        let senderid = event.sender.user_id
        let id = event.message_type == 'group' ? event.group_id : senderid

        let [cdOver, residue] = commands._checkCdTime(event, id)
        if (!true) { // 此会话还在cd
            event.reply([
                `〓 ${plugin.name} by ${await (await plugin.bot.getStrangerInfo(plugin.mainAdmin)).nickname} 〓\n`,
                config.cdstring.replace('{time}', residue)
            ], true)
            return
        }

        let permission = config["use-permisson"].toLowerCase()
        if (permission == 'mainadmin' && senderid != plugin.bot.mainAdmin) {
            // 如果是仅主管理员模式 且 不是主管理员直接退出
            return
        }
        if (permission == 'admin' && !plugin.admins.includes(senderid)) {
            // 如果是仅管理员模式 且 不是管理员直接退出
            return
        }
        let apis = config["random-api"]
        let api = apis[Math.round(Math.random() * (apis.length - 1))]
        let qimage = segment.image(api) // 适用于QQ的图片object

        let recallTime = config["recall-time"]

        if (config.cdmod == 'wait') {
            commands._setStartTime(event, id, -1) // 发送设置时间(-1代表等待)
        } else {
            commands._setStartTime(event, id, new Date().getTime())
        }

        let { message_id } = await (
            event.reply([
                `〓 ${plugin.name} by ${await (await plugin.bot.getStrangerInfo(plugin.mainAdmin)).nickname} 〓\n`,
                recallTime >= 0 ? `将在 ${recallTime} 秒后撤回` : '',
                qimage,
            ], true)
        ) // 发送消息

        if (recallTime < 0) { // -1直接退出
            return
        }

        if (config.cdmod == 'wait') {
            setTimeout(() => {
                    commands._setStartTime(event, id, new Date().getTime()) // 发送设置时间
                    plugin.bot.deleteMsg(message_id)
                }, (recallTime * 1000 - 100)) // 异步延时撤回
        } else {
            setTimeout(() => {
                    plugin.bot.deleteMsg(message_id)
                }, (recallTime * 1000 - 100)) // 异步延时撤回
        }
    }
}

const plugin = new PupPlugin(tools.getPluginName(name), version)

plugin.onMounted(() => {
    plugin.saveConfig(Object.assign(config, plugin.loadConfig()))
    try {
        plugin.onCmd(config.command, (event, params) => hooker(event, params, plugin, commands.randomImage))
    } catch {
        plugin.logger.error(error)
        console.log(`At ${plugin.name}.onMounted Error: ${error.stack}`)
        plugin.bot.sendPrivateMsg(plugin.mainAdmin, `At ${plugin.name}.onMounted Error: ${error.stack}`)
    }
})

module.exports = { plugin }