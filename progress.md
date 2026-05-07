# Progress

## 📂 Project Structure

```
src/
├── App.tsx                    — root router + layout shell
├── index.css                  — Tailwind v4 theme tokens + base styles
├── main.tsx                   — entry point
├── assets/                    — SVGs (logo, icons, movie poster placeholders)
├── components/
│   ├── layout/                — NavBar, Footer
│   ├── movie/                 — MovieCard, MovieCardHorizontal, CastCard, TrailerModal
│   └── ui/                    — Button, Rating, EmptyState, icons/
├── features/
│   ├── detail/                — MovieDetailHero, CastCrew, Overview
│   ├── favorites/             — FavoritesList
│   └── home/                  — HeroSection, TrendingSection, LatestSection
├── hooks/                     — useFavorites, useTrendingMovies, useLatestMovies,
│                                useMovieDetail, useMovieCredit, useMovieTrailer, useSearchMovies
├── lib/                       — api.ts (axios instance)
├── pages/                     — HomePage, MovieDetailPage, SearchPage, FavoritesPage
├── services/                  — movie.service.ts
└── types/                     — movie.types.ts
```

## 🏗 Architecture Score: 8.5/10

| Dimension                 | Score | Notes                                                          |
|---------------------------|-------|----------------------------------------------------------------|
| Separation of concerns    | 8/10  | Clean service → hook → feature → page layering                |
| Dependency direction      | 8/10  | Mostly one-way; no circular imports detected                   |
| Modularity & cohesion     | 8/10  | Feature folders well-scoped; barrel exports in place           |
| Error handling coverage   | 5/10  | React Query handles fetch errors but UI error states unclear   |
| Test coverage & quality   | 9/10  | Vitest unit + Playwright E2E; ≥80% coverage on hooks/services/components |
| Configuration management  | 7/10  | Vite + TS config present; env vars via TMDB not yet audited    |
| Security posture          | 7/10  | API key presumably in .env; no user input beyond search        |
| Scalability ceiling       | 8/10  | Feature-based structure scales well                            |
| **Overall**               | **8.5/10** |                                                           |

## ✅ Completed

- [x] Initial project scaffold (Vite + React 19 + TS + Tailwind v4)
- [x] NavBar with mobile hamburger + expandable search + desktop search
- [x] Home page: HeroSection, TrendingSection, LatestSection
- [x] Movie detail page: desktop overhaul (hero, poster, stats, overview)
- [x] Favorites page with heart button toggle
- [x] MovieDetailHero: mobile + desktop dual layout with lazy image loading
- [x] Fix NavBar `<a href>` → `<Link>` (SPA routing)
- [x] Fix FavoritesPage `window.location.href` → `navigate` + `movie: any` → `Movie` type
- [x] Fix MovieDetailHero tablet breakpoint gap (768–1023px was blank)
- [x] Remove redundant `mx-auto` from SearchPage
- [x] Delete orphaned dead file `FavoritesList.tsx`
- [x] Manual Playwright E2E test: all pages and features verified working (2026-05-07)
- [x] Add Vitest unit tests: hooks, services, components (2026-05-07)
- [x] Add Playwright E2E tests: home, detail, favorites, search (2026-05-07)

## 🔄 In Progress

_(none — all tasks complete)_

## 📋 Backlog

- [ ] Add error boundary / error UI states for failed API calls
- [ ] Audit TMDB API key exposure (should be in .env, check .env.example exists)
- [ ] Consider memoizing MovieCard renders with React.memo for list perf
- [ ] Add `<title>` / meta tags per page (SEO / a11y)

## 🚨 Blockers

_(none)_

## ✅ Test Suite Progress (Tasks 1–14)

| Task | Description | Status |
|------|-------------|--------|
| 1 | Install deps + scaffold configs | Done |
| 2 | E2E fixture files + mockApi helper | Done (JSON import syntax fixed) |
| 3 | Unit: movieService getMovieVideos | Done |
| 4 | Unit: useFavorites hook | Done |
| 5 | Unit: useSearchMovies hook | Done |
| 6 | Unit: useTrendingMovies + useLatestMovies | Done |
| 7 | Unit: Button component | Done |
| 8 | Unit: CastCard component | Done |
| 9 | Unit: MovieCard component | Done |
| 10 | E2E: home page spec | Done |
| 11 | E2E: movie detail page | Done |
| 12 | E2E: favorites flow | Done |
| 13 | E2E: search flow | Done |
| 14 | Verify coverage + update progress.md | Done |

## 📊 Session Stats

- Tokens used: not yet checked
- Last commit: 7ae5abc — Fixed overhaul desktop layout
- Session started: 2026-05-05
