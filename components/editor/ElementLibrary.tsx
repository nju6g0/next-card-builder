"use client";

import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { motion, AnimatePresence } from "motion/react";
import type {
  ElementType,
  TextElement,
  ImageElement,
  RsvpFormElement,
} from "@/types";
import { useEditorStore } from "@/stores/editorStore";

interface ElementLibraryProps {
  className?: string;
}

interface ElementTemplate {
  type: ElementType;
  icon: React.ReactNode;
  label: string;
  description: string;
  defaultProps: Partial<TextElement | ImageElement | RsvpFormElement>;
}

const ELEMENT_TEMPLATES: ElementTemplate[] = [
  {
    type: "text",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    ),
    label: "文字",
    description: "新增文字內容",
    defaultProps: {
      content: "雙擊編輯文字",
      fontSize: 16,
      fontFamily: "Arial",
      color: "#000000",
      fontWeight: 400,
      textAlign: "left",
    },
  },
  {
    type: "image",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    label: "圖片",
    description: "新增圖片",
    defaultProps: {
      src: "https://picsum.photos/200/300",
      alt: "圖片",
      isBackground: false,
      objectFit: "cover",
    },
  },
  {
    type: "rsvp-form",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    label: "RSVP 表單",
    description: "新增回覆表單",
    defaultProps: {
      fields: {
        name: true,
        email: true,
        attendance: true,
        message: false,
      },
    },
  },
];

function DraggableLibraryItem({ template }: { template: ElementTemplate }) {
  const { addElement } = useEditorStore();

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `library-${template.type}`,
    data: {
      type: "library-item",
      elementType: template.type,
      defaultProps: template.defaultProps,
    },
  });

  const handleClick = () => {
    // 點擊直接添加到畫布中央
    const centerX = 375 / 2 - 100; // 假設預設寬度 200
    const centerY = 667 / 2 - 50; // 假設預設高度 100

    const newElement = {
      id: "",
      type: template.type,
      x: centerX,
      y: centerY,
      width: template.type === "rsvp-form" ? 300 : 200,
      height: template.type === "text" ? 50 : 200,
      zIndex: 0,
      ...template.defaultProps,
    } as any;

    addElement(newElement);
  };

  return (
    <motion.div
      ref={setNodeRef}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        p-4 bg-white border-2 border-neutral-200 rounded-lg cursor-move
        hover:border-primary hover:shadow-md transition-all
        ${isDragging ? "opacity-50" : ""}
      `}
      onClick={handleClick}
      {...listeners}
      {...attributes}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 text-primary">{template.icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-900">
            {template.label}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            {template.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function ElementLibrary({
  className = "",
}: ElementLibraryProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`bg-neutral-50 border-l border-neutral-200 ${className}`}>
      {/* 標題列 */}
      <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-900">元件庫</h3>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded hover:bg-neutral-200 transition"
          title={isCollapsed ? "展開" : "收合"}
        >
          <svg
            className={`w-5 h-5 text-neutral-600 transition-transform ${
              isCollapsed ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* 元件列表 */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-3">
              <p className="text-xs text-neutral-600 mb-4">
                點擊或拖拉元件到畫布
              </p>

              {ELEMENT_TEMPLATES.map((template) => (
                <DraggableLibraryItem key={template.type} template={template} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 收合狀態的提示 */}
      {isCollapsed && (
        <div className="p-4">
          <div className="flex flex-col items-center space-y-4 text-neutral-400">
            {ELEMENT_TEMPLATES.map((template) => (
              <button
                key={template.type}
                className="p-2 rounded hover:bg-neutral-200 hover:text-primary transition"
                title={template.label}
                onClick={() => setIsCollapsed(false)}
              >
                {template.icon}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
