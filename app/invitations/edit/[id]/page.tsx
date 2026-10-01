"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { useEditorStore } from "@/stores/editorStore";
import { useInvitationStore } from "@/stores/invitationStore";
import Editor from "@/components/editor/Editor";
import PreviewModal from "@/components/ui/PreviewModal";
import type { Invitation } from "@/types";

export default function EditInvitationPage() {
  const router = useRouter();
  const params = useParams();
  const invitationId = params.id as string;
  const currentUser = useRequireAuth();

  const { elements, canvasSize, setElements, setCanvasSize } = useEditorStore();
  const { updateInvitation, isLoading } = useInvitationStore();

  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [showTitleDialog, setShowTitleDialog] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // 載入邀請函資料
  useEffect(() => {
    const loadInvitation = async () => {
      if (!currentUser) return;

      try {
        // 從 localStorage 載入邀請函
        const invitationsKey = `user:${currentUser}:invitations`;
        const invitationsJson = localStorage.getItem(invitationsKey);

        if (!invitationsJson) {
          setError("找不到邀請函");
          setIsInitializing(false);
          return;
        }

        const invitations: Invitation[] = JSON.parse(invitationsJson);
        const found = invitations.find((inv) => inv.id === invitationId);

        if (!found) {
          setError("找不到邀請函");
          setIsInitializing(false);
          return;
        }

        // 檢查權限
        if (found.createdBy !== currentUser) {
          setError("您沒有權限編輯此邀請函");
          setIsInitializing(false);
          return;
        }

        setInvitation(found);
        setTitle(found.title);
        setElements(found.elements);
        setCanvasSize(found.canvasSize);
        setIsInitializing(false);
      } catch (error) {
        console.error("Failed to load invitation:", error);
        setError("載入邀請函時發生錯誤");
        setIsInitializing(false);
      }
    };

    loadInvitation();
  }, [invitationId, currentUser, setElements, setCanvasSize]);

  const handleSave = async () => {
    if (!currentUser || !invitation) return;

    setIsSaving(true);
    try {
      const result = await updateInvitation(invitationId, {
        title,
        elements: elements as any, // Cast to Element[]
        canvasSize,
      });

      if (result) {
        // 更新本地狀態
        setInvitation((prev) =>
          prev
            ? { ...prev, title, elements: elements as any, canvasSize }
            : null,
        );
        alert("儲存成功！");
        router.push(`/invitations/${invitationId}`);
      } else {
        alert("儲存失敗");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("儲存時發生錯誤");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleBack = () => {
    if (confirm("確定要離開嗎？未儲存的變更將會遺失。")) {
      router.push("/dashboard");
    }
  };

  const handleViewPublic = () => {
    // 在新分頁開啟公開預覽頁
    window.open(`/invitations/${invitationId}`, "_blank");
  };

  if (!currentUser || isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-neutral-600">載入中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
        <div className="text-center max-w-md">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
            {error}
          </h2>
          <p className="text-neutral-600 mb-6">請確認邀請函 ID 是否正確</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            返回我的邀請函
          </button>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* 頂部導航列 */}
      <div className="h-14 border-b border-neutral-200 flex items-center justify-between px-4 bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            title="返回"
          >
            <svg
              className="w-5 h-5 text-neutral-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <div className="h-8 w-px bg-neutral-200"></div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTitleDialog(true)}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <h1 className="text-lg font-semibold text-neutral-900">
                {title}
              </h1>
              <svg
                className="w-4 h-4 text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              已儲存
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-500 mr-2">
            {elements.length} 個元件
          </span>
          <button
            onClick={handleViewPublic}
            className="px-4 py-2 text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            查看公開頁面
          </button>
          <button
            onClick={handlePreview}
            className="px-4 py-2 text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            預覽
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                儲存中...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
                儲存變更
              </>
            )}
          </button>
        </div>
      </div>

      {/* 編輯器主體 */}
      <div className="flex-1 overflow-hidden">
        <Editor onSave={handleSave} onPreview={handlePreview} />
      </div>

      {/* 標題編輯對話框 */}
      {showTitleDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              編輯邀請函標題
            </h3>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="請輸入標題"
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowTitleDialog(false)}
                className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => setShowTitleDialog(false)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                確定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 預覽 Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        elements={elements as any}
        canvasSize={canvasSize}
        title={title}
      />
    </div>
  );
}
