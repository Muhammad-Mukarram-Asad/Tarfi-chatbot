// // import withPWA from 'next-pwa';

// import type { NextConfig } from "next";
// const nextConfig: NextConfig = {

//   sassOptions: {
//     includePaths: ['./src'],
//   },
  
//   // Ensure proper routing
//   trailingSlash: false,

// };

// export default nextConfig;

 import withPWA from 'next-pwa';
// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
//   sassOptions: {
//     includePaths: ['./src'],
//   },
//   trailingSlash: false,  // Ensure proper routing
// };

// export default withPWA({
//   ...nextConfig,
//   pwa: {
//     dest: 'public',
//     register: true,
//     skipWaiting: true,
//   },
// });

 const nextConfig = {
       sassOptions: {
    includePaths: ['./src'],
  },
  trailingSlash: false,  // Ensure proper routing
    };

    export default withPWA({
      dest: 'public', // The output directory for the service worker and manifest
      register: true, // Register the service worker
      skipWaiting: true, // Activate the new service worker as soon as it's fetched
      // disable: process.env.NODE_ENV === 'development', // Optional: Disable PWA in development
      // swSrc: 'public/sw.js', // Optional: Path to your custom service worker file
    })(nextConfig);





