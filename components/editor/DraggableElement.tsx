"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type {
  BaseElement,
  TextElement,
  ImageElement,
  RsvpFormElement,
} from "@/types";
import { useEditorStore } from "@/stores/editorStore";
import TextElementRenderer from "@/components/elements/TextElementRenderer";
import ImageElementRenderer from "@/components/elements/ImageElementRenderer";
import RsvpFormElementRenderer from "@/components/elements/RsvpFormElementRenderer";

interface DraggableElementProps {
  element: BaseElement;
  isSelected: boolean;
  onSelect: () => void;
}

export default function DraggableElement({
  element,
  isSelected,
  onSelect,
}: DraggableElementProps) {
  const { setIsDragging, editingElementId, setEditingElement } =
    useEditorStore();
  const isEditing = editingElementId === element.id;

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: element.id,
      data: {
        type: "canvas-element",
        element,
      },
      disabled: isEditing || (element as any).locked, // 編輯時或鎖定時禁用拖拉
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: element.zIndex,
    cursor: isDragging
      ? "grabbing"
      : isEditing
        ? "default"
        : (element as any).locked
          ? "not-allowed"
          : "grab",
    opacity: (element as any).visible === false ? 0.3 : isDragging ? 0.5 : 1,
  };

  // 開始拖拉
  const handleDragStart = () => {
    if (!isEditing) {
      setIsDragging(true);
      onSelect();
    }
  };

  // 結束拖拉
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // 雙擊進入編輯模式
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 鎖定的元件無法編輯
    if (!(element as any).locked) {
      setEditingElement(element.id);
      onSelect();
    }
  };

  // 單擊選取（非編輯模式）
  const handleClick = (e: React.MouseEvent) => {
    // 在編輯模式下，不要阻止事件傳播，讓內部按鈕可以正常工作
    if (!isEditing) {
      e.stopPropagation();
      onSelect();
    }
  };

  // 渲染元件內容
  const renderContent = () => {
    switch (element.type) {
      case "text":
        return (
          <TextElementRenderer
            element={element as TextElement}
            isSelected={isSelected}
            isEditing={isEditing}
            onDoubleClick={handleDoubleClick}
          />
        );

      case "image":
        return (
          <ImageElementRenderer
            element={element as ImageElement}
            isSelected={isSelected}
            isEditing={isEditing}
            onDoubleClick={handleDoubleClick}
          />
        );

      case "rsvp-form":
        return (
          <RsvpFormElementRenderer
            element={element as RsvpFormElement}
            isSelected={isSelected}
            isEditing={isEditing}
            onDoubleClick={handleDoubleClick}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        position: "absolute",
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        ...style,
      }}
      className={`
        transition-all
        ${isSelected ? "ring-2 ring-primary ring-offset-2" : ""}
        ${isDragging ? "opacity-50" : ""}
        ${(element as any).locked ? "cursor-not-allowed" : ""}
      `}
      onClick={handleClick}
      {...(isEditing ? {} : { ...listeners, ...attributes })}
      onMouseDown={isEditing ? undefined : handleDragStart}
      onMouseUp={isEditing ? undefined : handleDragEnd}
    >
      {renderContent()}

      {/* 選取框的調整控制點 */}
      {isSelected && !isDragging && !isEditing && !(element as any).locked && (
        <>
          {/* 四角調整點 */}
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-primary border-2 border-white rounded-full cursor-nwse-resize" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary border-2 border-white rounded-full cursor-nesw-resize" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-primary border-2 border-white rounded-full cursor-nesw-resize" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary border-2 border-white rounded-full cursor-nwse-resize" />
        </>
      )}

      {/* 鎖定指示 */}
      {(element as any).locked && (
        <div className="absolute top-1 right-1 bg-amber-500 text-white p-1 rounded shadow-sm pointer-events-none">
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
      )}

      {/* 隱藏指示 */}
      {(element as any).visible === false && (
        <div className="absolute bottom-1 right-1 bg-neutral-700 text-white p-1 rounded shadow-sm pointer-events-none">
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
            />
          </svg>
        </div>
      )}

      {/* 編輯模式指示 */}
      {isEditing && (
        <div className="absolute -top-8 left-0 right-0 flex justify-center pointer-events-none">
          <span className="px-2 py-1 bg-primary text-white text-xs rounded shadow-lg">
            編輯中... (點擊外部完成)
          </span>
        </div>
      )}
    </div>
  );
}
