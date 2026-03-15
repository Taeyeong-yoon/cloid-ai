---
title: 'Claude Code + Supabase: Adding Memory to Your Agent'
tags:
  - Claude Code
  - Supabase
  - Memory
  - Agent
difficulty: advanced
summary: >-
  Add persistent memory to a Claude Code agent by storing and retrieving context
  in a Supabase database
steps:
  - title: Set up the Supabase memory table
    description: Create a table in Supabase to store memory entries for the agent.
    action: Run the provided SQL command in your Supabase SQL editor.
    codeSnippet: |-
      CREATE TABLE agent_memory (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        session_id text NOT NULL,
        key text NOT NULL,
        value text NOT NULL,
        created_at timestamptz DEFAULT now(),
        UNIQUE(session_id, key)
      );

      ALTER TABLE agent_memory ENABLE ROW LEVEL SECURITY;
    expectedResult: >-
      The 'agent_memory' table is created successfully in your Supabase
      database.
    failureHint: Check for any syntax errors in the SQL command.
  - title: Add MCP Supabase server to Claude Code
    description: Integrate the Supabase server with your Claude Code environment.
    action: Run the provided command in your terminal to add the Supabase server.
    codeSnippet: >-
      claude mcp add supabase -- npx -y @supabase/mcp-server-supabase
      --access-token YOUR_TOKEN
    expectedResult: The Supabase server is added to your Claude Code setup without errors.
    failureHint: Verify your access token and ensure your terminal is configured correctly.
  - title: Instruct Claude Code to use memory
    description: Update your CLAUDE.md file to enable memory usage in your agent.
    action: Add the memory instructions to your CLAUDE.md as specified.
    expectedResult: >-
      The CLAUDE.md file is updated with memory instructions for querying and
      storing preferences.
    failureHint: Ensure you follow the format exactly as shown in the recipe.
  - title: Test the memory loop
    description: >-
      Verify that the memory functionality works by storing and retrieving
      preferences.
    action: Run the provided commands in your Claude Code environment to test memory.
    codeSnippet: >-
      claude 'Remember that I prefer TypeScript over JavaScript. Store this
      preference in agent_memory.'

      # New session:

      claude 'Check my preferences from agent_memory and write the solution in
      my preferred language.'
    expectedResult: >-
      The agent successfully remembers your preference and uses it in the new
      session.
    failureHint: Check the Supabase table to see if the preference was stored correctly.
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
