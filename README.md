# Twitter Agent

A lightweight Twitter API client optimized for automation and persistent sessions. 

> **Credit**: This package is a fork of [agent-twitter-client](https://github.com/elizaos/agent-twitter-client) with added features for persistent cookie-based authentication and session management.

## Installation

```bash
npm install twitter-agent
```

## Quick Start

### Method 1: Basic Authentication (One-time login)
```javascript
const { Scraper } = require('twitter-agent');

const scraper = new Scraper();
await scraper.login(username, password, email, twoFactorSecret);

// Use the scraper
const tweets = await scraper.getTweets('elonmusk', 1);
```

### Method 2: Cookie-based Authentication (Recommended)

This method allows you to maintain persistent sessions across script runs:

#### Step 1: Get Persistent Cookies (Do this once)
```javascript
const scraper = new Scraper();
const cookies = await scraper.persistentLogin(
  username,
  password,
  email,          // optional
  twoFactorSecret // optional
);

// Save cookies for future use (e.g., in a database)
const cookieStrings = cookies.map(cookie => cookie.toString());
```

#### Step 2: Use Saved Cookies (Subsequent runs)
```javascript
// Option A: Load from cookie strings (e.g., from database)
const scraper = await Scraper.fromCookies(cookieStrings);

// Option B: Load from file
const scraper = await Scraper.fromCookiesFile('cookies.json');
```

#### Example: Complete Flow with Error Handling
```javascript
const { Scraper } = require('twitter-agent');

async function getTwitterClient() {
  const COOKIES_FILE = 'twitter_cookies.json';
  let scraper;

  try {
    // Try to restore session from saved cookies
    if (fs.existsSync(COOKIES_FILE)) {
      scraper = await Scraper.fromCookiesFile(COOKIES_FILE);
      if (await scraper.isLoggedIn()) {
        return scraper;
      }
    }

    // If no valid cookies, login and save new ones
    scraper = new Scraper();
    const cookies = await scraper.persistentLogin(
      process.env.TWITTER_USERNAME,
      process.env.TWITTER_PASSWORD,
      process.env.TWITTER_EMAIL,
      process.env.TWITTER_2FA_SECRET
    );

    // Save cookies for next time
    const cookieStrings = cookies.map(c => c.toString());
    fs.writeFileSync(COOKIES_FILE, JSON.stringify(cookieStrings, null, 2));
    
    return scraper;
  } catch (error) {
    console.error('Authentication failed:', error.message);
    throw error;
  }
}

// Usage
const twitter = await getTwitterClient();
const tweets = await twitter.getTweets('elonmusk', 1);
```

## Features

- ✨ **NEW**: Persistent session management with cookies
- ✨ **NEW**: Built-in session validation and recovery
- Support for 2FA and email verification
- Full Twitter API coverage (tweets, profiles, following, etc.)
- Built-in rate limiting and error handling
- TypeScript support

## API Documentation

### Authentication Methods

#### `scraper.persistentLogin(username, password, email?, twoFactorSecret?)`
Logs in and returns validated cookies for future use.
- Returns: `Promise<Cookie[]>`

#### `Scraper.fromCookies(cookies)`
Creates a new scraper instance from cookie strings or Cookie objects.
- Returns: `Promise<Scraper>`

#### `Scraper.fromCookiesFile(path)`
Creates a new scraper instance from a cookies JSON file.
- Returns: `Promise<Scraper>`

### Core Methods

#### `scraper.getTweets(username, maxTweets = 200)`
Fetches tweets from a user's timeline.
- Returns: `AsyncGenerator<Tweet>`

#### `scraper.searchTweets(query, maxTweets, searchMode?)`
Searches for tweets matching the query.
- Returns: `AsyncGenerator<Tweet>`

See the [API Documentation](docs/api.md) for a complete list of methods.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

MIT

## Credit and Attribution

This project is based on [agent-twitter-client](https://github.com/elizaos/agent-twitter-client) by elizaOS, which provides the core Twitter API functionality. We've extended it with additional features for persistent authentication and session management.
