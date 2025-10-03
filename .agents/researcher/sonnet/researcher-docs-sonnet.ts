import { SecretAgentDefinition } from '../../types/secret-agent-definition'
import { publisher } from '../../constants'
import researcherDocs from '../researcher-docs'

const definition: SecretAgentDefinition = {
  ...researcherDocs,
  id: 'researcher-docs-sonnet',
  publisher,
  displayName: 'Docs Researcher Sonnet',
  model: process.env.DEFAULT_MODEL,
}

export default definition
