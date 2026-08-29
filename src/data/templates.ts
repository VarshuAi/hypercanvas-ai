import { CanvasElement } from '../types/canvas';

export interface TemplatePreset {
  id: string;
  title: string;
  category: string;
  description: string;
  thumbnailColor: string;
  elements: CanvasElement[];
}

export const TEMPLATES: TemplatePreset[] = [
  {
    id: 'cloud-microservices',
    title: 'Cloud Microservices & Event-Driven Architecture',
    category: 'System Architecture',
    description: 'High-availability Kubernetes cluster with Kafka event streaming, API Gateway, Redis cache, and Postgres DB.',
    thumbnailColor: 'from-indigo-600 to-cyan-500',
    elements: [
      {
        id: 'node-client',
        type: 'rectangle',
        x: 100,
        y: 260,
        width: 160,
        height: 80,
        text: '📱 Web / Mobile Clients\\n(React 19 + iOS)',
        fillColor: '#1e293b',
        strokeColor: '#38bdf8',
        strokeWidth: 2,
        textColor: '#e0f2fe',
        fontSize: 12
      },
      {
        id: 'node-apigw',
        type: 'rectangle',
        x: 340,
        y: 260,
        width: 170,
        height: 80,
        text: '🛡️ Cloud API Gateway\\n(Envoy / Rate Limiter)',
        fillColor: '#1e1b4b',
        strokeColor: '#818cf8',
        strokeWidth: 2,
        textColor: '#e0e7ff',
        fontSize: 12
      },
      {
        id: 'node-auth',
        type: 'rectangle',
        x: 590,
        y: 120,
        width: 170,
        height: 75,
        text: '🔐 Auth & Session Service\\n(OAuth2 + JWT)',
        fillColor: '#1c1917',
        strokeColor: '#f59e0b',
        strokeWidth: 2,
        textColor: '#fef3c7',
        fontSize: 12
      },
      {
        id: 'node-orders',
        type: 'rectangle',
        x: 590,
        y: 260,
        width: 170,
        height: 75,
        text: '📦 Order Engine\\n(Go Microservice)',
        fillColor: '#064e3b',
        strokeColor: '#10b981',
        strokeWidth: 2,
        textColor: '#d1fae5',
        fontSize: 12
      },
      {
        id: 'node-kafka',
        type: 'diamond',
        x: 840,
        y: 240,
        width: 140,
        height: 110,
        text: '⚡ Kafka\\nEvent Bus',
        fillColor: '#451a03',
        strokeColor: '#f97316',
        strokeWidth: 2,
        textColor: '#ffedd5',
        fontSize: 12
      },
      {
        id: 'node-redis',
        type: 'circle',
        x: 630,
        y: 400,
        width: 90,
        height: 90,
        text: '⚡ Redis\\nCache',
        fillColor: '#4c0519',
        strokeColor: '#f43f5e',
        strokeWidth: 2,
        textColor: '#ffe4e6',
        fontSize: 11
      },
      {
        id: 'node-db',
        type: 'rectangle',
        x: 1040,
        y: 260,
        width: 170,
        height: 75,
        text: '🗄️ PostgreSQL Master\\n(TimescaleDB / Sharded)',
        fillColor: '#172554',
        strokeColor: '#3b82f6',
        strokeWidth: 2,
        textColor: '#dbeafe',
        fontSize: 12
      },
      {
        id: 'conn-1',
        type: 'connector',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fromId: 'node-client',
        toId: 'node-apigw',
        strokeColor: '#38bdf8',
        strokeWidth: 2,
        arrowEnd: true,
        connectorStyle: 'bezier',
        text: 'HTTPS / WSS'
      },
      {
        id: 'conn-2',
        type: 'connector',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fromId: 'node-apigw',
        toId: 'node-auth',
        strokeColor: '#818cf8',
        strokeWidth: 2,
        arrowEnd: true,
        connectorStyle: 'bezier'
      },
      {
        id: 'conn-3',
        type: 'connector',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fromId: 'node-apigw',
        toId: 'node-orders',
        strokeColor: '#818cf8',
        strokeWidth: 2,
        arrowEnd: true,
        connectorStyle: 'bezier'
      },
      {
        id: 'conn-4',
        type: 'connector',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fromId: 'node-orders',
        toId: 'node-kafka',
        strokeColor: '#10b981',
        strokeWidth: 2,
        arrowEnd: true,
        connectorStyle: 'bezier',
        text: 'Publish OrderCreated'
      },
      {
        id: 'conn-5',
        type: 'connector',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fromId: 'node-orders',
        toId: 'node-redis',
        strokeColor: '#f43f5e',
        strokeWidth: 2,
        arrowEnd: true,
        connectorStyle: 'bezier'
      },
      {
        id: 'conn-6',
        type: 'connector',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fromId: 'node-kafka',
        toId: 'node-db',
        strokeColor: '#f97316',
        strokeWidth: 2,
        arrowEnd: true,
        connectorStyle: 'bezier',
        text: 'Async Ingestion'
      },
      {
        id: 'sticky-note-1',
        type: 'sticky',
        x: 340,
        y: 390,
        width: 170,
        height: 120,
        text: '💡 Security Rule:\\nRate limited to 1,000 req/sec per API key. SSL termination at Cloudflare edge.',
        fillColor: '#854d0e',
        strokeColor: '#eab308',
        textColor: '#fef9c3',
        fontSize: 12
      }
    ]
  },
  {
    id: 'sprint-retro',
    title: 'Agile Sprint Retrospective & Brainstorm Board',
    category: 'Agile & Collaboration',
    description: 'Interactive team retro board with categorized sticky notes and action item matrices.',
    thumbnailColor: 'from-amber-500 to-rose-500',
    elements: [
      {
        id: 'frame-went-well',
        type: 'rectangle',
        x: 100,
        y: 120,
        width: 320,
        height: 480,
        text: '🚀 What Went Well',
        fillColor: '#064e3b',
        strokeColor: '#10b981',
        strokeWidth: 2,
        textColor: '#a7f3d0',
        fontSize: 14
      },
      {
        id: 'sticky-1',
        type: 'sticky',
        x: 130,
        y: 180,
        width: 260,
        height: 110,
        text: '✨ Deployed React 19 migration with zero downtime!',
        fillColor: '#065f46',
        textColor: '#ecfdf5',
        fontSize: 12
      },
      {
        id: 'sticky-2',
        type: 'sticky',
        x: 130,
        y: 310,
        width: 260,
        height: 110,
        text: '🎯 CI/CD build times dropped by 45% using Vite bundle caching.',
        fillColor: '#065f46',
        textColor: '#ecfdf5',
        fontSize: 12
      },
      {
        id: 'frame-improve',
        type: 'rectangle',
        x: 460,
        y: 120,
        width: 320,
        height: 480,
        text: '⚠️ Areas to Improve',
        fillColor: '#451a03',
        strokeColor: '#f97316',
        strokeWidth: 2,
        textColor: '#fed7aa',
        fontSize: 14
      },
      {
        id: 'sticky-3',
        type: 'sticky',
        x: 490,
        y: 180,
        width: 260,
        height: 110,
        text: '🐌 Staging environment database sync needs automated seeding.',
        fillColor: '#7c2d12',
        textColor: '#ffedd5',
        fontSize: 12
      },
      {
        id: 'frame-action',
        type: 'rectangle',
        x: 820,
        y: 120,
        width: 320,
        height: 480,
        text: '✅ Action Items',
        fillColor: '#1e1b4b',
        strokeColor: '#818cf8',
        strokeWidth: 2,
        textColor: '#c7d2fe',
        fontSize: 14
      },
      {
        id: 'sticky-4',
        type: 'sticky',
        x: 850,
        y: 180,
        width: 260,
        height: 110,
        text: '📌 @Liam to create Docker compose local seed script by Friday.',
        fillColor: '#312e81',
        textColor: '#e0e7ff',
        fontSize: 12
      }
    ]
  }
];
