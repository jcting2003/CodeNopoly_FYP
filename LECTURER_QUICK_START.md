# Lecturer Quick Start

## Required Software

- Docker Desktop
- Expo Go on a phone if mobile testing is required
- Optional: PHP 8+, Composer, and Node.js 20+ for non-Docker local runs

## Fastest Reliable Startup Order

1. Open a terminal in the project root.
2. Start Docker services.
3. Import the database SQL file or run migrations/seeders.
4. Pull the Ollama model if it is not already present.
5. Open the web app.
6. Start the mobile app separately only if mobile assessment is needed.
7. Verify the mobile API URL still points to a reachable backend/ngrok URL.

## Exact Commands

### 1. Start Docker

Run in the project root:

```powershell
docker compose up -d --build
```

### 2. Confirm Containers

Run in the project root:

```powershell
docker ps
```

Expected services:

- `codenopoly-mysql`
- `codenopoly-backend`
- `codenopoly-frontend`
- `codenopoly-ollama`

### 3. Import the Database

Run in the project root:

```powershell
docker exec -i codenopoly-mysql mysql -u root -proot -e "CREATE DATABASE IF NOT EXISTS codenopoly;"
Get-Content .\codenopoly.sql | docker exec -i codenopoly-mysql mysql -u root -proot codenopoly
docker exec -it codenopoly-backend php artisan migrate
```

If you prefer Laravel seed data instead of the SQL dump:

```powershell
docker exec -it codenopoly-backend php artisan migrate
docker exec -it codenopoly-backend php artisan db:seed
```

Important:

- `php artisan db:seed` now prefers the project-root `codenopoly.sql` snapshot when that file exists.
- That means the main app/game tables are replaced with snapshot-backed data instead of only inserting the older minimal board seed data.

### 4. Create Storage Link

Run in the project root:

```powershell
docker exec -it codenopoly-backend php artisan storage:link
```

### 5. Verify Ollama / Pull Qwen

Run in the project root:

```powershell
docker exec -it codenopoly-ollama ollama pull qwen2.5-coder:1.5b
```

Optional verification:

```powershell
docker exec -it codenopoly-ollama ollama run qwen2.5-coder:1.5b
```

### 6. Open the Web Application

Open:

```text
http://localhost:5173
```

Backend API:

```text
http://localhost:8000
```

### 7. Start Mobile App With Expo Go

Run in `mobile`:

```powershell
npm install
npx expo start
```

Then scan the Expo QR code with Expo Go.

## Verify Mobile API URL

The mobile app depends on a private `mobile/.env` file containing `EXPO_PUBLIC_API_URL`.

Check privately that it points to:

- a reachable backend URL on your local network, or
- the currently active ngrok URL used by the project

Do not replace a working ngrok URL unless you intentionally want a new one.

## Verify Pusher

Realtime features require private Pusher values in:

- `backend/.env`
- `web/.env`
- `mobile/.env`

If realtime updates fail, verify the private env files contain matching Pusher credentials and that `/broadcasting/auth` is reachable.

## Verify Ollama

Ollama is required for:

- structured question validation
- AI hint generation

If those features fail, check:

```powershell
docker logs --tail 100 codenopoly-ollama
docker logs --tail 100 codenopoly-backend
```

## Default URLs

- Web: `http://localhost:5173`
- Backend: `http://localhost:8000`
- MySQL: `localhost:3307`
- Ollama: `http://localhost:11434`

## Login / Test Accounts

No hard-coded lecturer login credentials are documented in this repository. Use existing private environment/project data only if it was separately supplied with the submission.

## Short Troubleshooting

- Backend not loading:
  - run `docker logs --tail 100 codenopoly-backend`
- Web not loading:
  - run `docker logs --tail 100 codenopoly-frontend`
- Database errors:
  - recheck SQL import and backend DB env values
- Mobile cannot connect:
  - verify `EXPO_PUBLIC_API_URL`
- Realtime missing:
  - verify Pusher env values
- AI features missing:
  - verify Ollama is running and the Qwen model is pulled
