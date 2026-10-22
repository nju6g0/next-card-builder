"use client";

import { useDraggable } from "@dnd-kit/core";
import { useState, useEffect, useRef } from "react";
import type {
  BaseElement,
  TextElement,
  ImageElement,
  RsvpFormElement,
  AnimatedTextWeddingElement,
  AnimatedTextPartyElement,
} from "@/types";
import { useEditorStore } from "@/stores/editorStore";
import { isElementLocked, isElementVisible } from "@/lib/utils";
import TextElementRenderer from "@/components/elements/TextElementRenderer";
import ImageElementRenderer from "@/components/elements/ImageElementRenderer";
import RsvpFormElementRenderer from "@/components/elements/RsvpFormElementRenderer";
import AnimatedTextWeddingRenderer from "@/components/elements/AnimatedTextWeddingRenderer";
import AnimatedTextPartyRenderer from "@/components/elements/AnimatedTextPartyRenderer";
import { LockIcon, EyeOffIcon } from "@/components/icons";

interface DraggableElementProps {
  element: BaseElement;
  isSelected: boolean;
  onSelect: () => void;
}

type ResizeHandle = "nw" | "ne" | "sw" | "se" | null;

// 最小尺寸限制
const MIN_WIDTH = 50;
const MIN_HEIGHT = 50;

export default function DraggableElement({
  element,
  isSelected,
  onSelect,
}: DraggableElementProps) {
  const {
    setIsDragging,
    editingElementId,
    setEditingElement,
    updateElement,
    canvasSize,
  } = useEditorStore();
  const isEditing = editingElementId === element.id;

  // 調整大小狀態
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle>(null);
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  // 臨時尺寸（用於實時預覽）
  const [tempSize, setTempSize] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  // 記錄調整開始時的狀態
  const resizeStartRef = useRef<{
    mouseX: number;
    mouseY: number;
    elementX: number;
    elementY: number;
    elementWidth: number;
    elementHeight: number;
    aspectRatio: number;
  } | null>(null);

  // 使用原生拖拽來移動元件，避免與調整大小衝突
  const elementRef = useRef<HTMLDivElement>(null);
  const [isDraggingElement, setIsDraggingElement] = useState(false);
  const dragStartPosRef = useRef<{
    mouseX: number;
    mouseY: number;
    elementX: number;
    elementY: number;
  } | null>(null);

  // 保留 @dnd-kit 的引用，但不使用它的 listeners（用於未來可能的需求）
  const { setNodeRef } = useDraggable({
    id: element.id,
    data: {
      type: "canvas-element",
      element,
    },
    disabled: true, // 完全禁用 @dnd-kit 的拖拽，改用原生實作
  });

  // 監聽 Shift 鍵狀態
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setIsShiftPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setIsShiftPressed(false);
      }
    };

    if (isResizing) {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      };
    }
  }, [isResizing]);

  // 開始調整大小
  const handleResizeStart = (e: React.MouseEvent, handle: ResizeHandle) => {
    e.stopPropagation();
    e.preventDefault();

    setIsResizing(true);
    setResizeHandle(handle);

    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      elementX: element.x,
      elementY: element.y,
      elementWidth: element.width,
      elementHeight: element.height,
      aspectRatio: element.width / element.height,
    };

    onSelect();
  };

  // 處理調整大小
  useEffect(() => {
    if (!isResizing || !resizeStartRef.current || !resizeHandle) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeStartRef.current) return;

      const deltaX = e.clientX - resizeStartRef.current.mouseX;
      const deltaY = e.clientY - resizeStartRef.current.mouseY;

      let newX = resizeStartRef.current.elementX;
      let newY = resizeStartRef.current.elementY;
      let newWidth = resizeStartRef.current.elementWidth;
      let newHeight = resizeStartRef.current.elementHeight;

      // 根據控制點計算新尺寸
      switch (resizeHandle) {
        case "se": // 右下角
          newWidth = resizeStartRef.current.elementWidth + deltaX;
          newHeight = resizeStartRef.current.elementHeight + deltaY;
          break;

        case "sw": // 左下角
          newWidth = resizeStartRef.current.elementWidth - deltaX;
          newHeight = resizeStartRef.current.elementHeight + deltaY;
          newX = resizeStartRef.current.elementX + deltaX;
          break;

        case "ne": // 右上角
          newWidth = resizeStartRef.current.elementWidth + deltaX;
          newHeight = resizeStartRef.current.elementHeight - deltaY;
          newY = resizeStartRef.current.elementY + deltaY;
          break;

        case "nw": // 左上角
          newWidth = resizeStartRef.current.elementWidth - deltaX;
          newHeight = resizeStartRef.current.elementHeight - deltaY;
          newX = resizeStartRef.current.elementX + deltaX;
          newY = resizeStartRef.current.elementY + deltaY;
          break;
      }

      // 套用最小尺寸限制
      newWidth = Math.max(MIN_WIDTH, newWidth);
      newHeight = Math.max(MIN_HEIGHT, newHeight);

      // 按住 Shift 保持比例
      if (isShiftPressed && resizeStartRef.current) {
        const aspectRatio = resizeStartRef.current.aspectRatio;

        // 根據變化較大的維度來調整
        const widthChange = Math.abs(
          newWidth - resizeStartRef.current.elementWidth,
        );
        const heightChange = Math.abs(
          newHeight - resizeStartRef.current.elementHeight,
        );

        if (widthChange > heightChange) {
          newHeight = newWidth / aspectRatio;
        } else {
          newWidth = newHeight * aspectRatio;
        }

        // 重新套用最小尺寸
        if (newWidth < MIN_WIDTH) {
          newWidth = MIN_WIDTH;
          newHeight = MIN_WIDTH / aspectRatio;
        }
        if (newHeight < MIN_HEIGHT) {
          newHeight = MIN_HEIGHT;
          newWidth = MIN_HEIGHT * aspectRatio;
        }

        // 調整位置（對於左側和上側的控制點）
        if (resizeHandle === "nw" || resizeHandle === "sw") {
          newX =
            resizeStartRef.current.elementX +
            resizeStartRef.current.elementWidth -
            newWidth;
        }
        if (resizeHandle === "nw" || resizeHandle === "ne") {
          newY =
            resizeStartRef.current.elementY +
            resizeStartRef.current.elementHeight -
            newHeight;
        }
      }

      // 確保不超出畫布邊界
      if (newX < 0) {
        newWidth += newX;
        newX = 0;
      }
      if (newY < 0) {
        newHeight += newY;
        newY = 0;
      }
      if (newX + newWidth > canvasSize.width) {
        newWidth = canvasSize.width - newX;
      }
      if (newY + newHeight > canvasSize.height) {
        newHeight = canvasSize.height - newY;
      }

      // 更新臨時尺寸（實時預覽）
      setTempSize({
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      });
    };

    const handleMouseUp = () => {
      if (tempSize) {
        // 更新實際元件尺寸
        updateElement(element.id, {
          x: tempSize.x,
          y: tempSize.y,
          width: tempSize.width,
          height: tempSize.height,
        });
      }

      // 重置狀態
      setIsResizing(false);
      setResizeHandle(null);
      setTempSize(null);
      setIsShiftPressed(false);
      resizeStartRef.current = null;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isResizing,
    resizeHandle,
    isShiftPressed,
    element.id,
    updateElement,
    canvasSize,
    tempSize,
  ]);

  const style = {
    zIndex: element.zIndex,
    cursor: isDraggingElement
      ? "grabbing"
      : isEditing
        ? "default"
        : isElementLocked(element)
          ? "not-allowed"
          : isResizing
            ? "default"
            : "grab",
    opacity: !isElementVisible(element) ? 0.3 : 1,
  };

  // 使用臨時尺寸或實際尺寸
  const displaySize = tempSize || {
    x: element.x,
    y: element.y,
    width: element.width,
    height: element.height,
  };

  // 開始拖拽元件（移動位置）
  const handleElementDragStart = (e: React.MouseEvent) => {
    // 如果是編輯模式、鎖定或調整大小中，不處理
    if (isEditing || isElementLocked(element) || isResizing) {
      return;
    }

    // 記錄起始位置
    dragStartPosRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      elementX: element.x,
      elementY: element.y,
    };

    setIsDraggingElement(true);
    setIsDragging(true);
    onSelect();
  };

  // 處理元件拖拽移動
  useEffect(() => {
    if (!isDraggingElement || !dragStartPosRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartPosRef.current) return;

      const deltaX = e.clientX - dragStartPosRef.current.mouseX;
      const deltaY = e.clientY - dragStartPosRef.current.mouseY;

      const newX = Math.max(
        0,
        Math.min(
          canvasSize.width - element.width,
          dragStartPosRef.current.elementX + deltaX,
        ),
      );
      const newY = Math.max(
        0,
        Math.min(
          canvasSize.height - element.height,
          dragStartPosRef.current.elementY + deltaY,
        ),
      );

      updateElement(element.id, { x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDraggingElement(false);
      setIsDragging(false);
      dragStartPosRef.current = null;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDraggingElement,
    element.id,
    element.width,
    element.height,
    updateElement,
    canvasSize,
    setIsDragging,
  ]);

  // 雙擊進入編輯模式
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 鎖定的元件無法編輯
    if (!isElementLocked(element)) {
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

      case "animated-text-wedding":
        return (
          <AnimatedTextWeddingRenderer
            element={element as AnimatedTextWeddingElement}
            isSelected={isSelected}
          />
        );

      case "animated-text-party":
        return (
          <AnimatedTextPartyRenderer
            element={element as AnimatedTextPartyElement}
            isSelected={isSelected}
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
        left: displaySize.x,
        top: displaySize.y,
        width: displaySize.width,
        height: displaySize.height,
        ...style,
      }}
      className={`
        ${isSelected ? "ring-2 ring-primary ring-offset-2" : ""}
        ${isElementLocked(element) ? "cursor-not-allowed" : ""}
        ${isResizing ? "ring-2 ring-blue-500 ring-offset-2" : ""}
      `}
      onClick={handleClick}
      onMouseDown={
        !isEditing && !isElementLocked(element) && !isResizing
          ? handleElementDragStart
          : undefined
      }
    >
      {renderContent()}

      {/* 調整大小的控制點 */}
      {isSelected &&
        !isDraggingElement &&
        !isEditing &&
        !isElementLocked(element) && (
          <>
            {/* 左上角 */}
            <div
              className="absolute -top-1.5 -left-1.5 w-4 h-4 bg-primary border-2 border-white rounded-full cursor-nwse-resize hover:scale-125 transition-transform z-10"
              onMouseDownCapture={(e) => handleResizeStart(e, "nw")}
              onClick={(e) => e.stopPropagation()}
            />
            {/* 右上角 */}
            <div
              className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary border-2 border-white rounded-full cursor-nesw-resize hover:scale-125 transition-transform z-10"
              onMouseDownCapture={(e) => handleResizeStart(e, "ne")}
              onClick={(e) => e.stopPropagation()}
            />
            {/* 左下角 */}
            <div
              className="absolute -bottom-1.5 -left-1.5 w-4 h-4 bg-primary border-2 border-white rounded-full cursor-nesw-resize hover:scale-125 transition-transform z-10"
              onMouseDownCapture={(e) => handleResizeStart(e, "sw")}
              onClick={(e) => e.stopPropagation()}
            />
            {/* 右下角 */}
            <div
              className="absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-primary border-2 border-white rounded-full cursor-nwse-resize hover:scale-125 transition-transform z-10"
              onMouseDownCapture={(e) => handleResizeStart(e, "se")}
              onClick={(e) => e.stopPropagation()}
            />
          </>
        )}

      {/* 調整大小時的尺寸提示 */}
      {isResizing && tempSize && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded shadow-lg whitespace-nowrap pointer-events-none z-50">
          {Math.round(tempSize.width)} × {Math.round(tempSize.height)} px
          {isShiftPressed && (
            <span className="ml-2 opacity-75">🔒 比例鎖定</span>
          )}
        </div>
      )}

      {/* 鎖定指示 */}
      {isElementLocked(element) && (
        <div className="absolute top-1 right-1 bg-amber-500 text-white p-1 rounded shadow-sm pointer-events-none">
          <LockIcon className="w-3 h-3" />
        </div>
      )}

      {/* 隱藏指示 */}
      {!isElementVisible(element) && (
        <div className="absolute bottom-1 right-1 bg-neutral-700 text-white p-1 rounded shadow-sm pointer-events-none">
          <EyeOffIcon className="w-3 h-3" />
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
