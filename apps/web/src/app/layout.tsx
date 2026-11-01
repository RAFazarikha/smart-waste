import './globals.css';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });

export const metadata: Metadata = {
  title: 'Smart Waste Management System',
  description: 'Sistem Pengelolaan & Pelaporan Sampah Cerdas Berbasis AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={montserrat.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
