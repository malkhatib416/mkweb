import type { MDXComponents } from 'mdx/types';
import type React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Helper function to check if content looks like frontmatter
function isFrontmatterContent(children: React.ReactNode): boolean {
  // Extract text content from React node
  const extractText = (node: React.ReactNode): string => {
    if (typeof node === 'string') {
      return node;
    }
    if (typeof node === 'number') {
      return String(node);
    }
    if (Array.isArray(node)) {
      return node.map(extractText).join(' ');
    }
    if (node && typeof node === 'object' && 'props' in node) {
      const props = node.props as { children?: React.ReactNode };
      return extractText(props?.children);
    }
    return '';
  };

  const text = extractText(children).trim();

  // Check for frontmatter patterns: title:, description:, categories:, author:, publishedAt:, readTime:, image:, lang:
  // Also check if it contains multiple frontmatter fields (indicating it's likely frontmatter)
  const frontmatterPatterns = [
    /^title:\s*"/,
    /^description:\s*"/,
    /^categories:\s*\[/,
    /^author:\s*"/,
    /^publishedAt:\s*"/,
    /^readTime:\s*\d+/,
    /^image:\s*"/,
    /^lang:\s*"/,
  ];

  // Check if text contains multiple frontmatter patterns (more reliable detection)
  const matches = frontmatterPatterns.filter((pattern) => pattern.test(text));

  // If it contains 2+ frontmatter patterns, it's definitely frontmatter
  if (matches.length >= 2) {
    return true;
  }

  // Also check for single pattern matches at the start of the text
  return frontmatterPatterns.some((pattern) => pattern.test(text));
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => {
      // Filter out frontmatter content
      if (isFrontmatterContent(children)) {
        return null;
      }
      return (
        <h1 className="text-4xl font-bold text-gray-900 mb-6 mt-8">
          {children}
        </h1>
      );
    },
    h2: ({ children }) => {
      // Filter out frontmatter content
      if (isFrontmatterContent(children)) {
        return null;
      }
      return (
        <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      // Filter out frontmatter content
      if (isFrontmatterContent(children)) {
        return null;
      }
      return (
        <h3 className="text-2xl font-bold text-gray-900 mb-3 mt-6">
          {children}
        </h3>
      );
    },
    h4: ({ children }) => {
      // Filter out frontmatter content
      if (isFrontmatterContent(children)) {
        return null;
      }
      return (
        <h4 className="text-xl font-bold text-gray-900 mb-2 mt-4">
          {children}
        </h4>
      );
    },
    p: ({ children }) => {
      // Filter out frontmatter content
      if (isFrontmatterContent(children)) {
        return null;
      }
      return <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>;
    },
    a: ({ href, children }) => (
      <Link
        href={href as string}
        className="text-myorange-100 hover:text-myorange-200 underline"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </Link>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="ml-4">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-myorange-100 pl-4 italic my-4 text-gray-600">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="px-2 py-1 rounded text-sm font-mono">{children}</code>
    ),
    pre: ({ children }) => (
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
        {children}
      </pre>
    ),
    img: ({ src, alt }) => (
      <Image
        src={src!}
        width={500}
        height={300}
        alt={alt || ''}
        className="rounded-lg my-6 w-full"
        loading="lazy"
      />
    ),
    hr: () => <hr className="my-8 border-gray-200" />,
    table: ({ children }) => (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full divide-y divide-gray-200">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {children}
      </td>
    ),
    ...components,
  };
}
