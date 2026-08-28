# EvidenceHire: Multi-Agent Candidate Evaluation

> **EvidenceHire** is an AI multi-agent recruitment and hiring assessment platform designed to eliminate hallucinations, consensus bias, and superficial resume screening. It enforces **strict evidence grounding** by extracting verifiable atomic evidence quotes, running 4 independent evaluator agents in parallel, orchestrating a cross-agent debate with visible position revisions, and synthesizing executive decisions weighted by role-critical evidence rather than naive score averaging.

---

## Key Features

- **Stage 0: Ideal Candidate Blueprint**: Authoritative role requirements decomposed into critical capabilities, differentiators, nice-to-haves, production ownership expectations, and key interview validation risks.
- **Dual Candidate Bench Evaluation (Candidate A & Candidate B)**: Simultaneously processes Candidate A and Candidate B against shared role requirements, rendering independent evaluation dossiers for each candidate alongside a comparative synthesis.
- **Browser-Local 5-PDF Extraction**: Upload the 5 challenge PDFs (Job Description, Candidate A Resume & Transcript, Candidate B Resume & Transcript) with instant, client-side text extraction and preview.
- **Dynamic Grounded Evidence Bank**: Extracts discrete, indexed evidence items (`A-E1`, `A-E2`... / `B-E1`, `B-E2`...) with verbatim quotes and source attribution (`Resume` vs `Transcript`).
- **Four Independent Evaluators**:
  - **Technical Evaluator** (*Principal Systems Architect*): Tests system design depth, language mastery, profiling, and scale.
  - **HR / Culture Evaluator** (*VP of People & Culture*): Scrutinizes communication, psychological safety, mentorship, and team dynamics.
  - **Hiring Manager** (*Director of Platform Engineering*): Focuses on practical ROI, execution velocity, operational resilience, and business impact.
  - **Skeptic / Risk Evaluator** (*Principal Risk & Rigor Auditor*): Challenges resume boasts against interview admissions and catches discrepancies.
  - *Strict Isolation*: Each evaluator receives *only* the job requirements, candidate profile, and evidence bank—completely blind to other evaluators.
- **Explicit Opinion Shifts in Multi-Agent Debate**:
  - Evaluators directly cross-examine and qualify each other's claims (`agree`, `disagree`, `qualify`).
  - Highlights **"Initial View → Updated View"** with opinion shift badges when counter-evidence causes an agent to concede or revise its stance (`changedAfterDebate: true`).
- **Evidence-Weighted Decision Synthesizer**: Synthesizes the final decision based on role-critical skills, verified impact, candidate integrity/candor, and decisive evidence.
- **Stage 5: Comparative Hiring Committee**: Side-by-side executive summary, 9-dimension Capability Matrix, Evidence & Risk Lens, debate impact analysis, and follow-up interview blueprints.
- **Dynamic Input-Driven Mock Engine & Live Gemini Mode**: Runs with live Google Gemini API or an input-based dynamic mock engine that parses names and real quotes from uploaded materials without requiring an API key.

---

## Architecture Overview

```
                      ┌──────────────────────────────────────────────┐
                      │    Stage 0: Ideal Candidate Blueprint        │
                      │    Capabilities, Differentiators, Risks      │
                      └──────────────────────┬───────────────────────┘
                                             │
                      ┌──────────────────────▼───────────────────────┐
                      │   5-PDF Dossier Extraction (Browser-Local)   │
                      │   Job Description + Candidate A & B Materials│
                      └──────────────────────┬───────────────────────┘
                                             │
                      ┌──────────────────────▼───────────────────────┐
                      │  Stage 1: Grounded Evidence Banks (A & B)    │
                      │  Verbatim Quotes: [A-E1...], [B-E1...]       │
                      └──────────────────────┬───────────────────────┘
                                             │
             ┌───────────────────────────────┼───────────────────────────────┐
             ▼                               ▼                               ▼
    ┌─────────────────┐             ┌─────────────────┐             ┌─────────────────┐
    │  Technical Eval │             │  Culture/HR Eval│             │  Hiring Manager │
    │  (Isolated)     │             │  (Isolated)     │             │  (Isolated)     │
    └────────┬────────┘             └────────┬────────┘             └────────┬────────┘
             │                               │                               │
             └───────────────────────────────┼───────────────────────────────┘
                                             │
                                    ┌────────▼────────┐
                                    │   Skeptic Eval  │
                                    │   (Isolated)    │
                                    └────────┬────────┘
                                             │
                                    ┌────────▼────────┐
                                    │  Stage 3: Debate│
                                    │  Opinion Shifts │
                                    └────────┬────────┘
                                             │
                                    ┌────────▼────────┐
                                    │ Stage 4: Synth  │
                                    │ Final Decision  │
                                    └────────┬────────┘
                                             │
                                    ┌────────▼───────────────────────┐
                                    │ Stage 5: Comparative Committee │
                                    │ 9-Dim Matrix & Decision Logic  │
                                    └────────────────────────────────┘
```

---

## Quick Start Guide

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### 1. Installation

Install all root, server, and client dependencies:

```bash
npm install
```

### 2. Environment Configuration (Optional for Live Mode)

Create a `.env` file in the root or `server/` directory (see `.env.example`):

```bash
# Server Port
PORT=3001

# Google Gemini API Key (Optional: leave empty to use built-in dynamic mock engine)
GEMINI_API_KEY=your_gemini_api_key_here

# Supported Gemini Model (Default: gemini-2.5-flash)
GEMINI_MODEL=gemini-2.5-flash
```

> **Note**: If `GEMINI_API_KEY` is not provided, EvidenceHire automatically uses the dynamic input-based mock engine to extract real names, skills, and quotes from your uploaded PDFs.

### 3. Run Locally

Start both the backend server and frontend client concurrently:

```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3001](http://localhost:3001)

---

## How to Use EvidenceHire

1. Open [http://localhost:5173](http://localhost:5173).
2. **Upload five PDFs** across the three tabs (Job Description, Candidate A, Candidate B) or click **"Load Official Demo Candidates"**.
3. Click **"Evaluate Both Candidates"** (or Evaluate Both Candidates A & B).
4. Review:
   - **Stage 0: Ideal Candidate Blueprint**: Inspect the role mission, critical capabilities, differentiators, and ownership expectations.
   - **Candidate A & Candidate B Reports**: Inspect the 9-stage evaluation dossiers (Overview, Ideal Fit, Evidence Bank, 4 Independent Evaluators, Debate Room with opinion shifts, and Final Decision Report).
   - **Stage 5: Comparative Hiring Committee**: Examine the Executive Summary, Stage 0 Fit Overlay, 9-Dimension Capability Matrix, Evidence & Risk Lens, Debate Impact, and Final Hiring Recommendation.

---

## Build & Type-Check Verification

To verify TypeScript types across both server and client:
```bash
npm run type-check
```

To build production bundles:
```bash
npm run build
```

To run automated pipeline verification:
```bash
cd server && npx tsx src/test-maya-leo.ts
```

---

## Project Structure

```
promptwars-26BCE5106/
├── package.json              # Root script orchestration
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── README.md                 # Project documentation
├── server/                   # Backend Express & Gemini service
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts          # Express API server & routes
│       ├── types.ts          # Shared TypeScript interfaces
│       ├── gemini.ts         # @google/genai wrapper & JSON parser
│       ├── prompts.ts        # System prompts & JSON schemas
│       ├── mockData.ts       # Built-in demo candidate dataset
│       ├── test-maya-leo.ts  # Automated verification test suite
│       └── services/
│           ├── pipelineService.ts   # Multi-agent pipeline orchestrator
│           └── dynamicMockEngine.ts # Input-driven mock evaluation engine
└── client/                   # Frontend React + Vite + TypeScript
    ├── package.json
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── index.css         # Modern design system & responsive styling
        ├── types.ts          # Frontend data models
        ├── sampleData.ts     # Demo presets & fallback response
        ├── main.tsx          # React root mount
        ├── App.tsx           # Main application view & state manager
        ├── services/
        │   ├── api.ts            # API client & health check
        │   ├── pdfExtractor.ts   # Browser-local PDF parser (pdfjs-dist)
        │   └── nameExtractor.ts  # Client-side candidate name extraction
        └── components/
            ├── Header.tsx                     # Top navigation & status badge
            ├── PdfUploadPanel.tsx             # 3-tab upload cards & text preview
            ├── BlueprintView.tsx              # Stage 0 Ideal Blueprint viewer
            ├── ProgressBanner.tsx             # Live stage progress indicator
            ├── CandidateReportView.tsx        # 9-stage candidate dossier viewer
            ├── ComparativeHiringCommittee.tsx # Stage 5 comparative committee
            ├── EvidenceBankView.tsx           # Grounded evidence bank inspector
            ├── EvaluatorCards.tsx             # 4 blind evaluator cards
            ├── DebateView.tsx                 # Cross-agent debate dialogue
            ├── FinalReportCard.tsx            # Executive decision synthesis
            └── CitationModal.tsx              # Universal evidence citation popup
```

---

## License

MIT License. Built for the Multi-Agent AI Hackathon.
