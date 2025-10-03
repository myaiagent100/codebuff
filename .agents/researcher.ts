import { publisher } from './constants'
import { researcher as researcherFactory } from './factory/researcher'

import type { SecretAgentDefinition } from './types/secret-agent-definition'

const definition: SecretAgentDefinition = {
  id: 'researcher',
  publisher,
  ...researcherFactory(process.env.DEFAULT_MODEL || 'openrouter/qwen/qwen3-coder'),
}

export default definition
