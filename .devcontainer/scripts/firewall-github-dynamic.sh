#!/usr/bin/sudo /bin/bash
# GitHub dynamic IP ranges from API (run as root via sudo shebang)
set -euo pipefail
IFS=$'\n\t'

echo "🐙 Fetching GitHub IP ranges from API..."

# Fetch GitHub meta information
GITHUB_META=$(curl -s https://api.github.com/meta)
if [ $? -ne 0 ]; then
  echo "❌ Failed to fetch GitHub IP ranges"
  exit 1
fi

# Validate JSON response
if ! echo "$GITHUB_META" | jq -e '.web and .api and .git' >/dev/null 2>&1; then
  echo "❌ Invalid GitHub API response format"
  exit 1
fi

echo "📋 Processing GitHub IP ranges and adding to ipset..."

# Extract and add web, API, and git IP ranges to ipset
for RANGE_TYPE in web api git; do
  echo "🔍 Processing $RANGE_TYPE ranges..."
  echo "$GITHUB_META" | jq -r --arg range "$RANGE_TYPE" '.[$range][]' | while read -r CIDR; do
    if [[ $CIDR =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/[0-9]+$ ]]; then
      echo "📍 Adding GitHub $RANGE_TYPE range: $CIDR to ipset"
      ipset add firewall-allowed-domains "$CIDR" 2>/dev/null || echo "⚠️  Range $CIDR already exists in ipset"
    else
      echo "⚠️  Invalid CIDR range: $CIDR"
    fi
  done
done

echo "✅ GitHub dynamic IP ranges added to firewall-allowed-domains ipset"
