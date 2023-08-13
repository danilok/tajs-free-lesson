import { describe, it } from 'node:test'
import { rootRoute } from '../../routes/root.js'
import assert from 'node:assert'
import { EventEmitter } from 'node:events'

const mockRequest = ({ headers }) => {
  const options = {
    headers: headers ?? {},
  }

  const request = new EventEmitter()

  request.headers = options.headers

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

describe('Root Route Unit test Suite', () => {
  describe('rootRoute', () => {
    it('should not be allowed to access private data without authorization header', async (context) => {
      const inputRequest = mockRequest({})
      const outputResponse = mockResponse({
        mockContext: context.mock
      })

      await rootRoute(inputRequest, outputResponse)

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

    it('should not be allowed to access private data without a token', async (context) => {
      const inputRequest = mockRequest({
        headers: {
          authorization: ''
        }
      })
      const outputResponse = mockResponse({
        mockContext: context.mock
      })

      await rootRoute(inputRequest, outputResponse)

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
          authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZGFuaWxvIiwibWVzc2FnZSI6ImloaHUiLCJpYXQiOjE2OTE4OTQ3NDN9.iZNwY000jIUDrFFA3pvKhk0s_hikCDQl_X4O9778HZU'
        }
      })
      const outputResponse = mockResponse({
        mockContext: context.mock
      })

      await rootRoute(inputRequest, outputResponse)

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