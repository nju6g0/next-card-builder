"use client";

import { useEditorStore } from "@/stores/editorStore";
import { CANVAS_SIZES } from "@/types";
import { motion } from "motion/react";
import {
  UndoIcon,
  RedoIcon,
  DuplicateIcon,
  TrashIcon,
  GridIcon,
} from "@/components/icons";

interface EditorToolbarProps {
  onSave?: () => void;
  onPreview?: () => void;
  className?: string;
}

export default function EditorToolbar({
  onSave,
  onPreview,
  className = "",
}: EditorToolbarProps) {
  const {
    canvasSize,
    setCanvasSize,
    showGrid,
    toggleGrid,
    undo,
    redo,
    canUndo,
    canRedo,
    selectedElementId,
    deleteElement,
    duplicateElement,
    clearElements,
  } = useEditorStore();

  const handleCanvasSizeChange = (size: keyof typeof CANVAS_SIZES) => {
    setCanvasSize(CANVAS_SIZES[size]);
  };

  const getCurrentSizeKey = (): keyof typeof CANVAS_SIZES | null => {
    const entry = Object.entries(CANVAS_SIZES).find(
      ([_, size]) =>
        size.width === canvasSize.width && size.height === canvasSize.height,
    );
    return entry ? (entry[0] as keyof typeof CANVAS_SIZES) : null;
  };

  return (
    <div
      className={`bg-white border-b border-neutral-200 px-4 py-3 ${className}`}
    >
      <div className="flex items-center justify-between">
        {/* 左側：歷史操作 */}
        <div className="flex items-center space-x-2">
          <button
            onClick={undo}
            disabled={!canUndo()}
            className="p-2 rounded hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="復原 (Ctrl+Z)"
          >
            <UndoIcon />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo()}
            className="p-2 rounded hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="重做 (Ctrl+Y)"
          >
            <RedoIcon />
          </button>

          <div className="w-px h-6 bg-neutral-300 mx-2" />

          {/* 元件操作 */}
          <button
            onClick={() =>
              selectedElementId && duplicateElement(selectedElementId)
            }
            disabled={!selectedElementId}
            className="p-2 rounded hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="複製 (Ctrl+D)"
          >
            <DuplicateIcon />
          </button>
          <button
            onClick={() =>
              selectedElementId && deleteElement(selectedElementId)
            }
            disabled={!selectedElementId}
            className="p-2 rounded hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition text-danger"
            title="刪除 (Delete)"
          >
            <TrashIcon />
          </button>
        </div>

        {/* 中間：視圖控制 */}
        <div className="flex items-center space-x-4">
          {/* 畫布尺寸選擇 */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-neutral-600">畫布：</span>
            <select
              value={getCurrentSizeKey() || ""}
              onChange={(e) =>
                handleCanvasSizeChange(
                  e.target.value as keyof typeof CANVAS_SIZES,
                )
              }
              className="text-sm border border-neutral-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="mobile">手機 (375×667)</option>
              <option value="tablet">平板 (768×1024)</option>
              <option value="desktop">桌面 (1920×1080)</option>
            </select>
          </div>

          {/* 網格切換 */}
          <button
            onClick={toggleGrid}
            className={`p-2 rounded transition ${
              showGrid ? "bg-primary text-white" : "hover:bg-neutral-100"
            }`}
            title="切換網格"
          >
            <GridIcon />
          </button>

          {/* 清除全部 */}
          <button
            onClick={() => {
              if (confirm("確定要清除所有元件嗎？")) {
                clearElements();
              }
            }}
            className="text-sm px-3 py-1 text-neutral-600 hover:text-danger hover:bg-danger/10 rounded transition"
            title="清除全部"
          >
            清除
          </button>
        </div>

        {/* 右側：主要操作 */}
        <div className="flex items-center space-x-3">
          {onPreview && (
            <button
              onClick={onPreview}
              className="px-4 py-2 text-sm font-medium text-accent-sage bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition"
            >
              預覽
            </button>
          )}
          {onSave && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSave}
              className="px-4 py-2 text-sm font-medium text-neutral-700  bg-primary rounded-lg hover:bg-primary/90 transition shadow-sm"
            >
              儲存
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
