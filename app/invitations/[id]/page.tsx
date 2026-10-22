import { Suspense } from "react";
import InvitationPublicClient from "@/components/invitations/InvitationPublicClient";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

// 動態生成 metadata（為了 Open Graph 和 SEO）
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  // 基本 metadata（因為資料在 localStorage，無法在 SSR 中取得詳細資訊）
  return {
    title: "查看邀請函 - Cardian 卡典",
    description: "您收到一份精心設計的邀請函，點擊查看詳情並回覆出席意願。",
    openGraph: {
      title: "您收到一份邀請函 💌",
      description: "精心設計的數位邀請函，點擊查看詳情",
      type: "website",
      locale: "zh_TW",
    },
  };
}

export default async function InvitationPublicPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-neutral-600">載入中...</p>
          </div>
        </div>
      }
    >
      <InvitationPublicClient invitationId={id} />
    </Suspense>
  );
}
