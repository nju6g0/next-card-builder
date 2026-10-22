"use client";

import { useEffect, useState } from "react";
import WeddingPreview from "@/components/restricted-editor/WeddingPreview";
import PartyPreview from "@/components/restricted-editor/PartyPreview";
import type { RestrictedTemplate } from "@/types";

export default function RestrictedPreviewPage() {
  const [previewData, setPreviewData] = useState<{
    template: RestrictedTemplate;
    userValues: Record<string, string | number | boolean>;
  } | null>(null);

  useEffect(() => {
    // 從 sessionStorage 讀取預覽資料
    const data = sessionStorage.getItem("preview-data");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        // 使用 setTimeout 避免在 effect 中直接調用 setState
        setTimeout(() => setPreviewData(parsed), 0);
      } catch (err) {
        console.error("解析預覽資料失敗:", err);
      }
    }
  }, []);

  if (!previewData) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-900">
        <div className="text-white text-center">
          <p className="text-xl mb-4">無預覽資料</p>
          <button
            onClick={() => window.close()}
            className="px-4 py-2 bg-white text-neutral-900 rounded-lg hover:bg-neutral-100"
          >
            關閉視窗
          </button>
        </div>
      </div>
    );
  }

  const { template, userValues } = previewData;
  const animationType = template.animationConfig?.type;

  return (
    <div className="h-screen w-screen overflow-hidden bg-black">
      {animationType === "wedding" && (
        <WeddingPreview userValues={userValues} isPlaying={true} />
      )}
      {animationType === "party" && (
        <PartyPreview userValues={userValues} isPlaying={true} />
      )}
    </div>
  );
}
