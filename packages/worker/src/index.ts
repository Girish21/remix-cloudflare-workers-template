import { getAssetFromKV } from '@cloudflare/kv-asset-handler'
import { createRequestHandler } from '@remix-run/cloudflare'
import * as build from 'remix-app'
import manifestJSON from '__STATIC_CONTENT_MANIFEST'

export { default as CounterDurableObject } from 'counter-do'

let assetManifest = JSON.parse(manifestJSON)
let handleRemixRequest = createRequestHandler(build, process.env.NODE_ENV)

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    try {
      let url = new URL(request.url)
      let ttl = url.pathname.startsWith('/build/')
        ? 60 * 60 * 24 * 365 // 1 year
        : 60 * 5 // 5 minutes
      return await getAssetFromKV(
        {
          request,
          waitUntil(promise) {
            return ctx.waitUntil(promise)
          },
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: assetManifest,
          cacheControl: {
            browserTTL: ttl,
            edgeTTL: ttl,
          },
        },
      )
    } catch (error) {}

    try {
      let loadContext: LoadContext = { env }
      return await handleRemixRequest(request, loadContext)
    } catch (error) {
      console.log(error)
      return new Response('An unexpected error occurred', { status: 500 })
    }
  },
}
