// 使用demo
const QQGROUP = require('./index.js')
const cookie = '你的qq群cookie'
async  function main (){
    const res = await QQGROUP.qqGroupInit(cookie)
    if(res){
        // 初始化成功后
        const groups = await QQGROUP.getGroups() //获取群组列表
        // let res2 = await QQGROUP.getQQNumbersByGroupNum(groups[0].gc) // 通过群号（gc）获取某个群的所有成员
        // console.log(res2)
    }
}
main()
