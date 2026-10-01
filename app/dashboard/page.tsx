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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">我的邀請函</h1>
              <p className="text-gray-600 mt-1">歡迎回來，{currentUser}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              登出
            </button>
          </div>
        </div>

        {/* 複製成功提示 */}
        {copySuccess && (
          <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
            ✓ 連結已複製到剪貼簿
          </div>
        )}

        {/* Loading State */}
        {isLoading && invitations.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">載入邀請函中...</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && invitations.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                尚無邀請函
              </h2>
              <p className="text-gray-600 mb-6">開始建立您的第一個邀請函吧！</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleCreateNew}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  建立邀請函
                </button>
                <button
                  onClick={handleBrowseTemplates}
                  className="px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-medium hover:bg-blue-50 transition"
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                全部邀請函 ({invitations.length})
              </h2>
              <button
                onClick={handleCreateNew}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                + 建立新邀請函
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
