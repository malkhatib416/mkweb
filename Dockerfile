FROM oven/bun AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Disable telemetry during the build
# ENV STRIPE_SECRET_KEY="sk_test_123"
ENV NEXT_PUBLIC_DEFAULT_LOCALE="de"
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_123"
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY="6Le0uEgrAAAAAB7cuWlQDX6npFTYSb9WLv1jazLD"

RUN bun run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Create user and group using groupadd and useradd
RUN groupadd --system --gid 1001 nodejs && \
  useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next && chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["bun", "server.js"]