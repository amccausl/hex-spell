const purgecss = require('@fullhuman/postcss-purgecss')({
  content: [
    './docs/**/*.html',
    './src/*.svelte'
  ],

  whitelistPatterns: [ /svelte-/, /board/, /hex/ ],

  defaultExtractor: content => content.match( /[A-Za-z0-9-_:/]+/g ) || []
});

const production = ! process.env.ROLLUP_WATCH

module.exports = {
  plugins: [
    require('tailwindcss'),
    ...( true || production ? [ purgecss ] : [] )
  ]
};
