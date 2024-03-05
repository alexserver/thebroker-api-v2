// Cache provider

import { createClient } from 'redis'
import { CryptoHasher } from 'bun'

let client: ReturnType<typeof createClient> | null = null

export const getClient = async () => {
  if (client !== null) return client
  client = await createClient()
    .on('error', (err) => console.log('Redis Client Error', err))
    .connect()
  return client
}

const hash = async (value: string) => {
  const hasher = new CryptoHasher('sha256')
  hasher.update(value)
  const key: string = hasher.digest('base64')
  return `url:${key}`
}

export const cacheOrAPI = async (url: string) => {
  const key = await hash(url)
  const cl = await getClient()
  // if key exists in cache, return data from there
  if (await cl.exists(key)) {
    const cacheVal = await cl.get(key)
    console.log(`Returning value for ${key} from REDIS cache`)
    return JSON.parse(cacheVal ?? '')
  }
  // else, fetch data from API and store it in cache to save future requests
  try {
    console.log(`Returning value for ${key} from MS API`)
    const response = await fetch(url)
    const data = await response.json()
    await cl.set(key, JSON.stringify(data))
    return data
  } catch (err) {
    throw new Error(`Error fetching data from API ${err}`)
  }
}
