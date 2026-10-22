"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import TemplateCard from "@/components/ui/TemplateCard";
import type { RestrictedTemplate } from "@/types";

interface TemplatesClientProps {
  templates: RestrictedTemplate[];
}

export default function TemplatesClient({ templates }: TemplatesClientProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模擬載入動畫（實際上資料已經從 SSG 取得）
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-soft-beige border-t-accent-terracotta mx-auto mb-4"></div>
          <p className="text-text-secondary">載入範本中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-lg">
      {templates.map((template, index) => (
        <motion.div
          key={template.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <TemplateCard template={template} index={index} />
        </motion.div>
      ))}
    </div>
  );
}
