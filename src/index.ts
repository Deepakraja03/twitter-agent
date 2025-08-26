import { Agent } from "alith";
import { TwitterClient } from "./twitter-client.js";
import dotenv from "dotenv";

dotenv.config();

// Terminal colors
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

const log = {
    success: (msg: string) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
    error: (msg: string) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
    warning: (msg: string) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
    info: (msg: string) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
    lazai: (msg: string) => console.log(`${colors.bright}${colors.cyan}🔥 LazAI: ${msg}${colors.reset}`)
};

// Set the api_key environment variable explicitly
process.env.api_key = process.env.GROQ_API_KEY;

// Reduce Alith SDK log verbosity for cleaner output
process.env.RUST_LOG = "error";

log.info("Environment variables check:");
console.log(`GROQ_API_KEY: ${process.env.GROQ_API_KEY ? colors.green + "✓ Set" + colors.reset : colors.red + "✗ Not set" + colors.reset}`);
console.log(`api_key: ${process.env.api_key ? colors.green + "✓ Set" + colors.reset : colors.red + "✗ Not set" + colors.reset}`);

const agent = new Agent({
  name: "LazAI Network Twitter Agent",
  model: "llama-3.1-8b-instant",
  preamble: "You are LazAI Network's Twitter agent, focused on decentralized AI, blockchain technology, and community engagement. Only tag @LazAINetwork when mentioning the network.",
  apiKey: process.env.GROQ_API_KEY,
  baseUrl: process.env.GROQ_BASE_URL,
});

const twitterClient = new TwitterClient();

async function main() {
  try {
    log.lazai("Testing LazAI Network Twitter Agent");
    const intro = await agent.prompt("Introduce yourself as LazAI Network's Twitter agent focused on decentralized AI and blockchain innovation.");
    log.info(intro);

    log.lazai("Testing Twitter Search for Decentralized AI");
    const tweets = await twitterClient.searchTweets("decentralized AI", 5);
    if (tweets.length > 0) {
      tweets.forEach((tweet, index) => {
        console.log(`${colors.cyan}${index + 1}.${colors.reset} ${tweet.text.substring(0, 100)}...`);
      });
    }

    log.lazai("Testing AI Analysis");
    if (tweets.length > 0) {
      const analysis = await agent.prompt(`Analyze this tweet from LazAI's perspective about decentralized AI: "${tweets[0].text}"`);
      log.info(`Analysis: ${analysis}`);
    }

    log.lazai("Testing LazAI Tweet Generation");
    const tweetIdea = await agent.prompt("Generate an exciting tweet about LazAI Network's latest decentralized AI breakthrough. Include progress metrics, emojis, hashtags. Only tag @LazAINetwork if mentioning the network. Under 280 characters.");
    log.success(`Generated tweet: ${tweetIdea}`);

    // Uncomment the line below to actually post the tweet
    // const postedTweet = await twitterClient.postTweet(tweetIdea);
    // log.success(`Posted tweet: ${postedTweet}`);

  } catch (error) {
    log.error(`Error: ${error}`);
  }
}

main();