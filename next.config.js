/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
        {
            protocol: 'http',
            hostname: 'openweathermap.org',
            port: '',
            pathname: '/**',
        }
        ],
  },
}

module.exports = nextConfig
