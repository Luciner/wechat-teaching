# Teaching System using WeChat


##dependencies

* express: ^4.14.0,
* request: ^2.75.0,
* socket.io: ^1.5.0,
* wechat-enterprise: ^0.1.1

##completed

* saveToken()获取access_token并保存为access_token.txt
* refreshToken()每7000秒刷新一次access_token
* 微信自动回复
* `statisticsNsp`中事件: `init-data`, `make-options`, `redraw`, `clear-data`
* `overviewNsp`中事件: `get-overview`
* getCorpApp()获取企业号应用信息
* sendText(test)推送文本消息
* sendOptions()推送选择页面

##unfinished

* 模块化
* 登录用户信息显示
* 仅限`老师`部门进入后台管理系统
* 存储学生答题结果
* ES6