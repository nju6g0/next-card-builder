# 專案任務清單與進度追蹤

## 專案概述

**專案名稱：** 邀請函建立工具 (Invitation Card Builder)

**技術棧：**

- Next.js 16.3.7 (App Router)
- TypeScript
- Tailwind CSS v4
- Zustand (State Management)
- @dnd-kit (Drag & Drop)
- Framer Motion (Animations)
- LocalStorage (Data Persistence)

**專案目標：** 打造一個可拖拉元件自訂邀請函的網站，包含完整的編輯器、範本系統、RSVP 管理功能

**進度：** 13/20 任務完成 (65%)

---

## 任務總覽

### ✅ Phase 1: 基礎建設 (Tasks 1-6) - 完成

#### Task 1: 專案初始化與基礎設定 ✅

**狀態：** 完成  
**完成日期：** -

**已完成項目：**

- ✅ 使用 `create-next-app` 建立 Next.js 16.3.7 專案（App Router + Turbopack）
- ✅ 安裝依賴套件：`zustand`, `@dnd-kit/core`, `@dnd-kit/utilities`, `framer-motion`, `axios`
- ✅ 設定 Tailwind CSS v4 自訂主題（品牌顏色、語義顏色、捲軸樣式）
- ✅ 建立資料夾結構：
  - `app/` - Next.js App Router 路由
  - `components/{layout,editor,elements,dashboard,ui}/` - React 元件
  - `stores/` - Zustand 狀態管理
  - `lib/` - 工具函式與 Hooks
  - `types/` - TypeScript 型別定義
  - `constants/` - 常數資料
- ✅ 建立 `types/index.ts` - 完整型別定義
- ✅ 建立 `README.md` - 專案文件
- ✅ TypeScript 編譯無錯誤
- ✅ 開發伺服器運行正常

**檔案清單：**

- `types/index.ts`
- `README.md`
- `package.json`
- `tailwind.config.ts`
- `app/globals.css`

---

#### Task 2: 認證系統與 LocalStorage 資料層 ✅

**狀態：** 完成  
**完成日期：** -

**已完成項目：**

- ✅ 建立 `lib/storage.ts` - LocalStorage 工具函式
  - `getUserKey()` - 生成使用者資料鍵值
  - `getUserData()` - 讀取使用者資料
  - `setUserData()` - 儲存使用者資料
  - `removeUserData()` - 刪除使用者資料
  - `clearUserData()` - 清空使用者所有資料
  - 支援多使用者資料隔離（格式：`user:{email}:{dataKey}`）
- ✅ 建立 `lib/validation.ts` - Email 驗證工具
  - `isValidEmail()` - Email 格式驗證
  - `validateEmail()` - Email 驗證並回傳錯誤訊息
  - `normalizeEmail()` - Email 正規化
- ✅ 建立 `stores/authStore.ts` - Zustand 認證狀態管理
  - 使用 `persist` middleware 自動同步到 localStorage
  - `login()` - 登入功能
  - `logout()` - 登出功能
  - `user` 別名指向 `currentUser`
- ✅ 建立 `lib/hooks/useRequireAuth.ts` - 客戶端路由守衛
  - 未登入自動導向 `/login`
- ✅ 建立 `app/login/page.tsx` - 登入頁面
  - Email 驗證
  - 錯誤處理
  - Loading 狀態
- ✅ 建立 `app/dashboard/page.tsx` - 用戶頁骨架
- ✅ 移除已廢棄的 `middleware.ts`

**功能驗證：**

- ✓ 不同 email 登入有獨立資料空間
- ✓ 登入狀態持久化
- ✓ 路由守衛正常運作
- ✓ Email 格式驗證正確

**檔案清單：**

- `lib/storage.ts`
- `lib/validation.ts`
- `stores/authStore.ts`
- `lib/hooks/useRequireAuth.ts`
- `app/login/page.tsx`
- `app/dashboard/page.tsx`

---

#### Task 3: 基礎路由頁面與導航結構 ✅

**狀態：** 完成  
**完成日期：** -

**已完成項目：**

- ✅ 建立所有路由頁面骨架（8個頁面）：
  - `app/page.tsx` - 首頁
  - `app/login/page.tsx` - 登入頁
  - `app/dashboard/page.tsx` - 用戶頁
  - `app/templates/page.tsx` - 範本列表頁
  - `app/templates/[id]/page.tsx` - 範本單頁
  - `app/invitations/create/page.tsx` - 邀請函建立頁
  - `app/invitations/edit/[id]/page.tsx` - 邀請函編輯頁
  - `app/invitations/[id]/page.tsx` - 邀請函公開預覽頁
- ✅ 建立 `components/layout/Navbar.tsx` - 導航列
  - 響應式設計（桌面 + 手機漢堡選單）
  - 根據登入狀態顯示不同導航項目
  - 活動狀態高亮
  - 整合 authStore
- ✅ 建立 `components/layout/Footer.tsx` - 頁腳
- ✅ 建立 `components/layout/PageTransition.tsx` - 頁面轉場動畫
- ✅ 更新 `app/layout.tsx` - 整合 Navbar 和 Footer

**路由結構：**

- 公開路由：`/`, `/login`, `/templates`, `/templates/[id]`, `/invitations/[id]`
- 受保護路由：`/dashboard`, `/invitations/create`, `/invitations/edit/[id]`

**檔案清單：**

- `app/page.tsx`
- `app/templates/page.tsx`
- `app/templates/[id]/page.tsx`
- `app/invitations/create/page.tsx`
- `app/invitations/edit/[id]/page.tsx`
- `app/invitations/[id]/page.tsx`
- `components/layout/Navbar.tsx`
- `components/layout/Footer.tsx`
- `components/layout/PageTransition.tsx`

---

#### Task 4: 資料型別定義與 Mock 資料 ✅

**狀態：** 完成  
**完成日期：** -

**已完成項目：**

- ✅ 完善 `types/index.ts` - 新增 API 相關型別
  - `ApiResponse<T>` - 統一 API 回應格式
  - `CreateInvitationData` - 建立邀請函資料結構
  - `SubmitRsvpData` - RSVP 提交資料結構
  - `RsvpStats` - RSVP 統計資訊結構
- ✅ 建立 `constants/templates.ts` - 5 個預設範本
  - `template-wedding-1` - 浪漫婚禮範本
  - `template-birthday-1` - 生日派對範本
  - `template-business-1` - 商務活動範本
  - `template-simple-1` - 簡約風格範本
  - `template-modern-1` - 現代藝術範本
- ✅ 建立 `lib/mockApi.ts` - Promise-based Mock API
  - `templatesApi.getAll()` - 獲取所有範本
  - `templatesApi.getById(id)` - 根據 ID 獲取範本
  - `invitationsApi.*` - 邀請函 CRUD
  - `rsvpApi.*` - RSVP 管理
  - 所有 API 呼叫都有 500ms 模擬延遲
- ✅ 建立 `lib/utils.ts` - 工具函式集合
  - `generatePlaceholder()` - 生成 placeholder 圖片
  - `formatDate()` - 格式化日期時間
  - `truncate()` - 截斷文字
  - `cn()` - 類別名稱合併
  - `debounce()` - Debounce 函式
  - `copyToClipboard()` - 複製到剪貼簿
  - 其他工具函式

**檔案清單：**

- `types/index.ts`
- `constants/templates.ts`
- `lib/mockApi.ts`
- `lib/utils.ts`
- `app/test-api/page.tsx`

---

#### Task 5: 範本列表頁與範本預覽頁 ✅

**狀態：** 完成  
**完成日期：** -

**已完成項目：**

- ✅ 建立 `components/ui/InvitationCanvas.tsx` - 唯讀畫布元件
  - 按 zIndex 正確渲染所有元件
  - 支援文字、圖片、RSVP 表單元件
  - 可選的網格線顯示
  - 可縮放（scale prop）
  - Framer Motion 淡入動畫
- ✅ 建立 `components/ui/TemplateCard.tsx` - 範本卡片元件
  - 使用 InvitationCanvas 渲染縮圖
  - Hover 效果
  - Stagger 動畫
- ✅ 實作 `app/templates/page.tsx` - 範本列表頁
  - 響應式網格佈局（1/2/3 欄）
  - Loading/Error/Empty 狀態
- ✅ 實作 `app/templates/[id]/page.tsx` - 範本詳細預覽頁
  - 大型預覽（可切換 mobile/tablet/desktop）
  - 範本資訊卡片
  - 元件列表
  - 「使用此範本」CTA
  - 404 處理

**檔案清單：**

- `components/ui/InvitationCanvas.tsx`
- `components/ui/TemplateCard.tsx`
- `app/templates/page.tsx`
- `app/templates/[id]/page.tsx`

---

#### Task 6: Zustand Stores - Editor 與 Invitation ✅

**狀態：** 完成  
**完成日期：** -

**已完成項目：**

- ✅ 建立 `stores/editorStore.ts` - 編輯器狀態管理
  - 元件 CRUD 操作
  - 選取管理
  - 圖層管理（moveUp/Down/ToTop/ToBottom）
  - 歷史記錄（undo/redo，最多 50 步）
  - 複製/貼上
  - 畫布設定（canvasSize, showGrid）
  - 拖拉狀態（isDragging, isResizing）
  - 使用 Zustand devtools middleware
- ✅ 建立 `stores/invitationStore.ts` - 邀請函狀態管理
  - 邀請函 CRUD（整合 mockApi）
  - 當前邀請函管理
  - RSVP 管理
  - 使用 persist middleware
  - 錯誤處理與載入狀態
- ✅ 建立 `app/test-stores/page.tsx` - Store 測試頁面
- ✅ 更新 `types/index.ts` - 元件結構扁平化
- ✅ 更新 `lib/mockApi.ts` - 統一回傳 ApiResponse<T>

**便利 Hooks：**

- `useElements`, `useSelectedElement`, `useCanvasSize`, `useShowGrid`
- `useInvitations`, `useCurrentInvitation`, `useRsvpResponses`, `useRsvpStats`

**檔案清單：**

- `stores/editorStore.ts`
- `stores/invitationStore.ts`
- `app/test-stores/page.tsx`

---

### ✅ Phase 2: 核心編輯器 (Tasks 7-11) - 完成

#### Task 7: 拖拉編輯器 - 畫布與元件庫基礎 ✅

**狀態：** 完成  
**完成日期：** -

**已完成項目：**

- ✅ 建立 `components/editor/EditorCanvas.tsx` - 可拖放畫布
  - 使用 @dnd-kit 的 useDroppable
  - 渲染所有元件（按 zIndex 排序）
  - 可選網格背景
  - 點擊空白處取消選取
  - 空狀態提示
- ✅ 建立 `components/editor/DraggableElement.tsx` - 可拖拉元件
  - 使用 @dnd-kit 的 useDraggable
  - 選取狀態視覺回饋
  - 拖拉時半透明效果
  - 四角調整控制點
- ✅ 建立 `components/editor/ElementLibrary.tsx` - 可收合元件庫
  - 三種元件範本：文字、圖片、RSVP 表單
  - 點擊添加或拖拉到畫布
  - 可收合/展開功能
- ✅ 建立 `components/editor/EditorToolbar.tsx` - 工具列
  - Undo/Redo
  - 複製、刪除
  - 畫布尺寸切換
  - 網格切換
  - 清除全部
  - 預覽、儲存按鈕
- ✅ 建立 `components/editor/Editor.tsx` - 主編輯器容器
  - 整合 DndContext
  - 配置 PointerSensor（5px 啟動距離）
  - 處理拖拉事件
- ✅ 建立 `app/test-editor/page.tsx` - 編輯器測試頁面

**檔案清單：**

- `components/editor/EditorCanvas.tsx`
- `components/editor/DraggableElement.tsx`
- `components/editor/ElementLibrary.tsx`
- `components/editor/EditorToolbar.tsx`
- `components/editor/Editor.tsx`
- `app/test-editor/page.tsx`
- `app/test-editor/readme.md`

---

#### Task 8: 元件渲染 - 文字、圖片、RSVP 表單 ✅

**狀態：** 完成  
**完成日期：** -

**已完成項目：**

- ✅ 建立 `components/elements/TextElementRenderer.tsx` - 可編輯文字元件
  - 雙擊進入編輯模式
  - 使用 textarea 支援多行編輯
  - Enter 鍵換行，Escape 離開
  - 失去焦點時自動儲存
  - 保留所有文字樣式
- ✅ 建立 `components/elements/ImageElementRenderer.tsx` - 完整圖片元件
  - 雙擊進入編輯模式
  - 支援本地圖片上傳（最大 5MB）
  - 支援直接輸入圖片 URL
  - 自動轉換上傳圖片為 base64
  - 圖片載入錯誤處理
- ✅ 建立 `components/elements/RsvpFormElementRenderer.tsx` - 互動式 RSVP 表單
  - 雙擊進入配置模式
  - 可勾選顯示/隱藏欄位
  - 完整的表單預覽樣式
- ✅ 更新 `components/editor/DraggableElement.tsx` - 支援編輯模式
  - isEditing 狀態管理
  - 編輯時禁用拖拉
  - 編輯模式提示

**功能特點：**

- 雙擊編輯機制流暢
- 所有元件類型都可編輯
- 自動儲存機制
- 完整的錯誤處理

**檔案清單：**

- `components/elements/TextElementRenderer.tsx`
- `components/elements/ImageElementRenderer.tsx`
- `components/elements/RsvpFormElementRenderer.tsx`

---

#### Task 9: 屬性編輯面板 ✅

**狀態：** 完成  
**完成日期：** -

**已完成項目：**

- ✅ 建立 `components/editor/properties/PropertyPanel.tsx` - 主面板
  - 顯示選取元件的屬性編輯介面
  - 動畫進入/退出效果
- ✅ 建立 `components/editor/properties/CommonProperties.tsx` - 通用屬性
  - 位置（x/y）
  - 尺寸（width/height）
  - 圖層順序按鈕
- ✅ 建立 `components/editor/properties/TextProperties.tsx` - 文字專屬屬性
  - 字型選擇
  - 字體大小 slider (8-120px)
  - 顏色 picker
  - 字重按鈕
  - 對齊按鈕
- ✅ 建立 `components/editor/properties/ImageProperties.tsx` - 圖片專屬屬性
  - src 輸入
  - alt 輸入
  - objectFit 按鈕
  - blur slider (0-20px)
  - isBackground 勾選
  - 圖片預覽
- ✅ 建立 `components/editor/properties/RsvpFormProperties.tsx` - RSVP 專屬屬性
  - title 輸入
  - submitButtonText 輸入
  - 欄位勾選配置
  - 已選欄位預覽
- ✅ 更新 `types/index.ts` - 新增 RsvpFormElement 欄位

**功能特點：**

- 所有屬性即時更新
- 支援摺疊/展開
- 類型安全

**檔案清單：**

- `components/editor/properties/PropertyPanel.tsx`
- `components/editor/properties/CommonProperties.tsx`
- `components/editor/properties/TextProperties.tsx`
- `components/editor/properties/ImageProperties.tsx`
- `components/editor/properties/RsvpFormProperties.tsx`

---

#### Task 10: 圖層管理與元件操作 ✅

**狀態：** 完成  
**完成日期：** -

**已完成項目：**

- ✅ 建立 `components/editor/LayerPanel.tsx` - 完整的圖層管理面板
  - 圖層列表按 zIndex 排序（頂層先顯示）
  - 顯示元件類型圖示、名稱、圖層編號
  - 點擊圖層選取元件
  - 顯示/隱藏切換（眼睛圖示）
  - 鎖定/解鎖切換（鎖頭圖示）
  - 快速操作按鈕（複製、刪除）
  - Hover 時顯示操作按鈕
  - 可收合/展開面板
  - Framer Motion 動畫
- ✅ 更新 `types/index.ts` - BaseElement 新增 locked 和 visible 屬性
- ✅ 更新 `components/editor/DraggableElement.tsx`
  - 鎖定元件無法拖拉和編輯
  - 隱藏元件顯示為半透明
  - 鎖定/隱藏圖示徽章
- ✅ 更新 `components/editor/Editor.tsx`
  - 三欄佈局：元件庫（左）、畫布（中）、圖層+屬性（右）
  - 整合 LayerPanel 和 PropertyPanel

**功能特點：**

- 完整的圖層可見性控制
- 鎖定機制防止意外編輯
- 直觀的視覺回饋
- 流暢的動畫效果

**檔案清單：**

- `components/editor/LayerPanel.tsx`

---

#### Task 11: 邀請函建立與編輯頁面整合 ✅

**狀態：** 完成  
**完成日期：** -

**已完成項目：**

- ✅ 實作 `app/invitations/create/page.tsx` - 完整的建立頁面
  - 整合完整編輯器
  - 支援範本載入（透過 URL query: `?template=xxx`）
  - 支援空白畫布
  - 頂部導航列：返回、標題編輯、儲存按鈕
  - 標題編輯對話框（Modal）
  - 儲存後自動導向編輯頁面
  - 確認離開提示
  - Suspense 包裝處理 useSearchParams
- ✅ 實作 `app/invitations/edit/[id]/page.tsx` - 完整的編輯頁面
  - 從 localStorage 載入邀請函資料
  - 權限檢查（僅創建者可編輯）
  - 整合完整編輯器
  - 頂部導航列：返回、標題編輯、查看公開頁面、預覽、儲存
  - 即時儲存功能
  - 404 錯誤處理
  - 權限錯誤處理
  - 「已儲存」狀態指示
- ✅ 更新 `stores/editorStore.ts` - 新增 resetEditor() 方法

**功能特點：**

- 完整的建立/編輯工作流程
- 範本整合
- 資料持久化（localStorage）
- 權限控制
- 防止資料遺失機制

**測試方式：**

1. 訪問 `/templates` 選擇範本
2. 點擊「使用此範本」→ 跳轉到建立頁面
3. 編輯元件、調整屬性
4. 儲存 → 自動導向編輯頁面
5. 繼續編輯並儲存

**檔案清單：**

- `app/invitations/create/page.tsx`
- `app/invitations/edit/[id]/page.tsx`

---

### 🚧 Phase 3: 公開頁面與管理 (Tasks 12-14) - 待完成

#### Task 12: 預覽 Modal 與邀請函公開預覽頁 ⏳

**狀態：** 待完成  
**優先級：** 高

**待完成項目：**

- [ ] 建立 `components/ui/PreviewModal.tsx` - 預覽 Modal 元件
  - 全螢幕 Modal 覆蓋
  - 顯示 InvitationCanvas
  - 可切換尺寸（mobile/tablet/desktop）
  - 關閉按鈕
  - 鍵盤快捷鍵（ESC）
  - Framer Motion 動畫
- [ ] 實作 `app/invitations/[id]/page.tsx` - 邀請函公開預覽頁
  - 從 localStorage 載入邀請函
  - 唯讀 InvitationCanvas 渲染
  - RSVP 表單（可互動）
  - 提交 RSVP 功能
  - 成功/錯誤訊息提示
  - 響應式設計
  - 社交分享按鈕（選配）
  - 404 處理（邀請函不存在）
- [ ] 整合 PreviewModal 到編輯器
  - 在 `EditorToolbar.tsx` 中整合預覽按鈕
  - 在 `app/invitations/create/page.tsx` 中整合
  - 在 `app/invitations/edit/[id]/page.tsx` 中整合
- [ ] 建立 RSVP 提交流程
  - 表單驗證
  - 提交到 localStorage
  - 成功提示
  - 錯誤處理

**預期檔案：**

- `components/ui/PreviewModal.tsx`
- `app/invitations/[id]/page.tsx` (更新)
- `components/editor/EditorToolbar.tsx` (更新)

**技術重點：**

- Modal 使用 Framer Motion 動畫
- RSVP 表單需要完整驗證
- 公開頁面需要 SEO 優化（metadata）
- 響應式設計確保手機瀏覽體驗

---

#### Task 13: 用戶頁 - 邀請函管理與 RSVP 查看 ✅

**狀態：** 已完成  
**優先級：** 高

**已完成項目：**

- [x] 實作 `app/dashboard/page.tsx` - 完整的用戶儀表板
  - 顯示所有邀請函列表（Grid 佈局）
  - 邀請函卡片（縮圖、標題、建立日期、元件數量）
  - 操作按鈕（編輯、刪除、查看 RSVP、複製連結）
  - 建立新邀請函按鈕
  - 空狀態（尚未建立邀請函）
  - Loading 狀態
  - 複製成功提示
- [x] 建立 `components/dashboard/InvitationCard.tsx` - 邀請函卡片元件
  - 縮圖預覽（使用 InvitationCanvas，scale 0.35）
  - 邀請函資訊（標題、日期、元件數量）
  - 操作按鈕（編輯、查看 RSVP、複製連結、刪除）
  - Hover 效果和遮罩
  - 刪除確認對話框
- [x] 建立 `components/dashboard/RsvpList.tsx` - RSVP 列表元件
  - 顯示所有 RSVP 回覆
  - 統計資訊（總回覆數、將參加、無法參加）
  - 回覆列表（名稱、Email、狀態、時間）
  - Loading 狀態
  - 空狀態提示
- [x] 建立 `app/dashboard/rsvp/[invitationId]/page.tsx` - RSVP 詳細頁面
  - 顯示單一邀請函的所有 RSVP
  - 統計資訊卡片
  - 回覆列表整合 RsvpList 元件
  - 權限檢查（只有擁有者可查看）
  - 返回按鈕、編輯按鈕、複製連結按鈕
  - 錯誤處理
- [x] 實作刪除邀請函功能
  - 確認對話框（顯示邀請函標題）
  - 調用 invitationStore.deleteInvitation
  - 自動更新列表
- [x] 實作複製連結功能
  - 複製公開預覽頁面連結到剪貼簿
  - 成功提示（2秒後自動消失）

**已建立檔案：**

- `app/dashboard/page.tsx` (更新 - 完整儀表板功能)
- `components/dashboard/InvitationCard.tsx` (新建)
- `components/dashboard/RsvpList.tsx` (新建)
- `app/dashboard/rsvp/[invitationId]/page.tsx` (新建)

**技術重點：**

- 使用 `useInvitationStore` 載入資料
- 實作響應式網格佈局
- 統計資訊即時計算
- 匯出功能使用 CSV/JSON 格式

---

#### Task 14: 首頁設計與內容 ⏳

**狀態：** 待完成  
**優先級：** 中

**待完成項目：**

- [ ] 重新設計 `app/page.tsx` - 完整的首頁
  - Hero 區塊（標題、副標題、CTA）
  - 功能特點展示（3-4 個亮點）
  - 範本預覽（顯示部分範本）
  - 使用步驟說明（1-2-3 步驟）
  - CTA 區塊（開始建立）
  - 響應式設計
  - Framer Motion 動畫
- [ ] 建立 `components/ui/FeatureCard.tsx` - 功能卡片元件
  - 圖示
  - 標題
  - 描述
  - Hover 效果
- [ ] 建立 `components/ui/StepCard.tsx` - 步驟卡片元件
  - 步驟編號
  - 標題
  - 描述
  - 圖示/插圖
- [ ] 優化首頁效能
  - 圖片懶載入
  - 動畫優化
  - 程式碼分割

**預期檔案：**

- `app/page.tsx` (重新設計)
- `components/ui/FeatureCard.tsx`
- `components/ui/StepCard.tsx`

**設計重點：**

- 現代化設計風格
- 清楚的視覺層次
- 引導使用者快速開始
- 展示產品價值

---

### 🎨 Phase 4: 優化與改進 (Tasks 15-17) - 待完成

#### Task 15: 響應式優化與手機體驗提升 ⏳

**狀態：** 待完成  
**優先級：** 高

**待完成項目：**

- [ ] 編輯器手機版優化
  - 調整佈局（垂直堆疊）
  - 元件庫改為底部抽屜
  - 屬性面板改為 Modal
  - 觸控操作優化
- [ ] 範本頁面手機版優化
  - 網格佈局調整
  - 卡片尺寸優化
- [ ] 公開預覽頁面手機版優化
  - RSVP 表單優化
  - 觸控友善按鈕
- [ ] 導航列手機版優化
  - 漢堡選單改進
  - 手勢支援
- [ ] 測試所有頁面在不同裝置
  - 手機（iOS/Android）
  - 平板
  - 桌面

**技術重點：**

- 使用 Tailwind CSS 響應式工具類
- 觸控事件優化
- 視口單位使用（vh/vw）
- 手勢操作（選配）

---

#### Task 16: 動畫與微互動提升 ⏳

**狀態：** 待完成  
**優先級：** 中

**待完成項目：**

- [ ] 頁面轉場動畫
  - 使用 PageTransition 元件
  - 優化動畫時間
- [ ] 元件拖拉動畫
  - 拖拉時的視覺回饋
  - 放置動畫
- [ ] 按鈕互動效果
  - Hover 效果
  - 點擊回饋
  - Loading 動畫
- [ ] 表單驗證動畫
  - 錯誤訊息淡入
  - 成功提示動畫
- [ ] Modal 動畫
  - 淡入淡出
  - 彈跳效果（選配）
- [ ] 列表項目動畫
  - Stagger 動畫
  - 刪除動畫

**技術重點：**

- 使用 Framer Motion
- 動畫時間控制（不超過 300ms）
- 考慮使用者偏好設定（prefers-reduced-motion）

---

#### Task 17: 錯誤處理與邊界情況 ⏳

**狀態：** 待完成  
**優先級：** 高

**待完成項目：**

- [ ] 建立全域錯誤邊界
  - 捕捉未預期的錯誤
  - 友善的錯誤訊息
  - 重新載入按鈕
- [ ] 表單驗證改進
  - 即時驗證
  - 清楚的錯誤訊息
  - 欄位高亮
- [ ] 網路錯誤處理
  - Offline 偵測
  - 重試機制
  - 錯誤訊息
- [ ] 資料驗證
  - localStorage 資料完整性檢查
  - 損壞資料修復
  - 資料遷移（如果需要）
- [ ] 空狀態處理
  - 無資料時的友善提示
  - 引導使用者操作
- [ ] Loading 狀態
  - 骨架屏（Skeleton）
  - Spinner 動畫
  - 進度指示

**預期檔案：**

- `components/ui/ErrorBoundary.tsx`
- `components/ui/EmptyState.tsx`
- `components/ui/Skeleton.tsx`

**技術重點：**

- React Error Boundary
- Zod 或類似驗證庫（選配）
- 友善的 UX 設計

---

### 🚀 Phase 5: 部署準備 (Tasks 18-20) - 待完成

#### Task 18: 效能優化與程式碼品質 ⏳

**狀態：** 待完成  
**優先級：** 高

**待完成項目：**

- [ ] 程式碼審查與重構
  - 移除未使用的程式碼
  - 抽取重複邏輯
  - 改進命名
- [ ] 效能優化
  - 圖片優化（使用 Next.js Image）
  - 懶載入（React.lazy）
  - 程式碼分割
  - Memo 化昂貴計算
- [ ] Bundle 大小優化
  - 分析 bundle（next/bundle-analyzer）
  - Tree shaking
  - 移除不必要的依賴
- [ ] 可存取性（a11y）改進
  - 鍵盤導航
  - ARIA 標籤
  - 顏色對比檢查
  - 螢幕閱讀器支援
- [ ] SEO 優化
  - Metadata 優化
  - Open Graph tags
  - Sitemap
  - Robots.txt
- [ ] 程式碼品質工具
  - ESLint 規則檢查
  - Prettier 格式化
  - TypeScript strict mode
  - Husky pre-commit hooks（選配）

**技術重點：**

- 使用 Lighthouse 評分
- 使用 React DevTools Profiler
- 目標：Core Web Vitals 達標

---

#### Task 19: 測試與 QA ⏳

**狀態：** 待完成  
**優先級：** 高

**待完成項目：**

- [ ] 功能測試
  - 測試所有使用者流程
  - 建立測試清單（Test Checklist）
  - 跨瀏覽器測試（Chrome, Firefox, Safari）
  - 跨裝置測試
- [ ] Edge Cases 測試
  - 極長文字
  - 極大圖片
  - 大量元件
  - 空資料
  - 損壞資料
- [ ] 效能測試
  - 大量邀請函載入
  - 複雜邀請函編輯
  - 記憶體洩漏檢查
- [ ] 可用性測試
  - 使用者測試（如果可能）
  - 收集回饋
  - 改進建議
- [ ] 安全性檢查
  - XSS 防護
  - LocalStorage 安全性
  - 輸入驗證

**測試清單範例：**

```markdown
## 認證流程

- [ ] 登入成功
- [ ] 登入失敗（無效 email）
- [ ] 登出
- [ ] 路由守衛

## 邀請函建立

- [ ] 從範本建立
- [ ] 空白建立
- [ ] 儲存
- [ ] 離開確認
      ...
```

---

#### Task 20: 最終潤飾與部署準備 ⏳

**狀態：** 待完成  
**優先級：** 高

**待完成項目：**

- [ ] 環境變數設定
  - 建立 `.env.example`
  - 文件化環境變數
- [ ] 建立部署指南
  - `DEPLOYMENT.md` 文件
  - Vercel 部署步驟
  - 其他平台部署選項
- [ ] 更新 README
  - 專案截圖
  - 功能列表
  - 安裝步驟
  - 使用指南
  - 授權資訊
- [ ] 建立 CHANGELOG
  - 版本歷史
  - 功能更新
- [ ] 準備 Demo 資料
  - 預設範本完善
  - 範例邀請函
- [ ] 最終檢查
  - 所有連結正常
  - 所有圖片載入
  - 無 Console 錯誤
  - 無 TypeScript 錯誤
- [ ] 部署到 Vercel
  - 建立 Vercel 專案
  - 設定環境變數
  - 首次部署
  - 驗證功能

**預期檔案：**

- `.env.example`
- `DEPLOYMENT.md`
- `CHANGELOG.md`
- `README.md` (更新)

---

## 技術架構概覽

### 資料夾結構

```
next-card-builder/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # 首頁
│   ├── login/page.tsx            # 登入頁
│   ├── dashboard/page.tsx        # 用戶儀表板
│   ├── templates/
│   │   ├── page.tsx              # 範本列表
│   │   └── [id]/page.tsx         # 範本詳細
│   ├── invitations/
│   │   ├── [id]/page.tsx         # 公開預覽頁（含 RSVP）
│   │   ├── create/page.tsx       # 建立邀請函
│   │   └── edit/[id]/page.tsx    # 編輯邀請函
│   ├── test-editor/page.tsx      # 編輯器測試頁
│   ├── test-stores/page.tsx      # Store 測試頁
│   └── test-api/page.tsx         # API 測試頁
├── components/
│   ├── layout/                   # 佈局元件
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── PageTransition.tsx
│   ├── editor/                   # 編輯器元件
│   │   ├── Editor.tsx            # 主編輯器容器
│   │   ├── EditorCanvas.tsx      # 畫布
│   │   ├── EditorToolbar.tsx     # 工具列
│   │   ├── ElementLibrary.tsx    # 元件庫
│   │   ├── DraggableElement.tsx  # 可拖拉元件
│   │   ├── LayerPanel.tsx        # 圖層面板
│   │   └── properties/           # 屬性面板
│   │       ├── PropertyPanel.tsx
│   │       ├── CommonProperties.tsx
│   │       ├── TextProperties.tsx
│   │       ├── ImageProperties.tsx
│   │       └── RsvpFormProperties.tsx
│   ├── elements/                 # 元件渲染器
│   │   ├── TextElementRenderer.tsx
│   │   ├── ImageElementRenderer.tsx
│   │   └── RsvpFormElementRenderer.tsx
│   ├── ui/                       # UI 元件
│   │   ├── InvitationCanvas.tsx  # 唯讀畫布
│   │   ├── TemplateCard.tsx      # 範本卡片
│   │   └── PreviewModal.tsx      # 預覽 Modal（待完成）
│   └── dashboard/                # 儀表板元件（待完成）
│       ├── InvitationCard.tsx
│       └── RsvpList.tsx
├── stores/                       # Zustand 狀態管理
│   ├── authStore.ts              # 認證狀態
│   ├── editorStore.ts            # 編輯器狀態
│   └── invitationStore.ts        # 邀請函狀態
├── lib/                          # 工具函式與 Hooks
│   ├── storage.ts                # LocalStorage 工具
│   ├── validation.ts             # 驗證工具
│   ├── mockApi.ts                # Mock API
│   ├── utils.ts                  # 通用工具
│   └── hooks/
│       └── useRequireAuth.ts     # 認證守衛 Hook
├── types/                        # TypeScript 型別
│   └── index.ts
├── constants/                    # 常數資料
│   └── templates.ts              # 預設範本
└── docs/                         # 文件
    └── tasks.md                  # 本檔案
```

### 核心技術

- **Next.js 16.3.7** - React 框架（App Router）
- **TypeScript** - 型別安全
- **Tailwind CSS v4** - 樣式框架
- **Zustand** - 狀態管理
- **@dnd-kit** - 拖拉功能
- **Framer Motion** - 動畫
- **LocalStorage** - 資料持久化

### 資料流

```
使用者操作
    ↓
React 元件
    ↓
Zustand Store（editorStore / invitationStore）
    ↓
Mock API (lib/mockApi.ts)
    ↓
LocalStorage（資料持久化）
```

### 元件類型

1. **文字元件（TextElement）**
   - 屬性：content, fontSize, fontFamily, color, fontWeight, textAlign
   - 可雙擊編輯

2. **圖片元件（ImageElement）**
   - 屬性：src, alt, objectFit, blur, isBackground
   - 支援上傳和 URL 輸入
   - 自動轉換為 base64

3. **RSVP 表單元件（RsvpFormElement）**
   - 屬性：title, submitButtonText, fields (name, email, attendance, message)
   - 可配置顯示欄位

### LocalStorage 資料結構

```typescript
// 認證
"auth-storage" → { currentUser: string }

// 使用者邀請函列表
"user:{email}:invitations" → Invitation[]

// 公開邀請函（所有使用者可見）
"public-invitations" → string[] (invitation IDs)

// RSVP 回覆
"rsvp:{invitationId}" → RsvpResponse[]
```

---

## 開發指南

### 環境設定

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# TypeScript 檢查
npx tsc --noEmit

# 建置專案
npm run build
```

### 開發流程

1. 從這個文件選擇待完成的任務
2. 閱讀任務描述和技術重點
3. 建立/修改相關檔案
4. 執行 TypeScript 檢查
5. 在瀏覽器測試功能
6. 提交程式碼

### 程式碼風格

- 使用 TypeScript strict mode
- 元件使用 PascalCase
- 函式使用 camelCase
- 常數使用 UPPER_SNAKE_CASE
- 使用 Tailwind CSS 工具類（避免自訂 CSS）
- 使用 "use client" 於需要客戶端功能的元件

### 命名慣例

- 頁面檔案：`page.tsx`
- 元件檔案：`ComponentName.tsx`
- Store 檔案：`storeName.ts`
- 工具函式：`utils.ts`
- Hook：`useHookName.ts`

---

## 測試頁面

開發過程中可以使用以下測試頁面：

- `/test-editor` - 編輯器測試
- `/test-stores` - Store 測試
- `/test-api` - API 測試
- `/templates` - 範本瀏覽
- `/invitations/create` - 建立邀請函
- `/dashboard` - 用戶儀表板（待完成完整功能）

---

## 常見問題

### Q: 如何新增一個元件類型？

1. 在 `types/index.ts` 定義新元件介面
2. 在 `components/elements/` 建立渲染器
3. 在 `components/editor/ElementLibrary.tsx` 新增到元件庫
4. 在 `components/editor/DraggableElement.tsx` 處理渲染
5. 在 `components/editor/properties/` 建立屬性面板

### Q: 如何修改畫布尺寸？

在 `types/index.ts` 的 `CANVAS_SIZES` 常數中修改。

### Q: 如何新增範本？

在 `constants/templates.ts` 的 `MOCK_TEMPLATES` 陣列中新增。

### Q: LocalStorage 如何隔離不同使用者資料？

使用 `lib/storage.ts` 的 `getUserKey()` 函式，格式為 `user:{email}:{dataKey}`。

### Q: 如何重置開發資料？

在瀏覽器 DevTools Console 執行：`localStorage.clear()`

---

## 版本資訊

**目前版本：** 0.5.0 (Tasks 1-11 完成)  
**Next.js 版本：** 16.3.7  
**最後更新：** 2024

---

## 貢獻指南

如果你是新的開發者接手這個專案：

1. **閱讀這份文件** - 了解專案結構和進度
2. **查看已完成任務** - 了解已實作的功能
3. **選擇待完成任務** - 從 Tasks 12-20 選擇
4. **遵循程式碼風格** - 保持一致性
5. **執行測試** - 確保功能正常
6. **更新文件** - 完成任務後更新此文件

---

## 授權

本專案目前為內部開發專案，尚未決定授權方式。

---

**文件最後更新：** 2024 年（Task 11 完成後）
