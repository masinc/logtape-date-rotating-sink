#!/usr/bin/sudo /bin/bash
# Allow specific domains by adding their IPs to ipset (run as root via sudo shebang)
set -euo pipefail
IFS=$'\n\t'

echo "🌐 Resolving and adding domains to ipset..."

echo "🔍 Resolving github.com..."
IPS=$(dig +short A github.com)
if [ -n "$IPS" ]; then
  for IP in $IPS; do
    if [[ $IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "📍 Adding IP $IP for github.com to ipset"
      ipset add firewall-allowed-domains "$IP" 2>/dev/null || echo "⚠️  IP $IP already exists in ipset"
    fi
  done
else
  echo "⚠️  Failed to resolve github.com"
fi\n
echo "🔍 Resolving api.github.com..."
IPS=$(dig +short A api.github.com)
if [ -n "$IPS" ]; then
  for IP in $IPS; do
    if [[ $IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "📍 Adding IP $IP for api.github.com to ipset"
      ipset add firewall-allowed-domains "$IP" 2>/dev/null || echo "⚠️  IP $IP already exists in ipset"
    fi
  done
else
  echo "⚠️  Failed to resolve api.github.com"
fi\n
echo "🔍 Resolving raw.githubusercontent.com..."
IPS=$(dig +short A raw.githubusercontent.com)
if [ -n "$IPS" ]; then
  for IP in $IPS; do
    if [[ $IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "📍 Adding IP $IP for raw.githubusercontent.com to ipset"
      ipset add firewall-allowed-domains "$IP" 2>/dev/null || echo "⚠️  IP $IP already exists in ipset"
    fi
  done
else
  echo "⚠️  Failed to resolve raw.githubusercontent.com"
fi\n
echo "🔍 Resolving objects.githubusercontent.com..."
IPS=$(dig +short A objects.githubusercontent.com)
if [ -n "$IPS" ]; then
  for IP in $IPS; do
    if [[ $IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "📍 Adding IP $IP for objects.githubusercontent.com to ipset"
      ipset add firewall-allowed-domains "$IP" 2>/dev/null || echo "⚠️  IP $IP already exists in ipset"
    fi
  done
else
  echo "⚠️  Failed to resolve objects.githubusercontent.com"
fi\n
echo "🔍 Resolving codeload.github.com..."
IPS=$(dig +short A codeload.github.com)
if [ -n "$IPS" ]; then
  for IP in $IPS; do
    if [[ $IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "📍 Adding IP $IP for codeload.github.com to ipset"
      ipset add firewall-allowed-domains "$IP" 2>/dev/null || echo "⚠️  IP $IP already exists in ipset"
    fi
  done
else
  echo "⚠️  Failed to resolve codeload.github.com"
fi\n
echo "🔍 Resolving avatars.githubusercontent.com..."
IPS=$(dig +short A avatars.githubusercontent.com)
if [ -n "$IPS" ]; then
  for IP in $IPS; do
    if [[ $IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "📍 Adding IP $IP for avatars.githubusercontent.com to ipset"
      ipset add firewall-allowed-domains "$IP" 2>/dev/null || echo "⚠️  IP $IP already exists in ipset"
    fi
  done
else
  echo "⚠️  Failed to resolve avatars.githubusercontent.com"
fi\n
echo "🔍 Resolving ghcr.io..."
IPS=$(dig +short A ghcr.io)
if [ -n "$IPS" ]; then
  for IP in $IPS; do
    if [[ $IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "📍 Adding IP $IP for ghcr.io to ipset"
      ipset add firewall-allowed-domains "$IP" 2>/dev/null || echo "⚠️  IP $IP already exists in ipset"
    fi
  done
else
  echo "⚠️  Failed to resolve ghcr.io"
fi\n
echo "🔍 Resolving deno.land..."
IPS=$(dig +short A deno.land)
if [ -n "$IPS" ]; then
  for IP in $IPS; do
    if [[ $IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "📍 Adding IP $IP for deno.land to ipset"
      ipset add firewall-allowed-domains "$IP" 2>/dev/null || echo "⚠️  IP $IP already exists in ipset"
    fi
  done
else
  echo "⚠️  Failed to resolve deno.land"
fi\n
echo "🔍 Resolving jsr.io..."
IPS=$(dig +short A jsr.io)
if [ -n "$IPS" ]; then
  for IP in $IPS; do
    if [[ $IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "📍 Adding IP $IP for jsr.io to ipset"
      ipset add firewall-allowed-domains "$IP" 2>/dev/null || echo "⚠️  IP $IP already exists in ipset"
    fi
  done
else
  echo "⚠️  Failed to resolve jsr.io"
fi\n
echo "🔍 Resolving deno.com..."
IPS=$(dig +short A deno.com)
if [ -n "$IPS" ]; then
  for IP in $IPS; do
    if [[ $IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "📍 Adding IP $IP for deno.com to ipset"
      ipset add firewall-allowed-domains "$IP" 2>/dev/null || echo "⚠️  IP $IP already exists in ipset"
    fi
  done
else
  echo "⚠️  Failed to resolve deno.com"
fi\n
echo "🔍 Resolving registry.npmjs.org..."
IPS=$(dig +short A registry.npmjs.org)
if [ -n "$IPS" ]; then
  for IP in $IPS; do
    if [[ $IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "📍 Adding IP $IP for registry.npmjs.org to ipset"
      ipset add firewall-allowed-domains "$IP" 2>/dev/null || echo "⚠️  IP $IP already exists in ipset"
    fi
  done
else
  echo "⚠️  Failed to resolve registry.npmjs.org"
fi\n
echo "🔍 Resolving npm.pkg.github.com..."
IPS=$(dig +short A npm.pkg.github.com)
if [ -n "$IPS" ]; then
  for IP in $IPS; do
    if [[ $IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "📍 Adding IP $IP for npm.pkg.github.com to ipset"
      ipset add firewall-allowed-domains "$IP" 2>/dev/null || echo "⚠️  IP $IP already exists in ipset"
    fi
  done
else
  echo "⚠️  Failed to resolve npm.pkg.github.com"
fi\n
echo "🔍 Resolving npmjs.com..."
IPS=$(dig +short A npmjs.com)
if [ -n "$IPS" ]; then
  for IP in $IPS; do
    if [[ $IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "📍 Adding IP $IP for npmjs.com to ipset"
      ipset add firewall-allowed-domains "$IP" 2>/dev/null || echo "⚠️  IP $IP already exists in ipset"
    fi
  done
else
  echo "⚠️  Failed to resolve npmjs.com"
fi\n
echo "🔍 Resolving cache.nixos.org..."
IPS=$(dig +short A cache.nixos.org)
if [ -n "$IPS" ]; then
  for IP in $IPS; do
    if [[ $IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "📍 Adding IP $IP for cache.nixos.org to ipset"
      ipset add firewall-allowed-domains "$IP" 2>/dev/null || echo "⚠️  IP $IP already exists in ipset"
    fi
  done
else
  echo "⚠️  Failed to resolve cache.nixos.org"
fi\n
echo "🔍 Resolving nixos.org..."
IPS=$(dig +short A nixos.org)
if [ -n "$IPS" ]; then
  for IP in $IPS; do
    if [[ $IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "📍 Adding IP $IP for nixos.org to ipset"
      ipset add firewall-allowed-domains "$IP" 2>/dev/null || echo "⚠️  IP $IP already exists in ipset"
    fi
  done
else
  echo "⚠️  Failed to resolve nixos.org"
fi\n
echo "🔍 Resolving channels.nixos.org..."
IPS=$(dig +short A channels.nixos.org)
if [ -n "$IPS" ]; then
  for IP in $IPS; do
    if [[ $IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "📍 Adding IP $IP for channels.nixos.org to ipset"
      ipset add firewall-allowed-domains "$IP" 2>/dev/null || echo "⚠️  IP $IP already exists in ipset"
    fi
  done
else
  echo "⚠️  Failed to resolve channels.nixos.org"
fi\n
echo "🔍 Resolving nix-community.cachix.org..."
IPS=$(dig +short A nix-community.cachix.org)
if [ -n "$IPS" ]; then
  for IP in $IPS; do
    if [[ $IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "📍 Adding IP $IP for nix-community.cachix.org to ipset"
      ipset add firewall-allowed-domains "$IP" 2>/dev/null || echo "⚠️  IP $IP already exists in ipset"
    fi
  done
else
  echo "⚠️  Failed to resolve nix-community.cachix.org"
fi\n
echo "🔍 Resolving hydra.nixos.org..."
IPS=$(dig +short A hydra.nixos.org)
if [ -n "$IPS" ]; then
  for IP in $IPS; do
    if [[ $IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "📍 Adding IP $IP for hydra.nixos.org to ipset"
      ipset add firewall-allowed-domains "$IP" 2>/dev/null || echo "⚠️  IP $IP already exists in ipset"
    fi
  done
else
  echo "⚠️  Failed to resolve hydra.nixos.org"
fi\n
echo "🔍 Resolving api.anthropic.com..."
IPS=$(dig +short A api.anthropic.com)
if [ -n "$IPS" ]; then
  for IP in $IPS; do
    if [[ $IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "📍 Adding IP $IP for api.anthropic.com to ipset"
      ipset add firewall-allowed-domains "$IP" 2>/dev/null || echo "⚠️  IP $IP already exists in ipset"
    fi
  done
else
  echo "⚠️  Failed to resolve api.anthropic.com"
fi\n
echo "🔍 Resolving claude.ai..."
IPS=$(dig +short A claude.ai)
if [ -n "$IPS" ]; then
  for IP in $IPS; do
    if [[ $IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "📍 Adding IP $IP for claude.ai to ipset"
      ipset add firewall-allowed-domains "$IP" 2>/dev/null || echo "⚠️  IP $IP already exists in ipset"
    fi
  done
else
  echo "⚠️  Failed to resolve claude.ai"
fi\n
echo "🔍 Resolving console.anthropic.com..."
IPS=$(dig +short A console.anthropic.com)
if [ -n "$IPS" ]; then
  for IP in $IPS; do
    if [[ $IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "📍 Adding IP $IP for console.anthropic.com to ipset"
      ipset add firewall-allowed-domains "$IP" 2>/dev/null || echo "⚠️  IP $IP already exists in ipset"
    fi
  done
else
  echo "⚠️  Failed to resolve console.anthropic.com"
fi\n
echo "🔍 Resolving sentry.io..."
IPS=$(dig +short A sentry.io)
if [ -n "$IPS" ]; then
  for IP in $IPS; do
    if [[ $IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "📍 Adding IP $IP for sentry.io to ipset"
      ipset add firewall-allowed-domains "$IP" 2>/dev/null || echo "⚠️  IP $IP already exists in ipset"
    fi
  done
else
  echo "⚠️  Failed to resolve sentry.io"
fi\n
echo "🔍 Resolving statsig.anthropic.com..."
IPS=$(dig +short A statsig.anthropic.com)
if [ -n "$IPS" ]; then
  for IP in $IPS; do
    if [[ $IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "📍 Adding IP $IP for statsig.anthropic.com to ipset"
      ipset add firewall-allowed-domains "$IP" 2>/dev/null || echo "⚠️  IP $IP already exists in ipset"
    fi
  done
else
  echo "⚠️  Failed to resolve statsig.anthropic.com"
fi\n
echo "🔍 Resolving statsig.com..."
IPS=$(dig +short A statsig.com)
if [ -n "$IPS" ]; then
  for IP in $IPS; do
    if [[ $IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "📍 Adding IP $IP for statsig.com to ipset"
      ipset add firewall-allowed-domains "$IP" 2>/dev/null || echo "⚠️  IP $IP already exists in ipset"
    fi
  done
else
  echo "⚠️  Failed to resolve statsig.com"
fi\n
echo "🔍 Resolving mcp.context7.com..."
IPS=$(dig +short A mcp.context7.com)
if [ -n "$IPS" ]; then
  for IP in $IPS; do
    if [[ $IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "📍 Adding IP $IP for mcp.context7.com to ipset"
      ipset add firewall-allowed-domains "$IP" 2>/dev/null || echo "⚠️  IP $IP already exists in ipset"
    fi
  done
else
  echo "⚠️  Failed to resolve mcp.context7.com"
fi\n
echo "🔍 Resolving context7.com..."
IPS=$(dig +short A context7.com)
if [ -n "$IPS" ]; then
  for IP in $IPS; do
    if [[ $IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "📍 Adding IP $IP for context7.com to ipset"
      ipset add firewall-allowed-domains "$IP" 2>/dev/null || echo "⚠️  IP $IP already exists in ipset"
    fi
  done
else
  echo "⚠️  Failed to resolve context7.com"
fi\n
echo "🔍 Resolving mcp.deepwiki.com..."
IPS=$(dig +short A mcp.deepwiki.com)
if [ -n "$IPS" ]; then
  for IP in $IPS; do
    if [[ $IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "📍 Adding IP $IP for mcp.deepwiki.com to ipset"
      ipset add firewall-allowed-domains "$IP" 2>/dev/null || echo "⚠️  IP $IP already exists in ipset"
    fi
  done
else
  echo "⚠️  Failed to resolve mcp.deepwiki.com"
fi\n
echo "🔍 Resolving deepwiki.com..."
IPS=$(dig +short A deepwiki.com)
if [ -n "$IPS" ]; then
  for IP in $IPS; do
    if [[ $IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "📍 Adding IP $IP for deepwiki.com to ipset"
      ipset add firewall-allowed-domains "$IP" 2>/dev/null || echo "⚠️  IP $IP already exists in ipset"
    fi
  done
else
  echo "⚠️  Failed to resolve deepwiki.com"
fi

echo "✅ Domain IPs added to firewall-allowed-domains ipset"
