import { Elysia } from 'elysia'
import { auth } from './auth'
import { tickers } from '../handlers/tickers'
import { eod } from '../handlers/eod'

export const publicApi = new Elysia() //
  .use(auth)
  .use(tickers)
  .use(eod)
