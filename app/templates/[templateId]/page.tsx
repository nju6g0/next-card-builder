import { notFound } from "next/navigation";
import {
  getRestrictedTemplateById,
  getAllRestrictedTemplates,
} from "@/lib/templates/templateRegistry";
import TemplateDetailClient from "@/components/templates/TemplateDetailClient";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ templateId: string }>;
}

// 生成靜態參數（SSG）
export async function generateStaticParams() {
  const templates = getAllRestrictedTemplates();

  return templates.map((template) => ({
    templateId: template.id,
  }));
}

// 生成動態 metadata（SEO + 社群分享）
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { templateId } = await params;
  const template = getRestrictedTemplateById(templateId);

  if (!template) {
    return {
      title: "找不到模板 - Cardian 卡典",
    };
  }

  const emoji = template.name.includes("Wedding") ? "💍" : "🎉";

  return {
    title: `${template.name} ${emoji} - 邀請函範本 - Cardian 卡典`,
    description: template.description,
    openGraph: {
      title: `${template.name} ${emoji} - 邀請函範本`,
      description: template.description,
      type: "website",
      locale: "zh_TW",
      images: template.thumbnail ? [{ url: template.thumbnail }] : undefined,
    },
  };
}

export default async function RestrictedTemplateDetailPage({
  params,
}: PageProps) {
  const { templateId } = await params;
  const template = getRestrictedTemplateById(templateId);

  if (!template) {
    notFound();
  }

  // 準備預設值
  const defaultUserValues: Record<string, any> = {};
  template.editableProperties.forEach((prop) => {
    defaultUserValues[prop.propertyKey] = prop.defaultValue;
  });

  return (
    <TemplateDetailClient
      template={template}
      defaultUserValues={defaultUserValues}
    />
  );
}
