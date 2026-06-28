import { expect, test } from '@playwright/test'

// トップページに埋め込んだお試し機能。ログイン不要・バックエンド不要（localStorage のみ）。
test('トップページでログインせず行動を試し、端末に保存・復元できる', async ({
  page,
}) => {
  await page.goto('/')
  await expect(
    page.getByRole('heading', { name: 'まずは試してみる' }),
  ).toBeVisible()

  await page.getByLabel('やってみたい行動（任意）').fill('会議で発言する')
  await page.getByRole('button', { name: 'この端末に保存（1件）' }).click()

  await expect(page.getByText('保存した内容')).toBeVisible()
  await expect(page.getByText('会議で発言する')).toBeVisible()

  // リロードしても端末に残る
  await page.reload()
  await expect(page.getByText('会議で発言する')).toBeVisible()
})
