# 🎨 HyperCanvas AI: Real-Time Collaborative Infinite Canvas & Document Engine

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript 6](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![CI Status](https://img.shields.io/badge/CI-Passing-10B981?style=for-the-badge&logo=github-actions)](https://github.com)

**An ultra-modern, GPU-accelerated infinite whiteboard and collaborative workspace combining Miro + Notion with an autonomous AI diagram synthesizer and live multiplayer simulation.**

[Explore Features](#-core-capabilities) • [Architecture](#-architecture) • [Quick Start](#-quick-start) • [Templates](#-preset-blueprints)

</div>

---

## 🌟 Overview

**HyperCanvas AI** is an open-source visual workspace for systems engineering, architectural design, agile sprint retrospectives, and visual brainstorming.

Key Highlights:
- 🚀 **Infinite Zoomable & Pannable Vector Canvas**: High-performance SVG & Canvas rendering engine with pan, zoom (20% - 300%), and grid alignment.
- 🤖 **Autonomous AI Diagram Synthesizer**: Type natural language prompts like *"Kubernetes microservices with Kafka & Redis"* and watch structured nodes & connectors auto-generate.
- 👥 **Multiplayer Live Collaboration Simulation**: Real-time cursor presence, user action badges, and zero-conflict editing.
- 🗂️ **Curated Template Blueprints**: Pre-built cloud architectures, agile scrum retros, and database schemas.
- 📦 **1-Click Export Studio**: Export to JSON dataset, copy raw elements, or download production assets.

---

## 🧠 System Architecture

```mermaid
flowchart TD
    subgraph UI["1. Interactive User Experience Layer"]
        A[Tool Dock / Pointer / Hand / Shapes] --> B[Infinite Canvas Viewport]
        C[Property Inspector] --> B
        D[AI Prompt Synthesizer] --> E[AI Diagram Engine]
    end

    subgraph State["2. Reactive State & Undo/Redo Engine"]
        B --> F[Zustand Canvas Store]
        E --> F
        F --> G[History Stack / Snapshot Manager]
        F --> H[Multiplayer Presence Hub]
    end

    subgraph Render["3. Vector Render Pipeline"]
        F --> I[SVG Node & Connector Renderer]
        I --> J[Smooth Bezier Curve Engine]
        I --> K[Dynamic Sticky Notes & Shapes]
    end

    subgraph Export["4. Output & Deployment"]
        F --> L[JSON Workspace Export]
        F --> M[Docker Production Alpine Container]
    end
```

---

## 🚀 Core Capabilities

| Feature | Description |
| :--- | :--- |
| **Multi-Tool Canvas Dock** | Sticky notes, rectangles, decision diamonds, circular nodes, bezier connectors, and text blocks. |
| **Live Property Inspector** | Instant real-time theme color palette picker, font size adjustment, stroke width, and duplicate/delete actions. |
| **Natural Language AI Engine** | Convert system specifications into visual node graphs with automatic collision-free hierarchical layouts. |
| **Collaborative Cursors** | Simulated team members (Sophia, Alex, Liam) interacting and moving live across the canvas. |
| **Infinite Navigation** | Mouse-wheel zooming, trackpad panning, spacebar drag, and custom dot/line grid backgrounds. |

---

## ⚡ Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/VarshuAi/hypercanvas-ai.git
cd hypercanvas-ai
npm install
```

### 2. Launch Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 🐳 Docker Deployment

```bash
docker compose up --build
```
Access the application at `http://localhost:3000`.

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.
