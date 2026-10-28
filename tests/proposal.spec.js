import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const lang of ['en', 'ar']) {
  for (const width of [320, 390, 768, 1440]) {
    test(`${lang} at ${width}px: scope, layout and interactions`, async ({ page }, info) => {
      await page.setViewportSize({ width, height: 1000 });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.goto(`/?lang=${lang}`);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.locator('html')).toHaveAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
      await expect(page.locator('.feature-card')).toHaveCount(8);
      await expect(page.locator('.package-price')).toContainText('2,500');
      await expect(page.locator('.payment-item').nth(0)).toContainText('1,300');
      await expect(page.locator('.payment-item').nth(1)).toContainText('1,200');
      await expect(page.locator('.care-card.startup')).toContainText('300');
      await expect(page.locator('.care-card.maintenance')).toContainText('100');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
      await page.locator('[data-role="coaches"]').click();
      await expect(page.locator('[data-role="coaches"]')).toHaveAttribute('aria-selected', 'true');
      await expect(page.locator('#role-panel .mini-court')).toBeVisible();
      await page.locator('[data-role="coaches"]').press('End');
      await expect(page.locator('[data-role="admins"]')).toHaveAttribute('aria-selected', 'true');
      await page.locator('[data-role="players"]').click();
      await page.locator('.feature-details').first().locator('summary').click();
      await expect(page.locator('.feature-details').first()).toHaveAttribute('open', '');
      await page.locator('.faq-item').nth(3).locator('summary').click();
      await expect(page.locator('.faq-item').nth(3)).toHaveAttribute('open', '');
      if (width < 760) {
        await page.locator('[data-action="menu"]').click();
        await expect(page.locator('[data-action="menu"]')).toHaveAttribute('aria-expanded', 'true');
        await page.locator('.main-nav a[href="#investment"]').click();
        await expect(page.locator('[data-action="menu"]')).toHaveAttribute('aria-expanded', 'false');
      }
      await page.evaluate(() => document.querySelectorAll('details').forEach(d => d.open = false));
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      await page.screenshot({ path: info.outputPath(`proposal-${lang}-${width}.png`), fullPage: true });
      await page.locator('[data-action="language"]').click();
      await expect(page.locator('html')).toHaveAttribute('lang', lang === 'en' ? 'ar' : 'en');
      await page.reload();
      await expect(page.locator('html')).toHaveAttribute('lang', lang === 'en' ? 'ar' : 'en');
      expect(errors).toEqual([]);
    });
  }
  test(`${lang}: accessibility, expanded terms and print`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`/?lang=${lang}`);
    await page.locator('[data-role="admins"]').click();
    await page.evaluate(() => document.querySelectorAll('details').forEach(d => d.open = true));
    const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(audit.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
    await page.emulateMedia({ media: 'print' });
    await page.evaluate(() => dispatchEvent(new Event('beforeprint')));
    await expect(page.locator('details:not([open])')).toHaveCount(0);
    await expect(page.locator('.package-price')).toBeVisible();
  });
}

test('server health, static assets and private files', async ({ request }) => {
  const health = await request.get('/health');
  expect(health.status()).toBe(200);
  expect((await health.json()).status).toBe('ok');
  expect((await request.get('/assets/styles.css')).status()).toBe(200);
  expect((await request.get('/.env')).status()).toBe(404);
  expect((await request.get('/package.json')).status()).toBe(404);
  expect((await request.get('/%2e%2e%2fpackage.json')).status()).toBe(404);
  expect((await request.post('/')).status()).toBe(405);
});
