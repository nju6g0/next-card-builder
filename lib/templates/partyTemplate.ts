import type { RestrictedTemplate } from "@/types";

export const partyRestrictedTemplate: RestrictedTemplate = {
  id: "party-animated-restricted",
  name: "Party Animated",
  thumbnail: "/templates/party-thumb.jpg",
  description: "活潑派對動畫邀請函，帶有趣味的文字動畫效果",
  isAnimated: true,
  isRestricted: true,
  slug: "party-animated",
  canvasSize: { width: 375, height: 667 },
  elements: [], // 動畫模板不使用 elements，而是使用獨立頁面

  // 可編輯屬性配置
  editableProperties: [
    // 文字內容組
    {
      id: "welcome-text",
      label: "歡迎文字（第一行）",
      propertyKey: "welcomeText",
      type: "text",
      defaultValue: "Welcome",
      constraints: {
        maxLength: 30,
      },
      group: "文字內容",
    },
    {
      id: "party-text",
      label: "派對文字（第二行）",
      propertyKey: "partyText",
      type: "text",
      defaultValue: "to the Party!",
      constraints: {
        maxLength: 30,
      },
      group: "文字內容",
    },

    // RSVP 設定組
    {
      id: "rsvp-title",
      label: "RSVP 標題",
      propertyKey: "rsvpTitle",
      type: "text",
      defaultValue: "Join the Party!",
      constraints: {
        maxLength: 30,
      },
      group: "RSVP 設定",
    },
    {
      id: "submit-button-text",
      label: "提交按鈕文字",
      propertyKey: "submitButtonText",
      type: "text",
      defaultValue: "Count Me In!",
      constraints: {
        maxLength: 20,
      },
      group: "RSVP 設定",
    },

    // 顏色設定組
    {
      id: "intro-text-color",
      label: "開場文字顏色",
      propertyKey: "introTextColor",
      type: "color",
      defaultValue: "#ffffff",
      group: "顏色設定",
    },
    {
      id: "form-bg-color",
      label: "表單背景顏色",
      propertyKey: "formBgColor",
      type: "color",
      defaultValue: "rgba(255, 255, 255, 0.95)",
      group: "顏色設定",
    },
    {
      id: "form-text-color",
      label: "表單文字顏色",
      propertyKey: "formTextColor",
      type: "color",
      defaultValue: "#1a1a1a",
      group: "顏色設定",
    },
    {
      id: "button-bg-color",
      label: "按鈕背景顏色",
      propertyKey: "buttonBgColor",
      type: "color",
      defaultValue: "#ff6b6b",
      group: "顏色設定",
    },
    {
      id: "button-text-color",
      label: "按鈕文字顏色",
      propertyKey: "buttonTextColor",
      type: "color",
      defaultValue: "#ffffff",
      group: "顏色設定",
    },

    // 圖片設定組
    {
      id: "background-image",
      label: "背景圖片 URL",
      propertyKey: "backgroundImage",
      type: "image",
      defaultValue:
        "https://fastly.picsum.photos/id/696/4310/2864.jpg?hmac=jwUqQi3SVy1U14f8Ku4wwrF-VEifNP0FQkk7WIUqkw8",
      constraints: {
        allowedFormats: ["jpg", "jpeg", "png", "webp"],
      },
      group: "圖片設定",
    },
  ],

  // 動畫配置
  animationConfig: {
    type: "party",
    duration: 5000,
  },
};
