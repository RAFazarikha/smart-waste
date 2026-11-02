/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next 16 dev memblokir (403) chunk JS dari origin selain localhost, sehingga halaman
  // yang dibuka lewat 127.0.0.1 atau IP LAN ter-render tanpa hydration (stuck "Memuat...").
  allowedDevOrigins: ['127.0.0.1', '192.168.*.*', '10.*.*.*'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
};
export default nextConfig;
