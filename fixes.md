# Fixes & Changes Log

<!-- Template:
## [YYYY-MM-DD HH:MM] — [commit hash]
**Type:** `bug` | `refactor` | `perf` | `feat` | `dead-code` | `arch`
**File(s):** `src/path/to/file.ts`
**Problem:** [what was wrong]
**Fix:** [what was changed and why]
**Impact:** [measured or estimated improvement]
---
-->

## [2026-05-05 session] — pending commit

**Type:** `bug` + `dead-code`
**File(s):** `src/components/layout/NavBar.tsx`, `src/pages/FavoritesPage.tsx`, `src/features/detail/MovieDetailHero.tsx`, `src/pages/SearchPage.tsx`, `src/features/favorites/FavoritesList.tsx`

**Problem 1:** NavBar used `<a href>` for Home and Favorites links — caused full page reload on every nav click instead of SPA client-side routing.
**Fix:** Replaced all 4 anchor tags with `<Link to>` from react-router-dom.

**Problem 2:** FavoritesPage used `window.location.href` to navigate to movie detail page — same full-reload issue.
**Fix:** Added `useNavigate()` inside `FavoriteItem` and replaced both `window.location.href` assignments with `navigate(...)`.

**Problem 3:** `FavoriteItem` in FavoritesPage typed `movie: any` — violates strict TypeScript.
**Fix:** Added `import type { Movie }` and typed the prop correctly.

**Problem 4:** `MovieDetailHero` breakpoint gap — mobile hid at `md:hidden` (≥768px) but desktop only showed at `hidden lg:block` (≥1024px), leaving 768–1023px rendering nothing.
**Fix:** Changed desktop wrapper to `hidden md:block`.

**Problem 5:** `SearchPage` had `layout-gutter mx-auto` — `mx-auto` is redundant since `layout-gutter` already sets `margin-inline: auto`.
**Fix:** Removed `mx-auto`.

**Problem 6:** `FavoritesList.tsx` was never imported anywhere — orphaned dead component.
**Fix:** Deleted the file.

**Impact:** Navigation no longer causes full page reloads (state preserved, faster nav). Tablet range (768–1023px) now renders movie detail correctly. TypeScript strict compliance restored.
---
