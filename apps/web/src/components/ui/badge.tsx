import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const badgeVariants = cva('inline-flex w-fit items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap', {
  variants: {
    variant: {
      default: 'border-transparent bg-primary/10 text-primary',
      secondary: 'border-transparent bg-secondary text-secondary-foreground',
      outline: 'text-foreground',
      amber: 'border-transparent bg-amber-100 text-amber-800',
      blue: 'border-transparent bg-blue-100 text-blue-800',
      green: 'border-transparent bg-emerald-100 text-emerald-800',
      red: 'border-transparent bg-red-100 text-red-800',
      sky: 'border-transparent bg-sky-100 text-sky-800',
      yellow: 'border-transparent bg-yellow-100 text-yellow-800',
      purple: 'border-transparent bg-purple-100 text-purple-800',
    },
  },
  defaultVariants: { variant: 'default' },
});
export function Badge({ className, variant, ...p }: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...p} />;
}
