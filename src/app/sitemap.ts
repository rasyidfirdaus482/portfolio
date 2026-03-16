import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/mdx';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://your-portfolio-domain.com';

  const blogs = getAllPosts('blog').map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.meta.date || new Date()).toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const projects = getAllPosts('projects').map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(project.meta.date || new Date()).toISOString().split('T')[0],
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
