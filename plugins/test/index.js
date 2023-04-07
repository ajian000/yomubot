const { PupPlugin } = require('@pupbot/core')
const plugin = new PupPlugin('demo-2.5','1.0.0')
plugin.onMounted(()=>{
    plugin.on('message',(event)=>{
        if(event.raw_message==='测试'){
          //raw_message为event对象属性，是消息的字符串值
            event.reply('这是一个测试消息！',false)
            //reply方法第二个参数为是否引用回复，默认为false
            //event.reply('世界！')
        }
    })
})
module.exports = { plugin }