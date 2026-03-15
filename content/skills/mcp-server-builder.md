---
title: "MCP 서버 빠르게 만들기"
tags: ["MCP","TypeScript","Server"]
difficulty: "intermediate"
summary: "TypeScript SDK로 MCP 서버를 10분 안에 구축하는 빠른 레시피"
steps: [{"title":"Install TypeScript SDK","description":"Set up the necessary SDK for building the MCP server.","action":"Run `npm install @modelcontextprotocol/sdk` in your terminal.","expectedResult":"The TypeScript SDK is installed without errors.","failureHint":"Ensure you have Node.js and npm installed correctly."},{"title":"Create Server File","description":"Create a new file to define the MCP server.","action":"Create a file named `server.js` and paste the provided server code into it.","expectedResult":"The `server.js` file is created and contains the server code.","failureHint":"Check for syntax errors or missing imports in your code."},{"title":"Run the Server","description":"Execute the server to make it operational.","action":"Run `node server.js` in your terminal.","expectedResult":"The server starts running without errors.","failureHint":"Verify that the file path is correct and the server code is free of errors."},{"title":"Configure Claude Connection","description":"Set up the connection configuration for Claude.","action":"Create a JSON configuration file and add the provided Claude connection code.","expectedResult":"The configuration file is created and correctly formatted.","failureHint":"Ensure the JSON syntax is correct and matches the required structure."},{"title":"Test the Server","description":"Verify that the server responds correctly to requests.","action":"Send a test request to the server using a tool like Postman or curl.","expectedResult":"The server responds with a greeting message.","failureHint":"Check server logs for errors and ensure the server is running."}]
---

## 최소 MCP 서버

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server({ name: 'my-server', version: '1.0.0' });

// Tool 등록
server.setRequestHandler('tools/list', async () => ({
  tools: [{
    name: 'greet',
    description: '인사말 생성',
    inputSchema: {
      type: 'object',
      properties: { name: { type: 'string' } },
      required: ['name'],
    },
  }],
}));

server.setRequestHandler('tools/call', async (req) => {
  if (req.params.name === 'greet') {
    return { content: [{ type: 'text', text: `안녕하세요, ${req.params.arguments.name}!` }] };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

## Claude에 연결

```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["dist/server.js"]
    }
  }
}
```
