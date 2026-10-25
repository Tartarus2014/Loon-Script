/***********************************************
> 应用名称：美团 / MT.js
> 适配说明：兼容 Loon / Quantumult X / Surge 等平台 (基于 @nsnanocat/util 规范)
***********************************************/

const mtqxUrl = (typeof $request !== "undefined" && $request && $request.url) || "";
const mtqxHideTabs = ["video", "xiaotuan"];
const mtqxKeepTabs = ["homepage", "mine"];
const mtqxFeedScenes = ["gwc_feed1_2265", "personalcenter_2154"];
const mtqxMineHide = ["mine_cross_recommend"];
const mtqxSearchHide = ["EntranceHotwordsV2Hotwords", "EntranceHotwordsV2ContentCard"];

function mtqxIsObj(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function mtqxTab(obj) {
  const res = obj && obj.data && obj.data.resource;
  if (!mtqxIsObj(res) || !Array.isArray(res.tabArea)) return false;
  const names = res.tabArea.map(t => (mtqxIsObj(t) ? t.tabName : ""));
  if (!mtqxKeepTabs.every(n => names.indexOf(n) >= 0)) return false;
  const kept = res.tabArea.filter(t => !(mtqxIsObj(t) && mtqxHideTabs.indexOf(t.tabName) >= 0));
  if (kept.length === res.tabArea.length) return false;
  res.tabArea = kept;
  return true;
}

function mtqxFeed(obj) {
  const m = mtqxUrl.match(/\/lycoris\/scene\/([A-Za-z0-9_]+)/);
  if (!m || mtqxFeedScenes.indexOf(m[1]) < 0) return false;
  if (!mtqxIsObj(obj) || !Array.isArray(obj.data)) return false;
  obj.data = [];
  obj.bottom = true;
  if (!mtqxIsObj(obj.ext)) obj.ext = {};
  obj.ext.forbidByExp = true;
  return true;
}

function mtqxMine(obj) {
  if (!mtqxIsObj(obj) || !Array.isArray(obj.children)) return false;
  const kept = obj.children.filter(c => !(mtqxIsObj(c) && mtqxMineHide.indexOf(c.name) >= 0));
  if (kept.length === obj.children.length) return false;
  obj.children = kept;
  return true;
}

function mtqxDefaultWord(obj) {
  const res = obj && obj.searchIntroduceResponse;
  if (!mtqxIsObj(res)) return false;
  let changed = false;
  const dw = res.defaultWordRes;
  if (mtqxIsObj(dw) && Array.isArray(dw.defaultWordItems) && dw.defaultWordItems.length) {
    dw.defaultWordItems = [];
    changed = true;
  }
  if (Array.isArray(res.HotWordInfos) && res.HotWordInfos.length) {
    res.HotWordInfos = [];
    changed = true;
  }
  return changed;
}

function mtqxHotRecommend(obj) {
  const d = obj && obj.data;
  if (!mtqxIsObj(d) || !Array.isArray(d.segmentsV2)) return false;
  let changed = false;
  const kept = [];
  d.segmentsV2.forEach(s => {
    if (!mtqxIsObj(s) || !Array.isArray(s.hotwordSegments)) {
      kept.push(s);
      return;
    }
    const hs = s.hotwordSegments.filter(h => !(mtqxIsObj(h) && mtqxSearchHide.indexOf(h.pageName) >= 0));
    if (hs.length === s.hotwordSegments.length) {
      kept.push(s);
      return;
    }
    changed = true;
    if (hs.length) {
      s.hotwordSegments = hs;
      kept.push(s);
    }
  });
  if (changed) d.segmentsV2 = kept;
  const b = d.aiSearchBubble;
  if (mtqxIsObj(b) && Array.isArray(b.bubbleTexts) && b.bubbleTexts.length) {
    b.bubbleTexts = [];
    changed = true;
  }
  return changed;
}

function mtqxAiSkill(obj) {
  if (!mtqxIsObj(obj) || typeof obj.data !== "string") return false;
  const d = JSON.parse(obj.data);
  if (!mtqxIsObj(d) || !mtqxIsObj(d.skills) || !Object.keys(d.skills).length) return false;
  d.skills = {};
  obj.data = JSON.stringify(d);
  return true;
}

function mtqxClearArea(root, key) {
  const holders = [root, root && root.data];
  let changed = false;
  holders.forEach(h => {
    if (!mtqxIsObj(h)) return;
    [h.resourcesMap, h.resource].forEach(r => {
      if (mtqxIsObj(r) && Array.isArray(r[key]) && r[key].length) {
        r[key] = [];
        changed = true;
      }
    });
  });
  return changed;
}

(function () {
  const body = typeof $response !== "undefined" && $response ? $response.body : "";
  if (typeof body !== "string" || !body) {
    // 兼容 Loon / QX 的结束方式
    if (typeof $done !== "undefined") {
      $done({});
    }
    return;
  }
  let obj;
  try {
    obj = JSON.parse(body);
  } catch (e) {
    if (typeof $done !== "undefined") {
      $done({});
    }
    return;
  }
  let changed = false;
  try {
    if (/\/aggroup\/indexTab/.test(mtqxUrl)) changed = mtqxTab(obj);
    else if (/\/lycoris\/scene\//.test(mtqxUrl)) changed = mtqxFeed(obj);
    else if (/\/usercenter\/display/.test(mtqxUrl)) changed = mtqxMine(obj);
    else if (/\/searchpage\/defaultword/.test(mtqxUrl)) changed = mtqxDefaultWord(obj);
    else if (/\/searchpage\/hotword\/city\/divide\/hotrecommend\//.test(mtqxUrl)) changed = mtqxHotRecommend(obj);
    else if (/\/assistant\/getAppClientHornConfig/.test(mtqxUrl)) changed = mtqxAiSkill(obj);
    else if (/\/mop\/entry\/shoppingCartEntry/.test(mtqxUrl)) changed = mtqxClearArea(obj, "topBannerArea");
    else if (/\/entryModule\/startupPicture/.test(mtqxUrl)) changed = mtqxClearArea(obj, "startupPicArea");
  } catch (e) {
    changed = false;
  }

  if (typeof $done !== "undefined") {
    if (changed) {
      $done({ body: JSON.stringify(obj) });
    } else {
      $done({});
    }
  }
})();
