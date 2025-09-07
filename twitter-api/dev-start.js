#!/usr/bin/env node

/**
 * Development startup script for Twitter Retrieval API
 * This script helps with development and testing
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Twitter Retrieval API in development mode...\n');

console.log('📋 Available endpoints:');
console.log('GET  /health                    - Health check');
console.log('GET  /api/docs                  - API documentation');
console.log('GET  /api/profile/:username     - User profile');
console.log('GET  /api/tweets/:username      - User tweets');
console.log('GET  /api/tweets-and-replies/:username - Tweets & replies');
console.log('GET  /api/search/tweets?q=...   - Search tweets');
console.log('GET  /api/search/profiles?q=... - Search profiles');
console.log('GET  /api/trends                - Get trends');
console.log('');

console.log('⚠️  Make sure to set up your .env file with Twitter credentials:');
console.log('   TWITTER_USERNAME=your_username');
console.log('   TWITTER_PASSWORD=your_password');
console.log('   TWITTER_EMAIL=your_email');
console.log('');

console.log('🌐 API will be available at: http://localhost:3001');
console.log('📖 Documentation at: http://localhost:3001/api/docs');
console.log('');

// Start the server
const server = spawn('node', ['server.js'], {
  stdio: 'inherit',
  cwd: path.dirname(__filename)
});

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

server.on('exit', (code) => {
  console.log(`\n🔄 Server exited with code ${code}`);
  process.exit(code);
});

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGINT');
  process.exit(0);
});
