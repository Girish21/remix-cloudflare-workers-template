/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  ignoredRouteFiles: ['**/.*'],
  serverModuleFormat: 'esm',
  serverDependenciesToBundle: ['@remix-run/react'],
  future: {
    unstable_dev: {
      appServerPort: 3000,
      rebuildPollIntervalMs: 500,
    },
  },
}
