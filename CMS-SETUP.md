# 動態 CMS／會友專區部署說明

這一版是在現有靜態網站上增量加入 Supabase 動態內容、會友登入與幹事 CMS。

## 必須先做一次
1. 在 Supabase SQL Editor 執行 `supabase-schema.sql`。
2. 確認 `member-documents` bucket 存在且保持 private；SQL 內的 Storage RLS 會保護 PDF。
3. 重新執行 SQL 最後的 admin seed，讓 `admin_test@kfphc.org` 的 Auth 使用者擁有 `admin` profile。
4. GitHub Pages 等待新 commit 建置完成。

前端只使用 Supabase anon key；不要把 service-role key 放進 GitHub 或瀏覽器。真正的安全邊界是資料表和 Storage 的 RLS，不是頁面上的登入畫面。

## 新頁面
- `members.html`：電郵／密碼登入、會友通告與受保護 PDF 簽名下載。
- `admin.html`：只供 `staff`／`admin` 發佈通告、活動、代禱事項和 PDF。

## 動態行為
現有首頁、`news.html`、`events.html`、`prayer.html` 會自動載入資料庫內容；資料庫尚無資料或連線失敗時，保留原本固定內容，並顯示輕量狀態訊息。

## 重要限制
- 這個 GitHub Pages 版本沒有自訂後端；Supabase 是資料庫、Auth 和 Storage。
- admin 使用者必須先存在於 Supabase Auth，再以 `supabase-schema.sql` 建立 `profiles` 角色。
- admin 表單目前支援建立，不含刪除／編輯列表；避免未經審核的破壞性操作。
- 公開表單不會把匿名代禱寫入資料庫；代禱內容由 staff CMS 發佈，避免未經審核內容直接公開。
- 請先以測試資料驗證 RLS，再輸入正式會友資料或文件。
