import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["192.168.1.91"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // Event images uploaded in production (Vercel Blob storage).
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
      { protocol: "http", hostname: "192.168.1.91" },
    ],
  },
};

export default withNextIntl(nextConfig);
