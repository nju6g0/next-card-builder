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
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--warm-cream)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              animation: "spin 1s linear infinite",
              borderRadius: "50%",
              height: "3rem",
              width: "3rem",
              border: "3px solid var(--soft-beige)",
              borderTopColor: "var(--accent-terracotta)",
              margin: "0 auto",
            }}
          ></div>
          <p
            style={{
              marginTop: "var(--spacing-md)",
              color: "var(--text-secondary)",
            }}
          >
            載入中...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--warm-cream)",
        padding: "var(--spacing-lg) var(--spacing-md)",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(107, 84, 68, 0.08)",
            padding: "var(--spacing-lg)",
            marginBottom: "var(--spacing-lg)",
            border: "2px solid var(--soft-beige)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "var(--spacing-md)",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "var(--deep-brown)",
                  fontFamily: "var(--font-serif)",
                  marginBottom: "var(--spacing-xs)",
                }}
              >
                我的邀請函
              </h1>
              <p style={{ color: "var(--text-secondary)" }}>
                歡迎回來，{currentUser}
              </p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: "0.625rem 1.5rem",
                fontSize: "0.9rem",
                fontWeight: 500,
                color: "var(--warm-brown)",
                background: "var(--soft-beige)",
                border: "none",
                borderRadius: "50px",
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
              登出
            </button>
          </div>
        </div>

        {/* 複製成功提示 */}
        {copySuccess && (
          <div
            style={{
              position: "fixed",
              top: "var(--spacing-md)",
              right: "var(--spacing-md)",
              background: "var(--accent-sage)",
              color: "white",
              padding: "var(--spacing-sm) var(--spacing-md)",
              borderRadius: "50px",
              boxShadow: "0 4px 20px rgba(156, 169, 134, 0.4)",
              zIndex: 50,
              animation: "fadeInUp 0.3s ease",
              fontWeight: 500,
            }}
          >
            ✓ 連結已複製到剪貼簿
          </div>
        )}

        {/* Loading State */}
        {isLoading && invitations.length === 0 && (
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(107, 84, 68, 0.08)",
              padding: "var(--spacing-lg)",
              border: "2px solid var(--soft-beige)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "3rem 0",
              }}
            >
              <div
                style={{
                  animation: "spin 1s linear infinite",
                  borderRadius: "50%",
                  height: "3rem",
                  width: "3rem",
                  border: "3px solid var(--soft-beige)",
                  borderTopColor: "var(--accent-terracotta)",
                }}
              ></div>
              <span
                style={{
                  marginLeft: "var(--spacing-sm)",
                  color: "var(--text-secondary)",
                }}
              >
                載入邀請函中...
              </span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && invitations.length === 0 && (
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(107, 84, 68, 0.08)",
              padding: "var(--spacing-lg)",
              border: "2px solid var(--soft-beige)",
            }}
          >
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <div
                style={{ fontSize: "4rem", marginBottom: "var(--spacing-md)" }}
              >
                📝
              </div>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  color: "var(--deep-brown)",
                  marginBottom: "var(--spacing-xs)",
                  fontFamily: "var(--font-serif)",
                }}
              >
                尚無邀請函
              </h2>
              <p
                style={{
                  color: "var(--text-secondary)",
                  marginBottom: "var(--spacing-lg)",
                }}
              >
                開始建立您的第一個邀請函吧！
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "var(--spacing-md)",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "var(--spacing-lg)",
                flexWrap: "wrap",
                gap: "var(--spacing-md)",
              }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: "var(--deep-brown)",
                  fontFamily: "var(--font-serif)",
                }}
              >
                全部邀請函 ({invitations.length})
              </h2>
              <button onClick={handleCreateNew} className="btn-primary">
                + 建立新邀請函
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "var(--spacing-lg)",
              }}
            >
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
