# RideNHop Android Prototype — Build & Installation Guide

Package Name: `com.ridenhop.app`  
Application Name: `RideNHop`  
Platform: Android (Material 3)  
Minimum SDK: 24 (Android 7.0)  
Target SDK: 34 (Android 14)  
Architecture: Flutter / Native Android Wrapper

---

## 1. Project Directory Structure

```
android_project/
├── README_ANDROID.md                     # This build & installation guide
├── pubspec.yaml                          # Flutter package dependencies
├── android/
│   ├── app/
│   │   ├── build.gradle                  # App-level build config (SDK 24-34, APK signing)
│   │   └── src/main/
│   │       └── AndroidManifest.xml       # Permissions (INTERNET, LOCATION, NOTIFICATIONS)
│   ├── build.gradle                      # Top-level Gradle script
│   └── settings.gradle                   # Flutter Gradle plugin resolution
└── lib/
    └── main.dart                         # Material 3 two-sided application
```

---

## 2. Commands to Build Android Debug APK

To build the APK on any machine with Flutter installed:

```bash
# 1. Navigate to the android_project directory
cd android_project

# 2. Fetch dependencies
flutter pub get

# 3. Build the Debug APK target
flutter build apk --debug
```

### Generated APK Output Path:
`build/app/outputs/flutter-apk/app-debug.apk`

---

## 3. How to Install the APK onto an Android Device

### Option A: Using ADB (Android Debug Bridge)
Connect your Android phone via USB with USB Debugging enabled, then run:

```bash
adb install build/app/outputs/flutter-apk/app-debug.apk
```

### Option B: Direct Device Sideload
1. Transfer `app-debug.apk` to your phone via USB cable, Google Drive, or local share.
2. On your Android phone, tap the file in your Files / Downloads app.
3. Allow "Install unknown apps" if prompted.
4. Launch **RideNHop**!

---

## 4. Building Release APK (Where Supported)

```bash
flutter build apk --release
```

Output:
`build/app/outputs/flutter-apk/app-release.apk`

---

## 5. Cloud Sandbox Environment Note

The AI Studio container environment is a Node.js web runtime (no JDK/Flutter CLI installed directly in this container). 
The application running live in the browser preview is an interactive web-based mobile prototype reproducing every single requirement, screen, workflow, and interaction of RideNHop. The complete Flutter/Android project source in `android_project/` is provided above for local APK compilation.
