import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // next dev serves public/ by exact file path only, so /demos/<slug>/ 404s
  // in dev; static hosts (Vercel, any file server) resolve index.html
  // themselves. Dev-only rewrite; export builds never see it.
  ...(process.env.NODE_ENV === "development"
    ? {
        async rewrites() {
          return [
            {
              source: "/demos/:path*/",
              destination: "/demos/:path*/index.html",
            },
          ];
        },
      }
    : {}),
};

export default nextConfig;
