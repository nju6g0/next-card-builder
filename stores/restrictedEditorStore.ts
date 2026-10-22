import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { RestrictedTemplate } from "@/types";

// 受限編輯器狀態型別
interface RestrictedEditorState {
  // 當前模板
  template: RestrictedTemplate | null;

  // 使用者自訂值 (propertyKey: value)
  userValues: Record<string, string | number | boolean>;

  // 預覽狀態
  isPreviewMode: boolean;
  isAnimationPlaying: boolean;

  // UI 狀態
  isSaving: boolean;
  hasUnsavedChanges: boolean;

  // Actions
  setTemplate: (template: RestrictedTemplate) => void;
  setValue: (propertyKey: string, value: string | number | boolean) => void;
  setValues: (values: Record<string, string | number | boolean>) => void;
  getValue: (propertyKey: string) => string | number | boolean | undefined;
  resetToDefaults: () => void;

  // 預覽控制
  setPreviewMode: (isPreview: boolean) => void;
  togglePreviewMode: () => void;
  playAnimation: () => void;
  pauseAnimation: () => void;
  restartAnimation: () => void;

  // 儲存狀態
  setIsSaving: (isSaving: boolean) => void;
  markAsChanged: () => void;
  markAsSaved: () => void;

  // 重置
  reset: () => void;
}

// 初始狀態
const initialState = {
  template: null,
  userValues: {},
  isPreviewMode: false,
  isAnimationPlaying: true,
  isSaving: false,
  hasUnsavedChanges: false,
};

export const useRestrictedEditorStore = create<RestrictedEditorState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // 設定模板
      setTemplate: (template) => {
        // 從模板的可編輯屬性中提取預設值
        const defaultValues: Record<string, string | number | boolean> = {};
        template.editableProperties.forEach((prop) => {
          defaultValues[prop.propertyKey] = prop.defaultValue;
        });

        set({
          template,
          userValues: defaultValues,
          hasUnsavedChanges: false,
        });
      },

      // 設定單一值
      setValue: (propertyKey, value) => {
        set((state) => ({
          userValues: {
            ...state.userValues,
            [propertyKey]: value,
          },
          hasUnsavedChanges: true,
        }));
      },

      // 批次設定值
      setValues: (values) => {
        set((state) => ({
          userValues: {
            ...state.userValues,
            ...values,
          },
          hasUnsavedChanges: true,
        }));
      },

      // 獲取值（如果沒有使用者自訂值，返回預設值）
      getValue: (propertyKey) => {
        const state = get();
        if (state.userValues[propertyKey] !== undefined) {
          return state.userValues[propertyKey];
        }

        // 從模板中找到對應的預設值
        const property = state.template?.editableProperties.find(
          (prop) => prop.propertyKey === propertyKey,
        );
        return property?.defaultValue;
      },

      // 重置為預設值
      resetToDefaults: () => {
        const state = get();
        if (!state.template) return;

        const defaultValues: Record<string, string | number | boolean> = {};
        state.template.editableProperties.forEach((prop) => {
          defaultValues[prop.propertyKey] = prop.defaultValue;
        });

        set({
          userValues: defaultValues,
          hasUnsavedChanges: true,
        });
      },

      // 預覽控制
      setPreviewMode: (isPreview) => {
        set({ isPreviewMode: isPreview });
      },

      togglePreviewMode: () => {
        set((state) => ({ isPreviewMode: !state.isPreviewMode }));
      },

      playAnimation: () => {
        set({ isAnimationPlaying: true });
      },

      pauseAnimation: () => {
        set({ isAnimationPlaying: false });
      },

      restartAnimation: () => {
        // 先暫停再播放以觸發重新開始
        set({ isAnimationPlaying: false });
        setTimeout(() => {
          set({ isAnimationPlaying: true });
        }, 50);
      },

      // 儲存狀態
      setIsSaving: (isSaving) => {
        set({ isSaving });
      },

      markAsChanged: () => {
        set({ hasUnsavedChanges: true });
      },

      markAsSaved: () => {
        set({ hasUnsavedChanges: false });
      },

      // 重置
      reset: () => {
        set(initialState);
      },
    }),
    { name: "RestrictedEditorStore" },
  ),
);

// 便利的 Hooks
export const useTemplate = () =>
  useRestrictedEditorStore((state) => state.template);
export const useUserValues = () =>
  useRestrictedEditorStore((state) => state.userValues);
export const usePreviewMode = () =>
  useRestrictedEditorStore((state) => state.isPreviewMode);
export const useHasUnsavedChanges = () =>
  useRestrictedEditorStore((state) => state.hasUnsavedChanges);
