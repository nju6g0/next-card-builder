"use client";

import { useRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import { useEditorStore } from "@/stores/editorStore";
import DraggableElement from "./DraggableElement";
import { motion } from "framer-motion";

interface EditorCanvasProps {
  className?: string;
}

export default function EditorCanvas({ className = "" }: EditorCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const {
    elements,
    canvasSize,
    showGrid,
    selectElement,
    selectedElementId,
    setEditingElement,
  } = useEditorStore();

  // 設定畫布為可放置區域
  const { setNodeRef } = useDroppable({
    id: "editor-canvas",
  });

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 點擊畫布空白處取消選取並退出編輯模式
    if (e.target === e.currentTarget) {
      selectElement(null);
      setEditingElement(null);
    }
  };

  return (
    <div
      className={`flex items-center justify-center p-8 bg-neutral-100 ${className}`}
    >
      <div className="relative">
        {/* 畫布容器 */}
        <motion.div
          ref={setNodeRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative bg-white shadow-2xl overflow-hidden"
          style={{
            width: canvasSize.width,
            height: canvasSize.height,
          }}
          onClick={handleCanvasClick}
        >
          {/* 網格背景 */}
          {showGrid && (
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                  linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
              }}
            />
          )}

          {/* 渲染所有元件 */}
          {elements
            .slice()
            .sort((a, b) => a.zIndex - b.zIndex)
            .map((element) => (
              <DraggableElement
                key={element.id}
                element={element}
                isSelected={selectedElementId === element.id}
                onSelect={() => selectElement(element.id)}
              />
            ))}

          {/* 空狀態提示 */}
          {elements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-neutral-400">
                <svg
                  className="mx-auto h-12 w-12 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-sm font-medium">拖拉元件到此處開始設計</p>
                <p className="text-xs mt-1">或從右側元件庫選擇</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* 畫布尺寸標籤 */}
        <div className="absolute -bottom-8 left-0 right-0 text-center">
          <span className="inline-block px-3 py-1 bg-white rounded-full shadow text-xs text-neutral-600">
            {canvasSize.width} × {canvasSize.height} px
          </span>
        </div>
      </div>
    </div>
  );
}
