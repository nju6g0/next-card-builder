import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  Invitation,
  CreateInvitationData,
  RsvpResponse,
  RsvpStats,
} from "@/types";
import { invitationsApi, rsvpApi } from "@/lib/mockApi";
import { useAuthStore } from "./authStore";

// Invitation 狀態型別
interface InvitationState {
  // 資料
  invitations: Invitation[];
  currentInvitation: Invitation | null;
  rsvpResponses: RsvpResponse[];
  rsvpStats: RsvpStats | null;

  // 載入狀態
  isLoading: boolean;
  error: string | null;

  // Actions - Invitation CRUD
  fetchUserInvitations: () => Promise<void>;
  fetchInvitationById: (id: string) => Promise<Invitation | null>;
  createInvitation: (data: CreateInvitationData) => Promise<Invitation | null>;
  updateInvitation: (id: string, data: Partial<Invitation>) => Promise<boolean>;
  deleteInvitation: (id: string) => Promise<boolean>;

  // Actions - Current Invitation
  setCurrentInvitation: (invitation: Invitation | null) => void;
  updateCurrentInvitation: (updates: Partial<Invitation>) => void;

  // Actions - RSVP
  fetchRsvpResponses: (invitationId: string) => Promise<void>;
  fetchRsvpStats: (invitationId: string) => Promise<void>;
  submitRsvp: (
    invitationId: string,
    data: { name: string; email: string; attending: boolean; message?: string },
  ) => Promise<boolean>;

  // Utilities
  clearError: () => void;
  reset: () => void;
}

// 初始狀態
const initialState = {
  invitations: [],
  currentInvitation: null,
  rsvpResponses: [],
  rsvpStats: null,
  isLoading: false,
  error: null,
};

export const useInvitationStore = create<InvitationState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Fetch 使用者的所有邀請函
      fetchUserInvitations: async () => {
        const user = useAuthStore.getState().currentUser;
        if (!user) {
          set({ error: "請先登入" });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await invitationsApi.getByUser(user);

          if (response.success && response.data) {
            set({ invitations: response.data, isLoading: false });
          } else {
            set({
              error: response.error || "載入邀請函失敗",
              isLoading: false,
            });
          }
        } catch (error) {
          set({ error: "載入邀請函時發生錯誤", isLoading: false });
        }
      },

      // Fetch 單一邀請函（公開）
      fetchInvitationById: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await invitationsApi.getById(id);

          if (response.success && response.data) {
            set({ currentInvitation: response.data, isLoading: false });
            return response.data;
          } else {
            set({
              error: response.error || "找不到邀請函",
              isLoading: false,
            });
            return null;
          }
        } catch (error) {
          set({ error: "載入邀請函時發生錯誤", isLoading: false });
          return null;
        }
      },

      // 建立新邀請函
      createInvitation: async (data: CreateInvitationData) => {
        const user = useAuthStore.getState().currentUser;
        console.log("createInvitation", user);
        if (!user) {
          set({ error: "請先登入" });
          return null;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await invitationsApi.create(user, data);

          if (response.success && response.data) {
            // 將新邀請函加入列表
            set((state) => ({
              invitations: [...state.invitations, response.data!],
              currentInvitation: response.data!,
              isLoading: false,
            }));
            return response.data;
          } else {
            set({
              error: response.error || "建立邀請函失敗",
              isLoading: false,
            });
            return null;
          }
        } catch (error) {
          set({ error: "建立邀請函時發生錯誤", isLoading: false });
          return null;
        }
      },

      // 更新邀請函
      updateInvitation: async (id: string, data: Partial<Invitation>) => {
        const user = useAuthStore.getState().currentUser;
        if (!user) {
          set({ error: "請先登入" });
          return false;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await invitationsApi.update(user, id, data);

          if (response.success && response.data) {
            // 更新列表中的邀請函
            set((state) => ({
              invitations: state.invitations.map((inv) =>
                inv.id === id ? response.data! : inv,
              ),
              currentInvitation:
                state.currentInvitation?.id === id
                  ? response.data!
                  : state.currentInvitation,
              isLoading: false,
            }));
            return true;
          } else {
            set({
              error: response.error || "更新邀請函失敗",
              isLoading: false,
            });
            return false;
          }
        } catch (error) {
          set({ error: "更新邀請函時發生錯誤", isLoading: false });
          return false;
        }
      },

      // 刪除邀請函
      deleteInvitation: async (id: string) => {
        const user = useAuthStore.getState().currentUser;
        if (!user) {
          set({ error: "請先登入" });
          return false;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await invitationsApi.delete(user, id);

          if (response.success) {
            // 從列表中移除
            set((state) => ({
              invitations: state.invitations.filter((inv) => inv.id !== id),
              currentInvitation:
                state.currentInvitation?.id === id
                  ? null
                  : state.currentInvitation,
              isLoading: false,
            }));
            return true;
          } else {
            set({
              error: response.error || "刪除邀請函失敗",
              isLoading: false,
            });
            return false;
          }
        } catch (error) {
          set({ error: "刪除邀請函時發生錯誤", isLoading: false });
          return false;
        }
      },

      // 設定當前邀請函
      setCurrentInvitation: (invitation) => {
        set({ currentInvitation: invitation });
      },

      // 更新當前邀請函（僅本地狀態）
      updateCurrentInvitation: (updates) => {
        set((state) => ({
          currentInvitation: state.currentInvitation
            ? { ...state.currentInvitation, ...updates }
            : null,
        }));
      },

      // Fetch RSVP 回覆列表
      fetchRsvpResponses: async (invitationId: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await rsvpApi.getByInvitation(invitationId);

          if (response.success && response.data) {
            set({ rsvpResponses: response.data, isLoading: false });
          } else {
            set({
              error: response.error || "載入 RSVP 回覆失敗",
              isLoading: false,
            });
          }
        } catch (error) {
          set({ error: "載入 RSVP 回覆時發生錯誤", isLoading: false });
        }
      },

      // Fetch RSVP 統計資訊
      fetchRsvpStats: async (invitationId: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await rsvpApi.getStats(invitationId);

          if (response.success && response.data) {
            set({ rsvpStats: response.data, isLoading: false });
          } else {
            set({
              error: response.error || "載入 RSVP 統計失敗",
              isLoading: false,
            });
          }
        } catch (error) {
          set({ error: "載入 RSVP 統計時發生錯誤", isLoading: false });
        }
      },

      // 提交 RSVP
      submitRsvp: async (invitationId: string, data) => {
        set({ isLoading: true, error: null });

        try {
          // 轉換 attending 為 attendance
          const rsvpData = {
            name: data.name,
            email: data.email,
            attendance: data.attending ? ("yes" as const) : ("no" as const),
            message: data.message,
          };

          const response = await rsvpApi.submit(invitationId, rsvpData);

          if (response.success) {
            set({ isLoading: false });
            return true;
          } else {
            set({
              error: response.error || "提交 RSVP 失敗",
              isLoading: false,
            });
            return false;
          }
        } catch (error) {
          set({ error: "提交 RSVP 時發生錯誤", isLoading: false });
          return false;
        }
      },

      // 清除錯誤
      clearError: () => {
        set({ error: null });
      },

      // 重置狀態
      reset: () => {
        set(initialState);
      },
    }),
    { name: "InvitationStore" },
  ),
);

// 便利的 Hooks
export const useInvitations = () =>
  useInvitationStore((state) => state.invitations);
export const useCurrentInvitation = () =>
  useInvitationStore((state) => state.currentInvitation);
export const useInvitationLoading = () =>
  useInvitationStore((state) => state.isLoading);
export const useInvitationError = () =>
  useInvitationStore((state) => state.error);
export const useRsvpResponses = () =>
  useInvitationStore((state) => state.rsvpResponses);
export const useRsvpStats = () =>
  useInvitationStore((state) => state.rsvpStats);
