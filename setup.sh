#!/bin/bash

# Codebuff Initial Setup Script
# Automates the initial setup process for new team members

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}  Codebuff Local Setup              ${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""

# Check if .env exists
if [ -f "$SCRIPT_DIR/.env" ]; then
    echo -e "${GREEN}✅ .env file already exists${NC}"
else
    echo -e "${YELLOW}📝 Creating .env file...${NC}"
    cp "$SCRIPT_DIR/.env.example" "$SCRIPT_DIR/.env"
    echo -e "${RED}⚠️  ВАЖНО: Отредактируйте .env и установите OPEN_ROUTER_API_KEY${NC}"
    echo -e "${YELLOW}   Откройте файл: nano .env${NC}"
    echo ""
fi

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
cd "$SCRIPT_DIR"
bun install
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Start PostgreSQL
echo -e "${YELLOW}🐘 Starting PostgreSQL...${NC}"
if docker ps | grep -q manicode-db; then
    echo -e "${GREEN}✅ PostgreSQL is already running${NC}"
else
    docker compose up -d
    echo -e "${GREEN}✅ PostgreSQL started${NC}"
    echo -e "${YELLOW}⏳ Waiting 5 seconds for PostgreSQL to initialize...${NC}"
    sleep 5
fi
echo ""

# Initialize database
echo -e "${YELLOW}🗄️  Initializing database...${NC}"
docker exec -i manicode-db psql -U manicode_user_local -d manicode_db_local < "$SCRIPT_DIR/setup-local-user.sql" 2>/dev/null || echo -e "${YELLOW}Note: User might already exist${NC}"
docker exec -i manicode-db psql -U manicode_user_local -d manicode_db_local < "$SCRIPT_DIR/create-session.sql" 2>/dev/null || echo -e "${YELLOW}Note: Session might already exist${NC}"
echo -e "${GREEN}✅ Database initialized${NC}"
echo ""

echo -e "${BLUE}=====================================${NC}"
echo -e "${GREEN}✅ Setup complete!${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. ${YELLOW}Edit .env and set OPEN_ROUTER_API_KEY${NC}"
echo -e "   nano .env"
echo ""
echo -e "2. ${YELLOW}Start backend (Terminal 1):${NC}"
echo -e "   ./start-backend.sh"
echo ""
echo -e "3. ${YELLOW}Start CLI (Terminal 2):${NC}"
echo -e "   ./start-cli.sh"
echo ""
