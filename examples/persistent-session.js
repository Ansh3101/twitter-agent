const { Scraper } = require('../dist/default/cjs/index.js');
const fs = require('fs');

// Example of maintaining a persistent session across script runs
async function main() {
  const COOKIES_FILE = 'twitter_cookies.json';
  let scraper;

  try {
    // Try to load existing cookies first
    if (fs.existsSync(COOKIES_FILE)) {
      console.log('Found existing cookies, trying to restore session...');
      try {
        scraper = await Scraper.fromCookiesFile(COOKIES_FILE);
        const isLoggedIn = await scraper.isLoggedIn();
        
        if (!isLoggedIn) {
          console.log('Stored cookies are no longer valid, need to login again');
          scraper = null;
        } else {
          console.log('Successfully restored session from cookies');
        }
      } catch (error) {
        console.log('Failed to restore session from cookies:', error.message);
        scraper = null;
      }
    }

    // If no valid cookies, login with credentials
    if (!scraper) {
      console.log('Logging in with credentials...');
      scraper = new Scraper();
      const cookies = await scraper.persistentLogin(
        'hmji236895',
        'Commune_dev1',
        'gidag36361@lxheir.com',
        '56GFWI6O2NHPQZ3E'
      );

      // Save new cookies for next time
      const cookieStrings = cookies.map(cookie => cookie.toString());
      fs.writeFileSync(COOKIES_FILE, JSON.stringify(cookieStrings, null, 2));
      console.log('Saved new cookies for future use');
    }

    // Use the authenticated scraper
    const profile = await scraper.me();
    console.log('Logged in as:', profile?.username);
    
    // Example API call
    const tweets = await scraper.getTweets('elonmusk', 1);
    for await (const tweet of tweets) {
      console.log('Successfully fetched tweet:', tweet.id);
      break;
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
