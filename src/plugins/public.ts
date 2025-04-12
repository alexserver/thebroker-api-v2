import { Elysia } from 'elysia'
import { eod } from '../handlers/eod'
import { tickers } from '../handlers/tickers'
import { auth } from './auth'

export const publicApi = new Elysia() //
  .use(auth)
  .use(tickers)
  .use(eod)
