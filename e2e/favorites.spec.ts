import { test, expect } from '@playwright/test'
import { mockApi } from './helpers/mockApi'
import movieDetail from './fixtures/movieDetail.json' with { type: 'json' }

test.beforeEach(async ({ page }) => {
  await mockApi(page)
})

test('favorites page shows empty state when no favorites', async ({ page }) => {
  await page.goto('/favorites')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await expect(page.getByText('Data Empty')).toBeVisible()
})

test('adding a favorite from the detail page persists to the favorites page', async ({ page }) => {
  // Use mobile viewport so the favorite button renders in a scrollable in-viewport layout
  // (the desktop hero uses absolute positioning that places the button outside the viewport)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(`/movie/${movieDetail.id}`)
  // Clear any pre-existing favorites from a prior test
  await page.evaluate(() => localStorage.clear())
  await expect(page.getByRole('heading', { name: movieDetail.title, level: 1 }).filter({ visible: true }).first()).toBeVisible()
  await page.getByRole('button', { name: 'Add to favorites' }).click()
  await page.goto('/favorites')
  await expect(page.getByText(movieDetail.title).filter({ visible: true }).first()).toBeVisible()
})

test('removing a favorite from the favorites page restores empty state', async ({ page }) => {
  await page.goto('/favorites')
  // Pre-populate localStorage with one favorite and reload for the hook to pick it up
  await page.evaluate(() => {
    localStorage.setItem('favorites', JSON.stringify([{
      id: 1001, title: 'Test Movie Alpha', poster_path: '/alpha.jpg',
      backdrop_path: '/alpha-backdrop.jpg', overview: 'A test movie overview for alpha.',
      release_date: '2026-01-15', vote_average: 8.2, vote_count: 1500,
      genre_ids: [28], popularity: 450.5, original_language: 'en',
      original_title: 'Test Movie Alpha', adult: false,
    }]))
  })
  await page.reload()
  await expect(page.getByText('Test Movie Alpha')).toBeVisible()
  await page.getByRole('button', { name: 'Remove from favorites' }).first().click()
  await expect(page.getByText('Data Empty')).toBeVisible()
})
