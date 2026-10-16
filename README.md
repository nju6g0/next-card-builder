# Cardian 卡典 - 做出讓人心動的卡片

一個純前端邀請函設計平台，讓使用者透過拖拉式編輯器自由設計邀請函，支援多種元件類型與動畫效果，並提供預設範本和受限編輯功能。專為婚禮、派對等活動設計，包含完整的 RSVP 回覆管理系統。

## ✨ 核心特色

- 🎨 **拖拉式編輯器** - 自由拖放元件，即時預覽效果
- 🎭 **動畫元件支援** - Wedding 與 Party 風格的動態文字效果
- 📱 **響應式設計** - 支援手機、平板、桌面多種尺寸
- 🎯 **受限編輯模板** - 為特定用途設計的精美模板，僅開放必要欄位編輯
- 📊 **RSVP 管理系統** - 完整的邀請回覆收集與統計功能
- 💾 **本地儲存** - 使用 localStorage 模擬後端，無需伺服器即可運行

## 🚀 技術棧

| 類別        | 技術                   | 版本   |
| ----------- | ---------------------- | ------ |
| 前端框架    | Next.js (App Router)   | 16.3.7 |
| 程式語言    | TypeScript             | 5      |
| 樣式方案    | Tailwind CSS           | v4     |
| 狀態管理    | Zustand                | 5.0.15 |
| 拖拉功能    | @dnd-kit/core          | 6.3.1  |
| 動畫效果    | Motion (Framer Motion) | 13.5.0 |
| HTTP 客戶端 | Axios                  | 1.20.0 |
| Node.js     | v24.16.0               | -      |

## 📦 專案結構

```
cardian/
├── app/                              # Next.js App Router 路由頁面
│   ├── page.tsx                     # 首頁
│   ├── layout.tsx                   # 根佈局
│   ├── globals.css                  # 全局樣式
│   ├── login/                       # 登入頁面
│   ├── dashboard/                   # 用戶儀表板
│   │   └── rsvp/[invitationId]/    # RSVP 回覆管理頁
│   ├── invitations/                 # 邀請函相關路由
│   │   ├── create/                 # 建立邀請函（完整編輯器）
│   │   ├── edit/[id]/              # 編輯邀請函（完整編輯器）
│   │   ├── restricted-edit/[templateId]/              # 從受限模板建立
│   │   ├── restricted-edit-existing/[invitationId]/   # 編輯受限邀請函
│   │   └── [id]/                   # 邀請函詳情頁（公開）
│   ├── templates/                   # 範本列表與預覽
│   │   └── [templateId]/           # 範本詳情頁
│   └── preview/                     # 預覽相關頁面
│       └── restricted/             # 受限模板預覽
├── components/                      # React 元件
│   ├── layout/                     # Navbar, Footer 等佈局元件
│   ├── editor/                     # 編輯器相關元件
│   │   ├── Editor.tsx             # 主編輯器容器
│   │   ├── EditorCanvas.tsx       # 畫布元件
│   │   ├── EditorToolbar.tsx      # 工具列
│   │   ├── ElementLibrary.tsx     # 元件庫
│   │   ├── LayerPanel.tsx         # 圖層面板
│   │   ├── DraggableElement.tsx   # 可拖拉元件包裝器
│   │   └── properties/            # 屬性面板元件
│   │       ├── PropertyPanel.tsx
│   │       ├── TextProperties.tsx
│   │       ├── ImageProperties.tsx
│   │       ├── RsvpFormProperties.tsx
│   │       ├── AnimatedTextWeddingProperties.tsx
│   │       └── AnimatedTextPartyProperties.tsx
│   ├── elements/                   # 元件渲染器
│   │   ├── TextElementRenderer.tsx
│   │   ├── ImageElementRenderer.tsx
│   │   ├── RsvpFormElementRenderer.tsx
│   │   ├── AnimatedTextWeddingRenderer.tsx
│   │   └── AnimatedTextPartyRenderer.tsx
│   ├── dashboard/                  # 儀表板元件
│   │   ├── InvitationCard.tsx
│   │   └── RsvpList.tsx
│   ├── icons/                      # SVG 圖示元件
│   └── ui/                         # 通用 UI 元件（按鈕、輸入框等）
├── stores/                          # Zustand 狀態管理
│   ├── editorStore.ts              # 編輯器狀態
│   ├── authStore.ts                # 認證狀態
│   └── invitationStore.ts          # 邀請函資料狀態
├── lib/                             # 工具函式與 Mock API
│   ├── api/                        # 模擬 API 函式
│   │   ├── auth.ts
│   │   ├── invitations.ts
│   │   └── rsvp.ts
│   ├── templates/                  # 範本定義
│   │   ├── templateRegistry.ts
│   │   ├── weddingTemplate.ts
│   │   └── partyTemplate.ts
│   └── utils/                      # 通用工具函式
├── types/                           # TypeScript 型別定義
│   └── index.ts                    # 全域型別
├── constants/                       # 常數定義
└── public/                          # 靜態資源（圖片、字型等）
```

## 🎯 核心功能

### 1. 認證系統

- ✅ 簡化版登入（僅需 email，無密碼）
- ✅ 使用者資料隔離（以 email 為 key 的 localStorage）
- ✅ 自動登入狀態維持

### 2. 邀請函建立與編輯

#### 完整編輯器模式

- **從空白開始建立** - 完全自由創作
- **元件庫** - 提供文字、圖片、RSVP 表單、動畫文字元件
- **自由拖放定位** - 元件可任意移動、調整大小
- **屬性編輯面板** - 即時修改元件屬性
- **圖層管理** - 調整 z-index（上移/下移/置頂/置底）
- **預覽功能** - Modal 預覽最終效果
- **完全控制** - 所有元件與屬性皆可編輯

#### 受限編輯器模式

- **精美預設模板** - Wedding、Party 等動畫主題
- **僅開放特定欄位** - 保持設計完整性，只允許編輯文字內容、顏色、背景圖片等
- **預設動畫效果** - 無法編輯動畫參數與佈局，確保視覺一致性
- **快速客製化** - 適合不熟悉設計但需要精美成品的使用者
- **獨立動畫頁面** - 每個受限範本擁有專屬的動畫效果實作

### 3. 元件類型

| 元件類型             | 說明         | 可編輯屬性                                      |
| -------------------- | ------------ | ----------------------------------------------- |
| **文字元件**         | 基本文字內容 | 內容、字型、大小、顏色、字重、對齊              |
| **圖片元件**         | 圖片或背景圖 | 圖片來源、尺寸、物件適配、模糊度、設為背景      |
| **RSVP 表單**        | 回覆表單     | 標題、按鈕文字、欄位開關（姓名/Email/參加與否） |
| **Wedding 動畫文字** | 優雅動畫文字 | 內容、字型、顏色、動畫延遲                      |
| **Party 動畫文字**   | 活潑動畫文字 | 內容、字型、顏色、動畫延遲、字元間隔            |

### 4. 範本系統

目前專案**僅提供受限範本 (RestrictedTemplate)**：

- ✅ **預設精美設計與動畫** - 專業設計師精心製作
- ✅ **僅開放特定屬性編輯** - 透過 `editableProperties` 配置
- ✅ **保護設計完整性** - 動畫與佈局不可修改
- ✅ **快速客製化場景** - 修改文字、顏色、圖片即可完成
- ✅ **獨立動畫頁面** - 每個範本擁有專屬的動畫實作

**現有範本**：

- **Wedding Animated** - 浪漫婚禮動畫邀請函，優雅的拱門開場動畫
- **Party Animated** - 活潑派對動畫邀請函，趣味文字動畫效果

### 5. RSVP 管理

- ✅ 訪客填寫回覆表單
- ✅ 回覆資料收集與儲存
- ✅ 儀表板查看所有回覆
- ✅ 統計出席人數
- ✅ 依邀請函分類管理

### 6. 用戶儀表板

- ✅ 查看所有建立的邀請函
- ✅ 編輯、刪除邀請函
- ✅ 查看每個邀請函的 RSVP 回覆
- ✅ 快速複製邀請函連結

## 🛠️ 安裝與開發

### 環境需求

- Node.js v24.16.0 或以上
- npm 或 yarn

### 安裝依賴

```bash
npm install
```

### 啟動開發伺服器

```bash
npm run dev
```

伺服器預設在 **http://localhost:3002** 啟動（已配置為 port 3002）

### 建置生產版本

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

## 📝 核心資料結構

### 元件類型（扁平結構）

```typescript
type ElementType =
  | "text"
  | "image"
  | "rsvp-form"
  | "animated-text-wedding"
  | "animated-text-party";

// 基礎元件（所有元件共用的欄位）
interface BaseElement {
  id: string;
  type: ElementType;
  x: number; // 畫布 X 座標
  y: number; // 畫布 Y 座標
  width: number;
  height: number;
  zIndex: number;
  locked?: boolean; // 鎖定後無法編輯
  visible?: boolean; // 控制顯示/隱藏
}

// 文字元件
interface TextElement extends BaseElement {
  type: "text";
  content: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  fontWeight: number;
  textAlign?: "left" | "center" | "right";
}

// 圖片元件
interface ImageElement extends BaseElement {
  type: "image";
  src: string;
  alt: string;
  isBackground: boolean; // 是否為背景圖片
  objectFit?: "cover" | "contain" | "fill";
  blur?: number;
}

// RSVP 表單元件
interface RsvpFormElement extends BaseElement {
  type: "rsvp-form";
  title?: string;
  submitButtonText?: string;
  fields: {
    name: boolean;
    email: boolean;
    attendance: boolean;
    message?: boolean;
  };
}

// Wedding 動畫文字元件
interface AnimatedTextWeddingElement extends BaseElement {
  type: "animated-text-wedding";
  content: string;
  fontSize: number;
  color: string;
  fontFamily: string;
  fontWeight: number;
  animationDelay: number; // 動畫延遲（秒）
}

// Party 動畫文字元件
interface AnimatedTextPartyElement extends BaseElement {
  type: "animated-text-party";
  content: string;
  fontSize: number;
  color: string;
  fontFamily: string;
  fontWeight: number;
  animationDelay: number;
  charStaggerDelay: number; // 字元間動畫延遲
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
  createdBy: string; // 建立者 email
  templateId?: string; // 一般範本 ID
  isRestricted?: boolean; // 是否為受限編輯
  restrictedTemplateId?: string; // 受限範本 ID
  userValues?: Record<string, any>; // 使用者自訂值
}
```

### 受限範本配置

```typescript
interface EditableProperty {
  id: string;
  label: string; // UI 顯示名稱（如「主標題」）
  propertyKey: string; // 對應的屬性 key（如 titleText）
  type: "text" | "color" | "image" | "number";
  defaultValue: any;
  constraints?: {
    minLength?: number; // 文字最小長度
    maxLength?: number; // 文字最大長度
    allowedFormats?: string[]; // 圖片格式限制
    min?: number; // 數字最小值
    max?: number; // 數字最大值
  };
  group?: string; // 分組（如"文字內容"、"顏色設定"、"圖片設定"）
}

interface RestrictedTemplate {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
  isAnimated: boolean;
  isRestricted: true;
  slug: string; // 動畫頁面路由
  canvasSize: { width: number; height: number };
  elements: []; // 受限範本使用獨立動畫頁面，不使用 elements
  editableProperties: EditableProperty[]; // 可編輯的屬性配置
  animationConfig: {
    type: "wedding" | "party";
    duration?: number; // 動畫持續時間（毫秒）
  };
}
```

**範例：Wedding 範本的可編輯屬性**

```typescript
editableProperties: [
  {
    id: "title-text",
    label: "主標題",
    propertyKey: "titleText",
    type: "text",
    defaultValue: "We're Getting Married!",
    group: "文字內容",
  },
  {
    id: "text-color",
    label: "文字顏色",
    propertyKey: "textColor",
    type: "color",
    defaultValue: "#ffffff",
    group: "顏色設定",
  },
  {
    id: "background-image",
    label: "背景圖片 URL",
    propertyKey: "backgroundImage",
    type: "image",
    defaultValue: "https://picsum.photos/800/600",
    group: "圖片設定",
  },
  // ... 更多屬性
];
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

## 🎨 畫布尺寸選項

```typescript
export const CANVAS_SIZES = {
  mobile: { width: 375, height: 667 }, // iPhone SE
  tablet: { width: 768, height: 1024 }, // iPad
  desktop: { width: 1920, height: 1080 },
};
```

## 🔗 路由結構

| 路由                                                   | 說明                     | 需登入 |
| ------------------------------------------------------ | ------------------------ | ------ |
| `/`                                                    | 首頁                     | ❌     |
| `/login`                                               | 登入頁                   | ❌     |
| `/templates`                                           | 範本列表（僅受限範本）   | ❌     |
| `/templates/[templateId]`                              | 範本詳情頁               | ❌     |
| `/invitations/create`                                  | 建立邀請函（完整編輯器） | ✅     |
| `/invitations/edit/[id]`                               | 編輯邀請函（完整編輯器） | ✅     |
| `/invitations/restricted-edit/[templateId]`            | 從受限範本建立           | ✅     |
| `/invitations/restricted-edit-existing/[invitationId]` | 編輯受限邀請函           | ✅     |
| `/invitations/[id]`                                    | 邀請函詳情頁（公開）     | ❌     |
| `/dashboard`                                           | 用戶儀表板               | ✅     |
| `/dashboard/rsvp/[invitationId]`                       | RSVP 回覆管理            | ✅     |
| `/preview/restricted`                                  | 受限模板預覽             | ❌     |

## 🧪 測試頁面

專案包含以下測試頁面供開發使用：

- `/test-editor` - 編輯器元件測試
- `/test-stores` - Zustand store 測試
- `/test-api` - API 函式測試

## 💡 使用流程

### 場景 1：從空白開始建立邀請函（完整編輯器）

1. 登入系統（輸入 email）
2. 點擊首頁或範本頁的「建立空白邀請函」按鈕
3. 選擇畫布尺寸（手機/平板/桌面）
4. 從元件庫拖拉元件到畫布（文字、圖片、RSVP 表單、動畫文字）
5. 調整元件位置、大小、屬性
6. 使用圖層面板管理元件層級
7. 預覽效果
8. 儲存邀請函

### 場景 2：使用受限範本快速建立（受限編輯器）

1. 登入系統
2. 前往「範本列表」頁面
3. 瀏覽範本（目前有 Wedding、Party 兩種）
4. 點擊「預覽範本」查看動畫效果
5. 點擊「使用此範本」
6. 在受限編輯器中修改開放的欄位：
   - Wedding: 主標題、描述、文字顏色、表單顏色、背景圖片
   - Party: 歡迎文字、派對文字、文字顏色、背景圖片
7. 預覽動畫效果
8. 儲存邀請函

### 場景 3：訪客填寫 RSVP

1. 點擊邀請函連結
2. 瀏覽邀請函內容
3. 填寫 RSVP 表單（姓名、Email、參加與否）
4. 提交回覆

### 場景 4：查看 RSVP 回覆

1. 登入系統
2. 前往儀表板
3. 點擊特定邀請函的「查看回覆」
4. 查看所有訪客的回覆與統計資料

## 📱 響應式設計

- **編輯器頁面**：桌面優先，最小寬度 1024px
- **邀請函詳情頁**：完全響應式，支援手機/平板/桌面
- **RSVP 表單**：行動友善設計
- **儀表板**：響應式佈局

## �️ 資料儲存機制

本專案使用 **localStorage** 模擬後端資料庫：

- 使用者資料以 `user_{email}` 為 key 儲存
- 邀請函資料以 `invitation_{id}` 為 key 儲存
- RSVP 回覆以 `rsvp_{invitationId}` 為 key 儲存
- 所有資料僅存在於瀏覽器本地
- 清除瀏覽器資料後將遺失所有內容

## 🚧 已知限制

- 圖片上傳僅支援 base64 編碼（無外部儲存）
- 無真實後端 API，所有資料存於 localStorage
- 無使用者註冊功能（僅登入）
- 無多人協作功能
- 動畫效果在受限範本中不可編輯

## 🎯 未來改進方向

- [ ] 整合真實後端 API
- [ ] 支援圖片雲端儲存（如 Cloudinary）
- [ ] 新增更多動畫受限範本（生日、會議、活動等）
- [ ] 新增一般可編輯範本系統（作為創作起點）
- [ ] 支援邀請函分享到社群媒體
- [ ] 新增 QR Code 生成功能
- [ ] 支援多語言介面
- [ ] 新增範本市集功能
- [ ] 允許使用者將自己的作品發佈為範本

## 📄 授權

此專案為 Demo 專案，僅供學習與展示用途。

## 👤 作者

Nicole Su

---

**⚠️ 重要提醒**: 此專案使用 localStorage 模擬後端資料儲存，所有資料僅存在於瀏覽器本地。清除瀏覽器資料或在無痕模式下使用將會遺失所有資料。
