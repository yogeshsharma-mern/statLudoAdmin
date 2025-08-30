


/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: false,
  },
 
  images: {
    remotePatterns: [
      {
        protocol: "http",                  // since your server runs on http
        // hostname: process.env.NEXT_PUBLIC_API_BASE_URL_Image, // 164.52.197.192
        hostname:"10.40.54.177",
        port: "5000",   
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
 
 
 
 