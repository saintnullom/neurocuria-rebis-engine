import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ComparisonPanel } from "../components/comparison-panel";
import { CuriosityPanel, OrderPanel, SynthesisPanel } from "../components/result-panels";
import { StatusProgress } from "../components/status-progress";
import { demoCuriosity, demoOrder, demoSynthesis } from "../lib/demo-data";

const copy = vi.fn();

describe("result presentation", () => {
  it("renders Order sections with an accessible confidence meter", () => {
    const html = renderToStaticMarkup(<OrderPanel data={demoOrder} copy={copy} />);
    expect(html).toContain("Reasoning confidence");
    expect(html).toContain('role="meter"');
    expect(html).toContain('aria-valuenow="58"');
    expect(html).toContain("Evidence, assumptions, and unknowns");
  });

  it("renders explicit Curiosity novelty labels", () => {
    const html = renderToStaticMarkup(<CuriosityPanel data={demoCuriosity} copy={copy} />);
    expect(html).toContain("Grounded possibility");
    expect(html).toContain("Exploratory possibility");
    expect(html).toContain("Speculative possibility");
  });

  it("renders the Synthesis recommendation before supporting detail", () => {
    const html = renderToStaticMarkup(<SynthesisPanel data={demoSynthesis} copy={copy} />);
    expect(html.indexOf("Recommended path")).toBeLessThan(html.indexOf("Agreement, tension, and experiments"));
  });

  it("renders stage-specific loading and non-blocking convergence text", () => {
    const html = renderToStaticMarkup(<StatusProgress loading={{ order: true }} converging />);
    expect(html).toContain("Testing assumptions");
    expect(html).toContain("Converging perspectives");
  });

  it("renders comparison as an optional action without an automatic response", () => {
    const html = renderToStaticMarkup(<ComparisonPanel input="Question" order={demoOrder} curiosity={demoCuriosity} synthesis={demoSynthesis} loading={false} onCompare={vi.fn()} onCopy={copy} />);
    expect(html).toContain("Compare with Standard Response");
    expect(html).not.toContain("standard-response");
  });
});
