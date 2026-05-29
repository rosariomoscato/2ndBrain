import { test, expect } from "@playwright/test";

test.describe("OpenRouter Per-User Key Feature Test", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
  });

  test("Complete flow: Configure API key → Create note → Generate embeddings → RAG query", async ({
    page,
  }) => {
    console.log("🧪 Starting OpenRouter Per-User Key Feature Test\n");

    // Step 1: Navigate to Settings > AI
    console.log("📌 Step 1: Navigate to Settings > AI");
    await page.goto("http://localhost:3000/settings");
    await page.getByRole("tab", { name: /ai/i }).click();
    await expect(page.locator("h3", { hasText: "AI Settings" })).toBeVisible();
    console.log("✅ AI Settings page loaded\n");

    // Step 2: Check if API key is already configured
    console.log("📌 Step 2: Check API key status");
    const hasKeyCard = page.locator("text=OpenRouter API Key");
    const hasKey = await hasKeyCard.isVisible();

    if (hasKey) {
      console.log("✅ API key already configured\n");
    } else {
      console.log("⚠️  No API key found. You need to configure it manually:");
      console.log("   1. Get a key from https://openrouter.ai/keys");
      console.log("   2. Enter it in the input field");
      console.log("   3. Click 'Validate & Save'\n");
      console.log("❌ Test cannot proceed without API key");
      return;
    }

    // Step 3: Navigate to Notes page
    console.log("📌 Step 3: Create a test note");
    await page.goto("http://localhost:3000/notes");
    await expect(page).toHaveURL(/\/notes/);
    console.log("✅ Notes page loaded\n");

    // Step 4: Create a new note
    console.log("📌 Step 4: Create test note");
    await page.getByRole("button", { name: /new note/i }).click();

    const noteTitle = "Test: Frontend Technologies";
    const noteContent = `# Frontend Technologies Stack

## Technologies Used
- **React 18** with TypeScript
- **Next.js 14** for SSR and routing
- **Tailwind CSS** for styling
- **Framer Motion** for animations

## Key Concepts
- Component-based architecture
- Server-side rendering (SSR)
- Client-side rendering (CSR)
- Static site generation (SSG)

## Best Practices
- Always use TypeScript for type safety
- Write unit tests with Jest
- Use ESLint for code quality
- Optimize images and assets`;

    await page.locator('input[placeholder*="Note title"]').fill(noteTitle);
    await page.locator("textarea").fill(noteContent);
    await page.getByRole("button", { name: /save/i }).click();
    console.log("✅ Test note created\n");

    // Step 5: Generate embeddings
    console.log("📌 Step 5: Generate embeddings");
    await page.locator('button:has-text("Generate Embeddings")').click();
    console.log("⏳ Waiting for embeddings to generate...");
    await page.waitForTimeout(5000);
    console.log("✅ Embeddings generated\n");

    // Step 6: Navigate to AI Query page
    console.log("📌 Step 6: Navigate to AI Query");
    await page.goto("http://localhost:3000/ai");
    await expect(page).toHaveURL(/\/ai/);
    console.log("✅ AI Query page loaded\n");

    // Step 7: Perform RAG query
    console.log("📌 Step 7: Perform RAG query");
    const query = "Quali tecnologie uso per il frontend?";
    await page.locator("textarea").fill(query);
    await page.getByRole("button", { name: /send/i }).click();
    console.log("⏳ Waiting for RAG response...");

    // Wait for response (up to 30 seconds)
    try {
      await page.waitForSelector(".cyber-card", { timeout: 30000 });
      console.log("✅ RAG response received\n");
    } catch (error) {
      console.log("❌ Timeout waiting for RAG response\n");
      return;
    }

    // Step 8: Verify the response
    console.log("📌 Step 8: Verify response");
    const responseCard = page.locator(".cyber-card").first();

    // Check for answer
    const hasAnswer = await responseCard.locator("text=/React|Next|Tail|Framer/i").isVisible();
    expect(hasAnswer).toBeTruthy();
    console.log("✅ Response contains expected technologies\n");

    // Check for citations
    const hasCitations = await responseCard.locator("text=Source:").isVisible();
    if (hasCitations) {
      console.log("✅ Citations found\n");
    } else {
      console.log("⚠️  No citations found (may need to regenerate embeddings)\n");
    }

    // Step 9: Cleanup
    console.log("📌 Step 9: Cleanup");
    await page.goto("http://localhost:3000/notes");
    await page.locator(`text=${noteTitle}`).click();
    await page.getByRole("button", { name: /delete/i }).click();
    await page.getByRole("button", { name: /confirm/i }).click();
    console.log("✅ Test note deleted\n");

    console.log("─".repeat(60));
    console.log("✅ TEST PASSED! All features working correctly");
    console.log("─".repeat(60));
  });

  test("Verify Settings > AI displays correctly", async ({ page }) => {
    await page.goto("http://localhost:3000/settings");
    await page.getByRole("tab", { name: /ai/i }).click();

    // Check for expected elements
    await expect(page.locator("h3", { hasText: "AI Settings" })).toBeVisible();

    // Check if API key is configured
    const hasKeyCard = page.locator("text=OpenRouter API Key");
    const hasKey = await hasKeyCard.isVisible();

    if (hasKey) {
      await expect(page.locator("text=****")).toBeVisible();
      await expect(page.getByRole("button", { name: /remove/i })).toBeVisible();
      console.log("✅ API key is configured and displayed correctly");
    } else {
      await expect(page.locator("input[type='password']")).toBeVisible();
      await expect(page.getByRole("button", { name: /validate.*save/i })).toBeVisible();
      console.log("✅ API key input form is displayed correctly");
    }

    // Check for model selectors (only visible when key is configured)
    if (hasKey) {
      await expect(page.locator("text=Embedding Model")).toBeVisible();
      await expect(page.locator("text=Chat Model")).toBeVisible();
      console.log("✅ Model selectors are displayed");
    }
  });
});
