"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import RestrictedEditor from "@/components/restricted-editor/RestrictedEditor";
import { getRestrictedTemplateById } from "@/lib/templates/templateRegistry";
import type { RestrictedTemplate } from "@/types";

export default function RestrictedEditPage() {
  const params = useParams();
  const templateId = params.templateId as string;
  const [template, setTemplate] = useState<RestrictedTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 載入模板
    const loadTemplate = () => {
      try {
        const tmpl = getRestrictedTemplateById(templateId);
        if (!tmpl) {
          setError("找不到指定的模板");
          return;
        }
        setTemplate(tmpl);
      } catch (err) {
        console.error("載入模板錯誤:", err);
        setError("載入模板失敗");
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [templateId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">載入中...</p>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">載入失敗</h1>
          <p className="text-neutral-600 mb-6">{error || "未知錯誤"}</p>
          <Link
            href="/templates"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-block"
          >
            返回模板列表
          </Link>
        </div>
      </div>
    );
  }

  return <RestrictedEditor template={template} />;
}
