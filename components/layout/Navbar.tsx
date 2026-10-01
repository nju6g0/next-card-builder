'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, currentUser, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    router.push('/');
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo / 品牌 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">💌</span>
              <span className="text-xl font-bold text-primary">Card Builder</span>
            </Link>
          </div>

          {/* 桌面導航連結 */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/')
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              首頁
            </Link>
            <Link
              href="/templates"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/templates') || pathname?.startsWith('/templates/')
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              範本
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href="/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/dashboard')
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  我的邀請函
                </Link>
                <Link
                  href="/invitations/create"
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition"
                >
                  建立邀請函
                </Link>
              </>
            )}
          </div>

          {/* 使用者選單（桌面） */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated && currentUser ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">{currentUser}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  登出
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition"
              >
                登入
              </Link>
            )}
          </div>

          {/* 手機版漢堡選單按鈕 */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              aria-label="開啟選單"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 手機版選單 */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium transition ${
                isActive('/')
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              首頁
            </Link>
            <Link
              href="/templates"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium transition ${
                isActive('/templates') || pathname?.startsWith('/templates/')
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              範本
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition ${
                    isActive('/dashboard')
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  我的邀請函
                </Link>
                <Link
                  href="/invitations/create"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 bg-primary text-white rounded-lg text-base font-medium hover:bg-primary-dark transition"
                >
                  建立邀請函
                </Link>
              </>
            )}
          </div>

          {/* 使用者資訊（手機版） */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated && currentUser ? (
              <div className="px-4 space-y-3">
                <div className="text-sm text-gray-600">登入為：</div>
                <div className="text-sm font-medium text-gray-900">{currentUser}</div>
                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2 text-left text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  登出
                </button>
              </div>
            ) : (
              <div className="px-4">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full px-4 py-2 bg-primary text-white text-center rounded-lg text-base font-medium hover:bg-primary-dark transition"
                >
                  登入
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
