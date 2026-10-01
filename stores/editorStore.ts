import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  BaseElement,
  TextElement,
  ImageElement,
  RsvpFormElement,
  CanvasSize,
} from "@/types";

// Editor 狀態型別
interface EditorState {
  // 畫布設定
  canvasSize: CanvasSize;
  showGrid: boolean;

  // 元件管理
  elements: BaseElement[];
  selectedElementId: string | null;
  editingElementId: string | null;

  // 歷史記錄 (Undo/Redo)
  history: BaseElement[][];
  historyIndex: number;
  maxHistory: number;

  // 複製/貼上
  clipboard: BaseElement | null;

  // UI 狀態
  isDragging: boolean;
  isResizing: boolean;

  // Actions
  setCanvasSize: (size: CanvasSize) => void;
  toggleGrid: () => void;

  // 元件 CRUD
  addElement: (element: BaseElement) => void;
  updateElement: (
    id: string,
    updates:
      | Partial<BaseElement>
      | Partial<TextElement>
      | Partial<ImageElement>
      | Partial<RsvpFormElement>,
  ) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;

  // 選取管理
  selectElement: (id: string | null) => void;
  getSelectedElement: () => BaseElement | null;

  // 編輯管理
  setEditingElement: (id: string | null) => void;

  // 圖層管理
  moveElementUp: (id: string) => void;
  moveElementDown: (id: string) => void;
  moveElementToTop: (id: string) => void;
  moveElementToBottom: (id: string) => void;
  updateZIndex: (id: string, zIndex: number) => void;

  // 批次操作
  setElements: (elements: BaseElement[]) => void;
  clearElements: () => void;

  // 複製/貼上
  copyElement: (id: string) => void;
  pasteElement: () => void;

  // 歷史記錄
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  saveHistory: () => void;

  // 拖拉狀態
  setIsDragging: (isDragging: boolean) => void;
  setIsResizing: (isResizing: boolean) => void;

  // 重置
  reset: () => void;
  resetEditor: () => void;
}

// 初始狀態
const initialState = {
  canvasSize: { width: 375, height: 667 },
  showGrid: true,
  elements: [],
  selectedElementId: null,
  editingElementId: null,
  history: [[]],
  historyIndex: 0,
  maxHistory: 50,
  clipboard: null,
  isDragging: false,
  isResizing: false,
};

// 生成唯一 ID
const generateId = () =>
  `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// 深拷貝元件
const cloneElement = (element: BaseElement): BaseElement => {
  return JSON.parse(JSON.stringify(element));
};

export const useEditorStore = create<EditorState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // 畫布設定
      setCanvasSize: (size) => {
        set({ canvasSize: size });
      },

      toggleGrid: () => {
        set((state) => ({ showGrid: !state.showGrid }));
      },

      // 元件 CRUD
      addElement: (element) => {
        set((state) => {
          // 計算新元件的 zIndex（最高層）
          const maxZIndex =
            state.elements.length > 0
              ? Math.max(...state.elements.map((e) => e.zIndex))
              : 0;

          const newElement = {
            ...element,
            id: element.id || generateId(),
            zIndex: maxZIndex + 1,
          };

          const newElements = [...state.elements, newElement];

          // 儲存歷史記錄
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(newElements.map(cloneElement));

          return {
            elements: newElements,
            selectedElementId: newElement.id,
            history: newHistory.slice(-state.maxHistory),
            historyIndex: Math.min(newHistory.length - 1, state.maxHistory - 1),
          };
        });
      },

      updateElement: (id, updates) => {
        set((state) => {
          const newElements = state.elements.map((el) =>
            el.id === id ? ({ ...el, ...updates } as BaseElement) : el,
          );

          return {
            elements: newElements,
          };
        });
      },

      deleteElement: (id) => {
        set((state) => {
          const newElements = state.elements.filter((el) => el.id !== id);

          // 儲存歷史記錄
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(newElements.map(cloneElement));

          return {
            elements: newElements,
            selectedElementId:
              state.selectedElementId === id ? null : state.selectedElementId,
            history: newHistory.slice(-state.maxHistory),
            historyIndex: Math.min(newHistory.length - 1, state.maxHistory - 1),
          };
        });
      },

      duplicateElement: (id) => {
        set((state) => {
          const element = state.elements.find((el) => el.id === id);
          if (!element) return state;

          const maxZIndex = Math.max(...state.elements.map((e) => e.zIndex));

          const newElement: BaseElement = {
            ...cloneElement(element),
            id: generateId(),
            x: element.x + 20,
            y: element.y + 20,
            zIndex: maxZIndex + 1,
          };

          const newElements = [...state.elements, newElement];

          // 儲存歷史記錄
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(newElements.map(cloneElement));

          return {
            elements: newElements,
            selectedElementId: newElement.id,
            history: newHistory.slice(-state.maxHistory),
            historyIndex: Math.min(newHistory.length - 1, state.maxHistory - 1),
          };
        });
      },

      // 選取管理
      selectElement: (id) => {
        set({ selectedElementId: id });
      },

      getSelectedElement: () => {
        const state = get();
        return (
          state.elements.find((el) => el.id === state.selectedElementId) || null
        );
      },

      // 編輯管理
      setEditingElement: (id) => {
        set({ editingElementId: id });
      },

      // 圖層管理
      moveElementUp: (id) => {
        set((state) => {
          const element = state.elements.find((el) => el.id === id);
          if (!element) return state;

          const elementsAbove = state.elements.filter(
            (el) => el.zIndex > element.zIndex,
          );
          if (elementsAbove.length === 0) return state;

          const nextElement = elementsAbove.reduce((prev, curr) =>
            curr.zIndex < prev.zIndex ? curr : prev,
          );

          const newElements = state.elements.map((el) => {
            if (el.id === id) return { ...el, zIndex: nextElement.zIndex };
            if (el.id === nextElement.id)
              return { ...el, zIndex: element.zIndex };
            return el;
          });

          return { elements: newElements };
        });
      },

      moveElementDown: (id) => {
        set((state) => {
          const element = state.elements.find((el) => el.id === id);
          if (!element) return state;

          const elementsBelow = state.elements.filter(
            (el) => el.zIndex < element.zIndex,
          );
          if (elementsBelow.length === 0) return state;

          const prevElement = elementsBelow.reduce((prev, curr) =>
            curr.zIndex > prev.zIndex ? curr : prev,
          );

          const newElements = state.elements.map((el) => {
            if (el.id === id) return { ...el, zIndex: prevElement.zIndex };
            if (el.id === prevElement.id)
              return { ...el, zIndex: element.zIndex };
            return el;
          });

          return { elements: newElements };
        });
      },

      moveElementToTop: (id) => {
        set((state) => {
          const maxZIndex = Math.max(...state.elements.map((e) => e.zIndex));
          const newElements = state.elements.map((el) =>
            el.id === id ? { ...el, zIndex: maxZIndex + 1 } : el,
          );
          return { elements: newElements };
        });
      },

      moveElementToBottom: (id) => {
        set((state) => {
          const minZIndex = Math.min(...state.elements.map((e) => e.zIndex));
          const newElements = state.elements.map((el) =>
            el.id === id ? { ...el, zIndex: minZIndex - 1 } : el,
          );
          return { elements: newElements };
        });
      },

      updateZIndex: (id, zIndex) => {
        set((state) => {
          const newElements = state.elements.map((el) =>
            el.id === id ? { ...el, zIndex } : el,
          );
          return { elements: newElements };
        });
      },

      // 批次操作
      setElements: (elements) => {
        set({ elements, selectedElementId: null });
      },

      clearElements: () => {
        set((state) => {
          // 儲存歷史記錄
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push([]);

          return {
            elements: [],
            selectedElementId: null,
            history: newHistory.slice(-state.maxHistory),
            historyIndex: Math.min(newHistory.length - 1, state.maxHistory - 1),
          };
        });
      },

      // 複製/貼上
      copyElement: (id) => {
        set((state) => {
          const element = state.elements.find((el) => el.id === id);
          if (!element) return state;
          return { clipboard: cloneElement(element) };
        });
      },

      pasteElement: () => {
        set((state) => {
          if (!state.clipboard) return state;

          const maxZIndex =
            state.elements.length > 0
              ? Math.max(...state.elements.map((e) => e.zIndex))
              : 0;

          const newElement: BaseElement = {
            ...cloneElement(state.clipboard),
            id: generateId(),
            x: state.clipboard.x + 20,
            y: state.clipboard.y + 20,
            zIndex: maxZIndex + 1,
          };

          const newElements = [...state.elements, newElement];

          // 儲存歷史記錄
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(newElements.map(cloneElement));

          return {
            elements: newElements,
            selectedElementId: newElement.id,
            history: newHistory.slice(-state.maxHistory),
            historyIndex: Math.min(newHistory.length - 1, state.maxHistory - 1),
          };
        });
      },

      // 歷史記錄
      undo: () => {
        set((state) => {
          if (state.historyIndex <= 0) return state;

          const newIndex = state.historyIndex - 1;
          const elements = state.history[newIndex].map(cloneElement);

          return {
            elements,
            historyIndex: newIndex,
            selectedElementId: null,
          };
        });
      },

      redo: () => {
        set((state) => {
          if (state.historyIndex >= state.history.length - 1) return state;

          const newIndex = state.historyIndex + 1;
          const elements = state.history[newIndex].map(cloneElement);

          return {
            elements,
            historyIndex: newIndex,
            selectedElementId: null,
          };
        });
      },

      canUndo: () => {
        const state = get();
        return state.historyIndex > 0;
      },

      canRedo: () => {
        const state = get();
        return state.historyIndex < state.history.length - 1;
      },

      saveHistory: () => {
        set((state) => {
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(state.elements.map(cloneElement));

          return {
            history: newHistory.slice(-state.maxHistory),
            historyIndex: Math.min(newHistory.length - 1, state.maxHistory - 1),
          };
        });
      },

      // 拖拉狀態
      setIsDragging: (isDragging) => {
        set({ isDragging });
      },

      setIsResizing: (isResizing) => {
        set({ isResizing });
      },

      // 重置
      reset: () => {
        set(initialState);
      },

      // 重置編輯器（別名）
      resetEditor: () => {
        set(initialState);
      },
    }),
    { name: "EditorStore" },
  ),
);

// 便利的 Hooks
export const useElements = () => useEditorStore((state) => state.elements);
export const useSelectedElement = () => {
  const selectedElementId = useEditorStore((state) => state.selectedElementId);
  const elements = useEditorStore((state) => state.elements);
  return elements.find((el) => el.id === selectedElementId) || null;
};
export const useCanvasSize = () => useEditorStore((state) => state.canvasSize);
export const useShowGrid = () => useEditorStore((state) => state.showGrid);
