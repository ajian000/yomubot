const {
    PupPlugin, segment
} = require('@pupbot/core')
const https = require('https')
const plugin = new PupPlugin('AI作图', '1.0.1')
plugin.onMounted((bot, admins) => {
    plugin.onMessage(async (event)=> {
		const {
            raw_message
        } = event
        if(raw_message.indexOf('约稿约稿')==0){
			const tag = raw_message.replace('约稿约稿', '')
			await https.get('https://api.wer.plus/api/aiw?pra='+tag,(res)=>{
				var json =''
				res.on('data',(d)=>{
					json+=d
				})
				res.on('end',()=>{
					var obj = JSON.parse(json)
					if(obj.msg.toString()=='access'){
						event.reply(['来啦来啦！\r\n',segment.image(obj.url.toString())],true)
					}else{
						event.reply([segment.text(json),'\n约稿失败，命令格式错误或接口过载。'],true)
					}
				})
			})
        }
    })
})

module.exports = {
    plugin
}