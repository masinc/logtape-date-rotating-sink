FROM mcr.microsoft.com/devcontainers/base:jammy

USER root

COPY scripts/ /usr/local/scripts/
RUN chmod +x /usr/local/scripts/*

# Component: apt.install
USER root
RUN --mount=target=/var/lib/apt/lists,type=cache,sharing=locked \
    --mount=target=/var/cache/apt,type=cache,sharing=locked \
    apt-get update && apt-get install -y \
    git curl iptables ipset iproute2 dnsutils sudo fish coreutils \
    && rm -rf /var/lib/apt/lists/*

# Component: firewall.setup
USER root
RUN --mount=target=/var/lib/apt/lists,type=cache,sharing=locked \
    --mount=target=/var/cache/apt,type=cache,sharing=locked \
    apt-get update && apt-get install -y iptables ipset dnsutils curl jq

# Component: mise.setup
USER root
RUN --mount=target=/var/lib/apt/lists,type=cache,sharing=locked \
    --mount=target=/var/cache/apt,type=cache,sharing=locked \
    <<-EOS
    set -eux;
    install -dm 755 /etc/apt/keyrings &&
    wget -qO - https://mise.jdx.dev/gpg-key.pub | gpg --dearmor | tee /etc/apt/keyrings/mise-archive-keyring.gpg 1> /dev/null &&
    echo "deb [signed-by=/etc/apt/keyrings/mise-archive-keyring.gpg arch=amd64] https://mise.jdx.dev/deb stable main" | tee /etc/apt/sources.list.d/mise.list &&
    apt update &&
    apt install -y mise
EOS

# Component: nix.setup
# Create nix directory and set ownership
USER root
RUN mkdir -p /nix && chown -R vscode:vscode /nix

# Install Nix as vscode user in single-user mode
USER vscode
RUN <<-EOS
    set -eux;
    # Install Nix as vscode user in single-user mode
    curl -L https://nixos.org/nix/install | sh -s -- --no-daemon;
    # Source the Nix environment
    . ~/.nix-profile/etc/profile.d/nix.sh;
    # Create necessary directories
    mkdir -p ~/.config/home-manager ~/.config/fish/conf.d;
EOS

# Set environment variables for Nix (vscode user paths)
ENV PATH="/home/vscode/.nix-profile/bin:${PATH}"

# Initialize Home Manager as vscode user with cache for package downloads
RUN --mount=target=/tmp/nix-download-cache,type=cache,sharing=locked \
    <<-EOS
    set -uex;
    export USER=vscode;
    # Source Nix environment for vscode user
    . ~/.nix-profile/etc/profile.d/nix.sh;
    # Verify nix is available
    nix --version;
    # Set up Home Manager channel
    nix-channel --add https://github.com/nix-community/home-manager/archive/master.tar.gz home-manager;
    nix-channel --update;
    # Install Home Manager
    nix-shell '<home-manager>' -A install;
EOS

USER root

# Component: mise.install
USER vscode
RUN --mount=target=/home/vscode/.cache/mise,type=cache,sharing=locked,uid=1000,gid=1000 \
    <<-EOS
    set -ex;
    mise use -g deno@2;
    mise use -g node@lts;
    mise install;
EOS

# Component: nix.install
# Copy Home Manager configuration
USER vscode
RUN cp /usr/local/scripts/home-manager-config.nix ~/.config/home-manager/home.nix
# Apply Home Manager configuration
RUN --mount=target=/tmp/nix-download-cache,type=cache,sharing=locked \
    <<-EOS
    set -uex;
    export USER=vscode;
    # Source Nix environment for vscode user
    . ~/.nix-profile/etc/profile.d/nix.sh;
    # Apply Home Manager configuration
    home-manager switch;
EOS
USER root

# Component: shell.setup
# Set default shell for vscode user
USER root
RUN chsh -s /bin/fish vscode


USER vscode
