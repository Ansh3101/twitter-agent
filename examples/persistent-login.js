const { Scraper } = require('../dist/default/cjs/index.js');
const fs = require('fs');

async function main() {
  const username = 'hmji236895';
  const password = 'Commune_dev1';
  const email = 'gidag36361@lxheir.com';
  const twoFactorSecret = '56GFWI6O2NHPQZ3E';

  try {
    // Create a new scraper instance
    const scraper = new Scraper();
    
    console.log('Getting persistent cookies...');
    // Get validated cookies using persistentLogin
    const cookies = await scraper.persistentLogin(
      username,
      password,
      email,
      twoFactorSecret
    );
    
    // Save cookies to file
    fs.writeFileSync('persistent_cookies.json', JSON.stringify(cookies, null, 2));
    console.log('Cookies saved to persistent_cookies.json\n');

    // Demonstrate how to use saved cookies
    console.log('Testing saved cookies...');
    const newScraper = await Scraper.fromCookiesFile('persistent_cookies.json');
    const isLoggedIn = await newScraper.isLoggedIn();
    console.log('Login status with saved cookies:', isLoggedIn);
    
    if (isLoggedIn) {
      const profile = await newScraper.me();
      console.log('Successfully logged in as:', profile?.username);
      
      // Test a simple API call
      const tweets = await newScraper.getTweets('elonmusk', 1);
      for await (const tweet of tweets) {
        console.log('Successfully fetched tweet:', tweet.id);
        break;
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    // Clean up temp file
    try {
      fs.unlinkSync('persistent_cookies.json');
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

main();
