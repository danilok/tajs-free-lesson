import { describe, it } from 'node:test'
import { loginRoute } from '../../routes/login.js'
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

describe('Login Route Unit test Suite', () => {
  describe('loginRoute', () => {
    it('should receive not authorized when user is invalid', async (context) => {
      const inputRequest = mockRequest({
        body: {
          user: '1213',
          password: '123'
        }
      })
      const outputResponse = mockResponse({
        mockContext: context.mock
      })

      await loginRoute(inputRequest, outputResponse)

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

    it('should receive not authorized when password is invalid', async (context) => {
      const inputRequest = mockRequest({
        body: {
          user: 'erickwendel',
          password: '12'
        }
      })
      const outputResponse = mockResponse({
        mockContext: context.mock
      })

      await loginRoute(inputRequest, outputResponse)

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
        body: {
          user: 'erickwendel',
          password: '123'
        }
      })
      const outputResponse = mockResponse({
        mockContext: context.mock
      })

      await loginRoute(inputRequest, outputResponse)

      assert.strictEqual(outputResponse.end.mock.callCount(), 1, 'should call response.end once')
      assert.ok(
        JSON.parse(getFirstCallArg(outputResponse.end.mock)).token.length > 20,
        `response.body should be a valid jwt token, actual: ${getFirstCallArg(outputResponse.end.mock)}`
      )
    })
  })
})