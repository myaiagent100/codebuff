import * as fs from 'fs'
import * as path from 'path'
import { validateAgents } from '@codebuff/common/templates/agent-validation'
import type { AgentTemplate } from '@codebuff/common/types/agent-template'
import { logger } from '../util/logger'

/**
 * Get all TypeScript files recursively from a directory
 */
function getAllTsFiles(dir: string): string[] {
  const files: string[] = []

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        // Recursively scan subdirectories
        files.push(...getAllTsFiles(fullPath))
      } else if (
        entry.isFile() &&
        entry.name.endsWith('.ts') &&
        !entry.name.endsWith('.d.ts') &&
        !entry.name.endsWith('.test.ts')
      ) {
        files.push(fullPath)
      }
    }
  } catch (error) {
    // Ignore errors reading directories
  }

  return files
}

/**
 * Load base agents from Codebuff's .agents directory
 * This ensures base agents are always available regardless of --cwd
 */
export function loadBaseAgents(): Record<string, any> {
  const baseAgents: Record<string, any> = {}

  // Find .agents directory relative to Codebuff root
  // __dirname is backend/src/templates/ (or backend/dist/templates/ after build)
  // Need to go up to codebuff root: templates/ -> src/ -> backend/ -> codebuff/
  const codebuffRoot = path.resolve(__dirname, '../../..')
  const agentsDir = path.join(codebuffRoot, '.agents')

  if (!fs.existsSync(agentsDir)) {
    logger.debug(
      { agentsDir },
      'Base agents directory not found, skipping base agents load',
    )
    return baseAgents
  }

  const allTsFiles = getAllTsFiles(agentsDir)

  if (allTsFiles.length === 0) {
    return baseAgents
  }

  logger.debug(
    { agentsDir, fileCount: allTsFiles.length },
    'Loading base agents from Codebuff directory',
  )

  try {
    for (const fullPath of allTsFiles) {
      try {
        // Use require for CommonJS/TypeScript modules (works better in Bun)
        // Clear require cache first to ensure fresh load
        delete require.cache[fullPath]

        const agentModule = require(fullPath)
        const agentDefinition = agentModule.default

        if (!agentDefinition) continue

        // Validate that agent has required attributes
        if (!agentDefinition.id || !agentDefinition.model) {
          logger.debug(
            { fullPath, id: agentDefinition.id, model: agentDefinition.model },
            'Agent definition missing required attributes',
          )
          continue
        }

        // Convert handleSteps function to string if present
        let processedAgentDefinition = { ...agentDefinition }

        if (agentDefinition.handleSteps) {
          processedAgentDefinition.handleSteps =
            agentDefinition.handleSteps.toString()
        }

        baseAgents[processedAgentDefinition.id] = processedAgentDefinition
      } catch (error: any) {
        logger.debug(
          { fullPath, error: error.message },
          'Error loading base agent',
        )
        continue
      }
    }
  } catch (error) {
    logger.error({ error }, 'Error loading base agents')
  }

  logger.info(
    { count: Object.keys(baseAgents).length },
    'Loaded base agents from Codebuff directory',
  )

  return baseAgents
}

let cachedBaseAgents: Record<string, AgentTemplate> | null = null

/**
 * Get cached base agents, loading them if not already cached
 */
export function getCachedBaseAgents(): Record<string, AgentTemplate> {
  if (cachedBaseAgents === null) {
    const rawAgents = loadBaseAgents()
    const { templates } = validateAgents(rawAgents)
    cachedBaseAgents = templates
  }
  return cachedBaseAgents
}
