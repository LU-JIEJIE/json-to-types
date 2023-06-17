export function upperFirstChar(str: string) {
  return str.replace(/^\w/, s => s.toUpperCase())
}

export function indentStr(str: string, indents: number) {
  const lines = str.split('\n')
  const indentChars = ' '.repeat(indents)
  const newLines = lines.map(line => indentChars + line)
  return newLines.join('\n')
}
