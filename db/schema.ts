import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core';

/**
 * Better Auth required tables
 * These tables are used by Better Auth for authentication
 * The drizzleAdapter will use these table names and structure
 */
export const user = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  expiresAt: timestamp('expiresAt'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const verification = pgTable('verification', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Language table (drives which locales exist; used for AI article generation per language)
export const language = pgTable('language', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  code: text('code').notNull().unique(), // e.g. 'fr', 'en'
  name: text('name').notNull(), // e.g. 'French', 'English'
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Blog posts table
export const blog = pgTable(
  'blog',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    title: text('title').notNull(),
    slug: text('slug').notNull(),
    locale: text('locale', { enum: ['fr', 'en'] })
      .notNull()
      .default('fr'),
    description: text('description'),
    content: text('content').notNull(), // Markdown content
    status: text('status', { enum: ['draft', 'published'] })
      .notNull()
      .default('draft'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  },
  (table) => ({
    // Unique constraint on slug + locale combination
    uniqueSlugLocale: unique().on(table.slug, table.locale),
  }),
);

// Client table (can have one or many projects; can upload photo; review per project via temporary link)
export const client = pgTable('client', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name').notNull(),
  email: text('email'),
  company: text('company'),
  photo: text('photo'), // URL after upload (e.g. Vercel Blob)
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Projects table (optional clientId: many projects can belong to one client)
export const project = pgTable(
  'project',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    title: text('title').notNull(),
    slug: text('slug').notNull(),
    locale: text('locale', { enum: ['fr', 'en'] })
      .notNull()
      .default('fr'),
    description: text('description'),
    content: text('content').notNull(), // Markdown content
    status: text('status', { enum: ['draft', 'published'] })
      .notNull()
      .default('draft'),
    clientId: text('clientId').references(() => client.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  },
  (table) => ({
    uniqueSlugLocale: unique().on(table.slug, table.locale),
  }),
);

// Project review: client can leave a review per project via temporary link (token)
export const projectReview = pgTable(
  'project_review',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    projectId: text('projectId')
      .notNull()
      .references(() => project.id, { onDelete: 'cascade' }),
    clientId: text('clientId')
      .notNull()
      .references(() => client.id, { onDelete: 'cascade' }),
    token: text('token').notNull().unique(), // temporary link token
    tokenExpiresAt: timestamp('tokenExpiresAt').notNull(),
    reviewText: text('reviewText'),
    rating: text('rating', { enum: ['1', '2', '3', '4', '5'] }),
    submittedAt: timestamp('submittedAt'), // null until client submits
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  },
  (table) => ({
    uniqueProjectClient: unique().on(table.projectId, table.clientId),
  }),
);

// Newsletter subscribers (email signup from footer)
export const newsletterSubscriber = pgTable('newsletter_subscriber', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  email: text('email').notNull().unique(),
  locale: text('locale', { enum: ['fr', 'en'] })
    .notNull()
    .default('fr'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

// Relations (for db.query API)
export const projectReviewRelations = relations(projectReview, ({ one }) => ({
  project: one(project, {
    fields: [projectReview.projectId],
    references: [project.id],
  }),
  client: one(client, {
    fields: [projectReview.clientId],
    references: [client.id],
  }),
}));

export const projectRelations = relations(project, ({ one, many }) => ({
  client: one(client, {
    fields: [project.clientId],
    references: [client.id],
  }),
  reviews: many(projectReview),
}));

export const clientRelations = relations(client, ({ many }) => ({
  projects: many(project),
  reviews: many(projectReview),
}));
