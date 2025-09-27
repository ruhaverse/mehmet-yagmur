# Project Structure Documentation

## Overview
This document provides an overview of the project structure, key components, and their locations to help the team understand the organization of the codebase.

---

## Main Directories

### 1. `CleanMobileApp`
- **Description**: Contains the core mobile application code.
- **Key Files**:
  - `src/HomePage.tsx`: Home page component with API integration.
  - `src/lib/apiService.ts`: API service for backend communication.
  - `App.tsx`: Main entry point for the React Native application.

### 2. `Shareup-Mobile-App-CLI`
- **Description**: Includes CLI tools and utilities for the Shareup mobile app.
- **Key Files**:
  - `app/redux/swapedImages.js`: Redux slice for managing swapped images.
  - `app/util/ShareupAuthentication.js`: Authentication component for user login and session management.

### 3. `mobile-app`
- **Description**: Root directory for the project.
- **Key Files**:
  - `index.js`: Entry point for the application.
  - `package.json`: Project dependencies and scripts.

---

## Key Components

### 1. `HomePage`
- **Location**: `CleanMobileApp/src/HomePage.tsx`
- **Purpose**: Displays the home page with a welcome message and API integration.

### 2. `ShareupAuthentication`
- **Location**: `Shareup-Mobile-App-CLI/app/util/ShareupAuthentication.js`
- **Purpose**: Handles user authentication and session management.

### 3. `Redux Store`
- **Location**: `Shareup-Mobile-App-CLI/app/redux/store.js`
- **Purpose**: Centralized state management for the application.

---

## Notes
- Ensure all dependencies are installed using `npm install` before running the application.
- Use `npx react-native start` to start the Metro bundler.
- For platform-specific builds, use `npx react-native run-android` or `npx react-native run-ios`.

---

## Contribution Guidelines
- Follow the established folder structure.
- Document any new components or utilities in this file.
- Commit changes with clear and descriptive messages.

---

For any questions or issues, please contact the project maintainer.