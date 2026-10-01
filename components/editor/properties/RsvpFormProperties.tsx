"use client";

import { useState } from "react";
import { useEditorStore } from "@/stores/editorStore";
import type { RsvpFormElement } from "@/types";

interface RsvpFormPropertiesProps {
  element: RsvpFormElement;
}

export default function RsvpFormProperties({
  element,
}: RsvpFormPropertiesProps) {
  const { updateElement } = useEditorStore();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleFieldToggle = (field: keyof RsvpFormElement["fields"]) => {
    updateElement(element.id, {
      fields: {
        ...element.fields,
        [field]: !element.fields[field],
      },
    });
  };

  const handleTitleChange = (title: string) => {
    updateElement(element.id, { title });
  };

  const handleSubmitTextChange = (submitButtonText: string) => {
    updateElement(element.id, { submitButtonText });
  };

  const selectedFieldsCount = Object.values(element.fields).filter(
    Boolean,
  ).length;

  return (
    <div className="p-4 border-b border-neutral-200">
      {/* 摺疊標題 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-3 text-left"
      >
        <h4 className="text-sm font-semibold text-neutral-900">表單設定</h4>
        <svg
          className={`w-4 h-4 text-neutral-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="space-y-3">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              表單標題
            </label>
            <input
              type="text"
              value={element.title || "RSVP表單"}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="請輸入表單標題"
            />
          </div>

          {/* Submit Button Text */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              送出按鈕文字
            </label>
            <input
              type="text"
              value={element.submitButtonText || "送出"}
              onChange={(e) => handleSubmitTextChange(e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="請輸入按鈕文字"
            />
          </div>

          {/* Field Configuration */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-2">
              顯示欄位 ({selectedFieldsCount}/4)
            </label>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 cursor-pointer hover:bg-neutral-50 p-1.5 rounded transition-colors">
                <input
                  type="checkbox"
                  checked={element.fields.name}
                  onChange={() => handleFieldToggle("name")}
                  className="w-4 h-4 text-primary border-neutral-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-neutral-700">姓名</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer hover:bg-neutral-50 p-1.5 rounded transition-colors">
                <input
                  type="checkbox"
                  checked={element.fields.email}
                  onChange={() => handleFieldToggle("email")}
                  className="w-4 h-4 text-primary border-neutral-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-neutral-700">電子郵件</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer hover:bg-neutral-50 p-1.5 rounded transition-colors">
                <input
                  type="checkbox"
                  checked={element.fields.attendance}
                  onChange={() => handleFieldToggle("attendance")}
                  className="w-4 h-4 text-primary border-neutral-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-neutral-700">出席狀態</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer hover:bg-neutral-50 p-1.5 rounded transition-colors">
                <input
                  type="checkbox"
                  checked={element.fields.message}
                  onChange={() => handleFieldToggle("message")}
                  className="w-4 h-4 text-primary border-neutral-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-neutral-700">留言</span>
              </label>
            </div>
          </div>

          {/* Field Preview */}
          {selectedFieldsCount > 0 && (
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                已選欄位
              </label>
              <div className="bg-neutral-50 p-2 rounded border border-neutral-200">
                <div className="flex flex-wrap gap-1.5">
                  {element.fields.name && (
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">
                      姓名
                    </span>
                  )}
                  {element.fields.email && (
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">
                      電子郵件
                    </span>
                  )}
                  {element.fields.attendance && (
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">
                      出席狀態
                    </span>
                  )}
                  {element.fields.message && (
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">
                      留言
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Warning if no fields selected */}
          {selectedFieldsCount === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
              <p className="text-xs text-yellow-700">⚠️ 請至少選擇一個欄位</p>
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded p-2">
            <p className="text-xs text-blue-700">
              💡 建議包含「姓名」或「電子郵件」以識別回覆者
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
