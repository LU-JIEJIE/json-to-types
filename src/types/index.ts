export interface ASTNode {
  key: string
  type: string
  value: string | ASTNode[]
  loc?: Location
}

export interface Location {
  start: Position
  end: Position
  source: string
}

export interface Position {
  line: number
  column: number
  offset: number
}

export interface ParseContext {
  line: number
  column: number
  offset: number
  source: string
}
