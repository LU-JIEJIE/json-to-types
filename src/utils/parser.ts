import type { ASTNode, Location, ParseContext, } from '../types'
import {
  ERROR_UNEXPECTED_KEY,
  ERROR_UNEXPECTED_VALUE,
  KEY_ARRAY_ITEM,
  KEY_ROOT,
  REGEXP_BOOLEAN,
  REGEXP_MEANINGLESS,
  REGEXP_NULL,
  REGEXP_NUMBER,
  REGEXP_STRING,
  REGEXP_UNDEFINED,
  TYPE_ARRAY,
  TYPE_BOOLEAN,
  TYPE_NULL,
  TYPE_NUMBER,
  TYPE_OBJECT,
  TYPE_ROOT,
  TYPE_STRING,
  TYPE_UNDEFINED
} from '../contants'

class ASTParser {
  line: number
  column: number
  offset: number
  source: string
  root: ASTNode | null
  constructor(json: string) {
    this.line = 1
    this.column = 1
    this.offset = 0
    this.source = json
    this.root = null
  }

  parse() {
    if (this.root)
      return this.root
    const rootChildren = this.parseObject()
    const root: ASTNode = {
      key: KEY_ROOT,
      type: TYPE_ROOT,
      value: rootChildren
    }
    this.root = root
    return root
  }

  parseAssign(keyName?: string): ASTNode {
    const contextSnapshot = {
      line: this.line,
      column: this.column,
      offset: this.offset,
      source: this.source
    }
    const key = keyName || this.parseKey()
    this.matchMeaningless()
    const { type, value } = this.parseValue()
    const location = this.generateLocation(contextSnapshot)
    return {
      key,
      type,
      value,
      loc: location
    }
  }

  parseKey(): string {
    const matchResult = /^"([^"]+)"/.exec(this.source)
    if (matchResult) {
      this.forward(matchResult[0].length)
      return matchResult[1]
    }
    else {
      throw new Error(ERROR_UNEXPECTED_KEY)
    }
  }

  parseValue() {
    if (this.source[0] === '{') {
      return {
        type: TYPE_OBJECT,
        value: this.parseObject()
      }
    }
    else if (this.source[0] === '"') {
      return {
        type: TYPE_STRING,
        value: this.parseString()
      }
    }
    else if (REGEXP_NUMBER.test(this.source)) {
      return {
        type: TYPE_NUMBER,
        value: this.parseNumber()
      }
    }
    else if (this.source[0] === '[') {
      return {
        type: TYPE_ARRAY,
        value: this.parseArray()
      }
    }
    else if (this.source.indexOf('true') === 0 || this.source.indexOf('false') === 0) {
      return {
        type: TYPE_BOOLEAN,
        value: this.parseBoolean()
      }
    }
    else if (this.source.indexOf('null') === 0) {
      return {
        type: TYPE_NULL,
        value: this.parseNull()
      }
    }
    else if (this.source.indexOf('undefined') === 0) {
      return {
        type: TYPE_UNDEFINED,
        value: this.parseUndefined()
      }
    }
    else {
      throw new Error(ERROR_UNEXPECTED_VALUE)
    }
  }

  parseObject() {
    const nodes: ASTNode[] = []
    while (this.source.length) {
      this.matchMeaningless()
      if (this.source[0] === '{') {
        this.forward()
      }
      else if (this.source[0] === '}') {
        this.forward()
        return nodes
      }
      else {
        nodes.push(this.parseAssign())
      }
    }

    return nodes
  }

  parseArray() {
    const nodes: ASTNode[] = []

    while (this.source.length) {
      this.matchMeaningless()

      if (this.source[0] === '[') {
        this.forward()
      }
      else if (this.source[0] === ']') {
        this.forward()
        return nodes
      }
      else {
        nodes.push(this.parseAssign(KEY_ARRAY_ITEM))
      }
    }
    return nodes
  }

  parseUndefined() {
    const matchResult = REGEXP_UNDEFINED.exec(this.source)
    if (matchResult) {
      this.forward(matchResult[0].length)
      return matchResult[1]
    }
    else {
      throw new Error(ERROR_UNEXPECTED_VALUE)
    }
  }

  parseNull() {
    const matchResult = REGEXP_NULL.exec(this.source)
    if (matchResult) {
      this.forward(matchResult[0].length)
      return matchResult[1]
    }
    else {
      throw new Error(ERROR_UNEXPECTED_VALUE)
    }
  }

  parseBoolean() {
    const matchResult = REGEXP_BOOLEAN.exec(this.source)
    if (matchResult) {
      this.forward(matchResult[0].length)
      return matchResult[1]
    }
    else {
      throw new Error(ERROR_UNEXPECTED_VALUE)
    }
  }

  parseNumber() {
    const matchResult = REGEXP_NUMBER.exec(this.source)!
    this.forward(matchResult[0].length)
    return matchResult[1]
  }

  parseString() {
    const matchResult = REGEXP_STRING.exec(this.source)
    if (matchResult) {
      this.forward(matchResult[0].length)
      return matchResult[1]
    }
    else {
      throw new Error(ERROR_UNEXPECTED_VALUE)
    }
  }

  forward(step = 1) {
    for (let i = 0; i < step; i++) {
      if (this.source[i] === '\n') {
        this.line++
        this.column = 1
      }
      else {
        this.column++
      }
      this.offset++
    }
    this.source = this.source.slice(step)
  }

  matchMeaningless() {
    const matchResult = REGEXP_MEANINGLESS.exec(this.source)
    if (matchResult)
      this.forward(matchResult[0].length)
  }

  generateLocation(contextSnapshot: ParseContext): Location {
    return {
      start: {
        line: contextSnapshot.line,
        column: contextSnapshot.column,
        offset: contextSnapshot.offset
      },
      end: {
        line: this.line,
        column: this.column,
        offset: this.offset
      },
      source: contextSnapshot.source.slice(0, this.offset - contextSnapshot.offset)
    }
  }
}

export function parseJson(json: string) {
  return new ASTParser(json).parse()
}
