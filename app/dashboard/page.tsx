"use client";

import { useEffect, useState } from "react";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { useAuthStore } from "@/stores/authStore";
import { useInvitationStore } from "@/stores/invitationStore";
import { useRouter } from "next/navigation";
import { InvitationCard } from "@/components/dashboard/InvitationCard";
import { copyToClipboard } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

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
      <div className="min-h-screen flex items-center justify-center bg-warm-cream">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-soft-beige border-t-accent-terracotta mx-auto"></div>
          <p className="mt-md text-text-secondary">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-cream p-lg md:p-md">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-lg mb-lg border-2 border-soft-beige">
          <div className="flex items-center justify-between flex-wrap gap-md">
            <div>
              <h1 className="text-[2rem] font-bold text-deep-brown font-serif mb-xs">
                我的邀請函
              </h1>
              <p className="text-text-secondary">歡迎回來，{currentUser}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 text-[0.9rem] font-medium text-warm-brown bg-soft-beige border-none rounded-full cursor-pointer transition-all duration-300 hover:bg-warm-brown hover:text-white"
            >
              登出
            </button>
          </div>
        </div>

        {/* 複製成功提示 */}
        {copySuccess && (
          <div className="fixed top-md right-md bg-accent-sage text-white px-md py-sm rounded-full shadow-lg z-50 animate-[fadeInUp_0.3s_ease] font-medium">
            ✓ 連結已複製到剪貼簿
          </div>
        )}

        {/* Loading State */}
        {isLoading && invitations.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-lg border-2 border-soft-beige">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-soft-beige border-t-accent-terracotta"></div>
              <span className="ml-sm text-text-secondary">載入邀請函中...</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && invitations.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-lg border-2 border-soft-beige">
            <div className="text-center py-12">
              <div className="text-6xl mb-md">📝</div>
              <h2 className="text-2xl font-semibold text-deep-brown mb-xs font-serif">
                尚無邀請函
              </h2>
              <p className="text-text-secondary mb-lg">
                開始建立您的第一個邀請函吧！
              </p>
              <div className="flex gap-md justify-center flex-wrap">
                <Button onClick={handleCreateNew} variant="primary">
                  建立邀請函
                </Button>
                <Button onClick={handleBrowseTemplates} variant="secondary">
                  瀏覽範本
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Invitation Grid */}
        {!isLoading && invitations.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-lg flex-wrap gap-md">
              <h2 className="text-xl font-semibold text-deep-brown font-serif">
                全部邀請函 ({invitations.length})
              </h2>
              <Button onClick={handleCreateNew} variant="primary">
                + 建立新邀請函
              </Button>
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-lg">
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
