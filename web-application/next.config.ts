import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  /* configurations for deployment */
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "export",
  reactStrictMode: true,
  basePath: "/DataVis-Project",
  images: {
    unoptimized: true
  }
};

export default nextConfig;
