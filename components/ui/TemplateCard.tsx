"use client";

import { Template } from "@/types";
import type { RestrictedTemplate } from "@/types";
import { motion } from "motion/react";
import Link from "next/link";
import InvitationCanvas from "./InvitationCanvas";

interface TemplateCardProps {
  template: Template | RestrictedTemplate;
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
  // 判斷是否為受限模板
  const isRestricted = "isRestricted" in template && template.isRestricted;

  // 決定連結路徑
  let href: string;
  if (isRestricted) {
    // 受限模板導向展示頁面（簡化路徑）
    href = `/templates/${template.id}`;
  } else if (template.isAnimated && template.slug) {
    // 動畫範本導向獨立頁面
    href = `/templates/${template.slug}`;
  } else {
    // 一般範本導向編輯器
    href = `/templates/${template.id}`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link href={href} className="no-underline">
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-transparent transition-all duration-300 hover:shadow-2xl hover:border-accent-terracotta">
          {/* 範本預覽 */}
          <div className="relative aspect-[5/4] bg-soft-beige overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent-terracotta/20 to-accent-sage/20">
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {template.name.includes("Wedding") ? "💍" : "🎉"}
                </div>
                <p className="text-sm font-medium text-deep-brown">
                  動畫模板預覽
                </p>
              </div>
            </div>

            {/* Hover 覆蓋層 */}
            <div className="absolute inset-0 bg-deep-brown/0 transition-all duration-300 flex items-center justify-center group-hover:bg-deep-brown/10">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <div className="px-6 py-3 bg-white rounded-full shadow-lg font-medium text-accent-terracotta">
                  {isRestricted ? "查看範本" : "查看詳情"}
                </div>
              </motion.div>
            </div>
          </div>

          {/* 範本資訊 */}
          <div className="p-md">
            <h3 className="text-lg font-semibold text-deep-brown mb-xs font-serif transition-colors duration-300 group-hover:text-accent-terracotta">
              {template.name}
            </h3>
            <p className="text-[0.9rem] text-text-secondary leading-relaxed overflow-hidden line-clamp-2">
              {template.description}
            </p>

            {/* 標籤 */}
            <div className="mt-sm flex items-center gap-xs text-xs text-text-light">
              {isRestricted ? (
                <span className="text-accent-terracotta font-semibold">
                  🎨 可自訂動畫範本
                </span>
              ) : template.isAnimated ? (
                <span className="text-accent-terracotta font-semibold">
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
