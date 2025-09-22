const { withMinifyClassnames } = require('nextjs-plugin-minify-css-classname');

module.exports = withMinifyClassnames({
  // reactStrictMode: true,
  images: {
    domains: ['img.dmclk.ru'],
  },
    async headers() {
      return [
          {
              source: '/pkk',
              headers: [
                  {
                      key: 'Access-Control-Allow-Origin',
                      value: '*',
                  },
              ],
          },
      ];
  },
})

