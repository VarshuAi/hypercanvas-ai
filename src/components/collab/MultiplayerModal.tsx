import React, { useState } from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { 
  Users, 
  X, 
  Radio, 
  Server, 
  Copy, 
  Check, 
  Terminal, 
  ShieldCheck, 
  Zap, 
  Network,
  Code2,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';

const WS_SERVER_CODE = `// Production WebSocket Multiplayer Server (server.js)
const { WebSocketServer } = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocketServer({ server });

const rooms = new Map(); // roomId -> Set<ws>

wss.on('connection', (ws, req) => {
  let currentRoom = null;
  let userMeta = null;

  ws.on('message', (raw) => {
    const msg = JSON.parse(raw);

    switch (msg.type) {
      case 'JOIN_ROOM':
        currentRoom = msg.roomId;
        userMeta = msg.user;
        if (!rooms.has(currentRoom)) rooms.set(currentRoom, new Set());
        rooms.get(currentRoom).add(ws);
        broadcast(currentRoom, { type: 'PEER_JOINED', peer: userMeta }, ws);
        break;

      case 'CURSOR_MOVE':
      case 'ELEMENT_UPDATE':
      case 'ELEMENT_CREATE':
        broadcast(currentRoom, msg, ws);
        break;
    }
  });

  ws.on('close', () => {
    if (currentRoom && rooms.has(currentRoom)) {
      rooms.get(currentRoom).delete(ws);
      broadcast(currentRoom, { type: 'PEER_LEFT', peerId: userMeta?.id });
    }
  });
});

function broadcast(roomId, data, senderWs = null) {
  const clients = rooms.get(roomId);
  if (!clients) return;
  const payload = JSON.stringify(data);
  for (const client of clients) {
    if (client !== senderWs && client.readyState === 1) {
      client.send(payload);
    }
  }
}

server.listen(8080, () => {
  console.log('Multiplayer WS Server running on ws://localhost:8080');
});`;

const SUPABASE_CODE = `// Supabase Realtime Broadcast Integration
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://your-proj.supabase.co', 'anon-key');
const channel = supabase.channel('room-architecture-99');

// 1. Subscribe to Live Cursor Movements
channel
  .on('broadcast', { event: 'cursor-pos' }, ({ payload }) => {
    updatePeerCursor(payload.peerId, payload.x, payload.y);
  })
  .on('broadcast', { event: 'node-sync' }, ({ payload }) => {
    applyRemoteElementPatch(payload.element);
  })
  .subscribe();

// 2. Broadcast local cursor position
function onMouseMove(x, y) {
  channel.send({
    type: 'broadcast',
    event: 'cursor-pos',
    payload: { peerId: 'user_123', x, y }
  });
}`;

export const MultiplayerModal: React.FC = () => {
  const { 
    isMultiplayerModalOpen, 
    setMultiplayerModalOpen, 
    multiplayer, 
    connectCustomWs, 
    disconnectMultiplayer 
  } = useCanvasStore();

  const [activeTab, setActiveTab] = useState<'connect' | 'guide_ws' | 'guide_supabase'>('connect');
  const [serverUrl, setServerUrl] = useState(multiplayer.serverUrl);
  const [roomId, setRoomId] = useState(multiplayer.roomId);
  const [userName, setUserName] = useState(multiplayer.userName);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isMultiplayerModalOpen) return null;

  const handleConnect = () => {
    connectCustomWs(serverUrl, roomId, userName);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-2xl glass-dropdown p-6 rounded-3xl shadow-2xl border border-slate-700/80 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                Multiplayer Real-Time Collaboration Hub
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                  {multiplayer.isConnected ? 'Connected' : 'Offline'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Configure custom WebSockets, view CRDT architecture, or deploy dedicated relay nodes.</p>
            </div>
          </div>
          <button
            onClick={() => setMultiplayerModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex rounded-xl bg-slate-900/80 p-1 border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('connect')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'connect' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Connect Custom Server
          </button>
          <button
            onClick={() => setActiveTab('guide_ws')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'guide_ws' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Node.js WS Server Guide
          </button>
          <button
            onClick={() => setActiveTab('guide_supabase')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'guide_supabase' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Supabase Realtime
          </button>
        </div>

        {activeTab === 'connect' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">WebSocket Server URL</label>
                <input
                  type="text"
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
                  placeholder="ws://localhost:8080 or wss://..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Room Channel ID</label>
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. room-sprint-planning"
                />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Your Display Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                placeholder="e.g. Varshan (Lead Architect)"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#0c101c] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Network className="w-3.5 h-3.5 text-cyan-400" />
                  Active Room Collaborators ({multiplayer.peers.length + 1})
                </span>
                <span className="text-[10px] font-mono text-slate-500">Latency: ~{multiplayer.latencyMs}ms</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/80 border border-indigo-500/30">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold font-mono">
                    YOU
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-200 truncate">{userName}</p>
                    <span className="text-[10px] text-emerald-400 font-mono">Host / Active</span>
                  </div>
                </div>

                {multiplayer.peers.map(p => (
                  <div key={p.id} className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white font-mono"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.initials}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-200 truncate">{p.name}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{p.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={disconnectMultiplayer}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200"
              >
                Disconnect
              </button>
              <button
                onClick={handleConnect}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 transition-all"
              >
                Connect to WebSocket Room
              </button>
            </div>
          </div>
        )}

        {activeTab === 'guide_ws' && (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Deploy your own standalone relay in 30 seconds:</span>
              <button
                onClick={() => handleCopy(WS_SERVER_CODE)}
                className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'Copied' : 'Copy server.js'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-2xl bg-[#090d18] border border-slate-800 text-[11px] text-slate-300 overflow-x-auto max-h-72 leading-relaxed">
              {WS_SERVER_CODE}
            </pre>
          </div>
        )}

        {activeTab === 'guide_supabase' && (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Zero-backend Supabase Realtime Broadcast hook:</span>
              <button
                onClick={() => handleCopy(SUPABASE_CODE)}
                className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'Copied' : 'Copy Snippet'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-2xl bg-[#090d18] border border-slate-800 text-[11px] text-slate-300 overflow-x-auto max-h-72 leading-relaxed">
              {SUPABASE_CODE}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
