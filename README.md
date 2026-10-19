# Xili-AI/.github

**XILI-AI 组织主页仓库** —— 苏州矽励科技有限公司（Silicon Insight Technology）

[![XILI-AI](assets/image/logo.png)](https://xili-ai.github.io/)

组织主页源码在 [`profile/README.md`](profile/README.md)，GitHub 会把它渲染到 [github.com/Xili-AI](https://github.com/Xili-AI)。

**[进入官网 →](https://xili-ai.github.io/)**

---

## 仓库结构

| 路径 | 说明 |
| --- | --- |
| `profile/README.md` | ⭐ **组织主页源码**，GitHub 在 `github.com/Xili-AI` 渲染它 |
| `assets/image/logo.png` | 像素风字标 XILI-AI |
| `assets/image/3D.png` | 像素机器人 400×400 |
| `assets/stats/snapshot.json` | 最近一次抓取的组织数据快照（离线重绘用） |
| `tools/gen-stats.js` | 自研统计生成器：直读 GitHub API，注入主页 |
| `tools/preview.js` | 本地预览：Markdown → GitHub 主题 HTML |
| `preview.html` | 预览产物（已提交，方便直接浏览） |
| `docs/SETUP-GUIDE.md` | 部署与维护指南 |
| `.github/workflows/update-stats.yml` | 定时自动刷新主页数据 |

## 两个仓库的分工

| 仓库 | 用途 | 技术自由度 |
| --- | --- | --- |
| `Xili-AI/.github` | GitHub **组织主页** | 纯 Markdown —— GitHub 的净化器会剥掉样式块、行内样式、class 属性、内联 SVG 和 iframe |
| `Xili-AI/Xili-AI.github.io` | **官网**（GitHub Pages） | 完整 HTML + CSS + JS —— 3D、动效、悬停全部可用 |

主页只负责"介绍 + 引导"，视觉与动效全部放在官网上。

## 本地预览

```bash
npm install
npm run preview
```

生成 `preview.html`（仓库根目录），用浏览器打开即可。改完 `profile/README.md` 记得重跑一次。

## 刷新数据

```bash
npm run stats          # 直读 GitHub API（需要 GITHUB_TOKEN）
npm run stats:offline  # 用 assets/stats/snapshot.json 重绘，不联网
```

完整说明见 [`docs/SETUP-GUIDE.md`](docs/SETUP-GUIDE.md)。
