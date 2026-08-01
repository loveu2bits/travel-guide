/* 韩国攻略 — 每日路线图（Leaflet + OpenStreetMap） */
document.addEventListener("DOMContentLoaded", () => {
  if (typeof L === "undefined") return;

  const ACCENT =
    getComputedStyle(document.body).getPropertyValue("--accent").trim() ||
    "#be123c";
  const GRAY = "#9ca3af";

  const pin = (num, optional) =>
    L.divIcon({
      className: "map-pin" + (optional ? " map-pin--opt" : ""),
      html: `<span>${num}</span>`,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
      popupAnchor: [0, -12],
    });

  const DAYS = {
    "map-d1": {
      stops: [
        { num: 1, name: "仁川机场 T1（12:00 落地）", lat: 37.4602, lon: 126.4407 },
        { num: 2, name: "首尔站（AREX 直达车 43 分钟，换 4 号线）", lat: 37.5547, lon: 126.9726 },
        { num: 3, name: "明洞（酒店 · 采购 · 晚餐）", lat: 37.5637, lon: 126.9846 },
        { num: 4, name: "N 首尔塔（南山循环巴士 01A/01B 上山）", lat: 37.5512, lon: 126.9882 },
      ],
      lines: [
        { pts: [[37.4602, 126.4407], [37.5547, 126.9726], [37.5637, 126.9846]] },
        { pts: [[37.5637, 126.9846], [37.5512, 126.9882]] },
      ],
    },
    "map-d2": {
      stops: [
        { num: 1, name: "景福宫 · 光化门（10:00 换岗仪式）", lat: 37.5796, lon: 126.977 },
        { num: 2, name: "土俗村参鸡汤（午餐）", lat: 37.5776, lon: 126.9715 },
        { num: 3, name: "北村韩屋村（慢逛）", lat: 37.5826, lon: 126.9831 },
        { num: 4, name: "安国站（🚇 回明洞）", lat: 37.5765, lon: 126.985 },
      ],
      lines: [
        { pts: [[37.5796, 126.977], [37.5776, 126.9715], [37.5826, 126.9831], [37.5765, 126.985]] },
      ],
    },
    "map-d3": {
      stops: [
        { num: 1, name: "明洞（酒店 · 下午补货）", lat: 37.5637, lon: 126.9846 },
        { num: 2, name: "益善洞韩屋村（方案 A）", lat: 37.574, lon: 126.9916 },
        { num: 3, name: "南大门市场（方案 B）", lat: 37.5593, lon: 126.9768, opt: true },
      ],
      lines: [
        { pts: [[37.5637, 126.9846], [37.574, 126.9916]] },
        { pts: [[37.5637, 126.9846], [37.5593, 126.9768]], opt: true },
      ],
    },
    "map-d4": {
      stops: [
        { num: 1, name: "釜山站（KTX 抵达 · 酒店寄存行李）", lat: 35.1152, lon: 129.0403 },
        { num: 2, name: "松岛缆车站（海上缆车 · 天空公园）", lat: 35.0753, lon: 129.0168 },
        { num: 3, name: "甘川文化村（彩色山城）", lat: 35.0975, lon: 129.0104 },
        { num: 4, name: "广安里（晚上方案 A：大桥夜景）", lat: 35.1531, lon: 129.1194, opt: true },
        { num: 5, name: "南浦洞 / 札嘎其（晚上方案 B：海鲜晚餐）", lat: 35.0988, lon: 129.0275, opt: true },
      ],
      lines: [
        { pts: [[35.1152, 129.0403], [35.0753, 129.0168], [35.0975, 129.0104]] },
        { pts: [[35.0975, 129.0104], [35.1531, 129.1194]], opt: true },
        { pts: [[35.0975, 129.0104], [35.0988, 129.0275]], opt: true },
      ],
    },
    "map-d5": {
      stops: [
        { num: 1, name: "海云台海水浴场（沙滩漫步 · 日落）", lat: 35.1587, lon: 129.1603 },
        { num: 2, name: "东柏岛灯塔（《鬼怪》取景地）", lat: 35.154, lon: 129.1515 },
        { num: 3, name: "海云台传统市场（午餐 · 糖饼）", lat: 35.1617, lon: 129.1626 },
        { num: 4, name: "蓝线公园 · 尾浦站（15:30 胶囊火车）", lat: 35.158, lon: 129.1716 },
        { num: 5, name: "青沙浦（双子灯塔 · 海边公路）", lat: 35.1603, lon: 129.1932 },
      ],
      lines: [
        { pts: [[35.1587, 129.1603], [35.154, 129.1515]] },
        { pts: [[35.1587, 129.1603], [35.1617, 129.1626], [35.158, 129.1716], [35.1603, 129.1932]] },
        { pts: [[35.1603, 129.1932], [35.158, 129.1716]], opt: true },
      ],
    },
    "map-d6": {
      stops: [
        { num: 1, name: "釜山站（07:00–07:30 KTX）", lat: 35.1152, lon: 129.0403 },
        { num: 2, name: "首尔站（站内机动 40 分钟 → AREX）", lat: 37.5547, lon: 126.9726 },
        { num: 3, name: "仁川机场 T1（14:30 起飞）", lat: 37.4602, lon: 126.4407 },
      ],
      lines: [
        { pts: [[35.1152, 129.0403], [37.5547, 126.9726], [37.4602, 126.4407]] },
      ],
    },
  };

  Object.entries(DAYS).forEach(([id, cfg]) => {
    const el = document.getElementById(id);
    if (!el) return;

    const map = L.map(el, { scrollWheelZoom: false });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    cfg.stops.forEach((s) => {
      L.marker([s.lat, s.lon], { icon: pin(s.num, s.opt) })
        .addTo(map)
        .bindPopup(s.name);
    });

    (cfg.lines || []).forEach((line) => {
      L.polyline(line.pts, {
        color: line.opt ? GRAY : ACCENT,
        weight: 3,
        opacity: 0.9,
        dashArray: line.opt ? "6 6" : null,
      }).addTo(map);
    });

    map.fitBounds(L.latLngBounds(cfg.stops.map((s) => [s.lat, s.lon])), {
      padding: [30, 30],
    });
  });
});
