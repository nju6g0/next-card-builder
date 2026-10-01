/**
 * Mock API - 模擬後端 API 的 Promise-based 函式
 * 使用 localStorage 儲存資料，加入模擬延遲以模擬網路請求
 */

import type {
  Template,
  Invitation,
  RsvpResponse,
  RsvpStats,
  ApiResponse,
  CreateInvitationData,
} from "@/types";
import { MOCK_TEMPLATES } from "@/constants/templates";
import { getUserData, setUserData } from "./storage";

const MOCK_DELAY = 500; // 模擬網路延遲（毫秒）

/**
 * 模擬網路延遲
 */
function delay(ms: number = MOCK_DELAY): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 生成唯一 ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// ==================== 範本 API ====================

export const templatesApi = {
  /**
   * 獲取所有範本
   */
  async getAll(): Promise<ApiResponse<Template[]>> {
    await delay();
    return {
      success: true,
      data: MOCK_TEMPLATES,
    };
  },

  /**
   * 根據 ID 獲取特定範本
   */
  async getById(id: string): Promise<ApiResponse<Template>> {
    await delay();
    const template = MOCK_TEMPLATES.find((t) => t.id === id);

    if (!template) {
      return {
        success: false,
        error: "找不到範本",
      };
    }

    return {
      success: true,
      data: template,
    };
  },
};

// ==================== 邀請函 API ====================

export const invitationsApi = {
  /**
   * 獲取使用者的所有邀請函
   */
  async getByUser(email: string): Promise<ApiResponse<Invitation[]>> {
    await delay();

    try {
      const invitations = getUserData<Invitation[]>(email, "invitations") || [];
      return {
        success: true,
        data: invitations,
      };
    } catch (error) {
      return {
        success: false,
        error: "載入邀請函失敗",
      };
    }
  },

  /**
   * 根據 ID 獲取特定邀請函（公開）
   */
  async getById(id: string): Promise<ApiResponse<Invitation>> {
    await delay();

    try {
      // 檢查是否在公開邀請函列表中
      const publicInvitationIds = JSON.parse(
        localStorage.getItem("public-invitations") || "[]",
      ) as string[];

      if (!publicInvitationIds.includes(id)) {
        return {
          success: false,
          error: "此邀請函不存在或尚未公開",
        };
      }

      // 搜尋所有使用者的邀請函
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("user:") && key.endsWith(":invitations")) {
          const invitationsJson = localStorage.getItem(key);
          if (invitationsJson) {
            const invitations: Invitation[] = JSON.parse(invitationsJson);
            const invitation = invitations.find((inv) => inv.id === id);
            if (invitation) {
              return {
                success: true,
                data: invitation,
              };
            }
          }
        }
      }

      return {
        success: false,
        error: "找不到邀請函",
      };
    } catch (error) {
      return {
        success: false,
        error: "載入邀請函失敗",
      };
    }
  },

  /**
   * 建立新邀請函
   */
  async create(
    email: string,
    data: CreateInvitationData,
  ): Promise<ApiResponse<Invitation>> {
    await delay();

    try {
      const invitations = getUserData<Invitation[]>(email, "invitations") || [];

      const newInvitation: Invitation = {
        id: generateId(),
        title: data.title,
        elements: data.elements,
        canvasSize: data.canvasSize,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: email,
        templateId: data.templateId,
      };

      invitations.push(newInvitation);
      setUserData(email, "invitations", invitations);

      // 只將 ID 加入公開邀請函列表（不儲存完整物件）
      const publicInvitationIds = JSON.parse(
        localStorage.getItem("public-invitations") || "[]",
      ) as string[];
      publicInvitationIds.push(newInvitation.id);
      localStorage.setItem(
        "public-invitations",
        JSON.stringify(publicInvitationIds),
      );

      return {
        success: true,
        data: newInvitation,
      };
    } catch (error) {
      return {
        success: false,
        error: "建立邀請函失敗",
      };
    }
  },

  /**
   * 更新邀請函
   */
  async update(
    email: string,
    id: string,
    data: Partial<Invitation>,
  ): Promise<ApiResponse<Invitation>> {
    await delay();

    try {
      const invitations = getUserData<Invitation[]>(email, "invitations") || [];
      const index = invitations.findIndex((inv) => inv.id === id);

      if (index === -1) {
        return {
          success: false,
          error: "找不到邀請函",
        };
      }

      // 檢查權限
      if (invitations[index].createdBy !== email) {
        return {
          success: false,
          error: "沒有權限編輯此邀請函",
        };
      }

      // 更新邀請函
      const updatedInvitation: Invitation = {
        ...invitations[index],
        ...data,
        id: invitations[index].id, // 確保 ID 不被更改
        createdBy: invitations[index].createdBy, // 確保作者不被更改
        createdAt: invitations[index].createdAt, // 確保建立時間不被更改
        updatedAt: new Date().toISOString(),
      };

      invitations[index] = updatedInvitation;
      setUserData(email, "invitations", invitations);

      // public-invitations 只儲存 ID，不需要更新

      return {
        success: true,
        data: updatedInvitation,
      };
    } catch (error) {
      return {
        success: false,
        error: "更新邀請函失敗",
      };
    }
  },

  /**
   * 刪除邀請函
   */
  async delete(email: string, id: string): Promise<ApiResponse<boolean>> {
    await delay();

    try {
      const invitations = getUserData<Invitation[]>(email, "invitations") || [];
      const index = invitations.findIndex((inv) => inv.id === id);

      if (index === -1) {
        return {
          success: false,
          error: "找不到邀請函",
        };
      }

      // 檢查權限
      if (invitations[index].createdBy !== email) {
        return {
          success: false,
          error: "沒有權限刪除此邀請函",
        };
      }

      // 刪除邀請函
      invitations.splice(index, 1);
      setUserData(email, "invitations", invitations);

      // 從公開邀請函 ID 列表中移除
      const publicInvitationIds = JSON.parse(
        localStorage.getItem("public-invitations") || "[]",
      ) as string[];
      const publicIndex = publicInvitationIds.findIndex(
        (invId) => invId === id,
      );
      if (publicIndex !== -1) {
        publicInvitationIds.splice(publicIndex, 1);
        localStorage.setItem(
          "public-invitations",
          JSON.stringify(publicInvitationIds),
        );
      }

      return {
        success: true,
        data: true,
      };
    } catch (error) {
      return {
        success: false,
        error: "刪除邀請函失敗",
      };
    }
  },
};

// ==================== RSVP API ====================

export const rsvpApi = {
  /**
   * 提交 RSVP 回覆
   */
  async submit(
    invitationId: string,
    data: {
      name: string;
      email: string;
      attendance: "yes" | "no";
      message?: string;
    },
  ): Promise<ApiResponse<RsvpResponse>> {
    await delay();

    try {
      // 從 localStorage 讀取該邀請函的所有 RSVP 回覆
      const storageKey = `rsvp:${invitationId}`;
      const responses = JSON.parse(
        localStorage.getItem(storageKey) || "[]",
      ) as RsvpResponse[];

      // 檢查是否已經回覆過（根據 email）
      const existingIndex = responses.findIndex((r) => r.email === data.email);

      const newResponse: RsvpResponse = {
        id: existingIndex !== -1 ? responses[existingIndex].id : generateId(),
        invitationId,
        name: data.name,
        email: data.email,
        attendance: data.attendance,
        submittedAt: new Date().toISOString(),
      };

      if (existingIndex !== -1) {
        // 更新現有回覆
        responses[existingIndex] = newResponse;
      } else {
        // 新增回覆
        responses.push(newResponse);
      }

      localStorage.setItem(storageKey, JSON.stringify(responses));

      return {
        success: true,
        data: newResponse,
      };
    } catch (error) {
      return {
        success: false,
        error: "提交 RSVP 失敗",
      };
    }
  },

  /**
   * 獲取某個邀請函的所有 RSVP 回覆
   */
  async getByInvitation(
    invitationId: string,
  ): Promise<ApiResponse<RsvpResponse[]>> {
    await delay();

    try {
      const storageKey = `rsvp:${invitationId}`;
      const responses = JSON.parse(
        localStorage.getItem(storageKey) || "[]",
      ) as RsvpResponse[];

      return {
        success: true,
        data: responses,
      };
    } catch (error) {
      return {
        success: false,
        error: "載入 RSVP 回覆失敗",
      };
    }
  },

  /**
   * 獲取 RSVP 統計資訊
   */
  async getStats(invitationId: string): Promise<ApiResponse<RsvpStats>> {
    await delay();

    try {
      const storageKey = `rsvp:${invitationId}`;
      const responses = JSON.parse(
        localStorage.getItem(storageKey) || "[]",
      ) as RsvpResponse[];

      const stats: RsvpStats = {
        total: responses.length,
        attending: responses.filter((r) => r.attendance === "yes").length,
        notAttending: responses.filter((r) => r.attendance === "no").length,
      };

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      return {
        success: false,
        error: "載入 RSVP 統計失敗",
      };
    }
  },
};
