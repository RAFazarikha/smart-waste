'use client';
import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ImageWithFallback({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [broken, setBroken] = useState(false);
  if (broken || !src) {
    return (
      <div role="img" aria-label={alt || 'Gambar tidak dapat dimuat'} className={cn('flex items-center justify-center bg-muted text-muted-foreground', className)}>
        <ImageOff className="size-5" />
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} onError={() => setBroken(true)} className={className} />;
}
