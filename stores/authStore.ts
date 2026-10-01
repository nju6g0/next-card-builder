import { create } from "zustand";
import { persist } from "zustand/middleware";
import { normalizeEmail, validateEmail } from "@/lib/validation";

interface AuthState {
  currentUser: string | null;
  user: string | null; // 別名，指向 currentUser
  isAuthenticated: boolean;
  login: (email: string) => { success: boolean; error?: string };
  logout: () => void;
}

/**
 * 認證狀態管理 Store
 * 使用 Zustand persist middleware 自動同步到 localStorage
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      get user() {
        return get().currentUser;
      }, // 別名 getter
      isAuthenticated: false,

      /**
       * 登入功能
       * @param email - 使用者 email
       * @returns 登入結果 { success, error? }
       */
      login: (email: string) => {
        // 驗證 email 格式
        const error = validateEmail(email);
        if (error) {
          return { success: false, error };
        }

        // 標準化 email（轉小寫）
        const normalizedEmail = normalizeEmail(email);

        // 設定當前使用者
        set({
          currentUser: normalizedEmail,
          isAuthenticated: true,
        });

        return { success: true };
      },

      /**
       * 登出功能
       */
      logout: () => {
        set({
          currentUser: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

/**
 * 檢查是否已登入（用於路由守衛）
 */
export function requireAuth(): string | null {
  const { currentUser, isAuthenticated } = useAuthStore.getState();

  if (!isAuthenticated || !currentUser) {
    return null;
  }

  return currentUser;
}
