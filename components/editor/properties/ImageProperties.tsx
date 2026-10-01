'use client';

import { useState } from 'react';
import { useEditorStore } from '@/stores/editorStore';
import type { ImageElement } from '@/types';

interface ImagePropertiesProps {
  element: ImageElement;
}

const OBJECT_FITS = [
  { label: '覆蓋', value: 'cover' },
  { label: '包含', value: 'contain' },
  { label: '填滿', value: 'fill' },
];

export default function ImageProperties({ element }: ImagePropertiesProps) {
  const { updateElement } = useEditorStore();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleChange = (field: keyof ImageElement, value: any) => {
    updateElement(element.id, { [field]: value });
  };

  return (
    <div className="p-4 border-b border-neutral-200">
      {/* 摺疊標題 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-3 text-left"
      >
        <h4 className="text-sm font-semibold text-neutral-900">圖片樣式</h4>
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
          {/* 圖片 URL */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              圖片來源
            </label>
            <textarea
              value={element.src}
              onChange={(e) => handleChange('src', e.target.value)}
              rows={3}
              className="w-full px-2 py-1.5 text-xs border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-none"
              placeholder="https://..."
            />
          </div>

          {/* Alt 文字 */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              替代文字
            </label>
            <input
              type="text"
              value={element.alt}
              onChange={(e) => handleChange('alt', e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="圖片描述"
            />
          </div>

          {/* Object Fit */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-2">
              填充方式
            </label>
            <div className="grid grid-cols-3 gap-1">
              {OBJECT_FITS.map((fit) => (
                <button
                  key={fit.value}
                  onClick={() => handleChange('objectFit', fit.value)}
                  className={`px-2 py-1.5 text-xs rounded transition ${
                    element.objectFit === fit.value
                      ? 'bg-primary text-white'
                      : 'bg-neutral-100 hover:bg-neutral-200'
                  }`}
                >
                  {fit.label}
                </button>
              ))}
            </div>
          </div>

          {/* 模糊效果 */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              模糊: {element.blur || 0}px
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={element.blur || 0}
              onChange={(e) => handleChange('blur', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-neutral-500 mt-1">
              <span>無</span>
              <span>最大</span>
            </div>
          </div>

          {/* 背景圖片模式 */}
          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={element.isBackground}
                onChange={(e) => handleChange('isBackground', e.target.checked)}
                className="rounded border-neutral-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-neutral-700">設為背景圖片</span>
            </label>
            <p className="text-xs text-neutral-500 mt-1 ml-6">
              背景圖片會自動調整到元件大小
            </p>
          </div>

          {/* 圖片預覽 */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              預覽
            </label>
            <div className="relative w-full h-32 border border-neutral-200 rounded overflow-hidden bg-neutral-50">
              <img
                src={element.src}
                alt={element.alt}
                className="w-full h-full"
                style={{
                  objectFit: element.objectFit || 'cover',
                  filter: element.blur ? `blur(${element.blur}px)` : undefined,
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="flex items-center justify-center h-full text-neutral-400">
                        <div class="text-center">
                          <svg class="mx-auto h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <p class="text-xs">無法載入圖片</p>
                        </div>
                      </div>
                    `;
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
