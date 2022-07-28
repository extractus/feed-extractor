// config.test
/* eslint-env jest */

import { hasProperty } from 'bellajs'

import {
  setRequestOptions,
  getRequestOptions,
  setReaderOptions,
  getReaderOptions
} from './config.js'

const defaultRequestOptions = getRequestOptions()
const defaultReaderOptions = getReaderOptions()

afterAll(() => {
  return setReaderOptions(defaultReaderOptions) && setRequestOptions(defaultRequestOptions)
})

describe('check methods from `config`', () => {
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
  test('Testing setReaderOptions/getReaderOptions methods', () => {
    setReaderOptions({
      descriptionMaxLen: 250,
      includeFullContent: true
    })

    const { descriptionMaxLen, includeFullContent } = getReaderOptions()

    expect(descriptionMaxLen).toEqual(250)
    expect(includeFullContent).toEqual(true)
  })
})
