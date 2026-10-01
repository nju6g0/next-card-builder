"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

const NAVBAR_ITEMS = [
  {
    label: "首頁",
    link: "/",
    id: "home",
    needAuth: false,
  },
  {
    label: "範本",
    link: "/templates",
    id: "templates",
    needAuth: false,
  },
  {
    label: "我的邀請函",
    link: "/dashboard",
    id: "dashboard",
    needAuth: true,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, currentUser, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const renderNavbarItems = () => {
    return NAVBAR_ITEMS.filter((item) => !item.needAuth || isAuthenticated).map(
      (item) => (
        <Link
          key={item.id}
          href={item.link}
          className={`px-4 py-2 text-[0.95rem] font-medium transition-all duration-300 hover:text-accent-terracotta ${
            isActive(item.link)
              ? "border-b-2 border-accent-terracotta"
              : "no-underline"
          }`}
        >
          {item.label}
        </Link>
      ),
    );
  };

  const renderMobileNavbarItems = () => {
    return NAVBAR_ITEMS.filter((item) => !item.needAuth || isAuthenticated).map(
      (item) => (
        <Link
          key={item.id}
          href={item.link}
          onClick={() => setIsMobileMenuOpen(false)}
          className={`px-4 py-3 text-base font-medium transition-all duration-300 ${
            isActive(item.link)
              ? "border-l-2 border-accent-terracotta"
              : "no-underline"
          }`}
        >
          {item.label}
        </Link>
      ),
    );
  };

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        background: "var(--warm-cream)",
        borderColor: "var(--soft-beige)",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-[72px]">
          {/* Logo / 品牌 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 no-underline">
              <span className="text-2xl">✨</span>
              <span
                className="text-xl font-bold"
                style={{
                  color: "var(--deep-brown)",
                  fontFamily: "var(--font-serif)",
                }}
              >
                邀請函工坊
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-2">
            {renderNavbarItems()}
            {isAuthenticated && (
              <Link
                href="/invitations/create"
                className="btn-primary ml-2"
                style={{
                  padding: "0.625rem 1.5rem",
                }}
              >
                建立邀請函
              </Link>
            )}
          </div>

          {/* 使用者選單（桌面） */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-4">
                <span
                  className="text-[0.9rem]"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {currentUser}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-[0.9rem] font-medium rounded-full border-0 cursor-pointer transition-all duration-300 hover:bg-[var(--soft-beige)]"
                  style={{
                    color: "var(--warm-brown)",
                    background: "transparent",
                  }}
                >
                  登出
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="btn-primary"
                style={{ padding: "0.625rem 1.5rem" }}
              >
                登入
              </Link>
            )}
          </div>

          {/* 手機版漢堡選單按鈕 */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg border-0 cursor-pointer transition-all duration-300 hover:bg-[var(--soft-beige)]"
              style={{
                color: "var(--warm-brown)",
                background: "transparent",
              }}
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
        <div
          className="md:hidden bg-white border-t"
          style={{
            borderColor: "var(--soft-beige)",
          }}
        >
          <div className="p-4 flex flex-col gap-1">
            {renderMobileNavbarItems()}
          </div>

          {/* 使用者資訊（手機版） */}
          <div
            className="p-4 border-t"
            style={{
              borderColor: "var(--soft-beige)",
            }}
          >
            {isAuthenticated && currentUser ? (
              <div className="flex flex-col gap-4">
                <div className="text-sm text-center">Hi, {currentUser}</div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-center text-base font-medium border-0 cursor-pointer transition-all duration-300 text-warm-brown"
                >
                  登出
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-primary block w-full px-4 py-3 text-center no-underline"
              >
                登入
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
