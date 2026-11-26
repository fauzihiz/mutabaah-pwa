import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  // Cache navigation (HTML) responses for offline use
  cacheOnNavigation: true,
  // Auto-reload page when device comes back online (triggers SW update check)
  reloadOnOnline: true,
  // OFFLINE PAGE DISABLED — removed additionalPrecacheEntries for /~offline
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
  
  allowedDevOrigins: ['192.168.0.*'],
};

export default process.env.NODE_ENV === "development"
  ? nextConfig
  : withSerwist(nextConfig);
