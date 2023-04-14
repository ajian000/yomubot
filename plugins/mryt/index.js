const { PupPlugin } = require('@pupbot/core')
const { version } = require('./package.json')
const plugin = new PupPlugin('mryt', version)
const http = require('http')



let data_json = {
    // 通知时间，默认为每天早上8点
    time: '0 0 8 * * *',
    groupList: []
}
//插件被启用调用函数
plugin.onMounted((bot) => {
    plugin.saveConfig(Object.assign(data_json, plugin.loadConfig()))
    data_json = plugin.loadConfig()

    plugin.onMatch([/^#mryt ?todey$/,/^#mryt ?t$/], msg => {
        http.get(`http://www.h-camel.com/index.html`, res => {
            let data = ''
            res.on("data", d => { data += d })
            res.on("end", () => {
                msg.reply("前端每日一题：\n" + qdmryt(data), false)
            })
        })


    })

    plugin.cron(data_json.time, () => {
        let str_out_4 = "起床学习啦！！！！！\n"
        http.get(`http://www.h-camel.com/index.html`, res => {
            let data = ''
            res.on("data", d => { data += d })
            res.on("end", () => {
                str_out_4 += "前端每日一题：\n" + qdmryt(data)
                data_json.groupList.forEach(ele => {
                    bot.sendGroupMsg(ele, str_out_4)
                })
            })
        })
    })

})


// 每日一题
function qdmryt(str_input) {
    str_input = /<div class="today">[\d\D]+<div class="history">/.exec(str_input)
    var str_output = str_input[0]
        .replace(/<div ?class="[\w ]+">/g, ' ')
        .replace(/<\/div>/g, ' ')
        .replace(/<\/span>/g, ' ')
        .replace(/[\d\D]*今天你思考了吗？/, ' ')
        .replace(/<div class="time-wrap">/, "\n更新时间:")
        .replace(/<span>/g, ' ')
        .replace(/<span ?class="[\w ]+">/g, ' ')
        .replace(/<ul class="list">/g, '\n')
        .replace(/<li class="big">/g, ' ')
        .replace(/<\/li>/g, '\n')
        .replace(/"><span class="[\w ]+" data-label="[\w ]+">/g, '\n')
        .replace(/<a class="flex row dot" href="/g, 'http://www.h-camel.com/')
        .replace(/<span class="status-tips">抢沙发 ?<\/a>/g, ' ')
        .replace(/<\/ul>/g, ' ')
        .replace(/ +/g, " ")
        .replace(/\n /g, '\n')
        .replace(/^ /g, '')
        .replace(/ +/, " ")
        .replace(/\n$/, "")

    return str_output
}






module.exports = { plugin }