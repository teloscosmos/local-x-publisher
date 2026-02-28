const { chromium } = require('playwright');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

/**
 * 🚀 Telos Publisher v1
 * 绕过浏览器内核输入限制的自动化 X 平台发布框架
 * - Supports Multi-threading
 * - Bypasses Unicode / Emoji truncation bugs in standard automation tools
 * - Mimics human typing pacing
 */

// ============================================================
// TEMPLATE: THREAD CONTENT
// (Replace with your actual multi-part thread content)
// ============================================================
const TWEETS = [
    `🧵 [Thread Hook]: This is tweet 1 of your amazing thread.

1/N Explain the core concept here. Use emojis freely.
Link: https://example.com`,

    `2/N 💡 Dive deeper into the topic. Use bullet points:
• Point A
• Point B
• Point C`,

    `3/N 🏁 Conclude the thread. Call to action.

#AI #Automation #Sovereignty`,
];
// ============================================================

(async () => {
    const username = process.env.X_USERNAME;
    const password = process.env.X_PASSWORD;

    if (!username || !password || username === 'your_email_or_phone_here') {
        console.error('❌ Please fully configure your .env file with X credentials.');
        process.exit(1);
    }

    const browser = await chromium.launch({
        headless: false, // Set to true to run invisibly
        args: ['--lang=en-US', '--disable-blink-features=AutomationControlled'],
        slowMo: 50,  // Add slight delay to mimic human pacing
    });

    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    });

    const page = await context.newPage();

    try {
        // ---- STEP 1: HUMAN-LIKE LOGIN ----
        console.log('🔐 Logging in to X...');
        await page.goto('https://x.com/i/flow/login', { waitUntil: 'load', timeout: 60000 });
        await page.waitForTimeout(2000);

        await page.locator('input[autocomplete="username"]').waitFor({ state: 'visible', timeout: 15000 });
        await page.locator('input[autocomplete="username"]').fill(username);
        await page.waitForTimeout(500);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);

        // Security checkpoint: Check if X asks to confirm username handle
        const confirmUsernameInput = page.locator('input[data-testid="ocfEnterTextTextInput"]');
        if (await confirmUsernameInput.count() > 0) {
            console.log('🔑 Confirming username handle...');
            await confirmUsernameInput.fill(username);
            await page.keyboard.press('Enter');
            await page.waitForTimeout(1500);
        }

        await page.locator('input[name="password"]').waitFor({ state: 'visible', timeout: 15000 });
        await page.locator('input[name="password"]').fill(password);
        await page.waitForTimeout(500);
        await page.keyboard.press('Enter');

        await page.waitForURL(url => !url.includes('/flow/login'), { timeout: 30000 });
        console.log('✅ Login successful!');
        await page.waitForTimeout(2000);

        // ---- STEP 2: NAVIGATE TO PROFILE ----
        await page.goto(`https://x.com/${username.split('@')[0]}`, { waitUntil: 'load', timeout: 30000 });
        await page.waitForTimeout(1500);

        // ---- STEP 3: COMPOSE THE THREAD ----
        console.log('\n📝 Opening compose window...');
        await page.locator('[data-testid="SideNav_NewTweet_Button"]').click();
        await page.waitForTimeout(2000);

        console.log('✍️  Writing Tweet 1...');
        await page.locator('[data-testid="tweetTextarea_0"]').waitFor({ state: 'visible', timeout: 15000 });
        await page.locator('[data-testid="tweetTextarea_0"]').focus();

        // CRITICAL: use insertText instead of type to bypass Unicode truncation limits
        await page.keyboard.insertText(TWEETS[0]);
        await page.waitForTimeout(1000);

        // Subsequent Tweets in Thread
        for (let i = 1; i < TWEETS.length; i++) {
            console.log(`✍️  Adding Tweet ${i + 1}/${TWEETS.length}...`);
            await page.locator('[data-testid="addButton"]').last().click();
            await page.waitForTimeout(1200);
            const textareas = page.locator('[data-testid^="tweetTextarea_"]');
            const count = await textareas.count();
            await textareas.nth(count - 1).waitFor({ state: 'visible' });
            await textareas.nth(count - 1).focus();
            await page.keyboard.insertText(TWEETS[i]);
            await page.waitForTimeout(800);
        }

        console.log('\n🔍 Thread composed! Posting in 3 seconds...');
        await page.waitForTimeout(3000);

        // Post all
        // await page.locator('[data-testid="tweetButton"]').last().click(); // UNCOMMENT TO ACTUALLY POST
        await page.waitForTimeout(2000);

        console.log('✅ Thread automation complete.');

    } catch (error) {
        console.error('❌ Error:', error.message);
        await page.screenshot({ path: 'debug_x_failure.png' });
        console.log('📷 Screenshot saved: debug_x_failure.png');
    } finally {
        console.log('⏳ Done. Closing in 5s...');
        await new Promise(r => setTimeout(r, 5000));
        await browser.close();
    }
})();
