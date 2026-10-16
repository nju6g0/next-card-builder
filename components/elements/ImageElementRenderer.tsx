"use client";

import { useState } from "react";
import type { ImageElement } from "@/types";

interface ImageElementRendererProps {
  element: ImageElement;
  isSelected: boolean;
  isEditing?: boolean;
  onDoubleClick?: (e: React.MouseEvent) => void;
}

export default function ImageElementRenderer({
  element,
  isSelected,
  isEditing = false,
  onDoubleClick,
}: ImageElementRendererProps) {
  const [imageError, setImageError] = useState(false);

  // 處理圖片載入錯誤
  const handleImageError = () => {
    setImageError(true);
  };

  // 處理圖片載入成功
  const handleImageLoad = () => {
    setImageError(false);
  };

  const imageStyle = {
    objectFit: element.objectFit || "cover",
    filter: element.blur ? `blur(${element.blur}px)` : undefined,
  } as React.CSSProperties;

  return (
    <div className="w-full h-full relative">
      {element.src ? (
        <img
          src={element.src}
          alt={element.alt}
          className="w-full h-full"
          style={imageStyle}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-neutral-100 border-2 border-dashed border-neutral-300">
          <div className="text-center text-neutral-400 px-4">
            <svg
              className="mx-auto h-12 w-12 mb-2"
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
            <p className="text-sm">請在右側屬性面板</p>
            <p className="text-sm">輸入圖片 URL</p>
          </div>
        </div>
      )}

      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
          <div className="text-center text-neutral-400">
            <svg
              className="mx-auto h-8 w-8 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-xs">無法載入圖片</p>
            <p className="text-xs text-neutral-500 mt-1">請檢查 URL 是否正確</p>
          </div>
        </div>
      )}
    </div>
  );
}
