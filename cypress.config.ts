import { defineConfig } from 'cypress';

export default defineConfig({
  chromeWebSecurity: false,

  env: {
    appUrl: 'http://localhost:3000',
    username: 'longvd8',
    password: 'Longvu@2046',
  },

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
