import { LoaderFunction, Outlet, useLoaderData } from 'remix'
import { getUser } from '~/utils/session.server'

export const loader: LoaderFunction = async ({ request }) => getUser(request)

export default function Index() {
  const user = useLoaderData()
  return (
    <>
      {!user ? null : (
        <nav className='flex w-screen absolute top-0 items-center h-14 bg-slate-400 shadow-lg'>
          <form method='post' action='/auth/logout' className='flex items-center ml-auto mr-2'>
            <p className='mx-2 font-bold'>{user.username}</p>
            <button className='bg-blue-700 w-32  hover:bg-blue-500 text-white font-bold py-2 px-4 rounded'>
              Logout
            </button>
          </form>
        </nav>
      )}
      <Outlet />
    </>
  )
}
