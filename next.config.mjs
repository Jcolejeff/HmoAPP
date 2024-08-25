/** @type {import('next').NextConfig} */
const assetHost = process.env.NEXT_PUBLIC_ASSET_HOST;
const isProd = process.env.NODE_ENV === 'production';
const hostName = process.env.NEXT_PUBLIC_API_URL;
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: String(hostName.split(isProd ? 'https://' : 'http://')[1]),
        port: '',
        pathname: '/**',
      },
    ],
  },
  //output: "standalone",
  assetPrefix: isProd ? assetHost : undefined, //check if assethost exists, then return  it, else undefined
};

export default nextConfig;
