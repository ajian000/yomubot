const { PupPlugin } = require('@pupbot/core');
const { version } = require('./package.json');
const plugin = new PupPlugin('title',version);
const config = {cmd:'我要头衔'};
plugin.onMounted((bot)=>{
    plugin.saveConfig(Object.assign(config, plugin.loadConfig()));
    plugin.on('message.group',async (e)=>{
        if(e.raw_message.startsWith(config.cmd)){
        const status = await bot.getGroupMemberInfo(e.group_id,bot.uin);
        if(status.role=='owner'){
        const title = e.raw_message.slice(config.cmd.length);
        bot.setGroupSpecialTitle(e.group_id,e.sender.user_id,title).then(()=>{
            e.reply('〓 设置成功 〓',true)
        })}
    }
    })
})
module.exports = { plugin }