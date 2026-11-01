import * as React from 'react';
import { cn } from '@/lib/utils';

// Native <select> bergaya shadcn: aksesibel di mobile, tanpa dependensi tambahan.
export function Select({ className, ...p }: React.ComponentProps<'select'>) {
  return (
    <select data-slot="select" className={cn(
      'h-9 rounded-lg border bg-card px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:opacity-50', className)} {...p} />
  );
}
