# neo-workshop

## 🚀 Launch your own environment in Codespaces for the NEO workshop

Click below to **create your own instance** of this workshop environment in the cloud (with your GitHub account):

[![Open in Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?hide_repo_select=true&repo=maoalejandro%2Fneo-workshop&ref=main)

### Environment Initialization ###
GitHub Codespaces starts loading a preconfigured environment after clicking the link. Once it's ready, a VS Code-like interface appears in the browser with a terminal and editor.

### Project Structure Overview ###

You can see folders like workshop, scripts, README.md, and configuration files like .devcontainer.

---

## 🛠️ Setup Instructions

Once your Codespaces environment is ready, follow these steps to configure the project:

1. Open the integrated terminal in your Codespace.
2. Run the following command to set up the environment:

```bash
bash setup.sh
```

## 🤖 Neo Setup

- **GEAI Base URL**, put **https://api.agents.globant.com**
- **GEAI API Key**, put the key received by email with the subject **API Keys for Agentic Software Development**
- **Azure Access Token**, put the token received by email with the subject **[Neo] - Your Tokens**

In the case that you need to close the session, execute the command `/q`.

To reconfigure the Neo Key values, reopen using the command `neo --reconfigure` 

## 🤖 CLINE

In the codespace, the **CLINE** plug-in is already configured to be used in the workshop. In the left toolbar, the **CLINE** icon is available to interact with the agent, setting up the API Key properly.

<img width="1796" alt="Screenshot 2025-07-02 at 4 56 00 PM" src="https://github.com/user-attachments/assets/b94a625e-6cc0-42b0-aeed-853512c898d5" />

For more details about **Cline** installation, reach out to this [link](https://docs.google.com/document/d/1Bglz9_2LP20bsihR4j2qu_ZMG84FZpT6KbWAePnsIgI/edit?tab=t.0#heading=h.ohtk0vy1lows)
