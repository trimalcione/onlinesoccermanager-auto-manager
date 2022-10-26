import { test, expect } from '@playwright/test'

test('To get free coins it should', async ({ page }, testInfo) => {
  await test.step('login to OSM', async () => {
    await page.goto('https://en.onlinesoccermanager.com/')
    await expect(page).toHaveTitle(/OSM/)
    const allowCookies = page.locator('xpath=//*[@id="page-privacynotice"]/div/div/div[2]/div[3]/div[2]/div[1]/div[1]/button')
    await allowCookies.click()
  })
  await test.step('accept cookies', async () => {
    await page.goto('https://en.onlinesoccermanager.com/Login')
    await expect(page).toHaveTitle(/OSM/)
    await page.locator('xpath=//*[@id="manager-name"]').fill(process.env.OSM_LOGIN_USERNAME || "")
    await page.locator('xpath=//*[@id="password"]').fill(process.env.OSM_LOGIN_PASSWORD || "")
    await page.locator('xpath=//*[@id="login"]').click()
  })
  await test.step('open balances modal', async () => {
    await page.locator('xpath=//*[@id="balances"]/div/div[3]').click({ force: true })
  })
  let i = 0
  while(i < 5) {
    await test.step(`if available play video number ${i}`, async () => {
      await page.locator('xpath=//*[@id="product-category-free"]/div[2]/div[1]/div').click()
      await expect(page.locator('xpath=//*[@id="modal-dialog-alert"]/div[4]/div/div/div/div[1]/h3')).toBeVisible()
        .then(async () => {
          await expect(page.locator('xpath=//*[@id="modal-dialog-alert"]/div[4]/div/div/div/div[1]/h3')).toHaveText(/show video/).then(() => {
            testInfo.annotations.push({ type: 'info', description: `${i} videos played. No more videos available` })
            i = 5
          })
        })
        .catch(async () => {
          await new Promise(r => setTimeout(r, 35000))
          i++
        })
    })
  }
  await test.step('get amount of coins', async () => {
    await page.goto('https://en.onlinesoccermanager.com/Career')
    await expect(page).toHaveTitle(/OSM/)
    await new Promise(r => setTimeout(r, 2000))
    const coinsAmount = await page.locator('xpath=//*[@id="balances"]/div[1]/div[1]/div/span').innerText()
    testInfo.annotations.push({ type: 'info', description: `Coins amount: ${coinsAmount}` })
  })
})