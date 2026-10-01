'use client';

import { useState, useEffect } from 'react';
import { templatesApi, invitationsApi, rsvpApi } from '@/lib/mockApi';
import { Template } from '@/types';

export default function TestApiPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('');

  const testTemplatesApi = async () => {
    setLoading(true);
    setStatus('測試範本 API...');
    
    try {
      const response = await templatesApi.getAll();
      if (response.success && response.data) {
        setTemplates(response.data);
        setStatus(`✅ 成功載入 ${response.data.length} 個範本`);
      } else {
        setStatus(`❌ 錯誤: ${response.error}`);
      }
    } catch (error) {
      setStatus(`❌ 錯誤: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testTemplateById = async () => {
    setLoading(true);
    setStatus('測試單一範本 API...');
    
    try {
      const response = await templatesApi.getById('template-wedding-1');
      if (response.success && response.data) {
        setStatus(`✅ 成功載入範本: ${response.data.name}`);
      } else {
        setStatus(`❌ ${response.error || '範本不存在'}`);
      }
    } catch (error) {
      setStatus(`❌ 錯誤: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testTemplatesApi();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Mock API 測試頁面</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-4">
            <p className="text-lg font-semibold">狀態：{status}</p>
            {loading && <p className="text-sm text-gray-500 mt-2">載入中...</p>}
          </div>

          <div className="space-x-4">
            <button
              onClick={testTemplatesApi}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              測試範本 API
            </button>
            <button
              onClick={testTemplateById}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              測試單一範本
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">範本列表 ({templates.length})</h2>
          <div className="space-y-2">
            {templates.map((template) => (
              <div key={template.id} className="p-4 border rounded">
                <p className="font-medium">{template.name}</p>
                <p className="text-sm text-gray-600">{template.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {template.elements.length} 個元件 | 
                  {template.canvasSize.width}x{template.canvasSize.height}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
