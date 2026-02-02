'use client';

import { Loading } from '@/components/ui/loading';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Secure Markdown renderer component
 * Converts Markdown to HTML and sanitizes it with DOMPurify
 */
export function MarkdownRenderer({
  content,
  className = '',
}: MarkdownRendererProps) {
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Configure marked options
    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    // Convert Markdown to HTML
    const rawHtml = marked.parse(content) as string;

    // Sanitize HTML with DOMPurify (only works in browser)
    // Block scripts, inline JS, and unsafe attributes
    const sanitizedHtml = DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: [
        'p',
        'br',
        'strong',
        'em',
        'u',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'ul',
        'ol',
        'li',
        'blockquote',
        'code',
        'pre',
        'a',
        'img',
        'table',
        'thead',
        'tbody',
        'tr',
        'th',
        'td',
        'hr',
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class'],
      ALLOW_DATA_ATTR: false,
    });

    setHtml(sanitizedHtml);
  }, [content]);

  if (!html) {
    return <Loading variant="text" label="Loading…" className={className} />;
  }

  return (
    <div
      className={`prose prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
