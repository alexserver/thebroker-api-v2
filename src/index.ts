import { Elysia } from 'elysia'
import { tickers } from './handlers/tickers'

const port = Number(process.env.API_DEFAULT_PORT ?? 1234)
const app = new Elysia()
  .use(tickers)
  .onError(({ set, code, error }) => {
    set.status = 500
    return new Response(error.toString())
  })
  .listen(port)

console.log(`Web API running on http://localhost:${port} 🚀`)
