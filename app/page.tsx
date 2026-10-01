"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";

export default function Home() {
  const { isAuthenticated, currentUser } = useAuthStore();

  return (
    // <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
    //   <div className="max-w-6xl mx-auto">
    //     {/* Hero Section */}
    //     <div className="text-center mb-16">
    //       <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
    //         Card Builder
    //       </h1>
    //       <p className="text-xl md:text-2xl text-gray-600 mb-8">
    //         可拖拉元件自訂邀請函網站
    //       </p>

    //       {/* 登入狀態 */}
    //       <div className="mb-8">
    //         {isAuthenticated && currentUser ? (
    //           <div className="inline-flex items-center gap-3 px-6 py-3 bg-success/10 border border-success/20 rounded-lg">
    //             <span className="text-success text-lg">✓</span>
    //             <span className="text-success font-medium">
    //               已登入: {currentUser}
    //             </span>
    //           </div>
    //         ) : (
    //           <Link
    //             href="/login"
    //             className="inline-block px-8 py-4 bg-primary text-white rounded-lg font-medium text-lg hover:bg-primary-dark transition shadow-lg hover:shadow-xl"
    //           >
    //             開始使用
    //           </Link>
    //         )}
    //       </div>
    //     </div>

    //     {/* 功能進度卡片 */}
    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
    //       <div className="bg-white rounded-lg shadow-md p-6 border-2 border-success">
    //         <div className="flex items-center justify-between mb-3">
    //           <h3 className="text-lg font-semibold text-gray-900">Task 1</h3>
    //           <span className="text-success text-xl">✓</span>
    //         </div>
    //         <p className="text-sm text-gray-600">專案初始化與基礎設定</p>
    //       </div>

    //       <div className="bg-white rounded-lg shadow-md p-6 border-2 border-success">
    //         <div className="flex items-center justify-between mb-3">
    //           <h3 className="text-lg font-semibold text-gray-900">Task 2</h3>
    //           <span className="text-success text-xl">✓</span>
    //         </div>
    //         <p className="text-sm text-gray-600">
    //           認證系統與 LocalStorage 資料層
    //         </p>
    //       </div>

    //       <div className="bg-white rounded-lg shadow-md p-6 border-2 border-success">
    //         <div className="flex items-center justify-between mb-3">
    //           <h3 className="text-lg font-semibold text-gray-900">Task 3</h3>
    //           <span className="text-success text-xl">✓</span>
    //         </div>
    //         <p className="text-sm text-gray-600">基礎路由頁面與導航結構</p>
    //       </div>

    //       <div className="bg-white rounded-lg shadow-md p-6 border-2 border-success">
    //         <div className="flex items-center justify-between mb-3">
    //           <h3 className="text-lg font-semibold text-gray-900">Task 4</h3>
    //           <span className="text-success text-xl">✓</span>
    //         </div>
    //         <p className="text-sm text-gray-600">資料型別定義與 Mock 資料</p>
    //       </div>

    //       <div className="bg-white rounded-lg shadow-md p-6 border-2 border-success">
    //         <div className="flex items-center justify-between mb-3">
    //           <h3 className="text-lg font-semibold text-gray-900">Task 5</h3>
    //           <span className="text-success text-xl">✓</span>
    //         </div>
    //         <p className="text-sm text-gray-600">範本列表頁與範本預覽頁</p>
    //       </div>

    //       <div className="bg-white rounded-lg shadow-md p-6 border-2 border-success">
    //         <div className="flex items-center justify-between mb-3">
    //           <h3 className="text-lg font-semibold text-gray-900">Task 6</h3>
    //           <span className="text-success text-xl">✓</span>
    //         </div>
    //         <p className="text-sm text-gray-600">
    //           Zustand Stores - Editor 與 Invitation
    //         </p>
    //       </div>

    //       <div className="bg-white rounded-lg shadow-md p-6 border-2 border-success">
    //         <div className="flex items-center justify-between mb-3">
    //           <h3 className="text-lg font-semibold text-gray-900">Task 7</h3>
    //           <span className="text-success text-xl">✓</span>
    //         </div>
    //         <p className="text-sm text-gray-600">拖拉編輯器 - 畫布與元件庫</p>
    //       </div>

    //       <div className="bg-white rounded-lg shadow-md p-6 border-2 border-primary">
    //         <div className="flex items-center justify-between mb-3">
    //           <h3 className="text-lg font-semibold text-gray-900">Task 8</h3>
    //           <span className="text-primary text-xl">⚡</span>
    //         </div>
    //         <p className="text-sm text-gray-600">
    //           元件渲染 - 文字、圖片、RSVP 表單
    //         </p>
    //       </div>

    //       <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200">
    //         <div className="flex items-center justify-between mb-3">
    //           <h3 className="text-lg font-semibold text-gray-400">Task 9-20</h3>
    //           <span className="text-gray-400 text-xl">⏳</span>
    //         </div>
    //         <p className="text-sm text-gray-400">待完成功能...</p>
    //       </div>
    //     </div>

    //     {/* 快速開始區塊 */}
    //     <div className="mb-12 bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 md:p-12 text-white">
    //       <div className="text-center mb-8">
    //         <h2 className="text-3xl md:text-4xl font-bold mb-4">
    //           開始建立您的邀請函
    //         </h2>
    //         <p className="text-lg md:text-xl opacity-90">
    //           選擇精美範本或從空白畫布開始
    //         </p>
    //       </div>

    //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
    //         <Link
    //           href="/templates"
    //           className="bg-white text-primary px-6 py-4 rounded-lg font-semibold text-center hover:shadow-xl transition-all transform hover:scale-105"
    //         >
    //           📋 瀏覽範本
    //         </Link>
    //         <Link
    //           href={isAuthenticated ? "/invitations/create" : "/login"}
    //           className="bg-white/20 backdrop-blur text-white border-2 border-white px-6 py-4 rounded-lg font-semibold text-center hover:bg-white/30 transition-all"
    //         >
    //           ✨ 空白畫布
    //         </Link>
    //       </div>
    //     </div>

    //     {/* 路由測試區域 */}
    //     <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8">
    //       <h2 className="text-2xl font-bold text-blue-900 mb-6">
    //         🧭 路由導航測試
    //       </h2>

    //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //         {/* 公開路由 */}
    //         <div>
    //           <h3 className="font-semibold text-blue-800 mb-3">公開路由</h3>
    //           <div className="space-y-2">
    //             <Link
    //               href="/"
    //               className="block px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm"
    //             >
    //               / - 首頁
    //             </Link>
    //             <Link
    //               href="/login"
    //               className="block px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm"
    //             >
    //               /login - 登入頁
    //             </Link>
    //             <Link
    //               href="/templates"
    //               className="block px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm"
    //             >
    //               /templates - 範本列表
    //             </Link>
    //             <Link
    //               href="/templates/demo-template-1"
    //               className="block px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm"
    //             >
    //               /templates/[id] - 範本單頁
    //             </Link>
    //             <Link
    //               href="/invitations/demo-invitation-1"
    //               className="block px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm"
    //             >
    //               /invitations/[id] - 邀請函預覽（公開）
    //             </Link>
    //           </div>
    //         </div>

    //         {/* 需登入路由 */}
    //         <div>
    //           <h3 className="font-semibold text-blue-800 mb-3">需登入路由</h3>
    //           <div className="space-y-2">
    //             <Link
    //               href="/dashboard"
    //               className="block px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm"
    //             >
    //               /dashboard - 用戶頁
    //             </Link>
    //             <Link
    //               href="/invitations/create"
    //               className="block px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm"
    //             >
    //               /invitations/create - 建立邀請函
    //             </Link>
    //             <Link
    //               href="/invitations/edit/demo-invitation-1"
    //               className="block px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm"
    //             >
    //               /invitations/edit/[id] - 編輯邀請函
    //             </Link>
    //           </div>
    //           {!isAuthenticated && (
    //             <p className="text-xs text-blue-600 mt-3">
    //               ⚠️ 這些路由需要先登入才能訪問
    //             </p>
    //           )}
    //         </div>

    //         {/* 測試頁面 */}
    //         <div>
    //           <h3 className="font-semibold text-blue-800 mb-3">測試頁面</h3>
    //           <div className="space-y-2">
    //             <Link
    //               href="/test-api"
    //               className="block px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm"
    //             >
    //               /test-api - API 測試頁
    //             </Link>
    //             <Link
    //               href="/test-stores"
    //               className="block px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm"
    //             >
    //               /test-stores - Stores 測試頁
    //             </Link>
    //             <Link
    //               href="/test-editor"
    //               className="block px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm font-medium border-2 border-primary"
    //             >
    //               /test-editor - 編輯器測試頁 🆕
    //             </Link>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">手作溫度 × 數位創意</div>
          <h1 className="hero-title">
            <span className="title-line">用心設計</span>
            <span className="title-line">每一份邀請</span>
          </h1>
          <p className="hero-subtitle">
            為生命中的美好時刻，創造獨一無二的數位邀請函
          </p>
          <div className="hero-cta">
            <Link href="/builder">
              <button className="btn-primary">開始設計</button>
            </Link>
            <button className="btn-secondary">瀏覽範本</button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="card-mockup card-1">
            <div className="mockup-header">婚禮邀請</div>
            <div className="mockup-content"></div>
          </div>
          <div className="card-mockup card-2">
            <div className="mockup-header">生日派對</div>
            <div className="mockup-content"></div>
          </div>
          <div className="card-mockup card-3">
            <div className="mockup-header">寶寶滿月</div>
            <div className="mockup-content"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-header">
          <h2 className="section-title">為什麼選擇我們</h2>
          <p className="section-subtitle">簡單三步驟，輕鬆完成專屬邀請函</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">✨</div>
            <h3 className="feature-title">精選範本</h3>
            <p className="feature-desc">
              超過百款手繪插畫風格範本，每一款都充滿溫度與故事
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3 className="feature-title">自由編輯</h3>
            <p className="feature-desc">
              直覺式拖拉編輯器，文字、圖片、配色隨心所欲調整
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3 className="feature-title">即時分享</h3>
            <p className="feature-desc">
              一鍵生成專屬連結，透過社群媒體輕鬆傳遞邀請
            </p>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="showcase">
        <h2 className="section-title">精選作品</h2>
        <div className="showcase-grid">
          <div className="showcase-item item-1">
            <div className="showcase-overlay">
              <span className="showcase-category">婚禮</span>
            </div>
          </div>
          <div className="showcase-item item-2">
            <div className="showcase-overlay">
              <span className="showcase-category">派對</span>
            </div>
          </div>
          <div className="showcase-item item-3">
            <div className="showcase-overlay">
              <span className="showcase-category">慶生</span>
            </div>
          </div>
          <div className="showcase-item item-4">
            <div className="showcase-overlay">
              <span className="showcase-category">滿月</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">準備好開始了嗎？</h2>
          <p className="cta-subtitle">讓我們一起為重要的日子，留下美好的記憶</p>
          <Link href="/builder">
            <button className="btn-primary large">免費開始設計</button>
          </Link>
        </div>
        <div className="cta-decoration">
          <div className="deco-circle circle-1"></div>
          <div className="deco-circle circle-2"></div>
          <div className="deco-circle circle-3"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>邀請函工坊</h3>
            <p>用心設計每一份邀請</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>產品</h4>
              <a href="#">範本庫</a>
              <a href="#">定價方案</a>
              <a href="#">使用教學</a>
            </div>
            <div className="footer-column">
              <h4>關於</h4>
              <a href="#">我們的故事</a>
              <a href="#">聯絡我們</a>
              <a href="#">合作夥伴</a>
            </div>
            <div className="footer-column">
              <h4>支援</h4>
              <a href="#">常見問題</a>
              <a href="#">隱私政策</a>
              <a href="#">服務條款</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 邀請函工坊. 用心設計每一刻</p>
        </div>
      </footer>
    </div>
  );
}
