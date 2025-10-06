#!/bin/bash

# Скрипт для запуска Codebuff CLI с правильными переменными окружения

export CODEBUFF_API_KEY=local-test-session-token
export NEXT_PUBLIC_CODEBUFF_BACKEND_URL=localhost:4242
export NEXT_PUBLIC_CB_ENVIRONMENT=dev
export NEXT_PUBLIC_CODEBUFF_APP_URL=http://localhost:3000
export NEXT_PUBLIC_SUPPORT_EMAIL=support@codebuff.com

cd "$(dirname "$0")"
bun --env-file=../.env run src/index.ts "$@"
