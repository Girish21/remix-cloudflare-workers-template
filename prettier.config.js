module.exports = {
  semi: false,
  singleQuote: true,
  jsxSingleQuote: true,
  arrowParens: 'avoid',
  trailingComma: 'all',
  plugins: [require('prettier-plugin-tailwindcss')],
  tailwindConfig: './packages/remix-app/tailwind.config.js',
}
