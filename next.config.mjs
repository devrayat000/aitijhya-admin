/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "localhost" },
      { hostname: "localhost", port: "8000" },
      { hostname: "devrayat000-image-rec.hf.space", protocol: "https" },
    ],
  },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    scrollRestoration: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
