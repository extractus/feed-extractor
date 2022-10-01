// linker.test
/* eslint-env jest */

import { isValid, absolutify, purify } from './linker.js'

describe('test exported methods from `linker`', () => {
  const cases = [
    {
      url: 'https://www.23hq.com',
      expected: true
    },
    {
      url: 'https://secure.actblue.com',
      expected: true
    },
    {
      url: 'https://docs.microsoft.com/en-us/azure/iot-edge/quickstart?view=iotedge-2018-06',
      expected: true
    },
    {
      url: 'http://192.168.1.199:8081/example/page',
      expected: true
    },
    {
      url: 'ftp://192.168.1.199:8081/example/page',
      expected: false
    },
    {
      url: '',
      expected: false
    },
    {
      url: null,
      expected: false
    },
    {
      url: { a: 'x' },
      expected: false
    }
  ]
  cases.forEach(({ url, expected }) => {
    test(`isValid("${url}") must return "${expected}"`, () => {
      const result = isValid(url)
      expect(result).toEqual(expected)
    })
  })

  const entries = [
    {
      full: '',
      expected: ''
    },
    {
      relative: {},
      expected: ''
    },
    {
      full: 'https://some.where/article/abc-xyz',
      relative: 'category/page.html',
      expected: 'https://some.where/article/category/page.html'
    },
    {
      full: 'https://some.where/article/abc-xyz',
      relative: '../category/page.html',
      expected: 'https://some.where/category/page.html'
    },
    {
      full: 'https://some.where/blog/authors/article/abc-xyz',
      relative: '/category/page.html',
      expected: 'https://some.where/category/page.html'
    },
    {
      full: 'https://some.where/article/abc-xyz',
      expected: 'https://some.where/article/abc-xyz'
    }
  ]
  entries.forEach((entry) => {
    const {
      full,
      relative,
      expected
    } = entry
    test(`absolutify("${full}", "${relative}") must become "${expected}"`, () => {
      const result = absolutify(full, relative)
      expect(result).toEqual(expected)
    })
  })

  test('test url purify() with invalid url', () => {
    const urls = [
      null,
      '',
      123,
      {}
    ]
    urls.forEach((url) => {
      const result = purify(url)
      expect(result).toEqual(null)
    })
  })

  test('test url purify() removing regular marketing params', () => {
    const entries = [
      {
        url: 'https://some.where/article/abc-xyz',
        expected: 'https://some.where/article/abc-xyz'
      },
      {
        url: 'https://some.where/article/abc-xyz#name,bob',
        expected: 'https://some.where/article/abc-xyz'
      },
      {
        url: 'https://some.where/article/abc-xyz?utm_source=news4&utm_medium=email&utm_campaign=spring-summer',
        expected: 'https://some.where/article/abc-xyz'
      },
      {
        url: 'https://some.where/article/abc-xyz?q=3&utm_source=news4&utm_medium=email&utm_campaign=spring-summer',
        expected: 'https://some.where/article/abc-xyz?q=3'
      },
      {
        url: 'https://some.where/article/abc-xyz?pk_source=news4&pk_medium=email&pk_campaign=spring-summer',
        expected: 'https://some.where/article/abc-xyz'
      },
      {
        url: 'https://some.where/article/abc-xyz?q=3&pk_source=news4&pk_medium=email&pk_campaign=spring-summer',
        expected: 'https://some.where/article/abc-xyz?q=3'
      }
    ]
    entries.forEach((entry) => {
      const {
        url,
        expected
      } = entry
      const result = purify(url)
      expect(result).toEqual(expected)
    })
  })
})
