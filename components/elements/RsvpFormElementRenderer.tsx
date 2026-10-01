"use client";

import type { RsvpFormElement } from "@/types";
import { useEditorStore } from "@/stores/editorStore";

interface RsvpFormElementRendererProps {
  element: RsvpFormElement;
  isSelected: boolean;
  isEditing?: boolean;
  onDoubleClick?: (e: React.MouseEvent) => void;
}

export default function RsvpFormElementRenderer({
  element,
  isSelected,
  isEditing = false,
  onDoubleClick,
}: RsvpFormElementRendererProps) {
  const { updateElement } = useEditorStore();

  // 切換欄位顯示
  const toggleField = (fieldName: keyof RsvpFormElement["fields"]) => {
    updateElement(element.id, {
      fields: {
        ...element.fields,
        [fieldName]: !element.fields[fieldName],
      },
    });
  };

  // 編輯模式：可配置欄位
  if (isEditing) {
    return (
      <div className="w-full h-full bg-white border-2 border-primary rounded-lg p-4 overflow-auto">
        <h3 className="text-sm font-semibold text-neutral-900 mb-3">
          RSVP 表單設定
        </h3>

        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={element.fields.name}
              onChange={() => toggleField("name")}
              className="rounded border-neutral-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-neutral-700">姓名欄位</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={element.fields.email}
              onChange={() => toggleField("email")}
              className="rounded border-neutral-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-neutral-700">Email 欄位</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={element.fields.attendance}
              onChange={() => toggleField("attendance")}
              className="rounded border-neutral-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-neutral-700">出席意願</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={element.fields.message || false}
              onChange={() => toggleField("message")}
              className="rounded border-neutral-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-neutral-700">留言欄位（選用）</span>
          </label>
        </div>

        <div className="mt-4 pt-4 border-t border-neutral-200">
          <p className="text-xs text-neutral-500">
            提示：勾選要在表單中顯示的欄位
          </p>
        </div>
      </div>
    );
  }

  // 預覽模式：顯示表單樣式
  return (
    <div
      className="w-full h-full bg-white border-2 border-neutral-200 rounded-lg p-4 overflow-auto cursor-pointer hover:border-primary transition"
      onDoubleClick={onDoubleClick}
    >
      <h3 className="text-base font-semibold text-neutral-900 mb-4 flex items-center">
        <svg
          className="w-5 h-5 mr-2 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        RSVP 回覆表單
      </h3>

      <div className="space-y-3">
        {element.fields.name && (
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              姓名 <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              disabled
              placeholder="請輸入您的姓名"
              className="w-full px-3 py-2 border border-neutral-300 rounded text-sm bg-neutral-50"
            />
          </div>
        )}

        {element.fields.email && (
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Email <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              disabled
              placeholder="your@email.com"
              className="w-full px-3 py-2 border border-neutral-300 rounded text-sm bg-neutral-50"
            />
          </div>
        )}

        {element.fields.attendance && (
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-2">
              是否出席 <span className="text-danger">*</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-not-allowed">
                <input
                  type="radio"
                  name="attendance-preview"
                  disabled
                  className="text-primary focus:ring-primary"
                />
                <span className="text-sm text-neutral-600">我會出席 ✓</span>
              </label>
              <label className="flex items-center space-x-2 cursor-not-allowed">
                <input
                  type="radio"
                  name="attendance-preview"
                  disabled
                  className="text-primary focus:ring-primary"
                />
                <span className="text-sm text-neutral-600">無法出席 ✗</span>
              </label>
            </div>
          </div>
        )}

        {element.fields.message && (
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              留言（選填）
            </label>
            <textarea
              disabled
              placeholder="留下您的祝福..."
              rows={3}
              className="w-full px-3 py-2 border border-neutral-300 rounded text-sm bg-neutral-50 resize-none"
            />
          </div>
        )}

        <button
          disabled
          className="w-full px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium opacity-50 cursor-not-allowed"
        >
          送出回覆
        </button>
      </div>

      {isSelected && !isEditing && (
        <div className="mt-3 pt-3 border-t border-neutral-200">
          <p className="text-xs text-neutral-500 text-center">雙擊可配置欄位</p>
        </div>
      )}
    </div>
  );
}
