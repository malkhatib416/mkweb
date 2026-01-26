import { betterAuth } from 'better-auth';
import { db } from './db';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error('BETTER_AUTH_SECRET environment variable is not set');
}

if (!process.env.BETTER_AUTH_URL) {
  throw new Error('BETTER_AUTH_URL environment variable is not set');
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  basePath: '/api/auth',
  // Add plugins here as needed
  // plugins: [
  //   twoFactor(),
  //   organization(),
  // ],
});

export type Session = typeof auth.$Infer.Session;
