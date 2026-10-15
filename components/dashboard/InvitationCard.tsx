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
    <div className="bg-white rounded-2xl shadow-lg border-2 border-transparent overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-accent-terracotta hover:-translate-y-1">
      {/* 預覽縮圖 */}
      <div
        className="relative bg-soft-beige cursor-pointer group"
        onClick={handlePreview}
      >
        <div className="aspect-[9/16] flex items-center justify-center overflow-hidden">
          <div className="scale-[0.35] origin-center">
            <InvitationCanvas
              elements={invitation.elements}
              canvasSize={invitation.canvasSize}
            />
          </div>
        </div>
        {/* Hover 遮罩 */}
        <div className="absolute inset-0 bg-deep-brown/0 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:bg-deep-brown/20 group-hover:opacity-100">
          <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-full">
            預覽
          </span>
        </div>
      </div>

      {/* 資訊區 */}
      <div className="p-md">
        <h3 className="font-serif font-semibold text-deep-brown text-lg mb-xs overflow-hidden text-ellipsis whitespace-nowrap">
          {invitation.title}
        </h3>
        <div className="text-xs text-text-light flex flex-col gap-1 mb-md">
          <p>建立時間：{formatDate(invitation.createdAt)}</p>
          <p>更新時間：{formatDate(invitation.updatedAt)}</p>
          <p>元件數量：{invitation.elements.length}</p>
        </div>

        {/* 操作按鈕 */}
        <div className="flex flex-col gap-xs">
          <div className="flex gap-xs">
            <button
              onClick={handleEdit}
              className="flex-1 px-2.5 py-2.5 bg-accent-terracotta text-white border-none rounded-lg font-medium text-sm cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              編輯
            </button>
            <button
              onClick={handleViewRsvp}
              className="flex-1 px-2.5 py-2.5 bg-accent-sage text-white border-none rounded-lg font-medium text-sm cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              查看 RSVP
            </button>
          </div>

          <div className="flex gap-xs">
            <button
              onClick={() => onCopyLink(invitation.id)}
              className="flex-1 px-2.5 py-2.5 bg-soft-beige text-warm-brown border-none rounded-lg font-medium text-sm cursor-pointer transition-all duration-300 hover:bg-warm-brown hover:text-white"
            >
              複製連結
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 px-2.5 py-2.5 bg-accent-terracotta/10 text-accent-terracotta border-none rounded-lg font-medium text-sm cursor-pointer transition-all duration-300 hover:bg-accent-terracotta hover:text-white"
            >
              刪除
            </button>
          </div>
        </div>
      </div>

      {/* 刪除確認對話框 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-text-primary/50 flex items-center justify-center z-50 p-md">
          <div className="bg-white rounded-2xl shadow-2xl max-w-[500px] w-full p-lg">
            <h3 className="text-2xl font-bold text-deep-brown mb-xs font-serif">
              確認刪除
            </h3>
            <p className="text-text-secondary mb-lg leading-relaxed">
              確定要刪除「{truncate(invitation.title, 30)}」嗎？此操作無法復原。
            </p>
            <div className="flex gap-sm justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-6 py-3 bg-soft-beige text-warm-brown border-none rounded-full font-medium cursor-pointer transition-all duration-300 hover:bg-warm-brown hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-6 py-3 bg-accent-terracotta text-white border-none rounded-full font-medium cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
