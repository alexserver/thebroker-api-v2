// Cache provider

import { CryptoHasher, env } from 'bun'
import { createClient } from 'redis'
import { log } from './log'

const REDIS_URL = env.REDIS_URL
const API_KEY = env.API_KEY ?? ''

let client: ReturnType<typeof createClient> | null = null

export const getRedisClient = async () => {
  // if client is already connected, return it
  if (client !== null) return client
  // else, connect to REDIS instance
  client = await createClient({ url: REDIS_URL })
    .on('error', (err) => {
      log(
        `Error connecting to REDIS instance: ${err}, we'll fallback to Markestack API`
      )
    })
    .connect()

  return client
}

export const getDataFromRedis = async (key: string) => {
  try {
    const cl = await getRedisClient()
    // if client is not connected, return null
    if (!cl) return null
    // if key exists in cache, return data from there
    if (await cl.exists(key)) {
      const data = await cl.get(key)
      log(`Data for key ${key} exists in REDIS cache, serving it from there`)
      return JSON.parse(data ?? '')
    }
    // else, return null
    log(`Data for key ${key} does not exist in REDIS cache`)
    return null
  } catch (err) {
    log(`Error fetching data from REDIS cache: ${err}`)
    return null
  }
}

export const storeDataInRedis = async (key: string, data: any) => {
  const cl = await getRedisClient()
  if (!cl) return { success: false, message: 'Failed to connect to REDIS' }
  await cl.set(key, JSON.stringify(data))
  log(`Data stored in REDIS cache for key ${key}`)
  return { success: true, message: 'Data stored in REDIS cache' }
}

export const fetchFromAPI = async (url: string) => {
  const obfuscatedUrl = url.replace(API_KEY, '*****')
  log(`Fetching data from Markestack API: ${obfuscatedUrl}`)
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()
    return data
  } catch (err) {
    log(`Error fetching data from MarketStack API: ${err}`)
    return null
  }
}

const hash = async (value: string) => {
  const hasher = new CryptoHasher('sha256')
  hasher.update(value)
  const key: string = hasher.digest('base64')
  return `url:${key}`
}

export const cacheOrAPI = async (url: string) => {
  const key = await hash(url)
  let data = null
  // attempt to get data from REDIS instance
  data = await getDataFromRedis(key)
  if (!data) {
    // else, fetch data from API and store it in cache to save future requests
    try {
      data = await fetchFromAPI(url)
      // store data in REDIS instance
      if (!data) {
        throw new Error('Failed to fetch data from API')
      }
      await storeDataInRedis(key, data)
    } catch (err) {
      log(`Error fetching data from MarketStack API: ${err}`)
      throw new Error(`Error fetching data from MarketStack API: ${err}`)
    }
  }
  return data
}
