# 🧠 MindEase - Neuroadaptive Productivity Dashboard

![MindEase Logo](/assets/images/icons/Logo.png)

**MindEase** is a fully accessible, neuroadaptive productivity web application. It is designed around the principles of neuroarchitecture and strict accessibility (WCAG 2.2 AA) to support users with different cognitive and visual needs.

---

## Figma:
[MindEase UI/UX](https://www.figma.com/design/p6jsQDxXRoS8ukHQ9a6Kff/MindEase-UI-UX?node-id=11-5253&t=VZfYF8xKgwRlcss0-1)

## 🏗️ Architecture & Technical Stack

The project has been refactored to an optimized, strict-typed modern web stack, eliminating context-hell and relying on explicit global state management connected seamlessly to a backend-as-a-service.

- **Framework:** React 18.3.1 (via Vite for lightning-fast HMR and building)
- **Language:** TypeScript (Strict Mode `tsconfig.json` enabled, `noEmit` validation, ZERO `any` abuse)
- **State Management:** Zustand (8 isolated stores, replacing React Context API)
- **Backend / Database:** Firebase v12 (Auth, Firestore) with Repository Adapters.
- **Styling:** Tailwind CSS v4 (using native CSS variables for tokens and themes)
- **UI Components:** Radix UI / shadcn/ui primitives.
- **Testing:** Vitest + React Testing Library (with v8 Coverage).
- **Accessibility:** 100% WCAG 2.2 AA compliant. 

---

## ⚙️ Technical Decisions & Patterns

### 1. State Management (Zustand + Persist)
We abandoned the React Context API to solve unnecessary re-renders. Zustand handles global states using explicit selectors (`useStore(state => state.value)`). Critical states like Pomodoro timers, Accessibility Preferences, and Theme are persisted locally via `localStorage` and synced remotely via Firestore.

### 2. Firebase Integration (Repository Pattern)
Firebase SDK is **never** invoked directly in UI components. We employ a strict **Repository Pattern**:
- `FirebaseUserRepository`: Handles profile metadata, theme syncing, and accessibility preferences.
- `FirebaseTaskRepository`: Syncs the Kanban tasks using real-time listeners or asynchronous updates.
- `FirebaseAuthService`: Acts as an adapter for `signInWithEmailAndPassword` and auth state listeners.
All Firebase configurations are injected via Vite's `import.meta.env`.

### 3. Componentization & Error States
Large components (like `TasksScreen`) handle explicit states for data loading (`isLoading`) and potential failures (`error`). We use optimistic UI updates where applicable to ensure zero latency for the user, rolling back state and showing `sonner` toasts if the network request fails.

### 4. Accessibility (A11y) First
- **Keyboard Navigation:** Native `tabindex` and semantic HTML ensure the entire app is navigable without a mouse.
- **Contrasts & Themes:** Tokens map dynamically. We have `light`, `dark`, and a specialized `high-contrast` mode.
- **ARIA Attributes:** Strict adherence to `aria-label`, `aria-expanded`, and `aria-live` for dynamic content.
- **Reduced Motion:** Components utilizing `framer-motion` respect the user's `reduceMotion` preference from the accessibility store.

---

## 🚀 Local Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Clone & Install
```bash
git clone https://github.com/your-org/mindease-web.git
cd mindease-web
npm install
```

### 2. Environment Variables
Create a `.env` file at the root of the project (or rename `.env.example` if available) and configure your Firebase keys. Note the `VITE_` prefix required by Vite.

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=your_database_url
```

### 3. Running the App
```bash
# Start development server
npm run dev
```
The application will be available at `http://localhost:5173`.

### 4. Running Tests & Linters
```bash
# Run Unit Tests and collect coverage
npm run test:coverage

# Validate TypeScript Strict Types
npx tsc --noEmit
```

---

## 📂 Repository Structure

```text
src/
├── app/
│   ├── components/       # Reusable and Domain UI Components
│   │   └── ui/           # Radix/Shadcn building blocks
│   └── App.tsx           # Application Root and Toaster Provider
├── config/
│   └── firebase.ts       # Firebase initialization
├── design-system/        # TS exported design tokens
├── services/
│   └── firebase/         # Repository Adapters for Firestore/Auth
├── stores/               # Zustand state slices (Auth, Tasks, Pomodoro, etc.)
├── styles/               # Native CSS, Tailwind base, and Theme tokens
└── __tests__/            # Setup and Vitest mocks
```

---

## 👥 Agent Architecture (For Contributors)
When contributing, rely on the automated sub-agents defined in `.gemini/agents/`. They enforce our standard workflows:
- `mindease-a11y`: Guarantees WCAG 2.2 AA in any PR.
- `mindease-zustand`: Enforces optimal store usage.
- `mindease-ui`: Validates Tailwind v4 and Design Tokens.
- `mindease-firebase`: Secures backend adapters.

Read the `@AGENTS.md` documentation for full details on how AI agents orchestrate the MindEase codebase.
