/**
 * Jest test setup and configuration
 */

// Set environment to test
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-do-not-use-in-production';
process.env.JWT_EXPIRES_IN = '1h';
process.env.DB_HOST = 'localhost';
process.env.DB_USER = 'test_user';
process.env.DB_PASSWORD = 'test_pass';
process.env.DB_NAME = 'belaguest_test';
process.env.CORS_ORIGIN = 'http://localhost:3000';
process.env.PORT = 3000;

// Suppress console logs during tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Timeout for async tests
jest.setTimeout(10000);
