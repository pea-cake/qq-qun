var request = require("request")
var fs = require('fs')
let cookie = '' // QQ群用户cookie
let bkn = '' // QQ群核心密钥，通过cookie传入getBkn计算得来

/**
 * 初始化本插件，传入qq群登陆后的cookie
 * @param {*} cookie 
 */
const qqGroupInit = async function (QQcookie) {
    bkn = await getBkn(QQcookie)
    cookie = QQcookie
    return new Promise((resolve,reject) => {
        getMyInfo().then(res=>{
            if(res.uin){
                console.log('初始化成功，欢迎您,'+res.nickName+'！')
                resolve(bkn)
            }else{
                console.log('初始化失败，请检查cookie是否正确！')
                reject('初始化失败')
            }
        })
    })

}

/**
 * 获取btn
 * 
 * qq群管理重要参数，相当于密钥
 */
const getBkn = function (cookie) {
    return new Promise((resolve, reject) => {
        try {
            cookie.split(';').forEach(item => {
                let skey = item.split('=')[0].trim()
                if (skey === 'skey') {
                    let e = item.split('=')[1].trim()
                    let t;
                    for (t = 5381, r = 0, n = e.length; r < n; ++r) {
                        t += (t << 5) + e.charAt(r).charCodeAt();
                    }
                    let bkn = 2147483647 & t
                    resolve(bkn)
                }
            })
            resolve('')
        } catch{
            resolve('')
        }
    })
}


/**
 * 获取当前用户信息
 * qq号和昵称
 */
const getMyInfo = function () {
    return new Promise((resolve, reject) => {
        request({
            url: "https://qun.qq.com/cgi-bin/qunwelcome/myinfo?callback=?&bkn=" + bkn,
            method: 'POST',
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36",
                "X-Requested-With": "XMLHttpRequest",
                "Cookie": cookie
            },
        },
            function (error, response, body) {
                resolve(JSON.parse(body).data || null)
            })
    })
}


/**
 * 获取所有好友，分组
 */
const getFriends = function () {
    return new Promise((resolve, reject) => {
        request({
            url: "https://qun.qq.com/cgi-bin/qun_mgr/get_friend_list",
            method: 'POST',
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36",
                "X-Requested-With": "XMLHttpRequest",
                "Cookie": cookie
            },
            qs: {
                "bkn": bkn,
            }
        },
            function (error, response, body) {
                // console.log(JSON.parse(body).join)
                resolve(JSON.parse(body).result || [])
            })
    })
}


/**
 * 获取当前用户的群列表
 */
const getGroups = function () {
    return new Promise((resolve, reject) => {
        request({
            url: "https://qun.qq.com/cgi-bin/qun_mgr/get_group_list",
            method: 'POST',
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36",
                "X-Requested-With": "XMLHttpRequest",
                "Cookie": cookie
            },
            qs: {
                "bkn": bkn,
            }
        },
            function (error, response, body) {
                console.log(JSON.parse(body))
                resolve(JSON.parse(body).join || [])
            })
    })
}



/**
 * 	获取单个群的总成员数量
 */
const getCount = function (qqGroupNum) {
    return new Promise((resolve, reject) => {
        request({
            url: "https://qun.qq.com/cgi-bin/qun_mgr/search_group_members",
            method: 'POST',
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36",
                "X-Requested-With": "XMLHttpRequest",
                "Cookie": cookie
            },
            qs: {
                "gc": qqGroupNum, // QQ群号码
                "st": "0",
                "end": "20",
                "sort": "0",
                "bkn": bkn,
            }
        },
            function (error, response, body) {
                console.log('该群一共' + JSON.parse(body).count + '成员')
                resolve(JSON.parse(body).count || 0)
            })
    })
}

/**
 * 
 * @param {*} qqGroupNum qq群号码
 * @param {*} st 页码 
 */
const getQQNumbersOnePage = function (qqGroupNum, st) {
    return new Promise((resolve, reject) => {
        request({
            url: "https://qun.qq.com/cgi-bin/qun_mgr/search_group_members",
            method: 'POST',
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36",
                "X-Requested-With": "XMLHttpRequest",
                "Cookie": cookie
            },
            qs: {
                "gc": qqGroupNum, // QQ群号码
                "st": st,
                "end": st - 1 + 41,
                "sort": "0",
                "bkn": bkn,
            }
        },
            function (error, response, body) {
                resolve(JSON.parse(body).mems)
            })
    })
}

/**
 * 通过qq群号码获取该QQ群下的所有用户
 */
const getQQNumbersByGroupNum = function (groupNum) {
    return new Promise( async (resolve, reject) => {
        let count = await getCount(groupNum);
        let dataStr = [];
        for (let i = 0; i < count; i = i + 40) {
            let newStr = await getQQNumbersOnePage(groupNum, i)
            dataStr = dataStr.concat(newStr)
        }
        resolve(dataStr)
    })

}

/**
 * 循环获取所有群的组员，并保存json文件
 *  
 */
const getAllGroupQQNumbers = async function () {
    const groups = await getGroups()
    groups.forEach(async (group) => {
        const resStr = await getQQNumbersByGroupNum(group.gc)
        await saveFile(group.gn + '(' + group.gc + ')群成员', resStr)
    })
}

/**
 * 保存文件方法
 * @param {*} fileName 文件路径以及名字
 * @param {*} text 文件内容
 */
const saveFile = function (fileName, text) {
    return new Promise((resolve, rejectF) => {
        console.log("准备写入文件" + fileName);
        fs.writeFile(fileName + '.json', text, function (err) {
            if (err) {
                console.error(err)
                reject(err)
            } else {
                console.log(fileName + "数据写入成功！");
                resolve('res')
            }

        });
    })
}



module.exports = {
    qqGroupInit,
    getMyInfo,
    getFriends,
    getGroups,
    getQQNumbersByGroupNum,
    getAllGroupQQNumbers,
    saveFile
}