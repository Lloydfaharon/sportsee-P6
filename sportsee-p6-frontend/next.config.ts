import type { NextConfig } from "next";
export const proxy = "./proxy.ts";


const nextConfig: NextConfig = {
  /* config options here */
};

// next.config.js
module.exports = {
  images: {
    domains: ["localhost"], // ✅ autorise les images depuis localhost
  },
};

export default nextConfig;
