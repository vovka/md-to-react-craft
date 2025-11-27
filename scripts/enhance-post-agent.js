import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { glob } from 'glob';
import matter from 'gray-matter';
import { z } from 'zod';
import { execSync } from 'node:child_process';

// ============================================================================
// Configuration with three-level hierarchy: defaults → env vars → CLI args
// ============================================================================

const DEFAULT_CONFIG = {
  model: 'meta-llama/llama-3.1-70b-instruct:free',
  temperature: 0.7,
  maxSteps: 10,
  enhancementMode: 'complete',
  maxFiles: 10,
  outputMode: 'new_file', // 'overwrite', 'new_file', 'commit', 'artifact'
  dryRun: false,
  debug: false,
  customPrompt: '',
  filePattern: '',
  specificFile: '',
};

function getArgValue(argName) {
  const index = process.argv.indexOf(argName);
  return index !== -1 && process.argv[index + 1] ? process.argv[index + 1] : null;
}

function hasArg(argName) {
  return process.argv.includes(argName);
}

// Build final configuration
const config = {
  model: getArgValue('--model') || process.env.MODEL || DEFAULT_CONFIG.model,
  temperature: parseFloat(getArgValue('--temperature') || process.env.TEMPERATURE || DEFAULT_CONFIG.temperature),
  maxSteps: parseInt(getArgValue('--max-steps') || process.env.MAX_STEPS || DEFAULT_CONFIG.maxSteps),
  enhancementMode: getArgValue('--mode') || process.env.ENHANCEMENT_MODE || DEFAULT_CONFIG.enhancementMode,
  maxFiles: parseInt(getArgValue('--max-files') || process.env.MAX_FILES || DEFAULT_CONFIG.maxFiles),
  outputMode: getArgValue('--output-mode') || process.env.OUTPUT_MODE || DEFAULT_CONFIG.outputMode,
  dryRun: hasArg('--dry-run') || process.env.DRY_RUN === 'true' || DEFAULT_CONFIG.dryRun,
  debug: hasArg('--debug') || process.env.DEBUG === 'true' || DEFAULT_CONFIG.debug,
  customPrompt: getArgValue('--custom-prompt') || process.env.CUSTOM_PROMPT || DEFAULT_CONFIG.customPrompt,
  filePattern: getArgValue('--file-pattern') || process.env.FILE_PATTERN || DEFAULT_CONFIG.filePattern,
  specificFile: getArgValue('--specific-file') || process.env.SPECIFIC_FILE || DEFAULT_CONFIG.specificFile,
  apiKey: process.env.OPENROUTER_API_KEY,
};

// ============================================================================
// Helper Functions
// ============================================================================

function log(...args) {
  console.log('[ENHANCE-AGENT]', ...args);
}

function debug(...args) {
  if (config.debug) {
    console.log('[DEBUG]', ...args);
  }
}

function getChangedMarkdownFiles() {
  try {
    // Get files changed compared to main branch
    const output = execSync('git diff --name-only origin/main...HEAD', { encoding: 'utf8' });
    const changedFiles = output
      .split('\n')
      .filter(file => file.startsWith('src/content/posts/') && file.endsWith('.md'))
      .filter(file => file.trim() !== '');

    debug('Changed files from git diff:', changedFiles);
    return changedFiles;
  } catch (error) {
    debug('Error getting changed files, falling back to all posts:', error.message);
    // Fallback to all markdown files if git diff fails
    return [];
  }
}

function getAllMarkdownFiles() {
  const pattern = config.filePattern
    ? `src/content/posts/${config.filePattern}`
    : 'src/content/posts/**/*.md';

  const files = glob.sync(pattern);
  debug('All markdown files matching pattern:', files);
  return files;
}

function getFilesToProcess() {
  if (config.specificFile) {
    return [config.specificFile];
  }

  const changedFiles = getChangedMarkdownFiles();

  if (changedFiles.length > 0) {
    log(`Found ${changedFiles.length} changed markdown files`);
    return changedFiles.slice(0, config.maxFiles);
  }

  log('No changed files detected, using all markdown files');
  const allFiles = getAllMarkdownFiles();
  return allFiles.slice(0, config.maxFiles);
}

// ============================================================================
// Enhancement Prompts
// ============================================================================

const ENHANCEMENT_PROMPTS = {
  grammar_only: `You are a professional copy editor. Your task is to:
- Fix grammar mistakes and typos
- Improve sentence structure and clarity
- Fix punctuation errors
- Ensure consistent style
- DO NOT change the meaning or add new content
- Preserve the author's voice and style
- Keep all markdown formatting, images, and frontmatter intact`,

  expand: `You are a technical writing assistant. Your task is to:
- Expand on ideas with more detail and examples
- Develop thoughts more thoroughly
- Add explanations where concepts are mentioned but not fully explained
- Include relevant examples and use cases
- Maintain technical accuracy
- Keep the author's original voice and perspective
- Preserve all markdown formatting, images, and frontmatter`,

  complete: `You are an expert blog post editor and technical writer. Your task is to:
- Fix all grammar, spelling, and punctuation errors
- Improve sentence structure and flow
- Expand ideas with more detail and depth
- Develop thoughts more thoroughly with examples
- Add clarity to complex concepts
- Ensure logical progression of ideas
- Maintain technical accuracy
- Preserve the author's voice and style
- Keep all markdown formatting, images, and frontmatter intact
- Make the post more engaging and professional`,

  custom: config.customPrompt || 'Enhance this blog post to make it better.',
};

// ============================================================================
// Agent Tools
// ============================================================================

const tools = {
  readFile: {
    description: 'Read the contents of a markdown file. Returns the full file content including frontmatter.',
    parameters: z.object({
      filePath: z.string().describe('Path to the markdown file to read'),
    }),
    execute: async ({ filePath }) => {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        debug(`Read file: ${filePath} (${content.length} chars)`);
        return { success: true, content, filePath };
      } catch (error) {
        return { success: false, error: error.message, filePath };
      }
    },
  },

  writeFile: {
    description: 'Write enhanced content to a markdown file. The content must include frontmatter (YAML between --- markers) and the markdown body.',
    parameters: z.object({
      filePath: z.string().describe('Path where to write the file'),
      content: z.string().describe('The complete enhanced markdown content including frontmatter'),
      reason: z.string().describe('Brief explanation of what was enhanced'),
    }),
    execute: async ({ filePath, content, reason }) => {
      if (config.dryRun) {
        log(`[DRY RUN] Would write to ${filePath}: ${reason}`);
        return { success: true, dryRun: true, filePath, reason };
      }

      try {
        // Ensure directory exists
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(filePath, content, 'utf8');
        log(`✅ Wrote enhanced file: ${filePath}`);
        debug(`Enhancement reason: ${reason}`);
        return { success: true, filePath, reason };
      } catch (error) {
        return { success: false, error: error.message, filePath };
      }
    },
  },

  listChangedFiles: {
    description: 'List all changed markdown files in src/content/posts/ that need enhancement',
    parameters: z.object({}),
    execute: async () => {
      const files = getFilesToProcess();
      debug('Files to process:', files);
      return {
        success: true,
        files,
        count: files.length,
      };
    },
  },
};

// ============================================================================
// Main Enhancement Function
// ============================================================================

async function enhancePosts() {
  log('='.repeat(70));
  log('Blog Post Enhancement Agent');
  log('='.repeat(70));

  // Display configuration
  log('\nConfiguration:');
  log(`  Model: ${config.model}`);
  log(`  Temperature: ${config.temperature}`);
  log(`  Enhancement Mode: ${config.enhancementMode}`);
  log(`  Max Steps: ${config.maxSteps}`);
  log(`  Max Files: ${config.maxFiles}`);
  log(`  Output Mode: ${config.outputMode}`);
  log(`  Dry Run: ${config.dryRun}`);
  log(`  Debug: ${config.debug}`);
  if (config.filePattern) log(`  File Pattern: ${config.filePattern}`);
  if (config.specificFile) log(`  Specific File: ${config.specificFile}`);
  log('');

  // Check API key
  if (!config.apiKey) {
    console.error('❌ Error: OPENROUTER_API_KEY environment variable is not set');
    process.exit(1);
  }

  // Configure OpenRouter (OpenAI-compatible)
  const model = openai(config.model, {
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: config.apiKey,
  });

  // Get enhancement instructions
  const enhancementInstructions = ENHANCEMENT_PROMPTS[config.enhancementMode] || ENHANCEMENT_PROMPTS.complete;

  // Create the agent prompt
  const agentPrompt = `You are a blog post enhancement agent with access to file reading and writing tools.

Your task:
1. Use the listChangedFiles tool to see which markdown files need enhancement
2. For each file, use readFile to get its content
3. Enhance the content according to these instructions:

${enhancementInstructions}

4. Use writeFile to save the enhanced version with an appropriate filename based on the output mode

Output mode is: ${config.outputMode}
- If "new_file": save as originalname-enhanced.md
- If "overwrite": save with the same filename
- If "commit" or "artifact": save as originalname-enhanced.md for review

IMPORTANT:
- Always preserve the YAML frontmatter exactly as is (between --- markers)
- Keep all image URLs and markdown formatting
- Maintain the document structure
- Focus on improving the content quality while keeping the author's voice

Start by listing the files that need enhancement.`;

  log('Starting agent...\n');

  try {
    const result = await generateText({
      model,
      tools,
      maxSteps: config.maxSteps,
      temperature: config.temperature,
      prompt: agentPrompt,
    });

    log('\n' + '='.repeat(70));
    log('Agent Execution Complete');
    log('='.repeat(70));
    log('\nAgent Response:');
    log(result.text);

    if (config.debug) {
      log('\nTool Calls:');
      log(JSON.stringify(result.steps, null, 2));
    }

    log('\n✅ Enhancement process completed successfully');

    return result;
  } catch (error) {
    console.error('\n❌ Error during enhancement:');
    console.error(error.message);
    if (config.debug) {
      console.error(error);
    }
    process.exit(1);
  }
}

// ============================================================================
// Execute
// ============================================================================

enhancePosts().catch(console.error);
