import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use turbopack for faster dev builds
  // (run: next dev --turbopack)

  // Compress responses
  compress: true,

  // SWC minify is on by default in Next 13+; keep it explicit
  // swcMinify: true, // already default in Next 16, no-op but harmless

  images: {
    // Serve WebP/AVIF instead of original JPEG/PNG — big win for team photos
    formats: ["image/avif", "image/webp"],
    // Size hints used by next/image srcset
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 112, 128, 256],
    // Minimise layout shift: decode in parallel with render
    dangerouslyAllowSVG: false,
  },

  // Reduce JS payload: don't ship React source maps in prod
  productionBrowserSourceMaps: false,

  // Tree-shake unused locale data (Space Mono + Press Start are subset-only anyway)
  compiler: {
    // Remove console.* calls in production
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
};

export default nextConfig;
