/** @type {import('next').NextConfig} */
const nextConfig = {

  devIndicators: {
    enabled: false,
  },
  
  typescript: {
    ignoreBuildErrors: true,
    
  },
  images: {
    unoptimized: true,
    
  },
}

export default nextConfig
