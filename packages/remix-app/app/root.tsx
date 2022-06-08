import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import styles from '~/styles/app.css'

export let meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
  'color-scheme': 'dark light',
})

export let links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

export let loader: LoaderFunction = async ({ context }) => {
  let id = context.env.COUNTER.idFromName('root')
  let object = context.env.COUNTER.get(id)
  let doResponse = await object.fetch('https://../increment')
  let count = Number(await doResponse.text())

  return json<LoaderData>({ count })
}

export default function App() {
  let loaderData = useLoaderData<LoaderData>()

  return (
    <html lang='en'>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <p className='text-xl'>Invocatoins: {loaderData.count}</p>
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
