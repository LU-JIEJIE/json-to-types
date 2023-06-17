import { describe, test } from 'vitest'

// import { indentStr } from '../src/utils/utils'

import { jsonToTypes } from '../src'

const json = `{
  "errCode": "1",
  "errMsg": "后缀名不符合要求",
  "data": "http://localhost:3000/1630487533658-1000000000.png",
  "actions": [
    {
      "name": "upload",
      "method": "post",
      "url": "/upload/single",
      "params": [
        {
          "name": "avatar",
          "type": "file",
          "required": true,
          "description": "上传的文件"
        }
      ],
      "response": {
        "errCode": "1",
        "errMsg": "未上传文件或文件格式不符合要求",
        "data": "http://localhost:3000/1630487533658-1000000000.png"
      }
    }
  ]
}`

describe('should', () => {
  test('only', () => {
    console.log(jsonToTypes(json, { expendArray: true }))
  })
})
