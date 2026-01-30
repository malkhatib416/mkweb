import { getLocaleFromHeaders } from '@/lib/get-locale-from-headers';
import { getAllBlogPosts } from '@/lib/mdx';
import { APP_URL } from '@/utils/consts';
import type { Locale } from '@/locales/i18n';

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
  const posts = await getAllBlogPosts(locale);
  const base = `${APP_URL}/${locale}`;
  const title = locale === 'fr' ? 'MK-Web Blog' : 'MK-Web Blog';
  const description =
    locale === 'fr' ? 'Articles du blog MK-Web' : 'MK-Web blog articles';

  const items = posts
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${base}/blog/${post.id}</link>
      <description>${escapeXml(post.description ?? '')}</description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <guid isPermaLink="true">${base}/blog/${post.id}</guid>
    </item>`,
    )
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${base}/blog</link>
    <description>${escapeXml(description)}</description>
    <language>${locale}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${base}/blog/feed" rel="self" type="application/rss+xml"/>
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
