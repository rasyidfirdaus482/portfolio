'use client';

import { useState } from 'react';
import NextImage, { ImageProps as NextImageProps } from 'next/image';
import styles from './Image.module.css';

interface ImageProps extends Omit<NextImageProps, 'src'> {
  src: string;
}

export const Image = ({ src, alt, className = '', ...props }: ImageProps) => {
  const [isLoading, setLoading] = useState(true);

  return (
    <span className={`${styles.imageWrapper} ${className}`}>
      <NextImage
        src={src}
        alt={alt}
        className={`${styles.image} ${
          isLoading ? styles.loading : styles.loaded
        }`}
        onLoad={() => setLoading(false)}
        {...props}
      />
    </span>
  );
};
