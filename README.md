# Metawall - 社群內容牆 ( 後端 )

![Node](https://img.shields.io/badge/Node.js-v22.23.3-brightgreen.svg)

> 這是一個充滿分享和互動的社交平台，讓你自由註冊、追蹤喜歡的用戶、留言與分享生活。在這裡，你可以盡情展現自我，並留下寶貴的回憶。

![](https://cutecat8110.github.io/metawall-front/demo.png)

## 📋 專案概述

此專案旨在增進獨立前後端開發能力，運用 Vue Options API、nodeJS 和 MongoDB 等技術。<br>開發 API 設計反覆進行測試和防呆，以確保系統穩定與安全性。同時著重於切版與動效實現，以提升畫面品質與社交體驗。

- [前端](https://github.com/cutecat8110/metawall-front)
- [API 文件](https://metawall-backend-c89d.onrender.com/api-docs/)
- [Demo](https://cutecat8110.github.io/metawall-front/)

## 🌸 啟動、測試與部署

使用 `.node-version` 固定的 Node 22.23.3，先 `npm ci`。本機開發複製 `config.env.example` 為忽略追蹤的 `config.env`，填入自己的 MongoDB / JWT / Imgur 設定，再執行 `npm run start:dev`。`npm start` 為 Render 啟動指令；資料庫連線成功後才開始接收請求。

- 必填：`DATABASE`、`JWT_SECRET`、`JWT_EXPIRES_DAY`。URI 若含 `<password>`，另需 `DATABASE_PASSWORD`；既有 `Database` 名稱替換規則保留。
- 上傳：`IMGUR_CLIENT_ID`、`IMGUR_CLIENT_SECRET`、`IMGUR_REFRESH_TOKEN`、`IMGUR_ALBUM_ID`（頭像）、`IMGUR_ALBUM_2_ID`（貼文）。`PORT` 可省略，本機預設 3000。
- `npm test`：node:test + Supertest + mongodb-memory-server，啟動隔離 MongoDB、測完刪除；不讀取或操作線上資料庫，Imgur 測試使用 mock。首次執行需要下載 MongoDB binary。
- `npm run qa:serve`：在 `127.0.0.1:8091` 啟動真實 API 與暫存 MongoDB，附兩個本機帳號 `alice@example.test` / `bob@example.test`，密碼 `LocalQa123456`。停止程序即丟棄資料，不具備真實 Imgur 憑證。僅限本機 QA。
- Render：保留 `metawall_backend` 現有服務及環境變數，來源使用 `portfolio/qa`，build `npm ci`，start `npm start`。部署 Node 22.23.3；先驗證後端，再發布前端。
- 失敗回復：在 Render 選取上一個成功部署；本輪前基準提交 `37b42ed888dc85809a4eff66e889a2529780446a`，原分支 `main`。
- 所有寫入均不自動重試。圖片服務故障回覆 502；一般輸入／認證／權限／不存在資源分別回覆 400／401／403／404。
- 批次刪除僅既有 `admin` 可用；線上 QA 不呼叫批次刪除。不要在公開文件或提交放入帳密、token 或資料庫連線秘密。

完整修正、測試與限制請看 [QA_CHANGELOG.md](QA_CHANGELOG.md)。

## 🔨 核心技術

<table>
  <tbody>
    <tr>
      <td>
        <a href="https://nodejs.org/" >
          Node.js
        </a>
      </td>
      <td>後端 JavaScript 平台</td>
    </tr>
    <tr>
      <td>
        <a href="https://nodejs.org/" >
          Express.js
        </a>
      </td>
      <td>Node.js 的後端框架</td>
    </tr>
    <tr>
      <td>
        <a href="https://mongoosejs.com/" >
          Mongoose
        </a>
      </td>
      <td>MongoDB 物件建模工具</td>
    </tr>
  </tbody>
</table>

## 🛠️ 擴展套件

<table>
  <tbody>
    <tr>
      <td>
        <a href="https://www.npmjs.com/package/validator">
          validator
        </a>
      </td>
      <td>數據輸入驗證庫</td>
    </tr>
    <tr>
      <td>
        <a href="https://swagger.io/">
          Swagger 
        </a>
      </td>
      <td>產生 API 說明文件</td>
    </tr>
    <tr>
      <td>
        <a href="https://www.npmjs.com/package/multer">
          multer 
        </a>
      </td>
      <td>上傳數據中間件</td>
    </tr>
    <tr>
      <td>
        <a href="https://www.npmjs.com/package/jsonwebtoken">
          jsonwebtoken 
        </a>
      </td>
      <td>JWT 驗證</td>
    </tr>
    <tr>
      <td>
        <a href="https://sharp.pixelplumbing.com/">
          sharp
        </a>
      </td>
      <td>圖片格式、尺寸與解碼驗證</td>
    </tr>
    <tr>
      <td>
        <a href="https://www.npmjs.com/package/cookie-parser">
          cookie-parser
        </a>
      </td>
      <td>解析 cookie</td>
    </tr>
    <tr>
      <td>
        <a href="https://www.npmjs.com/package/cors">
          cors
        </a>
      </td>
      <td>處理跨來源資源共享</td>
    </tr>
    <tr>
      <td>
        <a href="https://www.npmjs.com/package/morgan">
          morgan
        </a>
      </td>
      <td>HTTP 請求的中間件 logger</td>
    </tr>
    <tr>
      <td>
        <a href="https://www.npmjs.com/package/bcryptjs">
          bcryptjs
        </a>
      </td>
      <td>處理密碼加密和解密</td>
    </tr>
  </tbody>
</table>
