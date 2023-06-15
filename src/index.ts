import { parseJson } from './utils'

export function jsonToTypes(json: string) {
  const ast = parseJson(json)
  return ast
}
