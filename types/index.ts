// 元件基礎類型
export type ElementType =
  | "text"
  | "image"
  | "rsvp-form"
  | "animated-text-wedding"
  | "animated-text-party";

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

// Wedding 風格動畫文字元件
export interface AnimatedTextWeddingElement extends BaseElement {
  type: "animated-text-wedding";
  content: string;
  fontSize: number;
  color: string;
  fontFamily: string;
  fontWeight: number;
  animationDelay: number; // 動畫開始延遲（秒）
}

// Party 風格動畫文字元件
export interface AnimatedTextPartyElement extends BaseElement {
  type: "animated-text-party";
  content: string;
  fontSize: number;
  color: string;
  fontFamily: string;
  fontWeight: number;
  animationDelay: number; // 動畫開始延遲（秒）
  charStaggerDelay: number; // 每個字符的延遲間隔（秒）
}

// 聯合型別
export type Element =
  | TextElement
  | ImageElement
  | RsvpFormElement
  | AnimatedTextWeddingElement
  | AnimatedTextPartyElement;

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
  isRestricted?: boolean; // 標記為受限編輯（來自受限模板）
  restrictedTemplateId?: string; // 來源受限模板 ID
  userValues?: Record<string, string | number | boolean>; // 使用者自訂值 (propertyKey: value)
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

// 可編輯屬性定義
export interface EditableProperty {
  id: string; // 屬性唯一 ID
  label: string; // 使用者介面顯示名稱
  propertyKey: string; // 對應到模板中的屬性 key
  type: "text" | "color" | "image" | "number";
  defaultValue: string | number | boolean;
  constraints?: {
    minLength?: number;
    maxLength?: number;
    allowedFormats?: string[]; // 圖片格式
    min?: number; // 數字最小值
    max?: number; // 數字最大值
  };
  group?: string; // 分組，例如 "文字內容"、"顏色設定"
}

// 範本
export interface Template {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
  elements: Element[];
  canvasSize: { width: number; height: number };
  isAnimated?: boolean; // 標識是否為動畫範本（獨立頁面）
  slug?: string; // 動畫範本的路由 slug
}

// 受限編輯範本（僅允許編輯特定屬性）
export interface RestrictedTemplate extends Template {
  isRestricted: true; // 標記為受限編輯模板
  editableProperties: EditableProperty[]; // 可編輯的屬性列表
  animationConfig?: {
    // 動畫設定（不可編輯）
    type: "wedding" | "party";
    duration?: number;
  };
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
  isRestricted?: boolean;
  restrictedTemplateId?: string;
  userValues?: Record<string, string | number | boolean>;
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
