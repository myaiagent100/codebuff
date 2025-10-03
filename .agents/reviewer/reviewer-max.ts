import { reviewer } from './reviewer-factory'
import { publisher } from '../constants'

import type { SecretAgentDefinition } from '../types/secret-agent-definition'

const definition: SecretAgentDefinition = {
  ...reviewer(process.env.DEFAULT_MODEL || 'openrouter/qwen/qwen3-coder'),
  id: 'reviewer-max',
  publisher,
}

export default definition
