# XILI-AI 组织主页 · 维护指南

> 苏州矽励科技有限公司 GitHub 组织主页（`github.com/Xili-AI`）的完整维护手册。
> 主页源码在 `profile/README.md`，本页说明**如何发布**、**如何改样式**、**数据如何自动更新**。
>
> **本页不依赖任何第三方渲染服务。** 主页上的每一个数字都由本仓库自带的
> `tools/gen-stats.js` 直读 GitHub REST API 生成 —— 闭源仓库的数据不会离开我们自己的工具链。

---

## 0. 目录

1. [仓库结构](#1-仓库结构)
2. [发布流程](#2-发布流程)
3. [数据管线：自研统计生成器](#3-数据管线自研统计生成器)
4. [配置 PAT](#4-配置-pat)
5. [本地预览](#5-本地预览)
6. [样式速查表](#6-样式速查表)
7. [排错清单](#7-排错清单)

---

## 1. 仓库结构

GitHub 的"组织主页"由**名为 `Xili-AI/.github` 的公开仓库**里的 `profile/README.md` 渲染。

```
Xili-AI/.github/
├── README.md                        # 仓库首页（说明 + 维护入口）
├── package.json                     # npm scripts
├── preview.html                     # 本地预览产物（已提交，可直接用浏览器打开）
├── profile/
│   └── README.md                    # ⭐ 组织主页源码
├── assets/
│   ├── image/
│   │   ├── logo.png                 # 像素风字标 269×60
│   │   └── 3D.png                   # 像素机器人 400×400
│   └── stats/
│       └── snapshot.json            # 最近一次抓取的数据快照（离线重绘用）
├── docs/
│   └── SETUP-GUIDE.md               # 本文件
├── tools/
│   ├── preview.js                   # Markdown → GitHub 主题 HTML
│   ├── gen-stats.js                 # 统计生成器（主入口）
│   └── lib/
│       ├── github.js                # GitHub REST API 客户端
│       └── render.js                # 3D 标记渲染器
└── .github/
    └── workflows/
        └── update-stats.yml         # 定时自动刷新
```

> ⚠️ **`assets/` 必须在 `.github` 仓库内部。**
> `profile/README.md` 比仓库根目录多一层，所以图片路径写成 `../assets/image/xxx.png`。
> 如果把图片放在仓库外，浏览器访问 `github.com/Xili-AI` 时会显示裂图。

---

## 2. 发布流程

```powershell
cd E:\Projects\Other\XiliProfile\.github
git add -A
git commit -m "feat: pixel + 3D org profile with self-hosted stats"
git push origin main
```

推送后等待 1～2 分钟，打开 <https://github.com/Xili-AI> 查看效果。

**改完样式建议先本地预览**，见 [5. 本地预览](#5-本地预览)。

### 2.1 别忘了 GitHub 后台的三处设置

这三项**不在仓库里**，在 GitHub 后台单独改：

| 位置 | 路径 | 建议内容 |
| --- | --- | --- |
| 组织简介（bio） | 组织页 → Settings → Profile | `视觉智能 + 大模型应用 · Silicon Insight Technology` |
| 组织网址 | 同上 | 官网 / 招聘页链接 |
| 仓库描述 | `Xili-AI/.github` → Settings → General → Description | `XILI-AI org profile · pixel + 3D landing page` |

---

## 3. 数据管线：自研统计生成器

### 3.1 它做什么

```
GitHub REST API
      │  GET /orgs/Xili-AI
      │  GET /orgs/Xili-AI/repos?type=all
      │  GET /orgs/Xili-AI/members
      │  GET /repos/Xili-AI/<repo>/languages
      │  GET /repos/Xili-AI/<repo>/stats/contributors
      ▼
tools/gen-stats.js
      │  聚合 → assets/stats/snapshot.json
      │  渲染 → 注入 profile/README.md 的标记区块
      ▼
profile/README.md
```

四个被注入的区块（用 HTML 注释包住，生成器只替换注释之间的内容）：

| 标记 | 位置 | 内容 |
| --- | --- | --- |
| `xili:meta` | 顶部徽章行 | Followers / Repos / Private / Members / Since |
| `xili:repos` | STATS 区 | 每个仓库一张 3D 数据卡 |
| `xili:languages` | STATS 区 | 语言分布 3D 条 |
| `xili:contributors` | CONTRIBUTORS 区 | 成员贡献 3D 柱状图 |

标记长这样：

```html
<!-- xili:contributors:begin -->
…生成的内容…
<!-- xili:contributors:end -->
```

> 手写 README 时**不要删掉这些注释**，否则生成器会直接报错退出。

### 3.2 常用命令

```powershell
# 实时抓取（需要 PAT）
npm run stats

# 用上次的快照重绘（离线，不碰网络）
npm run stats:offline

# 只抓取并打印，不写文件
npm run stats:dry
```

### 3.3 私有仓库为什么能统计到

`GET /orgs/{org}/repos?type=all` 在带 PAT 且 PAT 拥有 `repo` 权限时，**会返回私有仓库**。
这正是我们不用第三方统计服务的原因 —— 闭源仓库的提交量、成员贡献、语言分布，
只在我们自己的脚本里被读取和渲染。

贡献数来自 `GET /repos/{owner}/{repo}/stats/contributors`，
该接口按**默认分支**统计每个作者的提交数。首次调用可能返回 `202`（正在计算），
脚本会自动轮询重试。

---

## 4. 配置 PAT

### 4.1 手动运行需要

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens**
2. **Resource owner** 选 `Xili-AI`
3. **Repository access**：
   - 只想看闭源仓库的数据 → 选 **Only select repositories**，勾上 `Xili-ReportRAG`、`AutoLabel`
   - 想让组织所有成员都直接用 → 选 **All repositories**
4. **Permissions → Repository permissions**：
   | 权限 | 级别 | 用途 |
   | --- | --- | --- |
   | Contents | Read-only | 读仓库元数据、提交统计 |
   | Metadata | Read-only | 必选（自动带） |
   | Members | Read-only | 列组织成员（`/orgs/{org}/members`） |
5. Generate token → 复制。

### 4.2 环境变量

```powershell
$env:GITHUB_TOKEN = "github_pat_xxx"
$env:GITHUB_ORG  = "Xili-AI"     # 可选，默认就是 Xili-AI
npm run stats
```

### 4.3 自动运行（GitHub Actions）

工作流在 `.github/workflows/update-stats.yml`，每天 **03:17 UTC** 跑一次。

1. 仓库 → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
2. Name: `STATS_TOKEN`，Secret: 上面生成的 PAT
3. 保存即可。工作流会自行抓取 → 注入 → 重建 `preview.html` → 提交。

> 用 `STATS_TOKEN` 而不是内置的 `GITHUB_TOKEN`：内置 token 只能访问**当前**仓库，
> 拿不到 `Xili-ReportRAG` / `AutoLabel` 的数据，也列不出组织成员。

---

## 5. 本地预览

改样式时不用推送就能看效果：

```powershell
cd E:\Projects\Other\XiliProfile\.github
npm install          # 只装一个 marked
npm run preview      # 生成 preview.html（仓库根目录），用浏览器打开
```

`preview.html` 用 GitHub 深色主题渲染 `profile/README.md`，
把 `../assets/...` 映射到本地真实路径。悬停即可看到 3D 卡片翻转、柱状图抬升等动效。

> `preview.html` **是提交进仓库的**，可以直接在 GitHub 上预览，也能当静态页面分享。
> 每次改完 `profile/README.md` 记得重跑一次 `npm run preview`。

> `marked` 与 GitHub 的渲染结果绝大多数情况一致，但 GitHub 会对 HTML 做安全过滤，
> 个别标签可能表现不同，以线上为准。

---

## 6. 样式速查表

`profile/README.md` 顶部 `<style>` 块里的变量：

| 变量 | 当前值 | 用途 |
| --- | --- | --- |
| `--xl-blue` | `#3a6ed8` | 主蓝（边框、渐变、柱体） |
| `--xl-blue2` | `#5b9bd5` | 浅蓝渐变端 |
| `--xl-cyan` | `#5fd3f3` | 青色高光、辉光 |
| `--xl-deep` | `#0b1b3a` | 深蓝（像素 3D 描边） |
| `--xl-ink` | `#060b18` | 近黑（投影、卡片底） |
| `--xl-glow` | `#4ea8ff` | 辉光色 |
| `--xl-violet` | `#7c5cff` | 紫色（卡片背面、渐变端） |
| `--xl-pix` | `Press Start 2P` 等 | 像素字体（标题、仓库名） |
| `--xl-mono` | `VT323` 等 | 终端 / 徽章 / 数字字体 |
| `--xl-body` | `Noto Sans SC` 等 | 中文正文 |

常用类名：

| 类名 | 作用 |
| --- | --- |
| `.xl-head` / `.xl-sub` | 像素风大标题 + 副标题 |
| `.xl-divider` | 像素分隔线 |
| `.xl-float` | 上下浮动动画（logo / 机器人） |
| `.xl-type` | 自研打字机（`steps()` + `ch` 宽度，无外部服务） |
| `.xl-term` / `.xl-caret` | 终端窗口 + 闪烁光标 |
| `.xl-badge` | 立体徽章（悬停升起） |
| `.xl-chip-stage` / `.xl-cpu-tilt` | 3D CPU 芯片舞台（透视 + 倾角 + 浮动） |
| `.xl-cpu-top` / `.xl-cpu-face` | 芯片封装顶面 / 侧壁（侧壁靠 `transform-origin` 折出厚度） |
| `.xl-cpu-die` | 裸片：电流光带 + 栅格电路纹 |
| `.xl-cpu-pins` | 四边金手指 |
| `.xl-cpu-mark` | 印在封装上的 logo |
| `.xl-spark` | 电流粒子（`--x --y --dx --dy --i` 控制位置与错峰） |
| `.xl-cards` / `.xl-card` / `.xl-face` | 3D 翻转卡片（项目区） |
| `.xl-chip` | 技术栈小标签 |
| `.xl-repos` / `.xl-repo` | 生成的仓库数据卡（悬停 3D 倾斜） |
| `.xl-langrow` / `.xl-langtrack` | 语言分布 3D 条 |
| `.xl-chart` / `.xl-bar` / `.xl-chart-floor` | 贡献者 3D 柱状图 |
| `.xl-mini` | 通用小卡片（悬停 3D 倾斜） |

### 6.1 3D 柱状图是怎么搭的

```
.xl-chart-scene   perspective:1100px  +  transform: rotateX(-8deg)  +  preserve-3d
  .xl-chart-floor   rotateX(-90deg)  →  地面网格（枢轴在 top，向后延伸）
  .xl-bar           preserve-3d
    .xl-bar-front   正面
    .xl-bar-cap     rotateX(-90deg)  →  顶面（枢轴在 top，向后延伸）
    .xl-bar-side    rotateY(-90deg)  →  侧面（枢轴在 right，向后延伸）
```

三个面都靠 `transform-origin` 钉在柱子的棱上，所以旋转出来的立体感是真实的 3D 投影，
不是贴图。改的时候注意**枢轴位置和旋转符号要成对改**，否则面会飘走。

### 6.2 3D CPU 芯片是怎么搭的

```
.xl-chip-stage   perspective:1200px
  .xl-cpu-tilt     transform: rotateX(34deg) rotateZ(-14deg)  +  preserve-3d
    .xl-cpu        preserve-3d
      .xl-cpu-top    translateZ(26px)                    → 封装顶面
        .xl-cpu-pins  贴在顶面四周的金手指
        .xl-cpu-die   裸片（电流光带 + 粒子 + 机器人）
        .xl-cpu-mark  印在封装上的 logo
      .xl-cpu-front  translateZ(26px) rotateX(-90deg)    → 前侧壁
      .xl-cpu-right  translateZ(26px) rotateY(90deg)     → 右侧壁
```

要点：

1. **侧壁的枢轴在棱上**，不在元素中心。`transform-origin: top center` / `left center`
   把侧壁钉在顶面的棱上，再转 90° 就自然折出芯片厚度。改 `transform-origin` 时，
   旋转符号要一起改，否则侧壁会飘到别处。
2. **`filter` 会把 3D 上下文拍平**。所以顶面用 `mix-blend-mode: screen` 的叠加层做
   明暗脉冲（`.xl-cpu-top::after`），侧壁才用 `filter: brightness()` —— 侧壁没有 3D 子元素，
   拍平无所谓。
3. **明暗脉冲周期统一为 3.6s**：芯片亮度、辉光、光带、电流粒子、扩散能量环共用这一个周期，
   所以每次"亮一下"所有电流都正好冲到峰值。改周期要一起改这 5 处 `@keyframes`。
4. 侧壁的 `filter` 亮度最低到 0.66，看起来是真实的金属反光，不要再叠加 `opacity` 动画，
   否则芯片会整块消失。

### 6.2 字体

Google Fonts 通过 `<style>` 里的 `@import` 引入 —— GitHub 会过滤 `<link rel="stylesheet">`，
但 `@import` 有效。

**如果字体没加载**（例如内网环境拦截了 fonts.googleapis.com）：

1. 改用系统等宽字体兜底：`--xl-mono: Consolas, monospace`，观感会退化但不破版；
2. 或者把标题做成 PNG 图片；
3. 验证方法：浏览器 F12 → Network，看 `fonts.googleapis.com` / `fonts.gstatic.com` 是否 200。

---

## 7. 排错清单

### 7.1 图片裂开

- 确认 `assets/image/` 在 **`.github` 仓库内部**。
- `profile/README.md` 里路径是 `../assets/image/xxx.png`（多一层 `..`）。
- 用 raw 链接验证图片本身：
  `https://raw.githubusercontent.com/Xili-AI/.github/main/assets/image/logo.png`
- 仓库是 **private** 的话外部一律 404 —— 组织主页仓库必须是 **public**。

### 7.2 3D 翻转不生效

三个属性缺一不可：

```
父级 .xl-cards   →  perspective
中间 .xl-card-inner →  transform-style: preserve-3d
正反面 .xl-face  →  backface-visibility: hidden
```

### 7.3 柱状图面飘了 / 挤在一起

见 [6.1](#61-3d-柱状图是怎么搭的) —— 枢轴和旋转符号要成对修改。

### 7.4 统计区没数据

- 确认 `npm run stats` 的输出里 `repos` 数量对不对；闭源仓库看不到就是 PAT 权限不够（见 [4.1](#41-手动运行需要)）。
- `members` 为 0 → PAT 缺 `Members: Read-only`。
- 贡献数为 0 → `/stats/contributors` 对**空仓库**或**首次计算**会返回 202/空，脚本会重试；
  仍为空时检查仓库是否至少有一个默认分支上的提交。

### 7.5 动效太吵 / 性能差

- README 页面本身就重，**同时运行的动画不要超过 3～4 个**。
- 优先用 `transform` / `opacity`（GPU 合成），避免动画 `width` / `height` / `top`。
- 已经预留了系统偏好支持：

  ```css
  @media (prefers-reduced-motion: reduce){
    .xl-float,.xl-stack,.xl-blink,.xl-type{animation:none !important;}
  }
  ```

### 7.6 移动端挤成一团

GitHub 手机版会缩小 README。解决：调小 `.xl-card` 的 `width`（当前 340px）、
调小 `.xl-bar` 的 `flex` 基准（当前 54px），或给 `.xl-cards` 加移动端单列规则。

### 7.7 生成器报错 `marker "xili:xxx" not found`

README 里的标记注释被删掉了。恢复：

```html
<!-- xili:repos:begin -->
<!-- xili:repos:end -->
```

### 7.8 提交后线上没变化

- GitHub 对组织主页有几分钟的缓存延迟。
- 确认分支是 `main`，且 `profile/README.md` 在仓库的 `profile/` 目录下。
- 确认仓库名是 `Xili-AI/.github`（斜杠前的名字必须和 org 名完全一致）。
