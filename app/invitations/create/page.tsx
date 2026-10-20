"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { useEditorStore } from "@/stores/editorStore";
import { useInvitationStore } from "@/stores/invitationStore";
import Editor from "@/components/editor/Editor";
import PreviewModal from "@/components/ui/PreviewModal";
import { templatesApi } from "@/lib/mockApi";
import { cleanupInvitationStorage } from "@/lib/cleanup-storage";
import type { Template } from "@/types";
import { ArrowLeftIcon, EditIcon } from "@/components/icons";

function CreateInvitationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentUser = useRequireAuth();
  const { elements, canvasSize, resetEditor, setElements, setCanvasSize } =
    useEditorStore();
  const { createInvitation, isLoading } = useInvitationStore();

  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("未命名邀請函");
  const [showTitleDialog, setShowTitleDialog] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  // 清理舊的 localStorage 資料（只執行一次）
  useEffect(() => {
    cleanupInvitationStorage();
  }, []);

  // 載入範本（如果有 templateId）
  useEffect(() => {
    const templateId = searchParams.get("template");

    const loadTemplate = async () => {
      if (templateId) {
        try {
          const response = await templatesApi.getById(templateId);
          if (response.success && response.data) {
            const template: Template = response.data;
            setTitle(template.name);
            setElements(template.elements);
            setCanvasSize(template.canvasSize);
          }
        } catch (error) {
          console.error("Failed to load template:", error);
        }
      } else {
        // 空白畫布 - 重置編輯器
        resetEditor();
      }
      setIsInitializing(false);
    };

    loadTemplate();
  }, [searchParams, setElements, setCanvasSize, resetEditor]);

  const handleSave = async () => {
    if (!currentUser) {
      console.error("No current user");
      alert("請先登入");
      return;
    }

    console.log("Starting save process...");
    console.log("Current user:", currentUser);
    console.log("Elements count:", elements.length);
    console.log("Canvas size:", canvasSize);

    setIsSaving(true);
    try {
      const result = await createInvitation({
        title,
        elements: elements as any, // Cast to Element[]
        canvasSize,
        templateId: searchParams.get("template") || undefined,
      });

      if (result) {
        router.push(`/invitations/${result.id}`);
      } else {
        console.error("Save returned null");
        alert("儲存失敗，請查看控制台了解詳情");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert(
        `儲存時發生錯誤: ${error instanceof Error ? error.message : String(error)}`,
      );
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
            <ArrowLeftIcon className="w-5 h-5 text-neutral-600" />
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
              <EditIcon className="w-4 h-4 text-neutral-400" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-500 mr-2">
            {elements.length} 個元件
          </span>
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
              "儲存並繼續"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4 font-serif">
              編輯邀請函標題
            </h3>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              placeholder="請輸入標題"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setShowTitleDialog(false);
                } else if (e.key === "Escape") {
                  setShowTitleDialog(false);
                }
              }}
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowTitleDialog(false)}
                className="px-5 py-2.5 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={() => setShowTitleDialog(false)}
                className="px-5 py-2.5 bg-primary text-deep-brown rounded-lg hover:bg-primary-dark transition-colors font-medium"
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

export default function CreateInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-neutral-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-neutral-600">載入中...</p>
          </div>
        </div>
      }
    >
      <CreateInvitationContent />
    </Suspense>
  );
}
