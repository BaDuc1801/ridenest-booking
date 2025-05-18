import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    config.cache = false; // Tắt hoàn toàn cache để tránh lỗi
    return config;
  },
};

export default nextConfig;
