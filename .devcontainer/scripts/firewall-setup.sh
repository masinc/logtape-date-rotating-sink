#!/usr/bin/sudo /bin/bash
set -euo pipefail
IFS=$'\n\t'

# Basic firewall setup with ipset support (run as root via sudo shebang)

# Flush existing rules and clean up
echo "🧹 Cleaning up existing firewall rules..."
iptables -F || true
iptables -X || true
iptables -t nat -F || true
iptables -t nat -X || true
iptables -t mangle -F || true
iptables -t mangle -X || true

# Destroy existing ipsets
ipset destroy firewall-allowed-domains 2>/dev/null || true

# Create ipset for allowed domains (using hash:net for CIDR support)
echo "📋 Creating ipset for allowed domains..."
ipset create firewall-allowed-domains hash:net

# Allow DNS and SSH before setting restrictive policies
echo "🌐 Setting up DNS and SSH access..."
iptables -A OUTPUT -p udp --dport 53 -j ACCEPT
iptables -A INPUT -p udp --sport 53 -j ACCEPT
iptables -A OUTPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --sport 22 -m conntrack --ctstate ESTABLISHED -j ACCEPT

# Allow loopback interface (localhost communication)
echo "🔄 Setting up loopback interface..."
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

# Detect and allow host network
echo "🏠 Detecting host network..."
HOST_IP=\$(ip route | grep default | awk '{print \$3}')
if [ -n "\$HOST_IP" ]; then
    HOST_NETWORK=\$(echo "\$HOST_IP" | sed 's/\\.[0-9]*\$/\\.0\\/24/')
    echo "Host network detected: \$HOST_NETWORK"
    iptables -A INPUT -s "\$HOST_NETWORK" -j ACCEPT
    iptables -A OUTPUT -d "\$HOST_NETWORK" -j ACCEPT
else
    echo "⚠️  Warning: Could not detect host network"
fi

# Set default policies to DROP
echo "🛡️  Setting restrictive default policies..."
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT DROP

# Allow established and related connections (both directions)
echo "🔗 Setting up established connection rules..."
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
iptables -A OUTPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Set up output rule for allowed domains ipset
echo "✅ Setting up allowed domains rule..."
iptables -A OUTPUT -m set --match-set firewall-allowed-domains dst -j ACCEPT

echo "🎉 Basic firewall setup complete!"
echo "📝 Use firewall.domain and firewall.github-api components to add allowed domains"

# Test firewall is working by verifying example.com is blocked
echo "🧪 Testing firewall configuration..."
if timeout 5 curl -s https://example.com >/dev/null 2>&1; then
    echo "❌ ERROR: Firewall test failed - example.com should be blocked but is accessible"
    exit 1
else
    echo "✅ SUCCESS: Firewall test passed - example.com is properly blocked"
fi
