import {
  CandidateDossier,
  EvaluationResponse,
  BatchEvaluationResponse,
  IdealCandidateBlueprint,
  JobEvidenceItem,
  IdealFitOverlayItem,
  EvidenceItem,
} from './types';

export const DEMO_JOB = {
  jobTitle: 'AI Engineer — Agentic Systems (Freight Operations)',
  jobRequirements: `Company: Cargonet AI — a freight-tech company that runs AI "agent" systems in real production, handling things like shipment quoting, booking, tracking, document processing, and fixing errors automatically.

About the Role
We need an engineer to help improve our existing AI agent system (think of it as multiple AI workers — a planner, an executor, a reviewer, and specialized agents — working together). This is not a research-only job. You will build real features that go live for real users, mostly by directing AI coding tools (like Claude Code) rather than writing every line by hand — and you'll be responsible for fixing things when they break in production.

What You'll Do
• Improve the multi-agent AI system (planner, executor, reviewer, and other agents) that powers freight operations: quoting, booking, tracking, document processing, and error handling.
• Build features mainly by directing AI coding tools (like Claude Code) — reviewing and guiding their output, not just writing code yourself.
• Work on the Python backend (built as small services) and the React.js front-end, using MongoDB as the database, to build clean features and easy-to-use screens for operators.
• Improve how the AI is prompted, what tools/memory it has access to, and how it searches for relevant information (RAG / vector search); help decide which AI models to use for the best balance of quality and cost.
• Keep the live system running smoothly — find and fix bugs when an AI agent misbehaves, and improve how we test and monitor the system.
• Help connect the system to outside tools: carrier/shipping APIs, other business software, and document scanning (OCR) for extracting data from shipping documents like invoices.

What We're Looking For
• Solid Python backend skills (building APIs, working with small services).
• Some real hands-on experience with AI/LLM systems — not just tutorials. Things like prompt writing, RAG/vector search, and testing how well an AI system performs.
• Comfortable taking ownership when something breaks in production, not just when a demo goes well.
• Basic React.js skills for building simple front-end screens.
• Nice to have: experience with logistics/freight, document scanning (OCR), or connecting different business systems together.

What This Role Is NOT
This is not a "build it once and move on" role. We care as much about keeping things working reliably over time as we do about building the first version.`,
};

export const DEMO_JOB_EVIDENCE_BANK: JobEvidenceItem[] = [
  {
    id: 'J-E1',
    exactQuote: 'We need an engineer to help improve our existing AI agent system (think of it as multiple AI workers — a planner, an executor, a reviewer, and specialized agents — working together). This is not a research-only job. You will build real features that go live for real users, mostly by directing AI coding tools (like Claude Code) rather than writing every line by hand — and you\'ll be responsible for fixing things when they break in production.',
    extractedFact: 'Core role mission is developing production multi-agent features (planner/executor/reviewer) by guiding AI coding tools and maintaining live system reliability.',
    category: 'Role Mission & Multi-Agent Architecture',
  },
  {
    id: 'J-E2',
    exactQuote: 'Improve the multi-agent AI system (planner, executor, reviewer, and other agents) that powers freight operations: quoting, booking, tracking, document processing, and error handling.',
    extractedFact: 'Multi-agent system orchestrates core freight domain workflows: quoting, booking, tracking, BOL/invoice document processing, and error handling.',
    category: 'Freight Domain Scope',
  },
  {
    id: 'J-E3',
    exactQuote: 'Work on the Python backend (built as small services) and the React.js front-end, using MongoDB as the database, to build clean features and easy-to-use screens for operators.',
    extractedFact: 'Tech stack consists of Python microservices, MongoDB database, and React.js operator interfaces.',
    category: 'Tech Stack (Python/Mongo/React)',
  },
  {
    id: 'J-E4',
    exactQuote: 'Improve how the AI is prompted, what tools/memory it has access to, and how it searches for relevant information (RAG / vector search); help decide which AI models to use for the best balance of quality and cost.',
    extractedFact: 'Demands prompt design, agent tool/memory access, RAG vector retrieval, and cost-vs-quality model routing (SLMs vs Frontier LLMs).',
    category: 'AI Tooling, RAG & Model Routing',
  },
  {
    id: 'J-E5',
    exactQuote: 'Keep the live system running smoothly — find and fix bugs when an AI agent misbehaves, and improve how we test and monitor the system.',
    extractedFact: 'Mandates production debugging when agents hallucinate/misbehave and establishing robust evaluation and monitoring harnesses.',
    category: 'Testing, Evals & Monitoring',
  },
  {
    id: 'J-E6',
    exactQuote: 'Help connect the system to outside tools: carrier/shipping APIs, other business software, and document scanning (OCR) for extracting data from shipping documents like invoices.',
    extractedFact: 'Requires integrating carrier shipping APIs and document OCR pipelines for invoices and bills of lading.',
    category: 'Carrier APIs & OCR Ingestion',
  },
  {
    id: 'J-E7',
    exactQuote: 'Comfortable taking ownership when something breaks in production, not just when a demo goes well.',
    extractedFact: 'Demands extreme ownership and composure during live production outages rather than just demo prototypes.',
    category: 'Production Accountability',
  },
  {
    id: 'J-E8',
    exactQuote: 'This is not a "build it once and move on" role. We care as much about keeping things working reliably over time as we do about building the first version.',
    extractedFact: 'Explicit requirement for long-term retention, post-deploy reliability, and continuous system stewardship.',
    category: 'Long-Term Stewardship & Retention',
  },
];

export const DEMO_BLUEPRINT: IdealCandidateBlueprint = {
  roleTitle: 'AI Engineer — Agentic Systems (Freight Operations)',
  company: 'Cargonet AI',
  roleMission: {
    title: 'Production Agent Stewardship',
    description: 'Build, debug, and sustainably scale a live multi-agent planner/executor/reviewer system handling real-world freight operations while taking end-to-end on-call ownership.',
    evidenceIds: ['J-E1', 'J-E8'],
  },
  dayOneCriticalCapabilities: [
    {
      title: 'Python Microservices & Backend Engineering',
      description: 'Solid Python API development and small services architecture using FastAPI/async backends and MongoDB.',
      evidenceIds: ['J-E3'],
    },
    {
      title: 'Multi-Agent Coordination & Planner-Executor-Reviewer Patterns',
      description: 'Hands-on ability to orchestrate multi-worker state machines, failure recovery loops, and specialized agent routing.',
      evidenceIds: ['J-E1', 'J-E2'],
    },
    {
      title: 'Production Reliability & Incident On-Call Ownership',
      description: 'Demonstrated accountability to diagnose agent misbehaviors in live production and establish pre-deploy eval guardrails.',
      evidenceIds: ['J-E5', 'J-E7', 'J-E8'],
    },
  ],
  strongDifferentiators: [
    {
      title: 'Rigorous LLM Evaluation & Cost-Quality Model Routing',
      description: 'Creating quantitative eval benchmarks, tracking agent override rates, and intelligent routing between open-weight SLMs and frontier models.',
      evidenceIds: ['J-E4', 'J-E5'],
    },
    {
      title: 'Freight Domain & Document OCR Ingestion',
      description: 'Prior experience with BOL/invoice scanning pipelines, shipping carrier APIs (EDI/TMS), and logistics exceptions.',
      evidenceIds: ['J-E2', 'J-E6'],
    },
  ],
  niceToHaveCapabilities: [
    {
      title: 'Operator UI Development with React',
      description: 'Building clean, intuitive front-end screens for freight ops coordinators to monitor agent actions and resolve escalations.',
      evidenceIds: ['J-E3'],
    },
    {
      title: 'Directing AI Coding Tools (Claude Code)',
      description: 'Leveraging AI-assisted development tooling to rapidly review, steer, and ship high-reliability code.',
      evidenceIds: ['J-E1'],
    },
  ],
  productionOwnershipExpectations: [
    {
      title: 'Not a "Build Once & Move On" Mindset',
      description: 'Dedicated long-term ownership over systems reliability, bug fixing, and continuous post-incident retrospectives.',
      evidenceIds: ['J-E7', 'J-E8'],
    },
  ],
  keyTechnicalSkills: {
    pythonBackend: {
      title: 'Python & API Architecture',
      description: 'Writing robust, asynchronous services with clean data models in MongoDB.',
      evidenceIds: ['J-E3'],
    },
    multiAgentSystems: {
      title: 'Multi-Agent State Orchestration',
      description: 'Coordinating multi-worker execution flows with LangGraph/CrewAI/custom state machines.',
      evidenceIds: ['J-E1'],
    },
    plannerExecutorReviewer: {
      title: 'Planner/Executor/Reviewer Loop',
      description: 'Implementing retry, escalation, and double-check reviewer gates for error containment.',
      evidenceIds: ['J-E1', 'J-E2'],
    },
    promptingRagRoutingEval: {
      title: 'Prompting, RAG & Model Routing',
      description: 'Designing context-grounded retrieval and cost-optimized model fallback strategies.',
      evidenceIds: ['J-E4'],
    },
    reactMongoOcrIntegrations: {
      title: 'React, MongoDB, OCR & APIs',
      description: 'Connecting backend agent intelligence with operator dashboards and carrier document pipelines.',
      evidenceIds: ['J-E3', 'J-E6'],
    },
    reliabilityMonitoringOnCall: {
      title: 'Reliability, Monitoring & On-Call',
      description: 'Maintaining live agent health, diagnosing tool-calling loops, and establishing eval regression sets.',
      evidenceIds: ['J-E5', 'J-E7'],
    },
  },
  ownershipHonestyLearning: [
    {
      title: 'Intellectual Honesty & Transparent Attribution',
      description: 'Accurate representation of technical contributions, realistic metric evaluation, and psychological safety in retros.',
      evidenceIds: ['J-E5', 'J-E7'],
    },
    {
      title: 'Rapid Codebase-First Adaptability',
      description: 'Ability to quickly inspect real production code failure patterns and pair on bug fixes to bridge technical gaps.',
      evidenceIds: ['J-E1', 'J-E8'],
    },
  ],
  interviewValidationRisks: [
    {
      title: 'Resume Boasting vs Verified Implementation',
      description: 'Probing whether candidate personally authored production retry logic or primarily reviewed teammate PRs.',
      evidenceIds: ['J-E1', 'J-E7'],
    },
    {
      title: 'Single-Agent RAG vs Multi-Agent Orchestration Ramp-Up',
      description: 'Evaluating how quickly a solid backend engineer can master multi-agent coordination loops.',
      evidenceIds: ['J-E1', 'J-E3'],
    },
    {
      title: 'Job Tenure & Long-Term Reliability Commitment',
      description: 'Confirming whether the candidate is committed to multi-year systems stewardship versus short-term job-hopping.',
      evidenceIds: ['J-E8'],
    },
  ],
  jobEvidenceBank: DEMO_JOB_EVIDENCE_BANK,
};

export const DEMO_CANDIDATE_A: CandidateDossier = {
  id: 'candidate_a',
  candidateName: 'Rohan Malhotra',
  resumeText: `Rohan Malhotra
Senior AI/Backend Engineer

Summary
AI engineer with 3.5 years of experience building multi-agent LLM systems and Python backends. Led design of a production agent platform now handling thousands of daily freight exceptions. Known for moving fast and shipping under pressure.

Experience
Senior AI Engineer — Voltrix Logistics Tech (Jan 2025 – Present, 7 months)
• Designed and built the exception-handling engine end-to-end for Voltrix’s multi-agent freight ops platform (planner/executor/reviewer pattern), cutting manual exception review time by 40%.
• Owned prompt design and model routing across GPT-4 and open-weight SLMs, reducing inference cost by ~30%.
• Sole architect of the retry/escalation logic now running in production, handling 5,000+ freight exceptions/month.
• Presented the system design at a company-wide tech talk.

AI Engineer — Quickship Data Systems (Feb 2024 – Dec 2024, 11 months)
• Built a RAG pipeline over carrier rate documents using LangChain + Pinecone, cutting manual rate lookup time significantly.
• Improved BOL/invoice extraction accuracy through better OCR pre-processing.

Backend Developer — Nimbus Cloud Solutions (Aug 2022 – Jan 2024, 1.5 years)
• Built Python microservices for a SaaS analytics product used by 50+ enterprise clients.
• Led a 4-person team migrating a legacy monolith to microservices.

Skills
Python, FastAPI, LangGraph, CrewAI, MongoDB, React (basic), RAG, Vector Search (Pinecone, FAISS), Prompt Engineering, Docker, Kubernetes

Education
B.Tech Computer Science, 2022

Certifications
• LangChain for LLM Application Development (2024)`,
  transcriptText: `Interview Transcript — Candidate A (Rohan Malhotra)

Technical Section
Q1 (Interviewer): Walk me through the exception-handling engine you built at Voltrix.
A1: It’s planner-executor-reviewer. Failures come in, get classified, retried or escalated, then double-checked. I designed the whole retry/escalation logic.
Q2: What made you choose that structure over a simpler rule-based system?
A2: Rules don’t scale. Too many failure types — timeouts, bad EDI, missing BOL fields. Agents handle that better.
Q3: How do you measure whether the reviewer agent is actually catching real problems?
A3: We track override rate. It’s low. I’d have to check the exact number though, haven’t looked recently.
Q4: What’s your approach to model routing?
A4: Cost-based. Simple stuff to the SLM, harder reasoning to GPT-4. No formal study, just tuned it as things broke.

Behavioral Section
Q5 (Interviewer): Tell me about a time you disagreed with a teammate on a technical decision.
A5: Teammate wanted to hardcode more categories up front. I pushed for the agent approach. We went with mine.
Q6: Who actually wrote the retry/escalation logic that’s in production now?
A6: I designed it. Priya did a lot of the implementation, I reviewed her PRs. I was the architect.
Q7 (Skeptic follow-up): Your resume says “sole architect.” But it sounds like Priya built a lot of it. Can you clarify?
A7: Fine — “sole architect” is probably too strong. I led the design, she built most of the production version.

Ownership / Hiring Manager Section
Q8: Why should we invest in ramping you up here versus someone with more freight-domain experience?
A8: I move fast. I’ve built something structurally close to this already. I don’t think I’d need much ramp time.
Q9: This role needs long-term ownership of production reliability. How do you feel about being on-call for agent failures?
A9: Fine, I’ve done on-call before. Though Voltrix’s user base is still small, so I haven’t seen serious incident volume yet.
Q10: You’ve had three roles in 3.5 years, each under a year except the first. What’s driving that?
A10: Better pay and title, mostly. Voltrix is more aligned with what I want long-term.`,
};

export const DEMO_CANDIDATE_B: CandidateDossier = {
  id: 'candidate_b',
  candidateName: 'Ananya Iyer',
  resumeText: `Ananya Iyer
Software Engineer (Backend → AI)

Summary
Backend engineer with steady experience maintaining internal tools, recently moved into applied AI work. Comfortable with Python and standard web APIs; still building depth in AI-specific tooling.

Experience
Software Engineer II — Bridgepoint Systems (Jun 2021 – Present, 4 years)
• Maintains Python/FastAPI microservices for an internal ops platform used by a few internal teams.
• Helped migrate part of the document ingestion pipeline to use OCR-based extraction for scanned forms.
• Over the last 1.5 years, started building an internal RAG-based support-ticket assistant: set up a retrieval pipeline (LangChain + Chroma); team estimated answer accuracy improved by around 40% based on informal review.
• After a production incident (see interview), introduced a pre-deploy checklist for prompt changes that the team adopted.

Junior Backend Developer — Bridgepoint Systems (Jul 2019 – Jun 2021, 2 years)
• Built basic REST APIs for internal tooling.
• Worked with QA and product to define API contracts.

Skills
Python, FastAPI, MongoDB, PostgreSQL, LangChain, Chroma, basic React, OCR pipelines (Tesseract), Docker

Education
B.E. Information Technology, 2019

Note
Has not used multi-agent orchestration frameworks (LangGraph, CrewAI, AutoGen) in production — most LLM work to date has been a single-agent RAG pipeline.`,
  transcriptText: `Interview Transcript — Candidate B (Ananya Iyer)

Technical Section
Q1 (Interviewer): Tell me about the RAG pipeline you built for the support-ticket assistant.
A1: Sure — happy to walk through it step by step. We retrieve from a Chroma vector store built from past resolved tickets and internal docs. The top few matches get passed to the LLM, which drafts a response for a human agent to review before it goes out. We chunked documents by section rather than fixed length, since that kept related context together.
Q2: Your resume mentions a ~40% accuracy improvement. How was that measured?
A2: I want to be upfront about this — it was based on internal review, not a formal benchmark. A few of us spot-checked a sample of responses before and after the change and it felt clearly better, but I wouldn’t want to present that number as something rigorous if it comes up again.
Q3: Have you worked with multi-agent orchestration frameworks — LangGraph, CrewAI?
A3: Not in production. I’ve read through the docs for both and built a small planner/executor toy project on my own time, but everything I’ve actually shipped has been single-agent RAG. That’s a real gap relative to what this role needs, and I’d rather say that clearly than talk around it.
Q4: How would you approach ramping up on multi-agent systems specifically?
A4: I’d start by reading through your existing planner/executor/reviewer code directly, rather than a general course, since the real failure patterns usually aren’t in the docs. Then I’d want to pair with someone on a small bug fix first, before touching the architecture itself.

Behavioral Section
Q5 (Interviewer): Tell me about a mistake you made and how you handled it.
A5: I pushed a prompt change to the support assistant straight to production — we didn’t have a review process at the time, so nothing stopped me. It caused a spike in bad responses for about two hours before we caught it and rolled back.
Q6: What did you do after that?
A6: A few things. First, I ran an incident retro with the team and was direct that it was my mistake in the writeup — I didn’t want to soften that. Second, I proposed a pre-deploy checklist for prompt changes: a lightweight review step plus a small eval set to run before anything ships. It’s been part of our process since.
Q7 (Skeptic follow-up): Was there any pushback on you owning that mistake publicly, or did you find a way to spread the responsibility?
A7: No, I named it as mine in the retro doc. One teammate pointed out we should’ve had the checklist before this happened, which is fair — but I didn’t try to shift blame for the specific incident onto the process gap.

Ownership / Hiring Manager Section
Q8: This role is heavily oriented around multi-agent orchestration on day one. Given you haven’t shipped that in production, how do you think about that gap?
A8: It’s real, and I’d rather you go in with clear eyes about it than find out later. What I’d point to instead is a pattern: I’ve picked up new technical areas quickly before — OCR pipelines, then RAG — and I tend to ask for help early instead of quietly struggling, which I think matters more for ramp time than having already touched this exact framework.
Q9: Why should we invest in ramping you up here versus someone who already has multi-agent experience?
A9: Honestly, I can’t out-argue someone who’s already done the exact work. What I’d say is I’m a safer bet on the production-ownership side — I’ve been through a real incident and changed how the team works because of it, not just shipped something that looked good in a demo.
Q10: You’ve been at one company for six years. Any concern about adapting to a fast-moving startup environment?
A10: It’s a fair thing to ask about. I’d say the role itself changed a lot even though the employer didn’t — I went from junior backend work, to leading a pipeline migration, to driving our team’s move into AI. So I’ve had to keep adapting, just inside one company.`,
};

export const DEMO_EVIDENCE_BANK_A: EvidenceItem[] = [
  {
    id: 'R-E1',
    source: 'Resume',
    exactQuote: 'Designed and built the exception-handling engine end-to-end for Voltrix’s multi-agent freight ops platform (planner/executor/reviewer pattern), cutting manual exception review time by 40%.',
    extractedFact: 'Resume claims candidate designed and built Voltrix multi-agent freight exception handling engine end-to-end (planner/executor/reviewer pattern), cutting manual review time by 40%.',
    category: 'Multi-Agent Freight Architecture',
  },
  {
    id: 'R-E2',
    source: 'Resume',
    exactQuote: 'Sole architect of the retry/escalation logic now running in production, handling 5,000+ freight exceptions/month.',
    extractedFact: 'Resume claims candidate was "sole architect" of retry/escalation logic handling 5,000+ freight exceptions/month.',
    category: 'Production Scale & Authorship',
  },
  {
    id: 'R-E3',
    source: 'Transcript',
    exactQuote: 'Who actually wrote the retry/escalation logic that’s in production now? A6: I designed it. Priya did a lot of the implementation, I reviewed her PRs. I was the architect.',
    extractedFact: 'Candidate clarified that colleague Priya wrote most of the actual production implementation, while candidate designed it and reviewed PRs.',
    category: 'Teamwork & Authorship Reality',
  },
  {
    id: 'R-E4',
    source: 'Transcript',
    exactQuote: 'Your resume says "sole architect." But it sounds like Priya built a lot of it. Can you clarify? A7: Fine — "sole architect" is probably too strong. I led the design, she built most of the production version.',
    extractedFact: 'Candidate conceded under skeptic questioning that "sole architect" is too strong since Priya built most of the production version.',
    category: 'Resume Accuracy / Discrepancy',
  },
  {
    id: 'R-E5',
    source: 'Transcript',
    exactQuote: 'How do you measure whether the reviewer agent is actually catching real problems? A3: We track override rate. It’s low. I’d have to check the exact number though, haven’t looked recently.',
    extractedFact: 'Candidate tracks override rate for reviewer agent but does not know the exact number and has not looked at the metric recently.',
    category: 'Testing & Metric Rigour',
  },
  {
    id: 'R-E6',
    source: 'Transcript',
    exactQuote: 'What’s your approach to model routing? A4: Cost-based. Simple stuff to the SLM, harder reasoning to GPT-4. No formal study, just tuned it as things broke.',
    extractedFact: 'Model routing was tuned ad-hoc as things broke with no formal benchmark or structured evaluation study.',
    category: 'Evaluation Methodology',
  },
  {
    id: 'R-E7',
    source: 'Transcript',
    exactQuote: 'Fine, I’ve done on-call before. Though Voltrix’s user base is still small, so I haven’t seen serious incident volume yet.',
    extractedFact: 'Candidate has done on-call but admits Voltrix has a small user base with no exposure to serious incident volume.',
    category: 'Production Reliability & Incident Scale',
  },
  {
    id: 'R-E8',
    source: 'Transcript',
    exactQuote: 'You’ve had three roles in 3.5 years, each under a year except the first. What’s driving that? A10: Better pay and title, mostly. Voltrix is more aligned with what I want long-term.',
    extractedFact: 'Candidate had 3 roles in 3.5 years (most under a year), citing better pay and title as the primary driver.',
    category: 'Retention & Career Stability',
  },
];

export const DEMO_EVIDENCE_BANK_B: EvidenceItem[] = [
  {
    id: 'A-E1',
    source: 'Resume',
    exactQuote: 'Over the last 1.5 years, started building an internal RAG-based support-ticket assistant: set up a retrieval pipeline (LangChain + Chroma); team estimated answer accuracy improved by around 40% based on informal review.',
    extractedFact: 'Resume states candidate built an internal LangChain + Chroma RAG support-ticket assistant with ~40% estimated accuracy improvement via informal review.',
    category: 'Applied AI & RAG Experience',
  },
  {
    id: 'A-E2',
    source: 'Resume',
    exactQuote: 'After a production incident (see interview), introduced a pre-deploy checklist for prompt changes that the team adopted.',
    extractedFact: 'Candidate introduced a pre-deploy checklist for prompt changes adopted team-wide following a production incident.',
    category: 'Process Improvement & Reliability',
  },
  {
    id: 'A-E3',
    source: 'Resume',
    exactQuote: 'Has not used multi-agent orchestration frameworks (LangGraph, CrewAI, AutoGen) in production — most LLM work to date has been a single-agent RAG pipeline.',
    extractedFact: 'Resume explicitly includes a note stating candidate has not used multi-agent orchestration frameworks in production, focusing on single-agent RAG.',
    category: 'Multi-Agent Production Scope',
  },
  {
    id: 'A-E4',
    source: 'Transcript',
    exactQuote: 'I want to be upfront about this — it was based on internal review, not a formal benchmark. A few of us spot-checked a sample of responses before and after the change and it felt clearly better, but I wouldn’t want to present that number as something rigorous if it comes up again.',
    extractedFact: 'Candidate proactively clarified that the 40% accuracy improvement was informal spot-checking and explicitly refused to over-claim it as rigorous.',
    category: 'Integrity & Intellectual Honesty',
  },
  {
    id: 'A-E5',
    source: 'Transcript',
    exactQuote: 'Not in production. I’ve read through the docs for both and built a small planner/executor toy project on my own time, but everything I’ve actually shipped has been single-agent RAG. That’s a real gap relative to what this role needs, and I’d rather say that clearly than talk around it.',
    extractedFact: 'Candidate transparently stated single-agent RAG vs multi-agent production is a real gap and refused to talk around it.',
    category: 'Technical Gap Transparency',
  },
  {
    id: 'A-E6',
    source: 'Transcript',
    exactQuote: 'I’d start by reading through your existing planner/executor/reviewer code directly, rather than a general course, since the real failure patterns usually aren’t in the docs. Then I’d want to pair with someone on a small bug fix first, before touching the architecture itself.',
    extractedFact: 'Candidate articulated a pragmatic, codebase-first ramp-up plan: reading real failure patterns in existing code and pairing on bug fixes before touching architecture.',
    category: 'Ramp-up & Learning Methodology',
  },
  {
    id: 'A-E7',
    source: 'Transcript',
    exactQuote: 'I pushed a prompt change to the support assistant straight to production... caused a spike in bad responses for about two hours before we caught it and rolled back... First, I ran an incident retro with the team and was direct that it was my mistake in the writeup... Second, I proposed a pre-deploy checklist for prompt changes: a lightweight review step plus a small eval set to run before anything ships.',
    extractedFact: 'Candidate owned an unreviewed prompt deployment incident without shifting blame, ran a retro, and instituted pre-deploy eval sets and review checklists.',
    category: 'Incident Accountability & Eval Discipline',
  },
  {
    id: 'A-E8',
    source: 'Transcript',
    exactQuote: 'I went from junior backend work, to leading a pipeline migration, to driving our team’s move into AI. So I’ve had to keep adapting, just inside one company.',
    extractedFact: 'Candidate spent 6 years at Bridgepoint Systems, evolving from junior backend to pipeline migration lead to driving team AI adoption.',
    category: 'Adaptability & Long-Term Commitment',
  },
];

export const DEMO_RESPONSE_A: EvaluationResponse = {
  success: true,
  candidateId: 'candidate_a',
  candidateName: 'Rohan Malhotra',
  mode: 'mock',
  modelUsed: 'Built-in Grounded Multi-Agent Mock Engine',
  timestamp: new Date().toISOString(),
  candidateProfile: {
    name: 'Rohan Malhotra',
    currentRole: 'Senior AI Engineer at Voltrix Logistics Tech',
    summary: 'AI & Backend engineer with 3.5 years experience building planner/executor/reviewer multi-agent freight systems, LangChain RAG pipelines, and FastAPI microservices.',
    skills: ['Python', 'FastAPI', 'LangGraph', 'CrewAI', 'Planner-Executor-Reviewer', 'Prompt Engineering', 'MongoDB', 'Docker'],
  },
  evidenceBank: DEMO_EVIDENCE_BANK_A,
  evaluators: [
    {
      agentId: 'technical',
      agentName: 'Technical Evaluator',
      roleTitle: 'Principal Systems Architect',
      recommendation: 'yes',
      confidence: 82,
      strengths: [
        {
          claim: 'Direct hands-on experience designing planner/executor/reviewer pattern for freight operations and prompt routing between SLMs and GPT-4 [R-E1, R-E2].',
          evidenceIds: ['R-E1', 'R-E2'],
        },
      ],
      concerns: [
        {
          claim: 'Lacks formal evaluation frameworks: model routing tuned ad-hoc "as things broke" [R-E6], and does not track reviewer agent override rates [R-E5].',
          evidenceIds: ['R-E5', 'R-E6'],
        },
      ],
      missingEvidence: [
        'Insufficient evidence on direct React front-end development depth beyond basic familiarity.',
        'Insufficient evidence on experience directing AI coding tools (Claude Code).',
      ],
      keyQuestion: 'How would you build a structured regression eval set to quantitatively benchmark planner agent hallucinations before deploying prompt revisions?',
    },
    {
      agentId: 'culture',
      agentName: 'HR / Culture Evaluator',
      roleTitle: 'VP of People & Culture',
      recommendation: 'mixed',
      confidence: 76,
      strengths: [
        {
          claim: 'Presented system designs at company-wide tech talks [R-E1].',
          evidenceIds: ['R-E1'],
        },
      ],
      concerns: [
        {
          claim: 'Resume claim of "sole architect" overstated individual contribution; teammate Priya built most of the production code [R-E3, R-E4].',
          evidenceIds: ['R-E3', 'R-E4'],
        },
        {
          claim: 'High turnover pattern: 3 roles in 3.5 years driven primarily by short-term title and compensation jumps [R-E8].',
          evidenceIds: ['R-E8'],
        },
      ],
      missingEvidence: [
        'Insufficient evidence regarding mentorship of junior teammates or collaborative cross-functional empathy.',
      ],
      keyQuestion: 'When working closely with implementation engineers like Priya, how do you ensure team credit is accurately reflected across the organization?',
    },
    {
      agentId: 'hiring_manager',
      agentName: 'Hiring Manager',
      roleTitle: 'Director of Platform Engineering',
      recommendation: 'yes',
      confidence: 80,
      strengths: [
        {
          claim: 'Fast ramp-up speed in freight ops domain with 5,000+ monthly exception retry handling experience [R-E1, R-E2].',
          evidenceIds: ['R-E1', 'R-E2'],
        },
      ],
      concerns: [
        {
          claim: 'Limited exposure to heavy production incident volume due to Voltrix\'s small user base [R-E7].',
          evidenceIds: ['R-E7'],
        },
        {
          claim: 'Job description mandates long-term reliability ownership ("not a build it once and move on role"), conflicting with 3 jobs in 3.5 years [R-E8].',
          evidenceIds: ['R-E8'],
        },
      ],
      missingEvidence: [
        'Insufficient evidence on experience directing AI coding agents (Claude Code) in daily development workflows.',
      ],
      keyQuestion: 'Given Cargonet\'s emphasis on long-term on-call reliability, what ensures you will remain committed past the initial build phase?',
    },
    {
      agentId: 'skeptic',
      agentName: 'Skeptic / Risk Evaluator',
      roleTitle: 'Principal Risk & Rigor Auditor',
      recommendation: 'mixed',
      confidence: 88,
      strengths: [
        {
          claim: 'Designed planner-executor-reviewer architectural flow for multi-agent freight exceptions [R-E1, R-E3].',
          evidenceIds: ['R-E1', 'R-E3'],
        },
      ],
      concerns: [
        {
          claim: 'Resume boast discrepancy: claimed "sole architect" on resume [R-E2], but conceded under questioning that Priya built most of the production version [R-E4].',
          evidenceIds: ['R-E2', 'R-E4'],
        },
        {
          claim: 'Absence of testing discipline: tuned routing ad-hoc without formal benchmark studies [R-E6] and lacks oversight on reviewer metrics [R-E5].',
          evidenceIds: ['R-E5', 'R-E6'],
        },
      ],
      missingEvidence: [
        'Insufficient evidence demonstrating root-cause post-mortem ownership during multi-agent cascading failures.',
      ],
      keyQuestion: 'Why did you describe yourself as the "sole architect" on your resume when your colleague authored the majority of the production implementation?',
    },
  ],
  debate: [
    {
      id: 'D1',
      respondingAgent: 'Skeptic / Risk Evaluator',
      speakerRole: 'skeptic',
      targetAgent: 'Hiring Manager',
      targetClaim: 'Hiring Manager initially praised Rohan as a plug-and-play freight agent architect.',
      stance: 'disagree',
      initialPosition: 'Skeptic flagged that Rohan overstated authorship on resume [R-E2].',
      updatedPosition: 'Confirmed serious resume embellishment: Priya built production version [R-E4], and candidate tunes models ad-hoc without evals [R-E6].',
      changedAfterDebate: false,
      explanation: 'The Hiring Manager is overlooking the credibility risk. Rohan claims to be the "sole architect" of Voltrix\'s retry logic [R-E2], but admitted in interview question A7 that Priya built most of the production code [R-E4]. Furthermore, when asked about evals, he confessed to having "no formal study" and only tuning prompts "as things broke" [R-E6]. This is dangerous for a production freight platform.',
      evidenceIds: ['R-E2', 'R-E4', 'R-E6'],
    },
    {
      id: 'D2',
      respondingAgent: 'Hiring Manager',
      speakerRole: 'hiring_manager',
      targetAgent: 'Skeptic / Risk Evaluator',
      targetClaim: 'Skeptic challenged candidate authorship and evaluation rigor [R-E4, R-E6].',
      stance: 'qualify',
      initialPosition: 'Initial View: Rated candidate Strong Yes based on 1-to-1 match with freight planner-executor-reviewer agents [R-E1].',
      updatedPosition: 'Updated View: Conceded and moderated rating to Hold / Mixed after reviewing Skeptic\'s citation of transcript [R-E4] and job-hopping history [R-E8]. Acknowledged candidate did not build production code alone and lacks eval rigor.',
      changedAfterDebate: true,
      explanation: 'I concede the Skeptic\'s point regarding [R-E2] vs [R-E4]. Rohan designing the architecture while Priya implemented it is acceptable, but claiming "sole architect" on the resume was misleading. Combined with his admission of no formal evals [R-E6] and having 3 jobs in 3.5 years [R-E8], I qualify my rating to Hold. Cargonet explicitly needs long-term reliability ownership, not someone who moves fast, ignores evals, and jumps ship.',
      evidenceIds: ['R-E2', 'R-E4', 'R-E6', 'R-E8'],
    },
    {
      id: 'D3',
      respondingAgent: 'Technical Evaluator',
      speakerRole: 'technical',
      targetAgent: 'Skeptic / Risk Evaluator',
      targetClaim: 'Skeptic argued Rohan lacks engineering discipline due to ad-hoc model tuning [R-E6].',
      stance: 'qualify',
      initialPosition: 'Rated Yes highlighting direct LangGraph and multi-agent freight background.',
      updatedPosition: 'Qualified Yes: Candidate possesses relevant domain vocabulary [R-E1], but must be paired with strict eval processes due to poor metric tracking [R-E5].',
      changedAfterDebate: false,
      explanation: 'While the Skeptic is right that ad-hoc tuning [R-E6] and untracked reviewer metrics [R-E5] show immaturity in ML ops, Rohan still has rare experience with the exact planner-executor-reviewer pattern we run [R-E1]. His PR review experience [R-E3] shows he understands agent workflows, even if he didn\'t write all lines himself.',
      evidenceIds: ['R-E1', 'R-E3', 'R-E5', 'R-E6'],
    },
    {
      id: 'D4',
      respondingAgent: 'HR / Culture Evaluator',
      speakerRole: 'culture',
      targetAgent: 'Technical Evaluator',
      targetClaim: 'Technical Evaluator defended candidate\'s agent domain match.',
      stance: 'disagree',
      initialPosition: 'Rated Mixed citing resume inflation and short tenures.',
      updatedPosition: 'Reaffirmed Mixed: The combination of taking sole credit for peer work [R-E4] and leaving jobs for pay/title [R-E8] poses retention risk.',
      changedAfterDebate: false,
      explanation: 'Our JD specifically states: "This is not a build it once and move on role." Rohan\'s history shows three companies in 3.5 years [R-E8], and his willingness to overstate his role over his colleague Priya [R-E4] indicates potential friction in collaborative team settings.',
      evidenceIds: ['R-E4', 'R-E8'],
    },
  ],
  synthesizer: {
    finalRecommendation: 'Hold / Further Interview',
    confidence: 82,
    executiveSummary: 'Rohan Malhotra possesses direct domain familiarity with freight-tech multi-agent systems (planner-executor-reviewer) and cost-routing between SLMs and GPT-4 [R-E1, R-E6]. However, the committee identified significant risks: the candidate admitted on interview record [R-E4] that his resume claim of being "sole architect" [R-E2] was exaggerated since teammate Priya wrote most production code. Furthermore, Rohan operates without formal LLM evals [R-E6], does not monitor reviewer error metrics [R-E5], and has a high turnover history (3 jobs in 3.5 years) [R-E8], conflicting with Cargonet\'s long-term reliability mandate. Recommended for a targeted follow-up technical probe on evaluation rigor and team collaboration.',
    decisiveEvidence: [
      {
        evidenceId: 'R-E4',
        fact: 'Conceded that "sole architect" claim was too strong and colleague Priya built most of the production code.',
        impactOnDecision: 'Diminished confidence in solo technical execution and highlighted resume embellishment risk.',
      },
      {
        evidenceId: 'R-E6',
        fact: 'Tuned model routing ad-hoc as things broke with no formal benchmark study.',
        impactOnDecision: 'Reveals absence of rigorous ML evaluation discipline required for Tier-1 freight operations.',
      },
      {
        evidenceId: 'R-E1',
        fact: 'Designed planner-executor-reviewer exception handling engine for multi-agent freight ops.',
        impactOnDecision: 'Retains candidate in consideration due to exact domain and structural architectural relevance.',
      },
      {
        evidenceId: 'R-E8',
        fact: 'Held 3 roles in 3.5 years, citing compensation and title jumps as main driver.',
        impactOnDecision: 'Creates retention concern against the role\'s requirement for sustained long-term ownership.',
      },
    ],
    strengths: [
      {
        claim: 'Direct hands-on experience designing planner/executor/reviewer multi-agent freight systems [R-E1].',
        evidenceIds: ['R-E1'],
      },
      {
        claim: 'Familiarity with model routing and cost-saving prompt optimization across SLMs and GPT-4 [R-E1].',
        evidenceIds: ['R-E1'],
      },
    ],
    concerns: [
      {
        claim: 'Resume exaggeration: claimed "sole architect" when implementation was done by teammate Priya [R-E2, R-E4].',
        evidenceIds: ['R-E2', 'R-E4'],
      },
      {
        claim: 'Ad-hoc model tuning without systematic evaluation benchmarks or metrics tracking [R-E5, R-E6].',
        evidenceIds: ['R-E5', 'R-E6'],
      },
      {
        claim: 'Short average job tenure (3 roles in 3.5 years) conflicts with long-term reliability ownership [R-E8].',
        evidenceIds: ['R-E8'],
      },
    ],
    unresolvedDisagreements: [
      {
        topic: 'Domain Keywords vs Production Engineering Rigor',
        conflictSummary: 'The Technical Evaluator notes Rohan has direct freight agent experience [R-E1], while the Skeptic and HR Evaluator note that without evaluation rigor [R-E6] and genuine team accountability [R-E4], domain keywords alone do not guarantee production reliability.',
        citedEvidenceIds: ['R-E1', 'R-E4', 'R-E6'],
      },
    ],
    recommendedFollowUpQuestions: [
      'Can you walk us through how you would set up a quantitative eval pipeline (e.g. golden dataset) to measure planner accuracy before shipping prompt updates?',
      'Given that Priya built the majority of the production retry engine, what specific edge cases or failure modes did you personally debug in production?',
      'What would keep you at Cargonet beyond the 12-month mark given your history of short tenures?',
    ],
  },
};

export const DEMO_RESPONSE_B: EvaluationResponse = {
  success: true,
  candidateId: 'candidate_b',
  candidateName: 'Ananya Iyer',
  mode: 'mock',
  modelUsed: 'Built-in Grounded Multi-Agent Mock Engine',
  timestamp: new Date().toISOString(),
  candidateProfile: {
    name: 'Ananya Iyer',
    currentRole: 'Software Engineer II (Backend → AI) at Bridgepoint Systems',
    summary: 'Backend and AI engineer with 6 years of tenure at Bridgepoint Systems. Built internal RAG support assistant (LangChain + Chroma), OCR document ingestion pipelines, and instituted team pre-deploy prompt eval checklists.',
    skills: ['Python', 'FastAPI', 'MongoDB', 'PostgreSQL', 'LangChain', 'Chroma', 'OCR (Tesseract)', 'Prompt Eval Checklists', 'Docker'],
  },
  evidenceBank: DEMO_EVIDENCE_BANK_B,
  evaluators: [
    {
      agentId: 'technical',
      agentName: 'Technical Evaluator',
      roleTitle: 'Principal Systems Architect',
      recommendation: 'mixed',
      confidence: 86,
      strengths: [
        {
          claim: 'Solid Python/FastAPI microservices foundation with MongoDB and document OCR pipeline experience matching Cargonet stack [A-E1, A-E2].',
          evidenceIds: ['A-E1', 'A-E2'],
        },
        {
          claim: 'Pragmatic codebase-first ramp-up plan: focuses on reading real failure patterns and pairing on bug fixes before touching architecture [A-E6].',
          evidenceIds: ['A-E6'],
        },
      ],
      concerns: [
        {
          claim: 'No production multi-agent framework experience (LangGraph, CrewAI); all shipped work is single-agent RAG [A-E3, A-E5].',
          evidenceIds: ['A-E3', 'A-E5'],
        },
      ],
      missingEvidence: [
        'Insufficient evidence on working with automated AI coding assistants (Claude Code) in daily development.',
        'Insufficient evidence on direct freight carrier API (EDI/TMS) experience.',
      ],
      keyQuestion: 'How would you adapt your single-agent RAG pipeline into a multi-agent coordinator with specialized tools for carrier rate lookups?',
    },
    {
      agentId: 'culture',
      agentName: 'HR / Culture Evaluator',
      roleTitle: 'VP of People & Culture',
      recommendation: 'strong_yes',
      confidence: 94,
      strengths: [
        {
          claim: 'Exemplary intellectual honesty: proactively refused to overstate informal 40% accuracy estimates as a rigorous benchmark [A-E4].',
          evidenceIds: ['A-E4'],
        },
        {
          claim: 'Flawless mistake ownership and psychological safety: publicly took blame for prompt incident in retro and instituted team-wide pre-deploy checklist [A-E7].',
          evidenceIds: ['A-E7'],
        },
        {
          claim: 'Strong loyalty and steady adaptability: 6 years at Bridgepoint Systems growing from junior backend to AI lead [A-E8].',
          evidenceIds: ['A-E8'],
        },
      ],
      concerns: [],
      missingEvidence: [
        'Insufficient evidence regarding public speaking or presenting at industry conferences.',
      ],
      keyQuestion: 'When introducing new eval checklists to a fast-moving engineering team, how do you prevent the process from feeling like bureaucratic overhead?',
    },
    {
      agentId: 'hiring_manager',
      agentName: 'Hiring Manager',
      roleTitle: 'Director of Platform Engineering',
      recommendation: 'yes',
      confidence: 90,
      strengths: [
        {
          claim: 'True production ownership mindset: responded to outage by building enduring team guardrails (eval sets & review checklists) [A-E2, A-E7].',
          evidenceIds: ['A-E2', 'A-E7'],
        },
        {
          claim: 'Exact fit for Cargonet\'s long-term reliability philosophy ("not a build it once and move on role") [A-E8].',
          evidenceIds: ['A-E8'],
        },
      ],
      concerns: [
        {
          claim: 'Requires ramp-up on multi-agent state machines compared to a candidate who has already touched LangGraph [A-E3, A-E5].',
          evidenceIds: ['A-E3', 'A-E5'],
        },
      ],
      missingEvidence: [
        'Insufficient evidence on direct experience interfacing with freight carrier APIs (EDI/TMS).',
      ],
      keyQuestion: 'Given your strong backend foundation, how many weeks do you anticipate needing before you can comfortably own on-call rotations for multi-agent errors?',
    },
    {
      agentId: 'skeptic',
      agentName: 'Skeptic / Risk Evaluator',
      roleTitle: 'Principal Risk & Rigor Auditor',
      recommendation: 'yes',
      confidence: 92,
      strengths: [
        {
          claim: 'Zero resume embellishment: included explicit resume note acknowledging lack of multi-agent production experience [A-E3].',
          evidenceIds: ['A-E3'],
        },
        {
          claim: 'High verification integrity: openly admitted prompt mistake and refused to shift blame onto process gaps [A-E7].',
          evidenceIds: ['A-E7'],
        },
      ],
      concerns: [
        {
          claim: 'Has only operated within one company culture for 6 years, which may require brief adjustment to a startup pace [A-E8].',
          evidenceIds: ['A-E8'],
        },
      ],
      missingEvidence: [
        'Insufficient evidence regarding handling high-throughput concurrency spikes in Python async microservices.',
      ],
      keyQuestion: 'What technical trade-offs did you evaluate when deciding between Chroma vs Pinecone for vector retrieval in your support assistant?',
    },
  ],
  debate: [
    {
      id: 'D1',
      respondingAgent: 'Technical Evaluator',
      speakerRole: 'technical',
      targetAgent: 'HR / Culture Evaluator',
      targetClaim: 'HR Evaluator rated Ananya Strong Yes based on radical candor and incident retro ownership [A-E4, A-E7].',
      stance: 'qualify',
      initialPosition: 'Initial View: Rated candidate Mixed (86% confidence) because Ananya has zero production multi-agent framework experience [A-E3, A-E5].',
      updatedPosition: 'Updated View: Conceded and revised rating from Mixed to Yes (90% confidence). Recognized that Ananya\'s strong Python/FastAPI/OCR fundamentals [A-E1], codebase-first ramp-up plan [A-E6], and verified incident eval discipline [A-E7] make her a superior long-term engineering investment.',
      changedAfterDebate: true,
      explanation: 'I initially hesitated because Cargonet uses multi-agent LangGraph on day one and Ananya has only shipped single-agent RAG [A-E3, A-E5]. However, looking at how she approaches ramp-up — studying failure patterns in real code and pairing on bug fixes [A-E6] — plus her proven eval discipline after an outage [A-E7], I am convinced her Python and OCR fundamentals [A-E1] will allow her to master multi-agent orchestration within weeks. I shift my position from Mixed to Yes.',
      evidenceIds: ['A-E1', 'A-E3', 'A-E5', 'A-E6', 'A-E7'],
    },
    {
      id: 'D2',
      respondingAgent: 'Skeptic / Risk Evaluator',
      speakerRole: 'skeptic',
      targetAgent: 'Hiring Manager',
      targetClaim: 'Hiring Manager weighed whether Ananya\'s lack of multi-agent experience is a hiring blocker.',
      stance: 'agree',
      initialPosition: 'Skeptic confirmed candidate is exceptionally grounded and low-risk.',
      updatedPosition: 'Reaffirmed Yes: Candidate represents zero resume inflation risk and high verified accountability.',
      changedAfterDebate: false,
      explanation: 'Ananya is the exact opposite of resume-inflated candidates. She put an explicit disclaimer on her resume stating she hasn\'t done multi-agent in production [A-E3], refused to exaggerate informal accuracy numbers [A-E4], and took full public ownership of a production outage [A-E7]. In hiring for reliability, integrity and eval discipline beat unverified buzzwords every time.',
      evidenceIds: ['A-E3', 'A-E4', 'A-E7'],
    },
    {
      id: 'D3',
      respondingAgent: 'HR / Culture Evaluator',
      speakerRole: 'culture',
      targetAgent: 'Technical Evaluator',
      targetClaim: 'Technical Evaluator questioned 6-year single-company tenure adapting to startup speed.',
      stance: 'qualify',
      initialPosition: 'Strong Yes based on culture and psychological safety.',
      updatedPosition: 'Reaffirmed Strong Yes: Candidate proved internal career agility by evolving through 3 distinct roles and technologies at Bridgepoint [A-E8].',
      changedAfterDebate: false,
      explanation: 'Staying at Bridgepoint for 6 years was not stagnation; Ananya progressed from junior backend APIs to leading document OCR migrations, to independently introducing AI into their support operations [A-E8]. She has proven she can continuously reinvent her technical domain while building deep trust.',
      evidenceIds: ['A-E1', 'A-E2', 'A-E8'],
    },
  ],
  synthesizer: {
    finalRecommendation: 'Strong Yes',
    confidence: 91,
    executiveSummary: 'Ananya Iyer is strongly recommended for hire as AI Engineer at Cargonet AI. While she has not shipped multi-agent systems in production [A-E3, A-E5], she possesses solid Python/FastAPI backend skills, document OCR experience, and vector search mastery matching Cargonet\'s core technical requirements [A-E1]. During the debate stage, the Technical Evaluator shifted their rating from Mixed to Yes after recognizing that Ananya\'s pragmatic codebase-first ramp-up strategy [A-E6] and proven eval discipline [A-E7] provide a reliable foundation. Her radical honesty [A-E4], transparent mistake ownership [A-E7], and 6-year history of continuous technical evolution [A-E8] perfectly align with Cargonet\'s core philosophy: "We care as much about keeping things working reliably over time as we do about building the first version."',
    decisiveEvidence: [
      {
        evidenceId: 'A-E7',
        fact: 'Owned unreviewed prompt incident, ran team retro without shifting blame, and instituted pre-deploy eval sets and review checklists.',
        impactOnDecision: 'Proves high production accountability and eval discipline, directly fulfilling the core requirement to keep live agent systems running reliably.',
      },
      {
        evidenceId: 'A-E4',
        fact: 'Proactively clarified that 40% accuracy improvement was informal spot-checking and refused to over-claim it as rigorous.',
        impactOnDecision: 'Validates exceptional intellectual honesty and verifiable engineering standards.',
      },
      {
        evidenceId: 'A-E6',
        fact: 'Articulated a concrete ramp-up plan: analyzing failure modes in existing code and pairing on bug fixes before modifying agent architecture.',
        impactOnDecision: 'Convinced Technical Evaluator to revise rating to Yes, confirming rapid onboarding capability.',
      },
      {
        evidenceId: 'A-E1',
        fact: 'Built Python/FastAPI microservices, MongoDB backends, OCR ingestion pipelines, and Chroma RAG assistants.',
        impactOnDecision: 'Verifies solid foundation matching Cargonet\'s Python, MongoDB, and document scanning tech stack.',
      },
    ],
    strengths: [
      {
        claim: 'Exemplary production accountability: turns outages into team-wide eval checklists and review guardrails [A-E2, A-E7].',
        evidenceIds: ['A-E2', 'A-E7'],
      },
      {
        claim: 'Solid Python, FastAPI, MongoDB, and document OCR skills matching Cargonet\'s core architecture [A-E1].',
        evidenceIds: ['A-E1'],
      },
      {
        claim: 'High transparency and intellectual honesty regarding AI benchmarks and skill boundaries [A-E3, A-E4, A-E5].',
        evidenceIds: ['A-E3', 'A-E4', 'A-E5'],
      },
    ],
    concerns: [
      {
        claim: 'Day-one gap on multi-agent frameworks (LangGraph/CrewAI) requires a 2-3 week ramp-up period [A-E3, A-E5].',
        evidenceIds: ['A-E3', 'A-E5'],
      },
    ],
    unresolvedDisagreements: [],
    recommendedFollowUpQuestions: [
      'In your first 30 days, what specific metrics or assertions would you add to Cargonet\'s pre-deploy eval suite for shipping document extraction?',
      'How would you structure a pair-programming session with an engineer to debug an intermittent tool-calling loop in a freight booking agent?',
      'Walk through how you would decompose a single-agent RAG system into a planner/executor/reviewer architecture for freight quoting.',
    ],
  },
};

export const DEMO_OVERLAY_ITEMS: IdealFitOverlayItem[] = [
  {
    capability: 'Multi-Agent State Orchestration (Planner-Executor-Reviewer)',
    idealRequirement: 'Build & debug multi-worker agent workflows with specialized retry/escalation and error containment.',
    jobEvidenceIds: ['J-E1', 'J-E2'],
    rohanEvidence: 'Designed planner-executor-reviewer freight engine [R-E1], but admitted Priya built most of production code [R-E4].',
    rohanEvidenceIds: ['R-E1', 'R-E4'],
    rohanReadiness: 'Demonstrated',
    ananyaEvidence: 'Shipped single-agent RAG in production; built toy planner/executor on personal time [A-E3, A-E5].',
    ananyaEvidenceIds: ['A-E3', 'A-E5'],
    ananyaReadiness: 'Partial / needs validation',
    takeaway: 'Rohan has direct architectural familiarity, though implementation was co-authored; Ananya requires a 2-3 week ramp-up.',
  },
  {
    capability: 'Python Backend, APIs & MongoDB Microservices',
    idealRequirement: 'Build scalable Python microservices, APIs, and clean data stores for freight operations.',
    jobEvidenceIds: ['J-E3'],
    rohanEvidence: 'Built Python microservices for 50+ enterprise SaaS clients and Voltrix exception handling [R-E1].',
    rohanEvidenceIds: ['R-E1'],
    rohanReadiness: 'Demonstrated',
    ananyaEvidence: '4+ years building and maintaining Python/FastAPI microservices and MongoDB backends at Bridgepoint [A-E1].',
    ananyaEvidenceIds: ['A-E1'],
    ananyaReadiness: 'Demonstrated',
    takeaway: 'Both candidates demonstrate full production competence in Python microservices and MongoDB.',
  },
  {
    capability: 'Prompting, RAG, Model Routing & Evaluation Maturity',
    idealRequirement: 'Design context search (RAG), cost-vs-quality model routing, and quantitative evaluation test suites.',
    jobEvidenceIds: ['J-E4', 'J-E5'],
    rohanEvidence: 'RAG over carrier rates [R-E1]; tuned model routing ad-hoc without formal evals [R-E6] and lacks reviewer metric tracking [R-E5].',
    rohanEvidenceIds: ['R-E1', 'R-E5', 'R-E6'],
    rohanReadiness: 'Partial / needs validation',
    ananyaEvidence: 'Built Chroma RAG pipeline [A-E1]; instituted pre-deploy eval sets and review checklists after outage [A-E7]; refused to overstate informal accuracy [A-E4].',
    ananyaEvidenceIds: ['A-E1', 'A-E4', 'A-E7'],
    ananyaReadiness: 'Demonstrated',
    takeaway: 'Ananya demonstrates superior eval discipline and testing rigor; Rohan operates ad-hoc without benchmarks.',
  },
  {
    capability: 'Production Reliability, Monitoring & On-Call Ownership',
    idealRequirement: 'Take ownership when agents misbehave in live production; maintain long-term system stewardship.',
    jobEvidenceIds: ['J-E5', 'J-E7', 'J-E8'],
    rohanEvidence: 'Has done on-call but small user base means low incident volume [R-E7]; 3 roles in 3.5 years for title/pay [R-E8].',
    rohanEvidenceIds: ['R-E7', 'R-E8'],
    rohanReadiness: 'Partial / needs validation',
    ananyaEvidence: 'Directly owned production prompt outage, wrote transparent post-mortem, and instituted guardrails [A-E7]; 6-year tenure of continuous growth [A-E8].',
    ananyaEvidenceIds: ['A-E7', 'A-E8'],
    ananyaReadiness: 'Demonstrated',
    takeaway: 'Ananya embodies the "not build it once and move on" requirement; Rohan presents retention and incident response risks.',
  },
  {
    capability: 'Freight Logistics, Carrier APIs & Document OCR Ingestion',
    idealRequirement: 'Integrate external carrier/shipping APIs and OCR scanning for freight invoices and bills of lading.',
    jobEvidenceIds: ['J-E2', 'J-E6'],
    rohanEvidence: 'Direct freight exception ops and BOL/invoice rate document RAG [R-E1].',
    rohanEvidenceIds: ['R-E1'],
    rohanReadiness: 'Demonstrated',
    ananyaEvidence: 'Migrated document ingestion pipeline to OCR-based extraction for scanned forms [A-E1]. Insufficient freight carrier API evidence.',
    ananyaEvidenceIds: ['A-E1'],
    ananyaReadiness: 'Partial / needs validation',
    takeaway: 'Rohan has specific freight domain context; Ananya brings general document OCR pipeline experience.',
  },
  {
    capability: 'React Front-End Operator Screens',
    idealRequirement: 'Build clean features and easy-to-use screens in React.js for human operations coordinators.',
    jobEvidenceIds: ['J-E3'],
    rohanEvidence: 'Lists "React (basic)" on resume; insufficient shipped UI evidence.',
    rohanEvidenceIds: [],
    rohanReadiness: 'Partial / needs validation',
    ananyaEvidence: 'Lists "basic React" on resume; insufficient shipped UI evidence.',
    ananyaEvidenceIds: [],
    ananyaReadiness: 'Partial / needs validation',
    takeaway: 'Both candidates possess basic React knowledge, requiring minor support for complex UI workflows.',
  },
];

export const DEMO_BATCH_RESPONSE: BatchEvaluationResponse = {
  success: true,
  mode: 'mock',
  modelUsed: 'Built-in Grounded Multi-Agent Mock Engine',
  timestamp: new Date().toISOString(),
  blueprint: DEMO_BLUEPRINT,
  results: {
    candidate_a: DEMO_RESPONSE_A,
    candidate_b: DEMO_RESPONSE_B,
  },
  comparison: {
    summary: 'Candidate B (Ananya Iyer) receives a "Strong Yes" (91% confidence) and is the recommended primary hire for Cargonet AI. Candidate A (Rohan Malhotra) receives a "Hold / Further Interview" (82% confidence). While Rohan has direct freight multi-agent experience on paper [R-E1], interview probing revealed significant resume inflation ("sole architect" debunked by Priya writing production code [R-E4]), zero eval rigor (tunes models ad-hoc as things break [R-E6]), and job-hopping risk (3 jobs in 3.5 years [R-E8]). In contrast, Ananya exhibits radical candor [A-E3, A-E4], exemplary incident ownership and eval discipline [A-E7], and long-term commitment [A-E8], perfectly embodying Cargonet AI\'s core requirement: "We care as much about keeping things working reliably over time as we do about building the first version."',
    keyDifferentiators: [
      'Production Ownership & Eval Discipline: Ananya responded to a production incident by establishing team-wide eval sets and pre-deploy checklists [A-E7]. Rohan tunes models ad-hoc "as things broke" with no formal benchmarks and does not track reviewer metrics [R-E5, R-E6].',
      'Resume Credibility & Candor: Ananya proactively added a disclaimer on her resume regarding her multi-agent gap [A-E3] and clarified informal metrics [A-E4]. Rohan claimed "sole architect" on his resume [R-E2], but admitted in the interview that colleague Priya built most of the production code [R-E4].',
      'Role Alignment & Retention: Cargonet explicitly warns "this is not a build it once and move on role." Ananya spent 6 years adapting and growing at Bridgepoint [A-E8], while Rohan has switched 3 jobs in 3.5 years for title and pay [R-E8].',
      'Debate Shifts: In Candidate A\'s debate, the Hiring Manager conceded to the Skeptic and downgraded Rohan from Strong Yes to Hold after the Priya authorship gap was exposed [R-E4]. In Candidate B\'s debate, the Technical Evaluator upgraded Ananya from Mixed to Yes after recognizing her pragmatic ramp-up plan [A-E6] and eval rigor [A-E7].',
    ],
    hiringRecommendation: 'Primary Recommendation: Hire Ananya Iyer (Candidate B). Her exceptional accountability, eval mindset, and Python/OCR foundation make her the reliable long-term engineer Cargonet AI needs. Pass or Hold on Rohan Malhotra (Candidate A) due to resume credibility and lack of eval discipline.',
  },
};
