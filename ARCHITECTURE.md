# Architecture

## Data flow

`User input → Order request + Curiosity request (parallel) → validated lens results → Synthesis request → validated synthesis → structured UI cards`.

## Server boundaries

- `app/api/analyze/route.ts` validates every incoming discriminated request.
- `lib/schemas.ts` is the sole contract for requests and model outputs.
- `lib/prompts/` contains server-only prompt builders.
- `lib/server/analysis-service.ts` selects demo or OpenAI providers from server environment values.
- `lib/server/openai-provider.ts` isolates the official OpenAI Responses API integration.
- `lib/server/analysis-provider.ts` preserves a replaceable provider interface.

## Provider selection

`DEMO_MODE` is server-only configuration. Its default is demo mode; when it is explicitly `false`, `OPENAI_API_KEY` is required. The API response includes a server-authored `mode` marker only so the UI can label predefined responses; it does not grant the client provider-selection authority.

## Structured output and safety

The OpenAI provider requests `json_schema` structured output generated directly from the existing Zod schema. It still parses JSON and runs Zod validation before returning data. Empty, incomplete, refused, malformed, and schema-invalid results are rejected without returning raw provider content. Prompt instructions prohibit fabricated verification, diagnosis, overclaiming, and definitive high-stakes advice.

## Comparison operation

`standard` is an additional discriminated request operation with its own `standardResponseSchema`. It is invoked only after an explicit client action. The existing provider interface, demo provider, and OpenAI provider all validate this operation independently; normal Order, Curiosity, and Synthesis calls never trigger it.

## Presentation behavior

The client coordinates only display state. It uses native disclosure elements for secondary detail, an accessible 0–100 reasoning-confidence meter, and stage-specific task labels. A server-authored result mode marks demo output. The brief convergence indicator is visual only and never delays access to valid Synthesis output.

## Error and retry flow

Provider failures map to stable application errors. Order and Curiosity remain independently callable and retryable. Synthesis is rejected by request validation unless both valid lens objects and original input are present. A Synthesis failure leaves both prior lens results intact in the client.
