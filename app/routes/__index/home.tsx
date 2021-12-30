import { useEffect, useRef, useState } from 'react'
import { ActionFunction, LoaderFunction, MetaFunction, useActionData, useLoaderData, useTransition } from 'remix'

import { Msg, User } from '@prisma/client'

import { getMsgs, getUser } from '~/utils/session.server'
import { db } from '~/utils/db.server'
import MsgForm from '~/ui/MsgForm'

type MsgWithUser = Msg & {
  user: {
    username: string
  }
}

export const meta: MetaFunction = () => {
  return {
    title: 'Home'
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  const msgs = await getMsgs()

  return { msgs, user }
}

export const action: ActionFunction = async ({ request }) => {
  const user = (await getUser(request)) as User

  const formData = await request.formData()
  const msg = formData.get('msg') as string

  if (!msg || msg.trim() === '') return { error: true }

  await db.msg.create({
    data: {
      body: msg,
      userID: user.id
    }
  })

  return null
}

const Home = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [sentMsgs, setSentMsgs] = useState<string[]>([])

  const transition = useTransition()

  const { msgs, user } = useLoaderData() as { msgs: MsgWithUser[]; user: User }
  const formErrors = useActionData()

  useEffect(() => {
    if (transition.submission) {
      const newMsg = Object.fromEntries(transition.submission?.formData).msg.toString().trim()
      if (newMsg) setSentMsgs([...sentMsgs, Object.fromEntries(transition.submission?.formData).msg.toString()])
    } else setSentMsgs([])
  }, [transition.submission])

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight
  }, [msgs, sentMsgs])

  return (
    <div className='w-full h-full md:w-3/4 lg:w-2/4 md:h-3/4 flex flex-col items-center content-center bg-slate-200 rounded-xl shadow-xl'>
      <div ref={ref} className='flex-1 w-full p-4 overflow-y-auto overflow-x-hidden'>
        {msgs.map((msg) =>
          msg?.userID === user.id ? (
            <div key={msg.id} className='flex items-center ml-auto w-fit'>
              <div className='m-4 bg-blue-600 shadow-lg rounded-2xl p-4 w-fit text-white break-all'>{msg.body}</div>
              <p className='text-sm font-bold text-gray-700'>{user.username}</p>
            </div>
          ) : (
            <div key={msg.id} className='flex items-center mr-auto w-fit'>
              <p className='text-sm font-bold text-gray-700'>{msg.user.username}</p>
              <div className='m-4 bg-white shadow-lg rounded-2xl p-8 w-fit text-blue-500'>{msg.body}</div>
            </div>
          )
        )}
        {transition.submission
          ? sentMsgs.map((s) => (
              <div className='flex items-center ml-auto w-fit'>
                <div className='m-4 bg-blue-300 shadow-lg rounded-2xl p-4 w-fit text-white break-all'>{s}</div>
                <p className='text-sm font-bold text-gray-700'>{user.username}</p>
              </div>
            ))
          : null}
      </div>

      <MsgForm formErrors={formErrors} />
    </div>
  )
}

export default Home
