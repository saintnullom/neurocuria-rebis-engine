import { describe, expect, it } from "vitest";
import { confidenceLabel, loadingMessage, noveltyLabel } from "../lib/presentation";
import { claimRequest, releaseRequest } from "../lib/request-gate";

describe("experience presentation helpers", () => {
  it.each([0, 1, 50, 99, 100])("labels confidence boundary %i", (score) => expect(confidenceLabel(score)).toContain(`${score} out of 100`));
  it("provides stage-specific loading text", () => { expect(loadingMessage("order")).toContain("assumptions"); expect(loadingMessage("curiosity", 1)).toContain("connections"); expect(loadingMessage("synthesis", 2)).toContain("next step"); });
  it("makes novelty categories explicit beyond color", () => { expect(noveltyLabel("grounded")).toBe("Grounded possibility"); expect(noveltyLabel("exploratory")).toBe("Exploratory possibility"); expect(noveltyLabel("speculative")).toBe("Speculative possibility"); });
  it("prevents duplicate stage requests until the first request is released", () => { const active = new Set<string>(); expect(claimRequest(active, "order")).toBe(true); expect(claimRequest(active, "order")).toBe(false); releaseRequest(active, "order"); expect(claimRequest(active, "order")).toBe(true); });
});
