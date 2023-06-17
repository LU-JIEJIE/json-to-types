import { TYPE_ARRAY, TYPE_OBJECT } from '../contants'
import type { ASTNode, GeneratorOptions, KeyTypeObject } from '../types'
import { upperFirstChar } from './utils'

class TypesGenerator {
  ast: ASTNode
  types: Map<string, KeyTypeObject>
  options: GeneratorOptions
  isInterface: boolean
  constructor(ast: ASTNode, options?: GeneratorOptions) {
    this.ast = ast
    this.types = new Map()
    this.options = {
      indents: 2,
      objectKeyword: 'interface',
      expendArray: true,
      typesPrefix: '',
      typesSuffix: '',
      ...options
    }
    this.isInterface = this.options.objectKeyword === 'interface'
  }

  generate() {
    this.transform(this.ast)
    return this.generateTypesString()
  }

  transform(node: ASTNode): string {
    if (node.type === TYPE_OBJECT) {
      // 循环直至不重名
      const baseName = `${upperFirstChar(this.options.typesPrefix || '')}${upperFirstChar(node.key)}${upperFirstChar(this.options.typesSuffix || '')}`
      let curIndex = 0
      while (this.types.has(`${baseName}${curIndex || ''}`))
        curIndex++
      const typesName = `${baseName}${curIndex || ''}`
      this.types.set(typesName, {})

      const keyTypes: KeyTypeObject = {}
      for (const child of node.value as ASTNode[])
        keyTypes[child.key] = this.transform(child)

      this.types.set(typesName, keyTypes)
      return typesName
    }
    else if (node.type === TYPE_ARRAY) {
      if (!this.options.expendArray) {
        const itemTypes = new Set<string>()
        for (const child of node.value as ASTNode[])
          itemTypes.add(this.transform(child))
        const typesName = `Array<${[...itemTypes].join(' | ')}>`
        return typesName
      }
      else {
        const itemTypes = new Array<string>()
        for (const child of node.value as ASTNode[])
          itemTypes.push(this.transform(child))

        const typesName = `[${itemTypes.join(', ')}]`
        return typesName
      }
    }
    else {
      return node.type
    }
  }

  generateTypesString(): string {
    const res = new Array<string>()
    for (const [typesName, keyTypes] of this.types)
      res.push(this._generateTypesString(typesName, keyTypes))
    return res.join('\n')
  }

  _generateTypesString(typesName: string, keyTypes: KeyTypeObject): string {
    const res = new Array<string>()
    const indentStr = ' '.repeat(this.options.indents!)

    res.push(`${this.options.objectKeyword} ${typesName} ${this.isInterface ? '' : '= '}{\n`)
    for (const [key, type] of Object.entries(keyTypes))
      res.push(`${indentStr}${key}: ${type}\n`)
    res.push('}\n')

    return res.join('')
  }
}

export function generateTypes(ast: ASTNode, options?: GeneratorOptions) {
  const generator = new TypesGenerator(ast, options).generate()
  return generator
}
