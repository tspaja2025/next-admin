import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: process.env.PAGES_BASE_PATH,
  assetPrefix: process.env.ASSET_PREFIX,
};

export default nextConfig;
