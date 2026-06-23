---
title: 'We Have AI, So Why Are We Still Clicking?'
date: '2026-06-23'
author: Volodymyr Shcherbyna
category: Technology
excerpt: >-
  Exploring how AI assistants change our workflow and why voice‑first desktop
  interaction could be the next big interface.
coverImage: >-
  https://images.unsplash.com/photo-1588357767511-c6b3010409a3?ixid=M3w4MzY0NTR8MHwxfHNlYXJjaHw5fHxkZXNrdG9wJTIwbWljcm9waG9uZSUyMG9mZmljZXxlbnwwfDB8fHwxNzgyMjUyODU1fDA&ixlib=rb-4.1.0&w=800&h=400&fit=crop
tags:
  - AI
  - voice control
  - desktop interaction
  - productivity
  - Linux
---

## When Coding Became… Talking

In 2025, AI coding assistants became a normal part of my daily development workflow. At first, I used them for small code snippets, explanations, refactoring, and debugging support. Over time, my **work shifted from writing traditional code to giving instructions**. I still write code occasionally, but most of my effort is now spent describing tasks, providing context, correcting results, asking for alternatives, and reviewing solutions.

## The Unexpected Problem: More AI, More Typing

![Close‑up of hands typing a long AI prompt on a backlit keyboard](https://images.unsplash.com/photo-1773855120479-3f5896628b7d?ixid=M3w4MzY0NTR8MHwxfHNlYXJjaHwxMXx8dHlwaW5nJTIwaGFuZHMlMjBBSSUyMHByb21wdCUyMGtleWJvYXJkJTIwb3ZlcmxvYWR8ZW58MHwwfHx8MTc4MjI1MjAzMHww&ixlib=rb-4.1.0&w=800&h=400&fit=crop)

The more I used AI assistants, the more I had to type: long prompts, detailed explanations, technical context, corrections, examples, and commands. It felt like I wasn’t programming less; I was simply moving effort from writing code to writing instructions. To cope, I **started using voice‑to‑text**, first for long prompts, then for notes, messages, and task descriptions. Speaking proved faster than typing when the goal is to convey intent rather than produce a polished final text.

## A Simple Question That Changed Everything

I began asking: If I can speak to AI and it understands me, **why do I still control the rest of my computer the old way?** Keyboard and mouse are precise but not always expressive; they force us to translate intent into mechanical actions—opening terminals, moving windows, copying text, clicking buttons, and repeating small actions hundreds of times daily.

## The Gap Between AI and the Desktop

While language models can understand vague, human instructions, most desktop interactions still rely on exact clicks, hotkeys, menus, and commands. Existing voice tools like Windows Copilot, Talon, and macOS accessibility features are impressive but require users to learn specific command languages. I wanted **a tool that adapts** to natural speech, handling imperfect phrasing and missing context, acting as an AI layer between intention and desktop actions.

## What If the Computer Adapted to You?

I envisioned a system that learns from me: I speak naturally, perhaps with noise or incomplete context, and the system grasps my intention—**not just speech‑to‑text, but true understanding** that triggers useful desktop actions.

## Meet [TUSK](https://github.com/vovka/tusk/blob/main/docs/architecture.md)

![Cover Option 2](https://images.unsplash.com/photo-1554200876-907f9286c2a1?ixid=M3w4MzY0NTR8MHwxfHNlYXJjaHwxfHxkZXNrdG9wJTIwbWljcm9waG9uZSUyMG9mZmljZXxlbnwwfDB8fHwxNzgyMjUyODU1fDA&ixlib=rb-4.1.0&w=800&h=400&fit=crop)

**[TUSK](https://github.com/vovka/tusk/blob/main/docs/architecture.md)** is my experiment in voice‑first desktop interaction, currently focused on Linux/GNOME. Its goal is not to replace the keyboard entirely, but to reduce friction by removing repetitive small actions and **making computer interaction feel more natural**. By letting AI interpret spoken intent, we can explore a desktop that understands *what* we want to do rather than *how* to click for it.

## Why This Might Matter More Than It Seems

Voice is already here, and with modern AI it becomes far more capable than before. Whether the future brings neural interfaces or other modalities, **voice offers an immediate, accessible bridge between human intent and computer actions**. This project started as a personal tool, but its potential uses span developers, writers, researchers, support teams, power users, and accessibility workflows—anyone who repeats many small desktop actions daily.

## This Is Just the Beginning

[TUSK](https://github.com/vovka/tusk/blob/main/docs/architecture.md) remains experimental, but it stems from a feeling I can no longer ignore: the way we use computers is evolving. **The next big interface** may not be another button or shortcut; it may simply be the **ability to say what we want**.
