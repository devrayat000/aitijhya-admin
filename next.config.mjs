/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "localhost" },
      { hostname: "localhost", port: "8000" },
      { hostname: "devrayat000-image-rec.hf.space", protocol: "https" },
      {
        hostname: "esztt3owbm3llyro.public.blob.vercel-storage.com",
        protocol: "https",
      },
    ],
    minimumCacheTTL: 864000 * 30,
    unoptimized: true,
  },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    scrollRestoration: true,
  },
  reactStrictMode: false,
  webpack(config, { webpack }) {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^pg-native$|^cloudflare:sockets$/,
      })
    );
    return config;
  },
};

export default nextConfig;
