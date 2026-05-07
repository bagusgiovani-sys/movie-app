import { test, expect } from '@playwright/test'
import { mockApi } from './helpers/mockApi'
import search from './fixtures/search.json' with { type: 'json' }

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
