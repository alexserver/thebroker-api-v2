import { isEqual, parseISO, isAfter, isBefore } from 'date-fns'

const API_REQUEST_LIMIT = process.env.API_REQUEST_LIMIT
const FILENAME = './src/db/eod.json'
const file = Bun.file(FILENAME)

export const getTickerEod = async ({
  symbol,
  when,
}: {
  symbol?: string
  when?: string
}) => {
  try {
    const db = await file.json()
    const ticker = db.data?.find(
      (item: Record<string, any>) =>
        item?.symbol?.toLowerCase() === symbol?.toLowerCase()
    )
    if (!ticker) return null
    // else
    const record = ticker?.eod?.data?.find((item: Record<string, any>) =>
      isEqual(parseISO(item.date), when as string)
    )
    if (record) return record
    // else return null
    return null
  } catch (err) {
    throw new Error('Error fetching ticker EOD')
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
  const limit = API_REQUEST_LIMIT
  const offset = 0
  const path = new URL(FILENAME, import.meta.url)
  try {
    const db = await file.json()
    const ticker = db.data?.find(
      (item: Record<string, any>) =>
        item?.symbol?.toLowerCase() === symbols?.toLowerCase()
    )
    if (!ticker) return null
    const filtered = ticker.eod?.data.filter(
      (item: Record<string, any>) =>
        isAfter(item?.date, date_from) && isBefore(item?.date, date_to)
    )
    const data = filtered.slice(offset, Number(limit))

    const pagination = {
      limit,
      offset,
      count: data?.length,
      total: ticker?.eod?.data?.length,
    }
    return { pagination, data }
  } catch (err) {
    throw new Error('Error fetching ticker history')
  }
}
