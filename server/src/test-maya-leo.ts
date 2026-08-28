import { runBatchEvaluationPipeline } from './services/pipelineService.js';
import { BatchEvaluationInput } from './types.js';

// Maya Sen & Leo Ortiz test pack
const MAYA_SEN_RESUME = `Maya Sen
Senior AI Engineer | Systems Architect
San Francisco, CA | maya.sen@example.com

SUMMARY
Full-stack AI systems engineer with 5+ years of experience architecting distributed agent workflows, RAG retrieval pipelines, and high-throughput Python backends.

EXPERIENCE
Lead AI Engineer — Apex Intelligence (2022 – Present)
• Architected multi-agent autonomous triage pipeline utilizing LangGraph and FastAPI processing 12,000+ support tickets daily.
• Implemented hybrid RAG search across 2M+ customer documents using Qdrant vector database and hybrid BM25 re-ranking.
• Reduced model inference latency by 45% through dynamic semantic caching and small-model routing (Llama-3-8B fallback to GPT-4o).
• Led on-call rotation for platform AI services with 99.95% uptime SLA and structured blameless post-mortem culture.

Software Engineer — CloudScale Systems (2019 – 2022)
• Developed asynchronous microservices in Python and MongoDB for real-time telemetry analytics.
• Built internal operator dashboards with React and TypeScript for workflow monitoring.
• Designed automated test suites achieving 92% code coverage with pytest and GitHub Actions.

SKILLS
Python, FastAPI, TypeScript, React, MongoDB, PostgreSQL, Docker, Kubernetes, LangGraph, Qdrant, RAG, PyTorch, CI/CD`;

const MAYA_SEN_TRANSCRIPT = `Interviewer: Thanks for joining, Maya. Can you describe how you architected the multi-agent triage system at Apex?
Maya Sen: Certainly. We decomposed the triage workflow into a planner-executor-evaluator pattern. The planner agent parses incoming user tickets, identifies intent, and delegates tasks to specialized sub-agents. The reviewer agent verifies proposed actions against our safety and business policies before executing any database write.
Interviewer: What happened when a model hallucinated or produced an unexpected output?
Maya Sen: We designed deterministic guardrails and fallback circuits. If the reviewer agent flags confidence below 0.85, the ticket automatically diverts to human-in-the-loop triage. We also maintained a golden evaluation benchmark dataset of 500 edge cases that we ran before every prompt or model update.
Interviewer: Have you worked directly with React and operator interfaces?
Maya Sen: Yes, I built our internal operator review dashboard in React with Tailwind CSS so support leads could inspect agent traces in real time.`;

const LEO_ORTIZ_RESUME = `Leo Ortiz
Backend & Machine Learning Engineer
Austin, TX | leo.ortiz@example.com

SUMMARY
Backend engineer specialized in Python microservices, distributed data processing pipelines, and production LLM integrations.

EXPERIENCE
Senior Backend Engineer — DataPulse Labs (2021 – Present)
• Built Python and FastAPI microservices for enterprise document parsing and structured extraction pipelines.
• Integrated OCR models and LLMs to process PDF financial invoices with 98.2% field extraction precision.
• Managed MongoDB and Redis caching layer handling 3,500 requests/second at peak load.
• Established automated unit testing and integration test suites using pytest and Docker containers.

Software Engineer — Nexus Operations (2018 – 2021)
• Maintained legacy Python web applications and migrated core endpoints to RESTful microservices.
• Integrated third-party webhook integrations and payment processor APIs.
• Participated in weekly production on-call rotation and resolved infrastructure incidents.

SKILLS
Python, FastAPI, Docker, MongoDB, Redis, PostgreSQL, LangChain, OCR, Machine Learning, REST API, Git, Linux`;

const LEO_ORTIZ_TRANSCRIPT = `Interviewer: Welcome Leo. Could you explain your experience with LLMs and document processing at DataPulse?
Leo Ortiz: At DataPulse, I owned our document ingestion engine. We took raw PDF invoices, extracted text and bounding boxes using OCR, and piped normalized chunks into a single-agent RAG pipeline using LangChain and PostgreSQL pgvector.
Interviewer: Have you deployed multi-agent coordinator frameworks in production?
Leo Ortiz: In production, our systems have been single-agent chains. I have built prototype multi-agent pipelines using CrewAI in my personal lab, but I am transparent that multi-agent production deployment would be a ramp-up area for me of about 2 weeks.
Interviewer: How do you handle production incidents when on-call?
Leo Ortiz: I take operational ownership seriously. When a parser crashed during a weekend release due to an unhandled PDF formatting edge case, I rolled back within 10 minutes, wrote regression tests the next morning, and added pre-deploy document schema validation.`;

async function runVerification() {
  console.log('====================================================');
  console.log(' RUNNING AUTOMATED VERIFICATION: Maya Sen vs Leo Ortiz');
  console.log('====================================================\n');

  const testPayload: BatchEvaluationInput = {
    jobTitle: 'Senior AI Engineer — Agentic Systems',
    jobRequirements: 'Seeking an AI Engineer with Python backend expertise, multi-agent systems experience, and production ownership.',
    candidates: [
      {
        id: 'candidate_a',
        candidateName: 'Maya Sen',
        resumeText: MAYA_SEN_RESUME,
        transcriptText: MAYA_SEN_TRANSCRIPT,
      },
      {
        id: 'candidate_b',
        candidateName: 'Leo Ortiz',
        resumeText: LEO_ORTIZ_RESUME,
        transcriptText: LEO_ORTIZ_TRANSCRIPT,
      },
    ],
  };

  const response = await runBatchEvaluationPipeline(testPayload);

  console.log(`Pipeline Status: ${response.success ? 'SUCCESS' : 'FAILED'}`);
  console.log(`Pipeline Mode: ${response.mode}`);
  console.log(`Model / Engine Used: ${response.modelUsed}\n`);

  const resultA = response.results['candidate_a'];
  const resultB = response.results['candidate_b'];

  const stringifiedOutput = JSON.stringify(response);

  let passed = true;

  // Check 1: Maya Sen appears in candidate A profile and results
  if (resultA?.candidateProfile.name === 'Maya Sen') {
    console.log('✓ CHECK 1 PASSED: Candidate A extracted name is "Maya Sen"');
  } else {
    console.error(`✗ CHECK 1 FAILED: Expected Maya Sen, got ${resultA?.candidateProfile.name}`);
    passed = false;
  }

  // Check 2: Leo Ortiz appears in candidate B profile and results
  if (resultB?.candidateProfile.name === 'Leo Ortiz') {
    console.log('✓ CHECK 2 PASSED: Candidate B extracted name is "Leo Ortiz"');
  } else {
    console.error(`✗ CHECK 2 FAILED: Expected Leo Ortiz, got ${resultB?.candidateProfile.name}`);
    passed = false;
  }

  // Check 3: Rohan Malhotra and Ananya Iyer do NOT appear anywhere
  const hasRohan = /Rohan\s*Malhotra/i.test(stringifiedOutput);
  const hasAnanya = /Ananya\s*Iyer/i.test(stringifiedOutput);
  const hasPriya = /Priya/i.test(stringifiedOutput);
  const hasVoltrix = /Voltrix/i.test(stringifiedOutput);

  if (!hasRohan && !hasAnanya && !hasPriya && !hasVoltrix) {
    console.log('✓ CHECK 3 PASSED: Zero occurrences of Rohan, Ananya, Priya, or Voltrix in output');
  } else {
    console.error(`✗ CHECK 3 FAILED: Found legacy demo names in output! (Rohan: ${hasRohan}, Ananya: ${hasAnanya}, Priya: ${hasPriya}, Voltrix: ${hasVoltrix})`);
    passed = false;
  }

  // Check 4: Evidence quotes match Maya Sen and Leo Ortiz inputs exactly
  const mayaQuotes = resultA?.evidenceBank.map((e) => e.exactQuote) || [];
  const leoQuotes = resultB?.evidenceBank.map((e) => e.exactQuote) || [];

  const mayaQuotesValid = mayaQuotes.every(
    (q) => MAYA_SEN_RESUME.includes(q) || MAYA_SEN_TRANSCRIPT.includes(q)
  );
  const leoQuotesValid = leoQuotes.every(
    (q) => LEO_ORTIZ_RESUME.includes(q) || LEO_ORTIZ_TRANSCRIPT.includes(q)
  );

  if (mayaQuotesValid && leoQuotesValid && mayaQuotes.length > 0 && leoQuotes.length > 0) {
    console.log(`✓ CHECK 4 PASSED: All evidence quotes (${mayaQuotes.length} for Maya, ${leoQuotes.length} for Leo) strictly match uploaded text`);
  } else {
    console.error(`✗ CHECK 4 FAILED: Evidence quotes do not match input text`);
    passed = false;
  }

  // Check 5: Evidence IDs are newly generated with candidate prefixes (A-E*, B-E*)
  const allAIds = resultA?.evidenceBank.map((e) => e.id) || [];
  const allBIds = resultB?.evidenceBank.map((e) => e.id) || [];

  const aPrefixValid = allAIds.every((id) => id.startsWith('A-E'));
  const bPrefixValid = allBIds.every((id) => id.startsWith('B-E'));

  if (aPrefixValid && bPrefixValid && allAIds.length > 0 && allBIds.length > 0) {
    console.log(`✓ CHECK 5 PASSED: Candidate-prefixed evidence IDs generated: Maya (${allAIds.join(', ')}), Leo (${allBIds.join(', ')})`);
  } else {
    console.error(`✗ CHECK 5 FAILED: Invalid evidence IDs`);
    passed = false;
  }

  // Check 6: Final comparison references Maya Sen and Leo Ortiz
  const comparisonSummary = response.comparison?.summary || '';
  const comparisonDiffs = response.comparison?.keyDifferentiators.join(' ') || '';
  const comparisonHasMaya = comparisonSummary.includes('Maya') || comparisonDiffs.includes('Maya');
  const comparisonHasLeo = comparisonSummary.includes('Leo') || comparisonDiffs.includes('Leo');

  if (comparisonHasMaya && comparisonHasLeo) {
    console.log('✓ CHECK 6 PASSED: Final comparison summary and differentiators reference Maya Sen and Leo Ortiz');
  } else {
    console.error('✗ CHECK 6 FAILED: Comparison does not reference Maya and Leo');
    passed = false;
  }

  console.log('\n====================================================');
  if (passed) {
    console.log(' 🎉 ALL AUTOMATED VERIFICATION CHECKS PASSED SUCCESSFULLY!');
  } else {
    console.error(' ❌ SOME VERIFICATION CHECKS FAILED');
    process.exit(1);
  }
  console.log('====================================================\n');
}

runVerification().catch((err) => {
  console.error('Verification script crashed:', err);
  process.exit(1);
});
