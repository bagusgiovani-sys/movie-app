# Movie Explorer App

**Live demo:** https://movie-app-by-giovani.vercel.app/

A React 19 movie browser built with TypeScript, Vite, Tailwind CSS v4, and TanStack Query. Fetches live data from the TMDB API, supports favoriting movies, searching, and viewing trailers.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 |
| Data fetching | TanStack Query v5 + Axios |
| Routing | React Router v7 |
| Animations | Framer Motion |
| Toasts | Sonner |
| Unit tests | Vitest + React Testing Library + jsdom |
| E2E tests | Playwright (Chromium) |

---

## Features

- **Home page** — Hero section showcasing the top trending movie, horizontal carousel of trending movies, latest releases grid
- **Movie detail page** — Full detail view with backdrop, poster, rating, genres, overview, runtime, cast & crew cards, YouTube trailer modal
- **Favorites** — Heart-toggle any movie; favorites persist to `localStorage` with toast feedback
- **Search** — Live search via the NavBar, results page with movie cards
- **Responsive** — Mobile-first layout, full desktop overhaul, tablet breakpoints handled

---

## Project Structure

```
src/
├── components/
│   ├── layout/        # NavBar, Footer
│   ├── movie/         # MovieCard, MovieCardHorizontal, CastCard, TrailerModal
│   └── ui/            # Button, Rating, EmptyState, icons
├── features/
│   ├── detail/        # MovieDetailHero, Overview, CastCrew
│   ├── favorites/     # FavoritesEmptyState
│   └── home/          # HeroSection, TrendingSection, LatestSection
├── hooks/             # useFavorites, useTrendingMovies, useLatestMovies,
│                      # useMovieDetail, useMovieCredit, useMovieTrailer, useSearchMovies
├── lib/               # api.ts — Axios instance with TMDB base URL + auth
├── pages/             # HomePage, MovieDetailPage, SearchPage, FavoritesPage
├── services/          # movie.service.ts — all TMDB API calls
└── types/             # movie.types.ts

src/__tests__/         # Unit tests (Vitest + RTL)
├── setup.ts
├── hooks/
├── services/
└── components/

e2e/                   # End-to-end tests (Playwright)
├── fixtures/          # Mock JSON responses (no real API calls during tests)
├── helpers/           # mockApi.ts — shared page.route() setup
├── home.spec.ts
├── movieDetail.spec.ts
├── favorites.spec.ts
└── search.spec.ts
```

---

## Getting Started

### 1. Environment

Create a `.env` file in the project root:

```
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_TMDB_ACCESS_TOKEN=your_tmdb_read_access_token
```

Get your key at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api).

### 2. Install

```bash
npm install
```

### 3. Run

```bash
npm run dev        # dev server on http://localhost:3000
npm run build      # production build
npm run preview    # preview production build
```

---

## Testing

### Unit Tests

Unit tests verify individual hooks, service functions, and components in isolation. They run in a fake browser environment (jsdom) with no network calls — the service layer is mocked.

```bash
npm run test          # run all unit tests once
npm run test:watch    # re-run on file changes
npm run coverage      # run with coverage report
```

**What's covered (38 tests):**

| File | Tests |
|---|---|
| `movie.service.ts` | `getMovieVideos` filter logic (YouTube-only, Trailer-type-only) |
| `useFavorites` | localStorage init, add/remove toggle, persistence, isFavorite, toasts, corrupted data |
| `useSearchMovies` | disabled when query empty, calls service with query, returns data |
| `useTrendingMovies` | calls service on mount, returns data |
| `useLatestMovies` | calls service on mount, returns data |
| `Button` | renders, disabled state, onClick, secondary variant, favorite variant |
| `CastCard` | name, character, profile image, null fallback |
| `MovieCard` | title, rating, poster, null poster, navigation |

### End-to-End (E2E) Tests

E2E tests launch a real Chromium browser and interact with the running app as a user would — navigating pages, clicking buttons, filling in the search box. All TMDB API calls are intercepted by `page.route()` and return fixture JSON, so the tests are offline-capable and deterministic.

```bash
npm run test:e2e       # run all E2E tests (starts dev server automatically)
npm run test:e2e:ui    # open Playwright's visual test runner
```

**What's covered (22 tests):**

| Spec | Tests |
|---|---|
| `home.spec.ts` | Hero title, Watch Trailer button, See Detail button, Trending Now section, Latest Release section |
| `movieDetail.spec.ts` | URL navigation, title, rating, genre, overview, Cast & Crew section, cast member |
| `favorites.spec.ts` | Empty state, add from detail page persists, remove restores empty state |
| `search.spec.ts` | Navigate to search URL, heading, subtitle, result card, click navigates to detail |

---

## API

All data comes from [The Movie Database (TMDB)](https://developer.themoviedb.org/docs/getting-started).

| Endpoint | Used for |
|---|---|
| `GET /trending/movie/day` | Home — trending carousel |
| `GET /movie/now_playing` | Home — latest releases |
| `GET /search/movie?query=` | Search page |
| `GET /movie/:id` | Movie detail page |
| `GET /movie/:id/credits` | Cast & crew |
| `GET /movie/:id/videos` | Trailer modal (YouTube trailers only) |

Images: `https://image.tmdb.org/t/p/original/{poster_path}`

---

## Architecture Notes

- **Service → Hook → Feature → Page** layering — data flows one way, no circular imports
- `movie.service.ts` is the only file that touches the network; hooks wrap it with React Query
- `useFavorites` is localStorage-backed state, no React Query
- Barrel exports in `src/hooks/index.ts` and `src/services/index.ts`
- Unit tests mock at the service barrel boundary (`vi.mock('../../services')`) so hooks are tested in isolation
- E2E tests use Playwright's LIFO route matching — specific routes registered last win over the catch-all `/movie/*`
