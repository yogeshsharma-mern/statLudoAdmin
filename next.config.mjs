


/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: false,
  },
 
  images: {
    remotePatterns: [
      {
        protocol: "http",                  // since your server runs on http
        hostname: process.env.NEXT_PUBLIC_API_BASE_URL_Image, // 164.52.197.192
        port: "5000",                      // because your images come from port 5000
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
 
 
 
 