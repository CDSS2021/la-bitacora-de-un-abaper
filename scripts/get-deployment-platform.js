#!/usr/bin/env node

/**
 * Get deployment platform from config
 * This script reads the deployment platform from src/config.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';

function getDeploymentPlatform() {
  if (process.env.DEPLOYMENT_PLATFORM) {
    return process.env.DEPLOYMENT_PLATFORM;
  }

  try {
    const configPath = join(process.cwd(), 'src', 'config.ts');
    const configContent = readFileSync(configPath, 'utf8');
    
    // Extract the last platform declaration; earlier matches belong to TypeScript types.
    const deploymentMatches = [...configContent.matchAll(/platform:\s*["']([^"']+)["']/g)];
    
    if (deploymentMatches.length > 0) {
      return deploymentMatches[deploymentMatches.length - 1][1];
    }
    
    return 'netlify';
  } catch (error) {
    console.error('Error reading config:', error.message);
    return 'netlify';
  }
}

// Export for use in other scripts
export default getDeploymentPlatform;

// If run directly, output the platform
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(getDeploymentPlatform());
}
