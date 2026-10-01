# LocalStorage 儲存優化

## 問題描述

之前的實作存在**雙重儲存**問題，同一筆邀請函資料被儲存在兩個地方：

1. `user:${email}:invitations` - 使用者專屬的邀請函陣列（包含完整物件）
2. `public-invitations` - 公開邀請函陣列（**也包含完整物件** ❌）

這造成：
- 儲存空間浪費 50%+
- 容易超過 localStorage 5-10MB 限制
- 特別是邀請函包含 Base64 圖片時

## 優化方案

### 修改後的架構

1. `user:${email}:invitations` - 使用者專屬的邀請函陣列（完整物件）
2. `public-invitations` - **只儲存邀請函 ID 的陣列**（string[]）✅

### 資料流程

#### 建立邀請函
```typescript
// 1. 儲存完整物件到使用者專屬空間
user:test@example.com:invitations = [
  { id: "abc123", title: "...", elements: [...], ... }
]

// 2. 只儲存 ID 到公開列表
public-invitations = ["abc123"]
```

#### 查詢公開邀請函
```typescript
// 1. 檢查 ID 是否在公開列表中
const isPublic = publicInvitationIds.includes(id);

// 2. 如果是公開的，從所有使用者資料中查找完整物件
for (const key of localStorage.keys()) {
  if (key.endsWith(":invitations")) {
    const invitations = JSON.parse(localStorage.getItem(key));
    const found = invitations.find(inv => inv.id === id);
    if (found) return found;
  }
}
```

#### 更新邀請函
```typescript
// 只更新使用者專屬空間的資料
// public-invitations 只有 ID，不需要更新
```

#### 刪除邀請函
```typescript
// 1. 從使用者專屬空間刪除
// 2. 從 public-invitations ID 列表中移除
```

## 儲存空間節省

### 舊方案
```
user:test@example.com:invitations: 500KB (完整物件)
public-invitations: 500KB (完整物件重複)
總計: 1000KB
```

### 新方案
```
user:test@example.com:invitations: 500KB (完整物件)
public-invitations: 1KB (只有 ID)
總計: 501KB
```

**節省約 50% 的儲存空間！** 🎉

## 自動遷移

`cleanupInvitationStorage()` 函數會自動偵測並轉換舊格式：

```typescript
// 舊格式（完整物件陣列）
public-invitations = [
  { id: "abc", title: "...", elements: [...] },
  { id: "def", title: "...", elements: [...] }
]

// ↓ 自動轉換 ↓

// 新格式（只有 ID）
public-invitations = ["abc", "def"]
```

## 修改的檔案

1. `lib/mockApi.ts`
   - `invitationsApi.create()` - 只儲存 ID 到 public-invitations
   - `invitationsApi.getById()` - 從使用者資料中查找
   - `invitationsApi.update()` - 移除對 public-invitations 的更新
   - `invitationsApi.delete()` - 只從 ID 列表中移除

2. `lib/cleanup-storage.ts`
   - 新增舊格式自動轉換功能

3. `app/invitations/create/page.tsx`
   - 啟動時自動執行清理函數

## 效能影響

### 讀取效能
- **舊方案**：O(1) - 直接從 public-invitations 陣列中查找
- **新方案**：O(n) - 需要遍歷所有使用者的資料

對於 Mock API 和小型應用，影響可忽略。對於生產環境，建議使用真實資料庫。

### 寫入效能
- 提升約 50%（因為只需寫入一半的資料）

## 未來改進

對於生產環境，建議：

1. **使用真實資料庫**（PostgreSQL、MongoDB）
2. **建立索引**加速公開邀請函查詢
3. **使用 CDN**儲存圖片，而非 Base64
4. **實作分頁和快取**機制

## 更新日期

2026-10-01 - 完成 localStorage 儲存優化
