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
    <div
      style={{
        minHeight: "100vh",
        background: "var(--warm-cream)",
        padding: "var(--spacing-xl) var(--spacing-md)",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="section-header"
          style={{ marginBottom: "var(--spacing-xl)" }}
        >
          <h1
            className="section-title"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            邀請函範本
          </h1>
          <p className="section-subtitle">
            選擇一個精美的範本快速開始，或從空白畫布自由創作
          </p>
        </motion.div>

        {/* Loading 狀態 */}
        {loading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "5rem 0",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  animation: "spin 1s linear infinite",
                  borderRadius: "50%",
                  height: "3rem",
                  width: "3rem",
                  border: "3px solid var(--soft-beige)",
                  borderTopColor: "var(--accent-terracotta)",
                  margin: "0 auto 1rem",
                }}
              ></div>
              <p style={{ color: "var(--text-secondary)" }}>載入範本中...</p>
            </div>
          </div>
        )}

        {/* Error 狀態 */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: "rgba(201, 125, 96, 0.1)",
              border: "2px solid rgba(201, 125, 96, 0.3)",
              borderRadius: "16px",
              padding: "var(--spacing-lg)",
              textAlign: "center",
            }}
          >
            <div
              style={{ fontSize: "3rem", marginBottom: "var(--spacing-sm)" }}
            >
              ❌
            </div>
            <p
              style={{
                color: "var(--accent-terracotta)",
                fontWeight: 500,
                marginBottom: "var(--spacing-xs)",
              }}
            >
              {error}
            </p>
            <button
              onClick={loadTemplates}
              className="btn-primary"
              style={{ marginTop: "var(--spacing-md)" }}
            >
              重試
            </button>
          </motion.div>
        )}

        {/* 範本網格 */}
        {!loading && !error && templates.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "var(--spacing-lg)",
            }}
          >
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
            style={{ textAlign: "center", padding: "5rem 0" }}
          >
            <div
              style={{ fontSize: "4rem", marginBottom: "var(--spacing-md)" }}
            >
              📋
            </div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "var(--deep-brown)",
                marginBottom: "var(--spacing-xs)",
                fontFamily: "var(--font-serif)",
              }}
            >
              尚無範本
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>目前沒有可用的範本</p>
          </motion.div>
        )}

        {/* CTA Section */}
        {!loading && !error && templates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              marginTop: "var(--spacing-xl)",
              textAlign: "center",
              background: "var(--deep-brown)",
              borderRadius: "16px",
              padding: "var(--spacing-xl)",
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                marginBottom: "var(--spacing-md)",
                fontFamily: "var(--font-serif)",
              }}
            >
              找不到合適的範本？
            </h2>
            <p
              style={{
                fontSize: "1.125rem",
                marginBottom: "var(--spacing-lg)",
                opacity: 0.9,
              }}
            >
              從空白畫布開始，自由發揮您的創意
            </p>
            <a
              href="/invitations/create"
              className="btn-primary"
              style={{
                display: "inline-block",
                textDecoration: "none",
                fontSize: "1.125rem",
                padding: "1.25rem 3rem",
              }}
            >
              建立空白邀請函
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
}
