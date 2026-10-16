"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRestrictedTemplateById } from "@/lib/templates/templateRegistry";
import WeddingPreview from "@/components/restricted-editor/WeddingPreview";
import PartyPreview from "@/components/restricted-editor/PartyPreview";
import type { RestrictedTemplate } from "@/types";
import { useAuthStore } from "@/stores/authStore";

type ViewportSize = "mobile" | "tablet" | "desktop";

const VIEWPORT_SIZES = {
  mobile: { width: 375, height: 667, label: "手機", icon: "📱" },
  tablet: { width: 768, height: 1024, label: "平板", icon: "📱" },
  desktop: { width: 1920, height: 1080, label: "電腦", icon: "💻" },
};

export default function RestrictedTemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.templateId as string;
  const { currentUser, isAuthenticated } = useAuthStore();

  const [template, setTemplate] = useState<RestrictedTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [viewportSize, setViewportSize] = useState<ViewportSize>("mobile");
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);

  useEffect(() => {
    const loadTemplate = () => {
      try {
        const tmpl = getRestrictedTemplateById(templateId);
        if (!tmpl) {
          setError("找不到指定的模板");
          return;
        }
        setTemplate(tmpl);
      } catch (err) {
        console.error("載入模板錯誤:", err);
        setError("載入模板失敗");
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [templateId]);

  // Debug: 檢查認證狀態
  useEffect(() => {
    console.log("🔐 認證狀態:", { currentUser, isAuthenticated });
  }, [currentUser, isAuthenticated]);

  const handleUseTemplate = () => {
    if (!isAuthenticated || !currentUser) {
      router.push(`/login?redirect=/invitations/restricted-edit/${templateId}`);
      return;
    }
    router.push(`/invitations/restricted-edit/${templateId}`);
  };

  const handleReplay = () => {
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 50);
  };

  const handleOpenFullscreen = () => {
    setIsFullscreenModalOpen(true);
  };

  const handleCloseFullscreen = () => {
    setIsFullscreenModalOpen(false);
  };

  // ESC 鍵關閉 Modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreenModalOpen) {
        handleCloseFullscreen();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isFullscreenModalOpen]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-cream">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">載入中...</p>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-cream">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">載入失敗</h1>
          <p className="text-neutral-600 mb-6">{error || "未知錯誤"}</p>
          <a
            href="/templates"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-block"
          >
            返回模板列表
          </a>
        </div>
      </div>
    );
  }

  const animationType = template.animationConfig?.type;
  const defaultUserValues: Record<string, any> = {};
  template.editableProperties.forEach((prop) => {
    defaultUserValues[prop.propertyKey] = prop.defaultValue;
  });

  const currentViewport = VIEWPORT_SIZES[viewportSize];

  return (
    <div className="min-h-screen bg-warm-cream">
      {/* 主要內容區域 */}
      <div className="container mx-auto px-6 py-8">
        {/* 頁面標題與操作列 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <button
                onClick={() => router.push("/templates")}
                className="text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <h1 className="text-3xl font-bold text-deep-brown font-serif">
                {template.name}
              </h1>
              <span className="text-2xl">
                {template.name.includes("Wedding") ? "💍" : "🎉"}
              </span>
            </div>
            <p className="text-text-secondary ml-8">{template.description}</p>
          </div>

          <button
            onClick={handleUseTemplate}
            className="px-6 py-3 bg-accent-terracotta text-white font-semibold rounded-lg hover:bg-accent-terracotta/90 transition-colors shadow-lg flex items-center space-x-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span>使用此範本</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側：預覽區域 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-soft-beige">
              {/* 視窗大小切換按鈕 */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-neutral-600">
                    視窗大小：
                  </span>
                  <div className="flex bg-soft-beige rounded-lg p-1">
                    {(Object.keys(VIEWPORT_SIZES) as ViewportSize[]).map(
                      (size) => (
                        <button
                          key={size}
                          onClick={() => setViewportSize(size)}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            viewportSize === size
                              ? "bg-white text-accent-terracotta shadow-sm"
                              : "text-neutral-600 hover:text-neutral-900"
                          }`}
                        >
                          <span className="mr-1">
                            {VIEWPORT_SIZES[size].icon}
                          </span>
                          {VIEWPORT_SIZES[size].label}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                <button
                  onClick={handleReplay}
                  className="flex items-center space-x-2 px-4 py-2 bg-soft-beige hover:bg-warm-brown hover:text-white rounded-lg transition-colors text-sm font-medium text-warm-brown"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>重播</span>
                </button>

                <button
                  onClick={handleOpenFullscreen}
                  className="flex items-center space-x-2 px-4 py-2 bg-accent-terracotta hover:bg-accent-terracotta/90 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                    />
                  </svg>
                  <span>全螢幕預覽</span>
                </button>
              </div>

              {/* 動畫預覽容器 */}
              <div
                className="flex items-center justify-center bg-neutral-900 rounded-xl overflow-hidden"
                style={{ minHeight: "600px" }}
              >
                <div
                  className="relative bg-black overflow-hidden shadow-2xl transition-all duration-300"
                  style={{
                    width:
                      viewportSize === "desktop"
                        ? "800px"
                        : viewportSize === "tablet"
                          ? "512px"
                          : "375px",
                    height:
                      viewportSize === "desktop"
                        ? "450px"
                        : viewportSize === "tablet"
                          ? "683px"
                          : "667px",
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      transform:
                        viewportSize === "desktop"
                          ? "scale(0.4167)"
                          : viewportSize === "tablet"
                            ? "scale(0.6667)"
                            : "scale(1)",
                      transformOrigin: "top left",
                      width:
                        viewportSize === "desktop"
                          ? "1920px"
                          : viewportSize === "tablet"
                            ? "768px"
                            : "375px",
                      height:
                        viewportSize === "desktop"
                          ? "1080px"
                          : viewportSize === "tablet"
                            ? "1024px"
                            : "667px",
                    }}
                  >
                    {animationType === "wedding" && (
                      <WeddingPreview
                        userValues={defaultUserValues}
                        isPlaying={isPlaying}
                      />
                    )}
                    {animationType === "party" && (
                      <PartyPreview
                        userValues={defaultUserValues}
                        isPlaying={isPlaying}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* 尺寸資訊 */}
              <div className="mt-4 text-center text-sm text-neutral-500">
                目前預覽尺寸：{currentViewport.width} × {currentViewport.height}{" "}
                px
              </div>
            </div>
          </div>

          {/* 右側：模板資訊 */}
          <div className="space-y-6">
            {/* 模板特色 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-soft-beige">
              <h3 className="text-lg font-semibold text-deep-brown mb-4 font-serif">
                模板特色
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-accent-terracotta/10 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-accent-terracotta"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-neutral-900 mb-1">
                      精緻動畫效果
                    </h4>
                    <p className="text-sm text-neutral-600">
                      專業設計的動畫時序，讓邀請函更加生動吸引
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-accent-sage/10 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-accent-sage"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-neutral-900 mb-1">
                      簡單快速自訂
                    </h4>
                    <p className="text-sm text-neutral-600">
                      只需修改文字、顏色和圖片即可完成
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-accent-terracotta/10 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-accent-terracotta"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-neutral-900 mb-1">
                      響應式設計
                    </h4>
                    <p className="text-sm text-neutral-600">
                      在手機、平板、電腦上都能完美呈現
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 可編輯屬性 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-soft-beige">
              <h3 className="text-lg font-semibold text-deep-brown mb-4 font-serif">
                可自訂內容
              </h3>
              <div className="space-y-3">
                {Array.from(
                  new Set(template.editableProperties.map((p) => p.group)),
                ).map((group) => (
                  <div key={group}>
                    <h4 className="text-sm font-semibold text-neutral-700 mb-2">
                      {group}
                    </h4>
                    <ul className="space-y-1 ml-4">
                      {template.editableProperties
                        .filter((p) => p.group === group)
                        .map((prop) => (
                          <li
                            key={prop.id}
                            className="text-sm text-neutral-600 flex items-center"
                          >
                            <span className="w-1.5 h-1.5 bg-accent-terracotta rounded-full mr-2"></span>
                            {prop.label}
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA 按鈕（行動版） */}
            <button
              onClick={handleUseTemplate}
              className="w-full px-6 py-4 bg-accent-terracotta text-white font-semibold rounded-lg hover:bg-accent-terracotta/90 transition-colors shadow-lg flex items-center justify-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <span>使用此範本</span>
            </button>
          </div>
        </div>
      </div>

      {/* 全螢幕 Modal */}
      {isFullscreenModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 animate-in fade-in duration-300"
          onClick={handleCloseFullscreen}
        >
          {/* Modal 內容 */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 動畫容器 */}
            <div
              className="relative bg-black shadow-2xl animate-in zoom-in-95 duration-300"
              style={{
                width: "1920px",
                height: "1080px",
                maxWidth: "95vw",
                maxHeight: "95vh",
              }}
            >
              {animationType === "wedding" && (
                <WeddingPreview
                  userValues={defaultUserValues}
                  isPlaying={isPlaying}
                />
              )}
              {animationType === "party" && (
                <PartyPreview
                  userValues={defaultUserValues}
                  isPlaying={isPlaying}
                />
              )}
            </div>

            {/* 控制列 */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-4 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 shadow-lg animate-in slide-in-from-bottom duration-500 delay-200">
              <button
                onClick={handleReplay}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-200 hover:scale-105"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>重播</span>
              </button>

              <button
                onClick={handleCloseFullscreen}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-200 hover:scale-105"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span>關閉</span>
              </button>
            </div>

            {/* ESC 提示（3秒後消失） */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm animate-in fade-in slide-in-from-top duration-300 animate-out fade-out slide-out-to-top delay-[3000]">
              按 ESC 或點擊背景即可關閉
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
