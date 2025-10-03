#!/bin/bash

# Codebuff Backend Restart Script
# This script stops any running backend processes and starts a new instance

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔄 Restarting Codebuff Backend...${NC}"

# Find and kill any running backend processes
BACKEND_PIDS=$(pgrep -f "bun.*src/index.ts" || true)

if [ -n "$BACKEND_PIDS" ]; then
    echo -e "${YELLOW}Stopping existing backend processes: $BACKEND_PIDS${NC}"
    kill $BACKEND_PIDS 2>/dev/null || true
    sleep 1

    # Force kill if still running
    STILL_RUNNING=$(pgrep -f "bun.*src/index.ts" || true)
    if [ -n "$STILL_RUNNING" ]; then
        echo -e "${YELLOW}Force killing: $STILL_RUNNING${NC}"
        kill -9 $STILL_RUNNING 2>/dev/null || true
    fi

    echo -e "${GREEN}✅ Stopped backend processes${NC}"
else
    echo -e "${GREEN}No running backend processes found${NC}"
fi

# Start the backend using the start script
echo -e "${GREEN}Starting fresh backend instance...${NC}"
exec "$SCRIPT_DIR/start.sh"
