#!/bin/bash

# Codebuff Backend Restarter - Root Wrapper
# This is a convenience wrapper to restart backend from repository root

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$SCRIPT_DIR/backend"
exec ./restart.sh
