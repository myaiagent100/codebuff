import editor from '../editor'

import type { SecretAgentDefinition } from '../../types/secret-agent-definition'

const definition: SecretAgentDefinition = {
  ...editor,
  id: 'editor-gpt-5-high',
  model: process.env.DEFAULT_MODEL || 'openrouter/qwen/qwen3-coder',
  reasoningOptions: {
    enabled: true,
    effort: 'high',
    exclude: true,
  },
}

export default definition
