# 十一四选一旅游攻略网站 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用纯静态 HTML/CSS/JS 做出可手机浏览的「首页对比 + 四个完整攻略详情页」，浅色好看，并配上本地美食/景点图片。

**Architecture:** 无构建的多页静态站。共享 `assets/css/main.css` 与 `assets/js/main.js`；每页独立 HTML，内容从现有 Markdown 完整移植；图片下载到 `assets/images/<city>/`。

**Tech Stack:** HTML5 · CSS3（自定义属性、移动优先）· 原生 JS · Google Fonts（Fraunces + DM Sans）· 本地图片资源

## Global Constraints

- 无构建工具、无 React、无后端
- 浅色背景 `#F7F5F2`；四目的地 accent：山西 `#B45309`、两湖 `#0F766E`、闽南 `#0369A1`、成渝 `#C2410C`
- 签名元素：目的地色条 + 大衬线地名；Hero 全宽大图，不叠浮层贴纸
- 内容以各 `攻略.md` / `README.md` 为准完整移植，不改结论与票价
- 手机优先（375px 可用）；尊重 `prefers-reduced-motion`
- 项目当前不是 git 仓库：跳过 commit 步骤，除非用户随后要求 `git init` + 提交
- 设计依据：`docs/superpowers/specs/2026-07-24-travel-guide-website-design.md`

---

## File Structure

```
旅游攻略/
├── index.html
├── shanxi.html
├── wuhan-changsha.html
├── fuzhou-quanzhou.html
├── chengdu-chongqing.html
└── assets/
    ├── css/main.css
    ├── js/main.js
    └── images/
        ├── home/
        ├── shanxi/
        ├── wuhan-changsha/
        ├── fuzhou-quanzhou/
        └── chengdu-chongqing/
```

每个 HTML 页职责：自身内容与语义结构。  
`main.css`：全站 token、布局、组件、响应式。  
`main.js`：锚点高亮、滚动显隐、可选日卡交互。

---

### Task 1: 脚手架 + 设计 token CSS

**Files:**
- Create: `assets/css/main.css`
- Create: `assets/js/main.js`（空壳 + DOMContentLoaded）
- Create: `index.html`（最小骨架，链上 css/js）
- Create: `assets/images/{home,shanxi,wuhan-changsha,fuzhou-quanzhou,chengdu-chongqing}/` 目录

**Interfaces:**
- Produces: CSS 变量 `--bg --surface --ink --muted --line --accent-shanxi --accent-wuhan --accent-fujian --accent-chengyu`；工具类 `.container` `.section` `.btn` `.site-header`；`body[data-theme="shanxi|wuhan|fujian|chengyu"]` 切换 `--accent`

- [ ] **Step 1: 创建图片目录**

```bash
mkdir -p assets/css assets/js \
  assets/images/{home,shanxi,wuhan-changsha,fuzhou-quanzhou,chengdu-chongqing}
```

- [ ] **Step 2: 写入 `assets/css/main.css` 核心 token 与基础排版**

必须包含：上述 CSS 变量；`html { scroll-behavior: smooth; }`；body 雾白底、`DM Sans` + 中文系统回退；`.display` 用 `Fraunces`；`.container` max-width 1080px、左右 padding 1.25rem；`.site-header` sticky；`.btn` / `.btn-primary`；`.hero` 全宽图 + 下方标题区（图上不叠 badge）；`@media (prefers-reduced-motion: reduce)` 关闭动画。

Google Fonts link 写在 HTML 里，不写在 CSS：

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap" rel="stylesheet">
```

- [ ] **Step 3: 写入最小 `index.html` 骨架**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>2026 十一 · 四选一</title>
  <!-- fonts + assets/css/main.css -->
</head>
<body>
  <header class="site-header">…</header>
  <main></main>
  <script src="assets/js/main.js"></script>
</body>
</html>
```

- [ ] **Step 4: 写入 `assets/js/main.js` 空壳**

```js
document.addEventListener('DOMContentLoaded', () => {
  // Task 6 填充：reveal、锚点、移动导航
});
```

- [ ] **Step 5: 本地打开验证**

Run: `open index.html`（或 `python3 -m http.server 8765`）  
Expected: 白/雾白页、字体加载、无控制台 404（css/js）

---

### Task 2: 下载美食与景点图片

**Files:**
- Create: `assets/images/**/*.jpg`（或 webp）

**Interfaces:**
- Produces: 固定文件名供 HTML `src` 引用（下列清单不得改名，除非同步改 HTML）

图片清单（优先 Unsplash / Wikimedia Commons，下载到本地，勿长期热链）：

| 路径 | 内容关键词 |
|---|---|
| `home/hero.jpg` | 中国旅行 / 高铁窗景 / 秋日旅行氛围（浅色友好） |
| `shanxi/hero.jpg` | 平遥古城墙 / 夜景 |
| `shanxi/jinci.jpg` | 晋祠 |
| `shanxi/museum.jpg` | 山西博物院或古建展陈氛围 |
| `shanxi/shuanglin.jpg` | 双林寺或彩塑氛围 |
| `shanxi/noodles.jpg` | 刀削面 |
| `shanxi/beef.jpg` | 平遥牛肉或山西菜 |
| `shanxi/youmian.jpg` | 莜面/栲栳栳或面食 |
| `wuhan-changsha/hero.jpg` | 长沙橘子洲或武汉长江 |
| `wuhan-changsha/hubei-museum.jpg` | 博物馆/编钟氛围 |
| `wuhan-changsha/donghu.jpg` | 东湖 |
| `wuhan-changsha/yuelu.jpg` | 岳麓山/橘子洲 |
| `wuhan-changsha/reganmian.jpg` | 热干面 |
| `wuhan-changsha/stinky-tofu.jpg` | 长沙臭豆腐 |
| `wuhan-changsha/crayfish.jpg` | 口味虾或湘菜 |
| `fuzhou-quanzhou/hero.jpg` | 泉州开元寺双塔或三坊七巷 |
| `fuzhou-quanzhou/sanfang.jpg` | 三坊七巷 |
| `fuzhou-quanzhou/gushan.jpg` | 鼓山/闽江 |
| `fuzhou-quanzhou/qingyuan.jpg` | 清源山老君岩 |
| `fuzhou-quanzhou/fishball.jpg` | 福州鱼丸 |
| `fuzhou-quanzhou/mianxian.jpg` | 面线糊 |
| `fuzhou-quanzhou/duck.jpg` | 姜母鸭 |
| `chengdu-chongqing/hero.jpg` | 洪崖洞夜景或宽窄巷子 |
| `chengdu-chongqing/panda.jpg` | 大熊猫 |
| `chengdu-chongqing/wuhou.jpg` | 武侯祠红墙 |
| `chengdu-chongqing/liziba.jpg` | 李子坝轻轨穿楼 |
| `chengdu-chongqing/hotpot.jpg` | 火锅 |
| `chengdu-chongqing/xiaomian.jpg` | 重庆小面 |
| `chengdu-chongqing/串串或小吃.jpg` → 用 `skewer.jpg` | 串串/担担面 |

- [ ] **Step 1: 用 WebSearch / 直链找到可下载图源 URL**

对每个文件选一张清晰横图（Hero 优先 1600px+ 宽）。

- [ ] **Step 2: `curl -L` 下载到对应路径**

```bash
curl -L "URL" -o assets/images/shanxi/hero.jpg
# …其余同理
```

- [ ] **Step 3: 抽查文件非空**

```bash
find assets/images -type f -size -10k
```

Expected: 无输出（没有过小的失败下载）

若某主题找不到可用图：用语义接近的高质量图，文件名仍按上表，并在 alt 写真实内容。

---

### Task 3: 完成首页 `index.html`

**Files:**
- Modify: `index.html`
- Modify: `assets/css/main.css`（首页专用：`.score-table` `.dest-card` `.verdict` `.timeline`）

**Interfaces:**
- Consumes: CSS token、图片 `assets/images/home/hero.jpg` 与四城 `*/hero.jpg`
- Produces: 可点击链到四个详情页的完整决策首页

- [ ] **Step 1: 顶栏**

品牌「十一四选一」+ 链接：山西 / 武汉·长沙 / 福州·泉州 / 成都·重庆（分别链到对应 html）。手机顶栏链接可横滑。

- [ ] **Step 2: Hero**

全宽 `home/hero.jpg`（或四城拼氛围的单一图）；其下大标题「2026 十一 · 四选一」；副文「淄博出发 · 两人同行 · 10.2—10.6 · 5 天 4 晚」；按钮「看对比」锚到 `#compare`。第一屏不放打分数字条。

- [ ] **Step 3: 结论块 `#verdict`**

移植 README「一句话结论」：加粗排序 + 成渝垫底原因那段。

- [ ] **Step 4: 打分表 `#compare`**

桌面：完整维度表（交通/美食×2/古迹/自然/人流/预算/加权总分）。  
手机：`.table-scroll` 横向滚动，第一列 `position: sticky`。美食列标注权重。

- [ ] **Step 5: 适合谁 + 四个入口卡**

四段短文 + 四张 `.dest-card`（色条 + 衬线地名 + hero 缩略图 + 预算标签），链到详情页。

- [ ] **Step 6: 行动日历**

五个时间节点列表（现在 / 9.18 / 9.22 / 9.26-28 / 出发前 3 天）。

- [ ] **Step 7: 浏览器检查 375 与 1280 宽度**

Expected: 表可滑、卡可点、Hero 不裁字、无横向整页溢出。

---

### Task 4: 详情页共享组件样式 + 山西页

**Files:**
- Modify: `assets/css/main.css`（`.page-hero` `.toc` `.day-card` `.food-grid` `.callout` `.itinerary-desktop` `.itinerary-mobile`）
- Create: `shanxi.html`

**Interfaces:**
- Consumes: `body[data-theme="shanxi"]` → `--accent: var(--accent-shanxi)`
- Produces: 详情页模板结构，供 Task 5 复制改内容

详情页 DOM 骨架（四页一致）：

```html
<body data-theme="shanxi">
  <header class="site-header">…返回对比…</header>
  <section class="page-hero">色条 + 衬线「山西」+ hero 图</section>
  <nav class="toc">亮点 交通 行程 每日 住宿 美食 提示 弹性</nav>
  <main class="container">
    <section id="highlights">…</section>
    <section id="transport">…</section>
    <section id="itinerary">桌面表 + 手机 day-card</section>
    <section id="days">D1–D5 全文</section>
    <section id="stay">…</section>
    <section id="food">food-grid 图文</section>
    <section id="tips">…</section>
    <section id="flex">…</section>
  </main>
  <footer>免责 + 其它目的地链接</footer>
</body>
```

- [ ] **Step 1: 补齐详情页 CSS 组件**

含：手机隐藏桌面表、桌面隐藏 day-card；`.food-grid` 2 列（≥640 3 列）；`.toc` sticky 横滑。

- [ ] **Step 2: 创建 `shanxi.html`，完整移植 `山西/攻略.md`**

所有章节、票价、车次、预约提示保留。美食/景点插对应本地图 + 准确 alt。

- [ ] **Step 3: 手机宽度检查山西页**

Expected: toc 可滑、行程 day-card 可读、长文间距舒适。

---

### Task 5: 其余三城详情页

**Files:**
- Create: `wuhan-changsha.html`（`data-theme="wuhan"`）
- Create: `fuzhou-quanzhou.html`（`data-theme="fujian"`）
- Create: `chengdu-chongqing.html`（`data-theme="chengyu"`）

**Interfaces:**
- Consumes: Task 4 的 DOM/CSS 约定与各自 `assets/images/...` 文件名

- [ ] **Step 1: 复制山西页结构为三页，替换主题色、文案、图片**

源：`武汉-长沙/攻略.md`、`福州-泉州/攻略.md`、`成都-重庆/攻略.md`。

- [ ] **Step 2: 交叉检查内链**

首页 ↔ 四详情；详情页「返回对比」→ `index.html`；footer 互链正确。

- [ ] **Step 3: 逐页抽查关键数字**

对照 md：山西动车约 4–4.5h/¥220；武长加权与 README 一致；清源山预约；熊猫基地 7 日票等。Expected: 与 md 一致。

---

### Task 6: JS 增强 + 动效 + 收尾验收

**Files:**
- Modify: `assets/js/main.js`
- Modify: `assets/css/main.css`（`.reveal` 动画）

**Interfaces:**
- Produces: `initReveal()`, `initTocSpy()`, 可选移动菜单无则横滑 toc 即可

- [ ] **Step 1: 实现滚动 reveal**

给 `.section` / `.dest-card` / `.day-card` 加 `.reveal`；IntersectionObserver 添加 `.is-visible`；`prefers-reduced-motion` 时直接显示。

- [ ] **Step 2: toc 锚点当前项高亮**

根据 `section[id]` 可见性给 `.toc a` 加 `.is-active`。

- [ ] **Step 3: 全站验收清单**

对照 spec §10：

- [ ] 首页含结论、打分、适合谁、四入口、行动日历
- [ ] 四详情章节齐全
- [ ] 375px 可读可点
- [ ] 四色区分成立、浅色主题
- [ ] 图片本地加载无裂图
- [ ] 无构建即可浏览

- [ ] **Step 4: 用浏览器打开首页与至少两详情页截图自检**

修掉明显间距/溢出/对比度问题。

---

## Self-Review

1. **Spec coverage:** Hero/对比/详情完整移植/本地图/响应式/动效/四色 — 均有对应 Task。  
2. **Placeholders:** 无 TBD；图片有固定文件名表。  
3. **Consistency:** `data-theme` 四值与 CSS 变量命名在 Task 1/4/5 一致。
