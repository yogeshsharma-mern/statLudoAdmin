


/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: false,
  },
 
  images: {
    remotePatterns: [
      {
        protocol: "https",                  // since your server runs on http
        hostname: "indianludoking.com", // 164.52.197.192
        // hostname:"192.168.2.116",
        // port: "5000",   
        pathname: "/**",                   // because your images come from port 5000
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
};
 
export default nextConfig;
 
 
 
 