import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@brothers-trans/database", "@brothers-trans/shared"],
};

export default nextConfig;
