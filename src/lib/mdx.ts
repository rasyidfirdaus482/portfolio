import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const contentDirectory = path.join(process.cwd(), 'content');

export type ContentType = 'blog' | 'projects' | 'certificates';

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

    return { slug: realSlug, meta: { ...data, readingTime: timeToRead } as Record<string, any>, content };
}

export function getAllPosts(type: ContentType) {
    const slugs = getPostSlugs(type);
    const posts = slugs
        .map((slug) => getPostBySlug(type, slug))
        .filter((post): post is NonNullable<typeof post> => post !== null)
        // sort posts by date in descending order
        .sort((post1, post2) => {
            const p1 = post1 as any;
            const p2 = post2 as any;
            if (!p1.meta.date || !p2.meta.date) return 0;
            return (new Date(p1.meta.date) > new Date(p2.meta.date) ? -1 : 1);
        });
    return posts;
}
