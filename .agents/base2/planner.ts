import type { SecretAgentDefinition } from '../types/secret-agent-definition'
import { plannerFactory } from './planner-factory'

const definition: SecretAgentDefinition = {
  id: 'planner',
  ...plannerFactory(process.env.DEFAULT_MODEL || 'openrouter/qwen/qwen3-coder'),
}

export default definition
