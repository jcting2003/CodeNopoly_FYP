# Submission Readiness Report

## Project Summary

CodeNopoly is a three-part final-year-project system consisting of:

- Laravel backend API
- Vue web frontend
- Expo mobile application

The repository also includes Docker orchestration, a SQL export, QR assets, and project-level setup scripts.

## Technologies Detected

- Backend:
  - Laravel `9.52.21`
  - PHP `8.0.30` in the validated environment
  - Composer `2.7.7`
  - MySQL
  - Sanctum
  - Pusher
  - Ollama/Qwen
- Web:
  - Vue `3.5.31`
  - Vite `8`
  - TypeScript
  - Pinia
  - Tailwind CSS
- Mobile:
  - Expo SDK `54`
  - React `19.1.0`
  - React Native `0.81.5`
  - Expo Router
  - Expo Camera
  - `react-native-nfc-manager`
- Infrastructure:
  - Docker Compose
  - Nginx
  - PHP-FPM

## Files Created

- `web/.env.example`
- `mobile/.env.example`
- `SUBMISSION_CHECKLIST.md`
- `LECTURER_QUICK_START.md`
- `SUBMISSION_READINESS_REPORT.md`

## Files Modified

- `README.md`
- `backend/README.md`
- `web/README.md`
- `mobile/README.md`
- `backend/.env.example`
- `backend/database/seeders/DatabaseSeeder.php`
- `backend/database/seeders/SqlSnapshotSeeder.php`

## Validation Results

### Passed

- `backend`: `php artisan about`
- `backend`: `php artisan route:list`
- `backend`: `php artisan test`
- `web`: `npm run build`
- `mobile`: `npm run lint` completed with warnings only
- `mobile`: `npx tsc --noEmit`

### Warning

- `mobile`: `npm run lint`
  - missing React Hook dependencies in several screens
  - one unused variable warning
  - one array-type style warning
- `mobile`: `npx expo-doctor`
  - `react-native-nfc-manager` flagged as untested on Expo New Architecture
  - several Expo-related package versions are out of sync with Expo Doctor recommendations

### Failed

- `web`: `npm run lint`
  - failed on an unused `UserResponse` type in `web/src/stores/auth.ts`

### Not Tested

- Full live multiplayer flow through browser + mobile + Pusher + Ollama
- Active ngrok reachability
- Device NFC behavior on physical hardware
- Docker runtime startup in this validation pass

### Requires Running Service

- Realtime broadcast verification requires working Pusher credentials and live clients
- Structured AI validation requires live Ollama model access
- Mobile API verification requires a reachable local/LAN/ngrok backend URL

## Required External Services

- MySQL
- Pusher
- Ollama
- Optional ngrok for mobile access outside emulator-only networking

## Required Credentials

Private credentials are required for:

- backend/database access
- Pusher broadcasting
- mobile/web API env configuration
- any retained ngrok-based mobile setup

Credential values were not copied into documentation.

## Lecturer Startup Dependencies

Minimum reliable lecturer path:

1. Docker Desktop
2. Private `.env` files preserved
3. SQL import or migrations/seeders
4. Ollama model pulled
5. Pusher credentials present
6. Expo Go only if mobile demonstration is required

## Hard-Coded Path / URL Review

### Safe To Keep

- `localhost` defaults in local web/backend startup files
- `10.0.2.2` Android emulator fallback in mobile API service
- `127.0.0.1` and `localhost` defaults in Laravel config files

### Must Be Documented

- Mobile ngrok handling in `mobile/src/services/api.ts`
- Vite host/port pinned to `localhost:5173`
- Docker host ports `8000`, `5173`, `3307`, and `11434`

### Potential Submission Issue

- `backend/config/cors.php` includes a specific LAN origin: `http://192.168.0.6:8081`
- Mobile/private `.env` may depend on a currently active ngrok URL that can expire
- Expo Doctor reports package-version drift against the installed SDK expectations

### Requires Confirmation Before Changing

- Any replacement of the current private ngrok/mobile API URL
- Any dependency upgrades to satisfy Expo Doctor
- Any source-code cleanup for existing lint warnings/errors

## Known Limitations

- Web lint does not currently pass cleanly because of one unused type
- Mobile lint passes with warnings
- Expo Doctor reports dependency mismatches and a new-architecture support warning
- The gameplay API currently contains Laravel throttling behavior that can surface `429 Too Many Requests` during high request bursts
- Live mobile verification still depends on the preserved private API URL and active supporting services
- Snapshot seeding mirrors the main app tables from `codenopoly.sql`, but it intentionally does not import framework/state tables such as `migrations`, `failed_jobs`, `password_resets`, or `personal_access_tokens`

## Recommended Submission Folder Structure

Include:

- full `backend/`
- full `web/`
- full `mobile/`
- `docker-compose.yml`
- `codenopoly.sql`
- documentation files
- lock files
- safe `.env.example` files

If working `.env` files are intentionally part of the private university submission package, include them only in the private archive and do not publish them publicly.

## Confirmation Statements

- Working `.env` files were not intentionally modified during this pass.
- No secret values were displayed in documentation or response content.
- No dependency was upgraded.
- No working feature or application logic was intentionally changed.
- Source-code changes were kept limited to the seed layer plus documentation/supporting files and safe env-example templates.

## Additional Note

The repository already had pre-existing uncommitted source changes before this submission-preparation pass. Those changes were left untouched.
