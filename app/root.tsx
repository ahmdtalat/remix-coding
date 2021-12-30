import { Link, Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useCatch } from 'remix'
import Layout from './ui/Layout'

import styles from './tailwind.css'

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}
export default function App() {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <Meta />
        <Links />
        <title>Auth</title>
      </head>
      <body>
        <Layout>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          {process.env.NODE_ENV === 'development' ? <LiveReload /> : null}
        </Layout>
      </body>
    </html>
  )
}

export function CatchBoundary() {
  const caught = useCatch()
  return (
    <html>
      <head>
        <title>Not Found</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Layout>
          <p className='text-3xl text-white font-bold'>
            {caught.status} {caught.statusText}
          </p>
          <Link to='/'>
            <button className='bg-white hover:bg-slate-100 text-blue-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-28 shadow-md disabled:bg-blue-800'>
              Home
            </button>
          </Link>
        </Layout>
        <Scripts />
      </body>
    </html>
  )
}
