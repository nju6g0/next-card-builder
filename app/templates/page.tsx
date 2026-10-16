"use client";

import { useState, useEffect } from "react";
import { getAllRestrictedTemplates } from "@/lib/templates/templateRegistry";
import TemplateCard from "@/components/ui/TemplateCard";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";

export default function TemplatesPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模擬載入
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // 只使用受限模板
  const templates = getAllRestrictedTemplates();

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
          <h1 className="section-title font-serif">邀請函範本</h1>
          <p className="section-subtitle">
            選擇精美的動畫範本，只需自訂文字、顏色和圖片即可快速完成
          </p>
        </motion.div>

        {/* Loading 狀態 */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-soft-beige border-t-accent-terracotta mx-auto mb-4"></div>
              <p className="text-text-secondary">載入範本中...</p>
            </div>
          </div>
        )}

        {/* 範本網格 */}
        {!loading && (
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

        {/* CTA Section */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-xl text-center bg-deep-brown rounded-2xl p-xl text-white relative overflow-hidden"
          >
            <h2 className="text-[2rem] font-bold mb-md font-serif">
              想要更多自由度？
            </h2>
            <p className="text-lg mb-lg opacity-90">
              從空白畫布開始，完全自由地設計您的邀請函
            </p>
            <a href="/invitations/create">
              <Button variant="primary" size="large">
                建立空白邀請函
              </Button>
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
}
