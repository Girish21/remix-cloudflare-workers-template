import { json } from '@remix-run/cloudflare'
import type { LoaderFunction, MetaFunction } from '@remix-run/cloudflare'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
})

export const loader: LoaderFunction = async ({ context }) => {
  let id = context.env.COUNTER.idFromName('root')
  let object = context.env.COUNTER.get(id)
  let doResponse = await object.fetch('https://../increment')
  let count = Number(await doResponse.text())

  return json<LoaderData>({ count })
}

export default function App() {
  const loaderData = useLoaderData<LoaderData>()

  return (
    <html lang='en'>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <p>Invocatoins: {loaderData.count}</p>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

type LoaderData = {
  count: number
}
