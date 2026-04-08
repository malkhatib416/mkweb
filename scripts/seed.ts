import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { category, language, translation, user } from '../db/schema';
import { auth } from '../lib/auth';
import {
  ADMIN_ACCOUNT,
  CATEGORIES_TO_SEED,
  LANGUAGES_TO_SEED,
  TEST_ACCOUNT,
} from './consts';

async function seed() {
  console.log('🌱 Starting seed...');

  try {
    // Check if admin user already exists
    const existingAdmin = await db
      .select()
      .from(user)
      .where(eq(user.email, ADMIN_ACCOUNT.email))
      .limit(1);

    if (existingAdmin.length > 0) {
      console.log('✅ Admin user already exists');
    } else {
      // Create admin user using Better Auth API
      try {
        const result = await auth.api.signUpEmail({
          body: {
            email: ADMIN_ACCOUNT.email,
            password: ADMIN_ACCOUNT.password,
            name: ADMIN_ACCOUNT.name,
          },
        });

        if (result.user) {
          console.log('✅ Admin user created:', result.user.email);
          console.log(
            `   Password: ${ADMIN_ACCOUNT.password} (please change after first login)`,
          );
        } else {
          console.log('⚠️  Admin user creation returned no user');
        }
      } catch (error: any) {
        // If user already exists or other error
        if (
          error.message?.includes('already exists') ||
          error.message?.includes('duplicate')
        ) {
          console.log('✅ Admin user already exists');
        } else {
          console.error('Error creating admin user:', error.message);
          throw error;
        }
      }
    }

    // Check if test user already exists
    const existingTest = await db
      .select()
      .from(user)
      .where(eq(user.email, TEST_ACCOUNT.email))
      .limit(1);

    if (existingTest.length > 0) {
      console.log('✅ Test user already exists');
    } else {
      // Create test user using Better Auth API
      try {
        const result = await auth.api.signUpEmail({
          body: {
            email: TEST_ACCOUNT.email,
            password: TEST_ACCOUNT.password,
            name: TEST_ACCOUNT.name,
          },
        });

        if (result.user) {
          console.log('✅ Test user created:', result.user.email);
          console.log(
            `   Password: ${TEST_ACCOUNT.password} (please change after first login)`,
          );
        } else {
          console.log('⚠️  Test user creation returned no user');
        }
      } catch (error: any) {
        // If user already exists or other error
        if (
          error.message?.includes('already exists') ||
          error.message?.includes('duplicate')
        ) {
          console.log('✅ Test user already exists');
        } else {
          console.error('Error creating test user:', error.message);
          throw error;
        }
      }
    }

    // Seed languages (fr, en) if not present
    for (const lang of LANGUAGES_TO_SEED) {
      const existing = await db
        .select()
        .from(language)
        .where(eq(language.code, lang.code))
        .limit(1);
      if (existing.length === 0) {
        await db.insert(language).values(lang);
        console.log(`✅ Language ${lang.code} (${lang.name}) created`);
      }
    }

    // Seed categories for blog articles
    for (const cat of CATEGORIES_TO_SEED) {
      const existing = await db
        .select()
        .from(translation)
        .where(
          and(
            eq(translation.entityType, 'category'),
            eq(translation.locale, 'fr'),
            eq(translation.slug, cat.slug),
          ),
        )
        .limit(1);
      if (existing.length === 0) {
        const [createdCategory] = await db
          .insert(category)
          .values({})
          .returning();
        await db.insert(translation).values([
          {
            entityType: 'category',
            categoryId: createdCategory.id,
            locale: 'fr',
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
          },
          {
            entityType: 'category',
            categoryId: createdCategory.id,
            locale: 'en',
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
          },
        ]);
        console.log(`✅ Category ${cat.slug} (${cat.name}) created`);
      }
    }

    console.log('\n✅ Seed completed!');
    console.log('\n📝 Default credentials:');
    console.log(`   Admin: ${ADMIN_ACCOUNT.email} / ${ADMIN_ACCOUNT.password}`);
    console.log(`   Test:  ${TEST_ACCOUNT.email} / ${TEST_ACCOUNT.password}`);
    console.log('\n⚠️  Please change these passwords after first login!');
  } catch (error) {
    console.error('❌ Error seeding:', error);
    process.exit(1);
  }
}

seed()
  .then(() => {
    console.log('Seed script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed script failed:', error);
    process.exit(1);
  });
