import { Elysia } from 'elysia'
import { authMiddleware } from './handlers/auth'
import { tickerAll } from './handlers/tickers'

const port = Number(process.env.API_DEFAULT_PORT ?? 1234)
const app = new Elysia()
  .guard(
    {
      beforeHandle: authMiddleware,
    },
    (app) => app.get('/tickers', tickerAll)
    // .get('/tickers/:symbol', tickerOne)
    // .get('/tickers/:symbol/eod/:when', eodOne)
    // .get('/eod', eodAll)
  )
  .onError(({ set, code, error }) => {
    set.status = 500
    return new Response(error.toString())
  })
  .listen(port)

console.log(`Web API running on http://localhost:${port} 🚀`)
