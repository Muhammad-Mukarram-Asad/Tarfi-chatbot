import type { NextConfig } from "next";

const nextConfig: NextConfig = {

 sassOptions: {
    includePaths: ['./src'],
  },
  
  // Ensure proper routing
  trailingSlash: false,

};

export default nextConfig;
