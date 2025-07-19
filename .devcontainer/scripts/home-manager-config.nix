{ config, pkgs, ... }:

{
  # Home Manager configuration
  home.username = "vscode";
  home.homeDirectory = "/home/vscode";
  
  # Package installation
  home.packages = with pkgs; [
    pkgs.ripgrep
    pkgs.fd
    pkgs.starship
  ];
  
  # Let Home Manager install and manage itself
  programs.home-manager.enable = true;
  
  # Home Manager state version
  home.stateVersion = "24.11";
}
