# Implementation Detail: Authentication System

## 1. Overview
Implementation of a secure user authentication and registration system using Firebase Authentication and Cloud Firestore. The system manages user identity, role assignment (Employer/Freelancer), and profile initialization to ensure a seamless and secure onboarding experience.

## 2. Database Schema (Cloud Firestore)
**Collection:** `users`
The system uses the Firebase Auth UID as the document ID for the user profile to maintain a 1:1 relationship.

| Field | Type | Description |
| :--- | :--- | :--- |
| `fullName` | string | User's full legal name |
| `email` | string | Registered email address |
| `role` | string | `employer` or `freelancer` |
| `bio` | string | Short professional biography |
| `skills` | array | List of skills (primarily for freelancers) |
| `averageRating` | number | Initialized to 0; updated via rating system |
| `totalReviews` | number | Initialized to 0 |
| `createdAt` | timestamp | Date and time of account creation |
| `photoURL` | string | URL to user's profile image (Firebase Storage) |

## 3. Logic & Workflow

### 3.1 Registration Process (Sign-up)
1. **User Input:** User provides email, password, full name, and selects a role via `register.html`.
2. **Firebase Auth:** The system calls `createUserWithEmailAndPassword` using the Firebase CDN SDK.
3. **Profile Initialization:** Upon success, a document is created in the `users` Firestore collection using the `uid` as the key.
4. **Completion:** User is notified of success and redirected to `login.html`.

### 3.2 Login Process
1. **User Input:** User provides registered email and password via `login.html`.
2. **Verification:** The system calls `signInWithEmailAndPassword`.
3. **Role-Based Redirect**: 
   - The system fetches the `role` from the user's Firestore document.
   - If `role === 'employer'`, redirect to `pages/employer-dashboard.html`.
   - If `role === 'freelancer'`, redirect to `pages/freelancer-dashboard.html`.
4. **Error Handling**: Displays alerts for invalid credentials or missing profiles.

### 3.3 Session & Persistent State
- **Auth State Persistence**: Uses `onAuthStateChanged` from Firebase Auth to handle the asynchronous nature of session initialization. This prevents the "logged out" flash on page load.
- **Dynamic Header**: The `loadHeader` function in `layout.js` reacts to auth state changes:
    - **Authenticated**: Displays "Home", "Search", a role-specific "Dashboard" link, and the User Profile avatar.
    - **Unauthenticated**: Hides navigation links to maintain focus on the landing page CTAs.
- **Logout**: Triggered via `auth.signOut()`, clearing the session and returning the user to `index.html`.

## 4. Frontend Implementation (Vanilla JS/CSS)

### 4.1 Pages & Components
- **`index.html`**: Features dual CTA buttons ("Login to Continue" and "Create Account") that update dynamically via `onAuthStateChanged`.
- **`login.html` & `register.html`**: 
    - **Centered Layout**: Specifically styled with `display: flex`, `align-items: center`, and `justify-content: center` on the `<main>` tag to keep forms perfectly centered between header and footer.
    - **Responsive Design**: Uses the `.rating-container` class with a refined `max-width` of `600px` and `width: 90%` for better visibility on desktops and mobiles.
    - **Validation**: Client-side checks for email formats and password coincidence.

### 4.2 UI/UX Details
- **Loading States**: Submit buttons are disabled and text updated (e.g., "Logging in...") during API calls.
- **Feedback**: Immediate feedback provided via browser `alert()` for registration and login results.
- **Styling**: Fully integrated with `assets/css/styles.css` using a consistent design language.

## 5. Technical Constraints
- **Language**: All UI text and code comments in **English**.
- **Styling**: Responsive layout using **CSS Flexbox/Grid**.
- **Architecture**: No frameworks; use **Vanilla JavaScript (ES6+)**.
- **Backend**: **Firebase 9+ Modular SDK** loaded via CDN (GStatic) to ensure compatibility without needing a build step (Webpack/Vite).
- **Security**: User profiles are keyed by their unique Firebase UID to ensure secure data mapping.
