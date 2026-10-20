// const withAntdLess = require('next-plugin-antd-less');
// eslint-disable-next-line @typescript-eslint/no-var-requires

// Build timestamp (YYYY-MM-DD HH:mm:ss), set here so the build script works on Windows too
const pad = (n) => String(n).padStart(2, '0');
const now = new Date();
const buildTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(
  now.getMinutes(),
)}:${pad(now.getSeconds())}`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    APP_VERSION: process.env.APP_VERSION || buildTime,
  },
  swcMinify: false,
  poweredByHeader: false,
  productionBrowserSourceMaps: true,
  compiler: {
    styledComponents: true,
  },
};

module.exports = {
  ...nextConfig,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};
