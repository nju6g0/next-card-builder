# 圖片上傳限制說明

## 當前限制

- **檔案大小上限**：1MB (1,048,576 bytes)
- **支援格式**：所有圖片格式 (image/*)
- **儲存方式**：Base64 編碼存入 localStorage

## 實作位置

- 檔案：`components/elements/ImageElementRenderer.tsx`
- 函數：`handleFileChange`
- 行號：第 61-64 行

## 為什麼限制 1MB？

1. **localStorage 限制**：瀏覽器 localStorage 通常只有 5-10MB 的配額
2. **Base64 編碼膨脹**：Base64 會讓檔案大小增加約 33%
   - 1MB 圖片 → 約 1.33MB Base64 字串
   - 5MB 圖片 → 約 6.67MB Base64 字串（超過 localStorage 限制）
3. **效能考量**：較小的圖片載入更快，使用者體驗更好

## 如何調整限制

如果需要調整限制，修改以下代碼：

```typescript
// 檢查檔案大小（限制 XMB）
if (file.size > X * 1024 * 1024) {
  alert("圖片檔案不能超過 XMB");
  return;
}
```

## 建議的優化方向

對於生產環境，建議：

1. **使用圖片上傳服務**：
   - Cloudinary
   - AWS S3
   - Imgur API
   - 自建圖片伺服器

2. **實作圖片壓縮**：
   - 使用 `browser-image-compression` 套件
   - 在上傳前自動壓縮圖片

3. **客戶端壓縮範例**：
```typescript
import imageCompression from 'browser-image-compression';

const options = {
  maxSizeMB: 1,          // 壓縮到 1MB
  maxWidthOrHeight: 1920, // 最大尺寸
  useWebWorker: true
};

const compressedFile = await imageCompression(file, options);
```

## 歷史變更

- **2026-10-01**：從 5MB 降低到 1MB，避免 localStorage 配額超限
