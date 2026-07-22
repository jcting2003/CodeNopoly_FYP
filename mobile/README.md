# CodeNopoly Mobile App

## Overview

This folder contains the React Native / Expo mobile client for CodeNopoly. It supports authentication, gameplay access, QR scanning, Android NFC-assisted verification, and Pusher-powered realtime updates.

## Stack

- Expo SDK `54`
- React `19.1.0`
- React Native `0.81.5`
- Expo Router
- Expo Camera
- Expo Secure Store
- Laravel Echo
- Pusher JS
- `react-native-nfc-manager`

## Node.js Requirement

Use Node 20+ for best compatibility with the current Expo toolchain.

## Environment Variables

Do not replace the current working mobile `.env` unless you intentionally need a new setup.

Safe template:

- `mobile/.env.example`

Variables detected in the code:

- `EXPO_PUBLIC_API_URL`
- `EXPO_PUBLIC_PUSHER_APP_KEY`
- `EXPO_PUBLIC_PUSHER_APP_CLUSTER`

## Install Dependencies

From `mobile`:

```powershell
npm install
```

## Start With Expo Go

From `mobile`:

```powershell
npx expo start
```

Optional shortcuts:

```powershell
npm run start
npm run android
npm run ios
npm run web
```

## Lecturer Testing Recommendation

Primary mobile testing path:

- Use an Android device as the main test device.
- Install the provided APK: [base 3.apk](</C:/Users/User/Documents/jenn/codenopoly/base 3.apk>)
- Install and open the provided app build on the phone.
- Open the installed `mobile` app for testing.
- Do not open the `EAS` app for gameplay testing. The `EAS` app is part of Expo tooling, not the CodeNopoly game app itself.

Before testing on the phone:

1. Start the backend stack from the project root:

```powershell
docker compose up -d
```

2. Start the backend tunnel:

```powershell
ngrok http --url=nondrying-drachmal-bertie.ngrok-free.dev 8000
```

3. If using Expo during development, start it from `mobile`:

```powershell
npx expo start -c
```

Practical note:

- For lecturer testing, Android is the official recommended path.
- If both `EAS` and `mobile` icons appear on the phone, open `mobile`.

## How To Install The Android APK

1. Make sure the lecturer receives the full project folder or submission archive containing `base 3.apk`.
2. Move or copy `base 3.apk` onto the Android phone if needed.
3. On the Android phone, open the file manager and find `base 3.apk`.
4. Tap `base 3.apk` to start installation.
5. If Android blocks the install, allow installation from unknown sources when prompted.
6. Finish installing the app.
7. Open the installed `mobile` app.
8. If both `EAS` and `mobile` are visible on the device, open `mobile`.

Before testing the app, the tester should already have these running from the project root:

```powershell
docker compose up -d
ngrok http --url=nondrying-drachmal-bertie.ngrok-free.dev 8000
```

Important notes:

- The lecturer should use Android as the main testing device.
- The `EAS` app is not the CodeNopoly game app and should not be used for gameplay testing.
- The phone may require permission to install APK files from unknown sources before installation can continue.

## API URL Notes

The mobile app reads `EXPO_PUBLIC_API_URL` and strips any trailing `/api`.

Fallback behavior in code:

- Web mode fallback: `http://localhost:8000`
- Native fallback: `http://10.0.2.2:8000`

For real device testing:

- keep the current working ngrok URL if one is already configured privately
- or point `EXPO_PUBLIC_API_URL` to a reachable backend URL on your LAN or active ngrok tunnel

## QR and NFC Requirements

- QR scanning uses `expo-camera`
- Android permission declared in `app.json`:
  - `android.permission.NFC`
- iOS info plist includes:
  - `NFCReaderUsageDescription`

Operational note:

- NFC use is explicitly surfaced as Android-first in the current UI/flow
- iPhone users should rely on QR scanning unless you separately verify NFC behavior in your own environment

## Expo / App Configuration

Important files:

- `app.json`
- `eas.json`

Current app config notes:

- `newArchEnabled` is `true`
- Expo plugin list includes `expo-router`, `expo-secure-store`, and `react-native-nfc-manager`
- EAS profiles for development, preview, and production are present

## Linting and Validation

Run:

```powershell
npm run lint
npx tsc --noEmit
npx expo-doctor
```

Current validation results in this workspace:

- `npm run lint`: passed with warnings
- `npx tsc --noEmit`: passed
- `npx expo-doctor`: completed with warnings/failures about Expo package version drift and `react-native-nfc-manager` new-architecture support

Current lint warnings include:

- missing React Hook dependencies in some screens
- one unused local variable warning
- one `Array<T>` style warning in `PropertyCard.tsx`

## EAS Build Note

EAS configuration exists, but the submission-preparation pass did not convert the app to a different build type and did not modify EAS settings.

Use EAS only if you specifically need a compiled build or APK path already prepared outside this repo.
It is not the app your lecturer should open to test gameplay.

## Clearing Expo Cache

If Metro behaves unexpectedly:

```powershell
npx expo start --clear
```

## Common Metro / Device Issues

- Device cannot reach API:
  - verify `EXPO_PUBLIC_API_URL`
- Realtime events missing:
  - verify Pusher env values
- QR scan permission denied:
  - allow camera access on device
- NFC option unavailable:
  - test on Android hardware with NFC enabled
- Expo doctor dependency mismatch warnings:
  - documented as a known limitation in the readiness report; no upgrades were applied during submission prep
