"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RestrictedEditor from "@/components/restricted-editor/RestrictedEditor";
import { getRestrictedTemplateById } from "@/lib/templates/templateRegistry";
import { invitationsApi } from "@/lib/mockApi";
import { useAuthStore } from "@/stores/authStore";
import type { RestrictedTemplate, Invitation } from "@/types";

export default function RestrictedEditExistingPage() {
  const params = useParams();
  const router = useRouter();
  const invitationId = params.invitationId as string;
  const { currentUser, isAuthenticated } = useAuthStore();

  const [template, setTemplate] = useState<RestrictedTemplate | null>(null);
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 載入邀請函和模板
    const loadData = async () => {
      try {
        if (!isAuthenticated || !currentUser) {
          setError("請先登入");
          return;
        }

        // 載入邀請函
        const response = await invitationsApi.getById(invitationId);
        if (!response.success || !response.data) {
          setError(response.error || "找不到邀請函");
          return;
        }

        const inv = response.data;

        // 檢查是否為受限邀請函
        if (!inv.isRestricted || !inv.restrictedTemplateId) {
          setError("此邀請函不是受限編輯模式");
          return;
        }

        // 檢查權限
        if (inv.createdBy !== currentUser) {
          setError("您沒有權限編輯此邀請函");
          return;
        }

        // 載入模板
        const tmpl = getRestrictedTemplateById(inv.restrictedTemplateId);
        if (!tmpl) {
          setError("找不到對應的模板");
          return;
        }

        setInvitation(inv);
        setTemplate(tmpl);
      } catch (err) {
        console.error("載入資料錯誤:", err);
        setError("載入失敗");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [invitationId, currentUser, isAuthenticated]);

  // 儲存處理
  const handleSave = async (userValues: Record<string, any>) => {
    if (!isAuthenticated || !currentUser || !invitation) return;

    const response = await invitationsApi.update(currentUser, invitation.id, {
      userValues,
      updatedAt: new Date().toISOString(),
    });

    if (!response.success) {
      throw new Error(response.error || "更新失敗");
    }

    alert("更新成功！");
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">載入中...</p>
        </div>
      </div>
    );
  }

  if (error || !template || !invitation) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">載入失敗</h1>
          <p className="text-neutral-600 mb-6">{error || "未知錯誤"}</p>
          <a
            href="/dashboard"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-block"
          >
            返回儀表板
          </a>
        </div>
      </div>
    );
  }

  return (
    <RestrictedEditor
      template={template}
      invitationId={invitation.id}
      initialUserValues={invitation.userValues}
      onSave={handleSave}
    />
  );
}
