"use client";

import { useState, useRef, useEffect } from "react";
import type { TextElement } from "@/types";
import { useEditorStore } from "@/stores/editorStore";

interface TextElementRendererProps {
  element: TextElement;
  isSelected: boolean;
  isEditing?: boolean;
  onDoubleClick?: (e: React.MouseEvent) => void;
}

export default function TextElementRenderer({
  element,
  isSelected,
  isEditing = false,
  onDoubleClick,
}: TextElementRendererProps) {
  const { updateElement } = useEditorStore();
  const [localContent, setLocalContent] = useState(element.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 編輯模式時自動聚焦
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  // 處理內容變更
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalContent(e.target.value);
  };

  // 失去焦點時儲存
  const handleBlur = () => {
    if (localContent !== element.content) {
      updateElement(element.id, { content: localContent });
    }
  };

  // Enter 鍵換行，Escape 離開編輯
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      e.currentTarget.blur();
    }
  };

  const textStyle = {
    fontSize: element.fontSize,
    fontFamily: element.fontFamily,
    color: element.color,
    fontWeight: element.fontWeight,
    textAlign: element.textAlign || "left",
    lineHeight: 1.4,
  } as React.CSSProperties;

  if (isEditing) {
    return (
      <textarea
        ref={textareaRef}
        value={localContent}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-full h-full resize-none bg-transparent border-2 border-primary rounded p-1 outline-none"
        style={{
          ...textStyle,
          overflow: "hidden",
        }}
        placeholder="輸入文字..."
      />
    );
  }

  return (
    <div
      className="w-full h-full flex items-center cursor-text overflow-hidden"
      style={textStyle}
      onDoubleClick={onDoubleClick}
    >
      <div className="w-full px-1 break-words whitespace-pre-wrap hover:cursor-grab active:cursor-grabbing">
        {element.content || "雙擊編輯文字"}
      </div>
    </div>
  );
}
