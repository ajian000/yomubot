//这两行是实例化插件对象相关代码,均属于插件必须代码
const {PupPlugin} = require('@pupbot/core')
const plugin = new PupPlugin('autu','2.0')

//这个是插件的主方法,属于插件必须代码
plugin.onMounted(() =>{
    //定义变量a用于程序的流程控制
    var a = 0
    //这个是插件启用是调用的方法,参数两个参数中message为监听对象,event为所监听对象的event属性
    plugin.on('message',(event) => {
        if(event.group_id == 560100689){
            //这部分是设置问题相关代码
            if(event.raw_message.startsWith('自助问答')){
                //计划后续把这部分换成图片
                event.reply('自助问答:你可以问以下问题(只需输入对应数字即可)\n1 服务器地址')
                a = 1
            }
            //这里是主问题相关回答
            if(event.raw_message === '1' && a == 1){
                event.reply('请选择你的游戏版本(只需输入对应大写字母即可):\nA Java版\nB 基岩版')
                a = 2
            }

            //这里是服务器版本相关问题及其回答
            if(event.raw_message === 'A' && a == 2){
                event.reply('服务器地址为:ajian000.top')
                a = 0
            }else if(event.raw_message === 'B' && a == 2){
                event.reply('服务器名称:(这里你随便填一个就行了)\n服务器地址:103.91.211.138\n服务器端口:37104')
                a = 0
            }
        }
        
    })
})
//这一行是导出PupPlugin对象的plugin属性,属于插件必须的代码
module.exports = { plugin }