import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

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
    cyan: '\x1b[36m'
};

const log = {
    success: (msg: string) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
    error: (msg: string) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
    warning: (msg: string) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
    info: (msg: string) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
    twitter: (msg: string) => console.log(`${colors.cyan}🐦 ${msg}${colors.reset}`)
};

export class TwitterClient {
  private client: TwitterApi;

  constructor() {
    log.info("Using OAuth 1.0a authentication (recommended for bots)");
    this.client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
    });
  }

  async searchTweets(query: string, maxResults: number = 10) {
    try {
      log.info(`Searching for: "${query}"`);
      const tweets = await this.client.v2.search(query, {
        max_results: maxResults,
        'tweet.fields': ['author_id', 'created_at', 'public_metrics'],
      });

      const results = tweets.data?.data || [];
      log.success(`Found ${results.length} tweets`);
      return results;
    } catch (error) {
      log.error(`Error searching tweets: ${error}`);
      return [];
    }
  }

  // Function to clean tweet content - only allow @LazAINetwork, convert other @ to #
  private cleanTweetMentions(tweetText: string): string {
    // Replace all @ mentions except @LazAINetwork with # hashtags
    const cleanedTweet = tweetText.replace(/@(\w+)/g, (match, username) => {
      if (username === 'LazAINetwork') {
        return match; // Keep @LazAINetwork as is
      } else {
        return `#${username}`; // Convert other @ mentions to hashtags
      }
    });
    
    return cleanedTweet;
  }

  async postTweet(text: string) {
    try {
      // Clean the tweet text before posting
      const originalText = text;
      const cleanedText = this.cleanTweetMentions(originalText);
      
      if (originalText !== cleanedText) {
        log.warning("Cleaned @ mentions (only @LazAINetwork allowed):");
        log.info(`Original: ${originalText}`);
        log.info(`Cleaned:  ${cleanedText}`);
      }
      
      log.twitter("Posting tweet to Twitter...");
      const tweet = await this.client.v2.tweet(cleanedText);
      log.success(`Tweet posted successfully! ID: ${tweet.data.id}`);
      return tweet.data;
    } catch (error) {
      log.error(`Error posting tweet: ${error}`);
      throw error;
    }
  }

  async getUserTweets(username: string, maxResults: number = 10) {
    try {
      log.info(`Fetching tweets from @${username}`);
      const user = await this.client.v2.userByUsername(username);
      if (!user.data) {
        throw new Error(`User ${username} not found`);
      }

      const tweets = await this.client.v2.userTimeline(user.data.id, {
        max_results: maxResults,
        'tweet.fields': ['created_at', 'public_metrics'],
      });

      const results = tweets.data?.data || [];
      log.success(`Retrieved ${results.length} tweets from @${username}`);
      return results;
    } catch (error) {
      log.error(`Error getting user tweets: ${error}`);
      return [];
    }
  }

  async checkAuthStatus() {
    try {
      log.info("Checking Twitter API authentication status...");

      // Try to get current user info to test auth
      const me = await this.client.v2.me();
      log.success(`Authenticated as: @${me.data?.username} (${me.data?.name})`);
      log.twitter("Twitter API access confirmed");

      return true;
    } catch (error) {
      log.error(`Authentication failed: ${error}`);
      return false;
    }
  }
}