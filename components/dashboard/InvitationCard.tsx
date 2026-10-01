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
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(107, 84, 68, 0.1)",
        border: "2px solid transparent",
        overflow: "hidden",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 40px rgba(107, 84, 68, 0.15)";
        e.currentTarget.style.borderColor = "var(--accent-terracotta)";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(107, 84, 68, 0.1)";
        e.currentTarget.style.borderColor = "transparent";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* 預覽縮圖 */}
      <div
        style={{
          position: "relative",
          background: "var(--soft-beige)",
          cursor: "pointer",
        }}
        onClick={handlePreview}
        className="group"
      >
        <div
          style={{
            aspectRatio: "9/16",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <div style={{ transform: "scale(0.35)", transformOrigin: "center" }}>
            <InvitationCanvas
              elements={invitation.elements}
              canvasSize={invitation.canvasSize}
            />
          </div>
        </div>
        {/* Hover 遮罩 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(107, 84, 68, 0)",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0,
          }}
          className="preview-overlay"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(107, 84, 68, 0.2)";
            e.currentTarget.style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(107, 84, 68, 0)";
            e.currentTarget.style.opacity = "0";
          }}
        >
          <span
            style={{
              color: "white",
              fontWeight: 500,
              background: "rgba(0, 0, 0, 0.5)",
              padding: "0.5rem 1rem",
              borderRadius: "50px",
            }}
          >
            預覽
          </span>
        </div>
      </div>

      {/* 資訊區 */}
      <div style={{ padding: "var(--spacing-md)" }}>
        <h3
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 600,
            color: "var(--deep-brown)",
            fontSize: "1.125rem",
            marginBottom: "var(--spacing-xs)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {invitation.title}
        </h3>
        <div
          style={{
            fontSize: "0.8rem",
            color: "var(--text-light)",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
            marginBottom: "var(--spacing-md)",
          }}
        >
          <p>建立時間：{formatDate(invitation.createdAt)}</p>
          <p>更新時間：{formatDate(invitation.updatedAt)}</p>
          <p>元件數量：{invitation.elements.length}</p>
        </div>

        {/* 操作按鈕 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-xs)",
          }}
        >
          <div style={{ display: "flex", gap: "var(--spacing-xs)" }}>
            <button
              onClick={handleEdit}
              style={{
                flex: 1,
                padding: "0.625rem",
                background: "var(--accent-terracotta)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: 500,
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(201, 125, 96, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              編輯
            </button>
            <button
              onClick={handleViewRsvp}
              style={{
                flex: 1,
                padding: "0.625rem",
                background: "var(--accent-sage)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: 500,
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(156, 169, 134, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              查看 RSVP
            </button>
          </div>

          <div style={{ display: "flex", gap: "var(--spacing-xs)" }}>
            <button
              onClick={() => onCopyLink(invitation.id)}
              style={{
                flex: 1,
                padding: "0.625rem",
                background: "var(--soft-beige)",
                color: "var(--warm-brown)",
                border: "none",
                borderRadius: "8px",
                fontWeight: 500,
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--warm-brown)";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--soft-beige)";
                e.currentTarget.style.color = "var(--warm-brown)";
              }}
            >
              複製連結
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                flex: 1,
                padding: "0.625rem",
                background: "rgba(201, 125, 96, 0.1)",
                color: "var(--accent-terracotta)",
                border: "none",
                borderRadius: "8px",
                fontWeight: 500,
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--accent-terracotta)";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(201, 125, 96, 0.1)";
                e.currentTarget.style.color = "var(--accent-terracotta)";
              }}
            >
              刪除
            </button>
          </div>
        </div>
      </div>

      {/* 刪除確認對話框 */}
      {showDeleteConfirm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(74, 63, 53, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: "var(--spacing-md)",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
              maxWidth: "500px",
              width: "100%",
              padding: "var(--spacing-lg)",
            }}
          >
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--deep-brown)",
                marginBottom: "var(--spacing-xs)",
                fontFamily: "var(--font-serif)",
              }}
            >
              確認刪除
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                marginBottom: "var(--spacing-lg)",
                lineHeight: 1.6,
              }}
            >
              確定要刪除「{truncate(invitation.title, 30)}」嗎？此操作無法復原。
            </p>
            <div
              style={{
                display: "flex",
                gap: "var(--spacing-sm)",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "var(--soft-beige)",
                  color: "var(--warm-brown)",
                  border: "none",
                  borderRadius: "50px",
                  fontWeight: 500,
                  cursor: isDeleting ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  opacity: isDeleting ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isDeleting) {
                    e.currentTarget.style.background = "var(--warm-brown)";
                    e.currentTarget.style.color = "white";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isDeleting) {
                    e.currentTarget.style.background = "var(--soft-beige)";
                    e.currentTarget.style.color = "var(--warm-brown)";
                  }
                }}
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "var(--accent-terracotta)",
                  color: "white",
                  border: "none",
                  borderRadius: "50px",
                  fontWeight: 500,
                  cursor: isDeleting ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  opacity: isDeleting ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isDeleting) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 20px rgba(201, 125, 96, 0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isDeleting) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
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
