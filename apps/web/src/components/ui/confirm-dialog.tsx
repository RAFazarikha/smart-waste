'use client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog';
import { Button } from './button';

export function ConfirmDialog({
  open, title, description, confirmText = 'Hapus', destructive = true, loading = false, onConfirm, onCancel,
}: {
  open: boolean; title: string; description: string; confirmText?: string; destructive?: boolean;
  loading?: boolean; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o && !loading) onCancel(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onCancel} disabled={loading}>Batal</Button>
          <Button variant={destructive ? 'destructive' : 'default'} onClick={onConfirm} disabled={loading}>
            {loading ? 'Memproses...' : confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
