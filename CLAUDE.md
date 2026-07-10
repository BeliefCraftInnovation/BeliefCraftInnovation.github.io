# CLAUDE.md

BeliefCraft Innovation 公司官网。**Hugo** 静态站点，部署到 GitHub Pages（自定义域名 `beliefcraft.cloud`）。

## 本地开发

```bash
hugo server          # 本地预览，默认 http://localhost:1313/
hugo --minify        # 生产构建
```

需要 **Hugo extended**。CI 固定用 `0.128.0`；本地版本更高也能构建，但会打印一些 deprecation 警告（`languageCode`/`languageName` 等），可忽略。

## 多语言（关键）

- 双语：**中文 `zh`（默认）+ 英文 `en`**，配置见 `config.toml`。
- `defaultContentLanguageInSubdir = true`，所以**中英文都带语言前缀**，URL 形如 `/zh/...`、`/en/...`（首页 `/zh/`、`/en/`，没有无前缀根路径）。
- 内容按语言后缀区分：`content/foo/_index.zh.md` 与 `content/foo/_index.en.md`。同名不同语言的文件会被 Hugo 自动识别为互为翻译。

## 内容与主题

- 站点内容是 `content/` 下的 Markdown，套用主题 `themes/bcitheme`（`layouts/_default/baseof.html` 提供全站 header/footer/CSS）。
- **项目根 `layouts/` 覆盖主题 `themes/bcitheme/layouts/`**。自定义页面时优先在根 `layouts/` 加模板，不要改主题。

## Swrrl 产品页（独立主题）

Swrrl（一款 iOS App）的页面**刻意脱离站点主题**，用自成一体的 HTML + 内联 CSS，只遵循 Swrrl 自己的品牌样式。模式：

- 内容页 `content/product/swrrl/*.{zh,en}.md`：front matter 设 `type: "swrrl"` + `layout: "xxx"`，文案全部走参数，模板保持语言无关。
- 模板 `layouts/swrrl/xxx.html`：完整独立 HTML，**不引用 `baseof.html`**；配色变量在顶部 CSS `:root`（`--swrrl-accent` 等，目前是占位品牌色）。
- 新增 Swrrl 页面时复用此模式，无需改站点主题。

## 部署

⚠️ **默认分支是 `master`，不是 `main`**（新增/修改 GitHub Actions workflow 的触发分支时注意）。
