# Himsog Mobile

A cross-platform mobile health application built with Expo and React Native. "Himsog" means "healthy" in Cebuano.

## Features

- **User Authentication** - Secure login, registration, and email verification
- **Cross-Platform** - Runs on iOS, Android, and Web
- **Dark/Light Mode** - Automatic theme detection with manual toggle support
- **Map Integration** - Location-based features with Mapbox
- **Tab Navigation** - Intuitive bottom tab navigation

## Tech Stack

- **Framework**: Expo SDK 54 / React Native 0.81
- **Routing**: Expo Router (file-based routing)
- **State Management**: TanStack React Query
- **Forms**: react-hook-form + Zod validation
- **HTTP Client**: Axios
- **Maps**: Mapbox
- **Language**: TypeScript (strict mode)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [pnpm](https://pnpm.io/) (or npm/yarn)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- For iOS development: Xcode (macOS only)
- For Android development: Android Studio with Android SDK

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/himsog-mobile.git
cd himsog-mobile
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Start the development server

```bash
pnpm start
```

This will start the Expo development server. You can then:

- Press `a` to open on Android emulator
- Press `i` to open on iOS simulator (macOS only)
- Press `w` to open in web browser
- Scan the QR code with [Expo Go](https://expo.dev/go) app on your physical device

### Alternative run commands

```bash
# Run directly on Android
pnpm run android

# Run directly on iOS
pnpm run ios

# Run in web browser
pnpm run web
```

## Project Structure

```
himsog-mobile/
├── app/                    # Expo Router pages and layouts
│   ├── (auth)/            # Authentication screens
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── verify-email.tsx
│   ├── (tabs)/            # Main tab navigation
│   │   ├── index.tsx      # Home screen
│   │   ├── explore.tsx    # Explore screen
│   │   └── _layout.tsx    # Tab navigator config
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # Base UI primitives
│   ├── themed-text.tsx
│   └── themed-view.tsx
├── hooks/                 # Custom React hooks
├── constants/            # App constants and theme
└── assets/               # Images, fonts, etc.
```

## Development

### Linting

```bash
pnpm run lint
```

### Reset project

To get a fresh start (moves current app to `app-example`):

```bash
pnpm run reset-project
```

## License

This project is private.
