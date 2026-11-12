import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage();

  console.log('Testing Mobile Viewport (360px)...');
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'stage11-mobile.png', fullPage: true });
  console.log('Saved stage11-mobile.png');

  // 1. Check scrollWidth vs clientWidth
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  console.log(`Mobile: scrollWidth = ${scrollWidth}, clientWidth = ${clientWidth}`);
  if (scrollWidth > 360) {
    console.error(`FAIL: Horizontal overflow detected on mobile: scrollWidth ${scrollWidth} > 360`);
  } else {
    console.log('PASS: Zero horizontal overflow on mobile!');
  }

  // 2. Check all 6 sections exist
  const sections = await page.evaluate(() => {
    return {
      hero: !!document.querySelector('.hero-section'),
      work: !!document.querySelector('#work'),
      research: !!document.querySelector('#research'),
      methodology: !!document.querySelector('#methodology'),
      bioBanner: !!document.querySelector('.crimson-bio-banner'),
      contactDrawer: !!document.querySelector('#contact-drawer'),
      footer: !!document.querySelector('.footer-minimal'),
    };
  });
  console.log('Sections check:', sections);

  // 3. Check Bento previews in Desktop Viewport (1440px)
  console.log('\nTesting Desktop Viewport (1440px)...');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'stage11-desktop.png', fullPage: true });
  console.log('Saved stage11-desktop.png');

  const desktopScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  console.log(`Desktop: scrollWidth = ${desktopScrollWidth}`);

  const bentoElements = await page.evaluate(() => {
    return {
      medipulseCard: !!document.querySelector('.bento-card--medipulse'),
      editorialCard: !!document.querySelector('.bento-card--editorial'),
      healthpulseCard: !!document.querySelector('.bento-card--healthpulse'),
      aethraCard: !!document.querySelector('.bento-card--aethra'),
      kpiBoxes: document.querySelectorAll('.kpi-box').length,
      chartBars: document.querySelectorAll('.chart-bar').length,
      crimsonBars: document.querySelectorAll('.chart-bar--crimson').length,
      swatches: document.querySelectorAll('.swatch').length,
      pubRows: document.querySelectorAll('.pub-row').length,
    };
  });
  console.log('Bento elements check:', bentoElements);

  // 4. Test Era Toggle (Shift+Alt+E)
  console.log('\nTesting Era Toggle (Shift+Alt+E)...');
  const initialEra = await page.evaluate(() => document.documentElement.dataset.era);
  console.log(`Initial era: ${initialEra}`);

  // Press Shift+Alt+E
  await page.keyboard.press('Shift+Alt+KeyE');
  await page.waitForTimeout(400);

  const toggledEra = await page.evaluate(() => document.documentElement.dataset.era);
  console.log(`Toggled era: ${toggledEra}`);
  await page.screenshot({ path: 'stage11-desktop-1984.png', fullPage: true });
  console.log('Saved stage11-desktop-1984.png');

  const radiusValues1984 = await page.evaluate(() => {
    const card = document.querySelector('.bento-card');
    const style = window.getComputedStyle(card);
    return {
      borderRadius: style.borderRadius,
    };
  });
  console.log('1984 border-radius:', radiusValues1984);

  // Toggle back to 2026
  await page.keyboard.press('Shift+Alt+KeyE');
  await page.waitForTimeout(400);
  const revertedEra = await page.evaluate(() => document.documentElement.dataset.era);
  console.log(`Reverted era: ${revertedEra}`);

  const radiusValues2026 = await page.evaluate(() => {
    const card = document.querySelector('.bento-card');
    const style = window.getComputedStyle(card);
    return {
      borderRadius: style.borderRadius,
    };
  });
  console.log('2026 border-radius:', radiusValues2026);

  await browser.close();
  console.log('\nValidation script completed.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
