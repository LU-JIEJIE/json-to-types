import type { GeneratorOptions } from './types'
import { generateTypes, parseJson } from './utils'

export function jsonToTypes(json: string, options?: GeneratorOptions) {
  const ast = parseJson(json)
  const typesStr = generateTypes(ast, options)
  return typesStr
}
