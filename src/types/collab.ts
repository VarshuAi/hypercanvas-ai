export interface PeerUser {
  id: string;
  name: string;
  initials: string;
  color: string;
  x: number;
  y: number;
  selectedElementId?: string;
  status: 'idle' | 'editing' | 'drawing' | 'moving';
  lastPing: number;
}

export interface MultiplayerState {
  mode: 'simulated' | 'custom_ws' | 'supabase';
  isConnected: boolean;
  serverUrl: string;
  roomId: string;
  userName: string;
  userColor: string;
  latencyMs: number;
  peers: PeerUser[];
}
