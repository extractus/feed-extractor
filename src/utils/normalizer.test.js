// normalizer.test
/* eslint-env jest */

import { toISODateString } from './normalizer.js'

describe('test `normalizer` methods', () => {
  test('test toISODateString()', () => {
    expect(toISODateString('Thu, 28 Jul 2022 08:59:58 GMT')).toEqual('2022-07-28T08:59:58.000Z')
    expect(toISODateString('2022-07-28T02:43:00.000000000Z')).toEqual('2022-07-28T02:43:00.000Z')
    expect(toISODateString('')).toEqual('')
    expect(toISODateString('Thi, 280 Jul 2022 108:79:68 XMT')).toEqual('')
  })
})
