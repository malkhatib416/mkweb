import { db } from '../lib/db';
import { user } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '../lib/auth';

async function seed() {
  console.log('🌱 Starting seed...');

  try {
    // Check if admin user already exists
    const existingAdmin = await db
      .select()
      .from(user)
      .where(eq(user.email, 'admin@mk-web.fr'))
      .limit(1);

    if (existingAdmin.length > 0) {
      console.log('✅ Admin user already exists');
    } else {
      // Create admin user using Better Auth API
      try {
        const result = await auth.api.signUpEmail({
          body: {
            email: 'admin@mk-web.fr',
            password: 'admin123', // Change this password after first login
            name: 'Admin User',
          },
        });

        if (result.user) {
          console.log('✅ Admin user created:', result.user.email);
          console.log(
            '   Password: admin123 (please change after first login)',
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
      .where(eq(user.email, 'test@mk-web.fr'))
      .limit(1);

    if (existingTest.length > 0) {
      console.log('✅ Test user already exists');
    } else {
      // Create test user using Better Auth API
      try {
        const result = await auth.api.signUpEmail({
          body: {
            email: 'test@mk-web.fr',
            password: 'test123', // Change this password after first login
            name: 'Test User',
          },
        });

        if (result.user) {
          console.log('✅ Test user created:', result.user.email);
          console.log('   Password: test123 (please change after first login)');
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

    console.log('\n✅ Seed completed!');
    console.log('\n📝 Default credentials:');
    console.log('   Admin: admin@mk-web.fr / admin123');
    console.log('   Test:  test@mk-web.fr / test123');
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
