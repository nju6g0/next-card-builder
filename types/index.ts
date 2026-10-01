// 元件基礎類型
export type ElementType = "text" | "image" | "rsvp-form";

// 基礎元件介面（扁平結構以便拖拉編輯）
export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  locked?: boolean; // 鎖定後無法拖拉或編輯
  visible?: boolean; // 控制顯示/隱藏
}

// 文字元件
export interface TextElement extends BaseElement {
  type: "text";
  content: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  fontWeight: number;
  textAlign?: "left" | "center" | "right";
}

// 圖片元件
export interface ImageElement extends BaseElement {
  type: "image";
  src: string;
  alt: string;
  isBackground: boolean;
  objectFit?: "cover" | "contain" | "fill";
  blur?: number;
}

// RSVP 表單元件
export interface RsvpFormElement extends BaseElement {
  type: "rsvp-form";
  title?: string;
  submitButtonText?: string;
  fields: {
    name: boolean;
    email: boolean;
    attendance: boolean;
    message?: boolean;
  };
}

// 聯合型別
export type Element = TextElement | ImageElement | RsvpFormElement;

// 邀請函資料
export interface Invitation {
  id: string;
  title: string;
  elements: Element[];
  canvasSize: { width: number; height: number };
  createdAt: string;
  updatedAt: string;
  createdBy: string; // user email
  templateId?: string; // 如果從範本建立
}

// RSVP 回覆
export interface RsvpResponse {
  id: string;
  invitationId: string;
  name: string;
  email: string;
  attendance: "yes" | "no";
  submittedAt: string;
}

// 範本
export interface Template {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
  elements: Element[];
  canvasSize: { width: number; height: number };
}

// 畫布尺寸型別
export type CanvasSize = { width: number; height: number };

// 畫布尺寸選項
export const CANVAS_SIZES = {
  mobile: { width: 375, height: 667 }, // iPhone SE
  tablet: { width: 768, height: 1024 }, // iPad
  desktop: { width: 1920, height: 1080 },
} as const;

// API 相關型別
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 邀請函建立資料
export interface CreateInvitationData {
  title: string;
  elements: Element[];
  canvasSize: { width: number; height: number };
  templateId?: string;
}

// RSVP 提交資料
export interface SubmitRsvpData {
  name: string;
  email: string;
  attendance: "yes" | "no";
  message?: string;
}

// RSVP 統計
export interface RsvpStats {
  total: number;
  attending: number;
  notAttending: number;
}
