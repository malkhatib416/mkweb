import { eq } from 'drizzle-orm';
import { db } from '../db';
import { category, language, user } from '../db/schema';
import { auth } from '../lib/auth';

async function seed() {
  console.log('🌱 Starting seed...');

  try {
    const adminEmail = 'mohamad@mk-web.fr';
    const adminPassword = 'mohamad123';
    const adminName = 'Mohamad Al-Khatib';
    // Check if admin user already exists
    const existingAdmin = await db
      .select()
      .from(user)
      .where(eq(user.email, adminEmail))
      .limit(1);

    if (existingAdmin.length > 0) {
      console.log('✅ Admin user already exists');
    } else {
      // Create admin user using Better Auth API
      try {
        const result = await auth.api.signUpEmail({
          body: {
            email: adminEmail,
            password: adminPassword,
            name: adminName,
          },
        });

        if (result.user) {
          console.log('✅ Admin user created:', result.user.email);
          console.log(
            `   Password: ${adminPassword} (please change after first login)`,
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

    const testName = 'Test Name';
    const testEmail = 'test@mk-web.fr';
    const testPassword = 'test123123123';

    // Check if test user already exists
    const existingTest = await db
      .select()
      .from(user)
      .where(eq(user.email, testEmail))
      .limit(1);

    if (existingTest.length > 0) {
      console.log('✅ Test user already exists');
    } else {
      // Create test user using Better Auth API
      try {
        const result = await auth.api.signUpEmail({
          body: {
            email: testEmail,
            password: testPassword,
            name: testName,
          },
        });

        if (result.user) {
          console.log('✅ Test user created:', result.user.email);
          console.log(
            `   Password: ${testPassword} (please change after first login)`,
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
    const languagesToSeed = [
      { code: 'fr', name: 'French' },
      { code: 'en', name: 'English' },
    ];
    for (const lang of languagesToSeed) {
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
    const categoriesToSeed = [
      { name: 'SEO', slug: 'seo', description: 'Référencement et visibilité' },
      { name: 'Refonte', slug: 'refonte', description: 'Refonte de site' },
      { name: 'Tech', slug: 'tech', description: 'Technologie' },
      { name: 'Next.js', slug: 'nextjs', description: 'Next.js' },
      {
        name: 'Architecture',
        slug: 'architecture',
        description: 'Architecture web',
      },
      { name: 'TypeScript', slug: 'typescript', description: 'TypeScript' },
      {
        name: 'Technique',
        slug: 'technique',
        description: 'Développement technique',
      },
    ];
    for (const cat of categoriesToSeed) {
      const existing = await db
        .select()
        .from(category)
        .where(eq(category.slug, cat.slug))
        .limit(1);
      if (existing.length === 0) {
        await db.insert(category).values(cat);
        console.log(`✅ Category ${cat.slug} (${cat.name}) created`);
      }
    }

    console.log('\n✅ Seed completed!');
    console.log('\n📝 Default credentials:');
    console.log(`   Admin: ${adminEmail} / ${adminPassword}`);
    console.log(`   Test:  ${testEmail} / ${testPassword}`);
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
