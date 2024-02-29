import { Context } from 'elysia'

const API_KEY = process.env.API_KEY

export const authMiddleware = ({
  set,
  query,
}: Pick<Context, 'set' | 'query'>) => {
  const { access_key } = query
  if (access_key !== API_KEY) {
    // request is not authorized
    return (set.status = 'Unauthorized')
  }
}
