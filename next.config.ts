import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Разрешает картинки с твоего Supabase
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Разрешает демо-картинки
      },
    ],
  },
};

export default nextConfig;