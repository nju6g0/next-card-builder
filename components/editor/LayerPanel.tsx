"use client";

import { useState } from "react";
import { useEditorStore } from "@/stores/editorStore";
import { motion, AnimatePresence } from "motion/react";
import type {
  Element,
  TextElement,
  ImageElement,
  RsvpFormElement,
} from "@/types";

interface LayerItemProps {
  element: Element;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

function LayerItem({ element, isSelected, onSelect, index }: LayerItemProps) {
  const {
    updateElement,
    deleteElement,
    duplicateElement,
    moveElementUp,
    moveElementDown,
  } = useEditorStore();

  const getIcon = () => {
    switch (element.type) {
      case "text":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
            />
          </svg>
        );
      case "image":
        return (
          <svg
            className="w-4 h-4"
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
        );
      case "rsvp-form":
        return (
          <svg
            className="w-4 h-4"
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
        );
    }
  };

  const getLabel = () => {
    switch (element.type) {
      case "text":
        const textEl = element as TextElement;
        return textEl.content?.substring(0, 20) || "文字";
      case "image":
        return "圖片";
      case "rsvp-form":
        const rsvpEl = element as RsvpFormElement;
        return rsvpEl.title || "RSVP 表單";
    }
  };

  const isLocked = (element as any).locked || false;
  const isVisible = (element as any).visible !== false;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.15 }}
      className={`group flex items-center gap-2 px-2 py-2 rounded transition-colors cursor-pointer ${
        isSelected
          ? "bg-primary/10 ring-1 ring-primary/50"
          : "hover:bg-neutral-100"
      }`}
      onClick={onSelect}
    >
      {/* Icon */}
      <div
        className={`flex-shrink-0 ${isSelected ? "text-primary" : "text-neutral-500"}`}
      >
        {getIcon()}
      </div>

      {/* Label */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-900 truncate">
          {getLabel()}
        </p>
        <p className="text-xs text-neutral-500">
          {element.type === "text" && "文字元件"}
          {element.type === "image" && "圖片元件"}
          {element.type === "rsvp-form" && "RSVP 表單"}
        </p>
      </div>

      {/* Layer number badge */}
      <div className="text-xs text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
        #{element.zIndex}
      </div>

      {/* Actions (visible on hover or when selected) */}
      <div
        className={`flex items-center gap-1 ${isSelected || "opacity-0 group-hover:opacity-100"} transition-opacity`}
      >
        {/* Visibility toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            updateElement(element.id, { visible: !isVisible } as any);
          }}
          className="p-1 hover:bg-neutral-200 rounded transition-colors"
          title={isVisible ? "隱藏" : "顯示"}
        >
          {isVisible ? (
            <svg
              className="w-3.5 h-3.5 text-neutral-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          ) : (
            <svg
              className="w-3.5 h-3.5 text-neutral-400"
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
          )}
        </button>

        {/* Lock toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            updateElement(element.id, { locked: !isLocked } as any);
          }}
          className="p-1 hover:bg-neutral-200 rounded transition-colors"
          title={isLocked ? "解鎖" : "鎖定"}
        >
          {isLocked ? (
            <svg
              className="w-3.5 h-3.5 text-amber-500"
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
          ) : (
            <svg
              className="w-3.5 h-3.5 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
              />
            </svg>
          )}
        </button>

        {/* Duplicate */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            duplicateElement(element.id);
          }}
          className="p-1 hover:bg-neutral-200 rounded transition-colors"
          title="複製"
        >
          <svg
            className="w-3.5 h-3.5 text-neutral-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </button>

        {/* Delete */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm("確定要刪除此元件嗎？")) {
              deleteElement(element.id);
            }
          }}
          className="p-1 hover:bg-red-100 rounded transition-colors"
          title="刪除"
        >
          <svg
            className="w-3.5 h-3.5 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

export default function LayerPanel({ className = "" }: { className?: string }) {
  const { elements, selectedElementId, selectElement } = useEditorStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Sort by zIndex descending (top layer first)
  const sortedElements = [...elements].sort((a, b) => b.zIndex - a.zIndex);

  if (isCollapsed) {
    return (
      <div className={`bg-white border-l border-neutral-200 ${className}`}>
        <div className="flex flex-col items-center py-4 gap-2">
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            title="展開圖層面板"
          >
            <svg
              className="w-5 h-5 text-neutral-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </button>
          <div className="rotate-90 text-xs font-medium text-neutral-600 whitespace-nowrap">
            圖層
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white border-l border-neutral-200 flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-neutral-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
          <h3 className="text-sm font-semibold text-neutral-900">圖層</h3>
          <span className="text-xs text-neutral-500">({elements.length})</span>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 hover:bg-neutral-200 rounded transition-colors"
          title="收合"
        >
          <svg
            className="w-4 h-4 text-neutral-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* Layer List */}
      <div className="flex-1 overflow-y-auto p-2">
        {elements.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <svg
              className="w-12 h-12 text-neutral-300 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            <p className="text-sm text-neutral-600 font-medium mb-1">
              沒有元件
            </p>
            <p className="text-xs text-neutral-500">
              從左側元件庫拖拉元件到畫布
            </p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-1">
              {sortedElements.map((element, index) => (
                <LayerItem
                  key={element.id}
                  element={element as Element}
                  isSelected={element.id === selectedElementId}
                  onSelect={() => selectElement(element.id)}
                  index={index}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* Footer tips */}
      {elements.length > 0 && (
        <div className="px-4 py-2 border-t border-neutral-200 bg-neutral-50">
          <p className="text-xs text-neutral-500">
            💡 點擊選取元件，拖拉調整圖層順序
          </p>
        </div>
      )}
    </div>
  );
}
