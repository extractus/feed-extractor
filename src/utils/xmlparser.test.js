// xmlparser.test
/* eslint-env jest */

import { readFileSync } from 'fs'

import { validate, isRSS, isAtom, xml2obj } from './xmlparser.js'

describe('test methods from `xmlparser`', () => {
  test('test validate(well format xml)', async () => {
    const xmlData = '<xml><atag id="12">value</atag></xml>'
    const result = validate(xmlData)
    expect(result).toBe(true)
  })

  test('test validate(bad format xml)', async () => {
    const xmlData = '<xml><atag id="12">value</btag></xml>'
    const result = validate(xmlData)
    expect(result).toBe(false)
  })

  test('test validate(standard rss content)', async () => {
    const xml = readFileSync('test-data/rss-feed-standard.xml', 'utf8')
    const xmlData = xml2obj(xml)
    expect(isRSS(xmlData)).toBe(true)
    expect(isAtom(xmlData)).toBe(false)
  })

  test('test validate(standard atom content)', async () => {
    const xml = readFileSync('test-data/atom-feed-standard.xml', 'utf8')
    const xmlData = xml2obj(xml)
    expect(isAtom(xmlData)).toBe(true)
    expect(isRSS(xmlData)).toBe(false)
  })

  test('test xml2obj(well format xml)', async () => {
    const xmlData = '<xml><atag id="12">value</atag></xml>'
    const result = xml2obj(xmlData)
    expect(result).toBeInstanceOf(Object)
    expect(result.xml).toBeInstanceOf(Object)
  })
})
