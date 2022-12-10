/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/cloudflare/globals" />

interface LoadContext {
  env: Env
}

declare var process: {
  env: { NODE_ENV: 'development' | 'production' }
}

declare module '@remix-run/cloudflare' {
  import type { DataFunctionArgs as RemixDataFunctionArgs } from '@remix-run/cloudflare/dist/index'
  export * from '@remix-run/cloudflare/dist/index'

  export interface DataFunctionArgs
    extends Omit<RemixDataFunctionArgs, 'context'> {
    context: LoadContext
  }
}
