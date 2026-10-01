"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // 執行登入
    const result = login(email);

    if (result.success) {
      // 登入成功，導向用戶頁
      router.push("/dashboard");
    } else {
      // 顯示錯誤訊息
      setError(result.error || "登入失敗");
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--spacing-md)",
        background: "var(--warm-cream)",
      }}
    >
      <div style={{ maxWidth: "500px", width: "100%" }}>
        {/* Logo / 標題 */}
        <div style={{ textAlign: "center", marginBottom: "var(--spacing-lg)" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              color: "var(--deep-brown)",
              fontFamily: "var(--font-serif)",
              marginBottom: "var(--spacing-xs)",
            }}
          >
            邀請函工坊
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
            登入以開始建立您的邀請函
          </p>
        </div>

        {/* 登入表單 */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(107, 84, 68, 0.1)",
            padding: "var(--spacing-lg)",
            border: "2px solid var(--soft-beige)",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-md)",
            }}
          >
            <div>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: "var(--text-primary)",
                  marginBottom: "var(--spacing-xs)",
                }}
              >
                Email 地址
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem",
                  border: "2px solid var(--soft-beige)",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  color: "var(--text-primary)",
                  background: "var(--warm-cream)",
                  outline: "none",
                  transition: "all 0.3s ease",
                  fontFamily: "var(--font-sans)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--accent-terracotta)";
                  e.currentTarget.style.background = "white";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--soft-beige)";
                  e.currentTarget.style.background = "var(--warm-cream)";
                }}
                placeholder="your@email.com"
                disabled={isLoading}
              />
              {error && (
                <p
                  style={{
                    marginTop: "var(--spacing-xs)",
                    fontSize: "0.875rem",
                    color: "var(--accent-terracotta)",
                  }}
                >
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "1rem",
                fontSize: "1rem",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {isLoading ? "登入中..." : "登入"}
            </button>
          </form>

          {/* 說明文字 */}
          <div
            style={{
              marginTop: "var(--spacing-md)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "0.8rem",
                color: "var(--text-light)",
                marginBottom: "0.25rem",
              }}
            >
              這是一個 demo 專案，無需密碼即可登入
            </p>
            <p
              style={{
                fontSize: "0.8rem",
                color: "var(--text-light)",
              }}
            >
              輸入任何有效的 email 地址即可開始使用
            </p>
          </div>
        </div>

        {/* 功能介紹 */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(107, 84, 68, 0.08)",
            padding: "var(--spacing-md)",
            marginTop: "var(--spacing-md)",
            border: "1px solid var(--soft-beige)",
          }}
        >
          <h3
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "var(--deep-brown)",
              marginBottom: "var(--spacing-sm)",
              fontFamily: "var(--font-serif)",
            }}
          >
            平台功能
          </h3>
          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-xs)",
              listStyle: "none",
              padding: 0,
            }}
          >
            <li
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--spacing-xs)",
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
              }}
            >
              <span
                style={{ color: "var(--accent-sage)", marginTop: "0.125rem" }}
              >
                ✓
              </span>
              <span>拖拉元件自由設計邀請函</span>
            </li>
            <li
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--spacing-xs)",
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
              }}
            >
              <span
                style={{ color: "var(--accent-sage)", marginTop: "0.125rem" }}
              >
                ✓
              </span>
              <span>選擇精美範本快速開始</span>
            </li>
            <li
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--spacing-xs)",
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
              }}
            >
              <span
                style={{ color: "var(--accent-sage)", marginTop: "0.125rem" }}
              >
                ✓
              </span>
              <span>內建 RSVP 表單收集回覆</span>
            </li>
            <li
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--spacing-xs)",
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
              }}
            >
              <span
                style={{ color: "var(--accent-sage)", marginTop: "0.125rem" }}
              >
                ✓
              </span>
              <span>管理所有邀請函與回覆統計</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
