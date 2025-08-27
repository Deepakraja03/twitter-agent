import { InteractiveTwitterAgent } from "./interactive-agent.js";

// Terminal colors
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m',
    red: '\x1b[31m'
};

async function main() {
  console.log(`${colors.bright}${colors.cyan}🔥 Starting LazAI Network Twitter Agent...${colors.reset}\n`);
  
  const agent = new InteractiveTwitterAgent();
  
  try {
    // Run the interactive demonstration
    await agent.runInteractiveMode();
    
    // Uncomment below to start automated posting
    // agent.startAutomatedPosting();
  } catch (error) {
    console.log(`${colors.red}❌ Error: ${error}${colors.reset}`);
  }
}

main();