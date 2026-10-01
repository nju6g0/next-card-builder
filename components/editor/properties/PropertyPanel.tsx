"use client";

import { useEditorStore } from "@/stores/editorStore";
import type { TextElement, ImageElement, RsvpFormElement } from "@/types";
import CommonProperties from "./CommonProperties";
import TextProperties from "./TextProperties";
import ImageProperties from "./ImageProperties";
import RsvpFormProperties from "./RsvpFormProperties";
import { motion, AnimatePresence } from "framer-motion";

interface PropertyPanelProps {
  className?: string;
}

export default function PropertyPanel({ className = "" }: PropertyPanelProps) {
  const { selectedElementId, elements } = useEditorStore();

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  if (!selectedElement) {
    return (
      <div className={`bg-neutral-50 border-l border-neutral-200 ${className}`}>
        <div className="p-6 text-center">
          <svg
            className="mx-auto h-16 w-16 text-neutral-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
            />
          </svg>
          <p className="text-sm text-neutral-600 font-medium mb-1">
            未選取元件
          </p>
          <p className="text-xs text-neutral-500">點擊畫布上的元件以編輯屬性</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white border-l border-neutral-200 overflow-auto ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedElement.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* 標題 */}
          <div className="p-4 border-b border-neutral-200 bg-neutral-50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-neutral-900">
                屬性編輯
              </h3>
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                {selectedElement.type === "text" && "文字"}
                {selectedElement.type === "image" && "圖片"}
                {selectedElement.type === "rsvp-form" && "RSVP"}
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              ID: {selectedElement.id.slice(0, 16)}...
            </p>
          </div>

          {/* 通用屬性 */}
          <div className="border-b border-neutral-200">
            <CommonProperties element={selectedElement} />
          </div>

          {/* 元件特定屬性 */}
          {selectedElement.type === "text" && (
            <TextProperties element={selectedElement as TextElement} />
          )}
          {selectedElement.type === "image" && (
            <ImageProperties element={selectedElement as ImageElement} />
          )}
          {selectedElement.type === "rsvp-form" && (
            <RsvpFormProperties element={selectedElement as RsvpFormElement} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
