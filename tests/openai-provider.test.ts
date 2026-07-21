import { describe, expect, it, vi } from "vitest";
import { demoCuriosity, demoOrder, demoStandardResponse, demoSynthesis } from "../lib/demo-data";
import { mapOpenAIError, OpenAIAnalysisProvider } from "../lib/server/openai-provider";

describe("OpenAI analysis provider", () => {
  it("constructs a structured Responses API request and validates the result", async () => {
    const create = vi.fn().mockResolvedValue({ status: "completed", output: [], output_text: JSON.stringify(demoOrder) });
    const provider = new OpenAIAnalysisProvider({ create }, "test-model");
    await expect(provider.analyze({ lens: "order", input: "Question" })).resolves.toEqual(demoOrder);
    expect(create.mock.calls[0][0]).toMatchObject({ model: "test-model", text: { format: { type: "json_schema", strict: true, name: "order_analysis" } } });
  });

  it("rejects malformed or schema-invalid model output", async () => {
    const provider = new OpenAIAnalysisProvider({ create: vi.fn().mockResolvedValue({ status: "completed", output: [], output_text: JSON.stringify({ ...demoOrder, confidence: { ...demoOrder.confidence, score: 101 } }) }) }, "test-model");
    await expect(provider.analyze({ lens: "order", input: "Question" })).rejects.toMatchObject({ code: "invalid_output" });
  });

  it("handles model refusals without exposing their content", async () => {
    const provider = new OpenAIAnalysisProvider({ create: vi.fn().mockResolvedValue({ status: "completed", output: [{ content: [{ type: "refusal", refusal: "private provider text" }] }], output_text: "" }) }, "test-model");
    await expect(provider.analyze({ lens: "curiosity", input: "Question" })).rejects.toMatchObject({ code: "refusal" });
  });

  it("maps stable provider errors", () => {
    expect(mapOpenAIError("order", { status: 429 })).toMatchObject({ code: "rate_limit" });
    expect(mapOpenAIError("order", { status: 401 })).toMatchObject({ code: "authentication" });
    expect(mapOpenAIError("order", { name: "APIConnectionTimeoutError" })).toMatchObject({ code: "timeout" });
    expect(mapOpenAIError("order", { name: "APIConnectionError" })).toMatchObject({ code: "network" });
  });

  it("constructs synthesis from the original input and both validated lens results", async () => {
    const create = vi.fn().mockResolvedValue({ status: "completed", output: [], output_text: JSON.stringify(demoSynthesis) });
    const provider = new OpenAIAnalysisProvider({ create }, "test-model");
    await expect(provider.analyze({ lens: "synthesis", input: "Question", order: demoOrder, curiosity: demoCuriosity })).resolves.toEqual(demoSynthesis);
    expect(create.mock.calls[0][0].input).toContain(demoOrder.summary);
    expect(create.mock.calls[0][0].input).toContain(demoCuriosity.reframe);
  });

  it("uses a separate structured request for an optional standard comparison", async () => {
    const create = vi.fn().mockResolvedValue({ status: "completed", output: [], output_text: JSON.stringify(demoStandardResponse) });
    const provider = new OpenAIAnalysisProvider({ create }, "test-model");
    await expect(provider.analyze({ lens: "standard", input: "Question" })).resolves.toEqual(demoStandardResponse);
    expect(create.mock.calls[0][0]).toMatchObject({ text: { format: { name: "standard_response" } } });
  });
});
