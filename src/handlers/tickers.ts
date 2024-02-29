import { getTickers } from '../orm/tickers'
import { Context } from 'elysia'

export const tickerAll = async ({ query }: Context) => {
  const { search, limit, offset } = query
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
}

// export const tickerOne = async (req, res) => {
//   const { symbol } = req.params;
//   try {
//     const data = await getTicker({ symbol });
//     if (data) {
//       res.send(data);
//     } else {
//       res.send({});
//     }
//   } catch (err) {
//     throw new Error(err);
//   }
// };
