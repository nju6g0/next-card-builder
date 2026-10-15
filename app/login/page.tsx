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
    <div className="min-h-screen flex items-center justify-center p-[var(--spacing-md)] bg-[var(--color-warm-cream)]">
      <div className="max-w-[500px] w-full">
        {/* Logo / 標題 */}
        <div className="text-center mb-[var(--spacing-lg)]">
          <h1 className="text-[2.5rem] font-bold text-[var(--color-deep-brown)] font-[var(--font-family-serif)] mb-[var(--spacing-xs)]">
            邀請函工坊
          </h1>
          <p className="text-[var(--color-text-secondary)] text-base">
            登入以開始建立您的邀請函
          </p>
        </div>

        {/* 登入表單 */}
        <div className="bg-white rounded-2xl shadow-lg p-[var(--spacing-lg)] border-2 border-[var(--color-soft-beige)]">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-[var(--spacing-md)]"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-[0.9rem] font-medium text-[var(--color-text-primary)] mb-[var(--spacing-xs)]"
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
                className="w-full px-4 py-3.5 border-2 border-[var(--color-soft-beige)] rounded-lg text-base text-[var(--color-text-primary)] bg-[var(--color-warm-cream)] outline-none transition-all duration-300 font-[var(--font-family-sans)] focus:border-[var(--color-accent-terracotta)] focus:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="your@email.com"
                disabled={isLoading}
              />
              {error && (
                <p className="mt-[var(--spacing-xs)] text-sm text-[var(--color-accent-terracotta)]">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full text-base disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "登入中..." : "登入"}
            </button>
          </form>

          {/* 說明文字 */}
          <div className="mt-[var(--spacing-md)] text-center">
            <p className="text-xs text-[var(--color-text-light)] mb-1">
              這是一個 demo 專案，無需密碼即可登入
            </p>
            <p className="text-xs text-[var(--color-text-light)]">
              輸入任何有效的 email 地址即可開始使用
            </p>
          </div>
        </div>

        {/* 功能介紹 */}
        <div className="bg-white rounded-2xl shadow-lg p-[var(--spacing-md)] mt-[var(--spacing-md)] border border-[var(--color-soft-beige)]">
          <h3 className="text-[0.95rem] font-semibold text-[var(--color-deep-brown)] mb-[var(--spacing-sm)] font-[var(--font-family-serif)]">
            平台功能
          </h3>
          <ul className="flex flex-col gap-[var(--spacing-xs)] list-none p-0">
            <li className="flex items-start gap-[var(--spacing-xs)] text-[0.9rem] text-[var(--color-text-secondary)]">
              <span className="text-[var(--color-accent-sage)] mt-0.5">✓</span>
              <span>拖拉元件自由設計邀請函</span>
            </li>
            <li className="flex items-start gap-[var(--spacing-xs)] text-[0.9rem] text-[var(--color-text-secondary)]">
              <span className="text-[var(--color-accent-sage)] mt-0.5">✓</span>
              <span>選擇精美範本快速開始</span>
            </li>
            <li className="flex items-start gap-[var(--spacing-xs)] text-[0.9rem] text-[var(--color-text-secondary)]">
              <span className="text-[var(--color-accent-sage)] mt-0.5">✓</span>
              <span>內建 RSVP 表單收集回覆</span>
            </li>
            <li className="flex items-start gap-[var(--spacing-xs)] text-[0.9rem] text-[var(--color-text-secondary)]">
              <span className="text-[var(--color-accent-sage)] mt-0.5">✓</span>
              <span>管理所有邀請函與回覆統計</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
