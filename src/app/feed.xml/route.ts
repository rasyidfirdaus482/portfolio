import { Feed } from "feed";
import { getAllPostsWithSupabase } from "@/lib/posts";
import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://rasyidfirdaus.vercel.app").replace(/\/$/, "");
  const authorEmail = "rasyidfirdaus53@gmail.com";
  
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
      email: authorEmail,
      link: baseUrl,
    },
  });

  const blogs = await getAllPostsWithSupabase("blog");
  const projects = await getAllPostsWithSupabase("projects");

  const allItems = [...blogs, ...projects].sort((a, b) =>
    new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
  );

  allItems.forEach((item) => {
    const url = item.type === "project"
        ? `${baseUrl}/projects/${item.slug}` 
        : `${baseUrl}/blog/${item.slug}`;
        
    feed.addItem({
      title: item.title,
      id: url,
      link: url,
      description: item.excerpt || "",
      content: item.excerpt || "",
      author: [
        {
          name: "Rasyid Firdaus Harmaini",
          email: authorEmail,
          link: baseUrl,
        },
      ],
      date: new Date(item.date || new Date()),
    });
  });

  return new NextResponse(feed.rss2(), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
