# CodeNopoly

CodeNopoly is a final-year-project hybrid learning game that combines a physical board, QR/NFC interactions, a Laravel API, a Vue web client, and an Expo mobile app. Players create or join a game, roll dice, scan physical tiles or cards, answer Python questions, and progress through property and leaderboard mechanics.

## System Architecture

- `backend`: Laravel 9 API, Sanctum auth, MySQL persistence, Pusher broadcasting, Ollama/Qwen integration
- `web`: Vue 3 + Vite browser client
- `mobile`: React Native + Expo mobile client
- `docker-compose.yml`: Dockerized stack for MySQL, backend, frontend, and Ollama
- `codenopoly.sql`: SQL export for importing prepared data

## Folder Structure

```text
codenopoly/
├── backend/
├── mobile/
├── qr-codes/
├── test-screenshots/
├── web/
├── codenopoly.sql
├── docker-compose.yml
├── LECTURER_QUICK_START.md
├── SUBMISSION_CHECKLIST.md
├── SUBMISSION_READINESS_REPORT.md
└── README.md
```

## Main Technologies

- Backend: PHP 8.x, Laravel 9, Sanctum, Pusher PHP SDK, MySQL
- Web: Node.js, Vue 3, TypeScript, Vite, Pinia, Axios, Tailwind CSS, Laravel Echo
- Mobile: Expo SDK 54, React Native 0.81, React 19, Expo Router, Expo Camera, `react-native-nfc-manager`, Axios, Laravel Echo
- AI/Services: Ollama with `qwen2.5-coder:1.5b`
- Infrastructure: Docker, Docker Compose, Nginx, PHP-FPM

## Runtime Versions

- PHP: backend validated on `8.0.30`
- Composer: backend validated on `2.7.7`
- Laravel: `9.52.21`
- Node.js:
  - Web package declares `^20.19.0 || >=22.12.0`
  - Docker web image uses `node:20-alpine`
  - Local validation ran on Node `20.19.2`
- MySQL: Docker image `mysql:8.0`
- Expo SDK: `54`

## Required Services

- MySQL database
- Laravel backend
- Vue web frontend
- Ollama with the Qwen model available locally
- Pusher account/credentials for realtime updates
- Ngrok or another reachable backend URL for physical-device mobile testing when needed

## Environment Files

Working environment files already exist in this repository, but their values are intentionally not reproduced here.

- Existing private env files detected:
  - `backend/.env`
  - `web/.env`
  - `mobile/.env`
- Safe examples provided:
  - `backend/.env.example`
  - `web/.env.example`
  - `mobile/.env.example`

Important:

- Do not overwrite working `.env` files.
- Do not rotate keys or secrets.
- Do not replace the current working ngrok/mobile API URL unless you intentionally want a new one.

## Hardware and Software Prerequisites

- Windows, macOS, or Linux development machine
- Docker Desktop
- Node.js 20+
- npm
- PHP 8.0+ and Composer if running backend outside Docker
- MySQL client if importing SQL manually
- Expo Go on a phone if mobile testing is needed
- NFC-capable Android device for NFC testing
- Camera-enabled device for QR testing

## Recommended Startup Order

1. Start Docker services for MySQL, backend, frontend, and Ollama.
2. Confirm the backend responds.
3. Import `codenopoly.sql` or run migrations/seeders.
4. Pull the Ollama model if it is not already present.
5. Confirm Pusher credentials are present in private env files.
6. Start the mobile app with Expo if mobile testing is needed.
7. Verify the mobile API URL points to a reachable backend or active ngrok tunnel.

## Docker Setup

From the project root:

```powershell
docker compose up -d --build
```

Services:

- `codenopoly-mysql` on host port `3307`
- `codenopoly-backend` on host port `8000`
- `codenopoly-frontend` on host port `5173`
- `codenopoly-ollama` on host port `11434`

Useful commands:

```powershell
docker compose up -d
docker compose up -d --build
docker compose down
docker ps
docker logs --tail 100 codenopoly-backend
docker logs --tail 100 codenopoly-frontend
docker logs --tail 100 codenopoly-ollama
```

## Database Setup

### Option A: Import the prepared SQL export

```powershell
docker exec -i codenopoly-mysql mysql -u root -proot -e "CREATE DATABASE IF NOT EXISTS codenopoly;"
Get-Content .\codenopoly.sql | docker exec -i codenopoly-mysql mysql -u root -proot codenopoly
docker exec -it codenopoly-backend php artisan migrate
```

### Option B: Use Laravel migrations and seeders

```powershell
docker exec -it codenopoly-backend php artisan migrate
docker exec -it codenopoly-backend php artisan db:seed
```

Current seeding behavior:

- If `codenopoly.sql` exists at the project root, `DatabaseSeeder` now uses `SqlSnapshotSeeder` to mirror the SQL snapshot for the main app tables.
- If `codenopoly.sql` is missing, the seeder falls back to the older code-defined seed path.

Seeder classes present:

- `DatabaseSeeder`
- `SqlSnapshotSeeder`
- `BoardSeeder`
- `AdminUserSeeder`

Notes:

- Do not use destructive commands such as `migrate:fresh` on the submission copy unless you intentionally want to wipe data.
- `php artisan db:seed` now replaces the main seeded tables with the SQL snapshot data when `codenopoly.sql` is present.
- Profile image uploads require `php artisan storage:link`.

## Backend Startup

Dockerized:

```powershell
docker compose up -d backend mysql ollama
```

Local from `backend`:

```powershell
composer install
php artisan config:clear
php artisan migrate
php artisan serve --host=localhost --port=8000
```

The repository also includes `start.ps1`, which starts the backend and web app in separate PowerShell windows for local non-Docker use.

## Web Startup

Dockerized:

```powershell
docker compose up -d frontend
```

Local from `web`:

```powershell
npm install
npm run dev
```

Default URL:

```text
http://localhost:5173
```

## Mobile Startup With Expo Go

From `mobile`:

```powershell
npm install
npx expo start
```

Then scan the Expo QR code with Expo Go.

Mobile notes:

- QR scanning uses `expo-camera`
- NFC support is intended for Android and requires `android.permission.NFC`
- iOS config includes `NFCReaderUsageDescription`, but operational support still depends on platform/plugin constraints
- The mobile app reads `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_PUSHER_APP_KEY`, and `EXPO_PUBLIC_PUSHER_APP_CLUSTER`
- On a physical phone, `localhost` is not valid unless the backend is running on that same device

## Ngrok Setup

The mobile app contains explicit handling for ngrok-backed API access. The working ngrok URL in the current private environment was intentionally not exposed here.

If the existing working ngrok tunnel is still active:

- keep the current `EXPO_PUBLIC_API_URL` value unchanged
- start Expo normally

If you must replace it in your own private environment:

- start a tunnel that exposes the Laravel backend
- update `mobile/.env` privately so `EXPO_PUBLIC_API_URL` points to the reachable backend base URL
- do not publish private tunnel URLs if they are temporary

## Pusher Setup

Realtime multiplayer depends on private Pusher credentials.

Required backend variables:

- `BROADCAST_DRIVER`
- `PUSHER_APP_ID`
- `PUSHER_APP_KEY`
- `PUSHER_APP_SECRET`
- `PUSHER_APP_CLUSTER`

Required frontend/mobile variables:

- `VITE_PUSHER_APP_KEY`
- `VITE_PUSHER_APP_CLUSTER`
- `EXPO_PUBLIC_PUSHER_APP_KEY`
- `EXPO_PUBLIC_PUSHER_APP_CLUSTER`

Broadcast auth route used by the clients:

- `/broadcasting/auth`

## Ollama and Qwen Setup

Backend integration uses:

- `OLLAMA_BASE_URL`
- `OLLAMA_MODEL`
- `OLLAMA_CONNECT_TIMEOUT`
- `OLLAMA_VALIDATION_TIMEOUT`
- `OLLAMA_HINT_TIMEOUT`

Pull the model if needed:

```powershell
docker exec -it codenopoly-ollama ollama pull qwen2.5-coder:1.5b
```

Optional manual verification:

```powershell
docker exec -it codenopoly-ollama ollama run qwen2.5-coder:1.5b
```

## Default Local URLs

- Web: `http://localhost:5173`
- Backend: `http://localhost:8000`
- MySQL host access: `localhost:3307`
- Ollama: `http://localhost:11434`

## Build and Test Commands

### Backend

```powershell
php artisan about
php artisan route:list
php artisan test
```

### Web

```powershell
npm run build
npm run lint
```

### Mobile

```powershell
npm run lint
npx tsc --noEmit
npx expo-doctor
```

## Demo Instructions

Typical demo flow:

1. Start backend, database, frontend, and Ollama.
2. Open the web app and log in or register.
3. Create a game and note the game code.
4. Join from another browser or device.
5. Start the game as host.
6. Roll dice, scan a physical tile/card, answer the question, and observe realtime updates.
7. For structured questions, verify Ollama/Qwen is running so AI validation and hint generation work.

Use separate browsers or devices for separate players to avoid session conflicts.

## Troubleshooting

- Web build works but web lint fails:
  - there is currently an unused `UserResponse` type in `web/src/stores/auth.ts`
- Mobile lint currently passes with warnings:
  - several React Hook dependency warnings and one array-type style warning are present
- Expo Doctor reports dependency drift:
  - Expo SDK package versions are slightly out of sync and `react-native-nfc-manager` is flagged as untested on the New Architecture
- Backend cannot connect to MySQL:
  - verify Docker is running and the backend env points to the correct DB host for the chosen runtime
- Mobile cannot reach API:
  - verify `EXPO_PUBLIC_API_URL` points to a reachable LAN/ngrok/backend URL
- Realtime does not update:
  - verify Pusher credentials exist in the private env files and that `/broadcasting/auth` works
- AI hints/validation fail:
  - verify Ollama is running and `qwen2.5-coder:1.5b` is pulled

## Security Notes

- Working `.env` files were preserved and are not documented with secret values.
- If the submission package includes private `.env` files for lecturer convenience, it should be shared privately only.
- Do not publish archives containing working Pusher, database, or ngrok credentials.

## Submission Contents

The submission package should include at minimum:

- `backend/`
- `web/`
- `mobile/`
- `docker-compose.yml`
- `codenopoly.sql`
- lock files
- README files
- `.env.example` files
- `SUBMISSION_CHECKLIST.md`
- `LECTURER_QUICK_START.md`
- `SUBMISSION_READINESS_REPORT.md`

See [LECTURER_QUICK_START.md](/C:/Users/User/Documents/jenn/codenopoly/LECTURER_QUICK_START.md) for the shortest startup path and [SUBMISSION_READINESS_REPORT.md](/C:/Users/User/Documents/jenn/codenopoly/SUBMISSION_READINESS_REPORT.md) for validation results and known limitations.
