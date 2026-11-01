'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/40">
      <Card className="max-w-md w-full text-center">
        <CardHeader className="items-center">
          <div className="size-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-2">
            <AlertCircle className="size-6" />
          </div>
          <CardTitle>Terjadi Kesalahan</CardTitle>
          <CardDescription>{error.message || 'Halaman mengalami kendala teknis'}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={reset} className="w-full">Coba Lagi</Button>
        </CardContent>
      </Card>
    </div>
  );
}
