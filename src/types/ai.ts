export interface AiDiagramPrompt {
  prompt: string;
  style: 'cyber' | 'minimal' | 'colorful' | 'glass';
  category: 'architecture' | 'flowchart' | 'mindmap' | 'erd' | 'retrospective';
}
