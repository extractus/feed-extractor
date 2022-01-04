// validator.test
/* eslint-env jest */

import { readFileSync } from 'fs'

import xml2obj from './xml2obj.js'

import { validate, isRSS, isAtom } from './validator.js'

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

test('test validate(rss data)', async () => {
  const xml = readFileSync('test-data/rss.xml', 'utf8')
  const xmlData = xml2obj(xml)
  expect(isRSS(xmlData)).toBe(true)
  expect(isAtom(xmlData)).toBe(false)
})

test('test validate(atom data)', async () => {
  const xml = readFileSync('test-data/atom.xml', 'utf8')
  const xmlData = xml2obj(xml)
  expect(isAtom(xmlData)).toBe(true)
  expect(isRSS(xmlData)).toBe(false)
})
