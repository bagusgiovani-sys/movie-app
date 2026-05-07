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
