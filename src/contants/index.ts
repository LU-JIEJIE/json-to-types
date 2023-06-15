export const TYPE_OBJECT = 'Object'
export const TYPE_STRING = 'String'
export const TYPE_NUMBER = 'Number'
export const TYPE_ARRAY = 'Array'
export const TYPE_BOOLEAN = 'Boolean'
export const TYPE_NULL = 'Null'
export const TYPE_UNDEFINED = 'Undefined'

// root
export const TYPE_ROOT = TYPE_OBJECT
export const KEY_ROOT = ''
export const KEY_ARRAY_ITEM = 'ArrayItem'

// 正则表达式
export const REGEXP_MEANINGLESS = /^[ \t\r\n:,]+/
export const REGEXP_STRING = /"((?:[^"\\]|\\.)*)"/
export const REGEXP_NUMBER = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/
export const REGEXP_BOOLEAN = /^(true|false)/
export const REGEXP_NULL = /^null/
export const REGEXP_UNDEFINED = /^undefined/

// 抛出错误
export const ERROR_UNEXPECTED_KEY = 'Unexpected key'
export const ERROR_UNEXPECTED_VALUE = 'Unexpected value'
