import { getTickerEod } from '../orm/eod'
import { getTicker, getTickers } from '../orm/tickers'
import { Elysia } from 'elysia'

export const tickers = new Elysia()
  .get('/tickers', async ({ query: { search, limit, offset } }) => {
    try {
      const data = await getTickers({ search, limit, offset })
      if (data) {
        return data
      } else {
        return {}
      }
    } catch (err) {
      throw new Error('Error fetching data')
    }
  })
  .get('/tickers/:symbol', async ({ params: { symbol } }) => {
    try {
      const data = await getTicker({ symbol })
      if (data) {
        return data
      } else {
        return {}
      }
    } catch (err) {
      throw new Error('Error fetching data')
    }
  })
  .get('/tickers/:symbol/eod/:when', async ({ params: { symbol, when } }) => {
    try {
      const data = await getTickerEod({ symbol, when })
      if (data) {
        return data
      } else {
        return {}
      }
    } catch (err) {
      throw new Error('Error fetching ticker EOD')
    }
  })
