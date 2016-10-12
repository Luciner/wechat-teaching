# Teaching System using WeChat


##dependencies

* express: ^4.14.0,
* request: ^2.75.0,
* socket.io: ^1.5.0,
* wechat-enterprise: ^0.1.1

##completed

* `saveToken()`获取`access_token`并保存为access_token.txt
* `refreshToken()`每7000秒刷新一次`access_token`
* 微信自动回复
* `statisticsNsp`中事件: `init-data`, `make-options`, `redraw`, `clear-data`
* `overviewNsp`中事件: `get-overview`
* `getCorpApp()`获取企业号应用信息
* `sendText(test)`推送文本消息
* `sendOptions()`推送选择页面

##unfinished

* 模块化
* 登录用户信息显示
* 仅限`老师`部门进入后台管理系统
* 存储学生答题结果
* ES6

##log

Oct 10, 2016

* 修改`getCorpApp()`, `sendText(test)`, `sendOptions()`,解决`access_token`未刷新的问题
* 修改`getCorpApp()`, `sendText(test)`, `sendOptions()`发送对象为@all

Oct 12, 2016

* 将`vue.js`下载至`public`目录以加快页面加载速度
