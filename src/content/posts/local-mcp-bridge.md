---
title: Letting ChatGPT Use My Local Browser Through MCP
date: '2026-06-27'
author: Volodymyr Shcherbyna
category: Artificial Intelligence
excerpt: >-
  Explore how to bridge the gap between LLMs and local environments using the
  Model Context Protocol (MCP) to allow ChatGPT to interact with local browsers
  and files.
coverImage: >-
  https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?ixid=M3w4MzY0NTR8MHwxfHNlYXJjaHwyfHxzcGxpdCUyMHNjcmVlbiUyMGNvZGluZyUyMG1vbml0b3J8ZW58MHwwfHx8MTc4MjU5MTY4NHww&ixlib=rb-4.1.0&w=800&h=400&fit=crop
tags:
  - MCP
  - ChatGPT
  - Automation
  - Local Development
  - AI
---

What if ChatGPT could access your local browser or files in real-time?

Imagine the possibilities: scraping data from a dashboard behind a complex login, interacting with a local development environment, or saving generated code directly to your disk without the tedious copy-paste cycle. Normally, ChatGPT is isolated in the cloud; it lacks your active sessions, local cookies, and direct access to your file system.


https://github.com/user-attachments/assets/7fea5fba-9cc2-40ea-8354-487cb4d54083


## The Idea: Bridging the Gap

The core concept is to expose local Model Context Protocol (MCP) servers to ChatGPT via a secure bridge. Instead of the LLM trying to "reach into" your computer, we create a relay that translates requests.

The architecture looks like this:

```text
Local MCP Server → Bridge → HTTP Endpoint → ngrok/Tunnel → ChatGPT
```

In this workflow, the bridge connects to the local tools and exposes them over an HTTP endpoint. By using a tool like ngrok or Cloudflare Tunnel, we provide ChatGPT with a public URL that it can communicate with, effectively turning your local machine into a set of capabilities the AI can call upon.

https://github.com/user-attachments/assets/853b5eaa-4676-461b-bc6c-8ff5428ce814

## Proof of Concept

To test this hypothesis, I built a simple bridge utilizing a filesystem MCP server. The results were immediate: ChatGPT could list files, read contents, and inspect directories on my machine in real-time.

Taking it a step further, I integrated the Chrome DevTools MCP. This was the real breakthrough. Suddenly, ChatGPT could see the state of my local browser tabs, inspect the DOM of a page I was currently viewing, and interact with the browser as if it were a human user.

## What Worked

The proof of concept demonstrated that the bridge is highly effective for tool orchestration. Specifically, ChatGPT was able to:

* **Access Local Files:** Read and write files directly, enabling a seamless "AI-native" coding experience.
* **Inspect Browser Tabs:** Analyze the live state of a webpage, including content behind authentication.
* **Tool Orchestration:** Successfully call over 40 different tools across two separate MCP servers without confusion.

## A Critical Warning: Security Risks

![Red padlock on a black computer keyboard, indicating a security warning and the need for authentication.](https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixid=M3w4MzY0NTR8MHwxfHNlYXJjaHwxfHxzaGllbGQlMjBsb2NrJTIwc2VjdXJpdHl8ZW58MHwwfHx8MTc4MjU5MTY5N3ww&ixlib=rb-4.1.0&w=800&h=400&fit=crop)

Before attempting this setup, it is vital to understand that **this initial implementation is not secure.** In its raw form, it lacks authentication and restrictions, meaning anyone with the public URL could potentially execute commands on your machine.

To transform this from a proof-of-concept into a production-ready tool, several safeguards are mandatory:

* **Robust Authentication:** Implementing API keys or OAuth to ensure only authorized requests are processed.
* **Allowlists:** Strict restrictions on which tools can be called and which domains the browser is allowed to visit.
* **Read-Only Modes:** Creating a "safe mode" where the AI can read data but cannot modify files or execute destructive actions.
* **Isolated Profiles:** Using dedicated browser profiles to avoid exposing personal cookies or sensitive passwords.
* **Human-in-the-Loop:** Requiring manual approval for any "risky" actions (like deleting a file or clicking a "Submit" button).

## Related Projects

If you are interested in exploring this further, there are already emerging projects tackling this problem:

* [`mcp-local-tunnel`](https://github.com/domdomegg/mcp-local-tunnel): Provides relay-based access to local MCP servers.
* [`mcp-ferry`](https://github.com/dalberto/mcp-ferry): A more robust solution that leverages Cloudflare Tunnels and adds a layer of authentication.

## Why This Matters

This architecture enables ChatGPT to move beyond being a "chatbot" and become a "local agent." By granting it access to real environments—local files, internal dashboards, and logged-in sessions—we unlock entirely new workflows.

While the risks are significant, the potential for productivity is immense. The concept is proven; the next step is refining the security layer to make this a safe, everyday tool for developers and power users.

https://github.com/user-attachments/assets/234c2e0c-245e-48a2-b227-1b5b854656f5

https://github.com/user-attachments/assets/e3b8dcf4-d549-47d3-a765-52ce9b0daaa2
