---
title: "AI-assisted coding: design-driven workflows and the 4D approach"
date: "2025-11-29"
author: "Volodymyr Shcherbyna"
category: "AI"
excerpt: "AI-assisted coding is most effective when driven by high-level design documents and context engineering. Shifting effort from implementation to design yields better results and lets AI handle the detailed code generation."
coverImage: "https://images.unsplash.com/photo-1554306274-f23873d9a26c?ixid=M3w4MzY0NTR8MHwxfHNlYXJjaHwzfHxBSSUyMGNvZGluZyUyMHNvZnR3YXJlJTIwYXJjaGl0ZWN0dXJlfGVufDB8MHx8fDE3NjQ4MTIzMjh8MA&ixlib=rb-4.1.0&w=800&h=400&fit=crop"
tags: ["AI", "coding", "design-document", "development"]
---

# AI-assisted coding: design-driven workflows and the 4D approach

Usually, AI-assisted coding is applied straightforwardly and can produce very useful results. However, many teams fall into a common trap: they ask the model to "create something big" without providing sufficient context or constraints. For example, a vague request such as "build me the button to make everything great" leaves the AI guessing: what kind of button, which color, what does "great" mean in this context, and how should it behave?

This post argues that the most effective way to leverage AI for coding is to shift effort away from low-level implementation prompts and toward high-level design and context. Below I describe a design-driven workflow I call Design Document Driven Development ("4D") and explain how it integrates with prompt/context engineering and with both greenfield and legacy projects.

## The problem with naive prompts

Ask for code without context and the model will fill the gaps with assumptions you did not intend. That can be fine for simple tasks, but for anything non-trivial it leads to mismatches, frequent rewrites, and wasted cycles.

Instead of repeatedly asking for larger chunks of code, invest time in defining intent, constraints, and expected behavior. A short, concrete example:

- Poor prompt: "Make a button that improves the site."
- Better prompt with context: "Create an accessible primary CTA button in React with a blue background (#0d6efd), white text, keyboard focus styles, and an ARIA label describing its action: 'Submit feedback'. It should call onSubmitFeedback when clicked."

The second prompt gives actionable details the model can follow immediately, reducing back-and-forth.

## From prompt engineering to context engineering

The first response to the problems above is to refine prompting. I prefer the term "context engineering" over "prompt engineering" because it emphasizes what matters: building the right context for the model, not just the wording of one prompt. Context engineering includes:

- High-level product goals and success metrics
- Relevant design documents and architecture notes
- API contracts and data schemas
- Example inputs and desired outputs
- Constraints (security, accessibility, performance)

When the model has this structured context, it can produce code that aligns with the system architecture and product intent rather than a piecemeal solution.


![Option 1 - Context Engineering (black pen on paper)](https://images.unsplash.com/photo-1628900941064-ba8df8b51e4a?ixid=M3w4MzY0NTR8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGRlc2lnbiUyMGRvY3VtZW50JTIwYXJjaGl0ZWN0dXJlJTIwcGxhbm5pbmd8ZW58MHwwfHx8MTc2NDgxMjM0Mnww&ixlib=rb-4.1.0&w=800&h=400&fit=crop)

## Design-driven development and the 4D approach

There are existing frameworks that emphasize requirements and design—PRD-driven development, design-driven development, and tools like Speckit or BMAD. My approach is similar in spirit but emphasizes a single canonical design artifact and a workflow around it. I call it Design Document Driven Development (4D or Dx4).

Core ideas of 4D:

1. Create a high-level design document that captures architecture, user flows, constraints, and non-functional requirements. Keep it implementation-agnostic—describe what the system should do and why, not the exact code.
2. Iterate on that document until the team agrees it captures the intended behavior and constraints. Expect this phase to take the bulk of time—often 60–90% of the effort for complex work.
3. Use AI to plan changes based on diffs to the design document. Treat the plan as a small, controlled spec for code generation.
4. Let AI generate most of the implementation, while humans review, test, and steer the changes.

Why this helps: when the design is explicit and stable, AI-generated code is much more reliable because it follows the same canonical context. Humans focus on high-level decisions and verification, which is where their impact is highest.


![Option 1 - 4D approach (person with paper)](https://images.unsplash.com/photo-1586936893354-362ad6ae47ba?ixid=M3w4MzY0NTR8MHwxfHNlYXJjaHwxfHx0ZWNobmljYWwlMjBkb2N1bWVudGF0aW9uJTIwd29ya2Zsb3clMjB0ZWFtJTIwcGxhbm5pbmd8ZW58MHwwfHx8MTc2NDgxMjM0Mnww&ixlib=rb-4.1.0&w=800&h=400&fit=crop)


## Applying the 4D workflow to legacy projects

The same process applies to existing codebases with a few practical adjustments. Start by generating or consolidating design documentation for the legacy system. If the codebase is large, split the design into layers or areas of concern (API layer, UI, data, integrations) and produce focused design documents for the area you will change.

AI can accelerate the audit and documentation phase: ask the model to scan the repository (or a representative subset) and generate an architectural summary, list of modules, and potential risk areas. Work in small, targeted increments—create or update the design document for the specific sub-system you plan to modify, then proceed with the same change-plan-code-review loop.


![Option 2 - Legacy projects (debugging)](https://images.unsplash.com/photo-1564931768730-7e4d8e240044?ixid=M3w4MzY0NTR8MHwxfHNlYXJjaHwyfHxsZWdhY3klMjBjb2RlJTIwcmVmYWN0b3JpbmclMjBkb2N1bWVudGF0aW9ufGVufDB8MHx8fDE3NjQ4MTIzNDJ8MA&ixlib=rb-4.1.0&w=800&h=400&fit=crop)


## Practical workflow (summary)

1. Draft a concise, implementation-agnostic design document describing goals, user flows, and constraints.
2. Iterate on that document until stakeholders agree on scope and behavior.
3. Use AI to generate a change plan based on diffs to the design document.
4. Ask AI to generate code according to the plan; review and test changes thoroughly.
5. Keep the design document current and treat it as the single source of truth for future changes.

By following this flow, teams spend their energy where it matters—on architecture, product thinking, and verification—while letting AI handle repetitive implementation details.
