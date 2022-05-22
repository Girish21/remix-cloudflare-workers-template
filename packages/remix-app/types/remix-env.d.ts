/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/cloudflare/globals" />

interface LoadContext {
  env: Env
}

declare var process: {
  env: { NODE_ENV: 'development' | 'production' }
}

declare module '@remix-run/cloudflare' {
  import type { DataFunctionArgs as RemixDataFunctionArgs } from '@remix-run/cloudflare'
  export * from '@remix-run/cloudflare/index'

  interface DataFunctionArgs extends Omit<RemixDataFunctionArgs, 'context'> {
    context: LoadContext
  }

  export interface ActionFunction {
    (args: DataFunctionArgs): null | Response | Promise<Response>
  }

  export interface LoaderFunction {
    (args: DataFunctionArgs): null | Response | Promise<Response>
  }
}
