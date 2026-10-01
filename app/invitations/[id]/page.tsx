"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import InvitationCanvas from "@/components/ui/InvitationCanvas";
import { rsvpApi } from "@/lib/mockApi";
import type { Invitation, RsvpFormElement, SubmitRsvpData } from "@/types";

export default function InvitationPublicPage() {
  const params = useParams();
  const invitationId = params.id as string;

  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // RSVP 表單狀態
  const [formData, setFormData] = useState<SubmitRsvpData>({
    name: "",
    email: "",
    attendance: "yes",
    message: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // 載入邀請函資料
  useEffect(() => {
    const loadInvitation = () => {
      try {
        // 從 public invitations 列表載入
        const publicInvitationsJson =
          localStorage.getItem("public-invitations");
        if (!publicInvitationsJson) {
          setError("找不到邀請函");
          setIsLoading(false);
          return;
        }

        const publicIds: string[] = JSON.parse(publicInvitationsJson);
        if (!publicIds.includes(invitationId)) {
          setError("此邀請函不存在或尚未公開");
          setIsLoading(false);
          return;
        }

        // 搜尋所有使用者的邀請函
        let found: Invitation | null = null;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.endsWith(":invitations")) {
            const invitationsJson = localStorage.getItem(key);
            if (invitationsJson) {
              const invitations: Invitation[] = JSON.parse(invitationsJson);
              const invitation = invitations.find(
                (inv) => inv.id === invitationId,
              );
              if (invitation) {
                found = invitation;
                break;
              }
            }
          }
        }

        if (!found) {
          setError("找不到邀請函");
          setIsLoading(false);
          return;
        }

        setInvitation(found);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load invitation:", error);
        setError("載入邀請函時發生錯誤");
        setIsLoading(false);
      }
    };

    loadInvitation();
  }, [invitationId]);

  // 獲取 RSVP 表單配置
  const getRsvpFormElement = (): RsvpFormElement | null => {
    if (!invitation) return null;
    return (
      (invitation.elements.find(
        (el) => el.type === "rsvp-form",
      ) as RsvpFormElement) || null
    );
  };

  // 表單驗證
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const rsvpForm = getRsvpFormElement();

    if (!rsvpForm) return true;

    if (rsvpForm.fields.name && !formData.name.trim()) {
      errors.name = "請輸入姓名";
    }

    if (rsvpForm.fields.email) {
      if (!formData.email.trim()) {
        errors.email = "請輸入電子郵件";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = "電子郵件格式不正確";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 提交 RSVP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await rsvpApi.submit(invitationId, formData);

      if (result.success) {
        setSubmitSuccess(true);
        // 重置表單
        setFormData({
          name: "",
          email: "",
          attendance: "yes",
          message: "",
        });

        // 3秒後隱藏成功訊息
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } else {
        alert("提交失敗");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("提交時發生錯誤");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading 狀態
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-neutral-600">載入中...</p>
        </div>
      </div>
    );
  }

  // Error 狀態
  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center max-w-md">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
            {error || "找不到邀請函"}
          </h2>
          <p className="text-neutral-600">請確認邀請函 ID 是否正確</p>
        </div>
      </div>
    );
  }

  const rsvpForm = getRsvpFormElement();
  const hasRsvpForm = !!rsvpForm;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 標題區域 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">
            {invitation.title}
          </h1>
          <p className="text-neutral-600">誠摯邀請您參加</p>
        </div>

        {/* 邀請函預覽 */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white rounded-lg shadow-xl p-8 inline-block">
            <InvitationCanvas
              elements={invitation.elements}
              canvasSize={invitation.canvasSize}
              showGrid={false}
              scale={1}
            />
          </div>
        </div>

        {/* RSVP 表單 */}
        {hasRsvpForm && (
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6 text-center">
              {rsvpForm.title || "RSVP 回覆"}
            </h2>

            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="font-medium">
                    感謝您的回覆！我們已收到您的 RSVP。
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 姓名 */}
              {rsvpForm.fields.name && (
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-neutral-700 mb-2"
                  >
                    姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      formErrors.name ? "border-red-500" : "border-neutral-300"
                    }`}
                    placeholder="請輸入您的姓名"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.name}
                    </p>
                  )}
                </div>
              )}

              {/* Email */}
              {rsvpForm.fields.email && (
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-neutral-700 mb-2"
                  >
                    電子郵件 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      formErrors.email ? "border-red-500" : "border-neutral-300"
                    }`}
                    placeholder="your@email.com"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.email}
                    </p>
                  )}
                </div>
              )}

              {/* 出席狀態 */}
              {rsvpForm.fields.attendance && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">
                    出席意願 <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 border border-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
                      <input
                        type="radio"
                        name="attendance"
                        value="yes"
                        checked={formData.attendance === "yes"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            attendance: e.target.value as "yes" | "no",
                          })
                        }
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-neutral-900">我會出席</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border border-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
                      <input
                        type="radio"
                        name="attendance"
                        value="no"
                        checked={formData.attendance === "no"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            attendance: e.target.value as "yes" | "no",
                          })
                        }
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-neutral-900">無法出席</span>
                    </label>
                  </div>
                </div>
              )}

              {/* 留言 */}
              {rsvpForm.fields.message && (
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-neutral-700 mb-2"
                  >
                    留言
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="有什麼話想對主辦人說的嗎？"
                  />
                </div>
              )}

              {/* 提交按鈕 */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    提交中...
                  </>
                ) : (
                  <>{rsvpForm.submitButtonText || "送出回覆"}</>
                )}
              </button>
            </form>
          </div>
        )}

        {/* 沒有 RSVP 表單時的訊息 */}
        {!hasRsvpForm && (
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-auto text-center">
            <p className="text-neutral-600">此邀請函目前不接受 RSVP 回覆</p>
          </div>
        )}
      </div>
    </div>
  );
}
