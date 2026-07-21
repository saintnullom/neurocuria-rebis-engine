# NeuroCuria Rebis Engine

A dual-lens reasoning interface that separates analytical evaluation from exploratory thinking, then synthesizes both into a practical next step.

## Overview

Most AI interfaces present reasoning as a single final answer.

Rebis takes a different approach.

It processes each question through three visible stages:

1. **Order**  
   Examines what is known, uncertain, assumed, constrained, risky, and worth verifying.

2. **Curiosity**  
   Reframes the question, explores alternatives, draws interdisciplinary connections, generates inversions, and expands the possibility space.

3. **Synthesis**  
   Combines the strongest insights from both lenses into a recommendation, experiment, or actionable path forward.

The goal is not simply to produce a longer answer. The goal is to make the structure of reasoning more visible, inspectable, and useful.

## Core Idea

### Standard AI

```text
Question
   │
   ▼
Single response
```

### Rebis

```text
Question
   │
   ▼
Order + Curiosity
   │
   ▼
Structured Validation
   │
   ▼
Synthesis
   │
   ▼
Testable Next Step
```

Rebis intentionally separates evaluation from exploration before combining both perspectives into a single recommendation.

## Features

- - Dual-lens reasoning (Order and Curiosity)
- Structured Synthesis after both lenses complete
- Live OpenAI Responses API integration
- Offline demo mode
- Structured output validation
- Stage-specific loading and error states
- Partial-result preservation
- Independent retry behavior
- Confidence estimate for Order
- Grounded, exploratory, and speculative idea labels
- Expandable supporting details
- Standard Response comparison mode
- Section-specific Copy controls
- Responsive mobile layout
- Reduced-motion support
- Authentication and provider error handling

## Example Question

**Question**

> What assumptions are hidden inside the concept of productivity?

### Order examines

- How productivity is defined
- Whether outputs and inputs are measurable
- Hidden assumptions about efficiency
- Risks of optimizing only for quantity
- Missing information
- Verification questions

### Curiosity explores

- Cultural definitions of productivity
- Well-being and sustainability
- Rest as productive infrastructure
- Personalized metrics
- Social and environmental outcomes
- Inversions such as less output producing more value

### Synthesis recommends

**A broader productivity framework that combines measurable efficiency with qualitative criteria such as quality, well-being, context, and sustainability.**

## Technology

- Next.js
- React
- TypeScript
- OpenAI Responses API
- Zod
- pnpm
- Vitest
- Responsive UI
- Server-side provider selection

## Architecture

```text
User Question
      │
      ▼
  /api/analyze
      │
      ├───────────────┐
      ▼               ▼
    Order         Curiosity
      │               │
      └───────┬───────┘
              ▼
      Structured Validation
              │
              ▼
          Synthesis
              │
              ▼
        Rebis Interface
```
        
## How Codex and GPT-5.6 Were Used

### Codex

Codex was used as the primary implementation partner throughout development.

It helped:

- Translate the Rebis concept into a Next.js and TypeScript architecture
- Build the Order, Curiosity, and Synthesis workflow
- Implement the OpenAI Responses API provider
- Create and refine structured Zod schemas
- Separate demo mode from live API mode
- Implement stage-specific error handling and retry behavior
- Build the Standard Response comparison feature
- Add automated tests and verification scripts
- Diagnose development-environment and runtime issues
- Refine the interface based on manual QA findings

The implementation process was iterative. Codex generated code, reported its changes, ran validation, and was then given targeted follow-up instructions based on live testing.

### GPT-5.6

GPT-5.6 was used throughout the project's design, prompt engineering, evaluation, and manual QA process.

It helped refine:

- The Order, Curiosity, and Synthesis prompt architecture
- Structured reasoning outputs
- Evaluation criteria
- Manual QA procedures
- Documentation and project refinement

The live application communicates with OpenAI through the Responses API using the model configured in the environment variables.

## Processing flow

The user submits a question.
Order and Curiosity are generated independently.
Each response is validated against its schema.
Synthesis runs only after both lenses validate.
Results are rendered in separate visible reasoning cards.
Individual stages can fail or retry without automatically erasing valid results.

## Project Structure

The exact directory layout may evolve, but the application is organized around:

```text
app/
  api/
    analyze/
  components/
  page.tsx

lib/
  providers/
  prompts/
  schemas/
  formatters/
  errors/

tests/
```


## Key responsibilities:

providers/ handles Demo and OpenAI provider behavior
prompts/ contains the three reasoning-lens instructions
schemas/ defines structured result formats
errors/ maps provider errors into safe user-facing messages
components/ renders Order, Curiosity, Synthesis, and comparison views

## Requirements

Before you begin, install or have access to:

- Node.js
- Corepack
- pnpm
- An OpenAI API key (for Live mode)

 **Note:** ChatGPT subscriptions and OpenAI API billing are separate. Demo mode does not require an OpenAI API key or API usage.

## Installation  

Open a terminal in the project folder, then install the dependencies:

```powershell
corepack pnpm install
```

If `pnpm` reports blocked dependency build scripts, run:

```powershell
corepack pnpm approve-builds
```

Approve the required packages, then run:

```powershell
corepack pnpm install
```

## Environment Configuration

Create a file named:

`.env.local`

Place it in the project root beside package.json.

### Demo Mode

```DEMO_MODE=true
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
```

Demo mode uses predefined local responses and does not make live API calls.

### Live Mode

```DEMO_MODE=false
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4.1-mini
```
Restart the development server after changing environment variables.

Never commit `.env.local.`

## Running the Application

Start the local development server:

```corepack pnpm dev
```

Open:

`http://localhost:3000`

If Turbopack cache issues occur, clear the development cache:

```Remove-Item .next -Recurse -Force
corepack pnpm dev
```

A Webpack fallback can be used for troubleshooting:

```corepack pnpm exec next dev --webpack
```

## Quick Test Without API Billing

Rebis includes a local Demo mode using predefined sample responses.

Set the following values in `.env.local`:

```env
DEMO_MODE=true
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
```

Then start the application:

```powershell
corepack pnpm dev
```

Open:

```text
http://localhost:3000
```

Use one of the included sample questions to inspect the complete Order, Curiosity, and Synthesis workflow without making live API calls.

## Verification

Run the project checks:

```corepack pnpm typecheck
corepack pnpm lint
corepack pnpm test
corepack pnpm build
```

Current automated verification during development:

Type check: Passed
Lint: Passed
Tests: 37/37 passed
Production build: Passed

## Manual QA

The minimum manual QA suite verifies:

Successful live Order generation
Successful live Curiosity generation
Successful live Synthesis generation
Meaningful separation between the three lenses
Mobile rendering at 390 × 844
Safe invalid API key handling
Section-specific copy behavior
Standard Response comparison
Final live smoke test
Final QA status
Core live analysis: Passed
Lens separation: Passed
Mobile layout: Passed
Invalid API key handling: Passed
Copy scope: Passed with limitation
Final smoke test: Passed
Standard Response comparison: Passed

## Error Handling

The interface converts provider failures into stable, stage-specific messages.

Example:

Order could not authenticate with the analysis provider.
Check the server configuration.

The UI is designed to avoid exposing:

API keys
Raw provider payloads
Internal stack traces
Server implementation details

## Responsive Design

The interface has been manually tested at:

390 × 844

Observed behavior:

Order and Curiosity stack vertically
Buttons remain accessible
Text wraps correctly
No horizontal overflow appears
Synthesis remains readable
Comparison mode remains usable
Long-form output scrolls normally


## Known Limitations

This is a Build Week prototype.

Known limitations include:

Copy buttons currently return raw JSON rather than formatted plain text
Some Synthesis outputs repeat parts of their recommendation
Order may occasionally overstep into solution generation on creative prompts
Scientific and medical questions require stronger evidence calibration
Rebis does not currently perform live web research
The application does not include user accounts
The application does not store analysis history
There is no persistent database
There is no PDF export
There is no multi-turn conversation
Confidence is an estimate, not a statistical guarantee

These are documented prototype limitations rather than hidden production claims.

## Safety and Epistemic Scope

Rebis is a reasoning interface, not a substitute for qualified professional advice.

For high-stakes topics such as:

Medicine
Substance use
Mental health
Law
Finance
Safety-critical decisions

The application should be used to organize questions, assumptions, uncertainties, risks, and possible next steps.

It should not be treated as an authoritative diagnosis, prescription, legal opinion, or financial directive.

## Design Philosophy

Rebis is based on three principles.

1. Reasoning roles should remain distinct

Analysis and exploration are both useful, but they should not be silently blended into one voice.

2. Uncertainty should remain visible

Unknowns, assumptions, risks, and confidence limits should be exposed rather than polished away.

3. The output should lead to action

A useful reasoning system should end with a test, decision, experiment, or next step.

## Intended Use Cases

Rebis is suited for:

Strategic planning
Product decisions
Creative development
Research framing
Assumption discovery
Personal decision support
Educational exploration
Contrarian analysis
Early-stage project evaluation
Turning vague questions into testable plans

## Future Work

Potential future improvements include:

Human-readable copy formatting
Copy Full Analysis
Richer compact comparison summaries
Stronger evidence hierarchy
Web-assisted research mode
Saved analysis history
Project context
User-adjustable lens weighting
PDF export
Multi-turn refinement
Additional evaluation datasets

These are intentionally outside the Build Week V1 scope.

## Project Status

Status: Functional Build Week prototype
Architecture: Stable
Live provider: Working
Demo mode: Working
Core QA: Passed
Submission readiness: Ready for final packaging

## About NeuroCuria

NeuroCuria is an experimental framework built around the idea of:

Curiosity as a Cure.

Its projects explore how structured curiosity, skepticism, creative reasoning, and practical experimentation can turn uncertainty into a usable method.

Rebis is one implementation of that philosophy.

## Creator

R. R. Harper
Founder, NeuroCuria

