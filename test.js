// 使用demo
const QQGROUP = require('./index.js')
const { getAllGroupQQNumbers } = require('./index.js')
const cookie = 'pgv_pvi=9052552192; pgv_pvid=4517038452; RK=/l74vqNXbq; ptcz=ddf52cec635083d1a98a671aa65a8a6aec02e64d99b0bc01aadf44a8b84b72d9; pac_uid=0_3f806c4d396f2; iip=0; _qpsvr_localtk=0.8790058520319881; pgv_si=s5324088320; uin=o2078172854; p_uin=o2078172854; traceid=ce625d5c4c; skey=@wL1C9Xqlo; pt4_token=DWZ6sMsRuetylmpWZd8eEWAYi-HXdCIDYvQxkCK8VOM_; p_skey=VB0qYeF1KJvb0Ifiphyx3yGzaqy0-cfn*kwvDVLZ8Yc_'
async  function main (){
    res = await QQGROUP.qqGroupInit(cookie)
    if(res){
        // 初始化成功后
        const groups = await QQGROUP.getGroups() //获取群组列表
        // let res2 = await QQGROUP.getQQNumbersByGroupNum(groups[0].gc) // 通过群号（gc）获取某个群的所有成员
        // console.log(res2)
        // await getAllGroupQQNumbers() // 获取所有组的所有成员，群组太多时导出容易被QQ群检测到，后边继续优化
    }
}
main()
