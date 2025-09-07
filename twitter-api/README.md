# Twitter Retrieval API

A simple Express.js API for retrieving and searching Twitter data using the twitter-agent package.

## Features

- **User Profiles**: Get detailed user profile information
- **Tweets**: Retrieve tweets from any user
- **Tweets & Replies**: Get both tweets and replies from users
- **Search**: Search for tweets and profiles
- **Trends**: Get current Twitter trends

## Installation

1. Navigate to the twitter-api directory:
```bash
cd twitter-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env file with your Twitter credentials
TWITTER_USERNAME=your_username
TWITTER_PASSWORD=your_password
TWITTER_EMAIL=your_email
PORT=3001
NODE_ENV=development
```

4. Start the server:
```bash
npm start
```

For development with helpful startup info:
```bash
npm run dev
```

For simple development with auto-reload:
```bash
npm run dev:simple
```

## Environment Variables

Create a `.env` file in the root directory:

```env
TWITTER_USERNAME=your_twitter_username
TWITTER_PASSWORD=your_twitter_password
TWITTER_EMAIL=your_email_address
PORT=3001
NODE_ENV=development
```

## API Endpoints

### Health Check
- `GET /health` - Check API status

### User Data
- `GET /api/profile/:username` - Get user profile
- `GET /api/tweets/:username?count=10` - Get user's tweets
- `GET /api/tweets-and-replies/:username?count=10` - Get user's tweets and replies

### Search
- `GET /api/search/tweets?q=search_query&count=10` - Search tweets
- `GET /api/search/profiles?q=search_query&count=10` - Search profiles

### Trends & Discovery
- `GET /api/trends` - Get current trends

### Documentation
- `GET /api/docs` - Get API documentation

## Usage Examples

### Get User Profile
```bash
curl "http://localhost:3001/api/profile/elonmusk"
```

### Search Tweets
```bash
curl "http://localhost:3001/api/search/tweets?q=artificial%20intelligence&count=5"
```

### Get User's Tweets
```bash
curl "http://localhost:3001/api/tweets/elonmusk?count=10"
```

### Get Current Trends
```bash
curl "http://localhost:3001/api/trends"
```

## Response Format

All successful responses follow this format:
```json
{
  "success": true,
  "data": [...],
  "count": 10,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Error Handling

The API includes comprehensive error handling with specific error codes:

### HTTP Status Codes
- **200**: Success
- **400**: Bad Request (missing required parameters)
- **401**: Authentication Error (invalid credentials)
- **404**: Not Found (resource not found or API endpoint changed)
- **429**: Rate Limit Error (too many requests)
- **500**: Internal Server Error (general errors)

### Error Response Format
```json
{
  "success": false,
  "error": "Error description",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Common Error Codes
- `AUTHENTICATION_ERROR`: Invalid Twitter credentials
- `RATE_LIMIT_ERROR`: Twitter API rate limit exceeded
- `NOT_FOUND_ERROR`: Resource not found or API endpoint changed
- `INTERNAL_ERROR`: General server error

### Authentication Errors
If you see authentication errors, check:
1. Twitter credentials are correct in `.env`
2. Account is not locked or suspended
3. Email address matches the Twitter account
4. Twitter hasn't changed their login process

## Security

- Uses helmet for security headers
- CORS enabled for cross-origin requests
- Input validation and sanitization
- Error messages don't expose sensitive information

## Rate Limiting

Note: Twitter's API has rate limits. The twitter-agent package handles most rate limiting internally, but be mindful of your usage patterns.

## Development

For development, use:
```bash
npm run dev
```

This will start the server with nodemon for automatic restarts on file changes.

## Dependencies

- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `helmet` - Security headers
- `dotenv` - Environment variables
- `twitter-agent` - Twitter API client
- `morgan` - HTTP request logger

## License

MIT
