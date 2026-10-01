"use client";

import { Invitation } from "@/types";
import { formatDate, truncate } from "@/lib/utils";
import InvitationCanvas from "@/components/ui/InvitationCanvas";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface InvitationCardProps {
  invitation: Invitation;
  onDelete: (id: string) => void;
  onCopyLink: (id: string) => void;
}

export function InvitationCard({
  invitation,
  onDelete,
  onCopyLink,
}: InvitationCardProps) {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const publicUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/invitations/${invitation.id}`;

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(invitation.id);
    setIsDeleting(false);
    setShowDeleteConfirm(false);
  };

  const handleEdit = () => {
    router.push(`/invitations/edit/${invitation.id}`);
  };

  const handleViewRsvp = () => {
    router.push(`/dashboard/rsvp/${invitation.id}`);
  };

  const handlePreview = () => {
    router.push(`/invitations/${invitation.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* 預覽縮圖 */}
      <div
        className="relative bg-gray-100 cursor-pointer group"
        onClick={handlePreview}
      >
        <div className="aspect-[9/16] flex items-center justify-center overflow-hidden">
          <div style={{ transform: "scale(0.35)", transformOrigin: "center" }}>
            <InvitationCanvas
              elements={invitation.elements}
              canvasSize={invitation.canvasSize}
            />
          </div>
        </div>
        {/* Hover 遮罩 */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="text-white font-medium bg-black bg-opacity-50 px-4 py-2 rounded-lg">
            預覽
          </span>
        </div>
      </div>

      {/* 資訊區 */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">
          {invitation.title}
        </h3>
        <div className="text-sm text-gray-500 space-y-1 mb-4">
          <p>建立時間：{formatDate(invitation.createdAt)}</p>
          <p>更新時間：{formatDate(invitation.updatedAt)}</p>
          <p>元件數量：{invitation.elements.length}</p>
        </div>

        {/* 操作按鈕 */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition text-sm"
            >
              編輯
            </button>
            <button
              onClick={handleViewRsvp}
              className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition text-sm"
            >
              查看 RSVP
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onCopyLink(invitation.id)}
              className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition text-sm"
            >
              複製連結
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition text-sm"
            >
              刪除
            </button>
          </div>
        </div>
      </div>

      {/* 刪除確認對話框 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">確認刪除</h3>
            <p className="text-gray-600 mb-6">
              確定要刪除「{truncate(invitation.title, 30)}」嗎？此操作無法復原。
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition disabled:opacity-50"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50"
              >
                {isDeleting ? "刪除中..." : "確認刪除"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
