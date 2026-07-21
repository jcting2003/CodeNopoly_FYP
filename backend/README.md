# CodeNopoly Backend

## Overview

This folder contains the Laravel backend API for CodeNopoly. It provides authentication, game logic, leaderboard updates, QR/NFC tile handling, Pusher broadcasting, and Ollama/Qwen-backed hint and structured-answer validation.

## Stack

- Laravel `9.52.21`
- PHP `^8.0` in `composer.json`
- MySQL
- Laravel Sanctum
- Pusher
- Ollama + Qwen

## Important Files

- `composer.json`
- `composer.lock`
- `Dockerfile`
- `docker/nginx.conf`
- `.env`
- `.env.example`
- `routes/api.php`
- `routes/channels.php`

## Environment Setup

Do not overwrite a working `.env`.

If you need a new local setup, copy:

```powershell
Copy-Item .env.example .env
```

Then fill in private values manually.

Key backend env groups:

- App: `APP_NAME`, `APP_ENV`, `APP_KEY`, `APP_DEBUG`, `APP_URL`, `FRONTEND_URL`
- Session/Sanctum: `SESSION_DOMAIN`, `SESSION_SECURE_COOKIE`, `SANCTUM_STATEFUL_DOMAINS`
- Database: `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
- Broadcasting: `BROADCAST_DRIVER`, `PUSHER_APP_ID`, `PUSHER_APP_KEY`, `PUSHER_APP_SECRET`, `PUSHER_APP_CLUSTER`
- Ollama: `OLLAMA_BASE_URL`, `OLLAMA_MODEL`, `OLLAMA_CONNECT_TIMEOUT`, `OLLAMA_VALIDATION_TIMEOUT`, `OLLAMA_HINT_TIMEOUT`
- Optional admin seeder input: `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`

## Composer Installation

From `backend`:

```powershell
composer install
```

## Docker Usage

From the project root:

```powershell
docker compose up -d mysql backend ollama
```

Backend container details:

- Container: `codenopoly-backend`
- Exposed host port: `8000`
- Runtime stack: PHP-FPM + Nginx

Useful commands:

```powershell
docker exec -it codenopoly-backend php artisan about
docker exec -it codenopoly-backend php artisan route:list
docker exec -it codenopoly-backend php artisan test
docker logs --tail 100 codenopoly-backend
```

## Running Locally Without Docker

From `backend`:

```powershell
composer install
php artisan config:clear
php artisan migrate
php artisan serve --host=localhost --port=8000
```

## MySQL Connection

### Inside Docker

Use the backend env values intended for containers:

- `DB_HOST=mysql`
- `DB_PORT=3306`

### Host Machine Access

Docker Compose exposes MySQL on:

- Host: `localhost`
- Port: `3307`

## Database Initialization

Prepared SQL import:

```powershell
docker exec -i codenopoly-mysql mysql -u root -proot -e "CREATE DATABASE IF NOT EXISTS codenopoly;"
Get-Content ..\codenopoly.sql | docker exec -i codenopoly-mysql mysql -u root -proot codenopoly
docker exec -it codenopoly-backend php artisan migrate
```

Migration/seeder setup:

```powershell
php artisan migrate
php artisan db:seed
```

Current seeding behavior:

- If `../codenopoly.sql` exists, `DatabaseSeeder` calls `SqlSnapshotSeeder` and imports the main snapshot-backed app tables from the SQL dump.
- If the SQL file is missing, the code falls back to `BoardSeeder` and optional local/testing admin seeding.

Seeder classes available:

- `DatabaseSeeder`
- `SqlSnapshotSeeder`
- `BoardSeeder`
- `AdminUserSeeder`

Snapshot-backed tables currently mirrored from `codenopoly.sql`:

- `tiles`
- `users`
- `games`
- `cards`
- `properties`
- `questions`
- `game_players`
- `game_properties`
- `player_answers`

## Storage Link

Required for public profile photo access:

```powershell
php artisan storage:link
```

## Cache Clearing

```powershell
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

## Broadcasting and Queue Notes

- Broadcast auth route is enabled in `BroadcastServiceProvider`
- Game channel authorization is defined in `routes/channels.php`
- Realtime features depend on valid Pusher credentials
- Queue driver currently defaults to sync/local execution via env/config

## Pusher Configuration

Backend broadcasting uses the Pusher connection in `config/broadcasting.php`.

Required env vars:

- `BROADCAST_DRIVER=pusher`
- `PUSHER_APP_ID`
- `PUSHER_APP_KEY`
- `PUSHER_APP_SECRET`
- `PUSHER_APP_CLUSTER`

## Ollama Configuration

Backend AI integration is configured through `config/services.php`.

Required env vars:

- `OLLAMA_BASE_URL`
- `OLLAMA_MODEL`
- `OLLAMA_CONNECT_TIMEOUT`
- `OLLAMA_VALIDATION_TIMEOUT`
- `OLLAMA_HINT_TIMEOUT`

Model used by the current code:

```text
qwen2.5-coder:1.5b
```

Pull it in Docker if needed:

```powershell
docker exec -it codenopoly-ollama ollama pull qwen2.5-coder:1.5b
```

## Tests

Validated commands:

```powershell
php artisan about
php artisan route:list
php artisan test
```

Current validation result in this workspace:

- `php artisan test`: passed

See the root readiness report for the latest recorded results.
