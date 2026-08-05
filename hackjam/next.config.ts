import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first, WebP as fallback. Only affects images rendered through
    // next/image — currently just the team photos in MeetTheTeam.
    formats: ["image/avif", "image/webp"],
    // Trimmed from the defaults (which run to 3840 / 384): nothing on this
    // site is rendered above 1920, so the larger breakpoints would only add
    // variants to generate and cache.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 112, 128, 256],
  },

  compiler: {
    // Strip console.* from the production bundle, but keep errors.
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
};

export default nextConfig;
