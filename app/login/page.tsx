'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // 執行登入
    const result = login(email);

    if (result.success) {
      // 登入成功，導向用戶頁
      router.push('/dashboard');
    } else {
      // 顯示錯誤訊息
      setError(result.error || '登入失敗');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        {/* Logo / 標題 */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary">Card Builder</h1>
          <p className="mt-2 text-gray-600">登入以開始建立您的邀請函</p>
        </div>

        {/* 登入表單 */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                placeholder="your@email.com"
                disabled={isLoading}
              />
              {error && (
                <p className="mt-2 text-sm text-error">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '登入中...' : '登入'}
            </button>
          </form>

          {/* 說明文字 */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              這是一個 demo 專案，無需密碼即可登入
            </p>
            <p className="text-xs text-gray-500 mt-1">
              輸入任何有效的 email 地址即可開始使用
            </p>
          </div>
        </div>

        {/* 功能介紹 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            平台功能
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-success mt-0.5">✓</span>
              <span>拖拉元件自由設計邀請函</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-0.5">✓</span>
              <span>選擇精美範本快速開始</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-0.5">✓</span>
              <span>內建 RSVP 表單收集回覆</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-0.5">✓</span>
              <span>管理所有邀請函與回覆統計</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
