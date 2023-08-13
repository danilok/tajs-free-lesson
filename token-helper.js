import JWT from 'jsonwebtoken'

const DEFAULT_USER = {
  user: 'erickwendel',
  password: '123'
}
const JWT_KEY = 'abc123'

function verifyInvalidUser({ user, password }) {
  return user !== DEFAULT_USER.user || password !== DEFAULT_USER.password
    ? true
    : false
}

function sign({ user, message }) {
  const token = JWT.sign({ user, message }, JWT_KEY)
  return token
}

function decode(token) {
  const decodedToken = JWT.decode(token)
  return decodedToken
}

function isHeadersValid(headers) {
  try {
    const auth = headers.authorization.replace(/bearer\s/ig, '')
    JWT.verify(auth, JWT_KEY)

    return true
  } catch (error) {
    return false
  }
}

export {
  verifyInvalidUser,
  sign,
  decode,
  isHeadersValid
}
