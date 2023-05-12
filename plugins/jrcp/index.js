const {PupPlugin, segment} = require('@pupbot/core')
const plugin = new PupPlugin('jrcp','1.1alpha')


let data_json = {
    msg: [],
    img: []
}
//已弃用
/*plugin.onMounted(()=>{
    plugin.on('message',(event)=>{
        if(event.raw_message === 'jrcp'){
            var n = Math.floor(Math.random() * data_json.msg.length)
            var msg = data_json.msg[n]
            // var img = segment.image(data_json.msg[n+1])
            // var img = segment.image('http://192.168.31.179/externalLinksController/chain/%E8%A3%85%E5%A4%87%E6%8E%A8%E8%8D%90.jpg?ckey=BDaYK0mmru0ydAXQXYhc1hbm3p7ENvBIWuAQbtS7SU9vjUBWoK9F%2BRlhEfcY%2Bflw')
            event.reply([img,msg])
        }
    })
})
*/
plugin.onMounted((bot) => {
    plugin.saveConfig(Object.assign(data_json, plugin.loadConfig()))
    data_json = plugin.loadConfig()

    plugin.onMatch('jrcp', msg => {
            //获取随机数
            let n = Math.floor(Math.random() * data_json.msg.length)
            //从json中读取文本
            let str = data_json.msg[n]
            //从json中读取图片链接
            let img = segment.image(data_json.img[n])
//            data_json.msg.splice(n, 1)
//            plugin.saveConfig(data_json)//原插件中的保存数据方法,弃用
            msg.reply([str,img], true)
//            event.reply([str],true)
    })
})

module.exports = { plugin }

