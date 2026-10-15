"use client";

import { Template } from "@/types";
import { motion } from "motion/react";
import Link from "next/link";
import InvitationCanvas from "./InvitationCanvas";

interface TemplateCardProps {
  template: Template;
  index?: number;
}

/**
 * TemplateCard - 範本卡片元件
 * 顯示範本縮圖、名稱和描述
 */
export default function TemplateCard({
  template,
  index = 0,
}: TemplateCardProps) {
  // 動畫範本導向獨立頁面，一般範本導向編輯器
  const href =
    template.isAnimated && template.slug
      ? `/templates/${template.slug}`
      : `/templates/${template.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link href={href} className="no-underline">
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-transparent transition-all duration-300 hover:shadow-2xl hover:border-[var(--color-accent-terracotta)]">
          {/* 範本預覽 */}
          <div className="relative aspect-[9/16] bg-[var(--color-soft-beige)] overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="scale-[0.4] origin-center">
                <InvitationCanvas
                  elements={template.elements}
                  canvasSize={template.canvasSize}
                  scale={1}
                />
              </div>
            </div>

            {/* Hover 覆蓋層 */}
            <div className="absolute inset-0 bg-[var(--color-deep-brown)]/0 transition-all duration-300 flex items-center justify-center group-hover:bg-[var(--color-deep-brown)]/10">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <div className="px-6 py-3 bg-white rounded-full shadow-lg font-medium text-[var(--color-accent-terracotta)]">
                  查看詳情
                </div>
              </motion.div>
            </div>
          </div>

          {/* 範本資訊 */}
          <div className="p-[var(--spacing-md)]">
            <h3 className="text-lg font-semibold text-[var(--color-deep-brown)] mb-[var(--spacing-xs)] font-[var(--font-family-serif)] transition-colors duration-300 group-hover:text-[var(--color-accent-terracotta)]">
              {template.name}
            </h3>
            <p className="text-[0.9rem] text-[var(--color-text-secondary)] leading-relaxed overflow-hidden line-clamp-2">
              {template.description}
            </p>

            {/* 標籤 */}
            <div className="mt-[var(--spacing-sm)] flex items-center gap-[var(--spacing-xs)] text-xs text-[var(--color-text-light)]">
              {template.isAnimated ? (
                <span className="text-[var(--color-accent-terracotta)] font-semibold">
                  ✨ 動畫範本
                </span>
              ) : (
                <>
                  <span>{template.elements.length} 個元件</span>
                  <span>•</span>
                  <span>
                    {template.canvasSize.width} × {template.canvasSize.height}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
