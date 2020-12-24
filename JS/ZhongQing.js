http-request https:\/\/\w+\.youth\.cn\/TaskCenter\/(sign|getSign) script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js
http-request https:\/\/ios\.baertt\.com\/v5\/article\/complete script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js, requires-body=true
http-request https:\/\/ios\.baertt\.com\/v5\/article\/red_packet script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js, requires-body=true
http-request https:\/\/ios\.baertt\.com\/v5\/user\/app_stay\.json script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js, requires-body=true


http-request https://ios.baertt.com/v5/article/complete.json script-path=https://raw.githubusercontent.com/songyangzz/QuantumultX/master/zqgetbody.js, requires-body=true, tag=中青body(用此脚本需关闭其他四条中青）


cron "*/30 0-23 * * *" script-path=https://raw.githubusercontent.com/CenBoMin/QuantumultX/master/Scripts/Youth/youth.js, tag=中青看点极速版
cron "10 1-23 * * *" script-path=https://raw.githubusercontent.com/CenBoMin/QuantumultX/master/Scripts/Youth/Youth_AutoRead.js, tag=中青阅读

hostname = *.youth.cn, ios.baertt.com 

