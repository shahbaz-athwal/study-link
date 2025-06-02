# Study Link 📚

A collaborative study platform that enables students to create study groups, share resources, and engage in real-time discussions. Built with modern web technologies and powered by Zero sync engine for lightning-fast interactions.

## What's in this Monorepo 📦

```
studylink/
├── frontend/          # React + Vite application with Tailwind CSS
├── backend/           # Express.js API server with Prisma ORM
├── zero-syncer/       # Zero sync engine configuration
└── docker-compose.yml # Container orchestration
```

### Frontend

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS with shadcn UI components
- **State Management**: Zustand
- **Real-time**: Zero React hooks for live data synchronization
- **Deployment**: Vercel

### Backend

- **Runtime**: Node.js with Express
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth with email verification
- **File Storage**: UploadThing
- **Deployment**: VPS using Docker, Traefik, and Watchtower

### Zero Syncer

- **Engine**: Rocicorp Zero for real-time data synchronization
- **Permissions**: Fine-grained access control with row-level security

Zero is a real-time synchronization engine that powers Study Link's collaborative features. It automatically syncs data between all connected clients without manual refresh or WebSocket management.

This means when someone posts a message, uploads a file, or joins a group, everyone sees the changes immediately without any loading states or manual refreshes.

## Features ✨

#### 🚀 Local First - Insanely Fast Navigation

#### 📁 File Uploads

#### 💬 Realtime Chat

#### 🔐 Role Based Access Control

#### 🔑 Better Auth for Authentication
