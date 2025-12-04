# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm start          # Start Expo development server
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator
npm run web        # Run in web browser
npm run lint       # Run ESLint
```

No test framework is currently configured.

## Architecture

This is an **Expo/React Native** mobile app using:
- **Expo Router** for file-based routing (similar to Next.js)
- **TypeScript** in strict mode with `@/*` path aliases
- **TanStack React Query** for data fetching
- **react-hook-form** + **Zod** for form handling/validation
- **Axios** for HTTP requests

### Key Directories

- `app/` - Expo Router pages and layouts (file-based routing)
  - `(tabs)/` - Tab navigation group with `_layout.tsx` defining tabs
  - `_layout.tsx` - Root layout with theme provider and navigation stack
- `components/` - Reusable UI components
  - `ui/` - Base UI primitives
  - `themed-*.tsx` - Theme-aware wrappers for Text/View
- `hooks/` - Custom React hooks (color scheme, theme colors)
- `constants/` - App constants including theme configuration

### Routing Pattern

Expo Router uses file-system routing:
- Files in `app/` become routes
- `_layout.tsx` files define navigation structure
- Parentheses groups like `(tabs)` create layout groups without affecting URL

### Theming

- Dark/light mode with automatic OS detection
- Theme colors defined in `constants/theme.ts`
- Use `useThemeColor` hook and `ThemedText`/`ThemedView` components

### Platform Support

Universal app targeting iOS, Android, and Web. New React Native Architecture and React Compiler are enabled.
