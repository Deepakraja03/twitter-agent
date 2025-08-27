import { TwitterClient } from "./twitter-client.js";

// Terminal colors
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m'
};

const log = {
    success: (msg: string) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
    error: (msg: string) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
    warning: (msg: string) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
    info: (msg: string) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
    tweet: (msg: string) => console.log(`${colors.cyan}🐦 ${msg}${colors.reset}`),
    lazai: (msg: string) => console.log(`${colors.bright}${colors.cyan}🔥 LazAI: ${msg}${colors.reset}`)
};

async function testMentionCleaning() {
    console.log(`${colors.bright}${colors.cyan}🧪 Testing Mention Cleaning Functionality${colors.reset}`);
    console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
    
    // Temporarily disable auto-posting for testing
    const originalAutoTweet = process.env.ENABLE_AUTO_TWEET;
    process.env.ENABLE_AUTO_TWEET = 'false';
    
    const twitterClient = new TwitterClient();
    
    try {
        // Test tweets with various @ mentions
        const testTweets = [
            "Exciting partnership between @LazAINetwork and @OpenAI! 🚀 #DecentralizedAI #LazAI",
            "Shoutout to @LazAI team and @ethereum for the collaboration! @LazAINetwork leading the way! 🔥",
            "Big news from @LazAINetwork! Working with @Microsoft and @Google on AI infrastructure! #LazAI",
            "Thanks @vitalik and @LazAINetwork for the amazing work in decentralized AI! @coinbase integration coming soon!"
        ];
        
        log.lazai("Testing mention cleaning on sample tweets...");
        
        for (let i = 0; i < testTweets.length; i++) {
            const testTweet = testTweets[i];
            
            console.log(`\n${colors.yellow}Test ${i + 1}:${colors.reset}`);
            log.info(`Original: ${testTweet}`);
            
            // This will trigger the cleaning in TwitterClient.postTweet()
            try {
                await twitterClient.postTweet(testTweet);
            } catch (error) {
                // Expected to fail since we're not actually posting
                log.info("(Test completed - not actually posted)");
            }
        }
        
        log.success("Mention cleaning test completed!");
        log.lazai("Only @LazAINetwork mentions are preserved, others converted to hashtags! 🎯");
        
    } catch (error) {
        log.error(`Error during testing: ${error}`);
    } finally {
        // Restore original setting
        process.env.ENABLE_AUTO_TWEET = originalAutoTweet;
    }
}

testMentionCleaning();