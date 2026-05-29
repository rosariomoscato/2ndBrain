import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  try {
    await page.goto('http://localhost:3000/graph', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(3000);

    const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 300));
    console.log('PAGE:', bodyText);

    const nodes = await page.locator('.react-flow__node').count();
    const edges = await page.locator('.react-flow__edge').count();
    console.log(`Nodes: ${nodes}, Edges: ${edges}`);
  } catch (e) {
    console.error(e.message);
  } finally {
    await browser.close();
  }
})();
