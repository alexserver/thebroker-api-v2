import { Elysia } from 'elysia'
import { getEodHistory, getTickerEod } from '../orm/eod'

export const eod = new Elysia() //
  .get('/eod', async ({ query: { symbols, date_from, date_to } }) => {
    try {
      const data = await getEodHistory({ symbols, date_from, date_to })
      if (data) {
        return data
      } else {
        return {}
      }
    } catch (err) {
      throw new Error('Error fetching EOD history')
    }
  })
