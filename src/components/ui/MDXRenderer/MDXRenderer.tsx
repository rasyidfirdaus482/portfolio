import React from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrism from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeRaw from 'rehype-raw';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { Badge } from '../Badge/Badge';
import { Image } from '../Image/Image';
import { CodeBlock } from '../CodeBlock/CodeBlock';
import styles from './MDXRenderer.module.css';

type MDXRemoteOptions = React.ComponentProps<typeof MDXRemote>['options'];

const components = {
  Button,
  Card,
  Badge,
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => <CodeBlock {...props} />,
  img: ({ src, alt }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    if (typeof src !== 'string') return null;

    return (
      <Image
        src={src}
        alt={alt || ''}
        width={800}
        height={450}
        style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
      />
    );
  },
};

export function MDXRenderer({ source }: { source: string }) {
  const options = {
    mdxOptions: {
      rehypePlugins: [
        [rehypeRaw, { passThrough: ['mdxjsEsm', 'mdxJsxFlowElement', 'mdxJsxTextElement', 'mdxTextExpression', 'mdxFlowExpression'] }],
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        [rehypePrism as unknown, { ignoreMissing: true }],
      ],
    },
  };

  return (
    <article className={styles.mdxContent}>
      <MDXRemote source={source} components={components} options={options as MDXRemoteOptions} />
    </article>
  );
}
