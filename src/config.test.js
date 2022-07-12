// config.test
/* eslint-env jest */

import { hasProperty } from 'bellajs'

import {
  setRequestOptions,
  getRequestOptions
} from './config.js'

test('Testing setRequestOptions/getRequestOptions methods', () => {
  setRequestOptions({
    headers: {
      authorization: 'bearer <token>'
    },
    timeout: 20,
    somethingElse: 1000
  })

  const { headers, timeout, somethingElse } = getRequestOptions()

  expect(hasProperty(headers, 'authorization')).toBeTruthy()
  expect(hasProperty(headers, 'user-agent')).toBeTruthy()
  expect(hasProperty(headers, 'accept-encoding')).toBeTruthy()
  expect(timeout).toEqual(20)
  expect(somethingElse).toEqual(1000)
})
