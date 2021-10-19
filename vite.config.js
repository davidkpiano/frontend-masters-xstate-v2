const { resolve } = require('path');
const { defineConfig } = require('vite');

module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        '00': resolve(__dirname, '/00-modeling/index.html'),
        '10-testing': resolve(__dirname, '/10-testing/index.html'),
      },
    },
  },
});
