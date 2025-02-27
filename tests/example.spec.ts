import { test, expect } from '@playwright/test';



test('has text', async ({ page }) => {
  await page.goto('https://exploratorytestingacademy.com/app/');

  // Expect a title "to contain" a substring.
  await expect(page.getByRole('heading', { name: 'E-Primer an e-prime checking' })).toContainText('e-prime');
});

test('fill and count', async ({ page }) => {
  await page.goto('https://exploratorytestingacademy.com/app/');

  // Test count 1 be
  await page.getByRole('textbox', { name: 'Text:' }).fill('I am the Batman');
  await page.getByRole('button', { name: 'Check For E-Prime' }).click();
  await expect(page.locator('//span[@id="wordCount"]').nth(0)).toHaveText('4');
  await expect(page.locator('//span[@id="discouragedWordCount"]').nth(0)).toHaveText('1');
  await expect(page.locator('//span[@id="possibleViolationCount"]').nth(0)).toHaveText('0');

  // Test count 2 be
  await page.getByRole('textbox', { name: 'Text:' }).fill('I am a bat, I am a man');
  await page.getByRole('button', { name: 'Check For E-Prime' }).click();
  await expect(page.locator('//span[@id="wordCount"]').nth(0)).toHaveText('8');
  await expect(page.locator('//span[@id="discouragedWordCount"]').nth(0)).toHaveText('2');
  await expect(page.locator('//span[@id="possibleViolationCount"]').nth(0)).toHaveText('0');

  // Test count 0 be
  await page.getByRole('textbox', { name: 'Text:' }).fill('I like the Batman');
  await page.getByRole('button', { name: 'Check For E-Prime' }).click();
  await expect(page.locator('//span[@id="wordCount"]').nth(0)).toHaveText('4');
  await expect(page.locator('//span[@id="discouragedWordCount"]').nth(0)).toHaveText('0');
  await expect(page.locator('//span[@id="possibleViolationCount"]').nth(0)).toHaveText('0');

  // Test count all be (am is are was were be being been)
  await page.getByRole('textbox', { name: 'Text:' }).fill('am is are was were be being been');
  await page.getByRole('button', { name: 'Check For E-Prime' }).click();
  await expect(page.locator('//span[@id="wordCount"]').nth(0)).toHaveText('8');
  await expect(page.locator('//span[@id="discouragedWordCount"]').nth(0)).toHaveText('8');
  await expect(page.locator('//span[@id="possibleViolationCount"]').nth(0)).toHaveText('0');

  // Test count glyphes as words
  await page.getByRole('textbox', { name: 'Text:' }).fill(';:!= -_çàèéêëîïôöùûüÿ <>1234567890');
  await page.getByRole('button', { name: 'Check For E-Prime' }).click();
  await expect(page.locator('//span[@id="wordCount"]').nth(0)).toHaveText('3');
  await expect(page.locator('//span[@id="discouragedWordCount"]').nth(0)).toHaveText('0');
  await expect(page.locator('//span[@id="possibleViolationCount"]').nth(0)).toHaveText('0');

});


test('check links', async ({ page, context }) => {

  // Test link 1
  await page.goto('https://exploratorytestingacademy.com/app/');
  await page.getByRole('link', { name: 'Alan Richardson, eviltester' }).click();
  await expect(page).toHaveURL('https://github.com/eviltester/TestingApp');


  // Test link 2 (lien externe)
  await page.goto('https://exploratorytestingacademy.com/app/');
  await Promise.all([
    context.waitForEvent('page').then(async (newPage) => {
      await newPage.waitForLoadState();
      await expect(newPage).toHaveURL('https://en.wikipedia.org/wiki/E-Prime');
    }),
    page.getByRole('link', { name: 'e-prime' }).click()  ]);

});