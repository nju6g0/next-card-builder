"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

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

  return (
    <nav
      style={{
        background: "var(--warm-cream)",
        borderBottom: "1px solid var(--soft-beige)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 var(--spacing-md)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "72px",
          }}
        >
          {/* Logo / 品牌 */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-xs)",
                textDecoration: "none",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>✨</span>
              <span
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "var(--deep-brown)",
                  fontFamily: "var(--font-serif)",
                }}
              >
                邀請函工坊
              </span>
            </Link>
          </div>

          {/* 桌面導航連結 */}
          <div
            className="hidden md:flex"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-xs)",
            }}
          >
            <Link
              href="/"
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "50px",
                fontSize: "0.95rem",
                fontWeight: 500,
                color: isActive("/") ? "white" : "var(--text-primary)",
                background: isActive("/")
                  ? "var(--accent-terracotta)"
                  : "transparent",
                textDecoration: "none",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (!isActive("/")) {
                  e.currentTarget.style.background = "var(--soft-beige)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive("/")) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              首頁
            </Link>
            <Link
              href="/templates"
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "50px",
                fontSize: "0.95rem",
                fontWeight: 500,
                color:
                  isActive("/templates") || pathname?.startsWith("/templates/")
                    ? "white"
                    : "var(--text-primary)",
                background:
                  isActive("/templates") || pathname?.startsWith("/templates/")
                    ? "var(--accent-terracotta)"
                    : "transparent",
                textDecoration: "none",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (
                  !isActive("/templates") &&
                  !pathname?.startsWith("/templates/")
                ) {
                  e.currentTarget.style.background = "var(--soft-beige)";
                }
              }}
              onMouseLeave={(e) => {
                if (
                  !isActive("/templates") &&
                  !pathname?.startsWith("/templates/")
                ) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              範本
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href="/dashboard"
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "50px",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: isActive("/dashboard")
                      ? "white"
                      : "var(--text-primary)",
                    background: isActive("/dashboard")
                      ? "var(--accent-terracotta)"
                      : "transparent",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive("/dashboard")) {
                      e.currentTarget.style.background = "var(--soft-beige)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive("/dashboard")) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  我的邀請函
                </Link>
                <Link
                  href="/invitations/create"
                  className="btn-primary"
                  style={{
                    padding: "0.625rem 1.5rem",
                    marginLeft: "var(--spacing-xs)",
                  }}
                >
                  建立邀請函
                </Link>
              </>
            )}
          </div>

          {/* 使用者選單（桌面） */}
          <div
            className="hidden md:flex"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-sm)",
            }}
          >
            {isAuthenticated && currentUser ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-sm)",
                }}
              >
                <span
                  style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}
                >
                  {currentUser}
                </span>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: "0.5rem 1rem",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    color: "var(--warm-brown)",
                    background: "transparent",
                    border: "none",
                    borderRadius: "50px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--soft-beige)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
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
          <div
            className="md:hidden"
            style={{ display: "flex", alignItems: "center" }}
          >
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                padding: "0.5rem",
                borderRadius: "8px",
                color: "var(--warm-brown)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--soft-beige)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
              aria-label="開啟選單"
            >
              {isMobileMenuOpen ? (
                <svg
                  style={{ height: "1.5rem", width: "1.5rem" }}
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
                  style={{ height: "1.5rem", width: "1.5rem" }}
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
          className="md:hidden"
          style={{
            borderTop: "1px solid var(--soft-beige)",
            background: "white",
          }}
        >
          <div
            style={{
              padding: "var(--spacing-sm)",
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}
          >
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: 500,
                color: isActive("/") ? "white" : "var(--text-primary)",
                background: isActive("/")
                  ? "var(--accent-terracotta)"
                  : "transparent",
                textDecoration: "none",
                transition: "all 0.3s ease",
              }}
            >
              首頁
            </Link>
            <Link
              href="/templates"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: 500,
                color:
                  isActive("/templates") || pathname?.startsWith("/templates/")
                    ? "white"
                    : "var(--text-primary)",
                background:
                  isActive("/templates") || pathname?.startsWith("/templates/")
                    ? "var(--accent-terracotta)"
                    : "transparent",
                textDecoration: "none",
                transition: "all 0.3s ease",
              }}
            >
              範本
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: 500,
                    color: isActive("/dashboard")
                      ? "white"
                      : "var(--text-primary)",
                    background: isActive("/dashboard")
                      ? "var(--accent-terracotta)"
                      : "transparent",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                >
                  我的邀請函
                </Link>
                <Link
                  href="/invitations/create"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-primary"
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "0.75rem 1rem",
                    textDecoration: "none",
                  }}
                >
                  建立邀請函
                </Link>
              </>
            )}
          </div>

          {/* 使用者資訊（手機版） */}
          <div
            style={{
              padding: "var(--spacing-md) var(--spacing-sm)",
              borderTop: "1px solid var(--soft-beige)",
            }}
          >
            {isAuthenticated && currentUser ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--spacing-sm)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  登入為：
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "var(--deep-brown)",
                  }}
                >
                  {currentUser}
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    textAlign: "left",
                    fontSize: "1rem",
                    fontWeight: 500,
                    color: "var(--warm-brown)",
                    background: "transparent",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--soft-beige)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  登出
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-primary"
                style={{
                  display: "block",
                  width: "100%",
                  padding: "0.75rem 1rem",
                  textAlign: "center",
                  textDecoration: "none",
                }}
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
