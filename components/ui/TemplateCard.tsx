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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link
        href={`/templates/${template.id}`}
        style={{ textDecoration: "none" }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(107, 84, 68, 0.1)",
            transition: "all 0.3s ease",
            border: "2px solid transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              "0 8px 40px rgba(107, 84, 68, 0.15)";
            e.currentTarget.style.borderColor = "var(--accent-terracotta)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow =
              "0 4px 20px rgba(107, 84, 68, 0.1)";
            e.currentTarget.style.borderColor = "transparent";
          }}
        >
          {/* 範本預覽 */}
          <div
            style={{
              position: "relative",
              aspectRatio: "9/16",
              background: "var(--soft-beige)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  transform: "scale(0.4)",
                  transformOrigin: "center",
                }}
              >
                <InvitationCanvas
                  elements={template.elements}
                  canvasSize={template.canvasSize}
                  scale={1}
                />
              </div>
            </div>

            {/* Hover 覆蓋層 */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(107, 84, 68, 0)",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className="template-overlay"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(107, 84, 68, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(107, 84, 68, 0)";
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className="opacity-0 group-hover:opacity-100"
                style={{
                  transition: "opacity 0.3s ease",
                }}
              >
                <div
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: "white",
                    borderRadius: "50px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                    fontWeight: 500,
                    color: "var(--accent-terracotta)",
                  }}
                >
                  查看詳情
                </div>
              </motion.div>
            </div>
          </div>

          {/* 範本資訊 */}
          <div style={{ padding: "var(--spacing-md)" }}>
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                color: "var(--deep-brown)",
                marginBottom: "var(--spacing-xs)",
                fontFamily: "var(--font-serif)",
                transition: "color 0.3s ease",
              }}
              className="template-title"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--accent-terracotta)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--deep-brown)";
              }}
            >
              {template.name}
            </h3>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
                lineHeight: "1.6",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {template.description}
            </p>

            {/* 元件數量標籤 */}
            <div
              style={{
                marginTop: "var(--spacing-sm)",
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-xs)",
                fontSize: "0.8rem",
                color: "var(--text-light)",
              }}
            >
              <span>{template.elements.length} 個元件</span>
              <span>•</span>
              <span>
                {template.canvasSize.width} × {template.canvasSize.height}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
