/*
 * IPPure 节点 IP 纯净度
 * Loon Generic
 */

const url = "https://my.ippure.com/v1/info";
const MarkIP = String($argument || "false").toLowerCase() === "true";

$httpClient.get(url, function (err, resp, data) {
  if (err) {
    $done({
      title: "IP 纯净度",
      content: "请求失败"
    });
    return;
  }

  let j;
  try {
    j = JSON.parse(data);
  } catch (e) {
    $done({
      title: "IP 纯净度",
      content: "数据解析失败"
    });
    return;
  }

  const ip = j.ip || "";
  const isIPv6 = ip.indexOf(":") !== -1;
  const ipLabel = isIPv6 ? "IPv6" : "IPv4";
  const showIP = MarkIP ? maskIP(ip) : ip;

  const flag = flagEmoji(j.countryCode || "");
  const nativeText = j.isResidential ? "✅ 是（原生）" : "🏢 否（机房/商业）";
  const risk = Number(j.fraudScore || 0);

  let riskText;
  if (risk >= 80) {
    riskText = `🛑 极高风险 (${risk})`;
  } else if (risk >= 70) {
    riskText = `⚠️ 高风险 (${risk})`;
  } else if (risk >= 40) {
    riskText = `🔶 中等风险 (${risk})`;
  } else {
    riskText = `✅ 低风险 (${risk})`;
  }

  const asn = j.asn ? `AS${j.asn}` : "AS未知";
  const org = j.asOrganization || "未知";
  const country = j.country || "";
  const city = j.city || "";

  $done({
    title: "节点 IP 纯净度",
    content:
`${ipLabel}：${showIP}
ASN：${asn} ${org}
位置：${flag} ${country} ${city}
原生 IP：${nativeText}
${riskText}`
  });
});

function maskIP(ip) {
  if (!ip) return "";

  // IPv4
  if (ip.indexOf(".") !== -1) {
    const p = ip.split(".");
    return `${p[0]}.${p[1]}.*.*`;
  }

  // IPv6
  const p6 = ip.split(":");
  return `${p6[0]}:${p6[1]}:*:*:*:*:*:*`;
}

function flagEmoji(code) {
  if (!code) return "";
  if (code.toUpperCase() === "TW") code = "CN";

  return String.fromCodePoint(
    ...code.toUpperCase().split("").map(function (c) {
      return 127397 + c.charCodeAt();
    })
  );
}