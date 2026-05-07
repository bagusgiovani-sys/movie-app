import type { Page } from '@playwright/test'
import trending from '../fixtures/trending.json' with { type: 'json' }
import nowPlaying from '../fixtures/nowPlaying.json' with { type: 'json' }
import movieDetail from '../fixtures/movieDetail.json' with { type: 'json' }
import credits from '../fixtures/credits.json' with { type: 'json' }
import videos from '../fixtures/videos.json' with { type: 'json' }
import search from '../fixtures/search.json' with { type: 'json' }

const TMDB = 'https://api.themoviedb.org/3'

export async function mockApi(page: Page): Promise<void> {
  // Playwright matches routes in LIFO order (last registered = highest priority).
  // Register the broad catch-all first so specific routes registered after it win.

  // Catch-all for /movie/:id — lowest priority, registered first
  await page.route(`${TMDB}/movie/*`, (route) =>
    route.fulfill({ json: movieDetail })
  )

  // More-specific routes registered after so they take priority over the catch-all
  await page.route(`${TMDB}/movie/*/credits**`, (route) =>
    route.fulfill({ json: credits })
  )
  await page.route(`${TMDB}/movie/*/videos**`, (route) =>
    route.fulfill({ json: videos })
  )
  await page.route(`${TMDB}/movie/now_playing**`, (route) =>
    route.fulfill({ json: nowPlaying })
  )
  await page.route(`${TMDB}/search/movie**`, (route) =>
    route.fulfill({ json: search })
  )
  await page.route(`${TMDB}/trending/movie/day**`, (route) =>
    route.fulfill({ json: trending })
  )
}
