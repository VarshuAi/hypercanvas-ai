import React from 'react';
import { InfiniteCanvas } from './components/canvas/InfiniteCanvas';
import { TopBar } from './components/layout/TopBar';
import { ToolDock } from './components/tools/ToolDock';
import { PropertyInspector } from './components/properties/PropertyInspector';
import { AiPromptModal } from './components/ai/AiPromptModal';
import { TemplatesModal } from './components/templates/TemplatesModal';
import { ExportModal } from './components/export/ExportModal';
import { MultiplayerModal } from './components/collab/MultiplayerModal';
import { KeyboardShortcutsModal } from './components/layout/KeyboardShortcutsModal';

export function App() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#070a13] select-none font-sans">
      <TopBar />
      <InfiniteCanvas />
      <ToolDock />
      <PropertyInspector />
      <AiPromptModal />
      <TemplatesModal />
      <ExportModal />
      <MultiplayerModal />
      <KeyboardShortcutsModal />
    </div>
  );
}

export default App;
