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
import {
  TextIcon,
  ImageIcon,
  DocumentIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  UnlockIcon,
  TrashIcon,
  DuplicateIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  LayersIcon,
} from "@/components/icons";

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
        return <TextIcon className="w-4 h-4" />;
      case "image":
        return <ImageIcon className="w-4 h-4" />;
      case "rsvp-form":
        return <DocumentIcon className="w-4 h-4" />;
    }
  };

  const getLabel = () => {
    switch (element.type) {
      case "text":
        const textEl = element as TextElement;
        return textEl.content?.substring(0, 20) || "文字";
      case "image":
        const imgEl = element as ImageElement;
        return imgEl.isBackground ? "背景圖片" : "圖片";
      case "rsvp-form":
        const rsvpEl = element as RsvpFormElement;
        return rsvpEl.title || "RSVP 表單";
    }
  };

  const isLocked = (element as any).locked || false;
  const isVisible = (element as any).visible !== false;
  const isBackground =
    element.type === "image" && (element as ImageElement).isBackground;

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
        <div className="flex items-center gap-1">
          <p className="text-sm font-medium text-neutral-900 truncate">
            {getLabel()}
          </p>
          {isBackground && (
            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
              背景
            </span>
          )}
        </div>
        <p className="text-xs text-neutral-500">
          {element.type === "text" && "文字元件"}
          {element.type === "image" && (isBackground ? "畫布背景" : "圖片元件")}
          {element.type === "rsvp-form" && "RSVP 表單"}
          {element.type === "animated-text-wedding" && "Wedding 動畫"}
          {element.type === "animated-text-party" && "Party 動畫"}
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
            <EyeIcon className="w-3.5 h-3.5 text-neutral-600" />
          ) : (
            <EyeOffIcon className="w-3.5 h-3.5 text-neutral-400" />
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
            <LockIcon className="w-3.5 h-3.5 text-amber-500" />
          ) : (
            <UnlockIcon className="w-3.5 h-3.5 text-neutral-400" />
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
          <DuplicateIcon className="w-3.5 h-3.5 text-neutral-600" />
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
          <TrashIcon className="w-3.5 h-3.5 text-red-600" />
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
            <LayersIcon className="w-5 h-5 text-neutral-600" />
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
          <LayersIcon className="w-4 h-4 text-neutral-600" />
          <h3 className="text-sm font-semibold text-neutral-900">圖層</h3>
          <span className="text-xs text-neutral-500">({elements.length})</span>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 hover:bg-neutral-200 rounded transition-colors"
          title="收合"
        >
          <ChevronLeftIcon className="w-4 h-4 text-neutral-600" />
        </button>
      </div>

      {/* Layer List */}
      <div className="flex-1 overflow-y-auto p-2">
        {elements.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <LayersIcon className="w-12 h-12 text-neutral-300 mb-3" />
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
