#!/bin/bash

# Codebuff Backend Starter - Root Wrapper
# This is a convenience wrapper to start backend from repository root

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$SCRIPT_DIR/backend"
exec ./start.sh
