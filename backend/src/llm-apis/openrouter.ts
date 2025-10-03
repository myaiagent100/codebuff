import { models } from '@codebuff/common/old-constants'
import { isExplicitlyDefinedModel } from '@codebuff/common/util/model-utils'
import { env } from '@codebuff/internal/env'
import { createOpenRouter } from '@codebuff/internal/openrouter-ai-sdk'

import { logger } from '../util/logger'

import type { Model } from '@codebuff/common/old-constants'

// Provider routing documentation: https://openrouter.ai/docs/features/provider-routing
const providerOrder = {
  [models.openrouter_claude_sonnet_4]: [
    'Google',
    'Anthropic',
    'Amazon Bedrock',
  ],
  [models.openrouter_claude_sonnet_4_5]: [
    'Google',
    'Anthropic',
    'Amazon Bedrock',
  ],
  [models.openrouter_claude_opus_4]: ['Google', 'Anthropic'],
} as const

export function openRouterLanguageModel(model: Model) {
  const apiKey = env.OPEN_ROUTER_API_KEY
  const baseURL = env.LITELLM_BASE_URL

  // Check if using LiteLLM (which doesn't support OpenRouter-specific parameters)
  const isLiteLLM = baseURL.includes('litellm')

  logger.info(
    {
      model,
      baseURL,
      isLiteLLM,
      apiKeyPrefix: apiKey.substring(0, 7),
      apiKeySuffix: apiKey.substring(apiKey.length - 4),
    },
    'Creating OpenRouter language model',
  )

  const extraBody: Record<string, any> = {}

  // Only add OpenRouter-specific parameters when using actual OpenRouter
  if (!isLiteLLM) {
    extraBody.transforms = ['middle-out']

    // Set allow_fallbacks based on whether model is explicitly defined
    const isExplicitlyDefined = isExplicitlyDefinedModel(model)

    extraBody.provider = {
      order: providerOrder[model as keyof typeof providerOrder],
      allow_fallbacks: !isExplicitlyDefined,
    }
  }

  const modelSettings: any = {}

  // Only include advanced settings when not using LiteLLM
  if (!isLiteLLM) {
    modelSettings.usage = { include: true }
    modelSettings.logprobs = true
  }

  return createOpenRouter({
    apiKey,
    baseURL,
    headers: {
      'HTTP-Referer': 'https://codebuff.com',
      'X-Title': 'Codebuff',
    },
    extraBody,
  }).languageModel(model, modelSettings)
}
