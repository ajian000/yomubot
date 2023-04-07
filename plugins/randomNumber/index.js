const { PupPlugin } = require('@pupbot/core')
const plugin = new PupPlugin('demo-2.5','1.0.0')
const map = new Map()
plugin.onMounted(()=>{
    plugin.on('message',(event)=>{
        var a = 0
        if(event.raw_message === '猜数字' && a == 0){
            var random = Math.floor(Math.random()*101)
            random = random.toString()
            // event.reply(random)
            a = 1
        }
        if(event.raw_message.startsWith('猜数字')){
            var inNumber = parseInt(event.raw_message)
            inNumber+=1
            inNumber = inNumber.toString()
            event.reply(inNumber)
            if(random > inNumber){
                event.reply('猜小了',true)
            }else if(random < inNumber){
                event.reply('猜大了',true)
            }else if(random == inNumber){
                event.reply('恭喜你猜对了',true)
                a = 0
            }
        }
            
        
    })
})
module.exports = { plugin }