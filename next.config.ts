import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com", port: "", pathname: "/**" },
      { protocol: "https", hostname: "github.com", port: "", pathname: "/**" },
    ],
  },

  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        // Add your production domain here before deploying:
        // "buildfolio.vercel.app",
      ],
    },
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
