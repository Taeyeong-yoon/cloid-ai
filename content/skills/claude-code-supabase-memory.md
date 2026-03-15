---
steps: [{"title":"Set up the Supabase memory table","description":"Create a table in Supabase to store the agent's memory.","action":"Run the SQL command provided to create the 'agent_memory' table.","codeSnippet":"CREATE TABLE agent_memory (\n  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,\n  session_id text NOT NULL,\n  key text NOT NULL,\n  value text NOT NULL,\n  created_at timestamptz DEFAULT now(),\n  UNIQUE(session_id, key)\n);\n\nALTER TABLE agent_memory ENABLE ROW LEVEL SECURITY;","expectedResult":"The 'agent_memory' table is created in Supabase with the specified schema.","failureHint":"Check for syntax errors in the SQL command or ensure you have the necessary permissions."},{"title":"Add MCP Supabase server to Claude Code","description":"Integrate Supabase with Claude Code for memory functionality.","action":"Execute the command to add the Supabase MCP server to your Claude Code environment.","codeSnippet":"claude mcp add supabase -- npx -y @supabase/mcp-server-supabase --access-token YOUR_TOKEN","expectedResult":"The Supabase MCP server is successfully added to Claude Code.","failureHint":"Verify your access token and ensure the command is executed in the correct environment."},{"title":"Instruct Claude Code to use memory","description":"Configure Claude Code to read from and write to the memory table.","action":"Update your CLAUDE.md file with the memory usage instructions.","expectedResult":"Claude Code is set to read and write preferences using the 'agent_memory' table.","failureHint":"Ensure the instructions are correctly formatted in the CLAUDE.md file."},{"title":"Test the memory loop","description":"Verify that the agent can remember and retrieve preferences.","action":"Run the provided Claude commands to store and retrieve a preference.","codeSnippet":"claude 'Remember that I prefer TypeScript over JavaScript. Store this preference in agent_memory.'\n# New session:\nclaude 'Check my preferences from agent_memory and write the solution in my preferred language.'","expectedResult":"The agent remembers the preference and responds accordingly in TypeScript.","failureHint":"Check the memory table in Supabase to ensure the preference was stored correctly."}]
---
---
title: "Claude Code + Supabase: Adding Memory to Your Agent"
tags: ["Claude Code", "Supabase", "Memory", "Agent"]
difficulty: "advanced"
summary: "Add persistent memory to a Claude Code agent by storing and retrieving context in a Supabase database"
---

## 🎯 Goal

Build a Claude Code agent that remembers past interactions and user preferences by reading and writing to a Supabase database.

---

## 📋 Recipe

### Step 1 — Set up the Supabase memory table

```sql
CREATE TABLE agent_memory (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text NOT NULL,
  key text NOT NULL,
  value text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(session_id, key)
);

ALTER TABLE agent_memory ENABLE ROW LEVEL SECURITY;
```

### Step 2 — Add MCP Supabase server to Claude Code

```bash
claude mcp add supabase -- npx -y @supabase/mcp-server-supabase --access-token YOUR_TOKEN
```

### Step 3 — Instruct Claude Code to use memory

Add to your CLAUDE.md:

```markdown
## Memory
- Before starting a task, query agent_memory for relevant context using session_id = current session
- After completing a task, store key decisions and user preferences to agent_memory
- Example: Store 'preferred_language: TypeScript', 'test_framework: Jest'
```

### Step 4 — Test the memory loop

```
claude 'Remember that I prefer TypeScript over JavaScript. Store this preference in agent_memory.'
# New session:
claude 'Check my preferences from agent_memory and write the solution in my preferred language.'
```

---

## 💡 Tips

- Use a stable `session_id` (e.g., project name) for long-running projects
- Regularly prune old memory entries to keep context relevant
- Memory is most useful for preferences, not task history — keep it focused
