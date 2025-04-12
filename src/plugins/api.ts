import { Elysia } from 'elysia'
import { cacheOrAPI } from '../lib/cache'
import { log } from '../lib/log'
import { auth } from './auth'

const API_URL = process.env.API_URL ?? ''
const API_VERSION = process.env.API_VERSION ?? 'v1'
const API_KEY = process.env.API_KEY ?? ''

export const api = new Elysia() //
  .use(auth)
  .get('/*', async ({ path, query, error }) => {
    // rebuild the url from path and query
    const url = new URL(`/${API_VERSION}${path}`, API_URL)
    url.search = new URLSearchParams(query as Record<string, string>).toString()
    // log the url
    log(`GET ${url.toString().replace(API_KEY, '*****')}`)
    // fetch the data from the cache or API
    try {
      const data = await cacheOrAPI(url.toString())
      return data ? data : null
    } catch (err) {
      log(`Error fetching data from API\n${err}`)
      return error(500, 'Error fetching data from API')
    }
  })
