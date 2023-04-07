const { PupPlugin } = require('@pupbot/core')
const plugin = new PupPlugin('demo-2.5','1.0.0')
plugin.onMounted(()=>{
    var a = 0
    plugin.on('message',(event)=>{
        if(event.group_id == 713151384){
            if(event.raw_message.startsWith('自助问答')){
                event.reply('自助问答:你可以问以下问题(只需要输入对应数字即可)\n1 服务器地址\n2 如何连接服务器\n3 服务器进不去怎么办\n4 封禁和解禁指令(给某位管理准备的)\n5 营地位置',true)
                a=1
            }
            if(event.raw_message==='1' && a==1){
                event.reply('服务器ip:203.135.100.35:41045\n  你也可以使用域名连接:cm.ajian000.top',false)
                a=0
            }else if(event.raw_message==='2' && a==1){
                event.reply('在群里下载客户端=>打开游戏=>选择多人同行=>添加服务器=>输入服务器地址=>完成',false)
                a=0
            }else if(event.raw_message==='3' && a==1){
                event.reply('建议在群里问,不过大部分情况下是你网络的问题',false)
                a=0
            }else if(event.raw_message==='4' && a==1){
                event.reply('封禁:ban\n解封:pardon')
                a=0
            }else if(event.raw_message==='5' && a==1){
                event.reply('营地在150 63 18',false)
                a=0
            }
        }    
    })
})
module.exports = { plugin }