import { publisher } from './constants'
import { researcher as researcherFactory } from './factory/researcher'

import type { SecretAgentDefinition } from './types/secret-agent-definition'

const definition: SecretAgentDefinition = {
  id: 'researcher',
  publisher,
  ...researcherFactory(process.env.DEFAULT_MODEL),
}

export default definition
