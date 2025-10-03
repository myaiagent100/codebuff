import { publisher } from './constants'
import { thinker } from './factory/thinker'

import type { SecretAgentDefinition } from './types/secret-agent-definition'

const definition: SecretAgentDefinition = {
  id: 'thinker',
  publisher,
  ...thinker(process.env.DEFAULT_MODEL),
}

export default definition
