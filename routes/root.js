import { isHeadersValid } from '../token-helper.js'

async function rootRoute(request, response) {
  if (!isHeadersValid(request.headers)) {
    response.writeHead(400)
    return response.end(JSON.stringify({ error: 'invalid token!' }))
  }
  response.end(JSON.stringify({ result: 'Hey welcome!' }))
}

export {
  rootRoute
}
