import { SecretAgentDefinition } from '../../types/secret-agent-definition'
import { publisher } from '../../constants'
import researcherCodebaseExplorer from '../researcher-codebase-explorer'

const definition: SecretAgentDefinition = {
  ...researcherCodebaseExplorer,
  id: 'researcher-codebase-explorer-sonnet',
  publisher,
  displayName: 'Codebase Explorer Sonnet',
  model: process.env.DEFAULT_MODEL || 'openrouter/qwen/qwen3-coder',
}

export default definition
