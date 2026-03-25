import { MetadataRoute } from 'next';
import { getAllPostsWithSupabase } from '@/lib/posts';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rasyidfirdaus.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = (await getAllPostsWithSupabase('blog')).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date || new Date()).toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const projects = (await getAllPostsWithSupabase('projects')).map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(project.date || new Date()).toISOString().split('T')[0],
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  const routes = ['', '/about', '/blog', '/projects'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  return [...routes, ...blogs, ...projects];
}
