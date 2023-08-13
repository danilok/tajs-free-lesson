import { createServer } from 'node:http'
import { loginRoute } from './routes/login.js'
import { rootRoute } from './routes/root.js'

async function handler(request, response) {
  if (request.url === '/login' && request.method === 'POST') {
    return loginRoute(request, response)
  }
  return rootRoute(request, response)
}

const app = createServer(handler)

export {
  app,
  handler
}
