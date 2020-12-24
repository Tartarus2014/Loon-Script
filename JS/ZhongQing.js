# 中青看点
# 签到cookie:
# 进入app，进入任务中心或者签到一次
# 阅读请求body&阅读时长:
# 阅读一篇文章或者视频到获取金币奖励
# 惊喜红包:
# 在阅读文章拉下面有个惊喜红包，点击获取

# 手动执行一次定时脚本-”中青看点极速版”,看签到是不是正常
# 阅读请求body:阅读一篇文章或者视频到获取金币奖励,通知提示body1

# 手动执行一次定时脚本-”中青阅读”,是不是运行正常
# 获取更多的body,一天一般上限7200金币,建议获取200个body


http-request https:\/\/\w+\.youth\.cn\/TaskCenter\/(sign|getSign) script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js, tag=中青看点极速版
http-request https:\/\/ios\.baertt\.com\/v5\/article\/complete script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js, requires-body=true, tag=中青看点极速版
http-request https:\/\/ios\.baertt\.com\/v5\/article\/red_packet script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js, requires-body=true, tag=中青看点极速版
http-request https:\/\/ios\.baertt\.com\/v5\/user\/app_stay\.json script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js, requires-body=true, tag=中青看点极速版


http-request https://ios.baertt.com/v5/article/complete.json script-path=https://raw.githubusercontent.com/songyangzz/QuantumultX/master/zqgetbody.js, requires-body=true, tag=中青body(用此脚本需关闭其他四条中青）


cron "*/30 0-23 * * *" script-path=https://raw.githubusercontent.com/CenBoMin/QuantumultX/master/Scripts/Youth/youth.js, tag=中青看点极速版
cron "10 1-23 * * *" script-path=https://raw.githubusercontent.com/CenBoMin/QuantumultX/master/Scripts/Youth/Youth_AutoRead.js, tag=中青阅读


hostname = *.youth.cn, ios.baertt.com 

