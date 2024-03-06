import { Elysia } from 'elysia'

const API_KEY = process.env.API_KEY

const getParamFromURL = (url: string, param: string) => {
  const { searchParams } = new URL(url)
  return searchParams.get(param) ?? ''
}

export const auth = new Elysia() //
  .onRequest(({ set, request: { url } }) => {
    const access_key = getParamFromURL(url, 'access_key')
    if (access_key !== API_KEY) {
      return (set.status = 401) // Unauthorized
    }
  })
