import { reviewer } from '../../reviewer/reviewer-factory'

import type { SecretAgentDefinition } from '../../types/secret-agent-definition'

const definition: SecretAgentDefinition = {
  ...reviewer(process.env.DEFAULT_MODEL),
  id: 'reviewer-gpt-5-high',
  reasoningOptions: {
    effort: 'high',
    exclude: true,
  },
}

export default definition
