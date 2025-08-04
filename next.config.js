/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    dirs: ["src/app", "src/components", "src/lib", "src/hooks"],
    // Fail build on ESLint errors
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Fail build on TypeScript errors
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
