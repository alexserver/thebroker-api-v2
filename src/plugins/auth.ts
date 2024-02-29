import { Elysia } from 'elysia'

const API_KEY = process.env.API_KEY

export const auth = new Elysia() //
  .onRequest(({ set, request: { headers } }) => {
    const access_key = headers.get('access-key') ?? ''
    if (access_key !== API_KEY) {
      return (set.status = 401) // Unauthorized
    }
  })
