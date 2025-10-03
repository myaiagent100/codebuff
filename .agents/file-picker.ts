import { publisher } from './constants'
import { filePicker } from './factory/file-picker'

import type { SecretAgentDefinition } from './types/secret-agent-definition'

const definition: SecretAgentDefinition = {
  id: 'file-picker',
  publisher,
  ...filePicker(process.env.DEFAULT_MODEL),
}

export default definition
