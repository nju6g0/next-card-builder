"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";

export default function Home() {
  const { isAuthenticated, currentUser } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Card Builder
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            可拖拉元件自訂邀請函網站
          </p>

          {/* 登入狀態 */}
          <div className="mb-8">
            {isAuthenticated && currentUser ? (
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-success/10 border border-success/20 rounded-lg">
                <span className="text-success text-lg">✓</span>
                <span className="text-success font-medium">
                  已登入: {currentUser}
                </span>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-block px-8 py-4 bg-primary text-white rounded-lg font-medium text-lg hover:bg-primary-dark transition shadow-lg hover:shadow-xl"
              >
                開始使用
              </Link>
            )}
          </div>
        </div>

        {/* 功能進度卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-success">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Task 1</h3>
              <span className="text-success text-xl">✓</span>
            </div>
            <p className="text-sm text-gray-600">專案初始化與基礎設定</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-success">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Task 2</h3>
              <span className="text-success text-xl">✓</span>
            </div>
            <p className="text-sm text-gray-600">
              認證系統與 LocalStorage 資料層
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-success">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Task 3</h3>
              <span className="text-success text-xl">✓</span>
            </div>
            <p className="text-sm text-gray-600">基礎路由頁面與導航結構</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-success">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Task 4</h3>
              <span className="text-success text-xl">✓</span>
            </div>
            <p className="text-sm text-gray-600">資料型別定義與 Mock 資料</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-success">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Task 5</h3>
              <span className="text-success text-xl">✓</span>
            </div>
            <p className="text-sm text-gray-600">範本列表頁與範本預覽頁</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-success">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Task 6</h3>
              <span className="text-success text-xl">✓</span>
            </div>
            <p className="text-sm text-gray-600">
              Zustand Stores - Editor 與 Invitation
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-success">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Task 7</h3>
              <span className="text-success text-xl">✓</span>
            </div>
            <p className="text-sm text-gray-600">拖拉編輯器 - 畫布與元件庫</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-primary">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Task 8</h3>
              <span className="text-primary text-xl">⚡</span>
            </div>
            <p className="text-sm text-gray-600">
              元件渲染 - 文字、圖片、RSVP 表單
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-400">Task 9-20</h3>
              <span className="text-gray-400 text-xl">⏳</span>
            </div>
            <p className="text-sm text-gray-400">待完成功能...</p>
          </div>
        </div>

        {/* 快速開始區塊 */}
        <div className="mb-12 bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 md:p-12 text-white">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              開始建立您的邀請函
            </h2>
            <p className="text-lg md:text-xl opacity-90">
              選擇精美範本或從空白畫布開始
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <Link
              href="/templates"
              className="bg-white text-primary px-6 py-4 rounded-lg font-semibold text-center hover:shadow-xl transition-all transform hover:scale-105"
            >
              📋 瀏覽範本
            </Link>
            <Link
              href={isAuthenticated ? "/invitations/create" : "/login"}
              className="bg-white/20 backdrop-blur text-white border-2 border-white px-6 py-4 rounded-lg font-semibold text-center hover:bg-white/30 transition-all"
            >
              ✨ 空白畫布
            </Link>
          </div>
        </div>

        {/* 路由測試區域 */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            🧭 路由導航測試
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 公開路由 */}
            <div>
              <h3 className="font-semibold text-blue-800 mb-3">公開路由</h3>
              <div className="space-y-2">
                <Link
                  href="/"
                  className="block px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm"
                >
                  / - 首頁
                </Link>
                <Link
                  href="/login"
                  className="block px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm"
                >
                  /login - 登入頁
                </Link>
                <Link
                  href="/templates"
                  className="block px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm"
                >
                  /templates - 範本列表
                </Link>
                <Link
                  href="/templates/demo-template-1"
                  className="block px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm"
                >
                  /templates/[id] - 範本單頁
                </Link>
                <Link
                  href="/invitations/demo-invitation-1"
                  className="block px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm"
                >
                  /invitations/[id] - 邀請函預覽（公開）
                </Link>
              </div>
            </div>

            {/* 需登入路由 */}
            <div>
              <h3 className="font-semibold text-blue-800 mb-3">需登入路由</h3>
              <div className="space-y-2">
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm"
                >
                  /dashboard - 用戶頁
                </Link>
                <Link
                  href="/invitations/create"
                  className="block px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm"
                >
                  /invitations/create - 建立邀請函
                </Link>
                <Link
                  href="/invitations/edit/demo-invitation-1"
                  className="block px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm"
                >
                  /invitations/edit/[id] - 編輯邀請函
                </Link>
              </div>
              {!isAuthenticated && (
                <p className="text-xs text-blue-600 mt-3">
                  ⚠️ 這些路由需要先登入才能訪問
                </p>
              )}
            </div>

            {/* 測試頁面 */}
            <div>
              <h3 className="font-semibold text-blue-800 mb-3">測試頁面</h3>
              <div className="space-y-2">
                <Link
                  href="/test-api"
                  className="block px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm"
                >
                  /test-api - API 測試頁
                </Link>
                <Link
                  href="/test-stores"
                  className="block px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm"
                >
                  /test-stores - Stores 測試頁
                </Link>
                <Link
                  href="/test-editor"
                  className="block px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm font-medium border-2 border-primary"
                >
                  /test-editor - 編輯器測試頁 🆕
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 技術棧 */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-4">技術棧</p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
              Next.js 16.3.7
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
              TypeScript 5
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
              Tailwind CSS v4
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
              Zustand 5
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
              Framer Motion 13
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
              @dnd-kit 6
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
