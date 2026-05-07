import { test, expect } from '@playwright/test'
import { mockApi } from './helpers/mockApi'
import trending from './fixtures/trending.json' with { type: 'json' }
import nowPlaying from './fixtures/nowPlaying.json' with { type: 'json' }

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
