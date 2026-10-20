"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { rsvpApi } from "@/lib/mockApi";

interface FormFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  textColor: string;
  bgColor: string;
}

const FormField = ({
  label,
  type,
  value,
  onChange,
  textColor,
  bgColor,
}: FormFieldProps) => (
  <div className="w-full flex flex-col gap-2">
    <label className="text-sm font-medium" style={{ color: textColor }}>
      {label}
    </label>
    <input
      className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        borderColor: `${textColor}30`,
        border: "1px solid",
      }}
      type={type}
      placeholder=""
      value={value}
      onChange={onChange}
    />
  </div>
);

interface PartyPreviewProps {
  userValues: Record<string, any>;
  isPlaying?: boolean;
  invitationId?: string; // 用於 RSVP 提交
  isPublicView?: boolean; // 是否為公開頁面（訪客檢視）
}

export default function PartyPreview({
  userValues,
  isPlaying = true,
  invitationId,
  isPublicView = false,
}: PartyPreviewProps) {
  const [key, setKey] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    attendance: "yes" as "yes" | "no",
  });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 從 userValues 獲取值
  const welcomeText = userValues.welcomeText || "Welcome";
  const partyText = userValues.partyText || "to the Party!";
  const introTextColor = userValues.introTextColor || "#000000";
  const imageUrl =
    userValues.backgroundImage || "https://picsum.photos/800/600";

  // RSVP 相關設定
  const rsvpTitle = userValues.rsvpTitle || "Join the Party!";
  const rsvpEnabled = userValues.rsvpEnabled !== false; // 預設啟用
  const submitButtonText = userValues.submitButtonText || "Count Me In!";
  const formBgColor = userValues.formBgColor || "rgba(255, 255, 255, 0.95)";
  const formTextColor = userValues.formTextColor || "#1a1a1a";
  const buttonBgColor = userValues.buttonBgColor || "#ff6b6b";
  const buttonTextColor = userValues.buttonTextColor || "#ffffff";

  const handleRSVP = async () => {
    // 如果是預覽模式或沒有 invitationId，只做前端驗證
    if (!isPublicView || !invitationId) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(formData.email)) {
        alert("Please enter a valid email address.");
        return;
      }
      if (formData.name.trim() === "") {
        alert("Please enter your name.");
        return;
      }
      console.log("RSVP submitted (preview mode):", formData);
      setRsvpSubmitted(true);
      return;
    }

    // 公開頁面：真實提交
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(formData.email)) {
      alert("請輸入有效的電子郵件地址");
      return;
    }
    if (formData.name.trim() === "") {
      alert("請輸入您的姓名");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await rsvpApi.submit(invitationId, {
        name: formData.name,
        email: formData.email,
        attendance: formData.attendance,
      });

      if (result.success) {
        setRsvpSubmitted(true);
      } else {
        alert("提交失敗，請稍後再試");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("提交時發生錯誤");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 重新播放動畫
  useEffect(() => {
    if (isPlaying) {
      setAnimationComplete(false);
      setRsvpSubmitted(false);
      setFormData({ email: "", name: "", attendance: "yes" });
      setKey((prev) => prev + 1);
    }
  }, [isPlaying]);

  return (
    <div
      key={key}
      className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center"
    >
      <motion.div
        animate={{ height: 0, opacity: 0 }}
        transition={{ duration: 1, ease: "easeInOut", delay: 2.5 }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -50, scale: 0.8, rotate: 0 }}
          animate={{
            opacity: [0, 1],
            y: [-50, 0],
            scale: [0.8, 1],
            rotate: [0, 15, 0],
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="font-playfair origin-left text-4xl font-bold text-center mb-4"
          style={{ color: introTextColor }}
        >
          {welcomeText}
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{
            opacity: [0, 1],
            y: [20, 0],
            scale: [0.8, 1],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 1, delay: 1, ease: "easeInOut" }}
          className="font-playfair text-4xl font-bold text-center mb-4"
          style={{ color: introTextColor }}
        >
          {partyText}
        </motion.h1>
      </motion.div>
      <motion.div
        className="w-full h-full overflow-hidden bg-black backdrop:blur-md bg-cover bg-center bg-no-repeat flex items-center justify-center"
        initial={{ width: 80, height: 80, opacity: 0.5, borderRadius: "50%" }}
        style={{ backgroundImage: `url('${imageUrl}')` }}
        animate={{
          width: [80, "100%"],
          height: [80, "100%"],
          opacity: 1,
          borderRadius: "0%",
        }}
        transition={{
          duration: 1,
          delay: 3,
          ease: "easeInOut",
          width: { delay: 3.5, duration: 1 },
          height: { delay: 4, duration: 1 },
        }}
        onAnimationComplete={() => setAnimationComplete(true)}
      >
        {/* RSVP 表單 - 動畫完成後顯示 */}
        {animationComplete && rsvpEnabled && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-md mx-4"
          >
            {rsvpSubmitted ? (
              <div
                className="flex flex-col items-center gap-4 p-8 rounded-2xl shadow-2xl backdrop-blur-md"
                style={{ backgroundColor: formBgColor }}
              >
                <div className="text-6xl animate-bounce">🎉</div>
                <h3
                  className="text-2xl font-bold text-center"
                  style={{ color: formTextColor }}
                >
                  Awesome, {formData.name}!
                </h3>
                <p
                  className="text-center"
                  style={{ color: `${formTextColor}99` }}
                >
                  {formData.attendance === "yes"
                    ? "Can't wait to party with you!"
                    : "Thanks for letting us know!"}
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col items-center gap-4 p-8 rounded-2xl shadow-2xl backdrop-blur-md"
                style={{ backgroundColor: formBgColor }}
              >
                <h3
                  className="text-2xl font-bold text-center mb-2"
                  style={{ color: formTextColor }}
                >
                  {rsvpTitle}
                </h3>
                <FormField
                  label="Your Name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  textColor={formTextColor}
                  bgColor="rgba(255, 255, 255, 0.5)"
                />
                <FormField
                  label="Your Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  textColor={formTextColor}
                  bgColor="rgba(255, 255, 255, 0.5)"
                />
                <div className="w-full flex flex-col gap-2">
                  <label
                    className="text-sm font-medium"
                    style={{ color: formTextColor }}
                  >
                    Will you join us?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
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
                        className="w-4 h-4"
                        style={{ accentColor: buttonBgColor }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: formTextColor }}
                      >
                        Yes! 🎉
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
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
                        className="w-4 h-4"
                        style={{ accentColor: buttonBgColor }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: formTextColor }}
                      >
                        Sorry, can't make it 😢
                      </span>
                    </label>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full px-6 py-3 rounded-full font-bold text-lg hover:opacity-90 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: buttonBgColor,
                    color: buttonTextColor,
                  }}
                  onClick={handleRSVP}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                      Submitting...
                    </>
                  ) : (
                    submitButtonText
                  )}
                </button>
              </form>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
