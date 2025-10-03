import { type SecretAgentDefinition } from '../../types/secret-agent-definition'
import { publisher } from '../../constants'
import researcher from '../researcher-grok-4-fast'

const definition: SecretAgentDefinition = {
  ...researcher,
  id: 'researcher-sonnet',
  publisher,
  displayName: 'Researcher Sonnet',
  model: process.env.DEFAULT_MODEL || 'openrouter/qwen/qwen3-coder',

  spawnableAgents: [
    'file-explorer',
    'researcher-web-sonnet',
    'researcher-docs-sonnet',
  ],
}

export default definition
