import { Elysia } from 'elysia'
import { authMiddleware } from '../handlers/auth'
import { tickers } from '../handlers/tickers'
import { eod } from '../handlers/eod'

export const publicApi = new Elysia().guard(
  {
    beforeHandle: authMiddleware,
  },
  (app) => app.use(tickers).use(eod)
)
