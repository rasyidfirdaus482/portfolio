import React from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrism from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { Badge } from '../Badge/Badge';
import { Image } from '../Image/Image';
import { CodeBlock } from '../CodeBlock/CodeBlock';
import styles from './MDXRenderer.module.css';

const components = {
  Button,
  Card,
  Badge,
  pre: (props: any) => <CodeBlock {...props} />,
  img: (props: any) => (
    <Image
      src={props.src}
      alt={props.alt || ''}
      width={800}
      height={450}
      style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
    />
  ),
};

export function MDXRenderer({ source }: { source: string }) {
  const options = {
    mdxOptions: {
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        [rehypePrism as any, { ignoreMissing: true }],
      ],
    },
  };

  return (
    <article className={styles.mdxContent}>
      <MDXRemote source={source} components={components} options={options as any} />
    </article>
  );
}
