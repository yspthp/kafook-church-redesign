# 迦福堂 · 獨立美術重設試作

此專案是 yspthp/kafook-church 的**獨立副本**，來源 commit：506a182fee89907d02e01f3d124404c79accd950。原 GitHub 專案未修改；此目錄不含原專案的 Git remote 或 .git。

## 預覽
直接開啟 index.html，或安裝 Node.js 後執行 `node serve.cjs`，瀏覽 http://localhost:4173。
無需安裝套件，7 個頁面均為靜態 HTML。字體使用 Google Fonts，無網路時自動使用系統字體；全部插畫均在本機。

## 設計
- 暖白、森林綠、古金色，中文襯線與編輯式排版。
- 原創 SVG 拱門光影及橄欖枝意象（非實景），無第三方照片依賴。
- 完整重構首頁；6 個內頁統一品牌、導航、頁首、卡片、表單及頁尾。
- 手機選單、鍵盤操作、略過導覽、減少動態偏好、消息篩選、複製資訊。

## 檔案
index.html：新版首頁；about / events / news / prayer / giving / contact.html：內頁。
css/redesign.css：新版設計系統；js/redesign.js：輔助互動與無障礙。
images/grace-arch.svg、olive.svg、brand.svg：新增原創向量素材。
