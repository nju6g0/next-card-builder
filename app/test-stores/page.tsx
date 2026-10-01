"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/stores/editorStore";
import { useInvitationStore } from "@/stores/invitationStore";
import { useAuthStore } from "@/stores/authStore";
import type { TextElement, ImageElement } from "@/types";

export default function TestStoresPage() {
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);

  // Editor Store
  const {
    elements,
    selectedElementId,
    canvasSize,
    showGrid,
    addElement,
    updateElement,
    deleteElement,
    selectElement,
    toggleGrid,
    undo,
    redo,
    canUndo,
    canRedo,
    reset: resetEditor,
  } = useEditorStore();

  // Invitation Store
  const {
    invitations,
    currentInvitation,
    isLoading,
    error,
    fetchUserInvitations,
    createInvitation,
    deleteInvitation: deleteInv,
    setCurrentInvitation,
    clearError,
    reset: resetInvitations,
  } = useInvitationStore();

  // 自動登入測試用戶
  useEffect(() => {
    if (!user) {
      login("test@example.com");
    }
  }, [user, login]);

  // 載入邀請函列表
  useEffect(() => {
    if (user) {
      fetchUserInvitations();
    }
  }, [user]);

  // 測試：新增文字元件
  const handleAddTextElement = () => {
    const textElement: TextElement = {
      id: "",
      type: "text",
      x: Math.random() * 200 + 50,
      y: Math.random() * 400 + 50,
      width: 200,
      height: 50,
      zIndex: 0,
      content: `測試文字 ${elements.length + 1}`,
      fontSize: 16,
      fontFamily: "Arial",
      color: "#000000",
      fontWeight: 400,
      textAlign: "left",
    };
    addElement(textElement);
  };

  // 測試：新增圖片元件
  const handleAddImageElement = () => {
    const imageElement: ImageElement = {
      id: "",
      type: "image",
      x: Math.random() * 200 + 50,
      y: Math.random() * 400 + 50,
      width: 150,
      height: 150,
      zIndex: 0,
      src: `https://picsum.photos/seed/${Date.now()}/300/300`,
      alt: "測試圖片",
      objectFit: "cover",
      isBackground: false,
    };
    addElement(imageElement);
  };

  // 測試：建立邀請函
  const handleCreateInvitation = async () => {
    if (!user) return;

    const newInvitation = await createInvitation({
      title: `測試邀請函 ${invitations.length + 1}`,
      elements: elements as any, // BaseElement[] to Element[]
      canvasSize: canvasSize,
    });

    if (newInvitation) {
      alert(`建立成功！ID: ${newInvitation.id}`);
    }
  };

  // 測試：刪除邀請函
  const handleDeleteInvitation = async (id: string) => {
    if (confirm("確定要刪除這個邀請函嗎？")) {
      const success = await deleteInv(id);
      if (success) {
        alert("刪除成功！");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* 標題 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-neutral-900 mb-2">
              Zustand Stores 測試頁面
            </h1>
            <p className="text-neutral-600">
              測試 editorStore 和 invitationStore 的功能
            </p>
            {user && (
              <p className="text-sm text-neutral-500 mt-2">目前登入：{user}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Editor Store 測試 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                Editor Store
              </h2>

              {/* 畫布資訊 */}
              <div className="mb-4 p-4 bg-neutral-50 rounded-lg">
                <p className="text-sm text-neutral-600 mb-1">
                  畫布尺寸: {canvasSize.width} x {canvasSize.height}
                </p>
                <p className="text-sm text-neutral-600 mb-1">
                  顯示網格: {showGrid ? "是" : "否"}
                </p>
                <p className="text-sm text-neutral-600 mb-1">
                  元件數量: {elements.length}
                </p>
                <p className="text-sm text-neutral-600">
                  選中元件: {selectedElementId || "無"}
                </p>
              </div>

              {/* 操作按鈕 */}
              <div className="space-y-2 mb-4">
                <button
                  onClick={handleAddTextElement}
                  className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                >
                  新增文字元件
                </button>
                <button
                  onClick={handleAddImageElement}
                  className="w-full px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition"
                >
                  新增圖片元件
                </button>
                <button
                  onClick={toggleGrid}
                  className="w-full px-4 py-2 bg-neutral-200 text-neutral-900 rounded-lg hover:bg-neutral-300 transition"
                >
                  切換網格顯示
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={undo}
                    disabled={!canUndo()}
                    className="flex-1 px-4 py-2 bg-neutral-200 text-neutral-900 rounded-lg hover:bg-neutral-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Undo
                  </button>
                  <button
                    onClick={redo}
                    disabled={!canRedo()}
                    className="flex-1 px-4 py-2 bg-neutral-200 text-neutral-900 rounded-lg hover:bg-neutral-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Redo
                  </button>
                </div>
                <button
                  onClick={resetEditor}
                  className="w-full px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/90 transition"
                >
                  重置編輯器
                </button>
              </div>

              {/* 元件列表 */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  元件列表
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {elements.length === 0 ? (
                    <p className="text-sm text-neutral-500 text-center py-4">
                      尚無元件
                    </p>
                  ) : (
                    elements
                      .slice()
                      .sort((a, b) => b.zIndex - a.zIndex)
                      .map((el) => (
                        <div
                          key={el.id}
                          className={`p-3 border rounded-lg cursor-pointer transition ${
                            selectedElementId === el.id
                              ? "border-primary bg-primary/5"
                              : "border-neutral-200 hover:border-neutral-300"
                          }`}
                          onClick={() => selectElement(el.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-neutral-900">
                                {el.type === "text" && "📝 "}
                                {el.type === "image" && "🖼️ "}
                                {el.type === "rsvp-form" && "📋 "}
                                {el.type}
                              </p>
                              <p className="text-xs text-neutral-600">
                                位置: ({Math.round(el.x)}, {Math.round(el.y)}) |
                                zIndex: {el.zIndex}
                              </p>
                              {el.type === "text" && (
                                <p className="text-xs text-neutral-500 mt-1 truncate">
                                  {(el as TextElement).content}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteElement(el.id);
                              }}
                              className="text-danger hover:text-danger/80 text-sm ml-2"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>

            {/* Invitation Store 測試 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                Invitation Store
              </h2>

              {/* 載入狀態 */}
              {isLoading && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">載入中...</p>
                </div>
              )}

              {/* 錯誤訊息 */}
              {error && (
                <div className="mb-4 p-4 bg-danger/10 border border-danger/20 rounded-lg">
                  <p className="text-sm text-danger">{error}</p>
                  <button
                    onClick={clearError}
                    className="text-xs text-danger hover:underline mt-1"
                  >
                    清除錯誤
                  </button>
                </div>
              )}

              {/* 邀請函統計 */}
              <div className="mb-4 p-4 bg-neutral-50 rounded-lg">
                <p className="text-sm text-neutral-600 mb-1">
                  邀請函數量: {invitations.length}
                </p>
                <p className="text-sm text-neutral-600">
                  當前邀請函: {currentInvitation?.id || "無"}
                </p>
              </div>

              {/* 操作按鈕 */}
              <div className="space-y-2 mb-4">
                <button
                  onClick={handleCreateInvitation}
                  disabled={elements.length === 0 || isLoading}
                  className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  從編輯器建立邀請函
                </button>
                <button
                  onClick={() => fetchUserInvitations()}
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-neutral-200 text-neutral-900 rounded-lg hover:bg-neutral-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  重新載入
                </button>
                <button
                  onClick={resetInvitations}
                  className="w-full px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/90 transition"
                >
                  重置 Store
                </button>
              </div>

              {/* 邀請函列表 */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  我的邀請函
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {invitations.length === 0 ? (
                    <p className="text-sm text-neutral-500 text-center py-4">
                      尚無邀請函
                    </p>
                  ) : (
                    invitations.map((inv) => (
                      <div
                        key={inv.id}
                        className={`p-3 border rounded-lg cursor-pointer transition ${
                          currentInvitation?.id === inv.id
                            ? "border-primary bg-primary/5"
                            : "border-neutral-200 hover:border-neutral-300"
                        }`}
                        onClick={() => setCurrentInvitation(inv)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-neutral-900">
                              {inv.title}
                            </p>
                            <p className="text-xs text-neutral-600">
                              {inv.elements.length} 個元件 |
                              {inv.canvasSize.width}x{inv.canvasSize.height}
                            </p>
                            <p className="text-xs text-neutral-500">
                              建立於:{" "}
                              {new Date(inv.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteInvitation(inv.id);
                            }}
                            className="text-danger hover:text-danger/80 text-sm ml-2"
                            disabled={isLoading}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 說明 */}
          <div className="mt-8 p-6 bg-white rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">
              測試說明
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-neutral-600">
              <div>
                <h4 className="font-medium text-neutral-900 mb-2">
                  Editor Store 測試：
                </h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>新增文字/圖片元件</li>
                  <li>點擊元件進行選取</li>
                  <li>刪除元件（點擊 ✕）</li>
                  <li>測試 Undo/Redo 功能</li>
                  <li>切換網格顯示</li>
                  <li>重置編輯器</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-neutral-900 mb-2">
                  Invitation Store 測試：
                </h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>從編輯器建立邀請函</li>
                  <li>查看邀請函列表</li>
                  <li>點擊邀請函設為當前</li>
                  <li>刪除邀請函</li>
                  <li>重新載入列表</li>
                  <li>測試 localStorage 持久化</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
