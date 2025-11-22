# Minimal Blog App

A clean, minimal blog built with React, TypeScript, and Tailwind CSS. Blog posts are written in Markdown and automatically processed by GitHub Actions.

## Features

- ✨ Clean, minimal design based on modern blog aesthetics
- 📝 Write blog posts in Markdown
- 🔄 Automatic post processing via GitHub Actions
- 🔍 Client-side search functionality
- 🏷️ Category and tag support
- ⚡ Fast, frontend-only architecture
- 📱 Fully responsive design
- 🎨 Syntax highlighting for code blocks

## Project Structure

```
src/
├── components/
│   ├── layout/          # Header, Footer, Layout components
│   ├── blog/            # Blog-specific components
│   └── ui/              # Reusable UI components (shadcn)
├── content/
│   └── posts/           # Markdown blog posts go here
├── pages/               # Page components
├── lib/                 # Utilities and processed posts
└── types/               # TypeScript type definitions

scripts/
└── process-posts.js     # Script to convert markdown to JSON

.github/
└── workflows/
    └── process-blog-posts.yml  # GitHub Actions workflow
```

## Adding New Blog Posts

1. Create a new `.md` file in `src/content/posts/`
2. Add frontmatter at the top:

```markdown
---
title: "Your Post Title"
date: "2024-01-15"
author: "Your Name"
category: "Category Name"
excerpt: "A brief description of your post"
coverImage: "https://example.com/image.jpg"
tags: ["tag1", "tag2"]
---

Your markdown content here...
```

3. Commit and push to GitHub
4. The GitHub Action will automatically process the post and update the site

## Technologies Used

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling with custom design system
- **React Router** - Client-side routing
- **React Markdown** - Markdown rendering
- **gray-matter** - Frontmatter parsing
- **reading-time** - Reading time calculation
- **rehype-highlight** - Code syntax highlighting
- **shadcn/ui** - UI components

## Local Development

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install dependencies
npm i

# Step 4: Process markdown posts (optional - GitHub Actions will do this automatically)
node scripts/process-posts.js

# Step 5: Start the development server
npm run dev
```

## GitHub Actions Workflow

The workflow in `.github/workflows/process-blog-posts.yml` automatically:
1. Detects new/modified markdown files in `src/content/posts/`
2. Extracts frontmatter and content
3. Calculates reading time
4. Generates `src/lib/posts.ts` with all post data
5. Commits the changes back to the repository

The workflow runs when:
- You push changes to markdown files in `src/content/posts/`
- You manually trigger it from the Actions tab

## Deployment

### Using Lovable

Simply open [Lovable](https://lovable.dev/projects/e70cb0d1-c5fe-4be9-8ef0-5705f0668f70) and click on Share -> Publish.

### Other Options

This is a static site that can also be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
