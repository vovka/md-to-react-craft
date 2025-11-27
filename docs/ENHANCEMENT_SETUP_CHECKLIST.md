# Blog Enhancement Workflow - Setup Checklist

Follow these steps to get the blog enhancement workflow running.

## Prerequisites
- [ ] Repository pushed to GitHub
- [ ] GitHub Actions enabled on the repository

## Setup Steps

### 1. Get OpenRouter API Key
- [ ] Go to https://openrouter.ai/
- [ ] Sign up or log in
- [ ] Navigate to **Keys** section
- [ ] Click **Create Key**
- [ ] Copy the API key (keep it safe!)

### 2. Add GitHub Secret
- [ ] Go to your GitHub repository
- [ ] Click **Settings** tab
- [ ] Go to **Secrets and variables** → **Actions**
- [ ] Click **New repository secret**
- [ ] Name: `OPENROUTER_API_KEY`
- [ ] Paste your API key as the value
- [ ] Click **Add secret**

### 3. Create GitHub Environment
- [ ] In repository settings, go to **Environments**
- [ ] Click **New environment**
- [ ] Name: `enhancement-review` (exact name required!)
- [ ] Click **Configure environment**
- [ ] Enable **Required reviewers** checkbox
- [ ] Add yourself in the reviewers list
- [ ] Click **Save protection rules**

### 4. Install Dependencies
- [ ] Run `npm install` locally to install new dependencies
- [ ] Verify `ai` and `@ai-sdk/openai` are in package.json

### 5. Commit and Push
- [ ] Commit the new workflow and script files:
  ```bash
  git add .
  git commit -m "Add LLM blog enhancement workflow"
  git push
  ```

### 6. Test the Workflow
- [ ] Go to **Actions** tab on GitHub
- [ ] Find **"Enhance Blog Post with LLM"** workflow
- [ ] Click **Run workflow**
- [ ] Select your branch
- [ ] Click **Run workflow** button
- [ ] Watch it run!

## Optional: Set Default Variables

If you want to customize default values:

- [ ] Go to **Settings** → **Secrets and variables** → **Actions** → **Variables** tab
- [ ] Add variables (all optional):
  - `DEFAULT_MODEL` (e.g., `meta-llama/llama-3.1-70b-instruct:free`)
  - `DEFAULT_TEMPERATURE` (e.g., `0.7`)
  - `DEFAULT_ENHANCEMENT_MODE` (e.g., `complete`)
  - `DEFAULT_MAX_STEPS` (e.g., `10`)

## Verification

✅ You're all set when:
- [ ] Workflow appears in Actions tab
- [ ] Test run starts without errors
- [ ] Agent processes files and creates enhancement
- [ ] Summary shows preview of enhanced content
- [ ] Approval gate appears (environment protection)
- [ ] After approval, files are committed

## Common Issues

**Workflow not appearing?**
- Make sure the `.github/workflows/enhance-blog-post.yml` file is pushed to GitHub
- Check the workflow file syntax is valid

**"Secret not found" error?**
- Verify `OPENROUTER_API_KEY` is spelled exactly right (case-sensitive)
- Make sure the secret is set at repository level, not environment level

**Approval gate not showing?**
- Check environment name is exactly `enhancement-review`
- Verify you added yourself as a required reviewer
- Make sure `output_mode` input is set to `commit`

**Agent errors?**
- Check OpenRouter API key is valid
- Verify you have credits/access (free models don't need credits)
- Enable `debug_mode` to see detailed logs

## Next Steps

Once setup is complete:
1. Read [BLOG_ENHANCEMENT_WORKFLOW.md](./BLOG_ENHANCEMENT_WORKFLOW.md) for usage guide
2. Create a draft blog post
3. Run the workflow on your draft branch
4. Review and iterate until satisfied
5. Approve and merge!

## Quick Test

To verify everything works:

```bash
# Create a test branch
git checkout -b test/enhancement

# Create a simple test post
cat > src/content/posts/test-post.md << 'EOF'
---
title: "Test Post"
date: "2025-11-27"
author: "Test Author"
category: "Test"
excerpt: "A test post"
tags: ["test"]
---

# Test Post

This is test post. It has some grammar mistake and could be more detailed.
EOF

# Commit and push
git add .
git commit -m "Add test post"
git push origin test/enhancement

# Now run the workflow on this branch via GitHub UI
# If it works, delete the test branch after
```

Ready to enhance your blog posts! 🚀
