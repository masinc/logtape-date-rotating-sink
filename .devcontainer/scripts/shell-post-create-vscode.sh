#!/bin/bash
set -ex

# Commands for vscode user
npm install -g @anthropic-ai/claude-code
claude mcp add --transport http context7 https://mcp.context7.com/mcp
claude mcp add --transport http deepwiki https://mcp.deepwiki.com/mcp
