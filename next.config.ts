import type { NextConfig } from "next";

const nextConfig: NextConfig = {

 sassOptions: {
    includePaths: ['./src'],
  },
  
  // Critical for Netlify deployment
  images: {
    unoptimized: true,
  },
  
  // Ensure proper routing
  trailingSlash: false,

};

export default nextConfig;
