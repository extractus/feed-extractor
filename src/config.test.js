// config.test
/* eslint-env jest */

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

  const actual = getRequestOptions()
  const expectedHeader = {
    authorization: 'bearer <token>',
    'user-agent': 'Mozilla/5.0 (X11; Linux i686; rv:100.0) Gecko/20100101 Firefox/100.0'
  }

  expect(actual.headers).toEqual(expectedHeader)
  expect(actual.timeout).toEqual(20)
})
