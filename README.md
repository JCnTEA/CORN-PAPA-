# Tesla Charge Display

## 專案介紹

此專案提供一個即時展示 Tesla 車輛充電狀態的網頁，包括電量百分比、可行駛公里數與充電狀態提示。

---

## 使用步驟

### 1. 下載專案

下載並解壓縮 `tesla-charge-display-final.zip`。

---

### 2. 上傳到 GitHub

1. 建立新的 GitHub 倉庫
2. 上傳解壓縮後的所有檔案
3. 確認專案包含：

   ```
   /pages/index.js
   /package.json
   ```

---

### 3. 部署到 Vercel

1. 註冊並登入 [https://vercel.com](https://vercel.com)
2. 點選 **New Project**
3. 連結 GitHub 並選擇剛剛的倉庫
4. 確認框架選擇 **Next.js**
5. 點選 **Deploy**

---

### 4. 查看你的網站

成功部署後，取得網址如：

```
https://your-project-name.vercel.app
```

---

### 5. 修改 API 來源

若要接自己的 API，請編輯 `/pages/index.js` 裡的 `fetch`：

```js
const response = await fetch('https://your-server.com/tesla/charge-state');
```

---

### 6. 自動更新功能
- 預設每 30 秒更新一次
- 支援桌面大螢幕展示

---

## 完成！
開啟網址即可即時查看 Tesla 車輛充電狀態。
