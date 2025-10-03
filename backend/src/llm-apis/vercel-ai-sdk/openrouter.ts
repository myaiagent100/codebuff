import { createOpenAI } from '@ai-sdk/openai'
import { env } from '@codebuff/internal/env'

/**
 * Create OpenRouter provider using OpenAI-compatible API
 */
export const openrouter = createOpenAI({
  name: 'openrouter',
  apiKey: env.OPEN_ROUTER_API_KEY,
  baseURL: env.LITELLM_BASE_URL,
  headers: {
    'HTTP-Referer': 'https://codebuff.com',
    'X-Title': 'Codebuff',
  },
})
