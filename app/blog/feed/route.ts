import { getLocaleFromHeaders } from '@/lib/get-locale-from-headers';
import { blogServiceServer } from '@/lib/services/blog.service.server';
import type { Locale } from '@/locales/i18n';
import { isValidLocale } from '@/locales/i18n';
import { APP_URL } from '@/utils/consts';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const locale = (await getLocaleFromHeaders()) as Locale;
  const safeLocale = isValidLocale(locale) ? locale : 'fr';
  const { data: posts } = await blogServiceServer.getAll({
    status: 'published',
    locale: safeLocale,
    limit: 1000,
    page: 1,
  });
  const base = `${APP_URL}/${safeLocale}`;
  const title = safeLocale === 'fr' ? 'MK-Web Blog' : 'MK-Web Blog';
  const description =
    safeLocale === 'fr' ? 'Articles du blog MK-Web' : 'MK-Web blog articles';

  const items = posts
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${base}/blog/${post.slug}</link>
      <description>${escapeXml(post.description ?? '')}</description>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      <guid isPermaLink="true">${base}/blog/${post.slug}</guid>
    </item>`,
    )
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${base}/blog</link>
    <description>${escapeXml(description)}</description>
    <language>${safeLocale}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${base}/blog/feed" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
