# 图片放置说明 / Where to drop images

图片放进对应文件夹后，**提交并推送**（或让我帮你推），网站重新构建后就会自动显示。
没放图片的地方会自动显示占位图案，不会出现裂图。

---

## 1. 主页 / 项目详情页的封面（每个项目一张）

封面是**脚本生成的矢量图**，不用手动放图：

```bash
node scripts/make-project-icons.mjs              # 重新生成全部封面
node scripts/make-project-icons.mjs xompress     # 只生成一张
```

- 每张图在 `scripts/make-project-icons.mjs` 里是一个函数，输出到 `public/images/projects/<slug>/thumbnail.svg`。
- 全部共用同一套底色、点阵、线条粗细和 Tokyo Night 配色（与 `src/styles/design-tokens.css` 同步），所以新项目照着已有函数写一个，风格就能对上。
- 加新项目：在脚本的 `ICONS` 里加一项，运行脚本，再把该项目 json 的 `"thumbnail"` 设为 `"thumbnail.svg"`。
- 想改用自己的图片：在该项目目录放 `thumbnail.png` / `thumbnail.jpg`，并把 json 里的 `"thumbnail"` 改成对应文件名。建议 16:10、深色底。
