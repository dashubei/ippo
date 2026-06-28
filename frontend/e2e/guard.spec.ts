import { expect, test } from '@playwright/test'

test('未ログインで保護ページへアクセスするとログインへリダイレクトする', async ({
  page,
}) => {
  await page.goto('/values')
  await expect(page).toHaveURL(/\/login$/)

  await page.goto('/exposures')
  await expect(page).toHaveURL(/\/login$/)
})
