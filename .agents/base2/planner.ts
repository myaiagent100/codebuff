import type { SecretAgentDefinition } from '../types/secret-agent-definition'
import { plannerFactory } from './planner-factory'

const definition: SecretAgentDefinition = {
  id: 'planner',
  ...plannerFactory(process.env.DEFAULT_MODEL),
}

export default definition
