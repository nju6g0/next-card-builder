"use client";

import { Element } from "@/types";
import { motion } from "motion/react";

interface InvitationCanvasProps {
  elements: Element[];
  canvasSize: { width: number; height: number };
  className?: string;
  scale?: number;
  showGrid?: boolean;
}

/**
 * InvitationCanvas - 唯讀畫布元件
 * 用於預覽邀請函內容（不可編輯）
 */
export default function InvitationCanvas({
  elements,
  canvasSize,
  className = "",
  scale = 1,
  showGrid = false,
}: InvitationCanvasProps) {
  // 按 zIndex 排序元件
  const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);

  // 渲染單個元件
  const renderElement = (element: Element) => {
    const style: React.CSSProperties = {
      position: "absolute",
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      zIndex: element.zIndex,
    };

    switch (element.type) {
      case "text":
        return (
          <div
            key={element.id}
            style={{
              ...style,
              fontSize: element.fontSize,
              fontFamily: element.fontFamily,
              color: element.color,
              fontWeight: element.fontWeight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              overflow: "hidden",
            }}
          >
            {element.content}
          </div>
        );

      case "image":
        if (element.isBackground) {
          // 背景圖片
          return (
            <div
              key={element.id}
              style={{
                ...style,
                backgroundImage: `url(${element.src})`,
                backgroundSize: element.objectFit,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
          );
        } else {
          // 一般圖片
          return (
            <img
              key={element.id}
              src={element.src}
              alt={element.alt}
              style={{
                ...style,
                objectFit: element.objectFit,
              }}
            />
          );
        }

      case "rsvp-form":
        // RSVP 表單預覽（唯讀模式只顯示佔位）
        return (
          <div
            key={element.id}
            style={{
              ...style,
              border: "2px dashed #cbd5e1",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              padding: "16px",
            }}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">📝</div>
              <div className="text-sm font-medium text-gray-700">RSVP 表單</div>
              <div className="text-xs text-gray-500 mt-1">
                {element.fields.name && "姓名 "}
                {element.fields.email && "Email "}
                {element.fields.attendance && "參加狀態"}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden ${className}`}
      style={{
        width: canvasSize.width * scale,
        height: canvasSize.height * scale,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      }}
    >
      {/* 背景 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "#ffffff",
        }}
      />

      {/* 網格線（可選） */}
      {showGrid && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e5e7eb 1px, transparent 1px),
              linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />
      )}

      {/* 渲染所有元件 */}
      {sortedElements.map((element) => renderElement(element))}
    </motion.div>
  );
}
