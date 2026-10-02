"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import InvitationCanvas from "./InvitationCanvas";
import type { Element, CanvasSize } from "@/types";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  elements: Element[];
  canvasSize: CanvasSize;
  title?: string;
}

const SCALE_OPTIONS = [
  { label: "手機", value: "mobile", width: 375, height: 667 },
  { label: "平板", value: "tablet", width: 768, height: 1024 },
  { label: "桌面", value: "desktop", width: 1024, height: 768 },
] as const;

export default function PreviewModal({
  isOpen,
  onClose,
  elements,
  canvasSize,
  title = "預覽",
}: PreviewModalProps) {
  const [selectedScale, setSelectedScale] = useState<
    "mobile" | "tablet" | "desktop"
  >("mobile");

  // ESC 鍵關閉
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // 禁止背景滾動
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const scaleOption = SCALE_OPTIONS.find((opt) => opt.value === selectedScale);
  const scale = scaleOption
    ? Math.min(
        ((typeof window !== "undefined" ? window.innerWidth : 1200) * 0.8) /
          scaleOption.width,
        ((typeof window !== "undefined" ? window.innerHeight : 800) * 0.7) /
          scaleOption.height,
        1,
      )
    : 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal 內容 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-white rounded-lg shadow-2xl max-w-7xl w-full max-h-[90vh] flex flex-col pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 頂部工具列 */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-semibold text-neutral-900">
                    {title}
                  </h2>

                  {/* 尺寸切換 */}
                  <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
                    {SCALE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSelectedScale(option.value)}
                        className={`px-3 py-1.5 text-sm rounded transition-colors ${
                          selectedScale === option.value
                            ? "bg-white text-neutral-900 shadow-sm"
                            : "text-neutral-600 hover:text-neutral-900"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-500">
                    {scaleOption?.width} × {scaleOption?.height}
                  </span>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                    title="關閉 (ESC)"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 預覽區域 */}
              <div className="flex-1 overflow-auto bg-neutral-50 flex items-center justify-center p-8">
                <div
                  style={{
                    width: `${scaleOption?.width}px`,
                    height: `${scaleOption?.height}px`,
                    transform: `scale(${scale})`,
                    transformOrigin: "center",
                  }}
                  className="bg-white shadow-lg"
                >
                  <InvitationCanvas
                    elements={elements}
                    canvasSize={canvasSize}
                    showGrid={false}
                    scale={1}
                  />
                </div>
              </div>

              {/* 底部提示 */}
              <div className="px-6 py-3 border-t border-neutral-200 bg-neutral-50">
                <p className="text-xs text-neutral-500 text-center">
                  按 ESC 鍵或點擊背景關閉預覽
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
