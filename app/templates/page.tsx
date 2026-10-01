"use client";

import { useState, useEffect } from "react";
import { Template } from "@/types";
import { templatesApi } from "@/lib/mockApi";
import TemplateCard from "@/components/ui/TemplateCard";
import { motion } from "framer-motion";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await templatesApi.getAll();
      if (data.success && data.data) {
        setTemplates(data.data);
      } else {
        setError(data.error || "載入範本失敗");
      }
    } catch (err) {
      setError("載入範本時發生錯誤");
      console.error("Error loading templates:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            邀請函範本
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            選擇一個精美的範本快速開始，或從空白畫布自由創作
          </p>
        </motion.div>

        {/* Loading 狀態 */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">載入範本中...</p>
            </div>
          </div>
        )}

        {/* Error 狀態 */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
          >
            <div className="text-4xl mb-3">❌</div>
            <p className="text-red-800 font-medium mb-2">{error}</p>
            <button
              onClick={loadTemplates}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              重試
            </button>
          </motion.div>
        )}

        {/* 範本網格 */}
        {!loading && !error && templates.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template, index) => (
              <TemplateCard
                key={template.id}
                template={template}
                index={index}
              />
            ))}
          </div>
        )}

        {/* 空狀態 */}
        {!loading && !error && templates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              尚無範本
            </h2>
            <p className="text-gray-600">目前沒有可用的範本</p>
          </motion.div>
        )}

        {/* CTA Section */}
        {!loading && !error && templates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center bg-gradient-to-r from-primary to-secondary rounded-2xl p-12 text-white"
          >
            <h2 className="text-3xl font-bold mb-4">找不到合適的範本？</h2>
            <p className="text-lg mb-8 opacity-90">
              從空白畫布開始，自由發揮您的創意
            </p>
            <a
              href="/invitations/create"
              className="inline-block px-8 py-4 bg-white text-primary rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
            >
              建立空白邀請函
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
}
