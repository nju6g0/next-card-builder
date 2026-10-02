"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Template } from "@/types";
import { templatesApi, invitationsApi, rsvpApi } from "@/lib/mockApi";
import InvitationCanvas from "@/components/ui/InvitationCanvas";
import { motion } from "motion/react";
import { useAuthStore } from "@/stores/authStore";

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;
  const { isAuthenticated } = useAuthStore();

  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState<"mobile" | "tablet" | "desktop">("mobile");

  useEffect(() => {
    loadTemplate();
  }, [templateId]);

  const loadTemplate = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await templatesApi.getById(templateId);
      if (response.success && response.data) {
        setTemplate(response.data);
      } else {
        setError("找不到此範本");
      }
    } catch (err) {
      setError("載入範本時發生錯誤");
      console.error("Error loading template:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = () => {
    if (!isAuthenticated) {
      // 導向登入頁，並在登入後返回此頁
      router.push(`/login?redirect=/templates/${templateId}`);
      return;
    }

    // 導向建立頁並帶入 templateId
    router.push(`/invitations/create?templateId=${templateId}`);
  };

  const getScaleValue = () => {
    switch (scale) {
      case "mobile":
        return 1;
      case "tablet":
        return 0.7;
      case "desktop":
        return 0.5;
      default:
        return 1;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">載入範本中...</p>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-lg p-12 text-center max-w-md"
        >
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">找不到範本</h1>
          <p className="text-gray-600 mb-6">
            {error || "此範本不存在或已被移除"}
          </p>
          <button
            onClick={() => router.push("/templates")}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
          >
            返回範本列表
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            返回
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {template.name}
              </h1>
              <p className="text-lg text-gray-600">{template.description}</p>
            </div>

            <button
              onClick={handleUseTemplate}
              className="px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all transform hover:scale-105 shadow-lg"
            >
              使用此範本
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 預覽區域 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* 預覽工具列 */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                  範本預覽
                </h2>

                {/* 尺寸切換 */}
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setScale("mobile")}
                    className={`px-3 py-1 rounded transition ${
                      scale === "mobile"
                        ? "bg-white text-primary shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    📱
                  </button>
                  <button
                    onClick={() => setScale("tablet")}
                    className={`px-3 py-1 rounded transition ${
                      scale === "tablet"
                        ? "bg-white text-primary shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    💻
                  </button>
                  <button
                    onClick={() => setScale("desktop")}
                    className={`px-3 py-1 rounded transition ${
                      scale === "desktop"
                        ? "bg-white text-primary shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    🖥️
                  </button>
                </div>
              </div>

              {/* 畫布預覽 */}
              <div className="flex items-center justify-center bg-gray-100 rounded-lg p-8 min-h-[600px]">
                <InvitationCanvas
                  elements={template.elements}
                  canvasSize={template.canvasSize}
                  scale={getScaleValue()}
                  className="shadow-2xl"
                />
              </div>
            </div>
          </motion.div>

          {/* 資訊側邊欄 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* 範本資訊 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                範本資訊
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">範本 ID</span>
                  <span className="font-mono text-gray-900">{template.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">畫布尺寸</span>
                  <span className="text-gray-900">
                    {template.canvasSize.width} × {template.canvasSize.height}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">元件數量</span>
                  <span className="text-gray-900">
                    {template.elements.length} 個
                  </span>
                </div>
              </div>
            </div>

            {/* 元件列表 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                包含元件
              </h3>

              <div className="space-y-2">
                {template.elements.map((element, index) => (
                  <div
                    key={element.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="text-2xl">
                      {element.type === "text" && "📝"}
                      {element.type === "image" && "🖼️"}
                      {element.type === "rsvp-form" && "📋"}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {element.type === "text" && "文字元件"}
                        {element.type === "image" &&
                          (element.isBackground ? "背景圖片" : "圖片元件")}
                        {element.type === "rsvp-form" && "RSVP 表單"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {element.type === "text" &&
                          `"${element.content.substring(0, 20)}..."`}
                        {element.type === "image" &&
                          `${element.width}×${element.height}`}
                        {element.type === "rsvp-form" &&
                          "姓名 · Email · 參加狀態"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-primary to-secondary rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">喜歡這個範本？</h3>
              <p className="text-sm opacity-90 mb-4">
                點擊「使用此範本」開始客製化您的邀請函
              </p>
              <button
                onClick={handleUseTemplate}
                className="w-full px-4 py-3 bg-white text-primary rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
              >
                {isAuthenticated ? "使用此範本" : "登入後使用"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
