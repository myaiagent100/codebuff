# Summary of Changes for LiteLLM Integration

## Overview
This repository has been configured to work with a custom LiteLLM API endpoint instead of the standard OpenRouter API.

## Configuration Changes

### 1. Environment Configuration
**Files Created:**
- `.env.example` - Updated with clear REQUIRED vs OPTIONAL sections
- `SETUP_CHECKLIST.md` - Comprehensive setup guide with prerequisites and troubleshooting
- `setup-local-user.sql` - Database initialization for test user
- `create-session.sql` - CLI session token creation

### 2. LiteLLM API Integration

**Modified Files:**
- `backend/src/llm-apis/vercel-ai-sdk/openrouter.ts`
  - Changed `baseURL` from `https://openrouter.ai/api/v1` to `https://your-litellm-server.example.com/v1`

- `packages/internal/src/openrouter-ai-sdk/provider.ts`
  - Changed default `baseURL` to `https://your-litellm-server.example.com/v1`

- `packages/internal/src/openrouter-ai-sdk/facade.ts`
  - Changed default `baseURL` to `https://your-litellm-server.example.com/v1`

### 3. Model Configuration

**Modified Files:**
- `common/src/old-constants.ts`
  - Added `openrouter_qwen3_coder: 'openrouter/qwen/qwen3-coder'`
  - Modified `getModelForMode()` to always return `openrouter/qwen/qwen3-coder`

**Agent Files Modified (~80+ files):**
All agent definitions in `.agents/` directory have been updated to use `openrouter/qwen/qwen3-coder`:
- `.agents/base.ts`
- `.agents/base-max.ts`
- `.agents/base-quick.ts`
- `.agents/researcher.ts`
- `.agents/base2/*.ts`
- `.agents/reviewer/*.ts`
- `.agents/registry/*.ts`
- `.agents/deep-thinking/*.ts`
- And many more...

Pattern of change:
```typescript
// Before
model: 'anthropic/claude-sonnet-4.5'
model: 'google/gemini-2.5-pro'
model: 'openai/gpt-5-chat'

// After
model: 'openrouter/qwen/qwen3-coder'
```

### 4. Base Agents Loading

**Files Created:**
- `backend/src/templates/load-base-agents.ts` - New module to load base agents from `.agents/` directory

**Modified Files:**
- `backend/src/templates/agent-registry.ts`
  - Updated `assembleLocalAgentTemplates()` to accept and merge base agents

- `backend/src/websockets/websocket-action.ts`
  - Added import of `getCachedBaseAgents()`
  - Call `getCachedBaseAgents()` before assembling agent templates

- `backend/src/async-agent-manager.ts`
  - Added import of `getCachedBaseAgents()`
  - Call `getCachedBaseAgents()` for async agents

**Why This Change:**
This ensures base agents from `.agents/` are always available, regardless of `--cwd` parameter when launching CLI.

### 5. CLI Improvements

**Files Created:**
- `npm-app/start-cli.sh` - Wrapper script to set required environment variables

**Modified Files:**
- `npm-app/src/cli.ts`
  - Improved `handleEscKey()` to check both `isReceivingResponse` and `hasActiveInput`
  - More reliable ESC key handling for stopping AI responses

### 6. Convenience Scripts

**Files Created in backend/ directory:**
- `backend/start.sh` - Automated backend startup script that:
  - Checks for .env file existence
  - Verifies PostgreSQL is running
  - Starts PostgreSQL if needed
  - Launches backend server

- `backend/restart.sh` - Backend restart script that:
  - Kills any running backend processes
  - Starts fresh backend instance
  - Uses start.sh for consistent startup

**Files Created in root directory (wrapper scripts):**
- `setup.sh` - Initial setup automation script that:
  - Creates .env from .env.example
  - Installs dependencies with bun install
  - Starts PostgreSQL
  - Initializes database using Docker exec (no local psql required)

- `start-backend.sh` - Root wrapper for backend/start.sh
- `restart-backend.sh` - Root wrapper for backend/restart.sh
- `start-cli.sh` - Root wrapper for npm-app/start-cli.sh (passes arguments)

### 7. Analytics Fix

**Modified Files:**
- `npm-app/src/utils/analytics.ts`
  - Modified `initAnalytics()` to return early if PostHog credentials missing
  - Modified `identifyUser()` to return early if client not initialized
  - Allows local development without PostHog setup

### 8. Configurable LiteLLM URL and Model

**Why This Change:**
Allow flexible configuration of LiteLLM server URL and model through environment variables.

**New Environment Variables:**
- `LITELLM_BASE_URL` - LiteLLM server URL (default: `https://your-litellm-server.example.com/v1`)
- `DEFAULT_MODEL` - Model to use (default: `openrouter/qwen/qwen3-coder`)

**Modified Files:**
- `packages/internal/src/env.ts` - Added `LITELLM_BASE_URL` and `DEFAULT_MODEL` to env schema
- `backend/src/llm-apis/vercel-ai-sdk/openrouter.ts` - Use `env.LITELLM_BASE_URL` instead of hardcoded URL
- `packages/internal/src/openrouter-ai-sdk/provider.ts` - Use `process.env.LITELLM_BASE_URL` as fallback
- `packages/internal/src/openrouter-ai-sdk/facade.ts` - Use `process.env.LITELLM_BASE_URL` as fallback
- `common/src/old-constants.ts` - Use `process.env.DEFAULT_MODEL` in `getModelForMode()`
- `.env.example` - Added new optional variables with documentation

**Benefits:**
- Easy switching between different LiteLLM servers
- Quick model testing without code changes
- Better flexibility for different environments

### 9. Documentation Updates

**Modified Files:**
- `README.md` - Added "Local Development Setup" section with quick start instructions
- `SETUP_CHECKLIST.md` - Completely restructured for simpler workflow using root scripts, added info about new env variables, includes prerequisites, troubleshooting, and customization instructions

## Key Features

### 1. LiteLLM API Support
- All AI requests go to `https://your-litellm-server.example.com/v1/` instead of OpenRouter
- Uses API key from `OPEN_ROUTER_API_KEY` environment variable

### 2. Single Model (qwen3-coder)
- All operations use `openrouter/qwen/qwen3-coder` model
- Consistent behavior across all agents

### 3. Improved Agent Loading
- Base agents always loaded from repository's `.agents/` directory
- User agents from `--cwd` directory merged with base agents
- No "Agent template not found" errors when using `--cwd`

### 4. Better ESC Handling
- ESC key reliably stops AI responses
- Checks multiple conditions for active processing
- Shows "[Response stopped by user]" message

### 5. Local Development Ready
- Works without external services (Stripe, Discord, etc.)
- Dummy values for optional environment variables
- Clear documentation in `SETUP_CHECKLIST.md`

## Testing Checklist

Before pushing to colleagues, verify:

- [ ] `.env.example` contains correct LiteLLM endpoint comments
- [ ] `SETUP_CHECKLIST.md` is comprehensive and up-to-date
- [ ] Backend starts successfully with local PostgreSQL
- [ ] CLI connects to backend via `start-cli.sh`
- [ ] AI responds to prompts using qwen3-coder model
- [ ] ESC key stops AI responses
- [ ] `--cwd` parameter works with base agents
- [ ] Tool calls work (file reading, editing, terminal commands)

## Files NOT Modified

These files remain unchanged and use defaults:
- Docker configuration (`docker-compose.yml`)
- Database migrations
- Core tool implementations
- Frontend components (if any)

## Rollback Instructions

If needed to revert to original OpenRouter setup:

1. Restore original baseURL in 3 files:
   - `backend/src/llm-apis/vercel-ai-sdk/openrouter.ts`
   - `packages/internal/src/openrouter-ai-sdk/provider.ts`
   - `packages/internal/src/openrouter-ai-sdk/facade.ts`

2. Restore `getModelForMode()` in `common/src/old-constants.ts`

3. Revert agent model changes (or create a script to batch update)

Note: Base agent loading improvements can be kept as they're beneficial regardless of API provider.
