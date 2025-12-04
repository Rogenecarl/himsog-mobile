# React Native / Expo Deployment Guide

This guide covers how to build and deploy the Himsog Mobile app for Android and iOS.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Build Profiles](#build-profiles)
4. [Android Deployment](#android-deployment)
5. [iOS Deployment](#ios-deployment)
6. [Over-the-Air Updates](#over-the-air-updates)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Accounts Required

| Platform | Account | Cost | Link |
|----------|---------|------|------|
| Expo | Expo Account | Free | https://expo.dev/signup |
| Android | Google Play Developer | $25 (one-time) | https://play.google.com/console |
| iOS | Apple Developer Program | $99/year | https://developer.apple.com/programs |

### Tools Required

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Verify installation
eas --version
```

---

## Initial Setup

### 1. Login to Expo

```bash
eas login
```

### 2. Configure EAS Build

```bash
eas build:configure
```

This creates an `eas.json` file in your project root.

### 3. Configure eas.json

```json
{
  "cli": {
    "version": ">= 5.0.0",
    "appVersionSource": "local"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "gradleCommand": ":app:assembleDebug"
      },
      "ios": {
        "buildConfiguration": "Debug"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "buildConfiguration": "Release"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "production"
      },
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "your-app-store-connect-app-id"
      }
    }
  }
}
```

### 4. Update app.json

Ensure your `app.json` has required fields:

```json
{
  "expo": {
    "name": "Himsog",
    "slug": "himsog-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.yourcompany.himsog"
    },
    "ios": {
      "bundleIdentifier": "com.yourcompany.himsog",
      "supportsTablet": true
    }
  }
}
```

---

## Build Profiles

| Profile | Purpose | Output | Distribution |
|---------|---------|--------|--------------|
| `development` | Local development with dev client | Dev build | Internal |
| `preview` | Testing/QA builds | APK (Android) | Internal/Direct share |
| `production` | Store releases | AAB (Android), IPA (iOS) | Play Store / App Store |

---

## Android Deployment

### Option A: Direct APK Sharing (Quick Testing)

Build an APK that can be installed directly on Android devices:

```bash
# Build APK
eas build --platform android --profile preview
```

After the build completes:
1. Download the `.apk` file from the provided URL
2. Share the APK file with testers
3. Users install by enabling "Install from unknown sources"

### Option B: Google Play Store (Production)

#### Step 1: Create App on Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Click **Create app**
3. Fill in app details (name, language, app type)
4. Complete the app content questionnaire

#### Step 2: Create Service Account for Automated Uploads

1. Go to **Setup** → **API access** in Play Console
2. Click **Create new service account**
3. Follow the link to Google Cloud Console
4. Create a service account with **Service Account User** role
5. Create a JSON key and download it
6. Save as `google-service-account.json` in your project root
7. Add to `.gitignore`:
   ```
   google-service-account.json
   ```
8. Back in Play Console, grant the service account **Release manager** permission

#### Step 3: Build for Production

```bash
# Build Android App Bundle (AAB)
eas build --platform android --profile production
```

#### Step 4: Submit to Play Store

```bash
# Automatic submission
eas submit --platform android --profile production

# Or manually upload the AAB from Play Console
```

#### Step 5: Play Store Listing

Complete these sections in Play Console:
- [ ] App icon (512x512 PNG)
- [ ] Feature graphic (1024x500 PNG)
- [ ] Screenshots (phone, tablet, etc.)
- [ ] Short description (80 characters)
- [ ] Full description (4000 characters)
- [ ] Privacy policy URL
- [ ] App category
- [ ] Content rating questionnaire
- [ ] Target audience
- [ ] Data safety form

#### Step 6: Release

1. Go to **Production** → **Releases**
2. Create new release
3. Upload AAB or use the one submitted via EAS
4. Add release notes
5. Review and roll out

---

## iOS Deployment

### Prerequisites

- Apple Developer Program membership ($99/year)
- Mac computer (for some certificate operations)
- App Store Connect app created

#### Step 1: Create App on App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click **My Apps** → **+** → **New App**
3. Fill in app details:
   - Platform: iOS
   - Name: Your app name
   - Primary language
   - Bundle ID: Must match `ios.bundleIdentifier` in app.json
   - SKU: Unique identifier (e.g., `himsog-mobile-001`)

#### Step 2: Build for Production

```bash
# Build iOS IPA
eas build --platform ios --profile production
```

EAS will handle:
- Creating/managing certificates
- Creating/managing provisioning profiles
- Building the IPA

#### Step 3: Submit to App Store

```bash
# Submit to App Store Connect
eas submit --platform ios --profile production
```

Or configure automatic submission in `eas.json`:
```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "1234567890"
      }
    }
  }
}
```

#### Step 4: App Store Listing

Complete in App Store Connect:
- [ ] App icon (1024x1024 PNG, no alpha)
- [ ] Screenshots for each device size
- [ ] Description
- [ ] Keywords
- [ ] Support URL
- [ ] Privacy policy URL
- [ ] Age rating
- [ ] App Review information

#### Step 5: Submit for Review

1. Go to your app in App Store Connect
2. Select the build uploaded via EAS
3. Complete all required metadata
4. Submit for review

Apple review typically takes 24-48 hours.

---

## Over-the-Air Updates

For JavaScript-only changes, use EAS Update to push updates without going through app stores:

### Setup

```bash
# Configure EAS Update
eas update:configure
```

### Push an Update

```bash
# Update preview channel
eas update --branch preview --message "Bug fixes"

# Update production channel
eas update --branch production --message "Version 1.0.1 updates"
```

### Limitations

OTA updates can change:
- JavaScript code
- Assets (images, fonts)

OTA updates CANNOT change:
- Native code
- Native dependencies
- app.json configuration changes

---

## Troubleshooting

### Common Issues

#### Build fails with credential errors

```bash
# Clear credentials and reconfigure
eas credentials
```

#### Android build fails

```bash
# Check for native dependency issues
npx expo-doctor
```

#### iOS build fails with provisioning profile errors

```bash
# Regenerate provisioning profiles
eas credentials --platform ios
```

#### "App not installed" on Android

- Ensure USB debugging is enabled
- Check for existing app with same package name
- Try uninstalling the existing app first

### Useful Commands

```bash
# Check project configuration
npx expo-doctor

# View build logs
eas build:list

# View specific build details
eas build:view [BUILD_ID]

# Cancel a running build
eas build:cancel [BUILD_ID]

# Check credentials
eas credentials
```

---

## Version Management

### Incrementing Version Numbers

Update in `app.json`:

```json
{
  "expo": {
    "version": "1.0.1",
    "android": {
      "versionCode": 2
    },
    "ios": {
      "buildNumber": "2"
    }
  }
}
```

- `version`: User-facing version (semantic versioning)
- `versionCode` (Android): Must increment for each Play Store upload
- `buildNumber` (iOS): Must increment for each App Store upload

### Automatic Version Increment

Add to `eas.json`:

```json
{
  "cli": {
    "appVersionSource": "remote"
  },
  "build": {
    "production": {
      "autoIncrement": true
    }
  }
}
```

---

## Checklist Before Release

### Pre-release Checklist

- [ ] Test on multiple devices (different screen sizes)
- [ ] Test on both Android and iOS
- [ ] Verify all API endpoints work in production
- [ ] Check error handling and edge cases
- [ ] Review app permissions
- [ ] Test offline behavior
- [ ] Verify deep links work
- [ ] Check push notifications (if applicable)
- [ ] Review analytics tracking
- [ ] Update version numbers
- [ ] Prepare release notes
- [ ] Prepare store listing assets

### Store Assets Needed

| Asset | Android | iOS |
|-------|---------|-----|
| App Icon | 512x512 PNG | 1024x1024 PNG (no alpha) |
| Feature Graphic | 1024x500 PNG | N/A |
| Phone Screenshots | Min 2, 16:9 ratio | 6.5" and 5.5" displays |
| Tablet Screenshots | Optional | 12.9" iPad (if supporting) |

---

## Quick Reference Commands

```bash
# Login to Expo
eas login

# Build preview APK (for testing)
eas build --platform android --profile preview

# Build production Android
eas build --platform android --profile production

# Build production iOS
eas build --platform ios --profile production

# Build both platforms
eas build --platform all --profile production

# Submit to stores
eas submit --platform android
eas submit --platform ios

# Push OTA update
eas update --branch production --message "Update description"

# Check build status
eas build:list
```

---

## Resources

- [Expo EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Expo EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)
- [Expo EAS Update Documentation](https://docs.expo.dev/eas-update/introduction/)
