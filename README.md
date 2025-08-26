# LazAI Network Twitter Agent

A sophisticated Twitter agent built with the Alith SDK and Groq integration, designed to manage LazAI Network's social media presence with AI-powered content generation and automated posting capabilities.

## 🚀 Features

- **AI-Powered Tweet Generation**: Uses Groq's LLaMA models for intelligent content creation
- **Interactive Mode**: Manual tweet generation and posting with real-time feedback
- **Automated Posting**: Scheduled tweet posting with customizable intervals
- **Multiple Tweet Types**: Progress updates, community engagement, and announcements
- **Smart Mention Handling**: Converts unauthorized mentions to hashtags (only @LazAINetwork allowed)
- **Twitter Search & Analysis**: Search and analyze tweets about decentralized AI
- **Comprehensive Testing**: Built-in test suites for various functionalities

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Twitter Developer Account with API access
- Groq API key

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd alith-twitter-agent
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file with the required credentials:
   - Twitter API credentials (API key, secret, access tokens)
   - Groq API key
   - Agent configuration settings

## 🔧 Configuration

### Required Environment Variables

| Variable | Description |
|----------|-------------|
| `TWITTER_API_KEY` | Your Twitter API key |
| `TWITTER_API_SECRET` | Your Twitter API secret |
| `TWITTER_ACCESS_TOKEN` | Your Twitter access token |
| `TWITTER_ACCESS_TOKEN_SECRET` | Your Twitter access token secret |
| `TWITTER_BEARER_TOKEN` | Your Twitter bearer token |
| `GROQ_API_KEY` | Your Groq API key for AI model access |
| `AGENT_USERNAME` | Your Twitter username |
| `TWEET_INTERVAL_MINUTES` | Interval for automated posting (default: 60) |

### Optional Configuration

- `ENABLE_AUTO_REPLY`: Enable automatic replies (default: true)
- `ENABLE_AUTO_TWEET`: Enable automated posting (default: true)
- `MAX_TWEET_LENGTH`: Maximum tweet length (default: 280)
- `NODE_ENV`: Environment mode (development/production)

## 🎯 Usage

### Quick Start Commands

#### Generate and Post LazAI Tweet
```bash
npm run lazai
```
**What it does**: Generates an AI-powered tweet specifically about LazAI Network, including progress updates, community engagement, or announcements. The tweet is automatically optimized for engagement and posted to Twitter.

#### Development Mode
```bash
npm run dev
```
**What it does**: Starts the application in development mode using ts-node. This runs the main index.ts file which:
- Tests the LazAI Network Twitter Agent
- Performs Twitter search for decentralized AI content
- Analyzes tweets from LazAI's perspective
- Generates sample tweets (without posting)
- Provides comprehensive logging and debugging information

### Other Available Commands

#### Interactive Mode
```bash
npm run interactive
```
Launches the interactive Twitter agent interface for manual tweet generation and posting.

#### Single Tweet
```bash
npm run tweet
```
Generates and posts a single tweet using the configured agent.

#### Build Project
```bash
npm run build
```
Compiles TypeScript files to JavaScript in the `dist/` directory.

#### Run Tests
```bash
npm run test-tweets      # Test tweet generation functionality
npm run test-mentions    # Test mention cleaning functionality
```

## 🤖 AI Agent Features

### Tweet Generation Types

1. **Progress Updates**: Technical achievements and development milestones
2. **Community Engagement**: Interactive content and community highlights  
3. **Announcements**: Product launches and important updates

### Smart Content Rules

- Only `@LazAINetwork` mentions are allowed
- Other mentions are automatically converted to hashtags
- Content is optimized for Twitter's 280-character limit
- Includes relevant emojis and hashtags for better engagement

## 📁 Project Structure

```
├── src/
│   ├── index.ts              # Main development entry point
│   ├── main.ts               # Interactive mode launcher
│   ├── lazai-tweet.ts        # LazAI-specific tweet generator
│   ├── interactive-agent.ts  # Interactive Twitter agent
│   ├── single-tweet.ts       # Single tweet posting
│   ├── twitter-client.ts     # Twitter API client
│   └── test-*.ts            # Test files
├── dist/                     # Compiled JavaScript files
├── llm_logs/                 # AI model interaction logs
├── .env                      # Environment variables (create from .env.example)
├── .env.example              # Environment variables template
└── package.json              # Project configuration
```

## 🔍 Monitoring & Logs

- **LLM Logs**: AI model interactions are logged in `llm_logs/`
- **Console Output**: Colored terminal output for easy debugging
- **Tweet Analytics**: Character count, type, and posting status

## 🛡️ Security & Best Practices

- Environment variables for sensitive credentials
- Rate limiting compliance with Twitter API
- Content validation before posting
- Comprehensive error handling and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Troubleshooting

### Common Issues

1. **Twitter API Errors**: Verify your API credentials and rate limits
2. **Groq API Issues**: Check your API key and quota
3. **Build Errors**: Ensure TypeScript is properly installed
4. **Environment Variables**: Double-check your `.env` file configuration

### Getting Help

- Check the logs in `llm_logs/` for detailed error information
- Verify all environment variables are properly set
- Ensure your Twitter API app has the necessary permissions

---

Built with ❤️ for the LazAI Network community