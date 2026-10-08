# MetaWall 後端 QA 紀錄

日期：2026-10-08。範圍：維持 Express / MongoDB / Imgur、原 API 路徑與成功回應格式，修正實際資料與權限缺陷，不遷移既有資料。

## 環境與兩輪驗證

- 原版 `37b42ed888dc85809a4eff66e889a2529780446a`，Node 16.20.2 可安裝。隔離資料庫上的 9 項缺陷回歸在原版全部失敗，確認可重現。
- 修正版 Node 22.23.3 / npm 10.9.9，`npm ci`、`npm test` 通過；14 項 node:test / Supertest 整合測試使用真實暫存 MongoDB，Imgur 成功與失敗以受控 mock 驗證。
- 第二輪前端正式建置連接隔離的真實 API，操作註冊、登入、錯誤帳密、失效 token、登出、個人資料更新、發文、留言、按讚、追蹤、搜尋排序、列表與刷新。密碼更新以 API 持久化測試及前端元件測試驗證。
- 登入、資料庫與 Imgur 憑證已以專用線上 QA 帳號及一張中性測試圖驗證成功；正式部署後的驗收另記於下方發布紀錄。
- 線上批次刪除未呼叫；admin 正反測試只在可丟棄的 MongoDB 執行。

## 已修正

| 編號 | 重現與影響 | 原因與修改 | 驗證 |
| --- | --- | --- | --- |
| B-01 | 使用過期、無效或不存在會員的 JWT，請求無法正常結束或進入 500 | 移除未完成 Promise；統一 verify 例外與缺少會員回覆 401，避免 next 多次執行 | 缺少／畸形／過期／刪除會員 token 與有效 token 實際路由通過 |
| B-02 | B 使用者可刪除 A 的貼文；一般帳號可批次刪除資料 | 單篇刪除檢查作者，刪除該篇留言；兩個批次刪除路由檢查既有 admin，缺少角色不可通過 | 越權 403、原資料仍在、作者可刪、僅隔離 admin 可批次刪除 |
| B-03 | 搜尋 `[` 觸發 RegExp 錯誤；畸形 ID、空白貼文／留言、非字串輸入回傳不一致 | 搜尋特殊符號視為文字；ID、空白、資料型別與更新驗證補齊；400／404 明確區分 | 真實路由、搜尋結果、空白內容與重複 email 回歸通過 |
| B-04 | 追蹤不存在的人仍新增關聯，重複請求可能造成不一致 | 寫入前檢查目標存在，沿用條件更新與集合語意 | 並行重複追蹤／按讚只保留一筆，取消後持久化正確，雙方關聯一致 |
| B-05 | 非圖片 callback 重複執行；壞圖／Imgur 失敗變成不明錯誤 | 驗證 callback 立即 return；sharp 解碼完整像素，拒絕截斷圖片；維持頭像 2 MB、正方形、貼文 1 MB；外部故障回 502 | 缺檔、格式、檔案大小、非正方形、截斷圖片、成功回應及上游失敗通過 |
| B-06 | MongoDB 連線失敗時伺服器仍開始服務；錯誤處理可能繼續 next | 環境變數前置檢查、資料庫連線成功後才 listen；統一錯誤並避免洩露原始秘密／stack | Node 22 安裝與啟動、API 測試通過；保留既有連線替換規則 |
| B-07 | 留言時間每次刷新都變成當下時間 | populate 漏掉 createdAt，前端 moment(undefined) 使用當下時間；回傳原建立時間 | 回讀貼文包含留言作者、內容與 createdAt；瀏覽器刷新顯示原時間 |

所有 API 修正與尺寸無關；搭配前端在 320、375、390、768、769、1024、1440px 及 844×390 檢查實際操作。

## 原有限制與尚未驗證

- Render 免費服務可能休眠；原版冷啟動觀察約 27 秒。前端逾時為 90 秒，寫入不自動重送。實際 90 秒服務中斷未刻意在線上製造，逾時訊息以測試覆蓋。
- Imgur 外部服務仍可能限流或故障；原圖片 CDN 的 HEAD 曾回 429，但後續 GET 成功。固定 UI 圖片已由前端隨站發布，上傳仍保留 Imgur。
- Chrome 擴充功能未開啟檔案 URL 存取，瀏覽器自動選檔未完整實測；API 真實上傳、檔案驗證與前端取消／重選處理已有測試。
- 未做真機 Safari / Android、負載測試或全面依賴升級。既有 npm audit 項目不等同本輪已全部修正。

## 發布紀錄

- 程式提交 `cecefbc7398c0d818d0fb2d7fa2e8d916b4141e9` 已由 Render `metawall_backend` 部署成功；後續提交僅補齊驗收紀錄。
- 來源 `portfolio/qa`，Node 22.23.3，build `npm ci`，start `npm start`；維持 Free Oregon、原服務網址、資料庫及 Imgur 設定。
- 34 次線上 API 檢查通過：登入、無效 token、資料更新、發文／編輯、越權編輯／刪除 403、特殊字搜尋、留言 createdAt、重複按讚／追蹤一致性、取消、密碼更新與原密碼失效、錯誤輸入，以及真實 Imgur 上傳。前端隨後成功發布並完成瀏覽器操作驗收。
- 精確清除本次 2 位 QA 會員、2 篇貼文、2 則留言及相關關聯。原有 4 位會員、7 篇貼文、32 則留言的 ID 全數保留，筆數回復原值。
- 2 張測試圖片已透過原 Render 環境刪除，各回 200 / success true；本機 Imgur API 曾拒絕刪圖，沒有將外部拒絕誤判為成功。臨時清理指令完成後恢復 `npm start`。
- 詳細驗收、精確 QA ID 與前端產物對照：[前端紀錄](https://github.com/cutecat8110/metawall-front/blob/portfolio/qa/qa/live-verification.json)。
- 回復基準仍為 `main` / `37b42ed888dc85809a4eff66e889a2529780446a`，原 build `npm install`、start `npm start`；本輪未需回復。

## 2026-10-08 複查補修

本輪基準：`fcbefa9`；範圍為密碼更新的登入撤銷、後端依賴安全修補。API 問題與螢幕尺寸無關。保留 Express 4、Mongoose 6、既有 API 路徑及回應格式。

| 編號 | 重現步驟與影響 | 原因與修正 | 驗證結果 |
| --- | --- | --- | --- |
| B-08 | 登入取得 token → 改密碼 → 使用原 token 呼叫 checkLogin，原先仍回 200，其他裝置仍可存取 | 新增隱藏的 passwordVersion；每次改密碼原子遞增，JWT 比對版本；限定 HS256。既有資料與舊 token 的缺省版本為 0，不需批次遷移，改密碼後即失效 | 隔離 MongoDB：舊／舊格式 token 均回 401，原 token 不能修改資料；新 token 與重新登入正常，連續改密碼各自撤銷前一版本；內部版本不出現在 profile |
| B-09 | npm audit --omit=dev 原有 22 項警告，包含 Express/body-parser、Mongoose 與 JWT 等已知風險版本 | 固定 Express 4.22.3、Mongoose 6.13.11、jsonwebtoken 9.0.3、Imgur 2.6.1、cookie-parser 1.4.7、morgan 1.12.1、validator 13.15.35；更新相容的傳遞依賴及 lockfile | Node 22.23.3 乾淨 npm ci 通過，完整及正式依賴 audit 均為 0；16 項 API 整合測試通過。實際 Imgur SDK 的 refresh-token 與 multipart 組裝也由受控 HTTP transport 驗證，不只 mock upload 方法 |

- 與前端正式建置連接隔離 API，驗證登入、Enter 留言、按讚、追蹤及清單；沒有更動既有線上會員或內容。
- 本輪沒有進行真機測試；瀏覽器選檔仍受 Chrome 擴充功能權限限制。圖片驗證包含 API 格式／大小／比例／損壞、SDK 認證與上傳序列化、上游錯誤恢復，未將 mock 測試宣稱為新增的真實 Imgur 上傳。
- 回復基準：Render 前一個成功部署 `dep-db3eg3uq1p3s73f55l90` / `fcbefa9`。發布順序仍為後端成功後才發布前端。
- 安全參考：[body-parser 公告](https://github.com/expressjs/body-parser/security/advisories/GHSA-qwcr-r2fm-qrc7)、[JWT v9 遷移說明](https://github.com/auth0/node-jsonwebtoken/wiki/Migration-Notes:-v8-to-v9)。
