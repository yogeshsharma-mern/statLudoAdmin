


// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental: {
//     optimizeCss: false,
//   },
 
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",                  // since your server runs on http
//         hostname: "indianludoking.com", // 164.52.197.192
//         // hostname:"192.168.2.116",
//         // port: "5000",   
//         pathname: "/**",                   // because your images come from port 5000
//       },
//     ],
//   },
 
//   webpack: (config, { isServer }) => {
//     if (!isServer) {
//       config.resolve.fallback = {
//         ...config.resolve.fallback,
//         fs: false,
//         net: false,
//         tls: false,
//         child_process: false,
//       };
//     }
//     return config;
//   },
// };
 
// export default nextConfig;
 
 
 
 /** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: false,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "indianludoking.com",
        pathname: "/**",
      },
    ],
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }
    return config;
  },

  async redirects() {
    return [
      {
        source: "/",              // when someone opens admin.ludoking.com/
        destination: "/admin/login", // send them to /admin/login
        permanent: true,          // set false if you want it temporary
      },
    ];
  },
};

export default nextConfig;
