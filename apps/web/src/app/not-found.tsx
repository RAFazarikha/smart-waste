import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/40">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">404</CardTitle>
          <CardDescription>Halaman yang kamu cari tidak ditemukan atau telah dipindahkan.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/">Kembali ke Beranda</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
