import { expect, test } from '@playwright/test'

const uniqueEmail = () =>
  `e2e_${Date.now()}_${Math.floor(Math.random() * 10000)}@example.com`

const registerNewUser = async (
  page: import('@playwright/test').Page,
  email: string,
) => {
  await page.goto('/register')
  await page.getByLabel('名前').fill('E2Eユーザー')
  await page.getByLabel('メールアドレス').fill(email)
  await page.getByLabel('パスワード（8文字以上）').fill('password123')
  await page.getByLabel('パスワード（確認）').fill('password123')
  await page.getByRole('button', { name: '登録する' }).click()
  await expect(page).toHaveURL(/\/exposures$/)
}

test('登録 → 価値追加 → 記録作成 → 実施後の追記（ハッピーパス）', async ({
  page,
}) => {
  await registerNewUser(page, uniqueEmail())

  // 価値を追加
  await page.getByRole('link', { name: '価値', exact: true }).click()
  await expect(page).toHaveURL(/\/values$/)
  await page.getByLabel('新しい価値').fill('人と誠実に関わる')
  await page.getByRole('button', { name: '追加する' }).click()
  await expect(page.getByText('人と誠実に関わる')).toBeVisible()

  // 記録を作成
  await page.getByRole('link', { name: '記録', exact: true }).click()
  await expect(page).toHaveURL(/\/exposures$/)
  await page.getByRole('button', { name: '新しく記録する' }).click()
  await expect(page).toHaveURL(/\/exposures\/new$/)
  await page.getByLabel('価値').selectOption({ label: '人と誠実に関わる' })
  await page.getByLabel('行動').fill('朝の会で一言発言する')
  await page.getByLabel('実施前の不安度（0〜100）').fill('60')
  await page.getByRole('button', { name: '記録する' }).click()
  await expect(page).toHaveURL(/\/exposures$/)
  await expect(page.getByText('朝の会で一言発言する')).toBeVisible()

  // 実施後の追記
  await page.getByRole('link', { name: '朝の会で一言発言する' }).click()
  await expect(page).toHaveURL(/\/exposures\/\d+$/)
  await page.getByLabel('実施日時').fill('2026-06-20T09:00')
  await page.getByLabel('実施後の不安度（0〜100）').fill('30')
  await page.getByRole('button', { name: '振り返りを記録する' }).click()
  await expect(page.getByText('実施済み')).toBeVisible()
})

test('同じ価値を2回登録すると重複エラーを表示する', async ({ page }) => {
  await registerNewUser(page, uniqueEmail())

  // Cookie 認証済みのまま /values を直接開く（リロードでセッション復帰も兼ねる）。
  await page.goto('/values')
  await expect(page.getByRole('heading', { name: '価値' })).toBeVisible()

  // 実ユーザーのキー入力に近づけるため pressSequentially で1文字ずつ入力する。
  const addValue = async (name: string) => {
    const input = page.getByLabel('新しい価値')
    await input.click()
    await input.fill('')
    await input.pressSequentially(name)
    await page.getByRole('button', { name: '追加する' }).click()
  }

  await addValue('挑戦する')
  await expect(
    page.getByRole('listitem').filter({ hasText: '挑戦する' }),
  ).toBeVisible()

  await addValue('挑戦する')
  await expect(page.getByText('この価値はすでに登録されています')).toBeVisible()
})
