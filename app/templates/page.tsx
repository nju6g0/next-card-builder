"use client";

import { useState, useEffect } from "react";
import { Template } from "@/types";
import { templatesApi } from "@/lib/mockApi";
import TemplateCard from "@/components/ui/TemplateCard";
import { motion } from "motion/react";

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
    <div className="min-h-screen bg-warm-cream py-xl px-md">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="section-header mb-xl"
        >
          <h1 className="section-title font-serif">
            邀請函範本
          </h1>
          <p className="section-subtitle">
            選擇一個精美的範本快速開始，或從空白畫布自由創作
          </p>
        </motion.div>

        {/* Loading 狀態 */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-soft-beige border-t-accent-terracotta mx-auto mb-4"></div>
              <p className="text-text-secondary">
                載入範本中...
              </p>
            </div>
          </div>
        )}

        {/* Error 狀態 */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-accent-terracotta/10 border-2 border-accent-terracotta/30 rounded-2xl p-lg text-center"
          >
            <div className="text-5xl mb-sm">❌</div>
            <p className="text-accent-terracotta font-medium mb-xs">
              {error}
            </p>
            <button
              onClick={loadTemplates}
              className="btn-primary mt-md"
            >
              重試
            </button>
          </motion.div>
        )}

        {/* 範本網格 */}
        {!loading && !error && templates.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-lg">
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
            <div className="text-6xl mb-md">📋</div>
            <h2 className="text-2xl font-semibold text-deep-brown mb-xs font-serif">
              尚無範本
            </h2>
            <p className="text-text-secondary">
              目前沒有可用的範本
            </p>
          </motion.div>
        )}

        {/* CTA Section */}
        {!loading && !error && templates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-xl text-center bg-deep-brown rounded-2xl p-xl text-white relative overflow-hidden"
          >
            <h2 className="text-[2rem] font-bold mb-md font-serif">
              找不到合適的範本？
            </h2>
            <p className="text-lg mb-lg opacity-90">
              從空白畫布開始，自由發揮您的創意
            </p>
            <a
              href="/invitations/create"
              className="btn-primary inline-block no-underline text-lg px-12 py-5"
            >
              建立空白邀請函
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
}
