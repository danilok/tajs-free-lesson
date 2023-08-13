import { describe, it } from 'node:test'
import { decode, isHeadersValid, sign, verifyInvalidUser } from '../../token-helper.js'
import assert from 'node:assert'

describe('Token-Helper Unit test Suite', () => {
  describe('verifyInvalidUser', () => {
    it('should return true when user or password is invalid', () => {
      const input = {
        user: '',
        password: '123'
      }

      const res = verifyInvalidUser(input)

      const expected = true
      assert.strictEqual(
        res,
        expected,
        `should receive true, received ${res}`
      )
    })

    it('should return false when user and password is valid', () => {
      const input = {
        user: 'erickwendel',
        password: '123'
      }

      const res = verifyInvalidUser(input)

      const expected = false
      assert.strictEqual(
        res,
        expected,
        `should receive false, received ${res}`
      )
    })
  })

  describe('sign', () => {
    it('should return fields user and message after sign', () => {
      const input = {
        user: 'abc',
        message: 'test'
      }

      const token = sign(input)
      const decodedToken = decode(token)

      assert.ok(decodedToken.iat, 'should have iat property')

      delete decodedToken.iat
      assert.deepEqual(decodedToken, input, `should receive similar object, actual ${JSON.stringify(input)}`)
    })
  })

  describe('isHeadersValid', () => {
    it('should return false when auth header is empty', () => {
      const input = {
        authorization: ''
      }

      const res = isHeadersValid(input)

      const expected = false
      assert.strictEqual(res, expected, `should recevei false, actual ${res}`)
    })

    it('should return false when auth header is invalid', () => {
      const input = {
        authorization: 'bearer teste'
      }

      const res = isHeadersValid(input)

      const expected = false
      assert.strictEqual(res, expected, `should recevei false, actual ${res}`)
    })

    it('should return true when auth header is valid', () => {
      const input = {
        authorization: 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZGFuaWxvIiwibWVzc2FnZSI6ImloaHUiLCJpYXQiOjE2OTE4OTQ3NDN9.iZNwY000jIUDrFFA3pvKhk0s_hikCDQl_X4O9778HZU'
      }

      const res = isHeadersValid(input)

      const expected = true
      assert.strictEqual(res, expected, `should recevei true, actual ${res}`)
    })
  })
})