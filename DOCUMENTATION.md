# Twitter Agent Documentation

## Table of Contents
- [Introduction](#introduction)
- [Installation](#installation)
- [Authentication](#authentication)
  - [Cookie-Based Authentication](#cookie-based-authentication)
  - [Password-Based Authentication](#password-based-authentication)
  - [API Key Authentication](#api-key-authentication)
- [Working with Tweets](#working-with-tweets)
  - [Getting Tweets](#getting-tweets)
  - [Sending Tweets](#sending-tweets)
  - [Searching Tweets](#searching-tweets)
  - [Interacting with Tweets](#interacting-with-tweets)
- [User Profiles](#user-profiles)
  - [Fetching Profiles](#fetching-profiles)
- [Relationships](#relationships)
  - [Followers and Following](#followers-and-following)
  - [Following a User](#following-a-user)
- [Timelines](#timelines)
  - [Home Timeline](#home-timeline)
  - [User Timeline](#user-timeline)
  - [Following Timeline](#following-timeline)
  - [List Timeline](#list-timeline)
- [Search](#search)
  - [Searching Profiles](#searching-profiles)
  - [Searching Tweets](#searching-tweets-1)
- [Direct Messages](#direct-messages)
- [Trends](#trends)
- [Twitter Spaces](#twitter-spaces)
  - [Joining and Creating Spaces](#joining-and-creating-spaces)
  - [Recording Spaces](#recording-spaces)
- [Error Handling](#error-handling)
- [Advanced Usage](#advanced-usage)
  - [Cookie Management](#cookie-management)
  - [Command Interface](#command-interface)
  - [Two-Factor Authentication](#two-factor-authentication)
- [Examples](#examples)

## Introduction

Twitter Agent is a comprehensive Node.js library for interacting with Twitter's web interface and API. It provides a wide range of functionalities including authentication, tweeting, searching, profile management, direct messaging, and more.

The library uses a combination of web scraping and API interactions to provide functionality that might not be available through the official API alone.

## Installation

```bash
npm install twitter-agent
```

## Authentication

Twitter Agent supports multiple authentication methods:

### Cookie-Based Authentication

Cookie-based authentication is the recommended method for most use cases as it's more stable and less likely to trigger Twitter's security mechanisms.

```javascript
import { Scraper } from 'twitter-agent';

// Load cookies from a JSON file
const scraper = await Scraper.fromCookieFile('./twitter_cookies.json');

// Or from a string
const cookieString = 'auth_token=xyz; ct0=abc;';
const scraper = await Scraper.fromCookieString(cookieString);
```

### Password-Based Authentication

```javascript
import { Scraper } from 'twitter-agent';

const scraper = new Scraper();
await scraper.login('your-username', 'your-password');

// Optionally save cookies for later use
await scraper.saveCookiesToFile('./twitter_cookies.json');
```

### API Key Authentication

```javascript
import { Scraper } from 'twitter-agent';

const scraper = new Scraper({
  authMethod: 'api',
  apiKey: 'your-api-key',
  apiSecret: 'your-api-secret',
  accessToken: 'your-access-token',
  accessTokenSecret: 'your-access-token-secret'
});
```

## Working with Tweets

### Getting Tweets

```javascript
// Get a specific tweet by ID
const tweet = await scraper.getTweet('1234567890');

// Get the latest tweet from a user
const latestTweet = await scraper.getLatestTweet('elonmusk');

// Get all tweets by a user
const userTweets = await scraper.getUserTweets('elonmusk', { count: 10 });

// Get a tweet thread
const thread = await scraper.getTweetThread('1234567890');
```

### Sending Tweets

```javascript
// Send a simple text tweet
await scraper.sendTweet('Hello, world!');

// Send a tweet with media
await scraper.sendTweet('Check out this image!', {
  media: ['./path/to/image.jpg']
});

// Send a tweet with multiple media files (up to 4)
await scraper.sendTweet('Multiple media files', {
  media: [
    './path/to/image1.jpg',
    './path/to/image2.png',
    './path/to/video.mp4'
  ]
});

// Quote a tweet
await scraper.sendTweet('My thoughts on this', {
  quoteTweetId: '1234567890'
});

// Reply to a tweet
await scraper.sendTweet('I agree with you!', {
  replyToTweetId: '1234567890'
});
```

### Searching Tweets

```javascript
// Search for tweets matching a query
const searchResults = await scraper.searchTweets('climate change');

// Get the first result that matches a query
const firstResult = await scraper.findFirstTweet('climate change');

// Search with advanced options
const filteredSearch = await scraper.searchTweets('climate change', {
  from: 'nasa',
  filter: 'media'
});
```

### Interacting with Tweets

```javascript
// Like a tweet
await scraper.likeTweet('1234567890');

// Retweet
await scraper.retweet('1234567890');

// Reply to a tweet
await scraper.replyToTweet('1234567890', 'Great point!');

// Quote tweet
await scraper.quoteTweet('1234567890', 'Check this out!');
```

## User Profiles

### Fetching Profiles

```javascript
// Get a user's profile by screen name
const profile = await scraper.getProfile('elonmusk');

// Get a user's profile by ID
const profileById = await scraper.getProfileById('12345');

// Get screen name from user ID
const screenName = await scraper.getScreenNameByUserId('12345');
```

## Relationships

### Followers and Following

```javascript
// Get a user's followers
const followers = await scraper.getFollowers('elonmusk', { count: 50 });

// Get who a user is following
const following = await scraper.getFollowing('elonmusk', { count: 50 });
```

### Following a User

```javascript
// Follow a user
await scraper.followUser('elonmusk');
```

## Timelines

### Home Timeline

```javascript
// Get your home timeline
const homeTweets = await scraper.getHomeTimeline({ count: 20 });
```

### User Timeline

```javascript
// Get tweets from a specific user
const userTweets = await scraper.getUserTweets('elonmusk', { count: 20 });
```

### Following Timeline

```javascript
// Get tweets from accounts you follow
const followingTweets = await scraper.getFollowingTimeline({ count: 20 });
```

### List Timeline

```javascript
// Get tweets from a Twitter list
const listTweets = await scraper.getListTimeline('1234567890', { count: 20 });
```

## Search

### Searching Profiles

```javascript
// Search for user profiles
const profiles = await scraper.searchProfiles('elon musk');
```

### Searching Tweets

```javascript
// Basic search
const tweets = await scraper.searchTweets('machine learning');

// Advanced search with filters
const filteredTweets = await scraper.searchTweets('machine learning', {
  from: 'google',
  filter: 'media',
  since: '2023-01-01',
  until: '2023-12-31'
});
```

## Direct Messages

```javascript
// Get conversations
const conversations = await scraper.getConversations();

// Get messages from a specific conversation
const messages = await scraper.getMessages('conversation-id');

// Send a direct message
await scraper.sendMessage('user-id', 'Hello there!');
```

## Trends

```javascript
// Get current trends
const trends = await scraper.getTrends();
```

## Twitter Spaces

Twitter Agent includes functionality to interact with Twitter Spaces.

### Joining and Creating Spaces

```javascript
import { Space } from 'twitter-agent';

// Join an existing space
const space = new Space({
  id: 'space-id',
  mode: 'INTERACTIVE',
  title: 'My Space',
  description: 'A cool space for discussion',
  languages: ['en'],
  record: false
});

await space.connect();

// Create your own space
const mySpace = new Space({
  mode: 'INTERACTIVE',
  title: 'My Own Space',
  description: 'Let\'s discuss topics',
  languages: ['en'],
  record: true
});

await mySpace.create();
```

### Recording Spaces

```javascript
// Configure recording plugin
space.use(RecordToDiskPlugin, {
  outputDir: './recordings'
});

// Start recording
await space.startRecording();

// Stop recording
await space.stopRecording();
```

## Error Handling

Twitter Agent includes specific error types for different situations:

```javascript
import { TwitterError, AuthenticationError, RateLimitError } from 'twitter-agent';

try {
  await scraper.getTweet('1234567890');
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Authentication failed. Please check your credentials.');
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded. Please try again later.');
  } else if (error instanceof TwitterError) {
    console.error(`Twitter error: ${error.message}`);
  } else {
    console.error(`Unexpected error: ${error}`);
  }
}
```

## Advanced Usage

### Cookie Management

```javascript
// Save cookies for later use
await scraper.saveCookiesToFile('./twitter_cookies.json');

// Check if cookies are valid
const isValid = await scraper.areCookiesValid();

// Refresh cookies
await scraper.refreshCookies();
```

### Command Interface

Twitter Agent provides a command-based interface for more complex operations:

```javascript
import { Command } from 'twitter-agent';

const cmd = new Command(scraper);

// Execute commands
await cmd.execute('tweet', 'Hello world!');
await cmd.execute('follow', 'elonmusk');
await cmd.execute('search', 'climate change');
```

### Two-Factor Authentication

```javascript
// Login with 2FA
await scraper.login('username', 'password', 'email', 'two-factor-secret');

// Or provide the 2FA code separately
await scraper.login('username', 'password');
await scraper.submitTwoFactorCode('123456');
```

## Examples

Here are some more complete examples:

### Persistent Session

```javascript
import { Scraper } from 'twitter-agent';
import fs from 'fs';

const COOKIE_FILE = './twitter_cookies.json';

async function main() {
  let scraper;
  
  // Try to load existing cookies
  if (fs.existsSync(COOKIE_FILE)) {
    scraper = await Scraper.fromCookieFile(COOKIE_FILE);
    
    // Verify cookies are valid
    const isValid = await scraper.areCookiesValid();
    if (!isValid) {
      // Re-login if cookies are invalid
      scraper = new Scraper();
      await scraper.login(process.env.TWITTER_USERNAME, process.env.TWITTER_PASSWORD);
      await scraper.saveCookiesToFile(COOKIE_FILE);
    }
  } else {
    // First-time login
    scraper = new Scraper();
    await scraper.login(process.env.TWITTER_USERNAME, process.env.TWITTER_PASSWORD);
    await scraper.saveCookiesToFile(COOKIE_FILE);
  }
  
  // Now use the scraper...
  const homeTweets = await scraper.getHomeTimeline({ count: 5 });
  console.log('Home timeline:', homeTweets);
}

main().catch(console.error);
```

### Monitor a Hashtag and Respond

```javascript
import { Scraper } from 'twitter-agent';

async function monitorHashtag(hashtag, responseText) {
  const scraper = await Scraper.fromCookieFile('./twitter_cookies.json');
  
  let lastSeenId = '';
  
  // Poll for new tweets every minute
  setInterval(async () => {
    try {
      const tweets = await scraper.searchTweets(`#${hashtag}`);
      
      if (tweets.length > 0 && tweets[0].id !== lastSeenId) {
        // Found a new tweet
        const newTweet = tweets[0];
        lastSeenId = newTweet.id;
        
        console.log(`New tweet found: ${newTweet.text}`);
        
        // Reply to the tweet
        await scraper.replyToTweet(newTweet.id, responseText);
        console.log('Replied to tweet');
      }
    } catch (error) {
      console.error('Error monitoring hashtag:', error);
    }
  }, 60000); // Check every minute
}

monitorHashtag('AskMe', 'Thanks for using the #AskMe hashtag! I\'m here to help.');
```

This documentation provides a comprehensive overview of the Twitter Agent package's features and functionality. It covers authentication methods, working with tweets, users, and other Twitter features, along with examples of how to use them.
