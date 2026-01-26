import { auth } from './auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Get the current session on the server
 */
export async function getServerSession() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });
  return session;
}

/**
 * Require authentication - redirects to login if not authenticated
 */
export async function requireAuth() {
  const session = await getServerSession();
  if (!session) {
    redirect('/admin/login');
  }
  return session;
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  const session = await getServerSession();
  return session?.user || null;
}
