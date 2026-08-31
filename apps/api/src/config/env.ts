export const ENV_CONFIG = {
  PORT: 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  GEMINI_MODEL: 'gemini-3.7-flash',
  REGION: 'asia-southeast1',
  IS_PRODUCTION: process.env.NODE_ENV === 'production'
};
