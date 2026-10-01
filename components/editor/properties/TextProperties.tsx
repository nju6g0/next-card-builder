'use client';

import { useState } from 'react';
import { useEditorStore } from '@/stores/editorStore';
import type { TextElement } from '@/types';

interface TextPropertiesProps {
  element: TextElement;
}

const FONT_FAMILIES = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Courier New',
  'Verdana',
  'Impact',
  'Comic Sans MS',
  'Trebuchet MS',
];

const FONT_WEIGHTS = [
  { label: '細', value: 300 },
  { label: '正常', value: 400 },
  { label: '中等', value: 500 },
  { label: '粗體', value: 700 },
  { label: '特粗', value: 900 },
];

const TEXT_ALIGNS = [
  { label: '靠左', value: 'left', icon: '⬅' },
  { label: '置中', value: 'center', icon: '↔' },
  { label: '靠右', value: 'right', icon: '➡' },
];

export default function TextProperties({ element }: TextPropertiesProps) {
  const { updateElement } = useEditorStore();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleChange = (field: keyof TextElement, value: any) => {
    updateElement(element.id, { [field]: value });
  };

  return (
    <div className="p-4 border-b border-neutral-200">
      {/* 摺疊標題 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-3 text-left"
      >
        <h4 className="text-sm font-semibold text-neutral-900">文字樣式</h4>
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
          {/* 字型 */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              字型
            </label>
            <select
              value={element.fontFamily}
              onChange={(e) => handleChange('fontFamily', e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              style={{ fontFamily: element.fontFamily }}
            >
              {FONT_FAMILIES.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* 字體大小 */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              字體大小: {element.fontSize}px
            </label>
            <input
              type="range"
              min="8"
              max="120"
              value={element.fontSize}
              onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-neutral-500 mt-1">
              <span>8px</span>
              <span>120px</span>
            </div>
          </div>

          {/* 顏色 */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              顏色
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={element.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-12 h-9 rounded border border-neutral-300 cursor-pointer"
              />
              <input
                type="text"
                value={element.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="flex-1 px-2 py-1.5 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                placeholder="#000000"
              />
            </div>
          </div>

          {/* 字重 */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-2">
              字重
            </label>
            <div className="grid grid-cols-5 gap-1">
              {FONT_WEIGHTS.map((weight) => (
                <button
                  key={weight.value}
                  onClick={() => handleChange('fontWeight', weight.value)}
                  className={`px-2 py-1.5 text-xs rounded transition ${
                    element.fontWeight === weight.value
                      ? 'bg-primary text-white'
                      : 'bg-neutral-100 hover:bg-neutral-200'
                  }`}
                  style={{ fontWeight: weight.value }}
                >
                  {weight.label}
                </button>
              ))}
            </div>
          </div>

          {/* 對齊方式 */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-2">
              對齊方式
            </label>
            <div className="grid grid-cols-3 gap-1">
              {TEXT_ALIGNS.map((align) => (
                <button
                  key={align.value}
                  onClick={() => handleChange('textAlign', align.value)}
                  className={`px-2 py-1.5 text-sm rounded transition ${
                    element.textAlign === align.value
                      ? 'bg-primary text-white'
                      : 'bg-neutral-100 hover:bg-neutral-200'
                  }`}
                  title={align.label}
                >
                  {align.icon}
                </button>
              ))}
            </div>
          </div>

          {/* 內容預覽 */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              內容預覽
            </label>
            <div
              className="p-3 border border-neutral-200 rounded bg-neutral-50 text-sm break-words"
              style={{
                fontFamily: element.fontFamily,
                fontSize: Math.min(element.fontSize, 16),
                color: element.color,
                fontWeight: element.fontWeight,
                textAlign: element.textAlign || 'left',
              }}
            >
              {element.content || '(空白)'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
