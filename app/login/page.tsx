"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
    <div className="min-h-screen flex items-center justify-center p-md bg-warm-cream">
      <div className="max-w-[500px] w-full">
        {/* Logo / 標題 */}
        <div className="text-center mb-lg">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo-icon.svg"
              alt="Cardian"
              width={80}
              height={80}
              className="w-20 h-20"
            />
          </div>
          <h1 className="text-[2.5rem] font-bold text-deep-brown font-serif mb-xs">
            Cardian 卡典
          </h1>
          <p className="text-text-secondary text-base">做出讓人心動的卡片</p>
        </div>

        {/* 登入表單 */}
        <div className="bg-white rounded-2xl shadow-lg p-lg border-2 border-soft-beige">
          <form onSubmit={handleSubmit} className="flex flex-col gap-md">
            <div>
              <label
                htmlFor="email"
                className="block text-[0.9rem] font-medium text-text-primary mb-xs"
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
                className="w-full px-4 py-3.5 border-2 border-soft-beige rounded-lg text-base text-text-primary bg-warm-cream outline-none transition-all duration-300 font-sans focus:border-accent-terracotta focus:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="your@email.com"
                disabled={isLoading}
              />
              {error && (
                <p className="mt-xs text-sm text-accent-terracotta">{error}</p>
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
          <div className="mt-md text-center">
            <p className="text-xs text-text-light mb-1">
              這是一個 demo 專案，無需密碼即可登入
            </p>
            <p className="text-xs text-text-light">
              輸入任何有效的 email 地址即可開始使用
            </p>
          </div>
        </div>

        {/* 功能介紹 */}
        <div className="bg-white rounded-2xl shadow-lg p-md mt-md border border-soft-beige">
          <h3 className="text-[0.95rem] font-semibold text-deep-brown mb-sm font-serif">
            平台功能
          </h3>
          <ul className="flex flex-col gap-xs list-none p-0">
            <li className="flex items-start gap-xs text-[0.9rem] text-text-secondary">
              <span className="text-accent-sage mt-0.5">✓</span>
              <span>拖拉元件自由設計邀請函</span>
            </li>
            <li className="flex items-start gap-xs text-[0.9rem] text-text-secondary">
              <span className="text-accent-sage mt-0.5">✓</span>
              <span>選擇精美範本快速開始</span>
            </li>
            <li className="flex items-start gap-xs text-[0.9rem] text-text-secondary">
              <span className="text-accent-sage mt-0.5">✓</span>
              <span>內建 RSVP 表單收集回覆</span>
            </li>
            <li className="flex items-start gap-xs text-[0.9rem] text-text-secondary">
              <span className="text-accent-sage mt-0.5">✓</span>
              <span>管理所有邀請函與回覆統計</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
