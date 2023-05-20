import { cookies } from 'next/headers'
import decode from 'jwt-decode'

type UserProps = {
  sub: string
  name: string
  avatarUrl: string
}

// O ponto de interrogação significa que o cookie pode ser undefined
export function getUser(): UserProps {
  const token = cookies().get('token')?.value

  if (!token) {
    throw new Error('Unauthenticated.')
  }

  const user: UserProps = decode(token)

  return user
}
