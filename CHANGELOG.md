# Changelog

## [0.1.0] - 2025-03-02

### Added
- ✨ **Cookie-based Authentication System**
  - New `persistentLogin()` method for obtaining validated cookies
  - Static `fromCookies()` method to initialize scraper from cookie strings
  - Static `fromCookiesFile()` method to initialize scraper from JSON file
  - Automatic cookie validation and session verification
  - Support for storing cookies in databases or files

### Examples
- Added `examples/persistent-login.js` - Basic cookie generation and validation
- Added `examples/persistent-session.js` - File-based persistent session management
- Added `examples/in-memory-cookies.js` - Direct cookie string initialization

### Documentation
- Added detailed authentication examples in README.md
- Added step-by-step guide for persistent sessions
- Added API reference for new cookie-based methods
- Added proper attribution to original repository

### Under the Hood
- Improved error handling for authentication flows
- Added cookie string parsing and validation
- Added session state verification
- Added automatic session recovery logic

### Notable Changes
- Package renamed from agent-twitter-client to twitter-agent
- Repository moved to new GitHub location
- Comprehensive README rewrite focusing on persistent sessions

### Dependencies
- All dependencies updated to latest compatible versions
- Added additional type definitions for improved TypeScript support

### Attribution
This release builds upon the excellent work of [agent-twitter-client](https://github.com/elizaOS/agent-twitter-client) by elizaOS, extending it with persistent session management capabilities.
