"use client";

import { useEditorStore } from "@/stores/editorStore";
import type {
  TextElement,
  ImageElement,
  RsvpFormElement,
  AnimatedTextWeddingElement,
  AnimatedTextPartyElement,
} from "@/types";
import { CursorClickIcon } from "@/components/icons";
import CommonProperties from "./CommonProperties";
import TextProperties from "./TextProperties";
import ImageProperties from "./ImageProperties";
import RsvpFormProperties from "./RsvpFormProperties";
import AnimatedTextWeddingProperties from "./AnimatedTextWeddingProperties";
import AnimatedTextPartyProperties from "./AnimatedTextPartyProperties";
import { motion, AnimatePresence } from "motion/react";

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
          <CursorClickIcon className="mx-auto h-16 w-16 text-neutral-300 mb-4" />
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
                {selectedElement.type === "animated-text-wedding" &&
                  "Wedding 動畫"}
                {selectedElement.type === "animated-text-party" && "Party 動畫"}
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
          {selectedElement.type === "animated-text-wedding" && (
            <AnimatedTextWeddingProperties
              element={selectedElement as AnimatedTextWeddingElement}
            />
          )}
          {selectedElement.type === "animated-text-party" && (
            <AnimatedTextPartyProperties
              element={selectedElement as AnimatedTextPartyElement}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
