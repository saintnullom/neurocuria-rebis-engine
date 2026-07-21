import { describe, expect, it, vi } from "vitest";
import { demoOrder, demoSynthesis } from "../lib/demo-data";
import type { AnalysisProvider } from "../lib/server/analysis-provider";
import { AnalysisError } from "../lib/server/errors";
import { runAnalysis, selectAnalysisProvider } from "../lib/server/analysis-service";

describe("provider selection", () => {
  it("uses demo mode without an API key", () => expect(selectAnalysisProvider({ DEMO_MODE: "true" }).mode).toBe("demo"));
  it("rejects live mode without server configuration", () => expect(() => selectAnalysisProvider({ DEMO_MODE: "false" })).toThrow("Live analysis is not configured"));
  it("selects a live provider only when configuration is present", () => {
    const provider: AnalysisProvider = { analyze: vi.fn().mockResolvedValue(demoOrder) };
    const factory = vi.fn(() => provider);
    const selection = selectAnalysisProvider({ DEMO_MODE: "false", OPENAI_API_KEY: "test-key", OPENAI_MODEL: "test-model" }, factory);
    expect(selection.mode).toBe("live");
    expect(factory).toHaveBeenCalledWith("test-key", "test-model");
  });
});

describe("granular analysis failures", () => {
  it("allows one lens to fail without invalidating the other lens result", async () => {
    const provider: AnalysisProvider = { analyze: vi.fn(async (request) => {
      if (request.lens === "curiosity") throw new AnalysisError("Curiosity failed", 503, "network", "curiosity");
      return demoOrder;
    }) };
    const factory = () => provider;
    const environment = { DEMO_MODE: "false", OPENAI_API_KEY: "test-key" };
    const results = await Promise.allSettled([runAnalysis({ lens: "order", input: "Question" }, environment, factory), runAnalysis({ lens: "curiosity", input: "Question" }, environment, factory)]);
    expect(results[0].status).toBe("fulfilled");
    expect(results[1].status).toBe("rejected");
  });

  it("preserves valid lens data when a later synthesis attempt fails", async () => {
    const order = demoOrder;
    await expect(Promise.reject(new AnalysisError("Synthesis failed", 502, "provider", "synthesis"))).rejects.toThrow("Synthesis failed");
    expect(order).toEqual(demoOrder);
  });

  it("does not alter valid Rebis data when an optional comparison fails", async () => {
    const provider: AnalysisProvider = { analyze: vi.fn(async (request) => {
      if (request.lens === "standard") throw new AnalysisError("Comparison failed", 503, "network", "standard");
      return demoOrder;
    }) };
    const snapshot = { order: demoOrder, synthesis: demoSynthesis };
    await expect(runAnalysis({ lens: "standard", input: "Question" }, { DEMO_MODE: "false", OPENAI_API_KEY: "test-key" }, () => provider)).rejects.toThrow("Comparison failed");
    expect(snapshot).toEqual({ order: demoOrder, synthesis: demoSynthesis });
  });
});
