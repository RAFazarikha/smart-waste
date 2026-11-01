'use client';
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html><body><h2>Terjadi kesalahan: {error.message}</h2><button onClick={() => reset()}>Coba lagi</button></body></html>
  );
}
