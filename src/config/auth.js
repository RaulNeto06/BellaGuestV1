/**
 * Authentication configuration.
 * JWT_SECRET is read once at startup; the process exits if it is missing
 * in a production environment to prevent running with an insecure default.
 */
const JWT_SECRET = process.env.JWT_SECRET || 'belaguest_secret';
const JWT_EXPIRES = '7d';

if (!process.env.JWT_SECRET) {
  const msg = 'WARNING: JWT_SECRET not set in environment. Using insecure default – set it before deploying to production.';
  console.warn(msg);
}

module.exports = { JWT_SECRET, JWT_EXPIRES };
