import { reviewer } from './reviewer-factory'
import { publisher } from '../constants'

import type { SecretAgentDefinition } from '../types/secret-agent-definition'

const definition: SecretAgentDefinition = {
  ...reviewer(process.env.DEFAULT_MODEL),
  id: 'reviewer-max',
  publisher,
}

export default definition
