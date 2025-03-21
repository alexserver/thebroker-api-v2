import { Elysia } from 'elysia'
import { getTickerEod } from '../fetchers/eod'
import { getTicker, getTickers } from '../fetchers/tickers'

export const tickers = new Elysia() //
  .get('/tickers', async ({ query: { search, limit, offset } }) => {
    try {
      console.log(
        `==========\nGET /tickers?search=${search}&limit=${limit}&offset=${offset}`
      )
      const data = await getTickers({ search, limit, offset })
      if (data) {
        return data
      } else {
        return {}
      }
    } catch (err) {
      console.error(`Error fetching data\n${err}`)
      throw new Error('Error fetching data for /tickers')
    }
  })
  .get('/tickers/:symbol', async ({ params: { symbol } }) => {
    try {
      console.log(`==========\nGET /tickers/${symbol}`)
      const data = await getTicker({ symbol })
      if (data) {
        return data
      } else {
        return {}
      }
    } catch (err) {
      console.error(`Error fetching data for /tickers/:symbol\n${err}`)
      throw new Error('Error fetching data for /tickers/:symbol')
    }
  })
  .get('/tickers/:symbol/eod/:when', async ({ params: { symbol, when } }) => {
    try {
      console.log(`==========\nGET /tickers/${symbol}/eod/${when}`)
      const data = await getTickerEod({ symbol, when })
      if (data) {
        return data
      } else {
        return {}
      }
    } catch (err) {
      console.error(
        `Error fetching data for /tickers/:symbol/eod/:when\n${err}`
      )
      throw new Error('Error fetching data for /tickers/:symbol/eod/:when')
    }
  })
