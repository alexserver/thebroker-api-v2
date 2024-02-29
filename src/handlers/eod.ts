import { Context } from 'elysia'
import { getEodHistory, getTickerEod } from '../orm/eod'

export const eodOne = async ({ params }: Context) => {
  const { symbol, when } = params
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
}

export const eodAll = async ({ query }: Context) => {
  const { symbols, date_from, date_to } = query
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
}
