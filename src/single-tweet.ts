import { InteractiveTwitterAgent } from "./interactive-agent.js";

async function postSingleTweet() {
  console.log("🤖 Single Tweet Mode\n");
  
  const agent = new InteractiveTwitterAgent();
  
  // Check if posting is enabled
  if (process.env.ENABLE_AUTO_TWEET !== 'true') {
    console.log("⚠️  Auto-posting is disabled. Set ENABLE_AUTO_TWEET=true to post tweets.");
    console.log("📝 Generating tweet preview only...\n");
  }
  
  // Generate and optionally post one tweet
  await agent.generateAndPostTweet();
  
  console.log("\n✅ Single tweet operation complete!");
}

postSingleTweet().catch(console.error);