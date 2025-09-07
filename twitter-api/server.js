const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { Scraper } = require('twitter-agent');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Twitter scraper instance - Single login for server lifecycle
let scraper = null;
let scraperInitialized = false;
let loginTimestamp = null;

// Initialize Twitter scraper with single login
async function initializeScraper() {
  // If already initialized and less than 30 minutes ago, reuse
  if (scraperInitialized && scraper && loginTimestamp) {
    const now = Date.now();
    const timeSinceLogin = now - loginTimestamp;

    // Check if session is still valid (less than 30 minutes)
    if (timeSinceLogin < 30 * 60 * 1000) {
      console.log('Using existing Twitter scraper session');
      return scraper;
    }

    console.log('Session expired, reinitializing...');
  }

  try {
    console.log('🚀 Initializing Twitter scraper with persistent login...');

    if (!process.env.TWITTER_USERNAME || !process.env.TWITTER_PASSWORD || !process.env.TWITTER_EMAIL) {
      throw new Error('Twitter credentials not configured. Please set TWITTER_USERNAME, TWITTER_PASSWORD, and TWITTER_EMAIL environment variables.');
    }

    scraper = new Scraper();

    console.log('🔐 Attempting Twitter login...');
    await scraper.login(
      process.env.TWITTER_USERNAME,
      process.env.TWITTER_PASSWORD,
      process.env.TWITTER_EMAIL
    );



    const profile = await scraper.me();
    console.log(`✅ Twitter scraper initialized successfully for @${profile.username}`);
    console.log(`📊 Login successful with simple authentication`);

    scraperInitialized = true;
    loginTimestamp = Date.now();

    return scraper;
  } catch (error) {
    console.error('❌ Error initializing Twitter scraper:', error.message);
    scraperInitialized = false;
    loginTimestamp = null;
    throw error;
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Wrapper function for API endpoints with consistent error handling
function withScraper(endpointName, handler) {
  return async (req, res) => {
    try {
      const scraper = await initializeScraper();
      return await handler(scraper, req, res);
    } catch (error) {
      console.error(`Error in ${endpointName}:`, error.message);

      // Handle specific error types
      if (error.message.includes('credentials') || error.message.includes('login') || error.message.includes('password')) {
        return res.status(401).json({
          success: false,
          error: 'Authentication failed. Please check your Twitter credentials.',
          code: 'AUTHENTICATION_ERROR',
          timestamp: new Date().toISOString()
        });
      }

      if (error.message.includes('rate limit')) {
        return res.status(429).json({
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
          code: 'RATE_LIMIT_ERROR',
          timestamp: new Date().toISOString()
        });
      }

      if (error.message.includes('not found') || error.message.includes('404')) {
        return res.status(404).json({
          success: false,
          error: 'Resource not found or API endpoint has changed.',
          code: 'NOT_FOUND_ERROR',
          timestamp: new Date().toISOString()
        });
      }

      // Generic error
      res.status(500).json({
        success: false,
        error: error.message,
        code: 'INTERNAL_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  };
}

// Routes


// Get user profile
app.get('/api/profile/:username', withScraper('getProfile', async (scraper, req, res) => {
  const profile = await scraper.getProfile(req.params.username);
  res.json({
    success: true,
    data: profile,
    timestamp: new Date().toISOString()
  });
}));

// Get tweets from a user
app.get('/api/tweets/:username', withScraper('getTweets', async (scraper, req, res) => {
  const count = parseInt(req.query.count) || 10;
  const tweets = [];

  const tweetStream = scraper.getTweets(req.params.username, count);
  for await (const tweet of tweetStream) {
    tweets.push(tweet);
  }

  res.json({
    success: true,
    data: tweets,
    count: tweets.length,
    timestamp: new Date().toISOString()
  });
}));

// Get tweets and replies from a user
app.get('/api/tweets-and-replies/:username', withScraper('getTweetsAndReplies', async (scraper, req, res) => {
  const count = parseInt(req.query.count) || 10;
  const tweets = [];

  const tweetStream = scraper.getTweetsAndReplies(req.params.username, count);
  for await (const tweet of tweetStream) {
    tweets.push(tweet);
  }

  res.json({
    success: true,
    data: tweets,
    count: tweets.length,
    timestamp: new Date().toISOString()
  });
}));

// Search tweets
app.get('/api/search/tweets', withScraper('searchTweets', async (scraper, req, res) => {
  const query = req.query.q;
  const count = parseInt(req.query.count) || 10;

  if (!query) {
    return res.status(400).json({
      success: false,
      error: 'Query parameter "q" is required',
      timestamp: new Date().toISOString()
    });
  }

  const tweets = [];
  const tweetStream = scraper.searchTweets(query, count);
  for await (const tweet of tweetStream) {
    tweets.push(tweet);
  }

  res.json({
    success: true,
    data: tweets,
    count: tweets.length,
    query: query,
    timestamp: new Date().toISOString()
  });
}));

// Search profiles
app.get('/api/search/profiles', withScraper('searchProfiles', async (scraper, req, res) => {
  const query = req.query.q;
  const count = parseInt(req.query.count) || 10;

  if (!query) {
    return res.status(400).json({
      success: false,
      error: 'Query parameter "q" is required',
      timestamp: new Date().toISOString()
    });
  }

  const profiles = [];
  const profileStream = scraper.searchProfiles(query, count);
  for await (const profile of profileStream) {
    profiles.push(profile);
  }

  res.json({
    success: true,
    data: profiles,
    count: profiles.length,
    query: query,
    timestamp: new Date().toISOString()
  });
}));





// Get trends
app.get('/api/trends', withScraper('getTrends', async (scraper, req, res) => {
  const trends = await scraper.getTrends();

  res.json({
    success: true,
    data: trends,
    timestamp: new Date().toISOString()
  });
}));













// API documentation endpoint
app.get('/api/docs', (req, res) => {
  const documentation = {
    title: 'Twitter Retrieval API',
    version: '1.0.0',
    description: 'API for retrieving and searching Twitter data using twitter-agent',
    endpoints: {
      'GET /health': 'Health check endpoint',
      'GET /api/profile/:username': 'Get user profile information',
      'GET /api/tweets/:username': 'Get tweets from a user (query params: count)',
      'GET /api/tweets-and-replies/:username': 'Get tweets and replies from a user (query params: count)',
      'GET /api/search/tweets': 'Search tweets (query params: q, count)',
      'GET /api/search/profiles': 'Search profiles (query params: q, count)',
      'GET /api/trends': 'Get current trends'
    },
    parameters: {
      count: 'Number of items to retrieve (default: varies by endpoint)',
      q: 'Search query (required for search endpoints)'
    },
    timestamp: new Date().toISOString()
  };

  res.json(documentation);
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Twitter Retrieval API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API documentation: http://localhost:${PORT}/api/docs`);
});

module.exports = app;
