import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // Fix for Next.js 15/16 Turbopack vs Webpack conflict (Serwist)
  // @ts-ignore
  turbopack: {},

  // Enable full compression for production builds
  compress: true,

  // Optimize production output
  productionBrowserSourceMaps: false,

  // Optimize image handling
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Optimize barrel imports for lucide-react
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default process.env.NODE_ENV === "development"
  ? nextConfig
  : withSerwist(nextConfig);
