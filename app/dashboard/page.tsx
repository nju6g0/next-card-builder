"use client";

import { useEffect, useState } from "react";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { useAuthStore } from "@/stores/authStore";
import { useInvitationStore } from "@/stores/invitationStore";
import { useRouter } from "next/navigation";
import { InvitationCard } from "@/components/dashboard/InvitationCard";
import { copyToClipboard } from "@/lib/utils";

export default function DashboardPage() {
  const currentUser = useRequireAuth();
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const invitations = useInvitationStore((state) => state.invitations);
  const fetchUserInvitations = useInvitationStore(
    (state) => state.fetchUserInvitations,
  );
  const deleteInvitation = useInvitationStore(
    (state) => state.deleteInvitation,
  );
  const isLoading = useInvitationStore((state) => state.isLoading);

  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      fetchUserInvitations();
    }
  }, [currentUser, fetchUserInvitations]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleDelete = async (id: string) => {
    const success = await deleteInvitation(id);
    if (success) {
      // 成功刪除，列表會自動更新
    }
  };

  const handleCopyLink = async (id: string) => {
    const publicUrl = `${window.location.origin}/invitations/${id}`;
    const success = await copyToClipboard(publicUrl);
    if (success) {
      setCopySuccess(id);
      setTimeout(() => setCopySuccess(null), 2000);
    }
  };

  const handleCreateNew = () => {
    router.push("/templates");
  };

  const handleBrowseTemplates = () => {
    router.push("/templates");
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-warm-cream)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-[var(--color-soft-beige)] border-t-[var(--color-accent-terracotta)] mx-auto"></div>
          <p className="mt-[var(--spacing-md)] text-[var(--color-text-secondary)]">
            載入中...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-warm-cream)] p-[var(--spacing-lg)] md:p-[var(--spacing-md)]">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-[var(--spacing-lg)] mb-[var(--spacing-lg)] border-2 border-[var(--color-soft-beige)]">
          <div className="flex items-center justify-between flex-wrap gap-[var(--spacing-md)]">
            <div>
              <h1 className="text-[2rem] font-bold text-[var(--color-deep-brown)] font-[var(--font-family-serif)] mb-[var(--spacing-xs)]">
                我的邀請函
              </h1>
              <p className="text-[var(--color-text-secondary)]">
                歡迎回來，{currentUser}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 text-[0.9rem] font-medium text-[var(--color-warm-brown)] bg-[var(--color-soft-beige)] border-none rounded-full cursor-pointer transition-all duration-300 hover:bg-[var(--color-warm-brown)] hover:text-white"
            >
              登出
            </button>
          </div>
        </div>

        {/* 複製成功提示 */}
        {copySuccess && (
          <div className="fixed top-[var(--spacing-md)] right-[var(--spacing-md)] bg-[var(--color-accent-sage)] text-white px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-full shadow-lg z-50 animate-[fadeInUp_0.3s_ease] font-medium">
            ✓ 連結已複製到剪貼簿
          </div>
        )}

        {/* Loading State */}
        {isLoading && invitations.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-[var(--spacing-lg)] border-2 border-[var(--color-soft-beige)]">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-[var(--color-soft-beige)] border-t-[var(--color-accent-terracotta)]"></div>
              <span className="ml-[var(--spacing-sm)] text-[var(--color-text-secondary)]">
                載入邀請函中...
              </span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && invitations.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-[var(--spacing-lg)] border-2 border-[var(--color-soft-beige)]">
            <div className="text-center py-12">
              <div className="text-6xl mb-[var(--spacing-md)]">📝</div>
              <h2 className="text-2xl font-semibold text-[var(--color-deep-brown)] mb-[var(--spacing-xs)] font-[var(--font-family-serif)]">
                尚無邀請函
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-[var(--spacing-lg)]">
                開始建立您的第一個邀請函吧！
              </p>
              <div className="flex gap-[var(--spacing-md)] justify-center flex-wrap">
                <button onClick={handleCreateNew} className="btn-primary">
                  建立邀請函
                </button>
                <button
                  onClick={handleBrowseTemplates}
                  className="btn-secondary"
                >
                  瀏覽範本
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Invitation Grid */}
        {!isLoading && invitations.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-[var(--spacing-lg)] flex-wrap gap-[var(--spacing-md)]">
              <h2 className="text-xl font-semibold text-[var(--color-deep-brown)] font-[var(--font-family-serif)]">
                全部邀請函 ({invitations.length})
              </h2>
              <button onClick={handleCreateNew} className="btn-primary">
                + 建立新邀請函
              </button>
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[var(--spacing-lg)]">
              {invitations.map((invitation) => (
                <InvitationCard
                  key={invitation.id}
                  invitation={invitation}
                  onDelete={handleDelete}
                  onCopyLink={handleCopyLink}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
