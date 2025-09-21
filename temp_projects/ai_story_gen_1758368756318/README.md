# AI Story Gen

An AI-powered story generation application built with Flutter and Firebase.

## Features

- AI-powered story generation based on user preferences.
- Save favorite stories to a personal library.
- Share generated stories with others.
- Customize story types (genre, length, keywords).
- Dark reading mode for enhanced user experience.

## Color Scheme

- **Primary Colors:** Dark Blue, Gold, White

## Getting Started

### 1. Firebase Setup

This project uses Firebase for backend services including authentication and Firestore for data storage. Follow these steps to set up Firebase for your project:

1. **Create a Firebase Project:** Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. **Add Android/iOS Apps:** Follow the instructions in the Firebase Console to add Android and iOS apps to your project. This will involve downloading `google-services.json` (for Android) and `GoogleService-Info.plist` (for iOS) and placing them in the correct directories (`android/app/` and `ios/Runner/` respectively).
3. **Enable Services:**
   - **Authentication:** Go to "Authentication" in the Firebase Console and enable "Email/Password" sign-in method.
   - **Firestore Database:** Go to "Firestore Database" and create a new database in production mode. Set up security rules (e.g., `allow read, write: if request.auth != null;` for basic authenticated access).

### 2. Install Dependencies

After cloning the repository, navigate to the project root and run:

```bash
flutter pub get
```

### 3. Run the App

Connect a device or start an emulator, then run:

```bash
flutter run
```

## Project Structure

- `lib/main.dart`: The entry point of the application.
- `lib/app.dart`: Configures `MaterialApp`, theme, and routes.
- `lib/core/constants.dart`: Defines app-wide constants, colors, and routes.
- `lib/models/`: Contains data models like `Story`.
- `lib/providers/`: Manages application state, e.g., `ThemeProvider` for dark mode.
- `lib/services/`: Handles interaction with Firebase (authentication, Firestore).
- `lib/screens/`: Contains all the different pages/screens of the app.
- `lib/widgets/`: Reusable UI components.

