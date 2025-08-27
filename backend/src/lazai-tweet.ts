import { InteractiveTwitterAgent } from "./interactive-agent.js";

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

async function generateLazAITweet() {
    console.log(`${colors.bright}${colors.cyan}🔥 LazAI Network Tweet Generator${colors.reset}`);
    console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
    
    log.lazai("Generating optimized LazAI Network tweet...");
    log.info("Rule: Only @LazAINetwork tags allowed, others converted to hashtags");
    
    const agent = new InteractiveTwitterAgent();
    
    try {
        // Generate different types of tweets randomly
        const tweetTypes: ('progress' | 'community' | 'announcement')[] = ['progress', 'community', 'announcement'];
        const randomType = tweetTypes[Math.floor(Math.random() * tweetTypes.length)];
        
        log.lazai(`Generating ${randomType} tweet...`);
        
        const result = await agent.generateAndPostTweet(undefined, randomType);
        
        if (result) {
            console.log(`\n${colors.green}🎯 Final Tweet:${colors.reset}`);
            console.log(`${colors.cyan}${result.text || 'No text generated'}${colors.reset}`);
            console.log(`\n${colors.blue}📊 Stats:${colors.reset}`);
            console.log(`• Length: ${result.text?.length || 0}/280 characters`);
            console.log(`• Type: ${randomType}`);
            
            // Check if result has posted property (from non-posted tweets)
            const isPosted = 'posted' in result ? result.posted : true;
            console.log(`• Posted: ${isPosted ? '✅ Yes' : '❌ No'}`);
            
            // Check if result has id property (from posted tweets)
            if ('id' in result && result.id) {
                console.log(`• Tweet ID: ${result.id}`);
                console.log(`• URL: https://twitter.com/DeepakRaja2003/status/${result.id}`);
            }
        }
        
        log.lazai("Tweet generation complete! 🚀");
        
    } catch (error) {
        log.error(`Error generating LazAI tweet: ${error}`);
        process.exit(1);
    }
}

// Run the LazAI tweet generator
generateLazAITweet();