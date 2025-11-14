import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: process.env.BASE_PATH,
  assetPrefix: process.env.ASSET_PREFIX,
};

export default nextConfig;
