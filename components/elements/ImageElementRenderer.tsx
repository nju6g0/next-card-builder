"use client";

import { useState, useRef } from "react";
import type { ImageElement } from "@/types";
import { useEditorStore } from "@/stores/editorStore";

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
  const { updateElement } = useEditorStore();
  const setEditingElement = useEditorStore((state) => state.setEditingElement);
  const [imageError, setImageError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 處理圖片雙擊 - 直接打開文件選擇對話框
  const handleImageDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Image double clicked, opening file dialog");
    fileInputRef.current?.click();
  };

  // 處理圖片載入錯誤
  const handleImageError = () => {
    setImageError(true);
  };

  // 處理圖片載入成功
  const handleImageLoad = () => {
    setImageError(false);
  };

  // 處理檔案選擇
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleFileChange triggered");
    const file = e.target.files?.[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    console.log("File selected:", file.name, file.type, file.size);

    // 檢查檔案類型
    if (!file.type.startsWith("image/")) {
      alert("請選擇圖片檔案");
      return;
    }

    // 檢查檔案大小（限制 1MB）
    if (file.size > 1 * 1024 * 1024) {
      alert("圖片檔案不能超過 1MB");
      return;
    }

    setIsUploading(true);

    try {
      // 轉換為 base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        console.log("Image loaded successfully");

        // 創建一個 Image 對象來獲取圖片的實際尺寸
        const img = new Image();
        img.onload = () => {
          console.log("Image dimensions:", img.width, "x", img.height);

          // 計算新的元素尺寸，保持圖片比例
          const aspectRatio = img.width / img.height;
          let newWidth = element.width;
          let newHeight = element.height;

          // 根據當前元素的寬度，計算對應比例的高度
          // 或者根據高度計算寬度，取決於哪個方向更合適
          if (aspectRatio > 1) {
            // 橫向圖片：保持寬度，調整高度
            newHeight = newWidth / aspectRatio;
          } else {
            // 縱向圖片：保持高度，調整寬度
            newWidth = newHeight * aspectRatio;
          }

          // 確保尺寸不會太小或太大
          const minSize = 50;
          const maxSize = 500;

          if (newWidth < minSize) {
            newWidth = minSize;
            newHeight = newWidth / aspectRatio;
          }
          if (newHeight < minSize) {
            newHeight = minSize;
            newWidth = newHeight * aspectRatio;
          }
          if (newWidth > maxSize) {
            newWidth = maxSize;
            newHeight = newWidth / aspectRatio;
          }
          if (newHeight > maxSize) {
            newHeight = maxSize;
            newWidth = newHeight * aspectRatio;
          }

          // 更新元素，包含圖片和新的尺寸
          updateElement(element.id, {
            src: base64,
            alt: file.name,
            width: Math.round(newWidth),
            height: Math.round(newHeight),
          });

          setIsUploading(false);
          setImageError(false);
        };

        img.onerror = () => {
          console.error("Failed to load image for dimension calculation");
          // 即使無法獲取尺寸，也更新圖片
          updateElement(element.id, {
            src: base64,
            alt: file.name,
          });
          setIsUploading(false);
          setImageError(false);
        };

        img.src = base64;
      };

      reader.onerror = () => {
        alert("圖片讀取失敗");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      alert("圖片處理失敗");
      setIsUploading(false);
    }
  };

  const imageStyle = {
    objectFit: element.objectFit || "cover",
    filter: element.blur ? `blur(${element.blur}px)` : undefined,
  } as React.CSSProperties;

  // 顯示模式 - 直接顯示圖片，雙擊觸發文件選擇
  return (
    <>
      {/* 隱藏的文件輸入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id={`file-input-${element.id}`}
      />

      <div
        className="w-full h-full relative group"
        onDoubleClick={handleImageDoubleClick}
      >
        <img
          src={element.src}
          alt={element.alt}
          className="w-full h-full pointer-events-none"
          style={imageStyle}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />

        {/* 上傳中指示器 */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <svg
                className="animate-spin h-8 w-8 mx-auto mb-2"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <p className="text-sm">上傳中...</p>
            </div>
          </div>
        )}

        {/* Hover 提示 */}
        {isSelected && !isUploading && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition text-white text-xs bg-black/50 px-2 py-1 rounded">
              雙擊更換圖片
            </span>
          </div>
        )}
      </div>
    </>
  );
}
