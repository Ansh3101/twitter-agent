const { Scraper } = require('../dist/default/cjs/index.js');

async function main() {
  try {
    // First, get cookies by logging in
    console.log('Getting cookies from login...');
    const scraper = new Scraper();
    const cookies = await scraper.persistentLogin(
      'hmji236895',
      'Commune_dev1',
      'gidag36361@lxheir.com',
      '56GFWI6O2NHPQZ3E'
    );
    
    // Convert cookies to strings for storage (e.g., in a database)
    const cookieStrings = cookies.map(cookie => cookie.toString());
    console.log('Obtained cookie strings:', cookieStrings);

    // Later, initialize a new scraper using the cookie strings directly
    console.log('\nTesting cookie initialization from strings...');
    const newScraper = await Scraper.fromCookies(cookieStrings);
    
    const isLoggedIn = await newScraper.isLoggedIn();
    console.log('Login status with cookies:', isLoggedIn);

    if (isLoggedIn) {
      const profile = await newScraper.me();
      console.log('Successfully logged in as:', profile?.username);

      // Test an API call
      const tweets = await newScraper.getTweets('elonmusk', 1);
      for await (const tweet of tweets) {
        console.log('Successfully fetched tweet:', tweet.id);
        break;
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
