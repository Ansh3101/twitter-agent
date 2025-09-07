const { Scraper } = require('../src/scraper');
require('dotenv').config();

async function debugAuth() {
  try {
    console.log('🔍 Debugging Twitter Authentication...');
    console.log('Username:', process.env.TWITTER_USERNAME);
    console.log('Email:', process.env.TWITTER_EMAIL);
    console.log('Password length:', process.env.TWITTER_PASSWORD ? process.env.TWITTER_PASSWORD.length : 'undefined');

    const scraper = new Scraper();
    console.log('🚀 Attempting login...');

    const cookies = await scraper.persistentLogin(
      process.env.TWITTER_USERNAME,
      process.env.TWITTER_PASSWORD,
      process.env.TWITTER_EMAIL,
      process.env.TWITTER_2FA_SECRET
    );

    console.log('Cookies:', cookies);

    console.log('✅ Login successful!');
    console.log('Cookies obtained:', cookies.length);

    const isLoggedIn = await scraper.isLoggedIn();
    console.log('🔐 Is logged in:', isLoggedIn);

    if (isLoggedIn) {
      const profile = await scraper.me();
      console.log('👤 Profile:', profile.username);
    }

    await scraper.close();
    console.log('🔚 Debug complete');

  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

debugAuth();
