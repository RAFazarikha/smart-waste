'use client';
import * as React from 'react';
import { Dialog as D } from 'radix-ui';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Dialog = D.Root;
export const DialogTrigger = D.Trigger;
export const DialogClose = D.Close;
export const DialogTitle = ({ className, ...p }: React.ComponentProps<typeof D.Title>) =>
  <D.Title className={cn('text-lg leading-none font-semibold', className)} {...p} />;
export const DialogDescription = ({ className, ...p }: React.ComponentProps<typeof D.Description>) =>
  <D.Description className={cn('text-sm text-muted-foreground', className)} {...p} />;

export function DialogContent({ className, children, ...p }: React.ComponentProps<typeof D.Content>) {
  return (
    <D.Portal>
      <D.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
      <D.Content className={cn(
        'fixed top-1/2 left-1/2 z-50 max-h-[92vh] w-[calc(100%-1.5rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border bg-card p-5 shadow-lg data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95', className)} {...p}>
        {children}
        <D.Close className="absolute top-4 right-4 rounded-md p-1 opacity-70 transition hover:opacity-100 focus-visible:ring-[3px] focus-visible:ring-ring/40 outline-none">
          <X className="size-4" /><span className="sr-only">Tutup</span>
        </D.Close>
      </D.Content>
    </D.Portal>
  );
}

export const DialogHeader = ({ className, ...p }: React.ComponentProps<'div'>) =>
  <div className={cn('flex flex-col gap-1.5 pr-8', className)} {...p} />;
