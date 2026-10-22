"use client";

import { useRestrictedEditorStore } from "@/stores/restrictedEditorStore";
import type { EditableProperty } from "@/types";
import { useState } from "react";

interface PropertyInputProps {
  property: EditableProperty;
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
}

// 文字輸入元件
function TextInput({ property, value, onChange }: PropertyInputProps) {
  const maxLength = property.constraints?.maxLength;
  const stringValue = typeof value === "string" ? value : String(value || "");

  return (
    <div className="space-y-1">
      <textarea
        value={stringValue}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        rows={3}
        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        placeholder={`請輸入${property.label}`}
      />
      {maxLength && (
        <div className="text-xs text-neutral-500 text-right">
          {stringValue.length} / {maxLength}
        </div>
      )}
    </div>
  );
}

// 顏色選擇元件
function ColorInput({ property, value, onChange }: PropertyInputProps) {
  const stringValue = typeof value === "string" ? value : "#000000";

  return (
    <div className="flex items-center space-x-3">
      <input
        type="color"
        value={stringValue}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-12 border border-neutral-300 rounded cursor-pointer"
      />
      <input
        type="text"
        value={stringValue}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#000000"
        pattern="^#[0-9A-Fa-f]{6}$"
        className="flex-1 px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
      />
    </div>
  );
}

// 圖片 URL 輸入元件
function ImageInput({ property, value, onChange }: PropertyInputProps) {
  const [previewError, setPreviewError] = useState(false);
  const stringValue = typeof value === "string" ? value : "";

  return (
    <div className="space-y-3">
      <input
        type="url"
        value={stringValue}
        onChange={(e) => {
          onChange(e.target.value);
          setPreviewError(false);
        }}
        placeholder="https://example.com/image.jpg"
        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
      />
      {stringValue && (
        <div className="relative w-full h-32 bg-neutral-100 rounded-md overflow-hidden border border-neutral-200">
          {!previewError ? (
            <img
              src={stringValue}
              alt="預覽"
              className="w-full h-full object-cover"
              onError={() => setPreviewError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">
              無法載入圖片
            </div>
          )}
        </div>
      )}
      {property.constraints?.allowedFormats && (
        <div className="text-xs text-neutral-500">
          支援格式：
          {property.constraints.allowedFormats.join(", ").toUpperCase()}
        </div>
      )}
    </div>
  );
}

// 數字輸入元件
function NumberInput({ property, value, onChange }: PropertyInputProps) {
  const min = property.constraints?.min;
  const max = property.constraints?.max;
  const numberValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? parseFloat(value)
        : 0;

  return (
    <div className="space-y-1">
      <input
        type="number"
        value={isNaN(numberValue) ? "" : numberValue}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        min={min}
        max={max}
        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      {(min !== undefined || max !== undefined) && (
        <div className="text-xs text-neutral-500">
          {min !== undefined && max !== undefined
            ? `範圍：${min} - ${max}`
            : min !== undefined
              ? `最小值：${min}`
              : `最大值：${max}`}
        </div>
      )}
    </div>
  );
}

// 屬性欄位元件
function PropertyField({ property }: { property: EditableProperty }) {
  const { getValue, setValue } = useRestrictedEditorStore();
  const rawValue = getValue(property.propertyKey);
  const value = rawValue ?? property.defaultValue;

  const handleChange = (newValue: string | number | boolean) => {
    setValue(property.propertyKey, newValue);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-700">
        {property.label}
      </label>
      {property.type === "text" && (
        <TextInput property={property} value={value} onChange={handleChange} />
      )}
      {property.type === "color" && (
        <ColorInput property={property} value={value} onChange={handleChange} />
      )}
      {property.type === "image" && (
        <ImageInput property={property} value={value} onChange={handleChange} />
      )}
      {property.type === "number" && (
        <NumberInput
          property={property}
          value={value}
          onChange={handleChange}
        />
      )}
    </div>
  );
}

interface RestrictedPropertyPanelProps {
  className?: string;
}

export default function RestrictedPropertyPanel({
  className = "",
}: RestrictedPropertyPanelProps) {
  const { template, resetToDefaults } = useRestrictedEditorStore();

  if (!template) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="text-center text-neutral-500">未選擇模板</div>
      </div>
    );
  }

  // 按組別分類屬性
  const groupedProperties = template.editableProperties.reduce(
    (acc, prop) => {
      const group = prop.group || "其他";
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(prop);
      return acc;
    },
    {} as Record<string, EditableProperty[]>,
  );

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* 標題列 */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">編輯屬性</h3>
          <button
            onClick={resetToDefaults}
            className="text-xs text-neutral-600 hover:text-neutral-900 underline"
          >
            重置為預設值
          </button>
        </div>
        <p className="text-sm text-neutral-600 mt-1">
          自訂您的邀請函內容和樣式
        </p>
      </div>

      {/* 屬性列表 */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {Object.entries(groupedProperties).map(([groupName, properties]) => (
          <div key={groupName} className="space-y-4">
            {/* 組別標題 */}
            <div className="flex items-center space-x-2">
              <div className="h-px flex-1 bg-neutral-300" />
              <h4 className="text-sm font-semibold text-neutral-700 uppercase tracking-wider">
                {groupName}
              </h4>
              <div className="h-px flex-1 bg-neutral-300" />
            </div>

            {/* 該組別的屬性 */}
            <div className="space-y-4">
              {properties.map((property) => (
                <PropertyField key={property.id} property={property} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
