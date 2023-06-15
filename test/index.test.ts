import { describe, test } from 'vitest'
import { jsonToTypes } from '../src'

const json = `{
  "cmd": "GUARD_HONOR_THOUSAND",
  "data": {
    "add": null,
    "del": [
      672346917,"672",{
        "a":1
      }
    ]
  }
}`

describe('should', () => {
  test('only', () => {
    const ast = jsonToTypes(json)
    console.log(JSON.stringify(ast))
  })
})
