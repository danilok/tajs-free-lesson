import { describe, it } from 'node:test'
import { handler } from '../../api.js'
import assert from 'node:assert'
import { EventEmitter } from 'node:events'

const mockRequest = ({ url, method, headers, body }) => {
  const options = {
    url: url ?? '/',
    method: method ?? 'GET',
    headers: headers ?? {},
  }

  const request = new EventEmitter()

  request.url = options.url
  request.method = options.method
  request.headers = options.headers

  setTimeout(() => request.emit('data', JSON.stringify(body)))

  return request
}

const mockResponse = ({ mockContext }) => {
  const response = {
    writeHead: mockContext.fn(),
    end: mockContext.fn(),
  }

  return response
}

const getFirstCallArg = (mock) => mock.calls[0].arguments[0]

describe('API Unit test Suite', () => {
  let _globalToken = ''

  describe('/login', () => {
    it('should receive not authorized when user or password is invalid', async (context) => {
      const inputRequest = mockRequest({
        url: '/login',
        method: 'POST',
        body: {
          user: '',
          password: '123'
        }
      })
      const outputResponse = mockResponse({
        mockContext: context.mock
      })

      await handler(inputRequest, outputResponse)

      // console.log(
      //   getFirstCallArg(outputResponse.writeHead.mock)
      // )

      assert.strictEqual(
        getFirstCallArg(outputResponse.writeHead.mock),
        401,
        `should receive 401 status code, received ${getFirstCallArg(outputResponse.writeHead.mock)}`
      )

      const expectedResponse = JSON.stringify({ error: 'user invalid!' })
      assert.strictEqual(outputResponse.end.mock.callCount(), 1, 'should call response.end once')
      assert.deepStrictEqual(
        getFirstCallArg(outputResponse.end.mock),
        expectedResponse,
        `should receive ${JSON.stringify(expectedResponse)}, actual: ${getFirstCallArg(outputResponse.end.mock)}`
      )
    })

    it('should login successfully given user and password', async (context) => {
      const inputRequest = mockRequest({
        url: '/login',
        method: 'POST',
        body: {
          user: 'erickwendel',
          password: '123'
        }
      })
      const outputResponse = mockResponse({
        mockContext: context.mock
      })

      await handler(inputRequest, outputResponse)

      // console.log(
      //   getFirstCallArg(outputResponse.end.mock)
      // )

      assert.strictEqual(outputResponse.end.mock.callCount(), 1, 'should call response.end once')
      assert.ok(
        JSON.parse(getFirstCallArg(outputResponse.end.mock)).token.length > 20,
        `response.body should be a valid jwt token, actual: ${getFirstCallArg(outputResponse.end.mock)}`
      )

      _globalToken = JSON.parse(getFirstCallArg(outputResponse.end.mock)).token
    })
  })

  describe('/', () => {
    it('should not be allowed to access private data without a token', async (context) => {
      const inputRequest = mockRequest({
        headers: {
          authorization: ''
        }
      })
      const outputResponse = mockResponse({
        mockContext: context.mock
      })

      await handler(inputRequest, outputResponse)

      assert.strictEqual(
        getFirstCallArg(outputResponse.writeHead.mock),
        400,
        `should receive 400 status code, received ${getFirstCallArg(outputResponse.writeHead.mock)}`
      )

      const expectedResponse = JSON.stringify({ error: 'invalid token!' })
      assert.strictEqual(outputResponse.end.mock.callCount(), 1, 'should call response.end once')
      assert.deepStrictEqual(
        getFirstCallArg(outputResponse.end.mock),
        expectedResponse,
        `should receive ${JSON.stringify(expectedResponse)}, actual: ${getFirstCallArg(outputResponse.end.mock)}`
      )
    })

    it('should be allowed to access private data with a valid token', async (context) => {
      const inputRequest = mockRequest({
        headers: {
          authorization: _globalToken
        }
      })
      const outputResponse = mockResponse({
        mockContext: context.mock
      })

      await handler(inputRequest, outputResponse)

      const expectedResponse = JSON.stringify({ result: 'Hey welcome!' })
      assert.strictEqual(outputResponse.end.mock.callCount(), 1, 'should call response.end once')
      assert.deepStrictEqual(
        getFirstCallArg(outputResponse.end.mock),
        expectedResponse,
        `should receive ${JSON.stringify(expectedResponse)}, actual: ${getFirstCallArg(outputResponse.end.mock)}`
      )
    })
  })
})