import { LoaderFunction, Outlet, redirect } from 'remix'
import { storage } from '~/utils/session.server'

export const loader: LoaderFunction = async ({ request }) => {
  const session = await storage.getSession(request.headers.get('Cookie'))
  if (session.has('userID')) return redirect('/')
  return null
}

const Auth = () => {
  return (
    <>
      <Outlet />
    </>
  )
}

export default Auth
