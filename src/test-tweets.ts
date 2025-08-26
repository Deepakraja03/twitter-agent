import { InteractiveTwitterAgent } from "./interactive-agent.js";

// Terminal colors
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    cyan: '\x1b[36m',
    green: '\x1b[32m'
};

async function testTweetGeneration() {
    console.log(`${colors.bright}${colors.cyan}🔥 Testing LazAI Tweet Generation (No Posting)${colors.reset}\n`);

    // Temporarily disable auto-posting for testing
    const originalAutoTweet = process.env.ENABLE_AUTO_TWEET;
    process.env.ENABLE_AUTO_TWEET = 'false';

    const agent = new InteractiveTwitterAgent();

    try {
        console.log(`${colors.green}1. Testing Progress Tweet:${colors.reset}`);
        await agent.generateAndPostTweet(undefined, 'progress');

        console.log(`\n${colors.green}2. Testing Community Tweet:${colors.reset}`);
        await agent.generateAndPostTweet(undefined, 'community');

        console.log(`\n${colors.green}3. Testing Announcement Tweet:${colors.reset}`);
        await agent.generateAndPostTweet(undefined, 'announcement');

        console.log(`\n${colors.green}4. Testing Custom Topic Tweet:${colors.reset}`);
        await agent.generateAndPostTweet("LazAI's revolutionary cross-chain AI consensus mechanism");

    } catch (error) {
        console.error(`❌ Error: ${error}`);
    } finally {
        // Restore original setting
        process.env.ENABLE_AUTO_TWEET = originalAutoTweet;
    }
}

testTweetGeneration();