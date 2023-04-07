const { PupPlugin } = require('@pupbot/core')
const version = require('./package.json')
const plugin = new PupPlugin('微群管', version)
function getqq(arr){
  for(let obj of arr){
    if(obj.type==='at'){
      return obj.qq.toString();
    }
  }
}
plugin.onMounted((bot) => {
  plugin.onAdminMatch(/^#.*/i,async event=>{
    const cmd = event.raw_message.slice(1);
    const at = getqq(event.message);
    var value = 3;
    if(event.message[2]){
      var value = event.message[2].text.toString();
    }
  if(event.message_type=='group'){
      //const rank = await group
      if(cmd.startsWith('踢')){
          try{
           bot.setGroupKick(event.group_id,at);
           return event.reply(`${at} 被移出本群`)
          }catch(e){
           return event.reply(e)
          }
      }
      if(cmd.startsWith('禁言')){
        bot.setGroupBan(event.group_id,at,value*60)
        return event.reply('禁言成功',true)
      }
      if(cmd.startsWith('解禁')){
        bot.setGroupBan(event.group_id,at,0)
        return event.reply('解禁成功',true)
      }
      if(cmd=='关灯'){
        bot.setGroupWholeBan(event.group_id)
        return event.reply('全员禁言',true)
      }
      if(cmd=='开灯'){
        bot.setGroupWholeBan(event.group_id,false)
        return event.reply('全员解禁',true)
      }
      if(cmd.startsWith('撤回')){
        const arr2 = await bot.getChatHistory(event.message_id,50);
        for(let arr1 of arr2){
          if(arr1.sender.user_id==at){
            bot.deleteMsg(arr1.message_id)
          }
        }
        return event.reply('已撤回最近消息',true)
      }
      if(cmd.startsWith('改群头')){
            bot.setGroupPortrait(event.group_id,event.message[1].url);
            return event.reply('修改成功',true);
      }
      if(cmd.startsWith('改群名')){
        const content = cmd.slice(4)
        bot.setGroupName(event.group_id,content)
        return event.reply(`更改成功`,true)
      }
      if(cmd.startsWith('加管理')){
        bot.setGroupAdmin(event.group_id,at)
        return event.reply('添加成功',true)
      }
      if(cmd.startsWith('删管理')){
        bot.setGroupAdmin(event.group_id,at,false)
        return event.reply('删除成功',true)
      }
      if(cmd.startsWith('发公告')){
        const content = cmd.slice(4) 
        bot.sendGroupNotice(event.group_id,content)
        return event.reply('发送成功',true)
      }
      if(cmd.startsWith('改名片')){
        bot.setGroupCard(event.group_id,at,value)
        return event.reply('修改成功',true)
      }
      if(cmd.startsWith('改头衔')){
        bot.setGroupSpecialTitle(event.group_id,at,value)
        return event.reply('修改成功',true)
      }
      if(cmd=='开匿名'){
        bot.setGroupAnonymous(event.group_id)
        return event.reply('群匿名开启',true)
      }
      if(cmd=='关匿名'){
        bot.setGroupAnonymous(event.group_id,false)
        return event.reply('群匿名关闭',true)
      }
      if(cmd=='全员禁言'){
        bot.setGroupWholeBan(event.group_id)
        return event.reply('操作成功',true)
      }
      if(cmd=='全员解禁'){
        bot.setGroupWholeBan(event.group_id,false)
        return event.reply('操作成功',true)
      }
 }//仅在群聊内操作
    // if(cmd.startsWith('加撤回词')){}
    // if(cmd.startsWith('删撤回词')){}
    // if(cmd.startsWith('加禁言词')){}
    // if(cmd.startsWith('删禁言词')){}
    // if(cmd.startsWith('撤回词列表')){}
    // if(cmd.startsWith('禁言词列表')){}
    // if(cmd=='备份微群管'){}
    // if(cmd=='重载微群管'){}
    if(cmd=='微群管'){
      const msg = `微群管 | Pupbot
----------------
#踢 <@成员>
#禁言 <@成员> <?分钟>
#解禁 <@成员>
#关灯
#开灯
#撤回 <@成员>
#改群头 <图片>
#改群名 <群名>
#加管理 <@成员>
#删管理 <@成员>
#发公告 <内容>
#改名片 <@成员> <名片>
#改头衔 <@成员> <头衔>
#开匿名
#关匿名
#全员禁言
#全员解禁
----------------
共 25 个命令，"?" 代表可省`;
      return event.reply(msg)
// 待写功能：#加撤回词 <词>
// #删撤回词 <词>
// #加禁言词 <词> <?分钟>
// #删禁言词 <词>
// #撤回词列表 <?页码>
// #禁言词列表 <?页码>
// #备份微群管
// #重载微群管
    }
  })
})

module.exports = { plugin }