const { PupPlugin } = require('@pupbot/core')
const plugin = new PupPlugin('demo-2.5','1.0.0')

/*****************************/
plugin.onMounted(()=>{
    plugin.on('message',(event)=>{
        if(event.raw_message.startsWith('%')){
            if(event.group_id == 560100689){
                bot.sendGroupMsg(767510546,跨群聊天测试)
            }
            '跨群聊天测试'+toString(event.group_id)
        }
    })
})
/*******************************/
module.exports = { plugin }