const { resolve } = require('path');
const { defineConfig } = require('vite');

module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        '00-modeling': resolve(__dirname, '/00-modeling/index.html'),
        '01-states-transitions': resolve(
          __dirname,
          '/01-states-transitions/index.html'
        ),
        '02-actions': resolve(__dirname, '/02-actions/index.html'),
        '03-context': resolve(__dirname, '/03-context/index.html'),
        '04-guards': resolve(__dirname, '/04-guards/index.html'),
        '05-compound-states': resolve(
          __dirname,
          '/05-compound-states/index.html'
        ),
        '06-parallel-states': resolve(
          __dirname,
          '/06-parallel-states/index.html'
        ),
        '07-final-states': resolve(__dirname, '/07-final-states/index.html'),
        '08-history-states': resolve(
          __dirname,
          '/08-history-states/index.html'
        ),
        '09-actors': resolve(__dirname, '/09-actors/index.html'),

        '10-testing': resolve(__dirname, '/10-testing/index.html'),
      },
    },
  },
});
