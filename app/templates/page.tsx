import { getAllRestrictedTemplates } from "@/lib/templates/templateRegistry";
import { Button } from "@/components/ui/Button";
import TemplatesClient from "@/components/templates/TemplatesClient";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "邀請函範本 - Cardian 卡典",
  description:
    "精選動畫邀請函範本，婚禮、派對、慶生等場合。只需自訂文字、顏色和圖片即可快速完成。",
  openGraph: {
    title: "邀請函範本 - Cardian 卡典",
    description: "精選動畫邀請函範本，婚禮、派對、慶生等場合",
    type: "website",
    locale: "zh_TW",
  },
};

export default function TemplatesPage() {
  // 伺服器端獲取模板資料（靜態生成）
  const templates = getAllRestrictedTemplates();

  return (
    <div className="min-h-screen bg-warm-cream py-xl px-md">
      <div className="max-w-[1400px] mx-auto">
        {/* Header - 靜態內容 */}
        <div className="section-header mb-xl">
          <h1 className="section-title font-serif">邀請函範本</h1>
          <p className="section-subtitle">
            選擇精美的動畫範本，只需自訂文字、顏色和圖片即可快速完成
          </p>
        </div>

        {/* 範本網格 - 使用客戶端元件處理動畫 */}
        <TemplatesClient templates={templates} />

        {/* CTA Section - 靜態內容 */}
        <div className="mt-xl text-center bg-deep-brown rounded-2xl p-xl text-white relative overflow-hidden">
          <h2 className="text-[2rem] font-bold mb-md font-serif">
            想要更多自由度？
          </h2>
          <p className="text-lg mb-lg opacity-90">
            從空白畫布開始，完全自由地設計您的邀請函
          </p>
          <Link href="/invitations/create">
            <Button variant="primary" size="large">
              建立空白邀請函
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
