'use client';

import { useState } from 'react';
import { useEditorStore } from '@/stores/editorStore';
import type { BaseElement } from '@/types';

interface CommonPropertiesProps {
  element: BaseElement;
}

export default function CommonProperties({ element }: CommonPropertiesProps) {
  const { updateElement, moveElementUp, moveElementDown, moveElementToTop, moveElementToBottom } = useEditorStore();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleChange = (field: keyof BaseElement, value: number) => {
    updateElement(element.id, { [field]: value });
  };

  return (
    <div className="p-4">
      {/* 摺疊標題 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-3 text-left"
      >
        <h4 className="text-sm font-semibold text-neutral-900">位置與尺寸</h4>
        <svg
          className={`w-4 h-4 text-neutral-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="space-y-3">
          {/* 位置 */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                X 座標
              </label>
              <input
                type="number"
                value={Math.round(element.x)}
                onChange={(e) => handleChange('x', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1.5 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Y 座標
              </label>
              <input
                type="number"
                value={Math.round(element.y)}
                onChange={(e) => handleChange('y', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1.5 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* 尺寸 */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                寬度
              </label>
              <input
                type="number"
                value={Math.round(element.width)}
                onChange={(e) => handleChange('width', parseFloat(e.target.value) || 1)}
                min="1"
                className="w-full px-2 py-1.5 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                高度
              </label>
              <input
                type="number"
                value={Math.round(element.height)}
                onChange={(e) => handleChange('height', parseFloat(e.target.value) || 1)}
                min="1"
                className="w-full px-2 py-1.5 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* 圖層順序 */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-2">
              圖層順序
            </label>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => moveElementToBottom(element.id)}
                className="flex-1 px-2 py-1.5 text-xs bg-neutral-100 hover:bg-neutral-200 rounded transition"
                title="移到最底層"
              >
                ⬇⬇
              </button>
              <button
                onClick={() => moveElementDown(element.id)}
                className="flex-1 px-2 py-1.5 text-xs bg-neutral-100 hover:bg-neutral-200 rounded transition"
                title="下移一層"
              >
                ⬇
              </button>
              <div className="flex-1 px-2 py-1.5 text-xs text-center border border-neutral-300 rounded bg-white">
                {element.zIndex}
              </div>
              <button
                onClick={() => moveElementUp(element.id)}
                className="flex-1 px-2 py-1.5 text-xs bg-neutral-100 hover:bg-neutral-200 rounded transition"
                title="上移一層"
              >
                ⬆
              </button>
              <button
                onClick={() => moveElementToTop(element.id)}
                className="flex-1 px-2 py-1.5 text-xs bg-neutral-100 hover:bg-neutral-200 rounded transition"
                title="移到最上層"
              >
                ⬆⬆
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
