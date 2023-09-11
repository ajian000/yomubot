const { PupPlugin, segment, http } = require('@pupbot/core')
const { version, name } = require('./package.json')
const plugin = new PupPlugin(name.replace("pupbot-plugin-", ''), version)
const fs = require('fs')
const path = require('path')

let events = {
    num: 0,
    arr: [
        [0, 0, 0]
        // 事件名称
    ]
}

let seed = new Date().valueOf()

let cd_arr = []

plugin.onMounted(() => {

    // plugin.saveConfig(Object.assign(data_json, plugin.loadConfig()))
    // data_json = plugin.loadConfig()



    init()
    plugin.onAdminMatch(/^#[dD] ?reload$/, msg => {
        init()
        msg.reply("更新列表成功", true)
    })

    plugin.onMatch(/^#随机事件$/, msg => {
        // console.log(cd_arr)
        let qid = msg.sender.user_id
        let ans = findCD(qid)
        let DV = new Date().valueOf()
        if (ans != false) {
            msg.reply(ans.msg + `\nCD:${Math.floor((ans.time - DV) / 1000)}s`, true)
            return
        }
        let num = Math.floor(Math.random(seed) * events.num)
        // console.log("random => "+num)
        seed = num + new Date().getMilliseconds()
        let eve = find(num)
        cd_arr.push({
            qid,
            msg: eve[3],
            time: DV + eve[1] * 1000
        })
        setTimeout(clearCD, eve[1] * 1000, qid)
        msg.reply(eve[2] + `\nCD:${eve[1]}s`, true)
    })
})


// 列表初始化
function init() {
    events = {
        num: 0,
        arr: [
            [0, 0, 0]
            // 事件名称
        ]
    }
    // 加载基础事件 
    let str = fs.readFileSync(path.join(__dirname, './events.csv'), 'utf8')
    let s_arr = str.split("\r\n")
    s_arr.shift()
    s_arr.forEach(e => {
        if (/^,*$/.test(e)) return
        let se = e.split(',')
        events.num = events.num + eval(se[1])
        events.arr.push([events.num, eval(se[2]), se[3], se[4]])
    })
    // 加载捡起事件
    let pick = fs.readFileSync(path.join(__dirname, './pick.csv'), 'utf8')
    // console.log(pick)
    let pick_arr = pick.split("\r\n")
    // console.log(pick_arr)
    pick_arr.shift()
    pick_arr.forEach(elem => {
        // console.log(elem)
        if (/^,*$/.test(elem)) return
        let marr = elem.split(",")
        // console.log(marr)
        for (let i = 1; i <= 5; i++) {
            if (marr[i * 2] == "" && marr[i * 2 - 1] == "") return
            // 捡东西默认cd10，概率100
            events.num += 100
            events.arr.push([events.num, 10, `你捡到${marr[0]}${(marr[i * 2 - 1] == "") ? "" : "，" + marr[i * 2 - 1]}`, marr[i * 2]])
        }

    })


    // console.log(events.arr)
}

// 查找事件
function find(num) {
    // console.log("随机数：" + num)
    // console.log(events.arr)
    for (let i = 1; i < events.arr.length; i++) {
        if (events.arr[i - 1][0] <= num && events.arr[i][0] > num) {
            console.log(events.arr[i])
            return events.arr[i]
        }
    }

}


// 清除对应QQ号的cd
function clearCD(qid) {
    let n = cd_arr.findIndex(e => { return e.qid === qid })
    if (n == -1) { return false }
    cd_arr.splice(n, 1)
    return true
}


// 查询cd
function findCD(qid) {
    let n = cd_arr.findIndex(e => { return e.qid === qid })
    if (n == -1) { return false }
    return cd_arr[n]
}

module.exports = { plugin }