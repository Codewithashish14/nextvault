/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // FIX: Use the new property name
  serverExternalPackages: ['bcryptjs', 'mongodb'],
}

export default nextConfig