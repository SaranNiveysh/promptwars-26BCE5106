# EvidenceHire: Multi-Agent Candidate Evaluation

> **EvidenceHire** is an AI multi-agent recruitment and hiring assessment platform designed to eliminate hallucinations, blind consensus bias, and superficial resume screening. It enforces **strict evidence grounding** by extracting verifiable atomic evidence quotes, running 4 independent evaluator agents in parallel, orchestrating a cross-agent debate, and synthesizing an executive decision weighted by role-critical evidence rather than naive score averaging.

---

## Key Features

- **Dual Candidate Bench Evaluation (Candidate A & Candidate B)**: Simultaneously processes Candidate A (e.g. Alex Chen) and Candidate B (e.g. Jordan Taylor) against the same role requirements, rendering independent 4-stage evaluation reports for each candidate and a bonus comparative synthesis.
- **Atomic Evidence Bank Extraction**: Parses candidate resume and interview transcript into discrete, indexed evidence items (`E1`, `E2`, etc.) with exact quotes and source attribution (`Resume` vs `Transcript`).
- **Four Genuinely Independent Evaluators**:
  - **Technical Evaluator** (*Principal Systems Architect*): Tests system design depth, language mastery, profiling, and scale.
  - **HR / Culture Evaluator** (*VP of People & Culture*): Scrutinizes communication, psychological safety, mentorship, and team dynamics.
  - **Hiring Manager** (*Director of Platform Engineering*): Focuses on practical ROI, execution velocity, Tier-1 resilience, and business impact.
  - **Skeptic / Risk Evaluator** (*Principal Risk & Rigor Auditor*): Challenges resume boasts against interview admissions and catches discrepancies.
  - *Strict Isolation*: Each evaluator receives *only* the job requirements, candidate profile, and evidence bank—completely blind to other evaluators' thoughts.
- **Explicit Visible Opinion Shifts in Debate**:
  - Evaluators directly challenge, cross-examine, and qualify each other's claims (`agree`, `disagree`, `qualify`).
  - Highlights **"Initial View → Updated View"** with visible opinion shift badges when counter-evidence causes an agent to concede, qualify, or revise its stance (`changedAfterDebate: true`).
- **Evidence-Weighted Decision Synthesizer**: Synthesizes the final decision based on role-critical skills, verified impact, candidate integrity/candor, and unresolved risks. A single verified deal-breaker can outweigh multiple generic positives.
- **Strict Evidence Grounding**: Every factual claim must cite supplied evidence IDs (`E1`, `E2`), and any unproven areas must be noted as *"insufficient evidence"*.
- **Zero-Setup Demo Mode & Live Gemini Mode**: Runs out-of-the-box in mock simulation mode with a realistic built-in candidate, or connects seamlessly to Google Gemini via `GEMINI_API_KEY`.

---

## Architecture Overview

```
                          ┌───────────────────────────┐
                          │   Recruiter Input Dossier │
                          │ Job + Resume + Transcript │
                          └─────────────┬─────────────┘
                                        │
                                        ▼
                          ┌───────────────────────────┐
                          │  Stage 1: Evidence Bank   │
                          │  Quotes: [E1], [E2]...    │
                          └─────────────┬─────────────┘
                                        │
                 ┌──────────────────────┼──────────────────────┐
                 ▼                      ▼                      ▼
        ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
        │  Technical Eval │    │  Culture/HR Eval│    │  Hiring Manager │    │   Skeptic Eval  │
        │  (Isolated)     │    │  (Isolated)     │    │  (Isolated)     │    │   (Isolated)    │
        └────────┬────────┘    └────────┬────────┘    └────────┬────────┘    └────────┬────────┘
                 │                      │                      │                      │
                 └──────────────────────┼──────────────────────┘                      │
                                        │
                                        ▼
                          ┌───────────────────────────┐
                          │    Stage 3: Agent Debate  │
                          │ Cross-examination of claims│
                          └─────────────┬─────────────┘
                                        │
                                        ▼
                          ┌───────────────────────────┐
                          │ Stage 4: Decision Synth   │
                          │ Evidence-weighted decision│
                          └───────────────────────────┘
```

---

## Quick Start Guide

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### 1. Installation

Install all root, server, and client dependencies:

```bash
npm run install:all
```

Or install manually:
```bash
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

### 2. Environment Configuration (Optional for Live Mode)

Create a `.env` file in the root or `server/` directory (see `.env.example`):

```bash
# Server Port
PORT=3001

# Google Gemini API Key (Optional: leave empty to use built-in mock simulation mode)
GEMINI_API_KEY=your_gemini_api_key_here

# Supported Gemini Model (Default: gemini-2.5-flash)
GEMINI_MODEL=gemini-2.5-flash
```

> **Note**: If `GEMINI_API_KEY` is not provided, EvidenceHire automatically runs in high-fidelity mock simulation mode so you can test and explore the full workflow immediately with zero setup!

### 3. Run Locally

Start both the backend server and frontend client concurrently:

```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3001](http://localhost:3001)

---

## Testing the Evaluation Flow

1. Open [http://localhost:5173](http://localhost:5173).
2. Click **"Load Demo Candidate"** to populate the input dossier with a realistic Staff Distributed Systems Engineer profile.
3. Click **"Run Multi-Agent Evaluation"**.
4. Observe the 4-stage pipeline execution:
   - **Evidence Bank**: Review the verbatim quotes and extracted facts labeled `[E1]`, `[E2]`, etc.
   - **Evaluator Cards**: Review the 4 independent scorecards (Technical, Culture, Hiring Manager, Skeptic) with confidence bars and cited strengths/concerns.
   - **Debate Room**: Watch the agents cross-examine claims (e.g. Skeptic flagging the resume vs interview discrepancy regarding Kafka architectural ownership).
   - **Final Report**: Review the executive recommendation, decisive evidence points, and custom follow-up interview questions.

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
│       └── services/
│           └── pipelineService.ts # Multi-agent pipeline orchestrator
└── client/                   # Frontend React + Vite + TypeScript
    ├── package.json
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── index.css         # Modern design system & responsive styling
        ├── types.ts          # Frontend data models
        ├── sampleData.ts     # Demo presets & fallback response
        ├── main.tsx          # React root mount
        ├── App.tsx           # Main application view
        ├── services/
        │   └── api.ts        # API client & health check
        └── components/
            ├── Header.tsx           # Top navigation & status badge
            ├── InputForm.tsx        # Dossier input form & demo loader
            ├── ProgressBanner.tsx   # Live stage progress indicator
            ├── EvidenceBankView.tsx # Grounded evidence bank inspector
            ├── EvaluatorCards.tsx   # 4 Independent blind evaluator cards
            ├── DebateView.tsx       # Cross-agent debate dialogue
            └── FinalReportCard.tsx  # Executive decision synthesis
```

---

## License

MIT License. Built for the Multi-Agent AI Hackathon.
