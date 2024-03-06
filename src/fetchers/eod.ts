import { cacheOrAPI } from '../cache'

const API_URL = process.env.API_URL ?? ''
const API_KEY = process.env.API_KEY ?? ''
const API_REQUEST_LIMIT = process.env.API_REQUEST_LIMIT ?? '10'

export const getTickerEod = async ({
  symbol,
  when,
}: {
  symbol?: string
  when?: string
}) => {
  const url = `${API_URL}/tickers/${symbol}/eod/${when}?access_key=${API_KEY}`
  try {
    const data = await cacheOrAPI(url)
    return data && 'open' in data && 'low' in data && 'close' in data
      ? data
      : null
  } catch (err) {
    throw new Error(`Error fetching from original API\n${err}`)
  }
}

export const getEodHistory = async ({
  symbols,
  date_from,
  date_to,
}: {
  symbols?: string
  date_from?: string
  date_to?: string
}) => {
  const url = `${API_URL}/eod?access_key=${API_KEY}&symbols=${symbols}&date_from=${date_from}&date_to=${date_to}`
  try {
    const data = await cacheOrAPI(url)
    return 'pagination' in data && 'data' in data ? data : null
  } catch (err) {
    throw new Error(`Error fetching from original API\n${err}`)
  }
}
