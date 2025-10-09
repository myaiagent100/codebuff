#!/bin/bash

# Codebuff Backend Starter Script
# This script starts the backend server with proper environment configuration

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$PROJECT_ROOT/.env"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Codebuff Backend...${NC}"

# Check if .env exists
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}❌ Error: .env file not found${NC}"
    echo -e "${YELLOW}Please create .env file:${NC}"
    echo "  cp .env.example .env"
    echo "  # Then edit .env and set OPEN_ROUTER_API_KEY"
    exit 1
fi

# Check if PostgreSQL is running
echo -e "${YELLOW}📊 Checking PostgreSQL...${NC}"
if ! docker ps | grep -q manicode-db; then
    echo -e "${RED}❌ PostgreSQL is not running${NC}"
    echo -e "${YELLOW}Starting PostgreSQL with Docker Compose...${NC}"
    COMPOSE_FILE="$PROJECT_ROOT/common/src/db/docker-compose.yml"
    docker compose -f "$COMPOSE_FILE" up -d
    echo -e "${GREEN}✅ PostgreSQL started${NC}"
    echo -e "${YELLOW}⏳ Waiting 3 seconds for PostgreSQL to initialize...${NC}"
    sleep 3
else
    echo -e "${GREEN}✅ PostgreSQL is already running${NC}"
fi

# Start the backend server
echo -e "${GREEN}🔧 Starting backend server...${NC}"
cd "$SCRIPT_DIR"
exec bun --env-file="$ENV_FILE" src/index.ts
