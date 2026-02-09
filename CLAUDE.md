# Project Guidelines

## Project Context

- **App:** GTD Focus — a Getting Things Done productivity app
- **Tech stack:** React 18 (CDN), Babel Standalone (JSX in-browser), Tailwind CSS (CDN), Firebase (Auth + Firestore), Google Gemini API (AI features)
- **Build:** None — single-file SPA, no build step. All code lives in `index.html`
- **Test:** Manual — open `index.html` in browser or deploy to Firebase Hosting
- **Lint:** None configured
- **Deploy:** `firebase deploy --only hosting` (manual, no CI/CD)
- **Hosting:** Firebase Hosting at `https://gtd-focus-b2063.web.app`
- **Architecture:** Monolithic SPA in `index.html` (~1300 lines)
  - Firebase init & config (lines 18–57)
  - Global styles & animations (lines 59–67)
  - `callGemini()` API helper (lines 78–99)
  - `Icons` object — all SVG icons (lines 102–130)
  - `useFirebaseData` hook — auth, Firestore load/save with 500ms debounce (lines 129–199)
  - Shared components: `TaskItem`, `SidebarItem` (lines 202–239)
  - Views: `LoginScreen`, `WeeklyReview`, `SettingsView`, `CalendarView`, `DashboardView`, `GTDGuideView` (lines 242–950)
  - Modals: `BrainDumpModal`, `ProcessModal` (lines 952–1165)
  - `App` root component — state, routing, handlers (lines 1167–1310)

## Firebase Config

- **Project ID:** `gtd-focus-b2063`
- **Auth:** Google OAuth (signInWithPopup)
- **Database:** Firestore — single doc per user at `users/{uid}`
- **Hosting:** Configured via `firebase.json` (serves from root, no-cache on HTML)
- **Config files:** `firebase.json`, `.firebaserc`

## GTD Workflow Implementation

The app implements all 5 GTD phases:

1. **Capture** — Inbox quick-add + Brain Dump modal (AI-parsed bulk import)
2. **Clarify** — ProcessModal with Smart Clarify (AI suggests next action, context, status) + decision tree (Trash/Someday/Reference/Do It/Delegate/Defer)
3. **Organize** — Statuses: `inbox`, `next`, `waiting`, `someday`, `reference`, `done`, `trash`. Contexts (@work, @home, etc.), Projects, Delegates, Due Dates
4. **Reflect** — Weekly Review page + Dashboard (summary cards, Focus Today, project progress)
5. **Engage** — Next Actions view filtered by context

## AI Features (require Gemini API key in Settings)

- **Smart Clarify:** Analyzes inbox item → suggests clarified text, context, status, project, due date, owner
- **Brain Dump:** Parses unstructured text (meeting notes, emails) into individual tasks with metadata
- **Project Breakdown:** Generates 3–5 next actions for a project
- **GTD Guide Q&A:** AI chat answering GTD methodology and app usage questions (static FAQ fallback without API key)

## Key Decisions Made

- Single `index.html` file — no build process, no bundling, no framework CLI
- React + Babel loaded via CDN for zero-tooling simplicity
- Firebase handles all backend (auth + data) — no custom server
- Gemini API called client-side with user-provided API key
- All data stored in a single Firestore document per user (tasks, contexts, delegates, apiKey)
- Debounced auto-save (500ms) on every state change
- No CI/CD — manual `firebase deploy --only hosting`
- GTD Guide view added as an interactive in-app walkthrough with AI Q&A

## Working Style

### Assumption Surfacing

Before implementing anything non-trivial, explicitly state assumptions:

```
ASSUMPTIONS I'M MAKING:
1. [assumption]
2. [assumption]
→ Correct me now or I'll proceed with these.
```

Never silently fill in ambiguous requirements. Surface uncertainty early.

### Confusion Management

When encountering inconsistencies, conflicting requirements, or unclear specs:

1. STOP — do not proceed with a guess.
2. Name the specific confusion.
3. Present the tradeoff or ask the clarifying question.
4. Wait for resolution before continuing.

Example: "I see X in file A but Y in file B. Which takes precedence?"

### Dead Code Hygiene

After refactoring or implementing changes:

- Identify code that is now unreachable
- List it explicitly
- Ask before removing: "Should I remove these now-unused elements: [list]?"

## Development Patterns

### Test First

When implementing non-trivial logic:

1. Write the test that defines success
2. Implement until the test passes
3. Show both

### Naive Then Optimize

For algorithmic work:

1. Implement the obviously-correct naive version first
2. Verify correctness
3. Then optimize while preserving behavior

## Communication Standards

- Quantify when possible ("this adds ~200ms latency" not "this might be slower")
- When stuck, say what you've tried rather than spinning silently
- After modifications, summarize what changed, what was intentionally left alone, and any concerns

## Conventions

- **Components:** PascalCase React function components (e.g., `DashboardView`, `TaskItem`)
- **State:** React hooks only (`useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`) — no external state library
- **Styling:** Tailwind utility classes inline, no CSS modules or styled-components
- **Icons:** Add new icons to the `Icons` object as inline SVG components
- **Views:** New views are React components rendered in the `MainContent` area, switched via the `view` state variable
- **Navigation:** Add `SidebarItem` in the sidebar `<nav>`, add routing case in the ternary chain near line 1325
- **Color palette:** Blue (primary/next), Red (urgent/inbox alert), Green (done/success), Purple (AI/delegates), Orange (waiting/today), Yellow (someday), Indigo (review/dashboard), Gray (default/reference)
- **AI calls:** Use `callGemini(apiKey, prompt, systemPrompt)` — always return JSON via `responseMimeType: "application/json"`
- **Task schema:** `{ id, text, status, context?, project?, dueDate?, owner?, created, notes? }`
- **Known gotchas:**
  - Firebase credentials are embedded in `index.html` (client-side only, restricted by Firebase security rules)
  - Babel transpiles JSX at runtime — no source maps, errors reference transpiled line numbers
  - All code is in one file — use ctrl+F / search by component name to navigate
