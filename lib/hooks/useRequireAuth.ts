"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

/**
 * 路由守衛 Hook
 * 確保使用者已登入，未登入時自動導向登入頁
 * @returns 當前使用者 email
 */
export function useRequireAuth() {
  const router = useRouter();
  const { currentUser, isAuthenticated, isInitialized } = useAuthStore();

  useEffect(() => {
    // 只有在初始化完成後才檢查認證狀態
    if (isInitialized && (!isAuthenticated || !currentUser)) {
      router.push("/login");
    }
  }, [isInitialized, isAuthenticated, currentUser, router]);

  // 在初始化完成前返回 null
  return isInitialized ? currentUser : null;
}
