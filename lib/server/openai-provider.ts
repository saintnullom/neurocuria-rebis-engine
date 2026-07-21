import OpenAI from "openai";
import { z } from "zod";
import { buildCuriosityPrompt, buildOrderPrompt, buildStandardPrompt, buildSynthesisPrompt, type ProviderPrompt } from "@/lib/prompts";
import { curiositySchema, orderSchema, standardResponseSchema, synthesisSchema, type AnalysisOperation, type AnalysisRequest, type AnalysisResult } from "@/lib/schemas";
import type { AnalysisProvider } from "@/lib/server/analysis-provider";
import { AnalysisError, stageLabel } from "@/lib/server/errors";

type ResponsesPort = { create: (request: unknown, options: { timeout: number }) => Promise<unknown> };

const requestTimeoutMs = 45_000;

export function createOpenAIProvider(apiKey: string, model: string, client?: ResponsesPort): OpenAIAnalysisProvider {
  const sdk = new OpenAI({ apiKey });
  const port = client ?? { create: (request: unknown, options: { timeout: number }) => sdk.responses.create(request as never, options) };
  return new OpenAIAnalysisProvider(port, model);
}

export class OpenAIAnalysisProvider implements AnalysisProvider {
  constructor(private readonly client: ResponsesPort, private readonly model: string) {}

  async analyze(request: AnalysisRequest): Promise<AnalysisResult> {
    const { lens, prompt, schema } = this.prepare(request);
    try {
      const response = await this.client.create({
        model: this.model,
        instructions: prompt.instructions,
        input: prompt.input,
        text: { format: { type: "json_schema", name: prompt.name, strict: true, schema: z.toJSONSchema(schema) } }
      }, { timeout: requestTimeoutMs });
      return this.parseResponse(lens, response, schema);
    } catch (error) {
      if (error instanceof AnalysisError) throw error;
      throw mapOpenAIError(lens, error);
    }
  }

  private prepare(request: AnalysisRequest): { lens: AnalysisOperation; prompt: ProviderPrompt; schema: typeof orderSchema | typeof curiositySchema | typeof synthesisSchema | typeof standardResponseSchema } {
    if (request.lens === "order") return { lens: request.lens, prompt: buildOrderPrompt(request.input), schema: orderSchema };
    if (request.lens === "curiosity") return { lens: request.lens, prompt: buildCuriosityPrompt(request.input), schema: curiositySchema };
    if (request.lens === "synthesis") return { lens: request.lens, prompt: buildSynthesisPrompt(request.input, request.order, request.curiosity), schema: synthesisSchema };
    return { lens: request.lens, prompt: buildStandardPrompt(request.input), schema: standardResponseSchema };
  }

  private parseResponse(lens: AnalysisOperation, response: unknown, schema: typeof orderSchema | typeof curiositySchema | typeof synthesisSchema | typeof standardResponseSchema): AnalysisResult {
    const record = asRecord(response);
    if (!record) throw invalidOutput(lens, "returned an unexpected response");
    if (record.status === "incomplete") throw invalidOutput(lens, "was incomplete");
    if (hasRefusal(record.output)) throw new AnalysisError(`${stageLabel(lens)} declined this request. Try reframing it or reducing sensitive detail.`, 422, "refusal", lens);
    const output = record.output_text;
    if (typeof output !== "string" || !output.trim()) throw invalidOutput(lens, "returned no usable output");
    let parsed: unknown;
    try { parsed = JSON.parse(output); } catch { throw invalidOutput(lens, "returned invalid structured output"); }
    const validated = schema.safeParse(parsed);
    if (!validated.success) throw invalidOutput(lens, "returned output that did not match the required structure");
    return validated.data;
  }
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value !== null ? value as Record<string, unknown> : undefined;
}

function hasRefusal(output: unknown) {
  return Array.isArray(output) && output.some((item) => {
    const content = asRecord(item)?.content;
    return Array.isArray(content) && content.some((part) => asRecord(part)?.type === "refusal");
  });
}

function invalidOutput(lens: AnalysisOperation, detail: string) {
  return new AnalysisError(`${stageLabel(lens)} ${detail}. Please retry this stage.`, 502, "invalid_output", lens);
}

export function mapOpenAIError(lens: AnalysisOperation, error: unknown): AnalysisError {
  const record = asRecord(error);
  const status = typeof record?.status === "number" ? record.status : undefined;
  const name = typeof record?.name === "string" ? record.name : "";
  const code = typeof record?.code === "string" ? record.code : "";
  const label = stageLabel(lens);
  if (status === 401 || status === 403) return new AnalysisError(`${label} could not authenticate with the analysis provider. Check the server configuration.`, 502, "authentication", lens);
  if (status === 429) return new AnalysisError(`${label} is temporarily rate limited. Please retry shortly.`, 429, "rate_limit", lens);
  if (status === 400 || status === 422) return new AnalysisError(`${label} could not process this input safely. Revise the question and retry.`, 422, "safety", lens);
  if (name.includes("Timeout") || code === "ETIMEDOUT") return new AnalysisError(`${label} timed out. Retrying may help.`, 504, "timeout", lens);
  if (name.includes("Connection") || code === "ECONNRESET" || code === "ENOTFOUND") return new AnalysisError(`${label} could not reach the analysis provider. Check the connection and retry.`, 503, "network", lens);
  if (status && status >= 500) return new AnalysisError(`${label} is temporarily unavailable. Please retry shortly.`, 502, "provider", lens);
  return new AnalysisError(`${label} could not be completed. Please retry this stage.`, 502, "provider", lens);
}
