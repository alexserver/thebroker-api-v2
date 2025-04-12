import { Elysia } from 'elysia'
import { api } from './plugins/api'

const port = Number(process.env.API_DEFAULT_PORT ?? 1234)
new Elysia()
  .use(api)
  .onError(({ set, code, error }) => {
    set.status = 500
    return new Response(error.toString())
  })
  .listen(port)

console.log(`Web API running on http://localhost:${port} 🚀`)
