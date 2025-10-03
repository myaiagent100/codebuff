import { publisher } from '../constants'
import { reviewer } from './reviewer-factory'

import type { SecretAgentDefinition } from '../types/secret-agent-definition'

const definition: SecretAgentDefinition = {
  id: 'reviewer',
  publisher,
  ...reviewer(process.env.DEFAULT_MODEL || 'openrouter/qwen/qwen3-coder'),
  reasoningOptions: {
    effort: 'low',
    exclude: true,
  },
}

export default definition
