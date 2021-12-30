import { createCookieSessionStorage, redirect } from 'remix'
import bcrypt from 'bcrypt'
import { db } from './db.server'

type LoginForm = {
  username: string
  password: string
}

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set!')
}

export const storage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    secure: true,
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true
  }
})

export const createUserSession = async (userID: string, redirectTO: string) => {
  const session = await storage.getSession()
  session.set('userID', userID)
  return redirect(redirectTO, {
    headers: {
      'Set-Cookie': await storage.commitSession(session)
    }
  })
}

export async function login({ username, password }: LoginForm) {
  const user = await db.user.findUnique({
    where: { username }
  })
  if (!user) return null

  const isCorrectPassword = await bcrypt.compare(password, user.password)
  if (!isCorrectPassword) return null

  return user
}

export async function register({ username, password }: LoginForm) {
  const hashedPassword = await bcrypt.hash(password, 10)

  return await db.user.create({
    data: {
      username,
      password: hashedPassword
    }
  })
}

export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get('Cookie'))

  return redirect('/auth/login', {
    headers: {
      'Set-Cookie': await storage.destroySession(session)
    }
  })
}

export async function getUser(request: Request) {
  const session = await storage.getSession(request.headers.get('Cookie'))
  const userID = session.get('userID')
  if (!userID || typeof userID !== 'string') throw redirect(`/auth/login`)

  const user = await db.user.findUnique({
    where: { id: userID },
    select: {
      id: true,
      username: true
    }
  })

  if (!user) throw await logout(request)
  return user
}

export const getMsgs = async () => {
  return db.msg.findMany({
    select: {
      id: true,
      body: true,
      userID: true,
      user: {
        select: {
          username: true
        }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  })
}
