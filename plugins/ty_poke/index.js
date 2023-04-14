const { PupPlugin, segment, http } = require('@pupbot/core')
const { version } = require('./package.json')
const plugin = new PupPlugin('ty_poke', version)


// 定义群列表
let QQListPb = []
// 定义参数
const poke_config = {
    // 生气所需要的次数 
    angry_num: 3,
    // 被戳的文案
    poke_List: ["别戳我啦", "再戳生气了嗷！", "你还戳?!", "no!", "😠", "我生气了，哼！"],
    // 生气文案
    angry_answer: "...",
    // 最多连续回复戳一戳次数,设置为0则不会受限
    max_answer: 3,
    // 消气速度
    anger_duration: 20000,
}


//插件被启用调用函数
plugin.onMounted(() => {
    if (poke_config.max_answer > 0) {
        plugin.onGroupMessage(msg => {
            var thisid = msg.group_id
            var num = QQListPb.findIndex((e) => {
                return e.disid == thisid
            })
            if (num != -1) {
                if (QQListPb[num].msg_num > 3) {
                    QQListPb[num].msg_num -= 3
                } else {
                    QQListPb[num].msg_num = 0
                }
            }
        })
    }

    // 接收戳一戳
    plugin.on("notice.group.poke", function (msg) {
        if (msg.target_id === plugin.bot.uin) {
            // 查询群序号
            let num_ = QQListPb.findIndex((e) => {
                return e.disid == msg.group_id
            })

            // 是否有记录
            if (num_ == -1) {
                num_ = QQListPb.push({ disid: msg.group_id, msg_num: 1, poke_num: 0 })
            }
            else {
                if (QQListPb[num_].msg_num > poke_config.max_answer && poke_config.max_answer > 0) {
                    // 为了防止刷群，机器人连续回复多次后不再回复
                    return
                } else {
                    QQListPb[num_].msg_num++
                }
            }

            // 已经生气
            if (QQListPb[num_].poke_num > poke_config.angry_num) {
            //    msg.group.sendMsg(poke_config.angry_answer)
            }
            // 未生气
            else {
                msg.group.sendMsg(poke_config.poke_List[QQListPb[num_].poke_num])
                QQListPb[num_].poke_num++
            }


            // 设置消气函数
            clearInterval(QQListPb[num_].sett)
            QQListPb[num_].sett = setInterval((group_id) => {
                QQListPb.some(element => {
                    if (element.disid == group_id) {
                        if (element.poke_num > 0) {
                            element.poke_num--
                            return true
                        } else {
                            clearInterval(element.sett)
                        }

                    }
                })
            }, poke_config.anger_duration, msg.group_id)



        }
    })
})



module.exports = { plugin }