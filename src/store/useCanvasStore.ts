import { create } from 'zustand';
import { CanvasElement, ToolType, ViewTransform } from '../types/canvas';
import { Collaborator } from '../types/collab';
import { TEMPLATES } from '../data/templates';
import { generateDiagramFromPrompt } from '../engine/aiDiagramEngine';

interface CanvasState {
  elements: CanvasElement[];
  selectedIds: string[];
  activeTool: ToolType;
  viewTransform: ViewTransform;
  gridType: 'dots' | 'lines' | 'none';
  snapToGrid: boolean;

  history: CanvasElement[][];
  historyIndex: number;

  collaborators: Collaborator[];
  isMultiplayerActive: boolean;

  isAiModalOpen: boolean;
  isTemplatesModalOpen: boolean;
  isExportModalOpen: boolean;

  setActiveTool: (tool: ToolType) => void;
  setViewTransform: (transform: Partial<ViewTransform>) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setGridType: (type: 'dots' | 'lines' | 'none') => void;
  toggleSnapToGrid: () => void;

  selectElement: (id: string, multi?: boolean) => void;
  clearSelection: () => void;
  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;

  undo: () => void;
  redo: () => void;
  saveHistory: () => void;

  loadTemplate: (templateId: string) => void;
  generateAiDiagram: (prompt: string) => void;
  clearCanvas: () => void;

  setAiModalOpen: (open: boolean) => void;
  setTemplatesModalOpen: (open: boolean) => void;
  setExportModalOpen: (open: boolean) => void;
  toggleMultiplayer: () => void;
  updateCollaboratorPosition: (id: string, x: number, y: number) => void;
}

const DEFAULT_COLLABORATORS: Collaborator[] = [
  {
    id: 'collab-1',
    name: 'Sophia Chen',
    avatar: '👩‍💻',
    color: '#38bdf8',
    x: 420,
    y: 280,
    status: 'drawing',
    lastActive: Date.now()
  },
  {
    id: 'collab-2',
    name: 'Alex Rivera',
    avatar: '👨‍🚀',
    color: '#a855f7',
    x: 740,
    y: 190,
    status: 'typing',
    lastActive: Date.now()
  }
];

export const useCanvasStore = create<CanvasState>((set, get) => {
  const initialElements = TEMPLATES[0].elements;

  return {
    elements: initialElements,
    selectedIds: [],
    activeTool: 'select',
    viewTransform: { x: 50, y: 50, zoom: 0.95 },
    gridType: 'dots',
    snapToGrid: false,

    history: [initialElements],
    historyIndex: 0,

    collaborators: DEFAULT_COLLABORATORS,
    isMultiplayerActive: true,

    isAiModalOpen: false,
    isTemplatesModalOpen: false,
    isExportModalOpen: false,

    setActiveTool: (tool) => set({ activeTool: tool }),
    setViewTransform: (transform) =>
      set((state) => ({
        viewTransform: { ...state.viewTransform, ...transform },
      })),

    zoomIn: () =>
      set((state) => ({
        viewTransform: {
          ...state.viewTransform,
          zoom: Math.min(3.0, Number((state.viewTransform.zoom + 0.15).toFixed(2))),
        },
      })),

    zoomOut: () =>
      set((state) => ({
        viewTransform: {
          ...state.viewTransform,
          zoom: Math.max(0.2, Number((state.viewTransform.zoom - 0.15).toFixed(2))),
        },
      })),

    resetZoom: () =>
      set((state) => ({
        viewTransform: { ...state.viewTransform, zoom: 1.0, x: 50, y: 50 },
      })),

    setGridType: (type) => set({ gridType: type }),
    toggleSnapToGrid: () => set((state) => ({ snapToGrid: !state.snapToGrid })),

    selectElement: (id, multi = false) => {
      set((state) => ({
        selectedIds: multi
          ? state.selectedIds.includes(id)
            ? state.selectedIds.filter((item) => item !== id)
            : [...state.selectedIds, id]
          : [id],
      }));
    },

    clearSelection: () => set({ selectedIds: [] }),

    saveHistory: () => {
      const { elements, history, historyIndex } = get();
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(elements)));
      set({ history: newHistory, historyIndex: newHistory.length - 1 });
    },

    addElement: (element) => {
      set((state) => ({
        elements: [...state.elements, element],
        selectedIds: [element.id],
      }));
      get().saveHistory();
    },

    updateElement: (id, updates) => {
      set((state) => ({
        elements: state.elements.map((el) => (el.id === id ? { ...el, ...updates } : el)),
      }));
    },

    deleteSelected: () => {
      const { selectedIds } = get();
      if (selectedIds.length === 0) return;
      set((state) => ({
        elements: state.elements.filter((el) => !selectedIds.includes(el.id)),
        selectedIds: [],
      }));
      get().saveHistory();
    },

    duplicateSelected: () => {
      const { elements, selectedIds } = get();
      const toDuplicate = elements.filter((el) => selectedIds.includes(el.id));
      const duplicates = toDuplicate.map((el) => ({
        ...el,
        id: `el-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        x: el.x + 30,
        y: el.y + 30,
      }));
      set((state) => ({
        elements: [...state.elements, ...duplicates],
        selectedIds: duplicates.map((d) => d.id),
      }));
      get().saveHistory();
    },

    undo: () => {
      const { historyIndex, history } = get();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        set({
          elements: JSON.parse(JSON.stringify(history[nextIndex])),
          historyIndex: nextIndex,
          selectedIds: [],
        });
      }
    },

    redo: () => {
      const { historyIndex, history } = get();
      if (historyIndex < history.length - 1) {
        const nextIndex = historyIndex + 1;
        set({
          elements: JSON.parse(JSON.stringify(history[nextIndex])),
          historyIndex: nextIndex,
          selectedIds: [],
        });
      }
    },

    loadTemplate: (templateId) => {
      const t = TEMPLATES.find((x) => x.id === templateId) || TEMPLATES[0];
      set({
        elements: JSON.parse(JSON.stringify(t.elements)),
        selectedIds: [],
        viewTransform: { x: 50, y: 50, zoom: 0.95 },
      });
      get().saveHistory();
    },

    generateAiDiagram: (prompt) => {
      const generated = generateDiagramFromPrompt(prompt);
      set({
        elements: generated,
        selectedIds: [],
        viewTransform: { x: 50, y: 50, zoom: 0.9 },
      });
      get().saveHistory();
    },

    clearCanvas: () => {
      set({ elements: [], selectedIds: [] });
      get().saveHistory();
    },

    setAiModalOpen: (open) => set({ isAiModalOpen: open }),
    setTemplatesModalOpen: (open) => set({ isTemplatesModalOpen: open }),
    setExportModalOpen: (open) => set({ isExportModalOpen: open }),

    toggleMultiplayer: () => set((state) => ({ isMultiplayerActive: !state.isMultiplayerActive })),

    updateCollaboratorPosition: (id, x, y) => {
      set((state) => ({
        collaborators: state.collaborators.map((c) =>
          c.id === id ? { ...c, x, y, lastActive: Date.now() } : c
        ),
      }));
    },
  };
});
