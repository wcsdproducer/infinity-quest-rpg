import { Bot, Context } from "grammy";
import { execSync, exec } from "child_process";
import * as fs from "fs";
import * as path from "path";
import axios from "axios";
import * as cheerio from "cheerio";
import { createMemoryStore, MemoryStore } from "./memoryStore.js";
import { getAdminFirestore, getAdminStorage } from "./firebaseAdmin.js";
import { genkit, z } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export interface DevBotConfig {
  token: string;
  ownerId: number;
  workspaceRoot: string;        // primary project directory (IQ RPG)
  localRoot?: string;           // full local machine root (Antigravity folder)
  workspaceName: string;
  devPassphrase?: string;       // defaults to "gravity"
  autoLockMinutes?: number;     // defaults to 60
  firebaseProjectId?: string;
}

type BotMode = "ops" | "dev";

interface BotState {
  mode: BotMode;
  lastDevActivity: number;
  autoLockTimer: NodeJS.Timeout | null;
  conversationHistory: Array<{ role: string; content: string; parts?: any[] }>;
}

// ──────────────────────────────────────────────
// Browser Tools Implementation
// ──────────────────────────────────────────────

async function webSearch(query: string): Promise<string> {
  try {
    const resp = await axios.get("https://api.duckduckgo.com/", {
      params: { q: query, format: "json", no_redirect: 1, no_html: 1, skip_disambig: 1 },
      timeout: 8000,
    });
    const data = resp.data;
    const lines: string[] = [];
    if (data.AbstractText) lines.push(`📋 Summary: ${data.AbstractText}`);
    if (data.Answer) lines.push(`✅ Answer: ${data.Answer}`);
    
    const results = (data.RelatedTopics || [])
      .filter((t: any) => t.FirstURL && t.Text)
      .slice(0, 6)
      .map((t: any) => `• ${t.Text}\n  🔗 ${t.FirstURL}`);
    
    if (results.length > 0) lines.push("\nTop results:\n" + results.join("\n\n"));
    
    if (lines.length === 0) {
      return `No instant results found for "${query}". I'll try to refine the search or use a direct URL if you have one.`;
    }
    
    return lines.join("\n");
  } catch (err: any) {
    return `Search failed: ${err.message}`;
  }
}

async function fetchPage(url: string): Promise<string> {
  try {
    const resp = await axios.get(url, {
      timeout: 12000,
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36" },
      maxContentLength: 500_000,
    });
    const $ = cheerio.load(resp.data);
    $("script, style, nav, footer, header, iframe, noscript").remove();
    const title = $("title").text().trim();
    const body = $("body").text().replace(/\s+/g, " ").trim().slice(0, 4000);
    return `📄 **${title}**\n\n${body}\n\n🔗 Source: ${url}`;
  } catch (err: any) {
    return `Failed to fetch ${url}: ${err.message}`;
  }
}

// ──────────────────────────────────────────────
// Genkit instance (lazy — created once per process)
// ──────────────────────────────────────────────

let _ai: ReturnType<typeof genkit> | null = null;
function getAI() {
  if (!_ai) {
    _ai = genkit({
      plugins: [googleAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY })],
      model: "googleai/gemini-2.5-flash",
    });
  }
  return _ai;
}

// Legacy placeholder — no longer used (kept to avoid breaking imports)
const ALL_TOOLS = [
  {
    function_declarations: [
      {
        name: "web_search",
        description: "Search the web for real-time information, news, documentation, or facts.",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string", description: "The search query" }
          },
          required: ["query"]
        }
      },
      {
        name: "fetch_page",
        description: "Extract text content from a specific URL to read documentation or articles.",
        parameters: {
          type: "object",
          properties: {
            url: { type: "string", description: "The full URL to fetch" }
          },
          required: ["url"]
        }
      },
      {
        name: "execute_command",
        description: "Execute a terminal command in the workspace. Use this to run npm, git, tsc, firebase CLI, build scripts, or any shell command. Always use this to actually DO things rather than describing what you would do.",
        parameters: {
          type: "object",
          properties: {
            command: { type: "string", description: "The full shell command to execute (e.g. 'git status', 'npm run build', 'tsc --noEmit')" },
            timeout_ms: { type: "number", description: "Optional timeout in milliseconds. Default 30000. Use 300000 for builds." }
          },
          required: ["command"]
        }
      },
      {
        name: "read_file",
        description: "Read the contents of any file in the workspace.",
        parameters: {
          type: "object",
          properties: {
            path: { type: "string", description: "File path relative to workspace root, or absolute path" }
          },
          required: ["path"]
        }
      },
      {
        name: "write_file",
        description: "Write or overwrite a file in the workspace. Use this to create new files or make code changes.",
        parameters: {
          type: "object",
          properties: {
            path: { type: "string", description: "File path relative to workspace root" },
            content: { type: "string", description: "The full file content to write" }
          },
          required: ["path", "content"]
        }
      },
      {
        name: "list_directory",
        description: "List files and directories in the workspace to understand project structure.",
        parameters: {
          type: "object",
          properties: {
            path: { type: "string", description: "Directory path relative to workspace root. Defaults to root if omitted." }
          },
          required: []
        }
      },
      {
        name: "store_memory",
        description: "Store an important fact, decision, or context to persistent memory for future recall.",
        parameters: {
          type: "object",
          properties: {
            content: { type: "string", description: "The fact or context to remember" },
            category: { type: "string", description: "Category: game-design, tech, assets, tasks, preferences, deploy" }
          },
          required: ["content"]
        }
      },
      {
        name: "recall_memory",
        description: "Search persistent memory for relevant context before starting a task.",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string", description: "What to search for in memory" }
          },
          required: ["query"]
        }
      },
      {
        name: "patch_file",
        description: "Make a surgical edit to an existing file by replacing an exact string with new content. Use this instead of write_file when modifying specific parts of a large file. The search string must match exactly (including whitespace and indentation).",
        parameters: {
          type: "object",
          properties: {
            path: { type: "string", description: "File path relative to workspace root" },
            search: { type: "string", description: "The exact string to find in the file" },
            replace: { type: "string", description: "The replacement string" }
          },
          required: ["path", "search", "replace"]
        }
      },
      {
        name: "git_status",
        description: "Show current git status — modified files, staged files, untracked files, and current branch. Always run this before committing.",
        parameters: { type: "object", properties: {}, required: [] }
      },
      {
        name: "git_diff",
        description: "Show git diff of changes in the workspace. Use to review what has changed before committing.",
        parameters: {
          type: "object",
          properties: {
            file: { type: "string", description: "Optional: specific file path to diff. If omitted, diffs all changed files." },
            staged: { type: "boolean", description: "If true, show staged (--cached) diff. Default false." }
          },
          required: []
        }
      },
      {
        name: "git_log",
        description: "Show recent git commit history.",
        parameters: {
          type: "object",
          properties: {
            count: { type: "number", description: "Number of commits to show. Default 10." }
          },
          required: []
        }
      },
      {
        name: "git_commit",
        description: "Stage all changes (git add -A) and create a git commit with the given message. Always run git_status first to confirm what will be committed.",
        parameters: {
          type: "object",
          properties: {
            message: { type: "string", description: "The commit message. Use conventional commits format: feat:, fix:, chore:, docs:, refactor:" },
            files: { type: "string", description: "Optional: specific files to stage. If omitted, stages all changed files (git add -A)." }
          },
          required: ["message"]
        }
      },
      {
        name: "git_push",
        description: "Push committed changes to the remote GitHub repository (origin/main). This triggers a Firebase App Hosting deployment automatically.",
        parameters: {
          type: "object",
          properties: {
            branch: { type: "string", description: "Branch to push to. Default: main." }
          },
          required: []
        }
      },
      {
        name: "git_pull",
        description: "Pull latest changes from the remote GitHub repository.",
        parameters: { type: "object", properties: {}, required: [] }
      },
      {
        name: "git_branch",
        description: "List branches, create a new branch, or switch to an existing branch.",
        parameters: {
          type: "object",
          properties: {
            action: { type: "string", description: "'list', 'create', or 'checkout'" },
            name: { type: "string", description: "Branch name (required for create/checkout)" }
          },
          required: ["action"]
        }
      },
      {
        name: "firestore_query",
        description: "Query or read documents from any Firestore collection in the infinity-quest-rpg project. Admin access — no security rules applied. Use to read player data, games, campaigns, quests, locations, etc.",
        parameters: {
          type: "object",
          properties: {
            collection: { type: "string", description: "Collection path, e.g. 'players', 'games', 'campaigns/apof/locations'" },
            document_id: { type: "string", description: "Optional: specific document ID to read. If omitted, lists the first 20 documents." },
            where_field: { type: "string", description: "Optional: field name to filter by" },
            where_op: { type: "string", description: "Optional: comparison operator: ==, !=, <, <=, >, >=, in, array-contains" },
            where_value: { type: "string", description: "Optional: value to compare against (will be coerced from string)" },
            limit: { type: "number", description: "Max documents to return. Default 20." }
          },
          required: ["collection"]
        }
      },
      {
        name: "firestore_write",
        description: "Write or update a document in Firestore. Admin access. Use to update game state, player data, campaign data, etc.",
        parameters: {
          type: "object",
          properties: {
            collection: { type: "string", description: "Collection path" },
            document_id: { type: "string", description: "Document ID. If omitted, auto-generates a new ID." },
            data: { type: "string", description: "JSON string of the data to write/merge" },
            merge: { type: "boolean", description: "If true, merges with existing document instead of overwriting. Default true." }
          },
          required: ["collection", "data"]
        }
      },
      {
        name: "firestore_delete",
        description: "Delete a specific document from Firestore. Admin access.",
        parameters: {
          type: "object",
          properties: {
            collection: { type: "string", description: "Collection path" },
            document_id: { type: "string", description: "Document ID to delete" }
          },
          required: ["collection", "document_id"]
        }
      },
      {
        name: "storage_list",
        description: "List files in Firebase Storage bucket (infinity-quest-rpg.firebasestorage.app). Admin access.",
        parameters: {
          type: "object",
          properties: {
            prefix: { type: "string", description: "Folder prefix to list, e.g. 'locations/' or 'media/'" }
          },
          required: []
        }
      },
      {
        name: "generate_content",
        description: "Use Gemini 2.5 Flash to generate any text content: game narratives, NPC dialogue, quest descriptions, code, JSON data structures, etc.",
        parameters: {
          type: "object",
          properties: {
            prompt: { type: "string", description: "The generation prompt" },
            system: { type: "string", description: "Optional system instruction to guide the output style" }
          },
          required: ["prompt"]
        }
      }
    ]
  }
];

// ──────────────────────────────────────────────
// Whitelisted commands
// ──────────────────────────────────────────────

const WHITELISTED_COMMANDS = [
  "npm", "npx", "node", "tsx",
  "git", "tsc",
  "cat", "ls", "find", "grep", "head", "tail", "wc",
  "echo", "pwd",
  "firebase",
  "pm2",
];

function safeExec(cmd: string, cwd: string): string {
  const parts = cmd.split(" ");
  const base = parts[0];
  if (!WHITELISTED_COMMANDS.includes(base)) {
    throw new Error(`Command not allowed: ${base}`);
  }
  return execSync(cmd, { cwd }).toString();
}

// ──────────────────────────────────────────────
// Safe Reply — tries Markdown, falls back to plain text
// ──────────────────────────────────────────────

async function safeReply(ctx: Context, text: string): Promise<void> {
  const chunks = splitMessage(text, 4000);
  for (const chunk of chunks) {
    try {
      await ctx.reply(chunk, { parse_mode: "Markdown" });
    } catch (err: any) {
      const is400 = err?.error_code === 400 || err?.message?.includes("400");
      if (is400) {
        // Strip markdown formatting and retry as plain text
        const plain = chunk
          .replace(/```[\s\S]*?```/g, (m) => m.replace(/```\w*\n?|```/g, ""))
          .replace(/`([^`]+)`/g, "$1")
          .replace(/\*\*([^*]+)\*\*/g, "$1")
          .replace(/\*([^*]+)\*/g, "$1")
          .replace(/__([^_]+)__/g, "$1")
          .replace(/_([^_]+)_/g, "$1")
          .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
        await ctx.reply(plain);
      } else {
        throw err;
      }
    }
  }
}

function splitMessage(text: string, maxLen: number): string[] {
  if (text.length <= maxLen) return [text];
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + maxLen));
    i += maxLen;
  }
  return chunks;
}

// ──────────────────────────────────────────────
// Main Framework
// ──────────────────────────────────────────────

export async function createDevBot(config: DevBotConfig) {
  const bot = new Bot(config.token);
  const memory = createMemoryStore(config.workspaceRoot);
  // Check for both possible env var names
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;

  if (!apiKey) {
    console.error(`[${config.workspaceName}] ❌ Missing GEMINI_API_KEY or GOOGLE_GENAI_API_KEY`);
  }

  const state: BotState = {
    mode: "ops",
    lastDevActivity: Date.now(),
    autoLockTimer: null,
    conversationHistory: memory.loadHistory("owner"),  // ← restore from SQLite on startup
  };

  const autoLockMs = (config.autoLockMinutes || 60) * 60 * 1000;
  const soulPath = path.join(config.workspaceRoot, "soul.md");
  let soulPrompt = `You are the ${config.workspaceName} Dev Bot. You help John Freeman manage this workspace.`;
  
  if (fs.existsSync(soulPath)) {
    try {
      soulPrompt = fs.readFileSync(soulPath, "utf-8");
    } catch (err) {
      console.error(`[${config.workspaceName}] ❌ Failed to read soul.md:`, err);
    }
  }

  // ── Helper: reset auto-lock ──
  function resetAutoLock() {
    if (state.autoLockTimer) clearTimeout(state.autoLockTimer);
    state.autoLockTimer = setTimeout(() => {
      state.mode = "ops";
      console.log(`🔒 Auto-locked ${config.workspaceName} due to inactivity`);
    }, autoLockMs);
  }

  // ── /start ──
  bot.command("start", async (ctx) => {
    await ctx.reply(`👋 *${config.workspaceName} Dev Bot* active.\nMode: \`${state.mode}\`\n\nUse \`/dev <passphrase>\` to enable dev tools.`, { parse_mode: "Markdown" });
  });

  // ── /dev <passphrase> ──
  bot.command("dev", async (ctx) => {
    const pass = ctx.match?.trim();
    const target = config.devPassphrase || "gravity";
    
    if (pass === target) {
      state.mode = "dev";
      resetAutoLock();
      await ctx.reply("🔓 *Dev mode enabled.* You now have full file system access and terminal commands.", { parse_mode: "Markdown" });
    } else {
      await ctx.reply("❌ Incorrect passphrase.");
    }
  });

  // ── /ops ──
  bot.command("ops", async (ctx) => {
    state.mode = "ops";
    if (state.autoLockTimer) clearTimeout(state.autoLockTimer);
    await ctx.reply("🔒 *Dev mode disabled.* Returned to ops mode.", { parse_mode: "Markdown" });
  });

  // ── /mode ──
  bot.command("mode", async (ctx) => {
    await ctx.reply(`Current mode: \`${state.mode}\``, { parse_mode: "Markdown" });
  });

  // ── /run <cmd> ──
  bot.command("run", async (ctx) => {
    if (state.mode !== "dev") {
      await ctx.reply("🔒 Please enter dev mode first: `/dev <passphrase>`", { parse_mode: "Markdown" });
      return;
    }
    const cmd = ctx.match?.trim();
    if (!cmd) return;

    resetAutoLock();
    await ctx.replyWithChatAction("typing");
    try {
      const output = safeExec(cmd, config.workspaceRoot);
      await safeReply(ctx, `\`\`\`\n${output.slice(0, 4000)}\n\`\`\``);
    } catch (err: any) {
      await ctx.reply(`❌ Error: ${err.message}`);
    }
  });

  // ── /read <file> ──
  bot.command("read", async (ctx) => {
    const filePath = ctx.match?.trim();
    if (!filePath) return;

    const fullPath = path.resolve(config.workspaceRoot, filePath);
    if (!fullPath.startsWith(path.resolve(config.workspaceRoot))) {
      await ctx.reply("❌ Access denied: Path outside workspace.");
      return;
    }

    try {
      const content = fs.readFileSync(fullPath, "utf-8");
      await safeReply(ctx, `📄 *${filePath}*\n\n\`\`\`\n${content.slice(0, 4000)}\n\`\`\``);
    } catch (err: any) {
      await ctx.reply(`❌ Error: ${err.message}`);
    }
  });

  // ── /build ──
  bot.command("build", async (ctx) => {
    if (state.mode !== "dev") {
      await ctx.reply("🔒 Please enter dev mode first.");
      return;
    }
    resetAutoLock();
    await ctx.reply("🏗️ Building... I'll let you know when it's done.");
    await ctx.replyWithChatAction("typing");
    exec("npm run build", { cwd: config.workspaceRoot }, (err, stdout, stderr) => {
      if (err) {
        ctx.reply(`❌ Build failed:\n\`\`\`\n${stderr.slice(0, 1000)}\n\`\`\``, { parse_mode: "Markdown" });
      } else {
        ctx.reply("✅ Build completed successfully.");
      }
    });
  });

  // ── /git <args> ──
  bot.command("git", async (ctx) => {
    if (state.mode !== "dev") {
      await ctx.reply("🔒 Please enter dev mode first.");
      return;
    }
    const args = ctx.match?.trim();
    if (!args) return;

    resetAutoLock();
    try {
      const output = safeExec(`git ${args}`, config.workspaceRoot);
      await ctx.reply(`\`\`\`\n${output.slice(0, 4000)}\n\`\`\``, { parse_mode: "Markdown" });
    } catch (err: any) {
      await ctx.reply(`❌ Git error: ${err.message}`);
    }
  });

  // ── /remember <text> ──
  bot.command("remember", async (ctx) => {
    const content = ctx.match?.trim();
    if (!content) return;
    
    let category = "general";
    if (content.toLowerCase().includes("note:")) category = "note";
    if (content.toLowerCase().includes("todo:")) category = "todo";
    if (content.toLowerCase().includes("fix:")) category = "bug";

    const id = memory.store(content, category);
    await ctx.reply(`🧠 Remembered (ID: ${id}, category: ${category}):\n"${content}"`);
  });

  // ── /recall <query> ──
  bot.command("recall", async (ctx) => {
    const query = ctx.match?.trim();
    if (!query) {
      await ctx.reply("Usage: `/recall <search query>`", { parse_mode: "Markdown" });
      return;
    }

    const results = await memory.search(query);
    if (results.length === 0) {
      await ctx.reply("No matching memories found.");
      return;
    }

    const formatted = results
      .map(r => `#${r.id} [${r.category}] ${r.content}`)
      .join("\n\n");
    await safeReply(ctx, `🧠 Found ${results.length} memories:\n\n${formatted.slice(0, 4000)}`);
  });

  // ── Main Chat Handler ──
  bot.on("message:text", async (ctx) => {
    console.log(`📩 [${config.workspaceName}] Message from ${ctx.from?.id} (owner: ${config.ownerId}): "${ctx.message.text.slice(0, 50)}"`);
    if (ctx.from?.id !== config.ownerId) return;

    const text = ctx.message.text;
    if (text.startsWith("/")) return; // handle commands separately

    // Load devlog for live project context
    const devlogPath = path.join(config.workspaceRoot, "devlog.md");
    let devlogContext = "";
    try {
      devlogContext = fs.readFileSync(devlogPath, "utf-8");
    } catch { /* devlog is optional */ }

    // Semantic memory search for this message
    const relevantMemories = (await memory.search(text)).slice(0, 5);
    const memoryContext = relevantMemories.length > 0
      ? `\n\n## Relevant Memories\n` + relevantMemories.map(m => `- [#${m.id}] ${m.content}`).join("\n")
      : "";

    // Git status for quick orientation
    let statusContext = "";
    try {
      const branch = execSync("git branch --show-current", { cwd: config.workspaceRoot }).toString().trim();
      statusContext = `\nGit branch: ${branch} | Mode: ${state.mode}`;
    } catch { /* ignore */ }

    // Add user message to history
    state.conversationHistory.push({ role: "user", content: text, parts: [{ text }] });
    if (state.conversationHistory.length > 20) {
      state.conversationHistory = state.conversationHistory.slice(-20);
    }

    const localRoot = config.localRoot || "/Volumes/SAMSUNG 500gb/Antigravity";
    const systemInstruction = soulPrompt +
      `\n\n---\n## Current Context` +
      `\nWorkspace: ${config.workspaceRoot}` +
      `\nLocal Root (full machine access): ${localRoot}` +
      statusContext +
      (devlogContext ? `\n\n## Dev Log\n${devlogContext}` : "") +
      memoryContext +
      `\n\n---\n## Execution Rules\n` +
      `1. USE TOOLS IMMEDIATELY — never describe what you will do, just do it.\n` +
      `2. Natural language = tool calls: "check git status" → execute_command("git status")\n` +
      `3. Chain tools in sequence for multi-step tasks.\n` +
      `4. After completing, report actual output — not intentions.\n` +
      `5. Store key decisions/facts to memory via store_memory.`;

    try {
      await ctx.replyWithChatAction("typing");

      const ai = getAI();

      // ── Define all tools inline so Genkit enforces execution ──
      const toolWebSearch = ai.defineTool(
        { name: "web_search", description: "Search the web for real-time info.", inputSchema: z.object({ query: z.string() }), outputSchema: z.string() },
        async ({ query }) => webSearch(query)
      );
      const toolFetchPage = ai.defineTool(
        { name: "fetch_page", description: "Fetch and extract text from a URL.", inputSchema: z.object({ url: z.string() }), outputSchema: z.string() },
        async ({ url }) => fetchPage(url)
      );
      const toolExecCmd = ai.defineTool(
        { name: "execute_command", description: "Run a terminal command in the workspace. Use for npm, git, tsc, firebase, ls, cat, etc. ALWAYS use this to actually DO things.", inputSchema: z.object({ command: z.string(), timeout_ms: z.number().optional() }), outputSchema: z.string() },
        async ({ command, timeout_ms }) => {
          console.log(`💻 [${config.workspaceName}] Exec: ${command}`);
          try {
            return execSync(command, { cwd: config.workspaceRoot, timeout: timeout_ms || 60000, encoding: "utf-8", env: { ...process.env } }).slice(0, 6000) || "(no output)";
          } catch (e: any) { return `ERROR: ${e.stderr?.slice(0, 2000) || e.message}`; }
        }
      );
      const toolReadFile = ai.defineTool(
        { name: "read_file", description: "Read contents of any workspace file.", inputSchema: z.object({ path: z.string() }), outputSchema: z.string() },
        async ({ path: p }) => {
          const full = p.startsWith("/") ? p : path.join(config.workspaceRoot, p);
          try { return fs.readFileSync(full, "utf-8").slice(0, 8000); }
          catch (e: any) { return `ERROR: ${e.message}`; }
        }
      );
      const toolWriteFile = ai.defineTool(
        { name: "write_file", description: "Write or overwrite a file in the workspace.", inputSchema: z.object({ path: z.string(), content: z.string() }), outputSchema: z.string() },
        async ({ path: p, content }) => {
          const full = p.startsWith("/") ? p : path.join(config.workspaceRoot, p);
          try { fs.mkdirSync(path.dirname(full), { recursive: true }); fs.writeFileSync(full, content, "utf-8"); return `✅ Written: ${p} (${content.length} chars)`; }
          catch (e: any) { return `ERROR: ${e.message}`; }
        }
      );
      const toolListDir = ai.defineTool(
        { name: "list_directory", description: "List files in workspace directory.", inputSchema: z.object({ path: z.string().optional() }), outputSchema: z.string() },
        async ({ path: p }) => {
          const dir = p ? path.join(config.workspaceRoot, p) : config.workspaceRoot;
          try { return fs.readdirSync(dir, { withFileTypes: true }).map(e => `${e.isDirectory() ? "📁" : "📄"} ${e.name}`).join("\n"); }
          catch (e: any) { return `ERROR: ${e.message}`; }
        }
      );
      const toolPatchFile = ai.defineTool(
        { name: "patch_file", description: "Surgically replace an exact string in a file. Read the file first to confirm exact text.", inputSchema: z.object({ path: z.string(), search: z.string(), replace: z.string() }), outputSchema: z.string() },
        async ({ path: p, search, replace }) => {
          const full = p.startsWith("/") ? p : path.join(config.workspaceRoot, p);
          try {
            const orig = fs.readFileSync(full, "utf-8");
            if (!orig.includes(search)) return `ERROR: Search string not found in ${p}. Read the file first.`;
            fs.writeFileSync(full, orig.replace(search, replace), "utf-8");
            return `✅ Patched ${p}`;
          } catch (e: any) { return `ERROR: ${e.message}`; }
        }
      );
      const toolStoreMemory = ai.defineTool(
        { name: "store_memory", description: "Store an important fact to persistent memory.", inputSchema: z.object({ content: z.string(), category: z.string().optional() }), outputSchema: z.string() },
        async ({ content, category }) => { const id = memory.store(content, category || "general"); return `Memory stored ID ${id}.`; }
      );
      const toolRecallMemory = ai.defineTool(
        { name: "recall_memory", description: "Search persistent memory for relevant context.", inputSchema: z.object({ query: z.string() }), outputSchema: z.string() },
        async ({ query }) => {
          const mems = await memory.search(query);
          return mems.length === 0 ? "No memories found." : mems.map(m => `[${m.category}] ${m.content}`).join("\n---\n");
        }
      );
      const toolGitStatus = ai.defineTool(
        { name: "git_status", description: "Show git status and current branch.", inputSchema: z.object({}), outputSchema: z.string() },
        async () => {
          try {
            const branch = execSync("git branch --show-current", { cwd: config.workspaceRoot, encoding: "utf-8" }).trim();
            const status = execSync("git status", { cwd: config.workspaceRoot, encoding: "utf-8" });
            return `Branch: ${branch}\n${status}`;
          } catch (e: any) { return `ERROR: ${e.message}`; }
        }
      );
      const toolGitDiff = ai.defineTool(
        { name: "git_diff", description: "Show git diff of workspace changes.", inputSchema: z.object({ file: z.string().optional(), staged: z.boolean().optional() }), outputSchema: z.string() },
        async ({ file, staged }) => {
          try {
            const cmd = `git diff ${staged ? "--cached" : ""} ${file ? `-- "${file}"` : ""}`.trim();
            return execSync(cmd, { cwd: config.workspaceRoot, encoding: "utf-8", maxBuffer: 1024 * 1024 }).slice(0, 6000) || "(no diff)";
          } catch (e: any) { return `ERROR: ${e.message}`; }
        }
      );
      const toolGitLog = ai.defineTool(
        { name: "git_log", description: "Show recent git commit history.", inputSchema: z.object({ count: z.number().optional() }), outputSchema: z.string() },
        async ({ count }) => {
          try { return execSync(`git log --oneline -${count || 10}`, { cwd: config.workspaceRoot, encoding: "utf-8" }); }
          catch (e: any) { return `ERROR: ${e.message}`; }
        }
      );
      const toolGitCommit = ai.defineTool(
        { name: "git_commit", description: "Stage and commit changes. Use conventional commits: feat:, fix:, chore:.", inputSchema: z.object({ message: z.string(), files: z.string().optional() }), outputSchema: z.string() },
        async ({ message, files }) => {
          try {
            execSync(files ? `git add ${files}` : "git add -A", { cwd: config.workspaceRoot, encoding: "utf-8" });
            return execSync(`git commit -m "${message.replace(/"/g, "'")}"`, { cwd: config.workspaceRoot, encoding: "utf-8" });
          } catch (e: any) { return `ERROR: ${e.stderr || e.message}`; }
        }
      );
      const toolGitPush = ai.defineTool(
        { name: "git_push", description: "Push to GitHub. Triggers Firebase App Hosting deploy.", inputSchema: z.object({ branch: z.string().optional() }), outputSchema: z.string() },
        async ({ branch }) => {
          try { return execSync(`git push origin ${branch || "main"}`, { cwd: config.workspaceRoot, encoding: "utf-8", timeout: 60000 }) + "\n🚀 Firebase deploy triggered."; }
          catch (e: any) { return `ERROR: ${e.stderr || e.message}`; }
        }
      );
      const toolGitPull = ai.defineTool(
        { name: "git_pull", description: "Pull latest changes from remote.", inputSchema: z.object({}), outputSchema: z.string() },
        async () => { try { return execSync("git pull", { cwd: config.workspaceRoot, encoding: "utf-8", timeout: 30000 }); } catch (e: any) { return `ERROR: ${e.message}`; } }
      );
      const toolGitBranch = ai.defineTool(
        { name: "git_branch", description: "List, create, or checkout git branches.", inputSchema: z.object({ action: z.enum(["list", "create", "checkout"]), name: z.string().optional() }), outputSchema: z.string() },
        async ({ action, name }) => {
          try {
            if (action === "list") return execSync("git branch -a", { cwd: config.workspaceRoot, encoding: "utf-8" });
            if (action === "create") return execSync(`git checkout -b ${name}`, { cwd: config.workspaceRoot, encoding: "utf-8" });
            if (action === "checkout") return execSync(`git checkout ${name}`, { cwd: config.workspaceRoot, encoding: "utf-8" });
            return "Unknown action";
          } catch (e: any) { return `ERROR: ${e.message}`; }
        }
      );
      const toolFirestoreQuery = ai.defineTool(
        { name: "firestore_query", description: "Query Firestore. Admin access, no security rules.", inputSchema: z.object({ collection: z.string(), document_id: z.string().optional(), where_field: z.string().optional(), where_op: z.string().optional(), where_value: z.string().optional(), limit: z.number().optional() }), outputSchema: z.string() },
        async ({ collection, document_id, where_field, where_op, where_value, limit }) => {
          try {
            const db = getAdminFirestore();
            if (document_id) {
              const doc = await db.collection(collection).doc(document_id).get();
              return doc.exists ? JSON.stringify({ id: doc.id, ...doc.data() }, null, 2) : `Not found: ${document_id}`;
            }
            let q: FirebaseFirestore.Query = db.collection(collection);
            if (where_field && where_op && where_value !== undefined) q = q.where(where_field, where_op as any, where_value);
            const snap = await q.limit(limit || 20).get();
            return snap.empty ? "No documents." : JSON.stringify(snap.docs.map(d => ({ id: d.id, ...d.data() })), null, 2).slice(0, 6000);
          } catch (e: any) { return `Firestore error: ${e.message}`; }
        }
      );
      const toolFirestoreWrite = ai.defineTool(
        { name: "firestore_write", description: "Write/update a Firestore document. Admin access.", inputSchema: z.object({ collection: z.string(), document_id: z.string().optional(), data: z.string(), merge: z.boolean().optional() }), outputSchema: z.string() },
        async ({ collection, document_id, data, merge }) => {
          try {
            const db = getAdminFirestore();
            const ref = document_id ? db.collection(collection).doc(document_id) : db.collection(collection).doc();
            await ref.set(JSON.parse(data), { merge: merge !== false });
            return `✅ Written to ${collection}/${ref.id}`;
          } catch (e: any) { return `Firestore error: ${e.message}`; }
        }
      );
      const toolFirestoreDelete = ai.defineTool(
        { name: "firestore_delete", description: "Delete a Firestore document. Admin access.", inputSchema: z.object({ collection: z.string(), document_id: z.string() }), outputSchema: z.string() },
        async ({ collection, document_id }) => {
          try { await getAdminFirestore().collection(collection).doc(document_id).delete(); return `✅ Deleted ${collection}/${document_id}`; }
          catch (e: any) { return `Firestore error: ${e.message}`; }
        }
      );
      const toolStorageList = ai.defineTool(
        { name: "storage_list", description: "List files in Firebase Storage.", inputSchema: z.object({ prefix: z.string().optional() }), outputSchema: z.string() },
        async ({ prefix }) => {
          try {
            const [files] = await getAdminStorage().bucket("infinity-quest-rpg.firebasestorage.app").getFiles({ prefix: prefix || "", maxResults: 50 });
            return files.length === 0 ? "No files." : files.map(f => `📎 ${f.name}`).join("\n");
          } catch (e: any) { return `Storage error: ${e.message}`; }
        }
      );

      const allGenkitTools = [
        toolWebSearch, toolFetchPage, toolExecCmd, toolReadFile, toolWriteFile,
        toolListDir, toolPatchFile, toolStoreMemory, toolRecallMemory,
        toolGitStatus, toolGitDiff, toolGitLog, toolGitCommit, toolGitPush, toolGitPull, toolGitBranch,
        toolFirestoreQuery, toolFirestoreWrite, toolFirestoreDelete, toolStorageList,
      ];

      // Build message history for Genkit (only user/model roles)
      const history = state.conversationHistory
        .filter(m => m.role === "user" || m.role === "model")
        .slice(-20)
        .map(m => ({ role: m.role as "user" | "model", content: [{ text: m.content || "" }] }));

      const response = await ai.generate({
        model: "googleai/gemini-2.5-flash",
        system: systemInstruction,
        messages: history,
        prompt: text,
        tools: allGenkitTools,
        config: { maxOutputTokens: 8192, temperature: 0.7 },
        maxTurns: 50,
      });

      const finalText = response.text;

      // Persist to conversation history
      state.conversationHistory.push({ role: "user", content: text, parts: [{ text }] });
      state.conversationHistory.push({ role: "model", content: finalText, parts: [{ text: finalText }] });
      if (state.conversationHistory.length > 30) state.conversationHistory = state.conversationHistory.slice(-30);
      memory.saveHistory("owner", state.conversationHistory);

      await safeReply(ctx, finalText || "✅ Done.");

      // Legacy while-loop kept as unreachable placeholder so old dispatch code compiles
      const _UNUSED_maxTurns = 20;
      let _UNUSED_turnCount = 0;
      if (false) { while (_UNUSED_turnCount < _UNUSED_maxTurns) {
        _UNUSED_turnCount++;

        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            system_instruction: { parts: [{ text: systemInstruction }] },
            contents: state.conversationHistory.map(m => ({ 
              role: (m.role === "function") ? "function" : (m.role === "user" ? "user" : "model"), 
              parts: m.parts 
            })),
            tools: ALL_TOOLS,
            generationConfig: { maxOutputTokens: 8192, temperature: 0.7 },
          },
          { headers: { "Content-Type": "application/json" } }
        );

        const candidate = response.data.candidates?.[0];
        if (!candidate) throw new Error("No candidate in Gemini response");

        const messagePart = candidate.content.parts?.[0];
        
        // Handle normal text response
        if (messagePart.text) {
          state.conversationHistory.push({ role: "model", content: messagePart.text, parts: [messagePart] });
          // Trim history before saving to avoid bloat (keep last 30 turns)
          if (state.conversationHistory.length > 30) {
            state.conversationHistory = state.conversationHistory.slice(-30);
          }
          memory.saveHistory("owner", state.conversationHistory);  // ← persist to SQLite
          await safeReply(ctx, messagePart.text);
          return;
        }

        // Handle tool calls
        if (messagePart.functionCall) {
          const call = messagePart.functionCall;
          console.log(`🤖 [${config.workspaceName}] Tool Call: ${call.name}`, call.args);
          await ctx.replyWithChatAction("typing");

          let result = "";

          if (call.name === "web_search") {
            result = await webSearch(call.args.query);

          } else if (call.name === "fetch_page") {
            result = await fetchPage(call.args.url);

          } else if (call.name === "execute_command") {
            const cmd = call.args.command as string;
            const timeoutMs = (call.args.timeout_ms as number) || 30000;
            console.log(`💻 [${config.workspaceName}] Executing: ${cmd}`);
            try {
              const output = execSync(cmd, {
                cwd: config.workspaceRoot,
                timeout: timeoutMs,
                encoding: "utf-8",
                env: { ...process.env },
              });
              result = output.slice(0, 6000) || "(command completed with no output)";
            } catch (execErr: any) {
              result = `ERROR: ${execErr.stderr?.slice(0, 2000) || execErr.message}`;
            }

          } else if (call.name === "read_file") {
            const filePath = call.args.path as string;
            const fullPath = filePath.startsWith("/")
              ? filePath
              : path.join(config.workspaceRoot, filePath);
            try {
              result = fs.readFileSync(fullPath, "utf-8").slice(0, 8000);
            } catch (readErr: any) {
              result = `ERROR reading file: ${readErr.message}`;
            }

          } else if (call.name === "write_file") {
            const filePath = call.args.path as string;
            const content = call.args.content as string;
            const fullPath = filePath.startsWith("/")
              ? filePath
              : path.join(config.workspaceRoot, filePath);
            try {
              fs.mkdirSync(path.dirname(fullPath), { recursive: true });
              fs.writeFileSync(fullPath, content, "utf-8");
              result = `✅ Written: ${filePath} (${content.length} chars)`;
            } catch (writeErr: any) {
              result = `ERROR writing file: ${writeErr.message}`;
            }

          } else if (call.name === "list_directory") {
            const dirPath = call.args.path
              ? path.join(config.workspaceRoot, call.args.path as string)
              : config.workspaceRoot;
            try {
              const entries = fs.readdirSync(dirPath, { withFileTypes: true });
              result = entries
                .map((e) => `${e.isDirectory() ? "📁" : "📄"} ${e.name}`)
                .join("\n");
            } catch (lsErr: any) {
              result = `ERROR listing directory: ${lsErr.message}`;
            }

          } else if (call.name === "store_memory") {
            const id = memory.store(call.args.content as string, call.args.category as string || "general");
            result = `Memory stored with ID ${id}.`;

          } else if (call.name === "recall_memory") {
            const memories = await memory.search(call.args.query as string);
            if (memories.length === 0) {
              result = "No matching memories found.";
            } else {
              result = memories
                .map((m) => `[${m.category}] ${m.content}`)
                .join("\n---\n");
            }

          } else if (call.name === "git_status") {
            try {
              const status = execSync("git status", { cwd: config.workspaceRoot, encoding: "utf-8" });
              const branch = execSync("git branch --show-current", { cwd: config.workspaceRoot, encoding: "utf-8" }).trim();
              result = `Branch: ${branch}\n\n${status}`;
            } catch (e: any) { result = `git error: ${e.message}`; }

          } else if (call.name === "git_diff") {
            try {
              const stagedFlag = call.args.staged ? "--cached" : "";
              const fileArg = call.args.file ? `-- "${call.args.file}"` : "";
              const diff = execSync(`git diff ${stagedFlag} ${fileArg}`.trim(), {
                cwd: config.workspaceRoot, encoding: "utf-8", maxBuffer: 1024 * 1024
              });
              result = diff.slice(0, 6000) || "(no diff — no changes detected)";
            } catch (e: any) { result = `git diff error: ${e.message}`; }

          } else if (call.name === "git_log") {
            try {
              const count = call.args.count || 10;
              result = execSync(`git log --oneline -${count}`, { cwd: config.workspaceRoot, encoding: "utf-8" });
            } catch (e: any) { result = `git log error: ${e.message}`; }

          } else if (call.name === "git_commit") {
            try {
              const addCmd = call.args.files ? `git add ${call.args.files}` : "git add -A";
              execSync(addCmd, { cwd: config.workspaceRoot, encoding: "utf-8" });
              const msg = call.args.message.replace(/"/g, "'");
              const commitOut = execSync(`git commit -m "${msg}"`, { cwd: config.workspaceRoot, encoding: "utf-8" });
              result = `✅ Committed:\n${commitOut}`;
            } catch (e: any) { result = `git commit error: ${e.stderr || e.message}`; }

          } else if (call.name === "git_push") {
            try {
              const branch = call.args.branch || "main";
              const pushOut = execSync(`git push origin ${branch}`, { cwd: config.workspaceRoot, encoding: "utf-8", timeout: 60000 });
              result = `✅ Pushed to origin/${branch}:\n${pushOut}\n\n🚀 Firebase App Hosting deployment triggered automatically.`;
            } catch (e: any) { result = `git push error: ${e.stderr || e.message}`; }

          } else if (call.name === "git_pull") {
            try {
              result = execSync("git pull", { cwd: config.workspaceRoot, encoding: "utf-8", timeout: 30000 });
            } catch (e: any) { result = `git pull error: ${e.stderr || e.message}`; }

          } else if (call.name === "git_branch") {
            try {
              if (call.args.action === "list") {
                result = execSync("git branch -a", { cwd: config.workspaceRoot, encoding: "utf-8" });
              } else if (call.args.action === "create") {
                result = execSync(`git checkout -b ${call.args.name}`, { cwd: config.workspaceRoot, encoding: "utf-8" });
              } else if (call.args.action === "checkout") {
                result = execSync(`git checkout ${call.args.name}`, { cwd: config.workspaceRoot, encoding: "utf-8" });
              } else {
                result = `Unknown action: ${call.args.action}. Use 'list', 'create', or 'checkout'.`;
              }
            } catch (e: any) { result = `git branch error: ${e.stderr || e.message}`; }

          } else if (call.name === "patch_file") {
            const filePath = call.args.path as string;
            const search = call.args.search as string;
            const replace = call.args.replace as string;
            const fullPath = filePath.startsWith("/")
              ? filePath
              : path.join(config.workspaceRoot, filePath);
            try {
              const original = fs.readFileSync(fullPath, "utf-8");
              if (!original.includes(search)) {
                result = `ERROR: Search string not found in ${filePath}. The text must match exactly including whitespace. Read the file first to confirm the exact text.`;
              } else {
                const patched = original.replace(search, replace);
                fs.writeFileSync(fullPath, patched, "utf-8");
                result = `✅ Patched ${filePath}: replaced ${search.length} chars with ${replace.length} chars.`;
              }
            } catch (patchErr: any) {
              result = `ERROR patching file: ${patchErr.message}`;
            }

          } else if (call.name === "firestore_query") {
            try {
              const db = getAdminFirestore();
              if (call.args.document_id) {
                const doc = await db.collection(call.args.collection).doc(call.args.document_id).get();
                result = doc.exists ? JSON.stringify({ id: doc.id, ...doc.data() }, null, 2) : `Document not found: ${call.args.document_id}`;
              } else {
                let query: FirebaseFirestore.Query = db.collection(call.args.collection);
                if (call.args.where_field && call.args.where_op && call.args.where_value !== undefined) {
                  query = query.where(call.args.where_field, call.args.where_op as FirebaseFirestore.WhereFilterOp, call.args.where_value);
                }
                const snapshot = await query.limit(call.args.limit || 20).get();
                if (snapshot.empty) {
                  result = "No documents found.";
                } else {
                  const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                  result = JSON.stringify(docs, null, 2).slice(0, 6000);
                }
              }
            } catch (fsErr: any) {
              result = `Firestore error: ${fsErr.message}`;
            }

          } else if (call.name === "firestore_write") {
            try {
              const db = getAdminFirestore();
              const data = JSON.parse(call.args.data);
              const merge = call.args.merge !== false;
              let ref: FirebaseFirestore.DocumentReference;
              if (call.args.document_id) {
                ref = db.collection(call.args.collection).doc(call.args.document_id);
              } else {
                ref = db.collection(call.args.collection).doc();
              }
              await ref.set(data, { merge });
              result = `✅ Written to ${call.args.collection}/${ref.id} (merge: ${merge})`;
            } catch (fsErr: any) {
              result = `Firestore write error: ${fsErr.message}`;
            }

          } else if (call.name === "firestore_delete") {
            try {
              const db = getAdminFirestore();
              await db.collection(call.args.collection).doc(call.args.document_id).delete();
              result = `✅ Deleted ${call.args.collection}/${call.args.document_id}`;
            } catch (fsErr: any) {
              result = `Firestore delete error: ${fsErr.message}`;
            }

          } else if (call.name === "storage_list") {
            try {
              const storage = getAdminStorage();
              const bucket = storage.bucket("infinity-quest-rpg.firebasestorage.app");
              const [files] = await bucket.getFiles({ prefix: call.args.prefix || "", maxResults: 50 });
              result = files.length === 0
                ? "No files found."
                : files.map(f => `📎 ${f.name} (${f.metadata.size} bytes)`).join("\n");
            } catch (stErr: any) {
              result = `Storage error: ${stErr.message}`;
            }

          } else if (call.name === "generate_content") {
            try {
              const genApiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY;
              const genResp = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${genApiKey}`,
                {
                  ...(call.args.system ? { system_instruction: { parts: [{ text: call.args.system }] } } : {}),
                  contents: [{ role: "user", parts: [{ text: call.args.prompt }] }],
                  generationConfig: { maxOutputTokens: 8192, temperature: 0.9 },
                },
                { headers: { "Content-Type": "application/json" } }
              );
              result = genResp.data.candidates?.[0]?.content?.parts?.[0]?.text || "No output generated.";
            } catch (genErr: any) {
              result = `Generation error: ${genErr.message}`;
            }

          } else {
            result = `Error: Unknown tool ${call.name}`;
          }

          // Add model's tool call to history
          state.conversationHistory.push({ role: "model", content: "", parts: [messagePart] });
          
          // Add tool response to history
          state.conversationHistory.push({ 
            role: "function", 
            content: result, 
            parts: [{ 
              functionResponse: { 
                name: call.name, 
                response: { content: result } 
              } 
            }] 
          });

          await ctx.replyWithChatAction("typing");
          continue; // Loop for next Gemini turn
        }

        break;
      } } // end unreachable legacy block
    } catch (err: any) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      console.error(`❌ Chat error in ${config.workspaceName}:`, errorMsg);
      await ctx.reply(`⚠️ Sorry, I encountered an error: ${errorMsg}`);
    }
  });

  return bot;
}
