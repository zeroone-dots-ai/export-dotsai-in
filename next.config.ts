import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["lucide-react", "motion"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.convex.cloud" },
      { protocol: "https", hostname: "cloud.zeroonedotsai.consulting" },
      { protocol: "https", hostname: "**.dotsai.cloud" },
      { protocol: "https", hostname: "**.dotsai.in" },
    ],
  },
};

export default nextConfig;
