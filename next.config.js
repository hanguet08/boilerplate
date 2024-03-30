// const withAntdLess = require('next-plugin-antd-less');
// eslint-disable-next-line @typescript-eslint/no-var-requires

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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
