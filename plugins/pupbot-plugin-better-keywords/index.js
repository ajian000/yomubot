const { PupPlugin, PluginDataDir } = require('@pupbot/core')
const { segment } = require("oicq")
const path = require('path')
const { name, version } = require('./package.json')
const docx = require('./docs/docs.json')
const fs = require('node:fs')

function getPluginName(nameFromPackageJson) {
    _arr = nameFromPackageJson.split('-')
    _arr = _arr.slice(2, _arr.length)
    return _arr.join("-")
}

const plugin = new PupPlugin(getPluginName(name), version);

const config = {
    "keywords": {
        "groups": {},
        "global-g": {},
        "global-f": {},
        "global": {}
    },
}

const defaultConfig = JSON.parse(JSON.stringify(config))
const permissonType = {
    'default': {
        'code': 0,
        'msg': '当前群聊'
    },
    'g': {
        'code': 1,
        'msg': '所有群聊'
    },
    'gf': {
        'code': 2,
        'msg': '所有群聊和私信'
    },
    'f': {
        'code': 3,
        'msg': '所有私信'
    }
}
const valueTypes = {
    'default': {
        'code': 'text',
        'msg': '仅文本'
    },
    'text': {
        'code': 'text',
        'msg': '仅文本'
    },

    'codefile': {
        'code': 'codeFile',
        'msg': 'js脚本文件'
    },
    'jsfile': {
        'code': 'codeFile',
        'msg': 'js脚本文件'
    },
    'f': {
        'code': 'codeFile',
        'msg': 'js脚本文件'
    },
    'jsf': {
        'code': 'codeFile',
        'msg': 'js脚本文件'
    },

    // 'js': {
    //     'code': 'code',
    //     'msg': 'js代码块'
    // },
    // 'code': {
    //     'code': 'code',
    //     'msg': 'js代码块'
    // }
}
const privateTypes = {
    'img': '仅图片',
    'oicq': 'oicq支持的所有内容'
}
const imgSuffix = ['.png', '.jpg', '.jepg', '.bmp', '.gif', '.webp']
const urlHearders = ['http://', 'https://', 'file://']
    // const videoSuffix = ['.mp4']


function isAdmin(event, mainOnly = false) {
    if (mainOnly) {
        return plugin.admins[0] === event.sender.user_id;
    } else {
        return plugin.admins.includes(event.sender.user_id);
    }
}

function sleep(ms) {
    const start = new Date().getTime()
    while (true) {
        if (new Date().getTime() - start > ms) {
            return
        }
    }
}

function fromatDoxs(string, docs) {
    return `${docx.commands.bkw.header.replace('${plugin.name}', plugin.name)}
${string.replace('${plugin.name}', plugin.name)}`
}

function reloadDocx() {
    delete require.cache[require.resolve('./docs/docs.json')] // 清除缓存
    const docx = require('./docs/docs.json') // 重新加载
}

function isAsyncFunc(func) {
    if (typeof func === "function") {
        try {
            return func[Symbol.toStringTag] === "AsyncFunction"
        } catch (_e) {
            console.log(_e.stack)
            return null
        }
    } else {
        return null
    }
}

function isJsonObject(_obj) {
    try {
        if (typeof JSON.stringify(_obj) === "string") {
            return true;
        }
    } catch (e) {}
    return false;
}

async function hooker(event, params, plugin, func, args) {
    /**
     * 本函数用于hook错误, 在发生错误时发送错误信息到qq
     */
    try {
        await func(event, params, plugin, args)
    } catch (error) {
        try {
            var funcname = func.name
        } catch (err) {
            var funcname = undefined
        }
        const msg = `〓 糟糕！${plugin.name}运行"${funcname}"发生错误, 请您坐和放宽, 下面是详细错误信息(好东西就要莱纳~) 〓\n${error.stack}\n(如有需要请发送邮件至开发者 public.zhuhansan666@outlook.com 备注 ${plugin.name}:bug)`
        event.reply(msg)
        plugin.logger.error(error)
    }
}

function startWithInArr(string, arr) {
    for (_item of arr) {
        if (string.slice(0, _item.length) == _item) {
            return true
        }
    }
    return false
}

function endWithInArr(string, arr, length = null) {
    length = length == null ? string.length : length
    for (_item of arr) {
        if (string.slice(length - _item.length, length) == _item) {
            return true
        }
    }
    return false
}

function addKeyword(name, value, type, event, valueType = 'text') {
    /** 增加Keyword
     * @param name 名称(keyword)
     * @param value 内容
     * @param type 类型, 数字, 0 -> 当前群聊, 1 -> 所有群聊, 2 -> 所有群聊和私信, 3 -> 所有私信 (详见permissonType)
     * @param event 群聊消息
     * @param valueType 回复类型: text -> 仅文本, codeFile -> js文件(自动加载并调用main函数, 将函数返回值作为内容)
     */
    valueJson = { value: value, type: valueType } // 主Json
    if (endWithInArr(value, imgSuffix)) { // 如果是以图片后缀结尾的字符
        if (startWithInArr(value, urlHearders)) { //如果是 url 或 file:// 本地url 且 文件存在(自动识别相对/绝对路径)
            if (value.slice(0, 'file://'.length) == 'file://') { // 如果是本地url
                if (fs.existsSync(path.isAbsolute(value.replace('file://', '')) ? value.replace('file://', '') : path.join(path.join(PluginDataDir, "../../"), value.replace('file://', '')))) { // 检查文件是否存在
                    valueJson.type = 'img' // 更改valueType
                } else {
                    event.reply(docx.commands.bkw.warning.replace('${errorStr}', `疑似图片本地url警告: ${value.replace('file://', '')} 不存在, 已使用默认模式↓`), true)
                }
            } else { // 其余url看作全部是正常的, 反正下面发送的地方有处理
                valueJson.type = 'img'
            }
        } else if (fs.existsSync(path.isAbsolute(value) ? value : path.join(path.join(PluginDataDir, "../../"), value))) { // 如果其路径存在(本地文件)(自动识别相对/绝对路径)
            valueJson.type = 'img' // 更改valueType
            valueJson.value = `file://${value}` // 设置为 file:// 路径
        } else {
            event.reply(docx.commands.bkw.warning.replace('${errorStr}', `疑似图片路径 ${value} 不存在, 已使用默认模式↓`), true)
        }
    }
    if (event.message_type == 'group') {
        if (type == 0) {
            if (config.keywords.groups[event.group_id] == undefined) {
                config.keywords.groups[event.group_id] = {}
            }
            config.keywords.groups[event.group_id][name] = valueJson
        }
    } else if (type == 0) { // 在私添加加当前群聊
        return [false, '私聊无法添加仅限当前群聊项']
    }

    if (type == 1) {
        config.keywords['global-g'][name] = valueJson
    } else if (type == 2) {
        config.keywords.global[name] = valueJson
    } else if (type == 3) {
        config.keywords['global-f'][name] = valueJson
    }
    return [true, valueTypes[valueJson.type] != undefined ? valueTypes[valueJson.type].msg : privateTypes[valueJson.type]]
}

function rmKeyword(name, type, event) {
    /** 删除Keyword
     * @param name 名称(keyword)
     * @param info 内容
     * @param type 类型, 数字, 0 -> 当前群聊, 1 -> 所有群聊, 2 -> 所有群聊和私信, 3 -> 所有私信 (详见permissonType)
     * @param event 群聊消息
     */
    if (event.message_type == 'group') {
        if (type == 0) {
            if (config.keywords.groups[event.group_id] == undefined) {
                return [true, '']
            }
            delete config.keywords.groups[event.group_id][name]
            if (JSON.stringify(config.keywords.groups[event.group_id]) == '{}') { // 如果内容为空删除群号子项
                delete config.keywords.groups[event.group_id]
            }
        }
    } else if (type == 0) { // 在私删除加当前群聊
        return [false, '私聊无法删除仅限当前群聊项']
    }

    if (type == 1) {
        delete config.keywords['global-g'][name]
    } else if (type == 2) {
        delete config.keywords.global[name]
    } else if (type == 3) {
        delete config.keywords['global-f'][name]
    }
    return [true, '']
}

// function mergeArr(_arr, sep = ' ') {
//     _result = ''
//     for (_item of _arr) {
//         if (_result.length > 0) {
//             _result = `${_result}${sep}${_item}`
//         } else {
//             _result = _item
//         }
//     }
//     return _result
// }

async function bkwMain(event, params, plugin) {
    // reloadDocx()

    if (params[0] == 'about') { // about关键字代表关于
        about(event, params, plugin) // 调用函数
        return
    }

    if (isAdmin(event, true)) {
        if (params[0] != undefined) {

            // 首位参数处理
            if (params[0] == 'help') { // 帮助
                event.reply(fromatDoxs(docx.commands.bkw.help, docx))
            } else if (params[0] == 'add') { // 增加
                keyword = params[1]
                info = params[2]
                scope = params[3]
                valueType = permissonType[scope] != undefined ? params[4] : params[3] // 如果scope不在权限组json中即视为valueType

                if (keyword != undefined && info != undefined) { // keyword和info都存在
                    if (scope == undefined) {
                        scope = 'default' // 加空设置为默认
                    } else {
                        scope = scope.toLowerCase()
                    }
                    if (valueType == undefined) {
                        valueType = 'default'
                    } else {
                        valueType = valueType.toLowerCase()
                    }

                    if (permissonType[scope] != undefined) { // 权限组正确
                        typeCode = permissonType[scope].code
                    } else if (valueType == undefined) { // 权限组错误
                        event.reply(fromatDoxs(docx.commands.bkw.warning, docx).replace('${errorStr}', `未知的权限组: ${scope}, 已设置为默认权限组: ${permissonType.default.msg}`), true) // 提示
                        scope = 'default'
                        typeCode = permissonType[scope].code // 设为默认
                    } else {
                        scope = 'default'
                        typeCode = permissonType[scope].code
                    }

                    if (valueTypes[valueType] != undefined) { // 回复类型正确
                        valueTypeEncoded = valueTypes[valueType].code
                            // if (valueTypeEncoded == 'code') { // 如果是代码块
                            //     info 
                            // }
                    } else { // 恢复类型错误
                        event.reply(fromatDoxs(docx.commands.bkw.warning, docx).replace('${errorStr}', `未知的回复类型: ${valueType}, 已设置为默认回复类型: ${valueTypes.default.msg}`), true) // 提示
                        valueType = 'default'
                        valueTypeEncoded = valueTypes[valueType].code // 设为默认
                    }

                    returnArr = addKeyword(keyword, info, typeCode, event, valueTypeEncoded) // 调用增加函数

                    if (!returnArr[0]) { // 返回值[0]为false代表出现问题
                        event.reply(fromatDoxs(docx.commands.bkw.error, docx).replace('${errorStr}', returnArr[1]), true) // 发送错误信息
                        sleep(docx.delay)
                        event.reply(fromatDoxs(docx.commands.bkw.help, docx)) // 发送帮助内容
                    } else { // 返回值[0]为true代表成功操作
                        replyType = returnArr[1]
                        event.reply(fromatDoxs(docx.commands.bkw.addSuccess, docx).replace('${keyname}', keyword).replace('${permissonGroup}', permissonType[scope].msg).replace('${replyType}', replyType), true) // 发送成功信息
                        plugin.saveConfig(config) // 保存配置
                    }
                } else { // 否则指令语法错误
                    event.reply(fromatDoxs(docx.commands.bkw.error, docx).replace('${errorStr}', `${keyword == undefined ? 'keyword' : info == undefined ? 'info' : 'valueType'}参数为空`), true) // 发送错误信息
                    sleep(docx.delay)
                    event.reply(fromatDoxs(docx.commands.bkw.help, docx)) // 发送帮助内容
                }
            } else if (params[0] == 'rm') { // 删除
                keyword = params[1]
                scope = params[2]
                if (keyword != undefined) { // keyword存在
                    if (scope == undefined) {
                        scope = 'default' // 加空设置为默认
                    }
                    if (permissonType[scope] != undefined) { // 权限组正确
                        typeCode = permissonType[scope].code
                    } else { // 权限组错误
                        scope = 'default'
                        typeCode = 0 // 设置为默认
                        event.reply(fromatDoxs(docx.commands.bkw.warning, docx).replace('${errorStr}', `未知的权限组: ${scope}, 已设置为默认权限组: ${permissonType.default.msg}`), true) // 提示
                    }
                    returnArr = rmKeyword(keyword, typeCode, event) // 调用删除函数
                    if (!returnArr[0]) { // 返回值[0]为false代表出现问题
                        event.reply(fromatDoxs(docx.commands.bkw.error, docx).replace('${errorStr}', returnArr[1]), true) // 发送错误信息
                        sleep(docx.delay)
                        event.reply(fromatDoxs(docx.commands.bkw.help, docx)) // 发送帮助内容
                    } else { // 返回值[0]为true代表成功操作
                        event.reply(fromatDoxs(docx.commands.bkw.rmSuccess, docx).replace('${keyname}', keyword).replace('${permissonGroup}', permissonType[scope].msg), true) // 发送成功信息
                        plugin.saveConfig(config) // 保存配置
                    }
                } else { // 否则指令语法错误
                    event.reply(fromatDoxs(docx.commands.bkw.error, docx).replace('${errorStr}', "keyword参数为空"), true) // 发送错误信息
                    sleep(docx.delay)
                    event.reply(fromatDoxs(docx.commands.bkw.help, docx)) // 发送帮助内容
                }

            } else {
                event.reply(fromatDoxs(docx.commands.bkw.error, docx).replace('${errorStr}', `未知的首个参数 "${params[0]}"`), true) // 首个参数(add/rm之类的)错误
                sleep(docx.delay)
                event.reply(fromatDoxs(docx.commands.bkw.help, docx)) // 发送帮助内容
            }
            // 首位参数处理结束

        } else { // 没有首个参数直接显示帮助信息
            // event.reply(fromatDoxs(docx.commands.bkw.error, docx).replace('${errorStr}', "首个参数为空"), true)
            // sleep(docx.delay)
            event.reply(fromatDoxs(docx.commands.bkw.help, docx)) // 发送帮助内容
        }
    } else {
        event.reply(fromatDoxs(docx.commands.bkw.noPermisson, docx), true) // 发送权限错误
    }
}

async function replyValue(value, event) {
    if (value == undefined) { // 如果是未定义直接返回
        return
    } else if (typeof value == 'string') { // 如果是旧版存储方式(为string)直接发送
        event.reply(value.toString())
    } else if (value.type == 'img') { // 如果是图片发送图片
        if (fs.existsSync(value.value.replace("file://", ''))) { // 如果文件存在
            // event.reply('图片发送较慢, 请耐心等待~')
            try {
                _image = segment.image(value.value)
                event.reply(_image)
            } catch (error) {
                event.reply(docx.commands.bkw.error.replace('${errorStr}', `发送图片错误: ${error.stack}`))
            }
        } else {
            event.reply(docx.commands.bkw.error.replace('${errorStr}', `发送图片失败: ${value.value.replace('file://', '')} 不存在`), true)
        }
    } else if (value.type == 'text') { //如果新版且是msg直接发送
        event.reply(value.value.toString())
    } else if (value.type == 'codeFile') { // 如果是脚本文件调用main函数并发送返回值
        try {
            _path = path.join(path.join(PluginDataDir, "../../"), value.value) // 获取模块绝对路径
            const _tmp = require(_path) // 载入模块
            _isAsyncFunc = isAsyncFunc(_tmp.main)
            if (_isAsyncFunc === true) { // 是异步函数
                result = await _tmp.main(event, plugin) // 异步调用main方法并获取返回值
            } else if (_isAsyncFunc === false) { // 不是异步函数
                result = _tmp.main(event, plugin) // 同步调用main方法并获取返回值
            } else { // 发生错误(返回值为null)
                err = new Error(`错误: main 不是一个函数`)
                plugin.logger.error(err)
                throw err
            }
            // event.reply(result) // 发送内容(支持 oicq 的 segment)

            delete require.cache[require.resolve(_path)] // 清除模块缓存
            delete _tmp // 清除模块
            if (result === undefined) { // 返回值为undefined直接退出调用
                return
            }
            if (!isJsonObject(result)) { // 如果不是obj, 直接throw 到上级hooker 函数显示到qq
                err = new Error(`函数返回值错误, 应为 { "value": <返回内容>, "type": <返回类型> }, 而非 ${result}\nat main (${_path})`)
                plugin.logger.error(err)
                throw err
            }
            if (result.type != "codeFile") { // 返回值合法
                replyValue(result.value, result.type) // 回调
            } else { // 如果发送的类型任然是codeFile, 直接throw 到上级hooker 函数显示到qq, 避免循环调用
                err = new Error(`函数返回值错误, { "value": <返回内容>, "type": <返回类型> } 的 <返回类型> 不应为 codeFile 以免造成循环调用\nat main (${_path})`)
                plugin.logger.error(err)
                throw err
            }
        } catch (error) { // 直接throw 到上级hooker 函数显示到qq
            plugin.logger.error(error)
            throw error
        }
    } else if (value.type == 'oicq') { // oicq模式, 支持所有oicq内容
        event.reply(value.value) // 直接发送, 不转string
    } else { // 直接throw 到上级hooker 函数显示到qq
        err = new Error(`不受支持的 value.type: ${value.type}`)
        plugin.logger.error(err)
        throw err
    }
}

async function listener(event, param, plugin, _message = null) {
    message = _message == null ? event.raw_message.toString() : _message
    if (event.message_type == 'group') { // 群聊
        gid = event.group_id
        value = undefined
            // 优先从当前群聊发送内容
        keywordsGroups = config.keywords.groups[gid]
        if (keywordsGroups != undefined) {
            value = keywordsGroups[message]
            if (value != undefined) {
                await replyValue(value, event)
                return
            }
        }
        delete keywordsGroups, value

        // 找不到再优先从全局群聊寻找
        keywordsGlobalGroups = config.keywords['global-g']
        if (keywordsGlobalGroups != undefined) {
            value = keywordsGlobalGroups[message]
            if (value != undefined) {
                await replyValue(value, event)
                return
            }
            delete keywordsGlobalGroups, value
        }

        // 最后在全部群聊和私聊寻找
        keywordsGlobalAll = config.keywords.global
        if (keywordsGlobalAll != undefined) {
            value = keywordsGlobalAll[message]
            if (value != undefined) {
                await replyValue(value, event)

            }
            delete keywordsGlobalAll, value

        }
    } else { // 私聊
        // uid = event.sender.user_id
        keywordsGlobalFriends = config.keywords['global-f']
        if (keywordsGlobalFriends != undefined) {
            value = keywordsGlobalFriends[message]
                // 优先从全局的私聊寻找
            if (value != undefined) {
                await replyValue(value, event)
                return
            }
            delete keywordsGlobalFriends, value
        }

        keywordsGlobalAll = config.keywords.global
            // 最后在全部群聊和私聊寻找
        if (keywordsGlobalAll != undefined) {
            value = keywordsGlobalAll[message]
            if (value != undefined) {
                await replyValue(value, event)
                return
            }
            delete keywordsGlobalAll, value
        }
        // 如果还是找不到就找以空格分割的首个内容(命令头)
        if (_message == null) {
            await listener(event, param, plugin, message.split(' ')[0])
        }
    }
}

function about(event, param, plugin) { // about内容
    // reloadDocx()
    event.reply(fromatDoxs(docx.about, docx).replace('${plugin.name}', plugin.name).replace('${plugin.version}', plugin.version))
}

plugin.onMounted(() => {
    plugin.saveConfig(Object.assign(config, plugin.loadConfig())) // 加载配置文件
    plugin.onCmd("/bkw", (event, params) => hooker(event, params, plugin, bkwMain)) // 用于配置的命令
    plugin.on('message', (event, params) => hooker(event, params, plugin, listener)) // 监听者
    plugin.onCmd(['/bkwabout', '#bkwabout'], (event, params) => hooker(event, params, plugin, about)) // about
})

module.exports = { plugin }