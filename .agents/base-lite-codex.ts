import { publisher } from './constants.ts'
import baseLite from './base-lite.ts'

import type { SecretAgentDefinition } from './types/secret-agent-definition.ts'

const definition: SecretAgentDefinition = {
  ...baseLite,
  id: 'base-lite-codex',
  publisher,
  model: process.env.DEFAULT_MODEL || 'openrouter/qwen/qwen3-coder',
  reasoningOptions: {
    enabled: true,
    effort: 'medium',
  },
}

export default definition
