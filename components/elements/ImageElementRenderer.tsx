"use client";

import { useState } from "react";
import type { ImageElement } from "@/types";
import { ImageIcon, AlertTriangleIcon } from "@/components/icons";

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
            <ImageIcon className="mx-auto h-12 w-12 mb-2" />
            <p className="text-sm">請在右側屬性面板</p>
            <p className="text-sm">輸入圖片 URL</p>
          </div>
        </div>
      )}

      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
          <div className="text-center text-neutral-400">
            <AlertTriangleIcon className="mx-auto h-8 w-8 mb-2" />
            <p className="text-xs">無法載入圖片</p>
            <p className="text-xs text-neutral-500 mt-1">請檢查 URL 是否正確</p>
          </div>
        </div>
      )}
    </div>
  );
}
