# OpenAI Prompt Inventory

This list captures baked-in prompts used in actual OpenAI API calls in the runtime codebase.

## API Routes

### `app/api/onboarding/chat/route.ts`
- `SYSTEM_PROMPT`: onboarding chat persona, info collection goals, and conversation guidelines.
- Additional system messages:
  - Tool use instructions (collect context, extract keywords).
  - Language instruction (Korean/English).
  - Known/missing context directive with ordering.
  - Follow-up system prompt when tool calls return no content.

### `app/api/chat/general/route.ts`
- `SYSTEM_PROMPT`: general chat persona and guidance.
- Additional system messages:
  - Language instruction (Korean/English).
  - Optional context message built from known student info.

### `app/api/skill-translation/chat/route.ts`
- `buildAdaptiveSystemPrompt(...)`: base personality + student info + universal rules + prohibited language.
- `getContextGuidance(...)`: context-specific guidance per conversation type.

### `app/api/generate-feedback/route.ts`
- `getSystemPrompt(language)`: system guidance for feedback tone and constraints.
- `createPrompt(...)`: user prompt containing formatted conversation and instructions.

### `app/api/recommend-roles/route.ts`
- User prompt: `Career advisor: Generate 5 roles...` with JSON schema and constraints.
- System prompt: `Fast career advisor. Brief English responses only.`

### `app/api/journey-report/route.ts`
- System prompt: JSON output schema and SCOPE+ Journey Report rules.

### `app/api/generate-recommendations/route.ts`
- User prompt: majors/universities recommendation template with JSON schema.
- System prompt: `Return valid JSON only. Be concise.`

### `app/api/chat/route.ts`
- Passes a baked question context string into `generateFollowUp(...)`.
  - Prompt content lives in `lib/openai.ts`.

### `app/api/analyze-roles/route.ts`
- Uses `analyzeRoleSwipes(...)` prompt definitions from `lib/openai.ts`.

## lib/

### `lib/openai.ts`
- `generateFollowUp(...)`:
  - System prompt: supportive career exploration guide, ask 1?2 follow-up questions.
  - User prompt: includes the question context and student answer.
- `analyzeRoleSwipes(...)`:
  - System prompt: analyze role exploration patterns, respond in Korean.
  - User prompt: includes swipe summary and request for 2?3 clusters.

### `lib/aiCareerRecommender.ts`
- `analyzeWithAI(...)`: prompt that includes available roles list, selection criteria, and JSON schema.

### `lib/aiCareerGenerator.ts`
- System prompt: career expert that returns personalized career info.
- `buildPrompt(...)`: role/user profile details and JSON schema for career data.
