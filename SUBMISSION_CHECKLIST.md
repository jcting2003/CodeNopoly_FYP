# Submission Checklist

## Source Code

- [ ] `backend` source included
- [ ] `web` source included
- [ ] `mobile` source included
- [ ] lock files included:
  - `backend/composer.lock`
  - `web/package-lock.json`
  - `mobile/package-lock.json`
  - root `package-lock.json` if root utility scripts are included

## Environment Files

- [ ] working private `.env` files preserved exactly as intended
- [ ] `backend/.env.example` included with safe placeholders
- [ ] `web/.env.example` included with safe placeholders
- [ ] `mobile/.env.example` included with safe placeholders
- [ ] no secret values exposed in public-facing documentation

## Database

- [ ] `codenopoly.sql` included
- [ ] Laravel migrations included
- [ ] Laravel seeders included
- [ ] lecturer knows whether to import SQL or run migrations/seeders

## Documentation

- [ ] root `README.md` included
- [ ] `backend/README.md` included
- [ ] `web/README.md` included
- [ ] `mobile/README.md` included
- [ ] `LECTURER_QUICK_START.md` included
- [ ] `SUBMISSION_READINESS_REPORT.md` included

## Infrastructure

- [ ] `docker-compose.yml` included
- [ ] `backend/Dockerfile` included
- [ ] `web/Dockerfile` included
- [ ] Nginx config included

## Optional Supporting Items

- [ ] screenshots/documentation assets included if available
- [ ] QR code assets included if required for demo
- [ ] APK included if one already exists outside this repo

## Validation and Startup

- [ ] backend test commands documented
- [ ] web build command documented
- [ ] mobile Expo startup documented
- [ ] ngrok dependency documented for mobile if required
- [ ] Pusher requirement documented
- [ ] Ollama/Qwen requirement documented
- [ ] lecturer startup process verified as far as possible without altering secrets or live services

## Packaging

- [ ] generated folders excluded where appropriate
- [ ] private `.env` handling clearly explained
- [ ] submission archive reviewed before upload
