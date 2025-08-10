import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: new URL('../../.env', import.meta.url).pathname });
} else {
  dotenv.config();
}