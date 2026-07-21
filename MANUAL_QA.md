# Rebis Engine Manual QA

Date:7/20/26
Version: V1.1
Tester:RR

## Test Environment

- Platform: Windows 10 Home
- Browser:Chrome or Edge
- Application: Local Next.js development server
- Modes tested: Demo and Live
- Date tested: 7/20/2026

## 1. Core Live Analysis

Test question:

> What assumptions are hidden inside the concept of productivity?

Observed behavior:

- Order generated successfully
- Curiosity generated successfully
- Synthesis generated successfully
- All three sections addressed the submitted question
- Order focused on definitions, assumptions, unknowns, risks, and verification
- Curiosity expanded the concept through cultural, psychological, technological, and environmental perspectives
- Synthesis combined both lenses into a concrete recommendation
- No raw JSON appeared in the analysis interface
- No provider error appeared
- No section failed to render

Result:

- [x] Pass
- [ ] Fail

Notes:

Order identified hidden assumptions including measurable output, clearly defined inputs, stable conditions, efficiency, stakeholder alignment, and the belief that maximizing output is beneficial.

Curiosity reframed productivity as a culturally and contextually shaped concept and explored alternatives involving well-being, sustainability, creativity, rest, and personalized metrics.

Synthesis recommended integrating quantitative efficiency with qualitative well-being and sustainability criteria, then proposed stakeholder consultation, pilot measurement models, and contextual analysis as next actions.

The lenses were meaningfully distinct, although Synthesis repeated parts of its recommendation in the final convergence paragraph. This is a non-blocking quality issue.

## 2. Lens Separation

Test question:

> What assumptions are hidden inside the concept of productivity?

### Order behavior

Order focused on:

- Definitions of productivity
- Quantifiable outputs and inputs
- Hidden assumptions
- Missing information
- Risks and mitigations
- Contradictions and tensions
- Verification questions
- Confidence and uncertainty

Order did not primarily generate speculative alternatives or imaginative reframings.

### Curiosity behavior

Curiosity focused on:

- Cultural and contextual reframing
- Alternative definitions of productivity
- Economic, psychological, technological, and environmental connections
- “What if” questions
- Inversions
- Possibilities involving well-being, sustainability, creativity, rest, and personalized metrics

Curiosity did not primarily perform risk assessment or evidence verification.

### Synthesis behavior

Synthesis:

- Combined Order’s concerns about measurement, quality, and stakeholder alignment
- Incorporated Curiosity’s alternatives involving well-being and sustainability
- Produced a recommended path
- Proposed practical next actions
- Preserved some tension between measurable efficiency and qualitative values

### Separation assessment

- Order and Curiosity had clearly different roles: Yes
- Order focused on constraints and epistemic structure: Yes
- Curiosity expanded the possibility space: Yes
- Synthesis integrated both lenses: Yes
- The three sections merely repeated one another: No
- Some thematic overlap was present: Yes, but appropriate to the shared question

Result:

- [x] Pass
- [ ] Fail

Notes:

The lenses were meaningfully separated. Order analyzed what the concept assumes and where its risks lie. Curiosity challenged the concept and generated alternative frames. Synthesis selected a broader productivity framework and proposed ways to test it.

A minor non-blocking weakness is that Synthesis repeated some of its recommendation in the closing convergence paragraph instead of adding a sharper unresolved tension or experiment.

## 3. Mobile Layout

Tested using Chrome responsive device emulation.

Viewport:

- Width: 390px
- Height: 844px
- Operating system: Windows 10 Home

Confirmed:

- [x] Input remained usable
- [x] Order and Curiosity stacked vertically
- [x] No horizontal overflow appeared
- [x] Buttons remained visible and tappable
- [x] Text wrapped correctly
- [x] Confidence meter remained readable
- [x] Synthesis remained readable
- [x] Standard Response comparison remained usable

Result:

- [x] Pass
- [ ] Fail

Notes:

The application remained fully functional at a 390×844 viewport. No layout-breaking issues, horizontal scrolling, or clipped interface elements were observed. Cards stacked correctly, controls remained accessible, and long-form reasoning content remained readable through normal vertical scrolling.

## 4. Error Handling

Tested in Live mode using an intentionally invalid API key.

Observed message:

> Order could not authenticate with the analysis provider. Check the server configuration.

Confirmed:

- [x] Clear authentication error appeared
- [x] Failed stage was identified
- [x] Page remained usable
- [x] API key was not displayed
- [x] No raw provider response appeared
- [x] No stack trace appeared in the interface

Result:

- [x] Pass
- [ ] Fail

Notes:

The application handled the invalid API key safely and presented a stable, stage-specific error without exposing secrets or internal debugging information.

## 5. Copy Behavior

Confirmed:

- [x] Order Copy copies only Order
- [x] Curiosity Copy copies only Curiosity
- [ ] Copied output is human-readable

Observed issue:

Copy buttons currently place raw structured JSON on the clipboard rather than formatted plain text.

Result:

- [x] Functional with limitation
- [ ] Critical failure

Severity:

- Low

Submission impact:

- Non-blocking for the prototype

## 6. Final Smoke Test

Mode:

- Live
- Valid API key
- `DEMO_MODE=false`

Test question:

> What should NeuroCuria stop doing for the next 30 days?

Confirmed:

- [x] Order completed successfully
- [x] Curiosity completed successfully
- [x] Synthesis completed successfully
- [x] Output addressed the submitted question
- [x] No visible provider error appeared
- [x] Page remained usable
- [x] Standard Response comparison completed
- [x] Copy buttons remained functional

Result:

- [x] Pass
- [ ] Fail

Notes:

Order appropriately acknowledged limited context and assigned a lower confidence score of 50/100.

Curiosity generated several concrete pause experiments, including reducing multitasking, social media activity, low-value meetings, non-urgent email, and unrelated information intake.

Synthesis selected a specific and testable path: pause multitasking during research, reduce interruptions, and review activities against strategic priorities.

The Standard Response comparison completed successfully and remained fair and concise.

Minor non-blocking issues:

- Synthesis repeated parts of the recommendation in the closing paragraph.
- Curiosity assumed NeuroCuria operates as a team or organization in several places.
- The compact Rebis comparison summary remains brief.
- Copy output remains raw JSON.
---
