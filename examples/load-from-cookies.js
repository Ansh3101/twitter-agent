import { Scraper } from '../dist/node/esm/index.mjs';

async function main() {
  try {
    // Initialize scraper from cookies file
    const scraper = await Scraper.fromCookiesFile('cookies.json');
    console.log('Initialized scraper from cookies file');
    
    // Verify login status
    const isLoggedIn = await scraper.isLoggedIn();
    console.log('Login status:', isLoggedIn);
    
    if (isLoggedIn) {
      // Get user profile to verify authentication
      const profile = await scraper.me();
      console.log('Logged in as:', profile?.username);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
