#!/usr/bin/sudo /bin/bash
# Disable sudo access for security
set -eux

echo "🔒 Disabling sudo access to prevent privilege escalation..."

# Remove sudo access by clearing sudoers entries for vscode user
sed -i '/vscode/d' /etc/sudoers || true
rm -f /etc/sudoers.d/vscode || true

# Make sudo binary unusable for non-root users
chmod 700 /usr/bin/sudo || true

echo "🔐 sudo access disabled - system is now locked down"
