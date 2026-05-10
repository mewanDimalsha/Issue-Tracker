# Issue Tracker — React Native

A mobile issue tracking app built with Expo, React Native, and TypeScript.

---

## Tech Stack

- **Framework** — Expo (SDK 54) with Expo Router
- **Language** — TypeScript
- **State Management** — Zustand with persist middleware
- **Persistence** — AsyncStorage via Zustand persist
- **Validation** — Zod
- **Styling** — NativeWind (Tailwind CSS for React Native)
- **Navigation** — Expo Router (file-based)

---

## Setup

### Prerequisites

- Node.js 18+
- Expo Go app on your phone OR an iOS/Android emulator

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/mewanDimalsha/Issue-Tracker
cd Issue-Tracker

# 2. Install dependencies
npm install

# 3. Start the development server
npx expo start --clear
```

### Running on your device

- Install **Expo Go** from the App Store or Play Store
- Scan the QR code from the terminal

### Running on emulator

- iOS: Press `i` in the terminal (requires Xcode)
- Android: Press `a` in the terminal (requires Android Studio)

---

## Test Credentials

Email: mewan@example.com
Password: mewan123
Email: admin@example.com
Password: admin123

---

## Architecture Decisions

### Expo Router over React Navigation

The project uses file-based routing via Expo Router. Routes are defined
by the file structure inside the `app/` directory.

### Zustand over Redux Toolkit

Zustand was chosen for three reasons:

1. Built-in `persist` middleware handles AsyncStorage with one line
2. No boilerplate — no actions, reducers, or slices
3. Selector-based subscriptions prevent unnecessary rerenders

### Zod for validation

Zod schemas serve as both the validation layer and the TypeScript
type source via `z.infer<>`. This means form data types and validation
rules are defined once and can never go out of sync.

### Optimistic Updates

Every write operation (create, update, resolve) updates the UI
immediately before the API responds. If the API fails, the change
is queued in a sync queue persisted to AsyncStorage. This means
the app remains fully usable offline and no user action is ever lost.

---

## Project Structure

Issue-Tracker/
├── app/ # Expo Router - App screens & navigation
│ ├── \_layout.tsx # Root layout wrapper
│ ├── login.tsx # Login screen
│ ├── (tabs)/ # Tabbed navigation group
│ │ ├── index.tsx # Home/Dashboard tab
│ │ ├── issues.tsx # Issues list tab
│ │ └── profile.tsx # User profile tab
│ └── issue/ # Issue management screens
│ ├── create.tsx # Create new issue
│ └── [id]/ # Dynamic routes
│ ├── index.tsx # View issue details
│ └── edit.tsx # Edit issue
│
├── components/ # Reusable React components
│ ├── detailRow.tsx # Single detail row display
│ ├── issueCard.tsx # Issue card component
│ ├── priorityBadge.tsx # Priority level badge
│ ├── statCard.tsx # Statistics card
│ ├── statRow.tsx # Statistics row
│ └── statusBadge.tsx # Status indicator badge
│
├── store/ # State management (Zustand/Context)
│ ├── authStore.ts # Authentication state
│ ├── issueStore.ts # Issues state
│ └── themeStore.ts # Theme/UI state
│
├── hooks/ # Custom React hooks
│ └── debounce.ts # Debounce utility hook
│
├── utils/ # Helper functions & utilities
│ ├── validators.ts # Form/data validation functions
│ └── validators.test.ts # Validator tests
│
├── types/ # TypeScript type definitions
│ └── index.ts # Global types & interfaces
│
├── api/ # API integration
│ ├── mockApi.ts # Mock API for development
│ └── seeds.ts # Sample/seed data
│
├── assets/ # Static assets
│ └── images/ # Image files
│
└── [Config Files] # Build & dev configuration
├── app.json # Expo app configuration
├── package.json # Dependencies & scripts
├── tsconfig.json # TypeScript config
├── tailwind.config.js # Tailwind CSS config (via NativeWind)
├── babel.config.js # Babel transpiler config
├── jest.config.js # Jest testing config
├── metro.config.js # Metro bundler config
└── eslint.config.js # ESLint linting rules

---

## What Was Completed

- [x] Authentication with email/password validation (Zod)
- [x] Mock login with seeded users and credential checking
- [x] Dashboard with issue counts by status
- [x] Issue list with search, status filter, and priority filter
- [x] Create issue with full validation
- [x] Edit existing issues
- [x] Issue detail screen with full information
- [x] Resolve issue with confirmation dialog
- [x] Delete issue with confirmation dialog
- [x] Offline-first architecture with optimistic updates
- [x] Sync queue — failed API calls are queued and retried
- [x] Local persistence — all data survives app restart
- [x] Pull-to-refresh
- [x] Loading, empty, and error states on all screens
- [x] Dark mode support
- [x] Unsynced and local-only indicators on issue cards
- [x] Profile screen with sync status and stats
- [x] Unit and integration tests

## What Was Skipped

- [ ] Real backend — mock API used throughout
- [ ] Image or file attachments
- [ ] Push notifications
- [ ] Export to JSON/CSV (architecture is in place, not wired to UI)

---

## Assumptions

- Any issue created while offline is kept locally and synced when
  the API succeeds on next attempt
- The mock API fails 10% of the time intentionally to demonstrate
  error handling and the offline sync queue
- Passwords are stored in plain text in the mock seed. In production,
  passwords would be hashed server-side and never stored on device
- AsyncStorage is used over SQLite — sufficient for this data volume.
  SQLite would be appropriate if issues had attachments or if
  queries needed to be more complex
- Redux Toolkit would be appropriate for a larger team or a codebase
  that needs time-travel debugging. For this scale, Zustand is the
  right tool.
