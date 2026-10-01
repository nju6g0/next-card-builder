'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Editor from '@/components/editor/Editor';
import { useEditorStore } from '@/stores/editorStore';
import { useAuthStore } from '@/stores/authStore';

export default function TestEditorPage() {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const elements = useEditorStore(state => state.elements);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSave = () => {
    console.log('儲存編輯器內容:', elements);
    alert(`已儲存 ${elements.length} 個元件！`);
  };

  const handlePreview = () => {
    console.log('預覽模式');
    alert('預覽功能將在 Task 12 實作');
  };

  if (!isMounted) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">載入編輯器...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      {/* 頂部導航 */}
      <div className="bg-white border-b border-neutral-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/')}
              className="text-neutral-600 hover:text-neutral-900 transition"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-semibold text-neutral-900">編輯器測試頁</h1>
              <p className="text-xs text-neutral-500">Task 7: 拖拉編輯器功能測試</p>
            </div>
          </div>
          {user && (
            <div className="text-sm text-neutral-600">
              目前使用者：{user}
            </div>
          )}
        </div>
      </div>

      {/* 編輯器 */}
      <div className="h-[calc(100vh-65px)]">
        <Editor onSave={handleSave} onPreview={handlePreview} />
      </div>
    </div>
  );
}
