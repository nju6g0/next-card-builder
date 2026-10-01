/**
 * 清理 localStorage 的工具函數
 * 用於移除不再使用的舊資料
 */

/**
 * 清理 invitationStore 的舊持久化資料
 * 因為我們已經移除了 persist middleware，這些資料不再需要
 */
export function cleanupInvitationStorage(): void {
  if (typeof window === "undefined") return;

  try {
    // 移除舊的 invitation-storage 資料
    localStorage.removeItem("invitation-storage");
    console.log("✓ 已清理舊的 invitation-storage 資料");

    // 檢查 public-invitations 是否為舊格式（陣列中包含完整物件）
    const publicInvitationsStr = localStorage.getItem("public-invitations");
    if (publicInvitationsStr) {
      const publicInvitations = JSON.parse(publicInvitationsStr);

      // 如果第一個元素是物件（有 id 屬性），則為舊格式
      if (
        Array.isArray(publicInvitations) &&
        publicInvitations.length > 0 &&
        typeof publicInvitations[0] === "object" &&
        publicInvitations[0].id
      ) {
        // 提取 ID 並儲存為新格式
        const ids = publicInvitations.map((inv: any) => inv.id);
        localStorage.setItem("public-invitations", JSON.stringify(ids));
        console.log(
          "✓ 已將 public-invitations 從舊格式轉換為新格式（只儲存 ID）",
        );
      }
    }
  } catch (error) {
    console.error("清理 localStorage 時發生錯誤:", error);
  }
}

/**
 * 檢查 localStorage 使用量
 * @returns 使用量資訊（KB 和百分比）
 */
export function checkStorageUsage(): { usedKB: number; percentage: number } {
  if (typeof window === "undefined") {
    return { usedKB: 0, percentage: 0 };
  }

  try {
    let totalSize = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          totalSize += key.length + value.length;
        }
      }
    }

    const usedKB = totalSize / 1024;
    // 假設 localStorage 限制為 5MB
    const percentage = (totalSize / (5 * 1024 * 1024)) * 100;

    return { usedKB, percentage };
  } catch (error) {
    console.error("檢查 localStorage 使用量時發生錯誤:", error);
    return { usedKB: 0, percentage: 0 };
  }
}

/**
 * 列出所有 localStorage keys 和大小
 */
export function listStorageKeys(): Array<{ key: string; sizeKB: number }> {
  if (typeof window === "undefined") return [];

  const keys: Array<{ key: string; sizeKB: number }> = [];

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        const size = value ? (key.length + value.length) / 1024 : 0;
        keys.push({ key, sizeKB: size });
      }
    }

    // 按大小排序
    keys.sort((a, b) => b.sizeKB - a.sizeKB);
  } catch (error) {
    console.error("列出 localStorage keys 時發生錯誤:", error);
  }

  return keys;
}
