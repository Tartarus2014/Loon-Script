const headers = $request.headers;
const url = $request.url;

// ========== 检测视频m3u8请求 ==========
if (url.includes('/api/app/vid/m3u8/') && url.includes('.m3u8')) {
    console.log('检测到00po视频请求: ' + url);
    
    // 生成直接的视频链接（域名标准化）
    let directUrl = url.replace(/\/\/[^\.]+\.00po\.shop\//, '//oihqwlma.00po.shop/');
    
    // 去掉秒数限制（如果有）
    directUrl = directUrl.replace(/&seconds=\d+/, '');
    directUrl = directUrl.replace(/\?seconds=\d+&?/, '?');
    directUrl = directUrl.replace(/\?$/, ''); // 清理末尾的问号
    
    // 清理重复的参数
    let urlObj = new URL(directUrl);
    let params = new URLSearchParams(urlObj.search);
    let cleanParams = new URLSearchParams();
    
    // 保留token等重要参数，去掉seconds
    for (let [key, value] of params) {
        if (key !== 'seconds' && key !== '') {
            cleanParams.append(key, value);
        }
    }
    
    // 重新构建URL
    let baseUrl = directUrl.split('?')[0];
    let cleanUrl = baseUrl + (cleanParams.toString() ? '?' + cleanParams.toString() : '');
    
    console.log('转换后的视频链接: ' + cleanUrl);
    
    // 发送通知
    const title = '🎬 彭于晏提示❗️视频链接捕获成功';
    const subtitle = '>_ 点击此通知可跳转观看 🔞';
    
    // 根据不同代理工具发送通知
    if (typeof $task !== 'undefined') {
        // Quantumult X
        $notify(title, subtitle, '', {
            'open-url': cleanUrl
        });
    } else if (typeof $loon !== 'undefined') {
        // Loon (Loon 支持与 Surge 兼容的 $notification.post 及其 url 参数)
        $notification.post(title, subtitle, '', {
            'url': cleanUrl
        });
    } else if (typeof $httpClient !== 'undefined') {
        // Shadowrocket / Surge
        $notification.post(title, subtitle, '', {
            'url': cleanUrl
        });
    }
}

// 直接返回原请求头，不做任何修改
$done({
    response: {
        headers: headers
    }
});