"use client";

import { useRestrictedEditorStore } from "@/stores/restrictedEditorStore";
import WeddingPreview from "./WeddingPreview";
import PartyPreview from "./PartyPreview";
import { RefreshIcon } from "@/components/icons";

interface RestrictedPreviewProps {
  className?: string;
}

export default function RestrictedPreview({
  className = "",
}: RestrictedPreviewProps) {
  const { template, userValues, isAnimationPlaying, restartAnimation } =
    useRestrictedEditorStore();

  if (!template) {
    return (
      <div
        className={`flex items-center justify-center bg-neutral-100 ${className}`}
      >
        <div className="text-center text-neutral-500">未選擇模板</div>
      </div>
    );
  }

  const animationType = template.animationConfig?.type;

  return (
    <div className={`relative ${className}`}>
      {/* 預覽區域 */}
      <div className="relative w-full h-full bg-white">
        {animationType === "wedding" && (
          <WeddingPreview
            userValues={userValues}
            isPlaying={isAnimationPlaying}
          />
        )}
        {animationType === "party" && (
          <PartyPreview
            userValues={userValues}
            isPlaying={isAnimationPlaying}
          />
        )}
      </div>

      {/* 重播按鈕 */}
      <div className="absolute bottom-6 right-6">
        <button
          onClick={restartAnimation}
          className="flex items-center space-x-2 px-4 py-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors backdrop-blur-sm"
          title="重播動畫"
        >
          <RefreshIcon className="w-5 h-5 text-neutral-700" />
          <span className="text-sm font-medium text-neutral-700">重播</span>
        </button>
      </div>

      {/* 模板資訊覆蓋層 */}
      <div className="absolute top-4 left-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg px-4 py-2">
          <div className="text-xs text-neutral-500">預覽模式</div>
          <div className="text-sm font-semibold text-neutral-900">
            {template.name}
          </div>
        </div>
      </div>
    </div>
  );
}
