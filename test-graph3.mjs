import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const logs = [];
  page.on('console', msg => logs.push({ type: msg.type(), text: msg.text() }));

  try {
    // Login first
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    
    const emailInput = page.locator('input[type="email"]');
    const passInput = page.locator('input[type="password"]');
    const submitBtn = page.locator('button[type="submit"]');
    
    await emailInput.fill('ros.moscato@gmail.com');
    await passInput.fill('Test12345678!');
    await submitBtn.click();
    await page.waitForTimeout(4000);
    
    console.log('After login:', page.url());

    // Navigate to graph
    await page.goto('http://localhost:3000/graph', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(5000);

    console.log('Graph URL:', page.url());

    // Check for ReactFlow container
    const reactFlow = await page.locator('.react-flow').count();
    console.log('ReactFlow containers:', reactFlow);

    // Check for nodes
    const nodes = await page.locator('.react-flow__node').count();
    console.log('ReactFlow nodes:', nodes);

    // Check for edges
    const edges = await page.locator('.react-flow__edge').count();
    console.log('ReactFlow edges:', edges);

    // Get all visible elements
    const visibleElements = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('div, canvas, svg')).filter(el => el.offsetHeight > 50).map(el => ({
        tag: el.tagName,
        class: (el.className || '').toString().substring(0, 100),
        h: el.offsetHeight,
        w: el.offsetWidth,
      }));
    });
    console.log('\n--- VISIBLE ELEMENTS (h>50) ---');
    visibleElements.forEach(e => console.log(`${e.tag} h=${e.h} w=${e.w} | ${e.class}`));

    // Check body text
    const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 300));
    console.log('\n--- BODY TEXT ---');
    console.log(bodyText);

    // Console errors
    const errors = logs.filter(l => l.type === 'error');
    console.log('\n--- CONSOLE ERRORS ---');
    errors.forEach(e => console.log(e.text));

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
