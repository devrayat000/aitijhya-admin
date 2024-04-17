import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import CopyWebpackPlugin from "copy-webpack-plugin";

const require = createRequire(import.meta.url);

const cMapsDir = path.join(
  path.dirname(require.resolve("pdfjs-dist/package.json")),
  "cmaps"
);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
  webpack(config, { webpack }) {
    config.module.rules.push({
      test: /\.pdf$/,
      use: {
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]",
        },
      },
    });
    config.resolve.alias.canvas = false;

    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^pg-native$|^cloudflare:sockets$/,
      })
    );

    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: cMapsDir,
            to: "cmaps/",
          },
        ],
      })
    );
    return config;
  },
};

export default nextConfig;
