const { Scraper } = require('twitter-agent');
require('dotenv').config();

async function debugSimpleLogin() {
  try {
    console.log('🔍 Testing simple login...');
    console.log('Username:', process.env.TWITTER_USERNAME);
    console.log('Email:', process.env.TWITTER_EMAIL);

    const scraper = new Scraper();

    console.log('🚀 Attempting simple login...');

    await scraper.login(
      process.env.TWITTER_USERNAME,
      process.env.TWITTER_PASSWORD,
      process.env.TWITTER_EMAIL
    );

    console.log('✅ Login completed successfully!');
    console.log('⏳ Waiting 3 seconds before checking login status...');

    await new Promise(resolve => setTimeout(resolve, 3000));

    const isLoggedIn = await scraper.isLoggedIn();
    console.log('🔐 Is logged in:', isLoggedIn);

    // Try multiple checks
    console.log('🔄 Checking login status multiple times...');
    for (let i = 1; i <= 3; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const stillLoggedIn = await scraper.isLoggedIn();
      console.log(`🔐 Check ${i}: Is logged in: ${stillLoggedIn}`);
    }

    if (isLoggedIn) {
      const profile = await scraper.me();
      console.log('👤 Profile:', profile.username);

      // Test a simple API call
      console.log('🧪 Testing API call...');
      const profileTest = await scraper.getProfile('twitter');
      console.log('📊 Profile test successful:', profileTest.username);
    }

    await scraper.close();
    console.log('🔚 Test complete');

  } catch (error) {
    console.error('❌ Login failed:', error.message);
    console.error('Stack trace:', error.stack);

    // Try to get more details about the error
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

debugSimpleLogin();
