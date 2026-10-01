"use client";

import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
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
  };

  // 結束拖拉
  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);

    const { active, over, delta } = event;

    if (!over) return;

    // 從元件庫拖拉新元件到畫布
    if (
      active.data.current?.type === "library-item" &&
      over.id === "editor-canvas"
    ) {
      const elementType = active.data.current.elementType;
      const defaultProps = active.data.current.defaultProps;

      // 計算放置位置（相對於畫布）
      const canvasElement = document.querySelector('[data-canvas="true"]');
      if (!canvasElement) return;

      const rect = canvasElement.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width - 200, delta.x));
      const y = Math.max(0, Math.min(rect.height - 100, delta.y));

      const newElement = {
        id: "",
        type: elementType,
        x,
        y,
        width: elementType === "rsvp-form" ? 300 : 200,
        height:
          elementType === "rsvp-form" ? 200 : elementType === "text" ? 50 : 150,
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
          <ElementLibrary className="w-64 flex-shrink-0" />

          {/* 畫布區域（中央） */}
          <div
            className="flex-1 overflow-auto bg-neutral-100"
            data-canvas="true"
          >
            <EditorCanvas />
          </div>

          {/* 右側面板：圖層 + 屬性 */}
          <div className="w-80 flex-shrink-0 flex flex-col border-l border-neutral-200">
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
