export interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  color: string;
  x: number;
  y: number;
  activeElementId?: string;
  status: 'idle' | 'drawing' | 'typing' | 'moving';
  lastActive: number;
}
