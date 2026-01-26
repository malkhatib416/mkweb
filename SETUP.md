# Setup Guide - Better Auth + Drizzle Integration

## Required Packages

All packages have been added to `package.json`. Install them with:

```bash
bun install
```

## Package List

### Core Dependencies

- `better-auth@^1.4.17` - Authentication framework
- `drizzle-orm@^0.36.4` - TypeScript ORM
- `pg@^8.11.3` - PostgreSQL driver for Node.js
- `@paralleldrive/cuid2@^2.2.2` - ID generation for database

### Dev Dependencies

- `drizzle-kit@^0.31.8` - Database migration tool
- `@types/pg@^8.10.9` - TypeScript types for pg

## Installation Steps

1. **Install all dependencies:**

   ```bash
   bun install
   ```

2. **Set up environment variables:**
   - Copy `.example.env` to `.env`
   - Fill in required variables (see `.example.env`)

3. **Generate database migrations:**

   ```bash
   bun run db:generate
   ```

4. **Apply migrations to database:**
   ```bash
   bun run db:push  # For development
   # OR
   bun run db:migrate  # For production
   ```

## Verification

After installation, verify the setup:

1. Check that all packages are installed:

   ```bash
   bun pm ls
   ```

2. Verify database connection:
   - Ensure `DATABASE_URL` is set correctly
   - Test connection with `bun run db:studio`

3. Test Better Auth:
   - Start dev server: `bun dev`
   - Visit `/api/auth` to see auth endpoints

## Troubleshooting

If you encounter missing package errors:

1. **Clear cache and reinstall:**

   ```bash
   rm -rf node_modules bun.lockb
   bun install
   ```

2. **Check for version conflicts:**
   - Ensure Node.js version is compatible (18+)
   - Ensure Bun version is up to date

3. **Verify environment variables:**
   - All required env vars must be set
   - Check `.env` file exists and is properly formatted
