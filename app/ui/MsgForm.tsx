import { useEffect, useRef } from 'react'
import { Form, useTransition } from 'remix'

const MsgForm = ({ formErrors }: { formErrors: { error: boolean } }) => {
  const formRef = useRef<HTMLFormElement>(null)

  const transition = useTransition()

  useEffect(() => {
    if (formRef.current) formRef.current.reset()
  }, [transition.submission])

  return (
    <Form method='post' className='p-4 flex items-center w-full' ref={formRef}>
      <input
        type='text'
        name='msg'
        autoComplete='off'
        className={`flex-1 h-11 rounded-lg px-2 ${formErrors?.error ? 'border border-red-500' : null}`}
        placeholder='write your msg here'
      />
      <button type='submit' className='bg-blue-700 w-32 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded ml-4'>
        Send
      </button>
    </Form>
  )
}

export default MsgForm
