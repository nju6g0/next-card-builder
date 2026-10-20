"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRestrictedEditorStore } from "@/stores/restrictedEditorStore";
import { useAuthStore } from "@/stores/authStore";
import RestrictedPropertyPanel from "./RestrictedPropertyPanel";
import RestrictedPreview from "./RestrictedPreview";
import type { RestrictedTemplate } from "@/types";

interface RestrictedEditorProps {
  template: RestrictedTemplate;
  invitationId?: string; // 編輯現有邀請函時提供
  initialUserValues?: Record<string, any>; // 編輯現有邀請函時的初始值
  onSave?: (userValues: Record<string, any>) => Promise<void>;
}

export default function RestrictedEditor({
  template,
  invitationId,
  initialUserValues,
  onSave,
}: RestrictedEditorProps) {
  const router = useRouter();
  const { currentUser, isAuthenticated } = useAuthStore();
  const {
    setTemplate,
    setValues,
    userValues,
    hasUnsavedChanges,
    isSaving,
    setIsSaving,
    markAsSaved,
    reset,
  } = useRestrictedEditorStore();

  // 初始化模板和使用者值
  useEffect(() => {
    setTemplate(template);
    if (initialUserValues) {
      setValues(initialUserValues);
    }

    return () => {
      reset();
    };
  }, [template, initialUserValues, setTemplate, setValues, reset]);

  // 儲存處理
  const handleSave = async () => {
    if (!isAuthenticated || !currentUser) {
      alert("請先登入");
      router.push("/login");
      return;
    }

    if (!hasUnsavedChanges && !invitationId) {
      alert("沒有需要儲存的變更");
      return;
    }

    try {
      setIsSaving(true);

      if (onSave) {
        // 使用自訂儲存函式
        await onSave(userValues);
      } else if (invitationId) {
        // 編輯模式：更新現有邀請函
        const { invitationsApi } = await import("@/lib/mockApi");
        const response = await invitationsApi.update(
          currentUser,
          invitationId,
          {
            userValues,
            updatedAt: new Date().toISOString(),
          },
        );

        if (!response.success) {
          throw new Error(response.error || "更新失敗");
        }

        markAsSaved();
        alert("更新成功！");
      } else {
        // 新建模式：建立新邀請函
        const { invitationsApi } = await import("@/lib/mockApi");
        const response = await invitationsApi.create(currentUser, {
          title: `${template.name} - ${new Date().toLocaleDateString()}`,
          elements: [],
          canvasSize: template.canvasSize,
          isRestricted: true,
          restrictedTemplateId: template.id,
          userValues,
        } as any);

        if (!response.success) {
          throw new Error(response.error || "儲存失敗");
        }

        markAsSaved();
        alert("儲存成功！");
        router.push(`/dashboard`);
      }
    } catch (error) {
      console.error("儲存錯誤:", error);
      alert(error instanceof Error ? error.message : "儲存失敗，請稍後再試");
    } finally {
      setIsSaving(false);
    }
  };

  // 返回處理
  const handleBack = () => {
    if (hasUnsavedChanges) {
      const confirmed = confirm("您有未儲存的變更，確定要離開嗎？");
      if (!confirmed) return;
    }
    router.back();
  };

  // 預覽處理
  const handlePreview = () => {
    // 在新視窗中開啟預覽
    const previewData = {
      template,
      userValues,
    };
    sessionStorage.setItem("preview-data", JSON.stringify(previewData));
    window.open("/preview/restricted", "_blank");
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* 工具列 */}
      <div className="flex-shrink-0 border-b border-neutral-200 bg-white">
        <div className="flex items-center justify-between px-6 py-3">
          {/* 左側：返回按鈕 */}
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="font-medium">返回</span>
          </button>

          {/* 中間：標題和狀態 */}
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <h1 className="text-lg font-semibold text-neutral-900">
                {template.name}
              </h1>
              <p className="text-xs text-neutral-500">
                {invitationId ? "編輯邀請函" : "建立新邀請函"}
              </p>
            </div>
            {hasUnsavedChanges && (
              <div className="flex items-center space-x-1 text-amber-600">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs">未儲存</span>
              </div>
            )}
          </div>

          {/* 右側：操作按鈕 */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePreview}
              className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              預覽
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !hasUnsavedChanges}
              className="px-4 py-2 text-sm font-medium text-text-primary bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSaving ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>儲存中...</span>
                </>
              ) : (
                <span>儲存</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 主要編輯區域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 預覽區域（左側，較大） */}
        <div className="flex-1 overflow-hidden bg-neutral-900">
          <RestrictedPreview className="w-full h-full" />
        </div>

        {/* 屬性面板（右側，固定寬度） */}
        <div className="w-96 flex-shrink-0 border-l border-neutral-200 bg-white overflow-hidden">
          <RestrictedPropertyPanel className="h-full" />
        </div>
      </div>

      {/* 狀態列 */}
      <div className="flex-shrink-0 border-t border-neutral-200 px-6 py-2 bg-neutral-50">
        <div className="flex items-center justify-between text-xs text-neutral-600">
          <div className="flex items-center space-x-4">
            <span>{template.editableProperties.length} 個可編輯屬性</span>
            <span>•</span>
            <span>{template.description}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>💡 提示：修改右側屬性，左側即時預覽效果</span>
          </div>
        </div>
      </div>
    </div>
  );
}
