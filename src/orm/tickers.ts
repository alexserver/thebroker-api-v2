const API_REQUEST_LIMIT = process.env.API_REQUEST_LIMIT
const FILENAME = './src/db/tickers.json' // the path must be relative to root file (where package.json is)
const file = Bun.file(FILENAME)

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
    const db = await file.json()
    // filter by query
    const filtered = search
      ? db.data?.filter(
          (item: Record<string, any>) =>
            item.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
            item.symbol?.toLowerCase()?.includes(search?.toLowerCase()) ||
            item.stock_exchange?.country
              ?.toLowerCase()
              ?.includes(search?.toLowerCase()) ||
            item.stock_exchange?.name
              ?.toLowerCase()
              ?.includes(search?.toLowerCase()) ||
            item.stock_exchange?.acronym
              ?.toLowerCase()
              ?.includes(search?.toLowerCase())
        )
      : db.data

    const data = filtered.slice(Number(offset), Number(limit) + Number(offset))

    const pagination = {
      limit,
      offset,
      count: data?.length,
      total: db.data?.length,
    }

    return { pagination, data }
  } catch (err) {
    console.log(err)
    throw new Error('Error fetching data')
  }
}

export const getTicker = async ({
  symbol = null,
}: {
  symbol?: string | null
}) => {
  if (!symbol) return null
  try {
    const db = await file.json()
    const ticker = db.data.find(
      (item: Record<string, any>) =>
        item?.symbol?.toLowerCase() === symbol?.toLowerCase()
    )
    if (ticker) return ticker
    return null
  } catch (err) {
    throw new Error('Error fetching data')
  }
}
