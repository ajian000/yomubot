const { PupPlugin } = require('@pupbot/core')
const plugin = new PupPlugin('time','1.0.0')
plugin.onMounted(()=>{
    var time = new Date();
   plugin.on('',(event)=>{
        if(/*time.getHours() == 7 && */time.getMinutes() == 37){
            
            let a = '现在是'+toString(time.getHours)+'点整' 
            bot.sendGroupMsg(560100689,a)
            bot.sendGroupMsg(767510546,a)
        }
   })
})
module.exports = { plugin }