import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const contentDirectory = path.join(process.cwd(), 'content');

export type ContentType = 'blog' | 'projects' | 'certificates';

export interface PostMeta {
    title?: string;
    excerpt?: string;
    date?: string;
    readingTime?: string;
    category?: string;
    technologies?: string[];
    issuer?: string;
    credentialUrl?: string;
    github?: string;
    demo?: string;
    cover_image?: string;
    [key: string]: unknown;
}

export function getPostSlugs(type: ContentType) {
    const dir = path.join(contentDirectory, type);
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter(file => file.endsWith('.mdx') || file.endsWith('.md'));
}

export function getPostBySlug(type: ContentType, slug: string) {
    const realSlug = slug.replace(/\.mdx?$/, '');

    let fullPath = path.join(contentDirectory, type, `${realSlug}.mdx`);
    if (!fs.existsSync(fullPath)) {
        fullPath = path.join(contentDirectory, type, `${realSlug}.md`);
    }

    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const timeToRead = readingTime(content).text;

    return { slug: realSlug, meta: { ...(data as PostMeta), readingTime: timeToRead }, content };
}

export function getAllPosts(type: ContentType) {
    const slugs = getPostSlugs(type);
    const posts = slugs
        .map((slug) => getPostBySlug(type, slug))
        .filter((post): post is NonNullable<typeof post> => post !== null)
        // sort posts by date in descending order
        .sort((post1, post2) => {
            if (!post1.meta.date || !post2.meta.date) return 0;
            return (new Date(post1.meta.date) > new Date(post2.meta.date) ? -1 : 1);
        });
    return posts;
}
