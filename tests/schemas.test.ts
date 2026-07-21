import { describe, expect, it } from "vitest";
import { demoOrder, demoStandardResponse } from "../lib/demo-data";
import { analysisRequestSchema, orderSchema, standardResponseSchema } from "../lib/schemas";

describe("analysis schemas", () => {
  it("accepts the documented Order output", () => expect(orderSchema.parse(demoOrder).confidence.score).toBe(58));
  it("rejects confidence outside the 0–100 estimate range", () => expect(() => orderSchema.parse({ ...demoOrder, confidence: { ...demoOrder.confidence, score: 101 } })).toThrow());
  it("requires both lens outputs before synthesis", () => expect(() => analysisRequestSchema.parse({ lens: "synthesis", input: "test" })).toThrow());
  it("accepts a fully valid synthesis request", () => expect(analysisRequestSchema.parse({ lens: "synthesis", input: "test", order: demoOrder, curiosity: { reframe: "Reframe", possibilities: [], connections: [], whatIfQuestions: [], inversions: [], mostPromisingIdea: { title: "Idea", reason: "Reason" } } }).lens).toBe("synthesis"));
  it("limits user input", () => expect(() => analysisRequestSchema.parse({ lens: "order", input: "x".repeat(4001) })).toThrow());
  it("accepts a standard comparison request and response", () => { expect(analysisRequestSchema.parse({ lens: "standard", input: "test" }).lens).toBe("standard"); expect(standardResponseSchema.parse(demoStandardResponse).answer).toBeTruthy(); });
});
