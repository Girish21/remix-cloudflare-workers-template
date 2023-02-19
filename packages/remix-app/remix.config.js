/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  serverDependenciesToBundle: 'all',
  serverMainFields: ['browser', 'module', 'main'],
  serverMinify: true,
  serverModuleFormat: 'esm',
  serverPlatform: 'neutral',
  devServerBroadcastDelay: 1000,
  ignoredRouteFiles: ['**/.*'],
  future: { unstable_dev: true },
}
