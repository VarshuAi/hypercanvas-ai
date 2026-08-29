import { create } from 'zustand';
import { 
  CanvasElement, 
  ToolType, 
  ViewTransform, 
  SelectionBox, 
  ResizeState,
  AnchorPosition
} from '../types/canvas';
import { PeerUser, MultiplayerState } from '../types/collab';
import { TEMPLATES } from '../data/templates';
import { generateDiagramFromPrompt } from '../engine/aiDiagramEngine';

interface CanvasState {
  boardTitle: string;
  setBoardTitle: (title: string) => void;

  elements: CanvasElement[];
  selectedIds: string[];
  activeTool: ToolType;
  viewTransform: ViewTransform;
  gridType: 'dots' | 'grid' | 'blueprint' | 'none';
  snapToGrid: boolean;

  selectionBox: SelectionBox | null;
  setSelectionBox: (box: SelectionBox | null) => void;

  connectingFrom: { elementId: string; anchor: AnchorPosition } | null;
  setConnectingFrom: (conn: { elementId: string; anchor: AnchorPosition } | null) => void;

  resizingState: ResizeState | null;
  setResizingState: (state: ResizeState | null) => void;

  history: CanvasElement[][];
  historyIndex: number;

  multiplayer: MultiplayerState;
  connectCustomWs: (serverUrl: string, roomId: string, userName: string) => void;
  disconnectMultiplayer: () => void;
  updateLocalCursor: (x: number, y: number) => void;
  updatePeerCursor: (id: string, x: number, y: number) => void;

  isAiModalOpen: boolean;
  isTemplatesModalOpen: boolean;
  isExportModalOpen: boolean;
  isMultiplayerModalOpen: boolean;
  isKeyboardShortcutsOpen: boolean;

  setActiveTool: (tool: ToolType) => void;
  setViewTransform: (transform: Partial<ViewTransform>) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setZoomPercent: (pct: number) => void;
  setGridType: (type: 'dots' | 'grid' | 'blueprint' | 'none') => void;
  toggleSnapToGrid: () => void;

  selectElement: (id: string, multi?: boolean) => void;
  selectMultiple: (ids: string[]) => void;
  clearSelection: () => void;
  selectAll: () => void;

  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  updateSelectedElements: (updates: Partial<CanvasElement>) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;

  alignSelected: (type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  distributeSelected: (axis: 'horizontal' | 'vertical') => void;
  bringToFront: () => void;
  sendToBack: () => void;

  undo: () => void;
  redo: () => void;
  saveHistory: () => void;

  loadTemplate: (templateId: string) => void;
  generateAiDiagram: (prompt: string) => void;
  clearCanvas: () => void;

  setAiModalOpen: (open: boolean) => void;
  setTemplatesModalOpen: (open: boolean) => void;
  setExportModalOpen: (open: boolean) => void;
  setMultiplayerModalOpen: (open: boolean) => void;
  setKeyboardShortcutsOpen: (open: boolean) => void;
}

const DEFAULT_PEERS: PeerUser[] = [
  {
    id: 'peer-1',
    name: 'Sophia Chen',
    initials: 'SC',
    color: '#06b6d4',
    x: 480,
    y: 260,
    status: 'editing',
    lastPing: Date.now()
  },
  {
    id: 'peer-2',
    name: 'Alex Rivera',
    initials: 'AR',
    color: '#8b5cf6',
    x: 820,
    y: 220,
    status: 'moving',
    lastPing: Date.now()
  },
  {
    id: 'peer-3',
    name: 'Marcus Vance',
    initials: 'MV',
    color: '#10b981',
    x: 320,
    y: 420,
    status: 'idle',
    lastPing: Date.now()
  }
];

export const useCanvasStore = create<CanvasState>((set, get) => {
  const initialElements = TEMPLATES[0].elements;

  return {
    boardTitle: 'Cloud Microservices & Distributed Architecture',
    setBoardTitle: (title) => set({ boardTitle: title }),

    elements: initialElements,
    selectedIds: [],
    activeTool: 'select',
    viewTransform: { x: 60, y: 60, zoom: 0.9 },
    gridType: 'dots',
    snapToGrid: true,

    selectionBox: null,
    setSelectionBox: (box) => set({ selectionBox: box }),

    connectingFrom: null,
    setConnectingFrom: (conn) => set({ connectingFrom: conn }),

    resizingState: null,
    setResizingState: (state) => set({ resizingState: state }),

    history: [initialElements],
    historyIndex: 0,

    multiplayer: {
      mode: 'simulated',
      isConnected: true,
      serverUrl: 'wss://realtime.hypercanvas.internal/v1',
      roomId: 'room-prod-architecture-99',
      userName: 'Varshan (You)',
      userColor: '#6366f1',
      latencyMs: 18,
      peers: DEFAULT_PEERS
    },

    connectCustomWs: (serverUrl, roomId, userName) => {
      set((state) => ({
        multiplayer: {
          ...state.multiplayer,
          mode: 'custom_ws',
          isConnected: true,
          serverUrl,
          roomId,
          userName,
          latencyMs: 24
        }
      }));
    },

    disconnectMultiplayer: () => {
      set((state) => ({
        multiplayer: {
          ...state.multiplayer,
          isConnected: false,
          mode: 'simulated'
        }
      }));
    },

    updateLocalCursor: (x, y) => {},

    updatePeerCursor: (id, x, y) => {
      set((state) => ({
        multiplayer: {
          ...state.multiplayer,
          peers: state.multiplayer.peers.map(p => p.id === id ? { ...p, x, y, lastPing: Date.now() } : p)
        }
      }));
    },

    isAiModalOpen: false,
    isTemplatesModalOpen: false,
    isExportModalOpen: false,
    isMultiplayerModalOpen: false,
    isKeyboardShortcutsOpen: false,

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
        viewTransform: { ...state.viewTransform, zoom: 1.0, x: 60, y: 60 },
      })),

    setZoomPercent: (pct) =>
      set((state) => ({
        viewTransform: { ...state.viewTransform, zoom: pct / 100 },
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

    selectMultiple: (ids) => set({ selectedIds: ids }),
    clearSelection: () => set({ selectedIds: [] }),
    selectAll: () => set((state) => ({ selectedIds: state.elements.map(e => e.id) })),

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

    updateSelectedElements: (updates) => {
      const { selectedIds } = get();
      set((state) => ({
        elements: state.elements.map((el) => selectedIds.includes(el.id) ? { ...el, ...updates } : el)
      }));
    },

    deleteSelected: () => {
      const { selectedIds } = get();
      if (selectedIds.length === 0) return;
      set((state) => ({
        elements: state.elements.filter((el) => !selectedIds.includes(el.id) && el.fromId !== el.id && el.toId !== el.id),
        selectedIds: [],
      }));
      get().saveHistory();
    },

    duplicateSelected: () => {
      const { elements, selectedIds } = get();
      const toDuplicate = elements.filter((el) => selectedIds.includes(el.id));
      const duplicates = toDuplicate.map((el) => ({
        ...el,
        id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        x: el.x + 40,
        y: el.y + 40,
      }));
      set((state) => ({
        elements: [...state.elements, ...duplicates],
        selectedIds: duplicates.map((d) => d.id),
      }));
      get().saveHistory();
    },

    alignSelected: (type) => {
      const { elements, selectedIds } = get();
      if (selectedIds.length < 2) return;
      const selected = elements.filter(el => selectedIds.includes(el.id));

      let targetVal = 0;
      if (type === 'left') targetVal = Math.min(...selected.map(e => e.x));
      if (type === 'right') targetVal = Math.max(...selected.map(e => e.x + e.width));
      if (type === 'top') targetVal = Math.min(...selected.map(e => e.y));
      if (type === 'bottom') targetVal = Math.max(...selected.map(e => e.y + e.height));
      if (type === 'center') {
        const minX = Math.min(...selected.map(e => e.x));
        const maxX = Math.max(...selected.map(e => e.x + e.width));
        targetVal = (minX + maxX) / 2;
      }
      if (type === 'middle') {
        const minY = Math.min(...selected.map(e => e.y));
        const maxY = Math.max(...selected.map(e => e.y + e.height));
        targetVal = (minY + maxY) / 2;
      }

      set((state) => ({
        elements: state.elements.map(el => {
          if (!selectedIds.includes(el.id)) return el;
          if (type === 'left') return { ...el, x: targetVal };
          if (type === 'right') return { ...el, x: targetVal - el.width };
          if (type === 'top') return { ...el, y: targetVal };
          if (type === 'bottom') return { ...el, y: targetVal - el.height };
          if (type === 'center') return { ...el, x: Math.round(targetVal - el.width / 2) };
          if (type === 'middle') return { ...el, y: Math.round(targetVal - el.height / 2) };
          return el;
        })
      }));
      get().saveHistory();
    },

    distributeSelected: (axis) => {
      const { elements, selectedIds } = get();
      if (selectedIds.length < 3) return;
      const selected = elements.filter(el => selectedIds.includes(el.id));

      if (axis === 'horizontal') {
        const sorted = [...selected].sort((a, b) => a.x - b.x);
        const minX = sorted[0].x;
        const maxX = sorted[sorted.length - 1].x;
        const totalGap = (maxX - minX) / (sorted.length - 1);
        set((state) => ({
          elements: state.elements.map(el => {
            const idx = sorted.findIndex(s => s.id === el.id);
            if (idx === -1) return el;
            return { ...el, x: Math.round(minX + idx * totalGap) };
          })
        }));
      } else {
        const sorted = [...selected].sort((a, b) => a.y - b.y);
        const minY = sorted[0].y;
        const maxY = sorted[sorted.length - 1].y;
        const totalGap = (maxY - minY) / (sorted.length - 1);
        set((state) => ({
          elements: state.elements.map(el => {
            const idx = sorted.findIndex(s => s.id === el.id);
            if (idx === -1) return el;
            return { ...el, y: Math.round(minY + idx * totalGap) };
          })
        }));
      }
      get().saveHistory();
    },

    bringToFront: () => {
      const { elements, selectedIds } = get();
      const nonSelected = elements.filter(el => !selectedIds.includes(el.id));
      const selected = elements.filter(el => selectedIds.includes(el.id));
      set({ elements: [...nonSelected, ...selected] });
      get().saveHistory();
    },

    sendToBack: () => {
      const { elements, selectedIds } = get();
      const nonSelected = elements.filter(el => !selectedIds.includes(el.id));
      const selected = elements.filter(el => selectedIds.includes(el.id));
      set({ elements: [...selected, ...nonSelected] });
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
        boardTitle: t.title,
        elements: JSON.parse(JSON.stringify(t.elements)),
        selectedIds: [],
        viewTransform: { x: 60, y: 60, zoom: 0.9 },
      });
      get().saveHistory();
    },

    generateAiDiagram: (prompt) => {
      const generated = generateDiagramFromPrompt(prompt);
      set({
        boardTitle: prompt.length > 50 ? prompt.slice(0, 50) + '...' : prompt,
        elements: generated,
        selectedIds: [],
        viewTransform: { x: 60, y: 60, zoom: 0.85 },
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
    setMultiplayerModalOpen: (open) => set({ isMultiplayerModalOpen: open }),
    setKeyboardShortcutsOpen: (open) => set({ isKeyboardShortcutsOpen: open }),
  };
});
