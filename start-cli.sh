#!/bin/bash

# Codebuff CLI Starter - Root Wrapper
# This is a convenience wrapper to start CLI from repository root

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$SCRIPT_DIR/npm-app"
exec ./start-cli.sh "$@"
