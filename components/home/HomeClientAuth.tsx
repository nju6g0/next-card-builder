"use client";

import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";

/**
 * 隱藏的客戶端元件，用於初始化認證狀態
 * 不影響 SSG，但確保客戶端認證邏輯正常運作
 */
export default function HomeClientAuth() {
  const { isAuthenticated, currentUser } = useAuthStore();

  useEffect(() => {
    // 這裡可以做認證相關的初始化，但不影響 UI
    // 例如：追蹤使用者行為、載入個人化設定等
  }, [isAuthenticated, currentUser]);

  // 不渲染任何內容
  return null;
}
