"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

/**
 * 在客戶端啟動時從 localStorage 恢復認證狀態
 * 這個組件應該放在 app layout 中，確保在所有頁面渲染前執行
 */
export function AuthInitializer() {
  useEffect(() => {
    // 在客戶端啟動時，直接從 localStorage 讀取並設定狀態
    try {
      const stored = localStorage.getItem("auth-storage");
      if (stored) {
        const { state } = JSON.parse(stored);
        if (state?.currentUser && state?.isAuthenticated) {
          // 直接設定到 store
          useAuthStore.setState({
            currentUser: state.currentUser,
            isAuthenticated: state.isAuthenticated,
            isInitialized: true,
          });
          return;
        }
      }
      // 沒有存儲的認證資料，也標記為已初始化
      useAuthStore.setState({ isInitialized: true });
    } catch (error) {
      console.error("Failed to restore auth state:", error);
      // 即使出錯也標記為已初始化，避免卡住
      useAuthStore.setState({ isInitialized: true });
    }
  }, []);

  return null; // 不渲染任何東西
}
