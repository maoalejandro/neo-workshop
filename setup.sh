#!/bin/bash

# Prompt the user for the Azure DevOps token without showing it on the screen
read -s -p "🔐 Enter your Azure DevOps token: " AZURETOKEN
echo

# Check that something was entered
if [ -z "$AZURETOKEN" ]; then
  echo "❌ You didn't enter a token. Aborting."
  exit 1
fi

# Create and activate the virtual environment
python3.12 -m venv .venv
source .venv/bin/activate

# Install the package using the token
pip install --extra-index-url "https://gxazure:${AZURETOKEN}@pkgs.dev.azure.com/genexuslabs/gxeai-agents/_packaging/coda-neo-prod/pypi/simple/" neo-ai

# Add a shortcut alias to activate the virtual environment and run 'neo'
echo 'alias neo="source /workspaces/neo-workshop/.venv/bin/activate && neo"' >> ~/.bashrc
source ~/.bashrc

# Run the 'neo' command
neo
