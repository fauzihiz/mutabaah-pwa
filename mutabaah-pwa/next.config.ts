import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // @ts-ignore - Turbopack config might be needed for some plugins
    turbopack: {},
  },
};

export default process.env.NODE_ENV === "development"
  ? nextConfig
  : withSerwist(nextConfig);
