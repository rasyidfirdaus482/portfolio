import { Feed } from "feed";
import { getAllPosts } from "@/lib/mdx";
import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = "https://your-portfolio-domain.com";
  
  const feed = new Feed({
    title: "Rasyid Firdaus Harmaini's Blog & Portfolio",
    description: "Writings and projects about Software Engineering, AI, and Cybersecurity.",
    id: baseUrl,
    link: baseUrl,
    language: "en",
    image: `${baseUrl}/favicon.ico`,
    favicon: `${baseUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Rasyid Firdaus Harmaini`,
    author: {
      name: "Rasyid Firdaus Harmaini",
      email: "hello@example.com",
      link: baseUrl,
    },
  });

  const blogs = getAllPosts("blog");
  const projects = getAllPosts("projects");

  const allItems = [...blogs, ...projects].sort((a: any, b: any) => 
    new Date(b.meta.date) > new Date(a.meta.date) ? 1 : -1
  );

  allItems.forEach((item: any) => {
    const url = item.meta.category 
        ? `${baseUrl}/projects/${item.slug}` 
        : `${baseUrl}/blog/${item.slug}`;
        
    feed.addItem({
      title: item.meta.title,
      id: url,
      link: url,
      description: item.meta.excerpt,
      content: item.meta.excerpt, 
      author: [
        {
          name: "Rasyid Firdaus Harmaini",
          email: "hello@example.com",
          link: baseUrl,
        },
      ],
      date: new Date(item.meta.date || new Date()),
    });
  });

  return new NextResponse(feed.rss2(), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
