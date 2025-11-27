# Blog Post Enhancement Workflow

This document describes how to use the LLM-powered blog post enhancement workflow.

## Overview

The enhancement workflow uses an AI agent to improve blog post drafts by:
- Fixing grammar and spelling errors
- Expanding ideas with more detail
- Improving clarity and flow
- Maintaining your writing style and voice

The workflow includes a **review and approval gate** - you preview changes before they're committed.

## Setup

### 1. Create OpenRouter Account

1. Go to [OpenRouter.ai](https://openrouter.ai/)
2. Sign up for a free account
3. Navigate to Keys section
4. Create a new API key

### 2. Add API Key to GitHub Secrets

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `OPENROUTER_API_KEY`
5. Value: Paste your OpenRouter API key
6. Click **Add secret**

### 3. Create GitHub Environment (for approval gate)

1. Go to **Settings** → **Environments**
2. Click **New environment**
3. Name: `enhancement-review`
4. Enable **Required reviewers**
5. Add yourself (or team members) as reviewers
6. Click **Save protection rules**

### 4. Install Dependencies (for local testing)

```bash
npm install
```

This installs the required packages:
- `ai` - Vercel AI SDK
- `@ai-sdk/openai` - OpenRouter/OpenAI compatible client
- `zod` - Schema validation

## Usage

### Running the Workflow

1. **Create or edit a blog post** in your branch:
   ```bash
   git checkout -b feature/my-new-post
   # Edit src/content/posts/my-draft.md
   git add .
   git commit -m "Add draft post"
   git push origin feature/my-new-post
   ```

2. **Go to GitHub Actions tab**
   - Click on **"Enhance Blog Post with LLM"** workflow
   - Click **"Run workflow"** button

3. **Configure the enhancement** (or use defaults):
   - **Branch**: Select your branch
   - **Model**: Leave empty for default or try:
     - `meta-llama/llama-3.1-70b-instruct:free` (better quality)
     - `meta-llama/llama-3.1-8b-instruct:free` (faster)
     - `google/gemini-flash-1.5:free`
   - **Temperature**: 0.7 (lower = more conservative, higher = more creative)
   - **Enhancement Mode**:
     - `grammar_only` - Just fix mistakes
     - `expand` - Add more detail
     - `complete` - Full enhancement (recommended)
     - `custom` - Use your own prompt
   - **Output Mode**: `commit` (for auto-commit after approval)
   - **Dry Run**: Enable to preview without changes

4. **Review the enhancement**:
   - Wait for Stage 1 to complete (~30-60 seconds)
   - Click on the workflow run
   - Go to **Summary** tab
   - Review the enhanced content displayed there
   - Download artifacts for full enhanced files

5. **Approve or Reject**:
   - **If satisfied**: Click ✅ **"Approve deployment"**
     - Stage 2 runs and commits enhanced files to your branch
   - **If not satisfied**: Click ❌ **"Reject"**
     - Workflow stops
     - Click **"Re-run workflow"** with different parameters
     - Try different model, temperature, or mode

6. **Finalize**:
   - Enhanced files are committed as `*-enhanced.md`
   - Review locally, rename if needed
   - Create a PR to merge your branch

## Configuration Options

### Workflow Inputs

| Input | Description | Default |
|-------|-------------|---------|
| `model` | OpenRouter model to use | `meta-llama/llama-3.1-70b-instruct:free` |
| `temperature` | Creativity level (0.0-2.0) | `0.7` |
| `enhancement_mode` | Type of enhancement | `complete` |
| `custom_prompt` | Custom instructions | - |
| `file_pattern` | File filter (e.g., `draft-*.md`) | All changed files |
| `specific_file` | Process single file | - |
| `output_mode` | How to save results | `new_file` |
| `dry_run` | Preview only | `false` |
| `max_steps` | Agent iteration limit | `10` |
| `max_files` | Max files to process | `10` |
| `debug_mode` | Verbose logging | `false` |

### Repository Variables (Optional Defaults)

Set custom defaults in **Settings** → **Secrets and variables** → **Actions** → **Variables**:

- `DEFAULT_MODEL` - Your preferred model
- `DEFAULT_TEMPERATURE` - Your preferred creativity level
- `DEFAULT_ENHANCEMENT_MODE` - Your preferred mode
- `DEFAULT_MAX_STEPS` - Your preferred step limit

## Enhancement Modes

### Grammar Only
- Fixes spelling, grammar, punctuation
- Improves sentence structure
- No content changes
- Preserves author's voice

### Expand
- Adds more detail and examples
- Develops ideas more thoroughly
- Explains concepts better
- Maintains technical accuracy

### Complete (Recommended)
- All grammar fixes
- Content expansion
- Improved clarity and flow
- Professional polish
- Keeps your voice and style

### Custom
- Provide your own enhancement instructions
- Full control over what the AI does

## Cost Information

OpenRouter free models are completely free:
- `meta-llama/llama-3.1-70b-instruct:free`
- `meta-llama/llama-3.1-8b-instruct:free`
- `google/gemini-flash-1.5:free`

For paid models, typical costs:
- Blog post (~2000 words): $0.01-0.10 per enhancement
- Check [OpenRouter pricing](https://openrouter.ai/docs/pricing) for specifics

## Local Testing

Test the agent locally before running in CI:

```bash
# Set your API key
export OPENROUTER_API_KEY="your-key-here"

# Run with defaults
npm run enhance-post

# Run with custom options
node scripts/enhance-post-agent.js \
  --model "meta-llama/llama-3.1-8b-instruct:free" \
  --temperature 0.9 \
  --mode expand \
  --specific-file "src/content/posts/my-draft.md" \
  --dry-run \
  --debug
```

## Troubleshooting

### "No files found to enhance"
- Make sure you committed changes to `src/content/posts/*.md`
- Or use `specific_file` input to specify a file
- Or use `file_pattern` to match files

### "API key not found"
- Check that `OPENROUTER_API_KEY` is set in GitHub Secrets
- Verify the secret name is exact (case-sensitive)

### "Agent exceeded max steps"
- The agent ran too many iterations
- Increase `max_steps` input
- Or try a different model

### "Approval gate not showing"
- Verify the `enhancement-review` environment exists
- Check that you're added as a required reviewer
- Make sure `output_mode` is set to `commit`

### Enhancement quality is poor
- Try a different model (llama-3.1-70b vs 8b)
- Adjust temperature (lower = more conservative)
- Use `custom` mode with specific instructions
- Try running multiple times (AI can vary)

## Architecture

### Three-Level Configuration Hierarchy

```
Code Defaults (scripts/enhance-post-agent.js)
    ↓ overridden by
Repository Variables (GitHub Settings)
    ↓ overridden by
Workflow Inputs (form when triggering)
```

### Agent Tools

The LLM agent has access to these tools:

1. **listChangedFiles()** - Discover files to enhance
2. **readFile(path)** - Read markdown content
3. **writeFile(path, content, reason)** - Save enhanced version

The agent autonomously decides:
- Which files need enhancement
- How to enhance them
- What to write back

### Workflow Stages

**Stage 1: Generate Enhancement**
- Runs the agent
- Creates enhanced files
- Displays preview in Summary
- Uploads artifacts
- Pauses for review

**Stage 2: Review & Commit** (requires approval)
- Waits for manual approval
- Commits enhanced files
- Pushes to branch

## Best Practices

1. **Start with dry run** to preview behavior
2. **Use grammar_only first** for conservative enhancement
3. **Review carefully** before approving
4. **Iterate if needed** - reject and re-run with different settings
5. **Keep originals** - enhanced files use `-enhanced.md` suffix
6. **Test locally** before running in CI
7. **Set repository defaults** for your preferred settings

## Examples

### Quick Enhancement (all defaults)
1. Click "Run workflow"
2. Select your branch
3. Click "Run workflow" button
4. Review and approve

### Conservative Enhancement
- Mode: `grammar_only`
- Temperature: `0.3`
- Output: `new_file`

### Creative Expansion
- Mode: `expand`
- Temperature: `1.2`
- Model: `meta-llama/llama-3.1-70b-instruct:free`

### Specific File Only
- Specific file: `src/content/posts/draft-my-post.md`
- Mode: `complete`

### Custom Enhancement
- Mode: `custom`
- Custom prompt: "Make this post more technical, add code examples, and explain concepts in depth for senior developers"

## Support

For issues or questions:
1. Check this documentation
2. Review workflow logs in Actions tab
3. Enable `debug_mode` for more details
4. Check OpenRouter status and API limits
