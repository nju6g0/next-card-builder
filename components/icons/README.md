# Icon Components

這個資料夾包含專案中所有的 SVG icon 元件。

## 使用方式

### 單一匯入
```tsx
import UndoIcon from '@/components/icons/UndoIcon';

<UndoIcon className="w-5 h-5 text-blue-500" />
```

### 批次匯入
```tsx
import { UndoIcon, RedoIcon, TrashIcon } from '@/components/icons';

<UndoIcon />
<RedoIcon />
<TrashIcon />
```

## 可用的 Icons

### 編輯器控制
- `UndoIcon` - 復原
- `RedoIcon` - 重做
- `DuplicateIcon` - 複製
- `TrashIcon` - 刪除
- `GridIcon` - 網格

### 元件類型
- `TextIcon` - 文字元件
- `TextLayerIcon` - 文字圖層
- `ImageIcon` - 圖片元件
- `FormIcon` - 表單元件

### 圖層控制
- `LayersIcon` - 圖層
- `EyeIcon` - 顯示
- `EyeOffIcon` - 隱藏
- `LockIcon` - 鎖定
- `UnlockIcon` - 解鎖

### 導航
- `ArrowLeftIcon` - 返回/左箭頭
- `ChevronDownIcon` - 下箭頭
- `ChevronLeftIcon` - 左箭頭
- `MenuIcon` - 選單
- `CloseIcon` - 關閉

### 狀態 & 動作
- `CheckIcon` - 確認/核取
- `PlusIcon` - 新增
- `XCircleIcon` - 錯誤圓圈
- `ExclamationIcon` - 警告/驚嘆號
- `SpinnerIcon` - 載入中
- `CursorClickIcon` - 游標點擊

## Props

所有 icon 元件都接受以下 props：

```tsx
interface IconProps {
  className?: string; // 自訂 CSS 類別，預設值因元件而異
}
```

## 預設尺寸

每個 icon 都有適合其使用場景的預設尺寸：

- 一般按鈕 icons: `w-5 h-5`
- 小型 icons: `w-3.5 h-3.5` 或 `w-4 h-4`
- 大型 icons: `w-6 h-6`
- 特大 icons: `w-12 h-12` 或 `w-16 h-16`

## 自訂樣式

所有 icons 使用 `currentColor`，可以透過文字顏色控制：

```tsx
<UndoIcon className="w-5 h-5 text-blue-500" />
<TrashIcon className="w-5 h-5 text-red-600 hover:text-red-800" />
```

## 新增 Icon

1. 在 `components/icons/` 建立新的 `.tsx` 檔案
2. 使用以下模板：

```tsx
export default function NewIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="YOUR_PATH_HERE"
      />
    </svg>
  );
}
```

3. 將新 icon 加入 `index.ts` 以便批次匯入

## 範例

查看 `EditorToolbar.tsx` 了解實際使用範例。
