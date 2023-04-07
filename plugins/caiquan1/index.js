const { PupPlugin } = require('@pupbot/core')
const plugin = new PupPlugin('猜拳', '1.0.0')
const map = new Map()
plugin.onMounted(() => {
  plugin.onGroupMessage(event => {
    const id = event.sender.user_id
    const { raw_message } = event
    if (raw_message.startsWith('猜拳 ')) {  
/*      const a = raw_message.slice(3)
      if(a=='石头'||a=='剪刀'||a=='布'){
       if(map.has(id)){
          map.set(id,map.get(id)+1)
        }else{
          map.set(id,1)
        }
        plugin.bot.setGroupBan(event.group_id,id,60)
        switch(a){
          case '布': return event.reply(`你输了${map.get(id)}次了！\n我出的是剪刀`,true)
          case '剪刀': return event.reply(`你输了${map.get(id)}次了！\n我出的是石头`,true)
          case '石头': return event.reply(`你输了${map.get(id)}次了！\n我出的是布`,true)
        }
      }else{
        return event.reply('请输入 石头 | 剪刀 | 布',true)
      }*/
      var a1
      if(a=='石头'||a=='剪刀'||a=='布'){
        switch(a){
          case'石头':a1=1
          case'剪刀':a1=2
          case'布':a1=3
        }
        /**
         * a1为玩家
         * b为bot
         * 1胜2,2胜3,3胜1
        */
       
        var b = randomNum(1,3)
        if((a1==1 && b==2) || (a1==2 && b==3) || (a1 == 3 && b==1)){
          return msg.reply(`你赢了\n我出的是`)
        }
    
        
      }
      return event.reply(`你输了${map.get(id)}次了！\n我出的是剪刀`,true)
    }
  })
})

module.exports = { plugin }

function randomNum(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10); 
        break; 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        break; 
            default: 
                return 0; 
            break; 
    } 
}