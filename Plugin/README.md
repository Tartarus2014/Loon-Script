插件 ：

（1）目前插件里面支持 ：[General],[rule],[rewrite],[host],[script],[mitm]

（2）插件是规则、复写、脚本的集合，相当于一个子配置，常常用来代表一个扩展功能。

（3）官方事例链接： https://nsloon.app/docs/Plugin/

使用方法：

操作流程：配置-插件-订阅插件



# Loon 插件示例

[
#!name = 插件名称
#!desc = 这是一个带有配置项的插件，input代表输入，select代表选择（select的第一项为名称，后面为可选值），用户所填或者选择的值都可以在脚本中用$persistentStore.read进行读取，如$persistentStore.read(appName)
#!author = 插件作者
#!homepage = 插件首页，可在插件页面进行跳转
#!icon = 插件的图标
#!input = appName
#!input = author
#!select = appType,tool,social,health,sport
#!select = price,0.99,1.99,4.99
#!system = iOS,iPadOS,tvOS,macOS
#!system_version = 15
#!loon_version = 3.2.1(372)
#!tag = 去广告,Youtube

[Argument]
arg1 = input,"default-placehodler-content",tag=参数1的标题,desc=这是一个输入参数的说明
arg2 = select,"select1","select2","select2",tag=参数2的标题,desc=这是一个选择类型的参数说明
arg3 = switch,true,tag=参数3的标题,desc=这是一个true、false的切换参数

[General]
bypass-tun =
skip-proxy =
real-ip =
dns-server =

[rule]

[rewrite]

[host]

[script]
http-response ^https?:\/\/example\.com\/conf\/server-mapping script-path = remove_ads.js, requires-body = true, tag = 移除广告,argument=[{arg1},{arg2},{arg3}]

[mitm]
example.com
]


# 注释参数

以[#!]开头可以添加注释

* #!name：插件名字
* #!desc：插件的功能描述等
* #!author：插件作者
* #!homepage：插件的主页
* #!icon：插件图标链接
* #!system：支持的系统版本，没有表示iOS、tvOS、macOS都支持，忽略大小写
* #!system_version：支持的最低系统版本，目前仅支持iOS，没有表示支持所有，如15.0
* #!loon_version：支持的loon的最低版本，格式为 3.2.1(733)，大版本+build版本号，没有表示支持所有
* #!tag：用作分类的标签


# [Argument]
声明插件中的脚本、复写使用的参数，会根据配置显示在插件的UI上面，具体配置格式如下：

 [参数变量名 = 类型,"参数值1","参数值2",tag=参数在UI上显示的名字,desc=参数在UI上显示详细介绍]

类型有以下三种：

* input：需要用户在UI界面输入的内容，后面的参数值为默认内容（参数值请使用双引号包裹），可以不设置
* select：需要用户选择的内容（每个可选值请使用双引号包裹），默认选择后续配置的第一个值
* switch：在UI上显示未一个切换开关，后面第一个参数值为默认配置，不设置默认false


# 参数使用说明

* 参数通过在脚本配置中[argument]参数进行传入，如[argument=[{arg1},{arg2},{arg3}]]，表示将这个三个参数全部传入脚本，脚本中通过变量[$argument.arg1]进行获取。
* cron类型的脚本，通过引用参数自定义cron，如[cron {arg1} script-path=https://example.com.run.js,timeout = 300,tag=自动运行,argument=[{arg2}]]，此处引用的参数如果cron格式异常，脚本将无法执行
* 通过引用参数控制脚本的启用和禁用，如[http-request ^https?:\/\/(www.)?(example)\.com script-path=localscript.js,tag = requestScript,requires-body = true,enable={arg1}]，此处引用的参数类型只能为switch，否则视为true


# 插件中规则的策略

插件内的规则指向的策略只能有如下三种，当规则不指定策略时，会默认使用DIRECT

1.DIRECT
2.REJECT类（REJECT，REJECT-IMG，REJECT-DICT，REJECT-ARRY，REJECT-DROP）
3.PROXY，代表用户在进行插件配置时手动选择的策略组，如果用户指定了PROXY，但插件却没有进行配置，那最终将按照无法找到策略组的逻辑进行处理（即使用App全局中第一个节点）