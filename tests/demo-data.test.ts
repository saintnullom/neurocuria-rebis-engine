import { afterEach, describe, expect, it } from "vitest";
import { demoCuriosity, demoOrder, demoStandardResponse } from "../lib/demo-data";
import { runAnalysis } from "../lib/server/analysis-service";

const prior = process.env.DEMO_MODE;
afterEach(() => { process.env.DEMO_MODE = prior; });

describe("demo mode", () => {
  it("returns schema-conforming sample data without an API key", async () => { process.env.DEMO_MODE = "true"; await expect(runAnalysis({ lens: "order", input: "Any input" })).resolves.toMatchObject({ data: demoOrder, mode: "demo" }); });
  it("does not need lens outputs before the first two demo stages", async () => { process.env.DEMO_MODE = "true"; await expect(runAnalysis({ lens: "curiosity", input: "Any input" })).resolves.toMatchObject({ data: demoCuriosity, mode: "demo" }); });
  it("returns a predefined standard comparison only when requested", async () => { process.env.DEMO_MODE = "true"; await expect(runAnalysis({ lens: "standard", input: "Any input" })).resolves.toMatchObject({ data: demoStandardResponse, mode: "demo" }); });
});
