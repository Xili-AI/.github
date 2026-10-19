<style>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Silkscreen&family=VT323&family=Noto+Sans+SC:wght@400;700&display=swap');
:root{--xl-blue:#3a6ed8;--xl-cyan:#5fd3f3;--xl-deep:#0b1b3a;--xl-violet:#7c5cff;--xl-pix:'Press Start 2P','Silkscreen',monospace;--xl-mono:'VT323','Consolas',monospace;}
.markdown-body{color:#c9dcff;}
.xl-head{display:inline-block;padding:12px 28px;margin:26px 0 18px;font-family:var(--xl-pix);font-size:19px;line-height:1.6;color:#fff;background:linear-gradient(180deg,#5b9bd5 0%,#2f60c4 48%,#1d3f8f 52%,#16307a 100%);border:3px solid #0b1b3a;border-radius:8px;text-shadow:0 3px 0 #0b1b3a,0 0 22px rgba(95,211,243,.65);box-shadow:0 6px 0 #0b1b3a,0 12px 30px rgba(0,0,0,.55);}
.xl-sub{display:block;margin:-8px 0 20px;font-family:var(--xl-mono);font-size:22px;letter-spacing:2px;color:var(--xl-cyan);text-shadow:0 0 14px rgba(95,211,243,.5);}
.xl-float{animation:xl-float 4.2s ease-in-out infinite;filter:drop-shadow(0 14px 22px rgba(0,0,0,.6)) drop-shadow(0 0 18px rgba(78,168,255,.35));}
@keyframes xl-float{0%,100%{transform:translateY(0) rotate(-1.5deg);}50%{transform:translateY(-16px) rotate(1.5deg);}}
.xl-term{max-width:780px;margin:0 auto;text-align:left;background:linear-gradient(180deg,#0d1a33 0%,#08111f 100%);border:2px solid #2a4d8f;border-radius:12px;overflow:hidden;box-shadow:0 20px 44px rgba(0,0,0,.6),inset 0 0 60px rgba(58,110,216,.16);}
.xl-term-bar{display:flex;align-items:center;gap:8px;padding:10px 14px;background:#0a1428;border-bottom:1px solid #22386b;}
.xl-dot{width:12px;height:12px;border-radius:50%;display:inline-block;}
.xl-term-body{padding:16px 18px;font-family:var(--xl-mono);font-size:19px;line-height:1.65;color:#9fd6ff;}
.xl-cmd{color:var(--xl-cyan);}.xl-key{color:#c08cff;}.xl-val{color:#7ef2a8;}
.xl-caret{display:inline-block;width:9px;height:15px;background:var(--xl-cyan);vertical-align:-2px;margin-left:3px;animation:xl-blink 1.05s steps(1) infinite;}
@keyframes xl-blink{0%,49%{opacity:1}50%,100%{opacity:0}}
.xl-badge{display:inline-block;padding:6px 14px;margin:5px;font-family:var(--xl-mono);font-size:20px;letter-spacing:1px;color:#cfe8ff;background:linear-gradient(180deg,#16295a,#0a1730);border:2px solid #2f60c4;border-radius:6px;box-shadow:0 4px 0 #060b18,inset 0 0 12px rgba(95,211,243,.22);transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease;}
.xl-badge:hover{transform:translateY(-4px);border-color:var(--xl-cyan);box-shadow:0 8px 0 #060b18,0 0 22px rgba(95,211,243,.5);}
.xl-grid{display:flex;justify-content:center;gap:22px;flex-wrap:wrap;margin:14px 0;}
.xl-mini{flex:1 1 250px;max-width:300px;text-align:left;padding:18px;border-radius:14px;background:linear-gradient(160deg,#132449 0%,#0a1428 100%);border:2px solid #24467f;box-shadow:0 10px 24px rgba(0,0,0,.45);transition:transform .3s ease,border-color .3s ease,box-shadow .3s ease;}
.xl-mini:hover{transform:translateY(-8px) rotateX(6deg);border-color:var(--xl-cyan);box-shadow:0 18px 34px rgba(0,0,0,.55),0 0 26px rgba(95,211,243,.32);}
.xl-mini h3{font-size:13px;margin:0 0 10px;font-family:var(--xl-pix);color:#fff;}
.xl-mini p{font-size:14px;color:#a9c7f5;margin:0;line-height:1.75;}
.markdown-body code{background:rgba(95,211,243,.12);color:#8fe6ff;padding:2px 6px;border-radius:4px;font-family:var(--xl-mono);font-size:16px;}
.markdown-body table{width:100%;border-collapse:separate;border-spacing:0;}
.markdown-body th{background:#132449;color:#fff;font-family:var(--xl-pix);font-size:12px;}
.markdown-body td{background:#0b1730;color:#bcd6fb;font-size:14px;}
.markdown-body tr:nth-child(even) td{background:#0e1d3d;}
.xl-link{color:#8fe6ff;text-decoration:none;border-bottom:1px dashed rgba(143,230,255,.5);}
</style>

<div align="center">

<img src="assets/image/logo.png" width="400" alt="XILI-AI" />

<br>

<img class="xl-float" src="assets/image/3D.png" width="140" alt="XILI-AI Pixel Robot" />

</div>

<div class="xl-term">
  <div class="xl-term-bar">
    <span class="xl-dot" style="background:#ff5f57"></span>
    <span class="xl-dot" style="background:#febc2e"></span>
    <span class="xl-dot" style="background:#28c840"></span>
  </div>
  <div class="xl-term-body">
    <div><span class="xl-cmd">➜</span> <span class="xl-key">cat</span> profile/README.md</div>
    <div><span class="xl-cmd">➜</span> <span class="xl-key">note</span> <span class="xl-val">组织主页由该文件渲染</span></div>
    <div><span class="xl-cmd">➜</span> <span class="xl-key">status</span> — <span class="xl-val">pixel + 3D + self-hosted stats</span><span class="xl-caret"></span></div>
  </div>
</div>

<div align="center">

<span class="xl-head">REPO LAYOUT</span>
<span class="xl-sub">仓库结构</span>

</div>

| 路径 | 说明 |
| --- | --- |
| `profile/README.md` | ⭐ **组织主页源码**，GitHub 在 `github.com/Xili-AI` 渲染它 |
| `assets/image/logo.png` | 像素风字标 XILI-AI |
| `assets/image/3D.png` | 像素机器人 400×400 |
| `assets/stats/snapshot.json` | 最近一次抓取的组织数据快照（离线渲染用） |
| `tools/gen-stats.js` | 自研统计生成器：直读 GitHub API，注入主页 |
| `tools/preview.js` | 本地预览：Markdown → GitHub 主题 HTML |
| `preview.html` | 预览产物（已提交，方便直接浏览） |
| `docs/SETUP-GUIDE.md` | 🛠 部署与维护指南 |
| `.github/workflows/update-stats.yml` | 定时自动刷新主页数据 |

<div align="center">

<span class="xl-head">HOW TO EDIT</span>
<span class="xl-sub">修改主页的三个入口</span>

</div>

<div class="xl-grid">
  <div class="xl-mini">
    <h3>1. 改文案</h3>
    <p>直接编辑 <code>profile/README.md</code>。介绍、项目卡片、团队方向都在这个文件里。</p>
  </div>
  <div class="xl-mini">
    <h3>2. 改样式</h3>
    <p>文件顶部的 <code>&lt;style&gt;</code> 块是全部视觉变量：<code>--xl-blue</code>、<code>--xl-cyan</code>、<code>--xl-violet</code> 改配色，<code>@keyframes</code> 改动效。</p>
  </div>
  <div class="xl-mini">
    <h3>3. 改数据</h3>
    <p>统计区由 <code>tools/gen-stats.js</code> 自动注入，<code>npm run stats</code> 重新抓取，<code>npm run stats:offline</code> 用快照重绘。</p>
  </div>
</div>

<div align="center">
  <span class="xl-badge">Python</span>
  <span class="xl-badge">LLM / RAG</span>
  <span class="xl-badge">Knowledge Graph</span>
  <span class="xl-badge">Computer Vision</span>
</div>

<p align="center" style="color:#8fb3e8;">
  完整维护指南见 <a class="xl-link" href="docs/SETUP-GUIDE.md">docs/SETUP-GUIDE.md</a> ·
  本地预览：<code>npm install &amp;&amp; npm run preview</code> ·
  组织主页 <a class="xl-link" href="https://github.com/Xili-AI">github.com/Xili-AI</a>
</p>
