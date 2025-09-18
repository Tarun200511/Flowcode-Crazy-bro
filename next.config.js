/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN,
  },
  images: {
    domains: ['api.mapbox.com'],
  },
}

module.exports = nextConfig
