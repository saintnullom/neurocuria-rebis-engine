import { describe, expect, it } from "vitest";
import { demoCuriosity, demoOrder } from "../lib/demo-data";
import { buildCuriosityPrompt, buildOrderPrompt, buildStandardPrompt, buildSynthesisPrompt } from "../lib/prompts";

describe("prompt builders", () => {
  it("keeps the original input in initial lens prompts", () => {
    expect(buildOrderPrompt("Question?").input).toBe("Question?");
    expect(buildCuriosityPrompt("Question?").input).toBe("Question?");
  });

  it("gives synthesis the original input and both validated lens outputs", () => {
    const prompt = buildSynthesisPrompt("Question?", demoOrder, demoCuriosity);
    expect(prompt.input).toContain("Question?");
    expect(prompt.input).toContain(demoOrder.summary);
    expect(prompt.input).toContain(demoCuriosity.reframe);
  });

  it("keeps a standard response fair and separate from Rebis lenses", () => {
    const prompt = buildStandardPrompt("Question?");
    expect(prompt.input).toBe("Question?");
    expect(prompt.instructions).toContain("Do not mention Order");
  });
});
