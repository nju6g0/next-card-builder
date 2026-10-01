"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { useInvitationStore } from "@/stores/invitationStore";
import { RsvpList } from "@/components/dashboard/RsvpList";
import { copyToClipboard } from "@/lib/utils";

export default function RsvpDetailPage() {
  const params = useParams();
  const router = useRouter();
  const currentUser = useRequireAuth();
  const invitationId = params.invitationId as string;

  const fetchInvitationById = useInvitationStore(
    (state) => state.fetchInvitationById,
  );
  const fetchRsvpResponses = useInvitationStore(
    (state) => state.fetchRsvpResponses,
  );
  const fetchRsvpStats = useInvitationStore((state) => state.fetchRsvpStats);

  const currentInvitation = useInvitationStore(
    (state) => state.currentInvitation,
  );
  const rsvpResponses = useInvitationStore((state) => state.rsvpResponses);
  const rsvpStats = useInvitationStore((state) => state.rsvpStats);
  const isLoading = useInvitationStore((state) => state.isLoading);
  const error = useInvitationStore((state) => state.error);

  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (currentUser && invitationId) {
      // 載入邀請函資料
      fetchInvitationById(invitationId);
      // 載入 RSVP 資料
      fetchRsvpResponses(invitationId);
      fetchRsvpStats(invitationId);
    }
  }, [
    currentUser,
    invitationId,
    fetchInvitationById,
    fetchRsvpResponses,
    fetchRsvpStats,
  ]);

  // 權限檢查：確保是邀請函的擁有者
  useEffect(() => {
    if (currentInvitation && currentUser) {
      if (currentInvitation.createdBy !== currentUser) {
        router.push("/dashboard");
      }
    }
  }, [currentInvitation, currentUser, router]);

  const handleCopyLink = async () => {
    const publicUrl = `${window.location.origin}/invitations/${invitationId}`;
    const success = await copyToClipboard(publicUrl);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  const handleEditInvitation = () => {
    router.push(`/invitations/edit/${invitationId}`);
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">載入失敗</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleBackToDashboard}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            返回儀表板
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={handleBackToDashboard}
                  className="text-gray-600 hover:text-gray-900 transition"
                >
                  ← 返回
                </button>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                {currentInvitation?.title || "邀請函"}
              </h1>
              <p className="text-gray-600 mt-1">RSVP 回覆管理</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleEditInvitation}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                編輯邀請函
              </button>
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                {copySuccess ? "✓ 已複製" : "複製連結"}
              </button>
            </div>
          </div>
        </div>

        {/* RSVP List */}
        <RsvpList
          responses={rsvpResponses}
          stats={rsvpStats}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
