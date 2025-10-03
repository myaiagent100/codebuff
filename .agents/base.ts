import { publisher } from './constants'
import { base } from './factory/base.ts'

import type { SecretAgentDefinition } from './types/secret-agent-definition'

const definition: SecretAgentDefinition = {
  id: 'base',
  publisher,
  ...base(process.env.DEFAULT_MODEL, 'normal'),
}

export default definition
