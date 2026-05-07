# Test Suite Design — Movie App

**Date:** 2026-05-07
**Status:** Approved
**Goal:** Bring test coverage from 0/10 to 10/10 with a unit layer (Vitest + RTL) and an E2E layer (Playwright).

---

## Context

The app is a React 19 + TypeScript + Vite SPA that fetches data from the TMDB API. It has:
- A service layer (`movie.service.ts`) — pure async functions over axios
- React Query hooks wrapping each service function
- `useFavorites` — localStorage-backed state with sonner toasts
- Four pages: Home, MovieDetail, Search, Favorites
- Key components: MovieCard, MovieCardHorizontal, CastCard, TrailerModal, Button, NavBar

No test infrastructure exists. Zero test files, no Vitest, no Playwright, no jsdom.

---

## Decisions

| Decision | Choice | Reason |
|---|---|---|
| API mocking strategy | vi.mock (unit) + page.route() (E2E) | Service layer is a clean mock boundary; avoids MSW/axios XHR friction |
| CI | None for now | Get tests stable locally first; wire CI in a separate session |
| Playwright browsers | Chromium only | App uses no browser-specific APIs; 3× faster than all-browser |

---

## Architecture

### Unit Layer — Vitest + React Testing Library + jsdom

**New dependencies (devDependencies):**
- `vitest`
- `@vitest/coverage-v8`
- `@testing-library/react`
- `@testing-library/user-event`
- `@testing-library/jest-dom`
- `jsdom`

**Config:** `vitest.config.ts` (separate from `vite.config.ts` to keep build config clean)

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
  },
})
```

**Setup file:** `src/__tests__/setup.ts`
- Import `@testing-library/jest-dom` matchers
- Mock `sonner` globally so toasts don't error in jsdom

**Mock strategy:** `vi.mock('../../../services')` at the top of each hook test file. Service functions return resolved promises with fixture data typed against `movie.types.ts`.

### E2E Layer — Playwright

**New dependency (devDependency):** `@playwright/test`

**Config:** `playwright.config.ts`
- Browser: Chromium only
- `baseURL`: `http://localhost:3000`
- `webServer`: auto-starts `npm run dev` before the suite, waits for port 3000
- `use.trace`: `on-first-retry` for debugging

**Mocking strategy:** `page.route('**/trending/**', ...)` etc. in each spec or a shared `mockApi` helper. Fixtures are JSON files in `e2e/fixtures/` typed to match real TMDB response shapes.

---

## Test Targets

### Unit Tests (`src/__tests__/`)

#### `hooks/useFavorites.test.ts`
- Initialises empty when localStorage is empty
- Loads persisted favorites from localStorage on mount
- `toggleFavorite` adds a movie not yet in the list
- `toggleFavorite` removes a movie already in the list
- Persists updated list to localStorage after each toggle
- `isFavorite` returns true for a favorited id, false otherwise
- Fires `toast.success` on add, `toast` on remove
- Handles corrupted localStorage without throwing

#### `hooks/useSearchMovies.test.ts`
- Query is disabled (does not call `searchMovies`) when `query` is empty string
- Query is enabled and calls `searchMovies(query)` when query is non-empty
- Returns data from the service

#### `hooks/useTrendingMovies.test.ts`
- Calls `getTrendingMovies` and returns results

#### `hooks/useLatestMovies.test.ts`
- Calls `getLatestMovies` and returns results

#### `services/movieService.test.ts`
- `getMovieVideos` filters out non-YouTube entries
- `getMovieVideos` filters out non-Trailer types (teasers, clips)
- `getMovieVideos` returns empty array when no matching videos

#### `components/MovieCard.test.tsx`
- Renders movie title
- Renders formatted rating
- Renders poster image (with alt text)
- Shows placeholder when `poster_path` is null
- Click navigates to `/movie/:id`

#### `components/Button.test.tsx`
- Renders children
- Applies primary styles by default
- Applies secondary styles when `variant="secondary"`
- Is disabled and not clickable when `disabled` prop is set

#### `components/CastCard.test.tsx`
- Renders actor name and character
- Renders profile image when `profile_path` is present
- Renders fallback when `profile_path` is null

### E2E Tests (`e2e/`)

All specs use `page.route()` to intercept TMDB API calls and return fixture JSON.

#### `home.spec.ts`
- Hero section renders the first trending movie's title
- "Watch Trailer" button is present
- "See Detail" button is present
- Trending Now section heading is visible
- At least one trending movie card is rendered
- Latest Release section heading is visible
- At least one latest movie card is rendered

#### `movieDetail.spec.ts`
- Clicking "See Detail" on the hero navigates to `/movie/:id`
- Movie title is visible on the detail page
- Rating badge is visible
- Genre badge is visible
- Overview text is visible
- Cast & Crew section heading is visible
- At least one cast member card is rendered

#### `favorites.spec.ts`
- Favorites page shows empty state when no favorites
- Clicking the heart on a detail page adds the movie to favorites
- Added movie appears on the Favorites page
- Clicking the heart again removes the movie
- Favorites page shows empty state after all removed

#### `search.spec.ts`
- Typing a query and pressing Enter navigates to `/search?q=<query>`
- Search Results heading is visible
- "Showing results for" subtitle contains the query
- At least one result card is rendered
- Clicking a result navigates to `/movie/:id`

---

## File Layout

```
src/
  __tests__/
    setup.ts
    hooks/
      useFavorites.test.ts
      useSearchMovies.test.ts
      useTrendingMovies.test.ts
      useLatestMovies.test.ts
    services/
      movieService.test.ts
    components/
      MovieCard.test.tsx
      Button.test.tsx
      CastCard.test.tsx
e2e/
  fixtures/
    trending.json          — 20-item array of Movie objects
    nowPlaying.json        — 20-item array of Movie objects
    movieDetail.json       — single MovieDetail object
    credits.json           — { cast: Cast[] }
    videos.json            — { results: Video[] } (mix of trailers + non-trailers)
    search.json            — { results: Movie[] }
  helpers/
    mockApi.ts             — shared page.route() setup called in beforeEach
  home.spec.ts
  movieDetail.spec.ts
  favorites.spec.ts
  search.spec.ts
vitest.config.ts
playwright.config.ts
```

---

## npm Scripts

| Script | Command |
|---|---|
| `test` | `vitest run` |
| `test:watch` | `vitest` |
| `test:e2e` | `playwright test` |
| `test:e2e:ui` | `playwright test --ui` |
| `coverage` | `vitest run --coverage` |

---

## Success Criteria

- `npm run test` passes with zero failures
- `npm run coverage` shows ≥ 80% line coverage on hooks, services, and targeted components
- `npm run test:e2e` passes all four spec files in Chromium
- No real network calls are made during any test run
