import { Form, Link, useActionData, useTransition } from 'remix'
import type { ActionFunction } from 'remix'
import { createUserSession, login } from '~/utils/session.server'
import { validateUser } from '~/utils/helper'

type User = {
  username: string
  password: string
}

export const meta = () => {
  return {
    title: 'Auth | Login'
  }
}

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData()
  const bodyData = Object.fromEntries(body) as User

  const validationErrors = validateUser({ ...bodyData })
  if (validationErrors) return validationErrors

  const user = await login({ ...bodyData })
  if (!user) return { msg: 'Username/Password combination is incorrect' }

  return createUserSession(user.id, '/')
}

export default function Login() {
  const errors = useActionData()

  const transition = useTransition()

  return (
    <div className='w-full max-w-xs h-80'>
      <Form method='post' className='bg-white shadow-2xl rounded-lg px-6 pt-6 pb-8 mb-4 h-full'>
        <p className='mb-3 text-center text-xl font-bold '>Log in</p>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='username'>
            Username
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors?.username ? 'border-red-500' : null
            }`}
            name='username'
            type='text'
            placeholder='Username'
          />
        </div>
        <div className='mb-6'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
            Password
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
              errors?.password ? 'border-red-500' : null
            }`}
            name='password'
            type='password'
            placeholder='**************'
          />
        </div>
        <div className='flex items-center justify-between'>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-28 shadow-md disabled:bg-blue-800'
            type='submit'
            disabled={transition.state !== 'idle'}
          >
            {transition.state !== 'idle' ? 'Login...' : 'Login'}
          </button>

          <Link
            to='/auth/register'
            className='inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800'
          >
            Create Account?
          </Link>
        </div>
        {errors && !errors?.msg ? <p className='text-red-500 my-1 text-xs'>username/password are required!</p> : null}
        {errors?.msg ? <p className='text-red-500 my-1 text-xs'>{errors.msg}</p> : null}
      </Form>
    </div>
  )
}
