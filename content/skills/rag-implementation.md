---
steps: [{"title":"Load PDF Files","description":"This step prepares your PDF files for processing.","action":"Use Python to load multiple PDF files into your script.","expectedResult":"All specified PDF files are successfully loaded into the program.","failureHint":"Check the file paths and ensure the files are accessible."},{"title":"Chunk the Documents","description":"This step breaks down the loaded documents into manageable chunks.","action":"Implement a chunking strategy with a size of 500 tokens and an overlap of 50 tokens.","expectedResult":"Documents are divided into chunks as specified, ready for embedding.","failureHint":"Verify that the chunking function handles the document structure correctly."},{"title":"Embed the Chunks","description":"This step converts text chunks into embeddings for vector storage.","action":"Use the OpenAI text-embedding-3-small model to embed the document chunks.","expectedResult":"All document chunks are successfully converted into embeddings and stored in a variable.","failureHint":"Ensure the OpenAI API is correctly integrated and that you have valid API keys."},{"title":"Store Embeddings in VectorDB","description":"This step saves the embeddings into a local Chroma vector database.","action":"Store the embeddings along with their metadata in the Chroma database.","expectedResult":"Embeddings are successfully saved in the Chroma vector database.","failureHint":"Check the database connection and ensure the schema is correctly defined."},{"title":"Implement Similarity Search","description":"This step allows you to retrieve relevant document chunks based on user queries.","action":"Set up a similarity search using cosine similarity to find the top 5 relevant chunks.","expectedResult":"The program returns the top 5 relevant document chunks based on the user's query.","failureHint":"Ensure the similarity search function is correctly implemented and the embeddings are accessible."}]
---
---
title: "RAG 시스템 구현하기 — 나만의 데이터로 AI 답변받기"
tags: ["RAG", "벡터DB", "임베딩", "LangChain", "Supabase"]
difficulty: "advanced"
summary: "벡터DB + 임베딩 + 검색 파이프라인으로 나만의 문서 기반 AI 질의응답 시스템을 구축하는 실전 가이드"
---

## 🎯 학습 목표

1. RAG(Retrieval-Augmented Generation) 아키텍처와 각 컴포넌트의 역할을 설명할 수 있다
2. 문서를 임베딩하여 벡터DB에 저장하고 의미 기반 검색을 구현할 수 있다
3. 검색된 컨텍스트를 Claude API와 결합해서 정확한 질의응답 시스템을 완성할 수 있다

---

## 📖 RAG 아키텍처

```
[오프라인 단계 — 문서 인덱싱]
문서 → 청킹(Chunking) → 임베딩 → 벡터DB 저장

[온라인 단계 — 질의응답]
사용자 질문 → 질문 임베딩 → 벡터DB 유사도 검색
→ 관련 문서 청크 검색 → LLM에 컨텍스트와 함께 전달
→ 최종 답변 생성
```

**왜 RAG인가?**
- LLM의 학습 데이터 기한(cutoff) 문제 해결
- 사내 문서·자체 데이터로 AI 특화
- 환각(Hallucination) 감소 — 실제 문서에 근거한 답변

---

## 🛠️ 실습 1 — 로컬 PDF RAG 시스템 (Python)

```
Python으로 PDF 파일 기반 RAG 시스템을 만들어주세요.

패키지: langchain, anthropic, chromadb, pypdf

파이프라인:
1. PDF 파일 로드 (여러 파일 지원)
2. 청킹: 500 토큰, 50 토큰 오버랩
3. 임베딩: OpenAI text-embedding-3-small
4. 벡터DB: Chroma (로컬)
5. 검색: 코사인 유사도 Top-5
6. 답변 생성: Claude claude-sonnet-4-6

사용 예시:
- "이 문서에서 [질문]에 대해 알려줘"
- 답변에 출처 문서명과 페이지 번호 포함

전체 코드와 requirements.txt 포함
```

---

## 🛠️ 실습 2 — Supabase 벡터DB 연동

```
Supabase pgvector를 사용하는 RAG 시스템을 만들어주세요.

구성:
- 벡터DB: Supabase (pgvector 확장)
- 임베딩: OpenAI text-embedding-3-small (1536 차원)
- LLM: Claude claude-sonnet-4-6

SQL 스키마:
CREATE TABLE documents (
  id uuid DEFAULT gen_random_uuid(),
  content text,
  metadata jsonb,
  embedding vector(1536)
);

Python 코드:
- 문서 임베딩 후 Supabase에 저장
- 질문 임베딩 후 벡터 유사도 검색
- 검색 결과로 Claude 답변 생성

supabase-py와 anthropic 패키지 사용
```

---

## 💬 프롬프트 템플릿 10개

### 1. 청킹 전략 코드
```
문서를 효과적으로 청킹하는 Python 코드를 만들어주세요.

청킹 전략:
- 기본: 토큰 기반 (chunk_size=500, overlap=50)
- 고급: 의미 기반 (문단/섹션 경계 존중)
- 특수: 마크다운 구조 인식 (헤더 기준 분할)

각 청크에 메타데이터 추가:
- 원본 파일명, 페이지 번호, 청크 인덱스
- 이전/다음 청크 참조 (컨텍스트 윈도우 확장용)
```

### 2. 하이브리드 검색
```
Dense 검색(벡터)과 Sparse 검색(BM25)을 결합하는
하이브리드 검색 시스템을 구현해주세요.

가중치: Dense 70% + BM25 30%
결과 융합: RRF(Reciprocal Rank Fusion)

이점: 키워드 매칭 + 의미 검색 동시 활용
전체 코드 + 성능 비교 테스트 포함
```

### 3. 다국어 RAG
```
한국어-영어 혼합 문서를 처리하는 RAG 시스템을 만들어주세요.

처리 방식:
- 언어 감지 후 언어별 임베딩 모델 선택
- 한국어: paraphrase-multilingual-MiniLM
- 영어: text-embedding-3-small
- 크로스 랭귀지 검색 지원 (한국어 질문 → 영어 문서 검색)
```

### 4. 재순위화 (Re-ranking)
```
RAG 검색 결과의 품질을 높이는 재순위화 레이어를 추가해주세요.

방법:
1. 벡터 검색으로 Top-20 후보 추출
2. Cross-encoder 모델로 관련성 재평가
3. 상위 5개만 LLM에 전달

사용 모델: cross-encoder/ms-marco-MiniLM-L-6-v2
전후 품질 비교 예시 포함
```

### 5. 대화형 RAG (Multi-turn)
```
이전 대화 맥락을 유지하는 대화형 RAG를 구현해주세요.

처리 방식:
- 새 질문 + 이전 N개 대화를 결합해서 검색 쿼리 생성
- 대화 히스토리를 압축해서 컨텍스트 창 절약
- 후속 질문 처리 ("그것의 장점은?" 처럼 지시어 해석)

LangChain ConversationChain + 벡터 검색 통합
```

### 6. 성능 평가 시스템
```
RAG 시스템의 품질을 자동 평가하는 코드를 만들어주세요.

평가 지표:
- Faithfulness: 답변이 검색된 문서에 근거하는가
- Answer Relevance: 답변이 질문과 관련있는가
- Context Recall: 관련 문서가 검색되었는가

평가 방법: LLM-as-a-Judge (Claude로 평가)
테스트 Q&A 셋 10개 포함
```

### 7. 스트리밍 응답
```
RAG 답변을 스트리밍으로 반환하는 FastAPI 서버를 만들어주세요.

엔드포인트:
POST /chat (질문, 대화 ID)
GET /chat/stream (SSE 스트리밍)

답변 생성 시작 전 검색된 문서 소스 먼저 반환
이후 Claude 답변을 토큰 단위로 스트리밍
CORS 설정 포함
```

### 8. 문서 업데이트 처리
```
문서가 업데이트될 때 벡터DB를 자동으로 갱신하는 시스템을 만들어주세요.

처리 방식:
- 파일 변경 감지 (watchdog 라이브러리)
- 변경된 파일의 기존 임베딩 삭제
- 새 임베딩 생성 및 저장
- 증분 업데이트 (전체 재인덱싱 없이)

배치 처리: 변경사항을 모아서 5분마다 처리
```

### 9. 시각적 문서 처리
```
이미지와 표가 포함된 PDF를 처리하는 멀티모달 RAG를 구현해주세요.

처리 방식:
- 텍스트: 일반 임베딩
- 이미지: Claude Vision으로 설명 텍스트 생성 후 임베딩
- 표: 구조화된 텍스트로 변환 후 임베딩

질문 시 텍스트+이미지 컨텍스트를 함께 Claude에 전달
```

### 10. RAG 파이프라인 모니터링
```
프로덕션 RAG 시스템의 모니터링 대시보드를 만들어주세요.

추적 지표:
- 일별 질의 수
- 평균 응답 시간 (검색 + LLM 시간 분리)
- 캐시 히트율
- 검색 실패율 (관련 문서 없음)
- 토큰 비용

Streamlit 대시보드로 시각화
SQLite에 메트릭 저장
```

---

## 🎯 도전 과제

**미션**: 실제 문서(회사 매뉴얼, 강의자료, 개인 노트 등)로 RAG 시스템을 구축하고 10개의 질문으로 테스트하세요.

**완성 조건:**
- 50페이지 이상 문서 인덱싱 성공
- 10개 테스트 질문의 답변 정확도 80% 이상
- 답변마다 출처(문서명, 위치) 표시
- 응답 시간 3초 이내

---

## ⚠️ 자주 하는 실수 3가지

**1. 청크 크기가 너무 크거나 너무 작음**
- ❌ 청크 크기를 기본값으로만 사용
- ✅ 문서 종류에 따라 최적 청크 크기 실험 (100~2000 토큰 범위)
- 💡 **해결법**: 청크 크기에 따른 검색 품질을 몇 가지 테스트 질문으로 비교 후 결정

**2. 임베딩 모델과 검색 언어 불일치**
- ❌ 영어 전용 임베딩 모델로 한국어 문서 임베딩
- ✅ 다국어 임베딩 모델(multilingual) 사용
- 💡 **해결법**: `text-embedding-3-large` 또는 `paraphrase-multilingual-mpnet-base-v2` 권장

**3. 컨텍스트 창에 너무 많은 청크 삽입**
- ❌ Top-20 청크를 모두 LLM에 전달
- ✅ 품질 높은 Top-3~5개만 전달 + 재순위화 적용
- 💡 **해결법**: 청크 수가 많다고 답변이 좋아지지 않습니다. 정확도와 청크 수의 trade-off를 실험

---

## 📺 추천 영상 (아래 키워드로 유튜브 검색)

- "RAG 시스템 구현 Python LangChain 한국어"
- "RAG tutorial LangChain ChromaDB Claude 2026"
- "벡터 데이터베이스 임베딩 RAG 입문"
- "Supabase pgvector RAG implementation"

---

## 📚 참고 자료

- [LangChain RAG 공식 문서](https://python.langchain.com/docs/use_cases/question_answering/)
- [Anthropic Claude API 문서](https://docs.anthropic.com/en/api/getting-started)
- [Supabase Vector Store 가이드](https://supabase.com/docs/guides/ai/vector-columns)
