import { Agent } from "alith";
import { TwitterClient } from "./twitter-client.js";
import cron from "node-cron";
import dotenv from "dotenv";

dotenv.config();

// Terminal colors for better logging
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
};

const log = {
    success: (msg: string) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
    error: (msg: string) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
    warning: (msg: string) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
    info: (msg: string) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
    tweet: (msg: string) => console.log(`${colors.cyan}🐦 ${msg}${colors.reset}`),
    progress: (msg: string) => console.log(`${colors.magenta}🚀 ${msg}${colors.reset}`),
    lazai: (msg: string) => console.log(`${colors.bright}${colors.cyan}🔥 LazAI: ${msg}${colors.reset}`)
};

export class InteractiveTwitterAgent {
    private agent: Agent;
    private twitterClient: TwitterClient;
    private isRunning: boolean = false;

    constructor() {
        // Set up Alith agent
        process.env.api_key = process.env.GROQ_API_KEY;

        // Reduce Alith SDK log verbosity for cleaner output
        process.env.RUST_LOG = "error";

        this.agent = new Agent({
            name: "LazAI Twitter Agent",
            model: "llama-3.1-8b-instant",
            preamble: `You are the official Twitter Agent for LazAI Network (@LazAINetwork).
                        GOALS:
                        - Share LazAI's achievements, partnerships, milestones, and roadmap updates in real-time.  
                        - Highlight what LazAI enables:  
                        • Decentralized AI inference & training  
                        • AI model marketplace & monetization  
                        • Cross-chain AI infrastructure  
                        • Community-driven AI development  
                        • Real-time AI analytics & insights  

                        CONTENT STYLE:
                        - Tweets must be short, viral-ready, and under 280 characters.  
                        - Technical yet accessible; visionary but backed by actual progress.  
                        - Use emojis & hashtags (#LazAI, #DecentralizedAI, plus trending AI/blockchain ones).  
                        - Mention LazAI ONLY as @LazAINetwork.  
                        - When mentioning external entities, always use **only verified official accounts** (e.g., @coinbase, @Ethereum, @MetisDAO).  

                        ACHIEVEMENTS & LINKS:
                        - If a milestone, release, or achievement is mentioned, include:  
                        1. **Verifiable link** (e.g., GitHub PR, Medium blog, partnership announcement, Dune/analytics dashboard).  
                        2. **Image or media** if available (screenshot, graph, product image, Infographic).  
                        - Never share an "achievement" without proof.  

                        DYNAMICS:
                        - Pull from current ecosystem trends and LazAI's own real-time progress (commits, deployments, partnerships, adoption metrics).  
                        - Alternate content types:
                        1. **Celebrations** (progress updates, testnet/mainnet milestones, new integrations).  
                        2. **Educational insights** (AI/blockchain intersections, infra trends).  
                        3. **Community engagement** (polls, AMAs, sneak peeks, questions).  

                        CRITICAL RULES:
                        - Never hallucinate links, data, media, or @mentions — only use valid and verifiable ones.  
                        - Every tweet should:  
                        1. Celebrate LazAI progress with proof, OR  
                        2. Educate on AI+blockchain, OR  
                        3. Drive community participation.  

                        Your job: Write tweets that innovate, inspire, and position @LazAINetwork as the leading voice in #DecentralizedAI, always supported with credible links & visuals when available.
`,
            apiKey: process.env.GROQ_API_KEY,
            baseUrl: process.env.GROQ_BASE_URL,
        });

        this.twitterClient = new TwitterClient();
    }

    // LazAI-specific tweet topics and progress updates
    private getLazAITopics() {
        return [
            "LazAI's decentralized AI infrastructure milestone",
            "Cross-chain AI model deployment progress",
            "Community-driven AI development achievements",
            "Real-time AI analytics breakthrough",
            "Decentralized AI marketplace expansion",
            "AI model monetization innovations",
            "Blockchain-powered AI training updates",
            "LazAI ecosystem growth metrics",
            "Decentralized inference network scaling",
            "AI governance and community voting"
        ];
    }

    private getProgressUpdates() {
        const updates = [
            "🚀 50,000+ AI models deployed across our decentralized network",
            "⚡ 99.9% uptime achieved on cross-chain AI infrastructure",
            "🌐 New partnerships expanding our AI ecosystem",
            "📈 300% growth in community developers this quarter",
            "🔥 Revolutionary AI consensus mechanism launched",
            "💎 $10M+ in AI model transactions processed",
            "🛠️ Advanced AI debugging tools now live",
            "🌟 Community governance proposals reaching new highs",
            "⚙️ Next-gen AI inference optimization deployed",
            "🎯 Zero-knowledge AI proofs successfully implemented",
            "🌍 Global AI node network expanded to 50+ countries",
            "💰 AI model creators earned $2M+ in rewards this month",
            "🔒 Enhanced security protocols protecting 1M+ AI operations",
            "🚄 Lightning-fast AI inference: 10x speed improvement",
            "🤝 Major enterprise partnerships signed this week"
        ];
        return updates[Math.floor(Math.random() * updates.length)];
    }

    // Generate engaging community interaction tweets
    private getCommunityEngagementTweets() {
        const engagements = [
            "What's your favorite use case for decentralized AI? Drop your thoughts below! 👇",
            "Poll: Which LazAI feature excites you most? 🗳️ A) Cross-chain inference B) AI marketplace C) Community governance",
            "Builders! What AI model would you deploy on @LazAINetwork first? 🛠️",
            "Fun fact: Our community has grown 300% this quarter! What brought you to LazAI? 🌟",
            "Challenge: Describe decentralized AI in 3 emojis. We'll retweet the best ones! 🎯",
            "Question for devs: What's the biggest challenge in AI deployment you'd like us to solve? 💭"
        ];
        return engagements[Math.floor(Math.random() * engagements.length)];
    }

    // Generate community engagement tweet
    async generateCommunityTweet() {
        try {
            log.progress("Generating community engagement tweet...");

            const engagement = this.getCommunityEngagementTweets();
            const progressUpdate = this.getProgressUpdates();

            const prompt = `Create an engaging community tweet for LazAI Network. Include this engagement element: "${engagement}" and this progress update: "${progressUpdate}". Use emojis, hashtags like #LazAI #DecentralizedAI #Community. CRITICAL: Only use @LazAINetwork for mentions, use #LazAI as hashtag never @LazAI. Keep under 250 characters to ensure Twitter compliance.`;

            const tweetContent = await this.agent.prompt(prompt);
            let cleanTweet = tweetContent.replace(/^["']|["']$/g, '').trim();

            // Ensure tweet is under character limit
            if (cleanTweet.length > 280) {
                log.warning(`Community tweet too long (${cleanTweet.length} chars), truncating...`);
                cleanTweet = cleanTweet.substring(0, 277) + "...";
            }

            log.tweet(`Community Tweet: ${cleanTweet}`);
            log.info(`Character count: ${cleanTweet.length}/280`);

            if (process.env.ENABLE_AUTO_TWEET === 'true') {
                log.progress("Posting community tweet...");
                const result = await this.twitterClient.postTweet(cleanTweet);
                log.success(`Community tweet posted! ID: ${result.id}`);
                log.lazai("Engaging with our amazing community! 🎉");
                return result;
            } else {
                log.warning("Auto-posting disabled. Set ENABLE_AUTO_TWEET=true to post automatically.");
                return { text: cleanTweet, posted: false };
            }
        } catch (error) {
            log.error(`Error generating community tweet: ${error}`);
            throw error;
        }
    }

    // Generate and post a tweet
    async generateAndPostTweet(topic?: string, tweetType: 'progress' | 'community' | 'announcement' = 'progress') {
        try {
            // Handle different tweet types
            if (tweetType === 'community') {
                return await this.generateCommunityTweet();
            }

            log.progress(`Generating LazAI ${tweetType} tweet...`);

            let prompt: string;
            if (topic) {
                prompt = `Generate an engaging ${tweetType} tweet about ${topic} for LazAI Network. Include progress updates, use emojis, relevant hashtags. CRITICAL: Only use @LazAINetwork for mentions, use #LazAI as hashtag never @LazAI. Keep under 250 characters to ensure Twitter compliance.`;
            } else {
                const randomTopic = this.getLazAITopics()[Math.floor(Math.random() * this.getLazAITopics().length)];
                const progressUpdate = this.getProgressUpdates();

                if (tweetType === 'announcement') {
                    prompt = `Create an exciting announcement tweet about ${randomTopic}. Include this major update: "${progressUpdate}". Use emojis, hashtags like #DecentralizedAI #LazAI #Blockchain #AI. CRITICAL: Only use @LazAINetwork for mentions, use #LazAI as hashtag never @LazAI. Keep under 250 characters to ensure Twitter compliance.`;
                } else {
                    prompt = `Create an exciting progress tweet about ${randomTopic}. Include this progress update: "${progressUpdate}". Use emojis, hashtags like #DecentralizedAI #LazAI #Blockchain #AI. CRITICAL: Only use @LazAINetwork for mentions, use #LazAI as hashtag never @LazAI. Keep under 250 characters to ensure Twitter compliance.`;
                }
            }

            const tweetContent = await this.agent.prompt(prompt);
            let cleanTweet = tweetContent.replace(/^["']|["']$/g, '').trim();

            // Ensure tweet is under character limit
            if (cleanTweet.length > 280) {
                log.warning(`Tweet too long (${cleanTweet.length} chars), truncating...`);
                cleanTweet = cleanTweet.substring(0, 277) + "...";
            }

            log.tweet(`Generated: ${cleanTweet}`);
            log.info(`Character count: ${cleanTweet.length}/280`);

            if (process.env.ENABLE_AUTO_TWEET === 'true') {
                log.progress("Posting to Twitter...");
                const result = await this.twitterClient.postTweet(cleanTweet);
                log.success(`Tweet posted! ID: ${result.id}`);
                log.lazai("Another milestone shared with the community! 🎉");
                return result;
            } else {
                log.warning("Auto-posting disabled. Set ENABLE_AUTO_TWEET=true to post automatically.");
                return { text: cleanTweet, posted: false };
            }
        } catch (error) {
            log.error(`Error generating/posting tweet: ${error}`);
            throw error;
        }
    }

    // Search for tweets and generate LazAI-focused responses
    async searchAndRespond(query: string) {
        try {
            log.info(`Searching for tweets about: ${query}`);
            const tweets = await this.twitterClient.searchTweets(query, 10);

            if (tweets.length === 0) {
                log.warning("No tweets found for this query.");
                return;
            }

            log.success(`Found ${tweets.length} tweets`);

            for (let i = 0; i < Math.min(3, tweets.length); i++) {
                const tweet = tweets[i];
                log.tweet(`Tweet ${i + 1}: ${tweet.text.substring(0, 100)}...`);

                // Generate LazAI-focused analysis
                const analysis = await this.agent.prompt(
                    `Analyze this tweet from LazAI Network's perspective. How does it relate to decentralized AI, blockchain, or our ecosystem? Provide insights: "${tweet.text}"`
                );
                log.lazai(`Analysis: ${analysis}`);
            }
        } catch (error) {
            log.error(`Error searching tweets: ${error}`);
        }
    }

    // Analyze user from LazAI perspective
    async analyzeUser(username: string) {
        try {
            log.info(`Analyzing @${username}'s recent tweets...`);
            const tweets = await this.twitterClient.getUserTweets(username, 5);

            if (tweets.length === 0) {
                log.warning("No tweets found for this user.");
                return;
            }

            const tweetTexts = tweets.map(t => t.text).join(" | ");
            const analysis = await this.agent.prompt(
                `Analyze @${username}'s tweets from LazAI Network's perspective. Are they interested in AI, blockchain, or decentralized tech? Could they be a potential community member or partner? Insights: ${tweetTexts}`
            );

            log.lazai(`Analysis of @${username}: ${analysis}`);
        } catch (error) {
            log.error(`Error analyzing user: ${error}`);
        }
    }

    // Start automated LazAI posting schedule
    startAutomatedPosting() {
        if (this.isRunning) {
            log.warning("Automated posting is already running!");
            return;
        }

        const interval = process.env.TWEET_INTERVAL_MINUTES || '60';
        log.progress(`Starting LazAI automated posting every ${interval} minutes...`);
        log.lazai("Ready to share our progress with the world! 🌍");

        // Schedule tweets (every hour by default)
        cron.schedule(`*/${interval} * * * *`, async () => {
            log.info("⏰ Scheduled LazAI tweet time!");
            log.lazai("Generating fresh content about our latest developments...");
            await this.generateAndPostTweet();
        });

        this.isRunning = true;
        log.success("LazAI automated posting activated! 🔥");
    }

    // Stop automated posting
    stopAutomatedPosting() {
        this.isRunning = false;
        log.warning("Automated posting stopped!");
        log.lazai("Taking a break, but we'll be back with more updates soon! 💪");
    }

    // Interactive menu
    async runInteractiveMode() {
        console.log(`
${colors.bright}${colors.cyan}🔥 LazAI Network Twitter Agent${colors.reset}
${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}

${colors.green}🚀 Available Commands:${colors.reset}
${colors.yellow}1.${colors.reset} Generate LazAI progress tweet
${colors.yellow}2.${colors.reset} Generate community engagement tweet
${colors.yellow}3.${colors.reset} Generate announcement tweet
${colors.yellow}4.${colors.reset} Search & analyze AI/blockchain tweets
${colors.yellow}5.${colors.reset} Analyze user for community fit
${colors.yellow}6.${colors.reset} Start automated LazAI posting
${colors.yellow}7.${colors.reset} Stop automated posting
${colors.yellow}8.${colors.reset} Exit

${colors.magenta}💡 Tip: All content focuses on LazAI's decentralized AI achievements!${colors.reset}
${colors.cyan}🎯 Only @LazAINetwork tags are used when mentioning the network${colors.reset}
${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}
`);

        // Demonstrate the enhanced capabilities
        await this.demonstrateCapabilities();
    }

    private async demonstrateCapabilities() {
        log.lazai("Demonstrating LazAI Twitter Agent Capabilities! 🎯");
        console.log("");

        // 0. Check authentication first
        log.info("Checking Twitter authentication...");
        const authOk = await this.twitterClient.checkAuthStatus();

        if (!authOk) {
            log.warning("Twitter authentication failed. Continuing with AI-only features...");
        }

        // 1. Generate a LazAI progress tweet
        log.progress("Generating LazAI progress tweet...");
        await this.generateAndPostTweet(undefined, 'progress');

        // 2. Generate a community engagement tweet
        log.progress("Generating community engagement tweet...");
        await this.generateAndPostTweet(undefined, 'community');

        // 3. Show announcement tweet preview
        log.progress("Generating announcement tweet preview...");
        const announcementTweet = await this.agent.prompt("Generate an exciting announcement tweet about LazAI's major partnership or breakthrough. Include progress metrics, emojis, and hashtags. Only tag @LazAINetwork if mentioning the network. Under 280 characters.");
        log.tweet(`Announcement Preview: ${announcementTweet.replace(/^["']|["']$/g, '')}`);
        log.info("(Preview only - not posted)");

        // 3. Search tweets (will be rate limited but shows capability)
        if (authOk) {
            log.progress("Searching for decentralized AI discussions...");
            await this.searchAndRespond("decentralized AI");
        }

        // 4. Show LazAI ecosystem stats
        log.lazai("Current LazAI Network Highlights:");
        console.log(`${colors.green}  • 50,000+ AI models deployed${colors.reset}`);
        console.log(`${colors.green}  • 99.9% network uptime${colors.reset}`);
        console.log(`${colors.green}  • $10M+ in transactions processed${colors.reset}`);
        console.log(`${colors.green}  • 300% community growth this quarter${colors.reset}`);

        log.success("Demo complete! LazAI Twitter Agent is ready! 🚀");

        if (!authOk) {
            console.log(`\n${colors.yellow}📋 To enable full Twitter posting:${colors.reset}`);
            console.log(`${colors.blue}1.${colors.reset} Go to https://developer.twitter.com/en/portal/dashboard`);
            console.log(`${colors.blue}2.${colors.reset} Update app permissions to 'Read and Write'`);
            console.log(`${colors.blue}3.${colors.reset} Regenerate access tokens`);
            console.log(`${colors.blue}4.${colors.reset} Update .env with new tokens`);
            console.log(`${colors.blue}5.${colors.reset} Set ENABLE_AUTO_TWEET=true in .env`);
        }

        log.lazai("Ready to showcase LazAI's innovations to the world! 🌟");
    }
}