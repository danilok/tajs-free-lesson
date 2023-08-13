import { once } from 'node:events'
import { verifyInvalidUser, sign } from '../token-helper.js'

async function loginRoute(request, response) {
  const { user, password } = JSON.parse(await once(request, 'data'))
  if (verifyInvalidUser({ user, password })) {
    response.writeHead(401)
    response.end(JSON.stringify({ error: 'user invalid!' }))
    return
  }
  const token = sign({ user, message: 'hey duuude!' })

  response.end(JSON.stringify({ token }))
}

export {
  loginRoute
}
