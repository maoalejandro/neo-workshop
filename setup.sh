#!/bin/bash
python3.12 -m venv .venv
source .venv/bin/activate

# ⚠️ Reemplaza <AZURETOKEN> por tu token real o deja que el usuario lo edite
pip install --extra-index-url https://gxazure:CX0hwYbYvlUPqtoBIPluE2QD45H6ZZATnTL3Sa8P84ObSc1pmyckJQQJ99BBACAAAAAiGKB1AAASAZDOmHnH@pkgs.dev.azure.com/genexuslabs/gxeai-agents/_packaging/coda-neo-prod/pypi/simple/ neo-ai
