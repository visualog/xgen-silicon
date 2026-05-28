import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingExcludes: {
    "/*": [
      "codex/**/*",
      "release/**/*",
      "sample/**/*",
      "scratch/**/*",
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
