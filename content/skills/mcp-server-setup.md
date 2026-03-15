---
steps: [{"title":"Initialize Project","description":"Set up the project structure for your MCP server.","action":"Run the following commands in your terminal to create a new project and install necessary dependencies.","codeSnippet":"mkdir my-weather-mcp && cd my-weather-mcp && npm init -y && npm install @modelcontextprotocol/sdk && npm install -D typescript @types/node tsx && npx tsc --init","expectedResult":"A new directory 'my-weather-mcp' is created with a package.json file and TypeScript configuration.","failureHint":"Ensure you have Node.js and npm installed. Check your terminal for any error messages."},{"title":"Create Server Code","description":"Write the server code to handle weather requests.","action":"Create a file named 'src/index.ts' and add the provided server code.","codeSnippet":"import { Server } from \"@modelcontextprotocol/sdk/server/index.js\"; ... // (add the complete server code provided)","expectedResult":"The 'src/index.ts' file contains the server code with the defined tools and request handlers.","failureHint":"Check for syntax errors or missing imports in the code."},{"title":"Run MCP Server","description":"Start the MCP server to listen for requests.","action":"Run the command 'tsx src/index.ts' in your terminal to start the server.","codeSnippet":"tsx src/index.ts","expectedResult":"The server starts successfully and is ready to handle requests.","failureHint":"Ensure you are in the project directory and that your TypeScript code compiles without errors."},{"title":"Connect to Claude Desktop","description":"Modify the Claude Desktop configuration to connect to your MCP server.","action":"Edit the Claude Desktop config file to include the MCP server details.","codeSnippet":"{ \"mcpServer\": \"http://localhost:PORT\" }  // Replace PORT with the actual port number","expectedResult":"Claude Desktop is configured to connect to your MCP server.","failureHint":"Double-check the file path and ensure the syntax is correct in the JSON configuration."},{"title":"Test Weather Tool","description":"Verify that the weather tool is functioning correctly.","action":"Use Claude Desktop to request the weather for a specific city.","expectedResult":"Claude Desktop returns the weather information for the requested city.","failureHint":"Make sure the MCP server is running and that the tool is correctly defined in your server code."}]
---
---
title: "MCP 서버 구축 실전 — 나만의 AI 도구 만들기"
tags: ["MCP", "Claude", "TypeScript", "AI 도구", "서버"]
difficulty: "advanced"
summary: "Model Context Protocol을 이해하고 TypeScript로 나만의 MCP 서버를 처음부터 구축하는 실전 가이드"
---

## 🎯 학습 목표

1. MCP(Model Context Protocol)의 아키텍처와 동작 원리를 설명할 수 있다
2. TypeScript MCP SDK로 커스텀 도구(Tool)와 리소스(Resource)를 구현할 수 있다
3. 구축한 MCP 서버를 Claude Desktop에 연결해서 실제로 사용할 수 있다

---

## 📖 MCP 아키텍처 이해

```
Claude Desktop (또는 Claude Code)
        ↕ (MCP 프로토콜)
   MCP 서버 (내가 만드는 것)
        ↕
  외부 서비스/DB/API/파일시스템
```

**MCP 서버의 3가지 기능:**
- **Tools**: Claude가 호출할 수 있는 함수 (검색, 계산, API 호출 등)
- **Resources**: Claude가 읽을 수 있는 데이터 (파일, DB 레코드 등)
- **Prompts**: 재사용 가능한 프롬프트 템플릿

---

## 🛠️ 실습 1 — 첫 MCP 서버 만들기 (날씨 도구)

**프로젝트 초기화:**
```bash
mkdir my-weather-mcp
cd my-weather-mcp
npm init -y
npm install @modelcontextprotocol/sdk
npm install -D typescript @types/node tsx
npx tsc --init
```

**서버 코드 (src/index.ts):**
```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  { name: "weather-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// 도구 목록 정의
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_weather",
      description: "특정 도시의 현재 날씨를 가져옵니다",
      inputSchema: {
        type: "object",
        properties: {
          city: { type: "string", description: "도시 이름 (한국어 가능)" },
        },
        required: ["city"],
      },
    },
  ],
}));

// 도구 실행 핸들러
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_weather") {
    const city = request.params.arguments?.city as string;
    // 실제로는 날씨 API 호출
    return {
      content: [
        {
          type: "text",
          text: `${city}의 현재 날씨: 맑음, 기온 22°C, 습도 65%`,
        },
      ],
    };
  }
  throw new Error(`Unknown tool: ${request.params.name}`);
});

// 서버 시작
const transport = new StdioServerTransport();
await server.connect(transport);
```

---

## 🛠️ 실습 2 — Claude Desktop에 연결

**Claude Desktop 설정 파일 수정:**

MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "weather": {
      "command": "node",
      "args": ["/절대경로/my-weather-mcp/dist/index.js"],
      "env": {
        "WEATHER_API_KEY": "your-api-key"
      }
    }
  }
}
```

Claude Desktop 재시작 후 "날씨 알려줘"라고 물어보면 MCP 서버가 호출됩니다.

---

## 💬 프롬프트 템플릿 10개

### 1. MCP 서버 기본 구조 생성
```
TypeScript로 MCP 서버를 만들어주세요.

서버 이름: [이름]
제공할 도구:
- [도구1 이름]: [설명], 입력: [파라미터], 출력: [결과 형태]
- [도구2 이름]: [설명], 입력: [파라미터], 출력: [결과 형태]

@modelcontextprotocol/sdk 최신 버전 사용
에러 처리 포함, 한국어 주석 포함
```

### 2. 데이터베이스 연결 MCP 도구
```
PostgreSQL 데이터베이스를 조회하는 MCP 도구를 만들어주세요.

테이블 구조: [스키마 설명]
필요한 도구:
- search_records: 키워드로 레코드 검색
- get_record_by_id: ID로 단건 조회
- list_recent: 최근 N개 레코드 조회

보안: SQL Injection 방지, 읽기 전용 쿼리만 허용
환경변수로 DB 연결 정보 관리
```

### 3. 외부 API 래핑 도구
```
[API 이름] REST API를 MCP 도구로 래핑해주세요.

API 문서: [엔드포인트 목록]
인증 방식: [Bearer Token / API Key 등]

MCP 도구로 만들 기능:
- [기능1]
- [기능2]

API 응답을 Claude가 이해하기 쉬운 텍스트로 변환하는 로직 포함
```

### 4. 파일시스템 도구
```
특정 디렉토리의 파일을 관리하는 MCP 서버를 만들어주세요.

허용 경로: [경로]
제공할 도구:
- list_files: 파일 목록 조회 (필터 옵션)
- read_file: 파일 내용 읽기
- search_in_files: 파일 내 텍스트 검색

보안: 지정된 디렉토리 밖 접근 차단
대용량 파일은 첫 N줄만 반환
```

### 5. 캐싱 레이어 추가
```
기존 MCP 서버에 캐싱 레이어를 추가해주세요.

캐싱 전략:
- API 결과를 메모리에 N분간 캐시
- 캐시 키: 도구 이름 + 입력 파라미터 해시
- 캐시 히트 시 "cached" 표시
- 수동 캐시 초기화 도구 추가

[기존 서버 코드 붙여넣기]
```

### 6. Resource 구현
```
MCP Resource를 구현해주세요.

리소스 목록:
- [리소스1]: URI 형식 [template://리소스명/{id}]
- [리소스2]: URI 형식 [static://리소스명]

각 리소스의 내용과 mimeType을 정의해주세요.
ListResources와 ReadResource 핸들러 모두 구현
```

### 7. 도구 입력 검증 강화
```
아래 MCP 서버에 입력 검증을 강화해주세요.

[기존 서버 코드]

추가 검증:
- Zod 스키마로 입력 타입 검증
- 문자열 길이 제한
- 숫자 범위 제한
- 허용되지 않는 특수문자 필터링

검증 실패 시 명확한 에러 메시지 반환
```

### 8. 스트리밍 응답
```
대용량 데이터를 스트리밍으로 반환하는 MCP 도구를 만들어주세요.

사용 케이스: 긴 파일 읽기, 대용량 API 응답
스트리밍 방식: 청크 단위로 분할해서 순차 반환
진행 상황 표시 포함 (현재 N번째 청크 / 전체 M개)
```

### 9. 로깅 및 모니터링
```
MCP 서버에 로깅 시스템을 추가해주세요.

로깅 항목:
- 도구 호출 (이름, 입력, 소요 시간)
- 에러 (스택 트레이스 포함)
- API 호출 횟수 (rate limiting 모니터링)

출력: JSON Lines 형식으로 파일에 저장
로그 레벨: DEBUG / INFO / WARN / ERROR
```

### 10. 테스트 코드 작성
```
아래 MCP 서버의 단위 테스트를 작성해주세요.

[서버 코드]

테스트 항목:
- 각 도구의 정상 동작
- 잘못된 입력에 대한 에러 처리
- 외부 API 실패 시 fallback
- 입력 검증 로직

테스트 프레임워크: Vitest
외부 API는 Mock 처리
```

---

## 🎯 도전 과제

**미션**: 실제로 업무에서 반복하는 작업을 MCP 서버 도구로 만들어 Claude Desktop에서 사용하세요.

**완성 조건:**
- MCP 서버 코드 완성 + npm run build 성공
- Claude Desktop claude_desktop_config.json 연동 완료
- Claude와 대화하면서 만든 도구가 실제 호출되는 것 확인
- 도구 사용 예시를 README.md에 문서화

---

## ⚠️ 자주 하는 실수 3가지

**1. JSON Schema 타입 오류로 도구가 목록에 안 뜸**
- ❌ inputSchema의 type이나 properties가 MCP 스펙과 다름
- ✅ 공식 예제의 JSON Schema 형식을 그대로 따를 것
- 💡 **해결법**: Claude Desktop에서 도구가 안 보이면 `~/Library/Logs/Claude/` 로그 파일 확인

**2. 에러를 잡지 않아 서버가 크래시됨**
- ❌ 외부 API 실패 시 서버 전체 종료
- ✅ 모든 도구 핸들러에 try-catch로 에러 처리
- 💡 **해결법**: 에러 발생 시 서버는 살아있고 에러 메시지를 Claude에게 반환

**3. 절대경로 설정 오류**
- ❌ claude_desktop_config.json에 상대경로 사용
- ✅ 빌드된 파일의 절대경로를 정확히 입력
- 💡 **해결법**: `pwd` 명령으로 절대경로 확인 후 설정

---

## 📺 추천 영상 (아래 키워드로 유튜브 검색)

- "MCP 서버 만들기 TypeScript 한국어 2026"
- "Model Context Protocol server tutorial from scratch"
- "Claude MCP custom tool building guide"
- "MCP server Claude Desktop integration 2026"

---

## 📚 참고 자료

- [MCP 공식 문서](https://modelcontextprotocol.io)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP 서버 예제 모음](https://github.com/modelcontextprotocol/servers)
