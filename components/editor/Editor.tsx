"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEditorStore } from "@/stores/editorStore";
import EditorToolbar from "./EditorToolbar";
import EditorCanvas from "./EditorCanvas";
import ElementLibrary from "./ElementLibrary";
import LayerPanel from "./LayerPanel";
import PropertyPanel from "./properties/PropertyPanel";
import type { TextElement, ImageElement, RsvpFormElement } from "@/types";

interface EditorProps {
  onSave?: () => void;
  onPreview?: () => void;
}

export default function Editor({ onSave, onPreview }: EditorProps) {
  const {
    addElement,
    updateElement,
    elements,
    setIsDragging,
    selectedElementId,
  } = useEditorStore();

  // 儲存拖曳中的元件資訊
  const [activeItem, setActiveItem] = useState<{
    type: string;
    label: string;
    icon?: React.ReactNode;
  } | null>(null);

  // 配置拖拉感應器
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px 移動後才啟動拖拉
      },
    }),
  );

  // 開始拖拉
  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);

    // 記錄拖曳的元件資訊
    const { active } = event;
    if (active.data.current?.type === "library-item") {
      setActiveItem({
        type: active.data.current.elementType,
        label: active.data.current.label,
        icon: active.data.current.icon,
      });
    } else if (active.data.current?.type === "canvas-element") {
      const element = active.data.current.element;
      // 為畫布元件生成適當的標籤
      const typeLabels: Record<string, string> = {
        text: "文字",
        image: "圖片",
        "rsvp-form": "RSVP 表單",
      };
      setActiveItem({
        type: "canvas-element",
        label: typeLabels[element.type] || element.type,
      });
    }
  };

  // 結束拖拉
  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    setActiveItem(null);

    const { active, over, delta } = event;

    if (!over) return;

    // 從元件庫拖拉新元件到畫布
    if (
      active.data.current?.type === "library-item" &&
      over.id === "editor-canvas"
    ) {
      const elementType = active.data.current.elementType;
      const defaultProps = active.data.current.defaultProps;

      // 找到實際的畫布元素（白色區域）
      const canvasRect = document.querySelector(
        ".relative.bg-white.shadow-2xl",
      );

      if (!canvasRect) return;

      const rect = canvasRect.getBoundingClientRect();

      // 計算元件尺寸
      const elementWidth = elementType === "rsvp-form" ? 300 : 200;
      const elementHeight =
        elementType === "rsvp-form" ? 200 : elementType === "text" ? 50 : 150;

      // 獲取最終的滑鼠位置（初始位置 + 拖曳偏移）
      const activatorEvent = (event as any).activatorEvent;
      let x: number;
      let y: number;

      if (activatorEvent?.clientX && activatorEvent?.clientY) {
        // 計算最終滑鼠位置相對於畫布的座標
        const finalX = activatorEvent.clientX + delta.x;
        const finalY = activatorEvent.clientY + delta.y;

        // 轉換為相對於畫布的座標，並將元件中心放在滑鼠位置
        x = finalX - rect.left - elementWidth / 2;
        y = finalY - rect.top - elementHeight / 2;
      } else {
        // 備用方案：放在畫布中心
        x = rect.width / 2 - elementWidth / 2;
        y = rect.height / 2 - elementHeight / 2;
      }

      // 限制在畫布範圍內
      x = Math.max(0, Math.min(rect.width - elementWidth, x));
      y = Math.max(0, Math.min(rect.height - elementHeight, y));

      const newElement = {
        id: "",
        type: elementType,
        x,
        y,
        width: elementWidth,
        height: elementHeight,
        zIndex: 0,
        ...defaultProps,
      } as TextElement | ImageElement | RsvpFormElement;

      addElement(newElement);
      return;
    }

    // 畫布上元件的移動
    if (active.data.current?.type === "canvas-element") {
      const element = active.data.current.element;

      // 更新元件位置
      const newX = Math.max(0, element.x + delta.x);
      const newY = Math.max(0, element.y + delta.y);

      updateElement(element.id, {
        x: newX,
        y: newY,
      });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* 工具列 */}
      <EditorToolbar onSave={onSave} onPreview={onPreview} />

      {/* 主要編輯區域 */}
      <div className="flex-1 flex overflow-hidden">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* 元件庫側邊欄（左側） */}
          <ElementLibrary className="w-64 shrink-0" />

          {/* 畫布區域（中央） */}
          <div
            className="flex-1 overflow-auto bg-neutral-100"
            data-canvas="true"
          >
            <EditorCanvas />
          </div>

          {/* 右側面板：圖層 + 屬性 */}
          <div className="w-80 shrink-0 flex flex-col border-l border-neutral-200">
            {/* 圖層面板 */}
            <div className="flex-1 overflow-hidden">
              <LayerPanel className="h-full" />
            </div>

            {/* 屬性面板（僅在選取元件時顯示） */}
            {selectedElementId && (
              <div className="h-96 border-t border-neutral-200 overflow-hidden">
                <PropertyPanel className="h-full" />
              </div>
            )}
          </div>

          {/* 拖曳覆蓋層 - 顯示拖曳時的元件預覽 */}
          <DragOverlay dropAnimation={null}>
            {activeItem ? (
              <div className="p-3 bg-white border-2 border-primary rounded-lg shadow-xl cursor-grabbing">
                <div className="flex items-center space-x-2">
                  {activeItem.icon && (
                    <div className="flex-shrink-0 text-primary">
                      {activeItem.icon}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-neutral-900">
                      {activeItem.label}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {activeItem.type === "canvas-element"
                        ? "移動元件"
                        : "拖曳到畫布放置"}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* 狀態列 */}
      <div className="border-t border-neutral-200 px-4 py-2 bg-neutral-50">
        <div className="flex items-center justify-between text-xs text-neutral-600">
          <div className="flex items-center space-x-4">
            <span>{elements.length} 個元件</span>
            <span>準備就緒</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>💡 雙擊元件編輯內容，拖拉調整位置</span>
          </div>
        </div>
      </div>
    </div>
  );
}
