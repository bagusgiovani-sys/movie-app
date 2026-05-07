import { test, expect } from '@playwright/test'
import { mockApi } from './helpers/mockApi'
import trending from './fixtures/trending.json' with { type: 'json' }
import movieDetail from './fixtures/movieDetail.json' with { type: 'json' }
import credits from './fixtures/credits.json' with { type: 'json' }

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
  await expect(
    page.getByText(`${movieDetail.vote_average.toFixed(1)}/10`).filter({ visible: true }).first()
  ).toBeVisible()
})

test('genre badge is visible', async ({ page }) => {
  await expect(
    page.getByText(movieDetail.genres[0].name).filter({ visible: true }).first()
  ).toBeVisible()
})

test('overview text is visible', async ({ page }) => {
  await expect(
    page.getByText(movieDetail.overview).filter({ visible: true }).first()
  ).toBeVisible()
})

test('Cast & Crew heading is visible', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Cast & Crew' })).toBeVisible()
})

test('at least one cast member is rendered', async ({ page }) => {
  await expect(
    page.getByText(credits.cast[0].name).filter({ visible: true }).first()
  ).toBeVisible()
})
