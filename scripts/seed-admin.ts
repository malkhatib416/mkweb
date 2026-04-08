import { eq } from 'drizzle-orm';

import { db } from '../db';
import { user } from '../db/schema';
import { auth } from '../lib/auth';
import { ADMIN_ACCOUNT } from './consts';

async function seedAdmin() {
  console.log('🌱 Starting admin seed...');

  try {
    const existingAdmin = await db
      .select()
      .from(user)
      .where(eq(user.email, ADMIN_ACCOUNT.email))
      .limit(1);

    if (existingAdmin.length > 0) {
      console.log('✅ Admin user already exists');
      return;
    }

    try {
      const result = await auth.api.signUpEmail({
        body: {
          email: ADMIN_ACCOUNT.email,
          password: ADMIN_ACCOUNT.password,
          name: ADMIN_ACCOUNT.name,
        },
      });

      if (!result.user) {
        throw new Error('Admin user creation returned no user');
      }

      console.log('✅ Admin user created:', result.user.email);
      console.log(
        `   Password: ${ADMIN_ACCOUNT.password} (please change after first login)`,
      );
    } catch (error: any) {
      if (
        error.message?.includes('already exists') ||
        error.message?.includes('duplicate')
      ) {
        console.log('✅ Admin user already exists');
        return;
      }

      console.error('❌ Error creating admin user:', error.message);
      throw error;
    }

    console.log('\n✅ Admin seed completed!');
    console.log('\n📝 Default credentials:');
    console.log(`   Admin: ${ADMIN_ACCOUNT.email} / ${ADMIN_ACCOUNT.password}`);
    console.log('\n⚠️  Please change this password after first login!');
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    process.exit(1);
  }
}

seedAdmin()
  .then(() => {
    console.log('Admin seed script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Admin seed script failed:', error);
    process.exit(1);
  });
