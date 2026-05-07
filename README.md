# EcoMorsel App

![Expo](https://img.shields.io/badge/Expo-55-000020?style=for-the-badge&logo=expo)
![React Native](https://img.shields.io/badge/React_Native-0.83-61DAFB?style=for-the-badge&logo=react&logoColor=111)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

EcoMorsel App is an Expo React Native app that estimates the environmental footprint of food from text or images.

## Repo Links

- Web and LLM proxy: [../EcoMorselWeb](https://github.com/EcoMorsel/Web)
- Mobile app: this repo

## Tech Stack

- Expo Router
- React Native
- TypeScript
- AsyncStorage
- PNPM
- EAS Build

## Environment

Create `.env` in this directory:

```bash
EXPO_PUBLIC_PROXY_URL=http://localhost:3000/analyze
EXPO_PUBLIC_API_SECRET=shared_secret_used_by_the_web_api
```

| Variable | Required | Used by | Description |
| --- | --- | --- | --- |
| `EXPO_PUBLIC_PROXY_URL` | Recommended | App | URL of the EcoMorsel Web `/analyze` API. |
| `EXPO_PUBLIC_API_SECRET` | Yes for live AI | App and Web API | Shared secret sent as `x-api-secret`. Must match `API_SECRET` in the web repo. |

Local URL tips:

| Target | Proxy URL |
| --- | --- |
| iOS simulator or Expo web | `http://localhost:3000/analyze` |
| Android emulator | `http://10.0.2.2:3000/analyze` |
| Physical device | `http://YOUR_LAN_IP:3000/analyze` |

## Run Locally

First start the web repo:

```bash
cd ../EcoMorselWeb
pnpm install
pnpm dev
```

Then start the app:

```bash
cd ../EcoMorselApp
pnpm install
pnpm start
```

Platform shortcuts:

```bash
pnpm ios
pnpm android
pnpm web
```

## Build

### EAS Cloud Build

The easiest way to create native builds is using Expo's servers:

```bash
eas build --profile preview --platform android
eas build --profile production --platform ios
```

### Local Native Build

To build the app on your own machine, you must have the [Android SDK](https://developer.android.com/studio) and **JDK 21** installed (for Android) or **Xcode** (for iOS).

**Android:**

```bash
# Build and install a release version on a connected device
npx expo run:android --variant release

# Or generate the APK manually
npx expo prebuild
cd android
./gradlew assembleRelease
```

**iOS:**

```bash
# Build and install a release version on a connected device
npx expo run:ios --configuration Release
```

## Contributing

1. Create a branch for your change.
2. Keep UI, service, and data changes focused.
3. Run `pnpm lint` before opening a PR.
4. If the proxy contract changes, update both this README and [../EcoMorselWeb/README.md](../EcoMorselWeb/README.md).

## Issues

When raising an issue, include:

- Device or simulator details
- Expo command used
- Whether the web proxy was running first
- Current `EXPO_PUBLIC_PROXY_URL` target, without secrets
- Screenshots or terminal logs when useful
