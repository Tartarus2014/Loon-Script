
if (typeof $response === 'undefined' || !$response) {
    var reqHeaders = $request.headers || {};
    var keysToDelete = ['If-None-Match', 'If-Modified-Since', 'if-none-match', 'if-modified-since', 'IF-NONE-MATCH', 'IF-MODIFIED-SINCE'];
    for (var i = 0; i < keysToDelete.length; i++) {
        if (reqHeaders[keysToDelete[i]]) {
            delete reqHeaders[keysToDelete[i]];
        }
    }
    for (var k in reqHeaders) {
        if (k.toLowerCase() === 'if-none-match' || k.toLowerCase() === 'if-modified-since') {
            delete reqHeaders[k];
        }
    }
    reqHeaders['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    reqHeaders['Pragma'] = 'no-cache';
    reqHeaders['Expires'] = '0';
    
    // 特殊处理视频相关API请求头
    if ($request.url.indexOf('/api/app/vid/') !== -1) {
        console.log('处理视频API请求:', $request.url);
        // 视频API不需要特殊处理，但可以在这里添加日志
    }
    
    $done({ headers: reqHeaders });
}
// ========== 模式2: script-response-body ==========
else {

const url = $request.url;
const body = $response.body;

// ========== 注入的JS代码 (IIFE) ==========
const injectScript = `
<script>
(function() {
    'use strict';

    var VIP_LEVEL = 9;
    var VIP_EXPIRE = "2099-12-31T23:59:59Z";
    var VIP_NAME = "\\u81f3\\u5c0aVIP";
    var COIN_AMOUNT = 999999;
    var INTEGRAL_AMOUNT = 999999;
    
    // 增强VIP模拟字段
    var VIP_FIELDS = [
        'isVip', 'vipLevel', 'vipExpireDate', 'vipName', 'snapVip', 'hasLocked', 
        'hasBanned', 'forbidUpload', 'videoDiscountExpiration', 'goldVideoFreeExpire',
        'videoFreeExpiration', 'broadcastExpire', 'loufengBookDiscountExpiration',
        'coinMouthExpireDate', 'vipType', 'vipStatus', 'expireDate', 'userVip',
        'isVipUser', 'vipUser', 'vipFlag', 'isVipFlag', 'canWatchVip',
        'vipCountDown', 'vipTrial', 'vipRemainDays', 'vipForever',
        'isMember', 'memberLevel', 'memberExpire', 'memberType',
        // 视频相关字段
        'videoFree', 'videoUnlock', 'videoVip', 'canWatch', 'canPlay', 'canDownload',
        'videoLimit', 'videoLocked', 'videoNeedVip', 'hasVideo',
        // 权限相关字段
        'hasPermission', 'canAccess', 'unlocked', 'accessible', 'allow',
        // 试用相关字段
        'hasTiro', 'isTiro', 'canUse', 'countdown', 'tiroStatus', 'tiroCountdown', 'tiroExpire',
        // 广告相关权限
        'adFree', 'noAd', 'skipAd', 'hideAd', 'removeAd'
    ];

    // ========== 广告域名黑名单 ==========
    // 注意：只列明确的广告域名，不要包含CDN内容域名（如*.shop、*.com等混合用途域名）
    var adDomains = [
        'eqfx9bas.cc', 'yihaici.top', 'yihaici.com', 'epuf3tk.cc',
        'jmnkojis4.com', 'speedfan', 'u7d2w.com', 'pg71json',
        'pg71.epuf3tk', 'pg71h5.yihaici', 'pg71.epuf3tk.cc',
        't1nijvegfd.eqfx9bas.cc',
        'va2p.com', 'worldcup-ad.com', 'float-ad.com',
        'ia-tech.com', 'prize-ad.com', 'lottery-ad.com',
        'api-dc-prod-008.cyou', 'api-dc2-prod-08.cyou'
    ];

    function isAdUrl(u) {
        if (!u || typeof u !== 'string') return false;
        var lower = u.toLowerCase();
        for (var i = 0; i < adDomains.length; i++) {
            if (lower.indexOf(adDomains[i]) !== -1) return true;
        }
        if (lower.indexOf('eventtracking/batchreport') !== -1) return true;
        if (lower.indexOf('/mp4/splash-') !== -1) return true;
        if (lower.indexOf('/png/buygold-') !== -1) return true;
        if (lower.indexOf('/png/ad-card-bg-') !== -1) return true;
        if (lower.indexOf('/ads/click') !== -1) return true;
        if (lower.indexOf('/recreation/click') !== -1) return true;
        if (lower.indexOf('/webp/splash-') !== -1) return true;
        // 仅拦截明确的广告路径，避免误杀 activity/recommend 等正常API
        if (lower.indexOf('/ad/') !== -1) return true;
        return false;
    }

    // ========== 1. Hook JSON.parse 拦截解密后的API数据 ==========
    var _parse = JSON.parse;
    JSON.parse = function(text) {
        var result = _parse.apply(this, arguments);
        
        // 调试：显示处理的API URL
        if (typeof window !== 'undefined' && window.location && window.location.href) {
            console.log('处理API响应:', window.location.href);
        } else {
            console.log('处理API响应: URL不可用');
        }
        
        // 处理所有对象，包括加密外层包装
        if (result && typeof result === 'object') {
            try {
                // ===== 视频API特殊处理 =====
                if (window.location && window.location.href) {
                    var currentUrl = window.location.href;
                    if (currentUrl.indexOf('/api/app/vid/info') !== -1 || 
                        currentUrl.indexOf('/api/app/vid/play') !== -1 ||
                        currentUrl.indexOf('/api/app/vid/moduleVideo') !== -1) {
                        console.log('处理视频相关API:', currentUrl);
                        
                        // 强制设置VIP视频权限
                        result.isVip = true;
                        result.canWatch = true;
                        result.canPlay = true;
                        result.canDownload = true;
                        result.videoFree = true;
                        result.videoUnlock = true;
                        result.vipLevel = VIP_LEVEL;
                        
                        // 禁用所有视频限制
                        result.videoLimit = false;
                        result.videoLocked = false;
                        result.videoNeedVip = false;
                        result.needVip = false;
                        result.vipRequired = false;
                        
                        // 设置VIP过期时间
                        result.vipExpireDate = VIP_EXPIRE;
                        result.videoExpire = VIP_EXPIRE;
                        
                        console.log('视频VIP权限已设置');
                    }
                }
            } catch(e) {}
                
            // ===== VIP模拟 =====
            try {
                if (!Array.isArray(result) && isVipRelatedObject(result)) {
                    // 设置VIP基础信息
                    result.isVip = true;
                    result.vipLevel = VIP_LEVEL;
                    result.vipExpireDate = VIP_EXPIRE;
                    result.vipName = VIP_NAME;
                    result.snapVip = VIP_LEVEL;
                    
                    // 设置VIP相关权限
                    result.hasLocked = false;
                    result.hasBanned = false;
                    result.forbidUpload = false;
                    result.videoDiscountExpiration = VIP_EXPIRE;
                    result.goldVideoFreeExpire = VIP_EXPIRE;
                    result.videoFreeExpiration = VIP_EXPIRE;
                    result.broadcastExpire = VIP_EXPIRE;
                    result.loufengBookDiscountExpiration = VIP_EXPIRE;
                    result.coinMouthExpireDate = VIP_EXPIRE;
                    
                    // 处理嵌套的vipInfo对象
                    if ('vipInfo' in result && typeof result.vipInfo === 'object') {
                        result.vipInfo.isVip = true;
                        result.vipInfo.vipLevel = VIP_LEVEL;
                        result.vipInfo.vipExpireDate = VIP_EXPIRE;
                        result.vipInfo.vipName = VIP_NAME;
                        result.vipInfo.snapVip = VIP_LEVEL;
                        if ('vipType' in result.vipInfo) result.vipInfo.vipType = VIP_LEVEL;
                        if ('vipStatus' in result.vipInfo) result.vipInfo.vipStatus = 1;
                        if ('expireDate' in result.vipInfo) result.vipInfo.expireDate = VIP_EXPIRE;
                    }
                    
                    // 统一设置所有VIP相关字段
                    for (var i = 0; i < VIP_FIELDS.length; i++) {
                        var field = VIP_FIELDS[i];
                        if (field in result) {
                            if (field.indexOf('vip') !== -1 || field.indexOf('Vip') !== -1 || field.indexOf('VIP') !== -1) {
                                // VIP级别相关字段
                                if (field === 'vipLevel' || field === 'userVip' || field === 'memberLevel') {
                                    result[field] = VIP_LEVEL;
                                }
                                // 布尔值VIP字段
                                else if (field.indexOf('is') === 0 || field.indexOf('has') === 0 || field.indexOf('can') === 0) {
                                    result[field] = true;
                                }
                                // 到期时间相关字段
                                else if (field.indexOf('Expire') !== -1 || field.indexOf('ExpireDate') !== -1 || field.indexOf('Remain') !== -1) {
                                    result[field] = VIP_EXPIRE;
                                }
                                // 永久VIP字段
                                else if (field.indexOf('Forever') !== -1) {
                                    result[field] = true;
                                }
                                // 其他VIP字段设为9或true
                                else {
                                    result[field] = typeof result[field] === 'boolean' ? true : (typeof result[field] === 'number' ? VIP_LEVEL : true);
                                }
                            }
                        }
                    }
                }
                
                // 检测是否为VIP相关对象
                function isVipRelatedObject(obj) {
                    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
                    
                    // 优先检查明确的VIP相关字段
                    var vipKeywords = ['isVip', 'vipLevel', 'vipExpireDate', 'vipInfo', 'snapVip', 'vipStatus', 'expireDate', 'userVip', 'isVipUser', 'vipUser', 'vipFlag', 'isVipFlag', 'memberLevel', 'memberExpire', 'tiroCountdown', 'tiroExpire', 'tiroStatus'];
                    for (var i = 0; i < vipKeywords.length; i++) {
                        if (vipKeywords[i] in obj) return true;
                    }
                    
                    // 仅检查对象的直接字段名（不递归），且仅匹配含vip/tiro的关键词
                    // 移除过于宽泛的 member/user/mine/profile 匹配
                    var keys = Object.keys(obj);
                    for (var j = 0; j < keys.length; j++) {
                        var key = keys[j].toLowerCase();
                        if (key.indexOf('vip') !== -1 || key.indexOf('tiro') !== -1) {
                            return true;
                        }
                    }
                    
                    return false;
                }

                // ===== VIP试用倒计时处理 =====
                if (!Array.isArray(result) && ('tiroCountdown' in result || 'tiroExpire' in result || 'tiroStatus' in result)) {
                    console.log('处理VIP试用倒计时API');
                    result.tiroCountdown = 0;
                    result.tiroExpire = "1970-01-01T00:00:00Z";
                    if ('tiroStatus' in result) result.tiroStatus = 0;
                    if ('countdown' in result) result.countdown = 0;
                    if ('canUse' in result) result.canUse = false;
                    result.hasTiro = false;
                    result.isTiro = false;
                }

                // ===== 视频权限处理 =====
                if (!Array.isArray(result) && ('videoFree' in result || 'videoUnlock' in result || 'videoVip' in result || 'canWatch' in result)) {
                    console.log('处理视频权限API');
                    result.videoFree = true;
                    result.videoUnlock = true;
                    result.videoVip = true;
                    result.canWatch = true;
                    result.canPlay = true;
                    result.canDownload = true;
                    result.videoLimit = false;
                    result.videoLocked = false;
                    result.videoNeedVip = false;
                    result.needVip = false;
                    result.vipRequired = false;
                    result.isLocked = false;
                    result.isLimited = false;
                    result.requireVip = false;
                    result.vipOnly = false;
                }
                
                // 全面视频权限处理 - 检查所有可能限制视频的字段
                if (!Array.isArray(result)) {
                    var videoLimitFields = [
                        'isLocked', 'isLimited', 'needVip', 'vipRequired', 'requireVip', 
                        'vipOnly', 'locked', 'limited', 'vipOnly', 'premiumOnly',
                        'needPurchase', 'needSubscription', 'requirePayment',
                        'hasAccess', 'accessible', 'playable', 'streamable'
                    ];
                    
                    for (var i = 0; i < videoLimitFields.length; i++) {
                        var field = videoLimitFields[i];
                        if (field in result) {
                            if (field.indexOf('is') === 0 || field.indexOf('has') === 0 || field.indexOf('need') === 0 || field.indexOf('require') === 0) {
                                // 限制性字段设为false
                                result[field] = false;
                            } else if (field.indexOf('accessible') !== -1 || field.indexOf('playable') !== -1 || field.indexOf('streamable') !== -1) {
                                // 权限字段设为true
                                result[field] = true;
                            }
                        }
                    }
                }

                // ===== 钱包模拟 =====
                if (!Array.isArray(result) && (('amount' in result && 'integral' in result) || ('fruitCoin' in result) || ('coin' in result && 'integral' in result))) {
                    if (typeof result.amount === 'number') result.amount = COIN_AMOUNT;
                    if (typeof result.integral === 'number') result.integral = INTEGRAL_AMOUNT;
                    if (typeof result.coin === 'number') result.coin = COIN_AMOUNT;
                    if ('fruitCoin' in result) result.fruitCoin = COIN_AMOUNT;
                    if ('lotteryTimes' in result) result.lotteryTimes = 999;
                    if ('aiUndressFreeTimes' in result) result.aiUndressFreeTimes = 999;
                    if ('aiChangeFaceImgFreeTimes' in result) result.aiChangeFaceImgFreeTimes = 999;
                    if ('aiMateBalance' in result) result.aiMateBalance = 999999;
                    if ('downloadCount' in result) result.downloadCount = 999;
                    if ('goldCoin' in result) result.goldCoin = COIN_AMOUNT;
                    if ('diamond' in result) result.diamond = 999999;
                }

                // ===== VIP试用倒计时 =====
                if (!Array.isArray(result) && ('tiroCountdown' in result || 'tiroExpire' in result || 'tiroStatus' in result)) {
                    result.tiroCountdown = 0;
                    result.tiroExpire = "1970-01-01T00:00:00Z";
                    if ('tiroStatus' in result) result.tiroStatus = 0;
                    if ('countdown' in result) result.countdown = 0;
                    if ('canUse' in result) result.canUse = false;
                }

                // ===== 红包弹窗关闭 =====
                if (!Array.isArray(result) && 'canClick' in result && ('prizeAmount' in result || 'redPacket' in result)) {
                    result.canClick = false;
                    result.enabled = false;
                    if ('show' in result) result.show = false;
                }

                // ===== 清空广告列表 =====
                clearAdsInfoList(result);

                // ===== 递归处理: 禁用广告配置 + 过滤广告数组 =====
                recursiveProcess(result, 0);

            } catch(e) {}
        }

        return result;
    };

    // ========== 清空广告列表 ==========
    function clearAdsInfoList(obj) {
        if (!obj || typeof obj !== 'object') return;
        if ('adsInfoList' in obj) {
            obj.adsInfoList = [];
        }
        for (var key in obj) {
            if (!obj.hasOwnProperty(key)) continue;
            var val = obj[key];
            if (val && typeof val === 'object') {
                if ('adsInfoList' in val) {
                    val.adsInfoList = [];
                }
                if (typeof val === 'object' && !Array.isArray(val)) {
                    clearAdsInfoList(val);
                } else if (Array.isArray(val)) {
                    for (var i = 0; i < val.length; i++) {
                        if (val[i] && typeof val[i] === 'object') clearAdsInfoList(val[i]);
                    }
                }
            }
        }
    }

    // ========== 递归处理函数 ==========
    function recursiveProcess(obj, depth) {
        if (depth > 10 || !obj || typeof obj !== 'object') return;

        if (Array.isArray(obj)) {
            for (var i = obj.length - 1; i >= 0; i--) {
                if (obj[i] && typeof obj[i] === 'object') {
                    if (isAdItem(obj[i])) {
                        obj.splice(i, 1);
                    } else {
                        recursiveProcess(obj[i], depth + 1);
                    }
                }
            }
        } else {
            disableAdConfig(obj);
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    var val = obj[key];
                    if (val && typeof val === 'object') {
                        if (Array.isArray(val)) {
                            for (var j = val.length - 1; j >= 0; j--) {
                                if (val[j] && typeof val[j] === 'object' && isAdItem(val[j])) {
                                    val.splice(j, 1);
                                }
                            }
                            recursiveProcess(val, depth + 1);
                        } else {
                            recursiveProcess(val, depth + 1);
                        }
                    }
                }
            }
        }
    }

    // ========== 禁用广告配置标志 ==========
    function disableAdConfig(obj) {
        if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return;
        if ('adsInfoList' in obj) obj.adsInfoList = [];
        if ('homeAdvFirst' in obj) obj.homeAdvFirst = false;

        var adFlags = [
            'showAd', 'adEnabled', 'hasAd', 'adSwitch', 'enableAd', 'adOpen',
            'showBanner', 'showSplash', 'showPopup', 'showPromote',
            'splashAd', 'bannerAd', 'popupAd', 'insertAd', 'feedAd',
            'openAd', 'adShow', 'adDisplay', 'displayAd',
            'showInsertAd', 'showFeedAd', 'showOpenAd', 'showVideoAd',
            'adConfig', 'adSetting', 'adSettingSwitch',
            'splashSwitch', 'splashEnabled', 'splashAdSwitch', 'splashAdEnabled',
            'bannerSwitch', 'bannerEnabled', 'popupSwitch', 'popupEnabled',
            'isAd', 'isAdvertisement', 'isPromote', 'isBanner',
            'openScreenAd', 'openScreenAdSwitch', 'openScreenAdEnabled',
            'rewardAdSwitch', 'rewardAdEnabled', 'rewardVideoAd',
            'interstitialAd', 'interstitialAdSwitch',
            'nativeAd', 'nativeAdSwitch',
            'canShowAd', 'adVisible', 'adStatus',
            'thirdAd', 'thirdAdSwitch', 'thirdAdEnabled',
            'floatingAd', 'floatingAdSwitch',
            'marqueeAd', 'marqueeAdSwitch',
            'noticeAd', 'noticeAdSwitch',
            'guideAd', 'guideAdSwitch'
        ];

        for (var i = 0; i < adFlags.length; i++) {
            var flagKey = adFlags[i];
            if (flagKey in obj) {
                if (typeof obj[flagKey] === 'boolean') obj[flagKey] = false;
                else if (typeof obj[flagKey] === 'number') obj[flagKey] = 0;
                else if (obj[flagKey] && typeof obj[flagKey] === 'object') {
                    if ('enabled' in obj[flagKey]) obj[flagKey].enabled = false;
                    if ('show' in obj[flagKey]) obj[flagKey].show = false;
                    if ('switch' in obj[flagKey]) obj[flagKey]['switch'] = false;
                    if ('open' in obj[flagKey]) obj[flagKey].open = false;
                    if ('enable' in obj[flagKey]) obj[flagKey].enable = false;
                    if ('status' in obj[flagKey]) obj[flagKey].status = 0;
                }
            }
        }

        var splashKeys = ['splash', 'splashAd', 'splashConfig', 'splashData', 'splashInfo', 'openScreen', 'openScreenAd', 'launchAd', 'bootAd', 'splashAdv', 'splash_adv'];
        for (var s = 0; s < splashKeys.length; s++) {
            if (splashKeys[s] in obj) obj[splashKeys[s]] = null;
        }

        if ('redPacket' in obj && obj.redPacket && typeof obj.redPacket === 'object') {
            obj.redPacket.canClick = false;
            obj.redPacket.enabled = false;
            obj.redPacket.show = false;
        }
        if ('redpacket' in obj && obj.redpacket && typeof obj.redpacket === 'object') {
            obj.redpacket.canClick = false;
            obj.redpacket.enabled = false;
            obj.redpacket.show = false;
        }
    }

    // ========== 广告项检测 ==========
    function isAdItem(item) {
        if (!item || typeof item !== 'object') return false;
        if (item.type === 'adv' || item.type === 'ADV') return true;
        // 移除：position字段太宽泛会误杀正常数据
        // 仅当 position 为较大数值（>99）且伴随广告type时判定
        if (item.position && typeof item.position === 'number' && item.position > 99 && (item.type === 'banner' || item.type === 'float' || item.type === 'popup')) return true;
        if ('advertising_key' in item && item.advertising_key) return true;

        var urlFields = ['link', 'url', 'jumpUrl', 'redirectUrl', 'href', 'actionUrl', 'clickUrl', 'h5Url', 'webUrl'];
        for (var m = 0; m < urlFields.length; m++) {
            if (urlFields[m] in item && typeof item[urlFields[m]] === 'string') {
                if (isAdUrl(item[urlFields[m]])) return true;
            }
        }
        if ('type' in item && (item.type === 'float' || item.type === 'popup' || item.type === 'dialog')) {
            // 仅当还有广告相关字段时才判定为广告
            if (item.link || item.advertising_key || item.clickUrl || item.h5Url) return true;
        }
        if ('eventName' in item && (item.eventName.indexOf('\\u4e16\\u754c\\u676f') !== -1 || item.eventName.indexOf('\\u7ea2\\u5305\\u96e8') !== -1)) return true;

        var activityTypes = ['redRain', 'prize', 'lottery', 'worldCup'];
        for (var n = 0; n < activityTypes.length; n++) {
            if (item.type === activityTypes[n] || (item.activityType && item.activityType === activityTypes[n])) return true;
        }
        return false;
    }

    // ========== 2. 拦截fetch 阻止广告请求 ==========
    var _fetch = window.fetch;
    if (_fetch) {
        window.fetch = function(input) {
            var reqUrl = typeof input === 'string' ? input : (input && input.url ? input.url : '');
            if (isAdUrl(reqUrl)) {
                return Promise.resolve(new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } }));
            }
            return _fetch.apply(this, arguments);
        };
    }

    // ========== 3. 拦截XMLHttpRequest 阻止广告请求 ==========
    var _open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, reqUrl) {
        if (isAdUrl(reqUrl)) {
            arguments[1] = 'data:application/json,{}';
        }
        return _open.apply(this, arguments);
    };

    // ========== 4. Hook axios响应拦截器 ==========
    function hookAxios() {
        if (window.axios && window.axios.interceptors && window.axios.interceptors.response) {
            var _use = window.axios.interceptors.response.use.bind(window.axios.interceptors.response);
            window.axios.interceptors.response.use = function(onFulfilled, onRejected) {
                var wrappedFulfilled = function(response) {
                    if (response && response.data) {
                        try { recursiveProcess(response.data, 0); } catch(e) {}
                    }
                    return onFulfilled ? onFulfilled(response) : response;
                };
                return _use(wrappedFulfilled, onRejected);
            };
        }
    }
    hookAxios();
    setTimeout(hookAxios, 100);
    setTimeout(hookAxios, 500);
    setTimeout(hookAxios, 2000);

    // ========== 5. Hook Vue.prototype.$axios ==========
    function hookVueAxios() {
        if (window.Vue && window.Vue.prototype && window.Vue.prototype.$axios) {
            var ax = window.Vue.prototype.$axios;
            if (ax.interceptors && ax.interceptors.response) {
                ax.interceptors.response.use(function(response) {
                    if (response && response.data) {
                        try { recursiveProcess(response.data, 0); } catch(e) {}
                    }
                    return response;
                });
            }
        }
    }
    setTimeout(hookVueAxios, 500);
    setTimeout(hookVueAxios, 2000);

    // ========== 6. 拦截window.open 阻止广告跳转 ==========
    var _windowOpen = window.open;
    window.open = function(u) {
        if (isAdUrl(u)) return null;
        return _windowOpen.apply(this, arguments);
    };

    // ========== 7. 拦截location跳转 ==========
    var _assign = window.location.assign.bind(window.location);
    var _replace = window.location.replace.bind(window.location);
    window.location.assign = function(u) { if (!isAdUrl(u)) return _assign(u); };
    window.location.replace = function(u) { if (!isAdUrl(u)) return _replace(u); };

    // ========== 8. DOM监听 移除广告元素 ==========
    function removeAdElements() {
        if (!document.body) return;

        // 开屏广告
        document.querySelectorAll(
            '[class*="splash"], [class*="Splash"], [id*="splash"], [id*="Splash"],' +
            '.splash_adv, .splashVideo, #splashVideo, .splash-loading-img,' +
            '[class*="launch-ad"], [class*="boot-ad"], [class*="open-screen"],' +
            '[class*="startup-ad"]'
        ).forEach(function(el) { el.remove(); });

        // 广告轮播/列表项
        document.querySelectorAll(
            '.adv-swiper-slide, [class*="adv-swiper"], [class*="advTitle"],' +
            '[class*="adv-card"], [class*="adv-item"], [class*="adv-list"],' +
            '[class*="adv-banner"], [class*="adv-container"], [class*="adv-wrapper"],' +
            '[class*="banner-ad"], [class^="ad-"], [class*=" ad-"],' +
            '[class*="adBanner"], [class*="adCard"]'
        ).forEach(function(el) { el.style.display = 'none'; });

        // 全屏视频广告/插屏广告
        document.querySelectorAll(
            '[class*="fullscreen-video-ad"], [class*="fullScreenAd"],' +
            '[class*="video-ad"], [class*="interstitial"], [class*="insert-ad"]'
        ).forEach(function(el) { el.remove(); });

        // 广告弹窗/浮窗/悬浮窗（仅匹配明确广告前缀的，避免误杀正常UI）
        document.querySelectorAll(
            '[class*="ad-popup"], [class*="adPopup"], [class*="popup-ad"],' +
            '[class*="ad-dialog"], [class*="ad-modal"],' +
            '[class*="floating-ad"], [class*="float-ad"], [class*="ad-float"],' +
            '[class*="redRain"], [class*="\\u7ea2\\u5305"], [class*="prize"], [class*="lottery"],' +
            '[class*="worldCup"], [class*="\\u4e16\\u754c\\u676f"], [class*="ia-tech"], [class*="AI\\u79d1\\u6280"]'
        ).forEach(function(el) { el.remove(); });

        // 悬浮AI图标
        document.querySelectorAll(
            '[class*="ai_root"], [class*="ai-root"], [class*="ic_ai"],' +
            'img[src*="ai_root"], img[src*="ic_ai"],' +
            '[class*="AiRoot"], [class*="ai_float"]'
        ).forEach(function(el) { el.remove(); });

        // 推广/赞助（仅匹配明确的推广广告类名）
        document.querySelectorAll(
            '[class*="adv-swiper"], [class*="advTitle"],' +
            '[class*="adv-card"], [class*="adv-item"], [class*="adv-list"],' +
            '[class*="adv-banner"], [class*="adv-container"], [class*="adv-wrapper"]'
        ).forEach(function(el) { el.style.display = 'none'; });

        // 广告注入的iframe/script
        document.querySelectorAll(
            'iframe[src*="eqfx9bas"], iframe[src*="yihaici"], iframe[src*="epuf3tk"],' +
            'iframe[src*="speedfan"], iframe[src*="u7d2w"], iframe[src*="detkli-lys"], iframe[src*="hxscwine"],' +
            'script[src*="eqfx9bas"], script[src*="yihaici"], script[src*="epuf3tk"], script[src*="detkli-lys"], script[src*="hxscwine"]'
        ).forEach(function(el) { el.remove(); });

        // 广告视频
        document.querySelectorAll('video[src*="splash-"], video[src*="ad-"]').forEach(function(el) { el.remove(); });

        // 带ad属性的元素
        document.querySelectorAll('[data-ad], [data-ad-type], [data-ad-id]').forEach(function(el) { el.style.display = 'none'; });

        // 移除：遮罩层处理会影响正常弹窗和模态框

        // 广告角标
        document.querySelectorAll('.corner-tag.isAdv, .corner-tag[class*="isAdv"]').forEach(function(el) { el.style.display = 'none'; });

        // 底部导航中的"AI科技"/"AI"项
        document.querySelectorAll(
            '.van-tabbar__item, .tabbar-item, [class*="tabbar-item"],' +
            '[class*="tab-item"], [class*="nav-item"], [role="tab"]'
        ).forEach(function(el) {
            var text = el.textContent || el.innerText || '';
            if (text.indexOf('AI\\u79d1\\u6280') !== -1 || text.indexOf('AI') === 0) {
                el.style.display = 'none';
            }
        });
    }

    // MutationObserver 防抖监控
    if (window.MutationObserver) {
        var observer = new MutationObserver(function() {
            if (!removeAdElements.throttle) {
                removeAdElements.throttle = true;
                setTimeout(function() {
                    removeAdElements();
                    removeAdElements.throttle = false;
                }, 100);
            }
        });
        var startObserve = function() {
            if (document.body) {
                observer.observe(document.body, { childList: true, subtree: true, attributes: false, characterData: false });
                removeAdElements();
            } else {
                setTimeout(startObserve, 100);
            }
        };
        startObserve();
    } else {
        setInterval(removeAdElements, 1000);
    }

    // ========== 9. CSS样式屏蔽 ==========
    var style = document.createElement('style');
    style.textContent = [
        '[class*="vip-guide"], [class*="VipGuide"], [class*="vipGuide"],',
        '[class*="buy-vip"], [class*="buyVip"], [class*="BuyVip"],',
        '[class*="vip-expire"], [class*="vipExpire"],',
        '[class*="upgrade-vip"], [class*="upgradeVip"],',
        '[class*="vip-banner"], [class*="vipBanner"],',
        '[class*="recharge-banner"], [class*="rechargeBanner"],',
        '[class*="first-charge"], [class*="firstCharge"],',
        '[class*="origin-price"], [class*="originPrice"],',
        '.splash_adv, .splashVideo, #splashVideo, .splash-loading-img,',
        '[class*="splash-ad"], [class*="splashAd"], [class*="SplashAd"],',
        '.adv-swiper-slide, [class*="adv-swiper"], [class*="advTitle"],',
        '[class*="adv-card"], [class*="adv-item"], [class*="adv-list"],',
        '[class*="adv-banner"], [class*="adv-container"], [class*="adv-wrapper"],',
        '[class*="google-ad"], [class*="adsbygoogle"],',
        '.corner-tag.isAdv',
        '{display:none!important}'
    ].join('');
    (document.head || document.documentElement).appendChild(style);

    // ========== 10. 拦截script动态加载 阻止广告SDK ==========
    var _createElement = document.createElement.bind(document);
    document.createElement = function(tagName) {
        var el = _createElement(tagName);
        if (tagName && tagName.toLowerCase() === 'script') {
            var _srcDesc = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src');
            if (_srcDesc && _srcDesc.set) {
                Object.defineProperty(el, 'src', {
                    get: _srcDesc.get,
                    set: function(val) {
                        if (!isAdUrl(val)) _srcDesc.set.call(el, val);
                    },
                    configurable: true
                });
            }
        }
        return el;
    };

})();
</script>
`;

// ========== 注入脚本到HTML页面 ==========
var isTarget = url.indexOf('oihawlma.00po.shop') !== -1 ||
               url.indexOf('00po.shop') !== -1;

if (isTarget && body) {
    // 检查文件扩展名排除非HTML
    if (url.match(/\.(js|css|png|jpg|jpeg|gif|svg|json|xml|pdf|mp4|mp3|woff|woff2|ttf|eot|ico|map|webp)(\?|$)/i)) {
        $done({});
        return;
    }

    // 检查Content-Type
    var ctype = ($response.headers || {})['Content-Type'] || ($response.headers || {})['content-type'] || '';
    if (ctype && ctype.indexOf('text/html') === -1 && ctype.indexOf('html') === -1) {
        $done({});
        return;
    }

    // 检查响应内容是否为HTML
    var bodyStr = typeof body === 'string' ? body : '';
    if (bodyStr.indexOf('<html') === -1 && bodyStr.indexOf('<!DOCTYPE') === -1) {
        $done({});
        return;
    }

    var newBody = bodyStr;

    // 在</head>前注入
    if (newBody.indexOf('</head>') !== -1) {
        newBody = newBody.replace('</head>', injectScript + '</head>');
    } else if (newBody.indexOf('<div id="app">') !== -1) {
        newBody = newBody.replace('<div id="app">', '<div id="app">' + injectScript);
    } else if (newBody.indexOf('<body') !== -1) {
        newBody = newBody.replace(/<body([^>]*)>/, '<body$1>' + injectScript);
    } else if (newBody.indexOf('/init.js') !== -1) {
        newBody = newBody.replace('/init.js', injectScript + '/init.js');
    } else {
        newBody = newBody + injectScript;
    }

    var headers = $response.headers || {};
    headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    headers['Pragma'] = 'no-cache';
    headers['Expires'] = '0';

    $done({ body: newBody, headers: headers });
} else {
    $done({});
}

} // 结束 script-response-body 模式