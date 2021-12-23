// purifyUrl.test
/* eslint-env jest */

const purifyUrl = require('./purifyUrl')

test('test purifyUrl() with invalid url', () => {
  const urls = [
    null,
    '',
    123,
    {}
  ]
  urls.forEach((url) => {
    const result = purifyUrl(url)
    expect(result).toEqual(null)
  })
})

test('test purifyUrl() removing regular marketing params', () => {
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
    const result = purifyUrl(url)
    expect(result).toEqual(expected)
  })
})
