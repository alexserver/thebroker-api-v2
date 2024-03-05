import { cacheOrAPI } from '../cache'

const API_URL = process.env.API_URL ?? ''
const API_KEY = process.env.API_KEY ?? ''
const API_REQUEST_LIMIT = process.env.API_REQUEST_LIMIT ?? '10'

export const getTickers = async ({
  search,
  limit = API_REQUEST_LIMIT,
  offset = 0,
}: {
  search?: string
  limit?: string
  offset?: number | string
}) => {
  try {
    let url: string = `${API_URL}/tickers?access_key=${API_KEY}&limit=${limit}&offset=${offset}`
    if (search && search !== '') {
      url += `&search=${search}`
    }
    const data = await cacheOrAPI(url)
    return 'pagination' in data && 'data' in data ? data : null
  } catch (err) {
    throw new Error(`Error fetching from original API\n${err}`)
  }
}

export const getTicker = async () => {
  return null
}
