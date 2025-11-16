import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost } from '@/types';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const id = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        id,
        title: data.title,
        description: data.description,
        content: '', // Content will be loaded separately for detail pages
        categories: data.categories,
        author: data.author,
        publishedAt: data.publishedAt,
        readTime: data.readTime,
        image: data.image,
      } as BlogPost;
    });

  return allPostsData.sort((a, b) => {
    if (a.publishedAt < b.publishedAt) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getBlogPostById(
  id: string
): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(postsDirectory, `${id}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      id,
      title: data.title,
      description: data.description,
      content,
      categories: data.categories,
      author: data.author,
      publishedAt: data.publishedAt,
      readTime: data.readTime,
      image: data.image,
    };
  } catch (error) {
    console.error(`Error loading blog post ${id}:`, error);
    return null;
  }
}

export async function getBlogPostSlugs(): Promise<string[]> {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => fileName.replace(/\.mdx$/, ''));
}
