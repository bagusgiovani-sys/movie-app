# Test Suite Implementation Plan — Movie App

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full Vitest unit test suite and Playwright E2E suite to the movie app, bringing test coverage from 0/10 to 10/10.

**Architecture:** Unit tests mock the service layer via `vi.mock('../services')` so hooks are tested in isolation with React Query wrappers. E2E tests use Playwright's `page.route()` to intercept all TMDB API calls and return fixture JSON, keeping the suite deterministic and offline-capable.

**Tech Stack:** Vitest, @testing-library/react, @testing-library/user-event, @testing-library/jest-dom, jsdom, @playwright/test

---

## File Map

**Create:**
- `vitest.config.ts` — Vitest config (jsdom, globals, setupFiles)
- `playwright.config.ts` — Chromium-only, port 3000, page.route mocking
- `src/__tests__/setup.ts` — jest-dom import + global sonner mock
- `src/__tests__/services/movieService.test.ts`
- `src/__tests__/hooks/useFavorites.test.ts`
- `src/__tests__/hooks/useSearchMovies.test.ts`
- `src/__tests__/hooks/useTrendingMovies.test.ts`
- `src/__tests__/hooks/useLatestMovies.test.ts`
- `src/__tests__/components/Button.test.tsx`
- `src/__tests__/components/CastCard.test.tsx`
- `src/__tests__/components/MovieCard.test.tsx`
- `e2e/fixtures/trending.json`
- `e2e/fixtures/nowPlaying.json`
- `e2e/fixtures/movieDetail.json`
- `e2e/fixtures/credits.json`
- `e2e/fixtures/videos.json`
- `e2e/fixtures/search.json`
- `e2e/helpers/mockApi.ts`
- `e2e/home.spec.ts`
- `e2e/movieDetail.spec.ts`
- `e2e/favorites.spec.ts`
- `e2e/search.spec.ts`

**Modify:**
- `package.json` — add test scripts
- `tsconfig.app.json` — add vitest/globals + jest-dom types
- `src/components/ui/Button.tsx` — add aria-label to favorite variant

---

## Task 1: Install dependencies + scaffold configs

**Files:**
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `src/__tests__/setup.ts`
- Modify: `package.json`
- Modify: `tsconfig.app.json`

- [ ] **Step 1: Install unit test packages**

```bash
npm install -D vitest @vitest/coverage-v8 @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

Expected: packages installed, no peer-dep errors.

- [ ] **Step 2: Install Playwright + Chromium browser**

```bash
npm install -D @playwright/test
npx playwright install chromium
```

Expected: chromium browser binary downloaded.

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/__tests__/**/*.test.{ts,tsx}'],
  },
})
```

- [ ] **Step 4: Create `playwright.config.ts`**

```ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { channel: 'chromium' },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: true,
  },
})
```

- [ ] **Step 5: Create `src/__tests__/setup.ts`**

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 6: Add test scripts to `package.json`**

In the `"scripts"` object, add after `"preview"`:

```json
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui",
"coverage": "vitest run --coverage"
```

- [ ] **Step 7: Add type declarations to `tsconfig.app.json`**

Change the `"types"` line from:
```json
"types": ["vite/client"],
```
to:
```json
"types": ["vite/client", "vitest/globals", "@testing-library/jest-dom"],
```

- [ ] **Step 8: Verify Vitest setup runs**

```bash
npm run test
```

Expected output: `No test files found` (or similar — zero tests, zero failures). If you see an error about config or imports, fix before continuing.

- [ ] **Step 9: Commit**

```bash
git add vitest.config.ts playwright.config.ts src/__tests__/setup.ts package.json tsconfig.app.json package-lock.json
git commit -m "chore: install and configure Vitest + Playwright test infrastructure"
```

---

## Task 2: Create E2E fixture files + mockApi helper

**Files:**
- Create: `e2e/fixtures/trending.json`
- Create: `e2e/fixtures/nowPlaying.json`
- Create: `e2e/fixtures/movieDetail.json`
- Create: `e2e/fixtures/credits.json`
- Create: `e2e/fixtures/videos.json`
- Create: `e2e/fixtures/search.json`
- Create: `e2e/helpers/mockApi.ts`

- [ ] **Step 1: Create `e2e/fixtures/trending.json`**

```json
{
  "page": 1,
  "results": [
    {
      "id": 1001,
      "title": "Test Movie Alpha",
      "poster_path": "/alpha.jpg",
      "backdrop_path": "/alpha-backdrop.jpg",
      "overview": "A test movie overview for alpha.",
      "release_date": "2026-01-15",
      "vote_average": 8.2,
      "vote_count": 1500,
      "genre_ids": [28],
      "popularity": 450.5,
      "original_language": "en",
      "original_title": "Test Movie Alpha",
      "adult": false
    },
    {
      "id": 1002,
      "title": "Test Movie Beta",
      "poster_path": "/beta.jpg",
      "backdrop_path": "/beta-backdrop.jpg",
      "overview": "A test movie overview for beta.",
      "release_date": "2026-02-20",
      "vote_average": 7.5,
      "vote_count": 800,
      "genre_ids": [35],
      "popularity": 300.2,
      "original_language": "en",
      "original_title": "Test Movie Beta",
      "adult": false
    }
  ],
  "total_pages": 1,
  "total_results": 2
}
```

- [ ] **Step 2: Create `e2e/fixtures/nowPlaying.json`**

```json
{
  "page": 1,
  "results": [
    {
      "id": 1003,
      "title": "Test Movie Gamma",
      "poster_path": "/gamma.jpg",
      "backdrop_path": "/gamma-backdrop.jpg",
      "overview": "A test movie overview for gamma.",
      "release_date": "2026-03-10",
      "vote_average": 6.9,
      "vote_count": 600,
      "genre_ids": [18],
      "popularity": 200.0,
      "original_language": "en",
      "original_title": "Test Movie Gamma",
      "adult": false
    },
    {
      "id": 1004,
      "title": "Test Movie Delta",
      "poster_path": "/delta.jpg",
      "backdrop_path": "/delta-backdrop.jpg",
      "overview": "A test movie overview for delta.",
      "release_date": "2026-04-05",
      "vote_average": 7.1,
      "vote_count": 400,
      "genre_ids": [27],
      "popularity": 180.5,
      "original_language": "en",
      "original_title": "Test Movie Delta",
      "adult": false
    }
  ],
  "total_pages": 1,
  "total_results": 2
}
```

- [ ] **Step 3: Create `e2e/fixtures/movieDetail.json`**

Note: `id` must match the first trending movie (`1001`) so the "See Detail" navigation lands on a mocked detail page.

```json
{
  "id": 1001,
  "title": "Test Movie Alpha",
  "poster_path": "/alpha.jpg",
  "backdrop_path": "/alpha-backdrop.jpg",
  "overview": "A test movie overview for alpha.",
  "release_date": "2026-01-15",
  "vote_average": 8.2,
  "vote_count": 1500,
  "genre_ids": [28],
  "popularity": 450.5,
  "original_language": "en",
  "original_title": "Test Movie Alpha",
  "adult": false,
  "runtime": 120,
  "status": "Released",
  "tagline": "Test tagline here.",
  "budget": 10000000,
  "revenue": 50000000,
  "genres": [{ "id": 28, "name": "Action" }]
}
```

- [ ] **Step 4: Create `e2e/fixtures/credits.json`**

```json
{
  "id": 1001,
  "cast": [
    {
      "id": 201,
      "name": "Actor One",
      "character": "The Hero",
      "profile_path": "/actor1.jpg",
      "order": 0
    },
    {
      "id": 202,
      "name": "Actor Two",
      "character": "The Villain",
      "profile_path": null,
      "order": 1
    }
  ],
  "crew": []
}
```

- [ ] **Step 5: Create `e2e/fixtures/videos.json`**

Contains a mix: one YouTube Trailer (passes filter), one Teaser (filtered out), one Vimeo Trailer (filtered out).

```json
{
  "id": 1001,
  "results": [
    {
      "id": "v1",
      "key": "dQw4w9WgXcQ",
      "name": "Official Trailer",
      "site": "YouTube",
      "type": "Trailer",
      "official": true,
      "published_at": "2026-01-01T00:00:00.000Z"
    },
    {
      "id": "v2",
      "key": "abc123",
      "name": "Official Teaser",
      "site": "YouTube",
      "type": "Teaser",
      "official": true,
      "published_at": "2025-12-01T00:00:00.000Z"
    },
    {
      "id": "v3",
      "key": "vimeo999",
      "name": "Behind the Scenes",
      "site": "Vimeo",
      "type": "Trailer",
      "official": false,
      "published_at": "2025-11-01T00:00:00.000Z"
    }
  ]
}
```

- [ ] **Step 6: Create `e2e/fixtures/search.json`**

```json
{
  "page": 1,
  "results": [
    {
      "id": 2001,
      "title": "Search Result Movie",
      "poster_path": "/search1.jpg",
      "backdrop_path": null,
      "overview": "A movie found via search.",
      "release_date": "2024-06-01",
      "vote_average": 6.8,
      "vote_count": 300,
      "genre_ids": [18],
      "popularity": 120.0,
      "original_language": "en",
      "original_title": "Search Result Movie",
      "adult": false
    }
  ],
  "total_pages": 1,
  "total_results": 1
}
```

- [ ] **Step 7: Create `e2e/helpers/mockApi.ts`**

Routes are registered most-specific-first so the catch-all `/movie/*` never accidentally matches sub-paths like `/movie/now_playing` or `/movie/123/credits`.

```ts
import type { Page } from '@playwright/test'
import trending from '../fixtures/trending.json'
import nowPlaying from '../fixtures/nowPlaying.json'
import movieDetail from '../fixtures/movieDetail.json'
import credits from '../fixtures/credits.json'
import videos from '../fixtures/videos.json'
import search from '../fixtures/search.json'

export async function mockApi(page: Page): Promise<void> {
  await page.route('**/trending/movie/day**', (route) =>
    route.fulfill({ json: trending })
  )
  await page.route('**/movie/now_playing**', (route) =>
    route.fulfill({ json: nowPlaying })
  )
  await page.route('**/search/movie**', (route) =>
    route.fulfill({ json: search })
  )
  await page.route('**/movie/*/videos**', (route) =>
    route.fulfill({ json: videos })
  )
  await page.route('**/movie/*/credits**', (route) =>
    route.fulfill({ json: credits })
  )
  // Catch-all for /movie/:id detail endpoint — must be last
  await page.route('**/movie/*', (route) =>
    route.fulfill({ json: movieDetail })
  )
}
```

- [ ] **Step 8: Commit**

```bash
git add e2e/
git commit -m "test: add E2E fixture data and mockApi helper"
```

---

## Task 3: Unit test — movieService (getMovieVideos filter logic)

**Files:**
- Create: `src/__tests__/services/movieService.test.ts`
- Test: `src/services/movie.service.ts`

The `getMovieVideos` function's filtering logic (`type === 'Trailer' && site === 'YouTube'`) is pure and easy to verify by controlling what `api.get` returns.

- [ ] **Step 1: Write the test file**

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api } from '../../lib/api'
import { getMovieVideos } from '../../services/movie.service'

vi.mock('../../lib/api', () => ({
  api: { get: vi.fn() },
  default: { get: vi.fn() },
}))

const allVideos = {
  data: {
    id: 1001,
    results: [
      { id: 'v1', key: 'key1', name: 'Official Trailer', site: 'YouTube', type: 'Trailer', official: true, published_at: '2026-01-01T00:00:00.000Z' },
      { id: 'v2', key: 'key2', name: 'Teaser', site: 'YouTube', type: 'Teaser', official: false, published_at: '2026-01-01T00:00:00.000Z' },
      { id: 'v3', key: 'key3', name: 'Vimeo Trailer', site: 'Vimeo', type: 'Trailer', official: false, published_at: '2026-01-01T00:00:00.000Z' },
    ],
  },
}

describe('getMovieVideos', () => {
  beforeEach(() => {
    vi.mocked(api.get).mockResolvedValue(allVideos)
  })

  it('returns only YouTube trailers', async () => {
    const result = await getMovieVideos('1001')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('v1')
  })

  it('filters out non-Trailer types (teasers, clips)', async () => {
    const result = await getMovieVideos('1001')
    expect(result.every((v) => v.type === 'Trailer')).toBe(true)
  })

  it('filters out non-YouTube entries', async () => {
    const result = await getMovieVideos('1001')
    expect(result.every((v) => v.site === 'YouTube')).toBe(true)
  })

  it('returns empty array when no videos match the filter', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        id: 1001,
        results: [
          { id: 'v2', key: 'key2', name: 'Teaser', site: 'YouTube', type: 'Teaser', official: false, published_at: '2026-01-01T00:00:00.000Z' },
          { id: 'v3', key: 'key3', name: 'Vimeo Trailer', site: 'Vimeo', type: 'Trailer', official: false, published_at: '2026-01-01T00:00:00.000Z' },
        ],
      },
    })
    const result = await getMovieVideos('1001')
    expect(result).toHaveLength(0)
  })
})
```

- [ ] **Step 2: Run test and confirm it passes**

```bash
npm run test -- src/__tests__/services/movieService.test.ts
```

Expected: `4 tests passed`.

- [ ] **Step 3: Commit**

```bash
git add src/__tests__/services/movieService.test.ts
git commit -m "test: add getMovieVideos unit tests"
```

---

## Task 4: Unit test — useFavorites hook

**Files:**
- Create: `src/__tests__/hooks/useFavorites.test.ts`
- Test: `src/hooks/useFavorites.ts`

`useFavorites` does not use React Query, so no wrapper is needed. jsdom provides a real `localStorage`. The `sonner` mock is already installed globally via `setup.ts`.

- [ ] **Step 1: Write the test file**

```ts
import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { toast } from 'sonner'
import { useFavorites } from '../../hooks/useFavorites'
import type { Movie } from '../../types/movie.types'

// sonner uses browser APIs not available in jsdom — mock it here where we assert on it
vi.mock('sonner', () => ({
  toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }),
}))

const mockMovie: Movie = {
  id: 1001,
  title: 'Test Movie',
  poster_path: '/test.jpg',
  backdrop_path: '/backdrop.jpg',
  overview: 'Test overview',
  release_date: '2026-01-01',
  vote_average: 8.0,
  vote_count: 1000,
  genre_ids: [28],
  popularity: 100,
  original_language: 'en',
  original_title: 'Test Movie',
  adult: false,
}

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('initialises with empty favorites when localStorage is empty', () => {
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toEqual([])
  })

  it('loads persisted favorites from localStorage on mount', async () => {
    localStorage.setItem('favorites', JSON.stringify([mockMovie]))
    const { result } = renderHook(() => useFavorites())
    await waitFor(() => expect(result.current.favorites).toHaveLength(1))
    expect(result.current.favorites[0].id).toBe(1001)
  })

  it('adds a movie when it is not already in the list', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => { result.current.toggleFavorite(mockMovie) })
    expect(result.current.favorites).toHaveLength(1)
    expect(result.current.favorites[0].id).toBe(1001)
  })

  it('removes a movie when it is already in the list', async () => {
    localStorage.setItem('favorites', JSON.stringify([mockMovie]))
    const { result } = renderHook(() => useFavorites())
    await waitFor(() => expect(result.current.favorites).toHaveLength(1))
    act(() => { result.current.toggleFavorite(mockMovie) })
    expect(result.current.favorites).toHaveLength(0)
  })

  it('persists the updated list to localStorage after each toggle', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => { result.current.toggleFavorite(mockMovie) })
    const stored = JSON.parse(localStorage.getItem('favorites')!)
    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe(1001)
  })

  it('isFavorite returns true for a favorited id', async () => {
    localStorage.setItem('favorites', JSON.stringify([mockMovie]))
    const { result } = renderHook(() => useFavorites())
    await waitFor(() => expect(result.current.isFavorite(1001)).toBe(true))
  })

  it('isFavorite returns false for a non-favorited id', () => {
    const { result } = renderHook(() => useFavorites())
    expect(result.current.isFavorite(999)).toBe(false)
  })

  it('fires toast.success when adding a favorite', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => { result.current.toggleFavorite(mockMovie) })
    expect(toast.success).toHaveBeenCalledWith('Successfully added to favorites!')
  })

  it('fires toast when removing a favorite', async () => {
    localStorage.setItem('favorites', JSON.stringify([mockMovie]))
    const { result } = renderHook(() => useFavorites())
    await waitFor(() => expect(result.current.favorites).toHaveLength(1))
    act(() => { result.current.toggleFavorite(mockMovie) })
    expect(toast).toHaveBeenCalledWith('Removed from favorites')
  })

  it('handles corrupted localStorage without throwing', () => {
    localStorage.setItem('favorites', 'not-valid-json{{')
    expect(() => renderHook(() => useFavorites())).not.toThrow()
  })
})
```

- [ ] **Step 2: Run test and confirm it passes**

```bash
npm run test -- src/__tests__/hooks/useFavorites.test.ts
```

Expected: `10 tests passed`.

- [ ] **Step 3: Commit**

```bash
git add src/__tests__/hooks/useFavorites.test.ts
git commit -m "test: add useFavorites hook unit tests"
```

---

## Task 5: Unit test — useSearchMovies hook

**Files:**
- Create: `src/__tests__/hooks/useSearchMovies.test.ts`
- Test: `src/hooks/useSearchMovies.ts`

React Query hooks need a `QueryClientProvider` wrapper. Each test creates a fresh `QueryClient` with `retry: false` to avoid flaky retries.

- [ ] **Step 1: Write the test file**

```tsx
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useSearchMovies } from '../../hooks/useSearchMovies'
import { searchMovies } from '../../services'
import type { Movie } from '../../types/movie.types'

// vi.mock is hoisted by Vitest above all imports at runtime — '../../services' resolves to the mock
vi.mock('../../services', () => ({
  searchMovies: vi.fn(),
}))

const mockMovie: Movie = {
  id: 2001, title: 'Mocked Search Result', poster_path: null, backdrop_path: null,
  overview: 'Overview', release_date: '2024-01-01', vote_average: 7.0,
  vote_count: 100, genre_ids: [], popularity: 50, original_language: 'en',
  original_title: 'Mocked Search Result', adult: false,
}

function makeWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
}

describe('useSearchMovies', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(searchMovies).mockResolvedValue([mockMovie])
  })

  it('does not call searchMovies when query is empty', async () => {
    renderHook(() => useSearchMovies(''), { wrapper: makeWrapper() })
    await new Promise((r) => setTimeout(r, 50))
    expect(searchMovies).not.toHaveBeenCalled()
  })

  it('calls searchMovies with the query when query is non-empty', async () => {
    const { result } = renderHook(() => useSearchMovies('inception'), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(searchMovies).toHaveBeenCalledWith('inception')
  })

  it('returns data from the service', async () => {
    const { result } = renderHook(() => useSearchMovies('inception'), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.data).toBeDefined())
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data![0].id).toBe(2001)
  })
})
```

- [ ] **Step 2: Run test and confirm it passes**

```bash
npm run test -- src/__tests__/hooks/useSearchMovies.test.ts
```

Expected: `3 tests passed`.

- [ ] **Step 3: Commit**

```bash
git add src/__tests__/hooks/useSearchMovies.test.ts
git commit -m "test: add useSearchMovies hook unit tests"
```

---

## Task 6: Unit tests — useTrendingMovies + useLatestMovies

**Files:**
- Create: `src/__tests__/hooks/useTrendingMovies.test.ts`
- Create: `src/__tests__/hooks/useLatestMovies.test.ts`
- Test: `src/hooks/useTrendingMovies.ts`, `src/hooks/useLatestMovies.ts`

- [ ] **Step 1: Write `src/__tests__/hooks/useTrendingMovies.test.ts`**

```tsx
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useTrendingMovies } from '../../hooks/useTrendingMovies'
import { getTrendingMovies } from '../../services'
import type { Movie } from '../../types/movie.types'

vi.mock('../../services', () => ({
  getTrendingMovies: vi.fn(),
}))

const mockMovie: Movie = {
  id: 1001, title: 'Trending Movie', poster_path: '/t.jpg', backdrop_path: null,
  overview: 'Overview', release_date: '2026-01-01', vote_average: 8.0,
  vote_count: 500, genre_ids: [28], popularity: 200, original_language: 'en',
  original_title: 'Trending Movie', adult: false,
}

function makeWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
}

describe('useTrendingMovies', () => {
  beforeEach(() => {
    vi.mocked(getTrendingMovies).mockResolvedValue([mockMovie])
  })

  it('calls getTrendingMovies on mount', async () => {
    renderHook(() => useTrendingMovies(), { wrapper: makeWrapper() })
    await waitFor(() => expect(getTrendingMovies).toHaveBeenCalledOnce())
  })

  it('returns the data from the service', async () => {
    const { result } = renderHook(() => useTrendingMovies(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.data).toBeDefined())
    expect(result.current.data![0].id).toBe(1001)
  })
})
```

- [ ] **Step 2: Write `src/__tests__/hooks/useLatestMovies.test.ts`**

```tsx
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useLatestMovies } from '../../hooks/useLatestMovies'
import { getLatestMovies } from '../../services'
import type { Movie } from '../../types/movie.types'

vi.mock('../../services', () => ({
  getLatestMovies: vi.fn(),
}))

const mockMovie: Movie = {
  id: 1003, title: 'Latest Movie', poster_path: '/l.jpg', backdrop_path: null,
  overview: 'Overview', release_date: '2026-03-01', vote_average: 7.2,
  vote_count: 300, genre_ids: [18], popularity: 150, original_language: 'en',
  original_title: 'Latest Movie', adult: false,
}

function makeWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
}

describe('useLatestMovies', () => {
  beforeEach(() => {
    vi.mocked(getLatestMovies).mockResolvedValue([mockMovie])
  })

  it('calls getLatestMovies on mount', async () => {
    renderHook(() => useLatestMovies(), { wrapper: makeWrapper() })
    await waitFor(() => expect(getLatestMovies).toHaveBeenCalledOnce())
  })

  it('returns the data from the service', async () => {
    const { result } = renderHook(() => useLatestMovies(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.data).toBeDefined())
    expect(result.current.data![0].id).toBe(1003)
  })
})
```

- [ ] **Step 3: Run tests and confirm they pass**

```bash
npm run test -- src/__tests__/hooks/useTrendingMovies.test.ts src/__tests__/hooks/useLatestMovies.test.ts
```

Expected: `4 tests passed`.

- [ ] **Step 4: Commit**

```bash
git add src/__tests__/hooks/useTrendingMovies.test.ts src/__tests__/hooks/useLatestMovies.test.ts
git commit -m "test: add useTrendingMovies and useLatestMovies unit tests"
```

---

## Task 7: Unit test — Button component

**Files:**
- Create: `src/__tests__/components/Button.test.tsx`
- Test: `src/components/ui/Button.tsx`

Button has no external dependencies (no Router, no API). Render and assert directly.

- [ ] **Step 1: Write the test file**

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Button from '../../components/ui/Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('renders a <button> element', () => {
    render(<Button>Go</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('is disabled when the disabled prop is set', () => {
    render(<Button disabled>Locked</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('does not fire onClick when disabled', () => {
    const onClick = vi.fn()
    render(<Button disabled onClick={onClick}>Locked</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('fires onClick when not disabled', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Active</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('renders secondary variant without primary background', () => {
    render(<Button variant="secondary">Secondary</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('border')
    expect(btn.className).not.toContain('bg-(--color-primary')
  })

  it('renders favorite variant as a button with an svg', () => {
    render(<Button variant="favorite" />)
    const btn = screen.getByRole('button')
    expect(btn.querySelector('svg')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run test and confirm it passes**

```bash
npm run test -- src/__tests__/components/Button.test.tsx
```

Expected: `7 tests passed`.

- [ ] **Step 3: Commit**

```bash
git add src/__tests__/components/Button.test.tsx
git commit -m "test: add Button component unit tests"
```

---

## Task 8: Unit test — CastCard component

**Files:**
- Create: `src/__tests__/components/CastCard.test.tsx`
- Test: `src/components/movie/CastCard.tsx`

CastCard has no external dependencies. Render with a mock `Cast` object and assert.

- [ ] **Step 1: Write the test file**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import CastCard from '../../components/movie/CastCard'
import type { Cast } from '../../types/movie.types'

const mockCast: Cast = {
  id: 201,
  name: 'Actor One',
  character: 'The Hero',
  profile_path: '/actor1.jpg',
  order: 0,
}

describe('CastCard', () => {
  it('renders the actor name', () => {
    render(<CastCard member={mockCast} />)
    expect(screen.getByText('Actor One')).toBeInTheDocument()
  })

  it('renders the character name', () => {
    render(<CastCard member={mockCast} />)
    expect(screen.getByText('The Hero')).toBeInTheDocument()
  })

  it('renders a profile image with the actor name as alt text', () => {
    render(<CastCard member={mockCast} />)
    const img = screen.getByAltText('Actor One')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', expect.stringContaining('/actor1.jpg'))
  })

  it('renders no image when profile_path is null', () => {
    render(<CastCard member={{ ...mockCast, profile_path: null }} />)
    expect(screen.queryByAltText('Actor One')).not.toBeInTheDocument()
  })

  it('renders placeholder div when profile_path is null', () => {
    const { container } = render(<CastCard member={{ ...mockCast, profile_path: null }} />)
    expect(container.querySelector('img')).toBeNull()
    // The placeholder div (bg-zinc-800) is rendered instead
    expect(container.querySelector('.bg-zinc-800')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run test and confirm it passes**

```bash
npm run test -- src/__tests__/components/CastCard.test.tsx
```

Expected: `5 tests passed`.

- [ ] **Step 3: Commit**

```bash
git add src/__tests__/components/CastCard.test.tsx
git commit -m "test: add CastCard component unit tests"
```

---

## Task 9: Unit test — MovieCard component

**Files:**
- Create: `src/__tests__/components/MovieCard.test.tsx`
- Test: `src/components/movie/MovieCard.tsx`

MovieCard calls `useNavigate`. Mock `react-router-dom`'s `useNavigate` to capture navigation calls, and wrap renders in `MemoryRouter` for Router context.

- [ ] **Step 1: Write the test file**

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import MovieCard from '../../components/movie/MovieCard'
import type { Movie } from '../../types/movie.types'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const mockMovie: Movie = {
  id: 1001,
  title: 'Test Movie',
  poster_path: '/test.jpg',
  backdrop_path: null,
  overview: 'Test overview',
  release_date: '2026-01-01',
  vote_average: 7.5,
  vote_count: 500,
  genre_ids: [28],
  popularity: 100,
  original_language: 'en',
  original_title: 'Test Movie',
  adult: false,
}

function renderCard(movie = mockMovie) {
  return render(
    <MemoryRouter>
      <MovieCard movie={movie} />
    </MemoryRouter>
  )
}

describe('MovieCard', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the movie title', () => {
    renderCard()
    expect(screen.getByText('Test Movie')).toBeInTheDocument()
  })

  it('renders the vote average formatted as x.x/10', () => {
    renderCard()
    expect(screen.getByText('7.5/10')).toBeInTheDocument()
  })

  it('renders the poster image with the movie title as alt text', () => {
    renderCard()
    expect(screen.getByAltText('Test Movie')).toBeInTheDocument()
  })

  it('renders No Image placeholder when poster_path is null', () => {
    renderCard({ ...mockMovie, poster_path: null })
    expect(screen.getByText('No Image')).toBeInTheDocument()
  })

  it('navigates to /movie/:id when clicked', () => {
    renderCard()
    fireEvent.click(screen.getByText('Test Movie'))
    expect(mockNavigate).toHaveBeenCalledWith('/movie/1001')
  })
})
```

- [ ] **Step 2: Run test and confirm it passes**

```bash
npm run test -- src/__tests__/components/MovieCard.test.tsx
```

Expected: `5 tests passed`.

- [ ] **Step 3: Run the full unit suite to confirm nothing is broken**

```bash
npm run test
```

Expected: all tests from Tasks 3–9 passing (30+ tests, 0 failures).

- [ ] **Step 4: Commit**

```bash
git add src/__tests__/components/MovieCard.test.tsx
git commit -m "test: add MovieCard component unit tests"
```

---

## Task 10: E2E spec — home page

**Files:**
- Create: `e2e/home.spec.ts`

Verifies that the home page hero, Trending Now, and Latest Release sections all render correctly with mocked data.

- [ ] **Step 1: Write `e2e/home.spec.ts`**

```ts
import { test, expect } from '@playwright/test'
import { mockApi } from './helpers/mockApi'
import trending from './fixtures/trending.json'
import nowPlaying from './fixtures/nowPlaying.json'

test.beforeEach(async ({ page }) => {
  await mockApi(page)
  await page.goto('/')
  // Wait for hero content — indicates data has loaded
  await expect(page.getByRole('heading', { name: trending.results[0].title })).toBeVisible()
})

test('hero renders the first trending movie title', async ({ page }) => {
  await expect(page.getByRole('heading', { name: trending.results[0].title })).toBeVisible()
})

test('Watch Trailer button is visible in the hero', async ({ page }) => {
  await expect(page.getByRole('button', { name: /Watch Trailer/i })).toBeVisible()
})

test('See Detail button is visible in the hero', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'See Detail' })).toBeVisible()
})

test('Trending Now section heading is visible', async ({ page }) => {
  await expect(page.getByText('Trending Now')).toBeVisible()
})

test('at least one trending movie card title is rendered', async ({ page }) => {
  await expect(page.getByText(trending.results[1].title).first()).toBeVisible()
})

test('Latest Release section heading is visible', async ({ page }) => {
  await expect(page.getByText('Latest Release')).toBeVisible()
})

test('at least one latest release movie card title is rendered', async ({ page }) => {
  await expect(page.getByText(nowPlaying.results[0].title).first()).toBeVisible()
})
```

- [ ] **Step 2: Start the dev server (if not already running)**

```bash
npm run dev
```

Leave it running. Playwright's `webServer` config with `reuseExistingServer: true` will reuse it.

- [ ] **Step 3: Run the home E2E spec**

```bash
npm run test:e2e -- e2e/home.spec.ts
```

Expected: `7 tests passed`.

- [ ] **Step 4: Commit**

```bash
git add e2e/home.spec.ts
git commit -m "test: add E2E home page spec"
```

---

## Task 11: E2E spec — movie detail page

**Files:**
- Create: `e2e/movieDetail.spec.ts`

Navigates from the hero "See Detail" button and asserts all detail page content.

- [ ] **Step 1: Write `e2e/movieDetail.spec.ts`**

```ts
import { test, expect } from '@playwright/test'
import { mockApi } from './helpers/mockApi'
import trending from './fixtures/trending.json'
import movieDetail from './fixtures/movieDetail.json'
import credits from './fixtures/credits.json'

test.beforeEach(async ({ page }) => {
  await mockApi(page)
  await page.goto('/')
  // Wait for hero to load, then navigate to detail
  await expect(page.getByRole('heading', { name: trending.results[0].title })).toBeVisible()
  await page.getByRole('button', { name: 'See Detail' }).click()
  // Wait for detail page to finish loading
  await expect(page.getByRole('heading', { name: movieDetail.title, level: 1 })).toBeVisible()
})

test('navigates to /movie/:id URL', async ({ page }) => {
  await expect(page).toHaveURL(/\/movie\/\d+/)
})

test('movie title heading is visible', async ({ page }) => {
  await expect(page.getByRole('heading', { name: movieDetail.title, level: 1 })).toBeVisible()
})

test('rating badge is visible', async ({ page }) => {
  await expect(page.getByText(`${movieDetail.vote_average.toFixed(1)}/10`)).toBeVisible()
})

test('genre badge is visible', async ({ page }) => {
  await expect(page.getByText(movieDetail.genres[0].name)).toBeVisible()
})

test('overview text is visible', async ({ page }) => {
  await expect(page.getByText(movieDetail.overview)).toBeVisible()
})

test('Cast & Crew heading is visible', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Cast & Crew' })).toBeVisible()
})

test('at least one cast member is rendered', async ({ page }) => {
  await expect(page.getByText(credits.cast[0].name)).toBeVisible()
})
```

- [ ] **Step 2: Run the spec**

```bash
npm run test:e2e -- e2e/movieDetail.spec.ts
```

Expected: `7 tests passed`.

- [ ] **Step 3: Commit**

```bash
git add e2e/movieDetail.spec.ts
git commit -m "test: add E2E movie detail page spec"
```

---

## Task 12: E2E spec — favorites flow (+ aria-label on Button)

**Files:**
- Modify: `src/components/ui/Button.tsx` — add `aria-label` to favorite variant
- Create: `e2e/favorites.spec.ts`

The favorite heart button has no `aria-label`, making it hard to target reliably in tests. Add one first, then write the spec.

- [ ] **Step 1: Add aria-label to the favorite Button variant in `src/components/ui/Button.tsx`**

Find this block:
```tsx
if (variant === "favorite") {
  return (
    <button
      onClick={handleFavoriteClick}
      className={`
```

Replace the opening `<button` line to add `aria-label`:
```tsx
if (variant === "favorite") {
  return (
    <button
      onClick={handleFavoriteClick}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      className={`
```

- [ ] **Step 2: Run the unit suite to confirm nothing broke**

```bash
npm run test
```

Expected: all tests still passing.

- [ ] **Step 3: Write `e2e/favorites.spec.ts`**

```ts
import { test, expect } from '@playwright/test'
import { mockApi } from './helpers/mockApi'
import movieDetail from './fixtures/movieDetail.json'

test.beforeEach(async ({ page }) => {
  await mockApi(page)
  // Clear localStorage so each test starts with no favorites
  await page.addInitScript(() => localStorage.clear())
})

test('favorites page shows empty state when no favorites', async ({ page }) => {
  await page.goto('/favorites')
  await expect(page.getByText('Data Empty')).toBeVisible()
})

test('adding a favorite from the detail page persists to the favorites page', async ({ page }) => {
  await page.goto(`/movie/${movieDetail.id}`)
  await expect(page.getByRole('heading', { name: movieDetail.title, level: 1 })).toBeVisible()
  await page.getByRole('button', { name: 'Add to favorites' }).click()
  await page.goto('/favorites')
  await expect(page.getByText(movieDetail.title)).toBeVisible()
})

test('removing a favorite from the favorites page restores empty state', async ({ page }) => {
  // Pre-populate localStorage with one favorite
  await page.addInitScript(() => {
    localStorage.setItem('favorites', JSON.stringify([{
      id: 1001, title: 'Test Movie Alpha', poster_path: '/alpha.jpg',
      backdrop_path: '/alpha-backdrop.jpg', overview: 'A test movie overview for alpha.',
      release_date: '2026-01-15', vote_average: 8.2, vote_count: 1500,
      genre_ids: [28], popularity: 450.5, original_language: 'en',
      original_title: 'Test Movie Alpha', adult: false,
    }]))
  })
  await page.goto('/favorites')
  await expect(page.getByText('Test Movie Alpha')).toBeVisible()
  await page.getByRole('button', { name: 'Remove from favorites' }).click()
  await expect(page.getByText('Data Empty')).toBeVisible()
})
```

- [ ] **Step 4: Run the spec**

```bash
npm run test:e2e -- e2e/favorites.spec.ts
```

Expected: `3 tests passed`.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/Button.tsx e2e/favorites.spec.ts
git commit -m "test: add E2E favorites flow spec + aria-label on Button favorite variant"
```

---

## Task 13: E2E spec — search flow

**Files:**
- Create: `e2e/search.spec.ts`

- [ ] **Step 1: Write `e2e/search.spec.ts`**

```ts
import { test, expect } from '@playwright/test'
import { mockApi } from './helpers/mockApi'
import search from './fixtures/search.json'

test.beforeEach(async ({ page }) => {
  await mockApi(page)
  await page.goto('/')
})

test('typing a query and pressing Enter navigates to the search page', async ({ page }) => {
  await page.fill('input[placeholder="Search Movie"]', 'inception')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL('/search?q=inception')
})

test('Search Results heading is visible', async ({ page }) => {
  await page.fill('input[placeholder="Search Movie"]', 'inception')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'Search Results' })).toBeVisible()
})

test('"Showing results for" subtitle contains the search query', async ({ page }) => {
  await page.fill('input[placeholder="Search Movie"]', 'inception')
  await page.keyboard.press('Enter')
  await expect(page.getByText(/Showing results for "inception"/i)).toBeVisible()
})

test('at least one result card is rendered', async ({ page }) => {
  await page.fill('input[placeholder="Search Movie"]', 'inception')
  await page.keyboard.press('Enter')
  await expect(page.getByText(search.results[0].title)).toBeVisible()
})

test('clicking a result navigates to the movie detail page', async ({ page }) => {
  await page.fill('input[placeholder="Search Movie"]', 'inception')
  await page.keyboard.press('Enter')
  await page.getByText(search.results[0].title).click()
  await expect(page).toHaveURL(/\/movie\/\d+/)
})
```

- [ ] **Step 2: Run the spec**

```bash
npm run test:e2e -- e2e/search.spec.ts
```

Expected: `5 tests passed`.

- [ ] **Step 3: Commit**

```bash
git add e2e/search.spec.ts
git commit -m "test: add E2E search flow spec"
```

---

## Task 14: Verify coverage + update progress.md

- [ ] **Step 1: Run the full unit suite**

```bash
npm run test
```

Expected: all tests passing (30+ tests).

- [ ] **Step 2: Run coverage report**

```bash
npm run coverage
```

Expected: ≥ 80% line coverage on `src/hooks/`, `src/services/`, and the three tested components. Review the report; if a targeted file is below 80%, add a test case in the relevant file before continuing.

- [ ] **Step 3: Run the full E2E suite**

```bash
npm run test:e2e
```

Expected: all 22 E2E tests passing across home, movieDetail, favorites, search specs.

- [ ] **Step 4: Update `progress.md`**

In the Architecture Score table, update:
- `Test coverage & quality` from `3/10` to `9/10`  
- Add a note: `Vitest unit + Playwright E2E; ~80%+ coverage on hooks/services/components`
- Update `Overall` score from `7.7/10` to `8.5/10`

Add to the Completed list:
```
- [x] Add Vitest unit tests: hooks, services, components (2026-05-07)
- [x] Add Playwright E2E tests: home, detail, favorites, search (2026-05-07)
```

Remove from Backlog:
```
- [ ] Add automated tests (Vitest + React Testing Library or Playwright spec files; 0% coverage still a blocker)
```

- [ ] **Step 5: Commit**

```bash
git add progress.md
git commit -m "docs: update progress.md — test coverage complete"
```
