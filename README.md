1. 本[插件](https://gitee.com/peacake/qq-qun-manage)旨在方便用户批量导出QQ群成员(基于Promise)
2. 安装npm i qq-qun-manage
3. 使用 
        ``` 
        const qqGroupManage = require('qq-qun-manage');
            qqGroupManage.qqGroupInit('cookie').then(async res=>{  
            await qqGroupManage.getMyInfo();
        }) 
        ```
4. 一定要先登录[QQ群](https://qun.qq.com/)获取到cookie，然后在执行`qqGroupInit(cookie)`,再调用其他方法
    1. cookie如何获取？
        chrome浏览器，登录qq群成功之后，F12 > 切换到console > 输入 `document.cookie` > Enter 即可


* 还有很多待完善的地方，大家多多[指点](https://gitee.com/peacake/qq-qun-manage/issues)！