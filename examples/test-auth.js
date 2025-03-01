import { Scraper } from '../dist/node/esm/index.mjs';
import fs from 'fs';

const cookies = [
  "guest_id_marketing=v1%3A174085042667272234; Expires=Mon, 01 Mar 2027 17:33:46 GMT; Max-Age=63072000; Domain=twitter.com; Path=/; Secure; hostOnly=false; aAge=0ms; cAge=2767ms",
  "guest_id_ads=v1%3A174085042667272234; Expires=Mon, 01 Mar 2027 17:33:46 GMT; Max-Age=63072000; Domain=twitter.com; Path=/; Secure; hostOnly=false; aAge=8ms; cAge=2775ms",
  "personalization_id=\"v1_wRO9UKGnbRTH9t+QmyEkoA==\"; Expires=Mon, 01 Mar 2027 17:33:46 GMT; Max-Age=63072000; Domain=twitter.com; Path=/; Secure; hostOnly=false; aAge=8ms; cAge=2775ms",
  "guest_id=v1%3A174085042667272234; Expires=Mon, 01 Mar 2027 17:33:46 GMT; Max-Age=63072000; Domain=twitter.com; Path=/; Secure; hostOnly=false; aAge=8ms; cAge=2775ms",
  "kdt=XtkQ7JLO0iEiv57LdiVxR5mEbfmZBPCEWoGemkNn; Expires=Sun, 30 Aug 2026 17:33:49 GMT; Max-Age=47260800; Domain=twitter.com; Path=/; Secure; HttpOnly; hostOnly=false; aAge=8ms; cAge=287ms",
  "twid=\"u=1894216185152983040\"; Expires=Thu, 28 Feb 2030 17:33:49 GMT; Max-Age=157680000; Domain=twitter.com; Path=/; Secure; hostOnly=false; aAge=8ms; cAge=287ms",
  "ct0=6823aeb495a814d0497a955de0e8ad420173b19499a3f1c3972cf9f0bdbf19aec2505146c359708de9400c0ba1e67e58b3e755b56619094890676ff5338b176170e3ef79db1effe7071d00379e1fc833; Expires=Thu, 28 Feb 2030 17:33:49 GMT; Max-Age=157680000; Domain=twitter.com; Path=/; Secure; SameSite=Lax; hostOnly=false; aAge=8ms; cAge=287ms",
  "auth_token=c81b48cb4bf7d6825b13f3280ccf71f473eebdba; Expires=Thu, 28 Feb 2030 17:33:49 GMT; Max-Age=157680000; Domain=twitter.com; Path=/; Secure; HttpOnly; hostOnly=false; aAge=8ms; cAge=287ms",
  "att=1-kOoJRFrrh3Cbx32t4kHRwkQT2uOZiB5BvG16VPXT; Expires=Sun, 02 Mar 2025 17:33:49 GMT; Max-Age=86400; Domain=twitter.com; Path=/; Secure; HttpOnly; hostOnly=false; aAge=8ms; cAge=12ms"
];

async function testCookiesAuth() {
  try {
    // Save cookies to a temporary file
    fs.writeFileSync('temp_cookies.json', JSON.stringify(cookies));

    // Initialize scraper from cookies file
    const scraper = await Scraper.fromCookiesFile('temp_cookies.json');
    console.log('Initialized scraper from cookies file');
    
    // Verify login status
    const isLoggedIn = await scraper.isLoggedIn();
    console.log('Cookies auth - Login status:', isLoggedIn);
    
    if (isLoggedIn) {
      const profile = await scraper.me();
      console.log('Cookies auth - Logged in as:', profile?.username);

      // Try to get latest tweets to verify working auth
      const tweets = await scraper.getTweets('elonmusk', 1);
      for await (const tweet of tweets) {
        console.log('Successfully fetched tweet:', tweet.id);
        break;
      }
    }
  } catch (error) {
    console.error('Cookies auth error:', error.message);
  } finally {
    // Clean up temp file
    try {
      fs.unlinkSync('temp_cookies.json');
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

async function testCredentialsAuth() {
  try {
    const scraper = new Scraper();
    await scraper.login(
      'hmji236895',
      'Commune_dev1',
      'gidag36361@lxheir.com',
      '56GFWI6O2NHPQZ3E'
    );
    
    console.log('Logged in with credentials');
    
    const isLoggedIn = await scraper.isLoggedIn();
    console.log('Credentials auth - Login status:', isLoggedIn);
    
    if (isLoggedIn) {
      const profile = await scraper.me();
      console.log('Credentials auth - Logged in as:', profile?.username);

      // Try to get latest tweets to verify working auth
      const tweets = await scraper.getTweets('elonmusk', 1);
      for await (const tweet of tweets) {
        console.log('Successfully fetched tweet:', tweet.id);
        break;
      }

      // Save cookies for future use
      const newCookies = await scraper.getCookies();
      console.log('New cookies obtained:', newCookies);
    }
  } catch (error) {
    console.error('Credentials auth error:', error.message);
  }
}

console.log('Testing authentication methods...\n');

console.log('1. Testing cookies authentication...');
await testCookiesAuth();

console.log('\n2. Testing credentials authentication...');
await testCredentialsAuth();
