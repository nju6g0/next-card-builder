# Card Builder - 可拖拉元件自訂邀請函網站

一個純前端 demo 的邀請函設計平台，使用者可以透過拖拉元件（文字、圖片、RSVP 表單）自由設計邀請函，或從預設範本開始編輯。

## 🚀 技術棧

- **前端框架**: Next.js 16.3.7 (App Router + Turbopack)
- **程式語言**: TypeScript 5
- **樣式方案**: Tailwind CSS v4
- **狀態管理**: Zustand 5
- **拖拉功能**: @dnd-kit/core 6
- **動畫效果**: Framer Motion 13
- **HTTP 客戶端**: Axios 1.20

## 📦 專案結構

```
next-card-builder/
├── app/                    # Next.js App Router 路由頁面
│   ├── page.tsx           # 首頁
│   ├── layout.tsx         # 根佈局
│   └── globals.css        # 全局樣式
├── components/            # React 元件
│   ├── layout/           # 佈局元件（Navbar, Footer 等）
│   ├── editor/           # 編輯器相關元件
│   ├── elements/         # 可拖拉元件（文字、圖片、RSVP）
│   ├── dashboard/        # 用戶頁元件
│   └── ui/               # 通用 UI 元件
├── stores/               # Zustand 狀態管理
├── lib/                  # 工具函式、mock API
├── types/                # TypeScript 型別定義
├── constants/            # 常數（範本資料等）
└── public/               # 靜態資源
```

## 🎯 核心功能

### 認證系統

- ✅ 簡化版登入/登出（無註冊流程）
- ✅ 以 email 為 key 的模擬帳號系統（localStorage 隔離）

### 頁面功能

1. **首頁** - 網站形象展示頁
2. **登入頁** - 使用者輸入 email 登入
3. **範本列表頁** - 顯示預設範本，可點擊預覽
4. **範本單頁** - 預覽特定範本，可選擇套用
5. **邀請函建立頁** - 拖拉編輯器，從空白或範本開始
6. **邀請函編輯頁** - 編輯已建立的邀請函
7. **用戶頁** - 顯示使用者的邀請函列表、管理、查看 RSVP

### 編輯器核心功能

- **自由定位拖拉** - 元件可在畫布任意位置擺放
- **元件類型** - 文字、圖片、RSVP 表單
- **元件屬性編輯**：
  - 文字：大小、字型、顏色、字重
  - 圖片：上傳、大小調整、設為背景圖片
  - RSVP：固定欄位（姓名、email、參加/不參加）
- **圖層管理** - 調整 z-index（上移/下移/置頂/置底）
- **預覽功能** - Modal 彈窗顯示最終效果
- **可收合元件庫** - 側邊面板展示可用元件

### 響應式設計

- 編輯器：桌面優先（最小 1024px）
- 邀請函預覽與 RSVP 填寫：行動友善

## 🛠️ 開發指南

### 安裝依賴

```bash
npm install
```

### 啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

### 建置專案

```bash
npm run build
```

### 啟動生產伺服器

```bash
npm start
```

### 程式碼檢查

```bash
npm run lint
```

### TypeScript 型別檢查

```bash
npx tsc --noEmit
```

## 📝 資料結構

### 元件類型

```typescript
type ElementType = "text" | "image" | "rsvp-form";

// 文字元件
interface TextElement {
  id: string;
  type: "text";
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  style: {
    fontSize: number;
    fontFamily: string;
    color: string;
    fontWeight: number;
  };
}

// 圖片元件
interface ImageElement {
  id: string;
  type: "image";
  src: string;
  alt: string;
  isBackground: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  style: {
    objectFit: "cover" | "contain" | "fill";
  };
}

// RSVP 表單元件
interface RsvpFormElement {
  id: string;
  type: "rsvp-form";
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  fields: {
    name: boolean;
    email: boolean;
    attendance: boolean;
  };
}
```

### 邀請函資料

```typescript
interface Invitation {
  id: string;
  title: string;
  elements: Element[];
  canvasSize: { width: number; height: number };
  createdAt: string;
  updatedAt: string;
  createdBy: string; // user email
  templateId?: string;
}
```

### RSVP 回覆

```typescript
interface RsvpResponse {
  id: string;
  invitationId: string;
  name: string;
  email: string;
  attendance: "yes" | "no";
  submittedAt: string;
}
```

## 🎨 設計系統

### 顏色主題

- **Primary**: `#6366f1` (靛藍色)
- **Secondary**: `#8b5cf6` (紫色)
- **Accent**: `#ec4899` (粉紅色)
- **Success**: `#10b981` (綠色)
- **Warning**: `#f59e0b` (橘色)
- **Error**: `#ef4444` (紅色)
- **Info**: `#3b82f6` (藍色)

### 畫布尺寸

- **Mobile**: 375 x 667 px (iPhone SE)
- **Tablet**: 768 x 1024 px (iPad)
- **Desktop**: 1920 x 1080 px

## 📋 開發進度

### Task 1: 專案初始化與基礎設定 ✅

- ✅ Next.js 專案建立
- ✅ 安裝所有依賴套件
- ✅ TypeScript 型別定義
- ✅ Tailwind CSS 配置
- ✅ 資料夾結構建立

### Task 2-20: 待完成

詳見實作計劃文件

## 📄 授權

此專案為 demo 專案，僅供學習與展示用途。

## 👤 作者

Nicole Su

---

**Note**: 此專案使用 localStorage 模擬後端資料儲存，所有資料僅存在於瀏覽器本地，清除瀏覽器資料後將遺失。
