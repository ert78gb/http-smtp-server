import { readFileSync } from 'fs'
import Ajv from 'ajv'
import ajvErrors from 'ajv-errors'
import Idn from 'ajv-formats-draft2019/idn.js'
import { join } from 'desm'

const schemaFilePath = join(import.meta.url, 'request-schema.json')
const schema = JSON.parse(readFileSync(schemaFilePath, { encoding: 'utf-8' }))

const avj = new Ajv.default({
  allErrors: true,
  formats: {
    'idn-email': Idn['idn-email']
  }
})
ajvErrors(avj)

export default avj.compile(schema)
