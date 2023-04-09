/// <reference types="@cloudflare/workers-types" />

interface Env {
  __STATIC_CONTENT: KVNamespace

  COUNTER: DurableObjectNamespace

  ENVIRONMENT: string
  SESSION_SECRET: string
}
