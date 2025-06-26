#!/bin/bash

# Solicita el token de Azure al usuario sin mostrarlo en pantalla
read -s -p "🔐 Ingresa tu Azure DevOps token: " AZURETOKEN
echo

# Verifica que se ingresó algo
if [ -z "$AZURETOKEN" ]; then
  echo "❌ No ingresaste un token. Abortando."
  exit 1
fi

# Crea y activa el entorno virtual
python3.12 -m venv .venv
source .venv/bin/activate

# Instala el paquete usando el token
pip install --extra-index-url "https://gxazure:${AZURETOKEN}@pkgs.dev.azure.com/genexuslabs/gxeai-agents/_packaging/coda-neo-prod/pypi/simple/" neo-ai

echo 'alias neo="source /workspaces/neo-workshop/.venv/bin/activate && neo"' >> ~/.bashrc
source ~/.bashrc

neo