# Task 13: AI Pages Integration

## Status

pending

## Wave

5

## Description

Wire the AI Query page and AI chat panel in the note editor to real backend APIs. Replace the simulated 2-second delay with real RAG-based AI queries, and connect the chat panel to the existing `/api/chat` route with note context.

## Dependencies

**Depends on:** task-08-rag.md
**Blocks:** task-15-polish.md

**Context from dependencies:** task-08 provides `queryWithRAG()`, `getQueryHistory()`, `clearQueryHistory()` server actions. The AI page (src/app/ai/page.tsx) has a simulated handleQuery with setTimeout. The AI chat panel (src/components/notes/ai-panel.tsx) needs to use the existing chat API. The query history component expects `QueryHistoryItem[]`.

## Files to Modify

- `src/app/ai/page.tsx` — Replace simulated query with real `queryWithRAG()` call
- `src/components/notes/ai-panel.tsx` — Wire to existing chat API with note context

## Technical Details

### Implementation Steps

1. **src/app/ai/page.tsx:**
- Replace the entire `handleQuery` function that uses setTimeout with a real call
- Import `queryWithRAG`, `getQueryHistory`, `clearQueryHistory` from `@/lib/actions/ai-query`
- Replace mock response with real AIResponse

```typescript
import { queryWithRAG, getQueryHistory, clearQueryHistory } from "@/lib/actions/ai-query";
import type { AIResponse, QueryHistoryItem } from "@/lib/types";

const [response, setResponse] = useState<AIResponse | null>(null);
const [isLoading, setIsLoading] = useState(false);
const [history, setHistory] = useState<QueryHistoryItem[]>([]);

useEffect(() => {
  getQueryHistory().then(setHistory).catch(console.error);
}, []);

const handleQuery = async (query: string) => {
  setIsLoading(true);
  try {
    const result = await queryWithRAG(query);
    setResponse(result);
    const updatedHistory = await getQueryHistory();
    setHistory(updatedHistory);
  } catch (error) {
    console.error("AI query failed:", error);
  } finally {
    setIsLoading(false);
  }
};

const handleClearHistory = async () => {
  await clearQueryHistory();
  setHistory([]);
};
```

- Remove the mockResponse constant entirely
- Wire the example query buttons to call handleQuery
- Wire query history items to call handleQuery on click

2. **src/components/notes/ai-panel.tsx:**
- This component provides AI chat about the current note
- Use the existing `/api/chat` route (already working with OpenRouter)
- The key change: inject the note content as context in the system message
- The existing `useChat` hook from `@ai-sdk/react` can be used

```typescript
import { useChat } from "@ai-sdk/react";

// In the component:
const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
  api: "/api/chat",
  body: {
    context: noteContent,
    noteTitle: noteTitle,
  },
});
```

- Modify the `/api/chat/route.ts` to accept a `context` and `noteTitle` in the request body
- Add a system prompt that includes the note context when provided

### Modify `src/app/api/chat/route.ts`:
Add to the message validation or extract from body:
```typescript
const { messages, context, noteTitle } = await request.json();

// In the streamText call, add:
system: context 
  ? `You are an AI assistant helping the user work with their note "${noteTitle}". Here is the note content:\n\n${context}\n\nAnswer questions about this note, suggest improvements, help with research, and provide insights.`
  : "You are a helpful AI assistant for 2ndBrain, a personal knowledge management system.",
```

### Notes

- The AI query page uses server actions (queryWithRAG) — no API route needed
- The AI chat panel uses the existing streaming API route
- Both share the OpenRouter API key
- Error handling should show user-friendly messages
- Loading states should show the LoadingOrb or spinner

## Acceptance Criteria

- [ ] AI Query page sends real queries and returns answers with citations
- [ ] Citations link to real notes (clickable)
- [ ] Query history loads from database and persists across reloads
- [ ] Clear history removes all entries
- [ ] Example query buttons trigger real queries
- [ ] AI chat panel in note editor sends messages with note context
- [ ] Streaming responses work in the chat panel
- [ ] Error states handle API failures gracefully
