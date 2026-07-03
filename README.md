# MacFiesta 2K25 — National College Multi-Fest Platform

A premium-quality, production-ready, full-stack web application designed for student event management, online ticket check-ins, dynamic scoreboard streams, and interactive AR wayfinding maps. Inspired by the branding of MACFAST college fests.

## 🚀 Key Features

* **3D Animated Hero Scene:** Rotating floats, interactive camera rigs, swept spotlight sweeps using React Three Fiber & Drei.
* **Glassmorphic UI Design:** High-fidelity neon highlights styling built on Tailwind v4 and Framer Motion.
* **Dual Portals System:** Full administrative controls grids alongside student ticket passes logs.
* **AR Wayfinding Guide:** Voice navigation waypoints coordinates matching indoor halls.
* **Dockerized Environments:** Multi-stage Docker packaging, database persistence volumes, Nginx reverse proxy mappings.

---

## 🛠️ Architecture

* **Client:** Next.js (App Router), React, TypeScript, Tailwind CSS, React Three Fiber, Framer Motion, Lenis Scroll.
* **Server:** Express.js, TypeScript, Socket.io, JWT authorization middlewares, PDFKit certificate generator.
* **Database:** MongoDB & Mongoose schemas models.
* **Infrastructures:** Nginx proxy, Docker compose orchestration.

---

## 🏃 Local Quickstart

### 1. Configure Environments
Copy the template overrides:
```bash
cp .env.example .env
```

### 2. Local Express server boot
```bash
cd server
npm install
npm run dev
```

### 3. Local Next.js client boot
```bash
npm install
npm run dev
```

The client starts on `http://localhost:3000`. The server API mounts on `http://localhost:5000/api`.

---

## 🐳 Docker Deployment

To spin up all services (Next.js, Express, Mongo, Nginx Gateway) in production configurations:
```bash
docker-compose up --build
```
This binds Nginx on port `80` (HTTP). All routing redirects:
* `http://localhost/` -> Next.js Frontend
* `http://localhost/api/` -> Express API
* `http://localhost/socket.io/` -> WebSocket connection
