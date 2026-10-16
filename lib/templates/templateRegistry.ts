import type { RestrictedTemplate } from "@/types";
import { weddingRestrictedTemplate } from "./weddingTemplate";
import { partyRestrictedTemplate } from "./partyTemplate";

// 受限模板註冊表
export const restrictedTemplates: Record<string, RestrictedTemplate> = {
  "wedding-animated-restricted": weddingRestrictedTemplate,
  "party-animated-restricted": partyRestrictedTemplate,
};

// 根據 ID 獲取受限模板
export function getRestrictedTemplateById(
  id: string,
): RestrictedTemplate | null {
  return restrictedTemplates[id] || null;
}

// 根據 slug 獲取受限模板
export function getRestrictedTemplateBySlug(
  slug: string,
): RestrictedTemplate | null {
  return (
    Object.values(restrictedTemplates).find((t) => t.slug === slug) || null
  );
}

// 獲取所有受限模板列表
export function getAllRestrictedTemplates(): RestrictedTemplate[] {
  return Object.values(restrictedTemplates);
}
