# Tip Calculator / 小费计算器

A responsive tip calculator built with plain HTML, CSS and JavaScript. No dependencies, installation or build step. 金额以 HKD 显示，支持小费计算、平均分账及输入错误提示。

## Run locally / 本地打开

1. Extract the ZIP and open the `tip-calculator` folder. 解压压缩包，打开项目文件夹。
2. Double-click `index.html` to open it in your browser. 双击即可使用，无需联网。
3. Keep `index.html`, `styles.css` and `script.js` together in the same folder.

## Check the calculator / 检查功能

Choose a tip of 10%, 15% or 20%, enter the bill and number of people, then select **Calculate split**. Results show the tip, total and total per person to two decimal places.

| Bill / 账单 | Tip / 小费比例 | People / 人数 | Tip amount / 小费金额 | Total / 总额 | Per person / 人均 |
| --- | --- | --- | --- | --- | --- |
| 80.00 | 15% | 3 | 12.00 | 92.00 | 30.67 |

Also try an empty or negative bill, and empty, zero or negative people. Invalid inputs should show a helpful message instead of `NaN` or `Infinity`. More checks are listed in `TESTS.md`.

请亲自测试上表及异常输入。`30.67` 是四舍五入后的显示值，不代表已实现逐人尾差分配。

## Publish on GitHub Pages / 发布网页

1. Sign in to GitHub and create a **Public** repository named `tip-calculator`.
2. Choose **Add file → Upload files**. Open the extracted project folder and upload these **six files to the repository root**:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `README.md`
   - `REFLECTION.md`
   - `TESTS.md`
3. Commit the uploaded files to `main`.
4. Open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**. Set the branch to **main** and the folder to **/(root)**, then select **Save**.
5. Wait for deployment to finish. Copy the actual website URL displayed by GitHub Pages and open it to test the calculator. Keep the repository URL too.

**上传的是解压后文件夹里面的六个文件。**仓库首页应直接看到 `index.html`；不要只上传 ZIP，也不要再套一层 `tip-calculator` 文件夹。网站地址以 GitHub Pages 实际显示的链接为准。

The included `tests` folder is optional for hosting. Upload it too if you want to keep the automated checks with your source code. `tests` 文件夹可一并上传，网页运行不依赖它。

## Submit on Moodle / Moodle 提交

In the assignment's **Online text** field, paste:

- Your actual published website URL / 实际网站链接。
- Your actual GitHub repository URL / 实际仓库链接。
- Your short reflection, adapted from `REFLECTION.md` to describe your own experience and checks / 按真实操作与验证经历修改后的简短反思。

Save the text and complete any final submission action shown by Moodle. This package was prepared with Codex; `REFLECTION.md` states that provenance and does not claim that you have already completed the four Cursor interactions.

## Files / 文件说明

| File | Purpose / 用途 |
| --- | --- |
| `index.html` | Page structure / 页面结构 |
| `styles.css` | Responsive styling / 响应式样式 |
| `script.js` | Calculations and validation / 计算与输入验证 |
| `README.md` | Local use, publishing and submission / 使用与发布说明 |
| `REFLECTION.md` | Short reflection to personalize / 待按真实经历完善的反思 |
| `TESTS.md` | Test cases and verification notes / 测试记录与核验说明 |
