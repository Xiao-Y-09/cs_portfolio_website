# 图片放置说明 / Where to drop images

图片放进对应文件夹后，**提交并推送**（或让我帮你推），网站重新构建后就会自动显示。
没放图片的地方会自动显示占位图案，不会出现裂图。

---

## 1. 主页 / 项目详情页的封面（每个项目一张）

放到：`public/images/projects/<slug>/thumbnail.png`

| 项目 | 放这里 |
|------|--------|
| Xompress | `public/images/projects/xompress/thumbnail.png` |
| FF&E Reader | `public/images/projects/ffe-reader/thumbnail.png` |
| Harvestly | `public/images/projects/harvestly/thumbnail.png` |
| Multi-Agent Scaffold | `public/images/projects/multiagent-scaffold/thumbnail.png` |
| 小六爻 | `public/images/projects/xiaoliuyao/thumbnail.png` |
| Medium Daily Digest | `public/images/projects/medium-daily-digest/thumbnail.png` |

- 文件名必须是 `thumbnail.png`（对应各 json 里的 `"thumbnail"` 字段）。
- 想用 `.jpg`？把图命名为 `thumbnail.jpg`，并把该项目 json 里的 `"thumbnail": "thumbnail.png"` 改成 `"thumbnail.jpg"`。
- 建议比例约 16:10（卡片就是这个比例，会以 `cover` 裁切填满）。

## 2. 主页名字右边的图案（换成你的照片/图片）

放到：`public/images/avatar.png`

- 文件名必须是 `avatar.png`（对应 `src/data/profile.json` 里的 `"avatar"` 字段）。
- 没有这个文件时，右边显示原来的几何图案；放了就自动换成图片。
- 建议接近正方形；显示宽度上限 280px。
