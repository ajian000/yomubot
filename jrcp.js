const {PupPlugin} = require('@pupbot/core')
const plugin = new PupPlugin('jrcp','1.0alpha')


let data_json = {
    msg: []
}

plugin.onMounted((bot) => {
    plugin.saveConfig(Object.assign(data_json, plugin.loadConfig()))
    data_json = plugin.loadConfig()

    plugin.onMatch('jrcp', msg => {

            let n = Math.floor(Math.random() * data_json.msg.length)
            let str = data_json.msg[n]
            let img = segment.image('http://192.168.31.179/externalLinksController/chain/%E8%A3%85%E5%A4%87%E6%8E%A8%E8%8D%90.jpg?ckey=BDaYK0mmru0ydAXQXYhc1hbm3p7ENvBIWuAQbtS7SU9vjUBWoK9F%2BRlhEfcY%2Bflw')
//            data_json.msg.splice(n, 1)
//            plugin.saveConfig(data_json)
            msg.reply([str,img], true)
            event.reply([str,img],true)
    })
})

module.exports = { plugin }

