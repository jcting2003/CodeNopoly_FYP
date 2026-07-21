# CodeNopoly Web Frontend

## Overview

This folder contains the Vue 3 + Vite web frontend for CodeNopoly. It connects to the Laravel backend for authentication, gameplay, dashboard, admin, and realtime broadcast features.

## Stack

- Vue `3.5.31`
- Vite `8`
- TypeScript
- Pinia
- Axios
- Laravel Echo
- Pusher JS
- Tailwind CSS

## Node.js Requirement

The package declares:

```text
^20.19.0 || >=22.12.0
```

Use Node 20+ for best compatibility.

## Environment Variables

The project expects a private `web/.env` file. A safe example is provided in `web/.env.example`.

Detected env variables used by the code:

- `VITE_API_BASE_URL`
- `VITE_PUSHER_APP_KEY`
- `VITE_PUSHER_APP_CLUSTER`

## Install Dependencies

From `web`:

```powershell
npm install
```

## Start Development Server

From `web`:

```powershell
npm run dev
```

Default URL:

```text
http://localhost:5173
```

The Vite config binds to `localhost` port `5173` with strict port enforcement.

## Production Build

```powershell
npm run build
```

Current validation result in this workspace:

- `npm run build`: passed

## Linting

```powershell
npm run lint
```

Current validation result in this workspace:

- `npm run lint`: failed because `web/src/stores/auth.ts` contains an unused `UserResponse` type

No code change was applied to silence that warning/error because the submission brief asked to avoid unnecessary source changes.

## Docker

This frontend is also included in the root Docker Compose stack.

Relevant container details:

- Container: `codenopoly-frontend`
- Host port: `5173`
- Dockerfile base image: `node:20-alpine`

Start from the project root:

```powershell
docker compose up -d frontend
```

## Backend Connection

The web client uses `VITE_API_BASE_URL` and falls back to:

```text
http://localhost:8000
```

Realtime auth uses:

- `/broadcasting/auth`

The web frontend requires matching Pusher credentials in both backend and web env files for live events to work.
