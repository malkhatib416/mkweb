import { requireAuth } from '@/lib/auth-utils';
import { blogServiceServer } from '@/lib/services/blog.service.server';
import { projectServiceServer } from '@/lib/services/project.service.server';
import { getErrorMessage, getErrorStatus } from '@/lib/utils/api-error-handler';
import { NextRequest, NextResponse } from 'next/server';

export type RecentActivityItem = {
  id: string;
  type: 'blog' | 'project';
  title: string;
  status: string;
  locale: string;
  updatedAt: string;
  href: string;
};

function toUpdatedAtString(value: Date | string): string {
  return typeof value === 'string' ? value : value.toISOString();
}

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get('limit') || '10')),
    );
    const offset = (page - 1) * limit;

    const [blogRes, projectRes] = await Promise.all([
      blogServiceServer.getAll({ page: 1, limit: 500 }),
      projectServiceServer.getAll({ page: 1, limit: 500 }),
    ]);

    const blogItems: RecentActivityItem[] = blogRes.data.map((b) => ({
      id: b.id,
      type: 'blog' as const,
      title: b.title,
      status: b.status,
      locale: b.locale,
      updatedAt: toUpdatedAtString(b.updatedAt),
      href: `/admin/blogs/${b.id}`,
    }));
    const projectItems: RecentActivityItem[] = projectRes.data.map((p) => ({
      id: p.id,
      type: 'project' as const,
      title: p.title,
      status: p.status,
      locale: p.locale,
      updatedAt: toUpdatedAtString(p.updatedAt),
      href: `/admin/projects/${p.id}`,
    }));

    const merged = [...blogItems, ...projectItems].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
    const total = merged.length;
    const pages = Math.max(1, Math.ceil(total / limit));
    const data = merged.slice(offset, offset + limit);

    return NextResponse.json({
      data,
      pagination: { page, limit, total, pages },
      success: true,
    });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to fetch recent activity') },
      { status: getErrorStatus(error) },
    );
  }
}
