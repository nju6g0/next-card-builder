import type { RestrictedTemplate } from "@/types";

export const weddingRestrictedTemplate: RestrictedTemplate = {
  id: "wedding-animated-restricted",
  name: "Wedding Animated",
  thumbnail: "/templates/wedding-thumb.jpg",
  description: "浪漫婚禮動畫邀請函，帶有優雅的拱門開場動畫",
  isAnimated: true,
  isRestricted: true,
  slug: "party-animated",
  canvasSize: { width: 375, height: 667 },
  elements: [], // 動畫模板不使用 elements，而是使用獨立頁面

  // 可編輯屬性配置
  editableProperties: [
    // 文字內容組
    {
      id: "title-text",
      label: "主標題",
      propertyKey: "titleText",
      type: "text",
      defaultValue: "We're Getting Married!",
      constraints: {
        maxLength: 50,
      },
      group: "文字內容",
    },
    {
      id: "description-text",
      label: "描述文字",
      propertyKey: "descriptionText",
      type: "text",
      defaultValue:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusantium sed qui odit? Ipsa atque nesciunt perspiciatis placeat, doloremque fugit consectetur.",
      constraints: {
        maxLength: 200,
      },
      group: "文字內容",
    },

    // 顏色設定組
    {
      id: "text-color",
      label: "文字顏色",
      propertyKey: "textColor",
      type: "color",
      defaultValue: "#ffffff",
      group: "顏色設定",
    },
    {
      id: "form-bg-color",
      label: "表單背景顏色",
      propertyKey: "formBgColor",
      type: "color",
      defaultValue: "#fffbeb",
      group: "顏色設定",
    },
    {
      id: "form-text-color",
      label: "表單文字顏色",
      propertyKey: "formTextColor",
      type: "color",
      defaultValue: "#134e4a",
      group: "顏色設定",
    },
    {
      id: "button-bg-color",
      label: "按鈕背景顏色",
      propertyKey: "buttonBgColor",
      type: "color",
      defaultValue: "#ffffff",
      group: "顏色設定",
    },
    {
      id: "button-text-color",
      label: "按鈕文字顏色",
      propertyKey: "buttonTextColor",
      type: "color",
      defaultValue: "#134e4a",
      group: "顏色設定",
    },

    // 圖片設定組
    {
      id: "background-image",
      label: "背景圖片 URL",
      propertyKey: "backgroundImage",
      type: "image",
      defaultValue: "https://picsum.photos/800/600",
      constraints: {
        allowedFormats: ["jpg", "jpeg", "png", "webp"],
      },
      group: "圖片設定",
    },
  ],

  // 動畫配置
  animationConfig: {
    type: "wedding",
    duration: 5000,
  },
};
