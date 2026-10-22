"use client";

import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { motion, AnimatePresence } from "motion/react";
import type {
  ElementType,
  TextElement,
  ImageElement,
  RsvpFormElement,
  AnimatedTextWeddingElement,
  AnimatedTextPartyElement,
} from "@/types";
import { useEditorStore } from "@/stores/editorStore";
import {
  EditIcon,
  ImageIcon,
  DocumentIcon,
  SparklesIcon,
  EmojiIcon,
  ChevronDownIcon,
} from "@/components/icons";

interface ElementLibraryProps {
  className?: string;
}

interface ElementTemplate {
  type: ElementType;
  icon: React.ReactNode;
  label: string;
  description: string;
  defaultProps: Partial<
    | TextElement
    | ImageElement
    | RsvpFormElement
    | AnimatedTextWeddingElement
    | AnimatedTextPartyElement
  >;
}

const ELEMENT_TEMPLATES: ElementTemplate[] = [
  {
    type: "text",
    icon: <EditIcon className="w-6 h-6" />,
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
    icon: <ImageIcon className="w-6 h-6" />,
    label: "圖片",
    description: "使用圖片 URL",
    defaultProps: {
      src: "",
      alt: "圖片",
      isBackground: false,
      objectFit: "cover",
    },
  },
  {
    type: "rsvp-form",
    icon: <DocumentIcon className="w-6 h-6" />,
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
  {
    type: "animated-text-wedding",
    icon: <SparklesIcon className="w-6 h-6" />,
    label: "淡入旋轉文字",
    description: "淡入旋轉動畫文字",
    defaultProps: {
      content: "Welcome to the Party!",
      fontSize: 32,
      fontFamily: "Playfair Display",
      color: "#000000",
      fontWeight: 700,
      animationDelay: 0,
    },
  },
  {
    type: "animated-text-party",
    icon: <EmojiIcon className="w-6 h-6" />,
    label: "逐字飛入文字",
    description: "逐字飛入動畫文字",
    defaultProps: {
      content: "We're Getting Married!",
      fontSize: 32,
      fontFamily: "Playfair Display",
      color: "#000000",
      fontWeight: 600,
      animationDelay: 0,
      charStaggerDelay: 0.05,
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
      label: template.label,
      icon: template.icon,
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
        hover:border-primary hover:shadow-md hover:cursor-grab active:cursor-grabbing transition-all
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
          <ChevronDownIcon
            className={`w-5 h-5 text-neutral-600 transition-transform ${
              isCollapsed ? "rotate-180" : ""
            }`}
          />
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
