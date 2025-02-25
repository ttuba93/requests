import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/camunda/:path*",
        destination: "http://localhost:8080/engine-rest/:path*",
      },
    ];
  },
};

export default nextConfig;
