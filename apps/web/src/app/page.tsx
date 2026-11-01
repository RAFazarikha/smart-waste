'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCachedUser, getToken } from '@/lib/api';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const token = getToken();
    const user = getCachedUser();
    if (!token || !user) {
      router.replace('/login');
    } else if (user.role === 'admin') {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/dashboard');
    }
  }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      Memuat Smart Waste...
    </div>
  );
}
