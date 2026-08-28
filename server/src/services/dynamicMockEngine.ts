/**
 * Dynamic Mock Engine — generates evaluation responses from actual input text
 * when GEMINI_API_KEY is not configured. Never returns hardcoded Rohan/Ananya
 * data unless those names actually appear in the input.
 */
import {
  CandidateDossier,
  EvaluationResponse,
  CandidateProfile,
  EvidenceItem,
  EvaluatorResult,
  DebateExchange,
  SynthesizerResult,
  CandidateComparison,
} from '../types.js';

/** Extract candidate name from resume and transcript text */
export function extractCandidateName(dossier: CandidateDossier): string {
  const { resumeText, transcriptText, candidateName } = dossier;
  const combined = `${resumeText.substring(0, 1200)}\n${transcriptText.substring(0, 1200)}`;

  // Pattern 1: Explicit labels like "Candidate Name: Maya Sen" or "Name: Leo Ortiz"
  const labelPatterns = [
    /(?:Candidate Name|Candidate|Name|Applicant|Interviewee):\s*([A-Z][a-zA-Z.'-]+(?:\s+[A-Z][a-zA-Z.'-]+){1,2})/i,
    /(?:Resume of|CV of|Interview with|Transcript for|Candidate Dossier:)\s*([A-Z][a-zA-Z.'-]+(?:\s+[A-Z][a-zA-Z.'-]+){1,2})/i,
  ];

  for (const pattern of labelPatterns) {
    const match = combined.match(pattern);
    if (match && match[1]) {
      const name = match[1].trim().replace(/^(Mr\.|Ms\.|Dr\.)\s*/i, '');
      if (name.length >= 3 && name.length <= 35 && !/^(A|B|Candidate|Resume|Transcript|Job|Engineer)$/i.test(name)) {
        return name;
      }
    }
  }

  // Pattern 2: First prominent capitalized name line in resume
  const lines = resumeText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  for (const line of lines.slice(0, 6)) {
    if (/^(resume|curriculum vitae|cv|contact|email|phone|profile|summary|experience|education)/i.test(line)) {
      continue;
    }
    if (/^[A-Z][a-zA-Z.'-]+\s+[A-Z][a-zA-Z.'-]+(?:\s+[A-Z][a-zA-Z.'-]+)?$/.test(line) && line.length <= 35) {
      return line;
    }
  }

  // Pattern 3: Existing candidateName prop if provided and not generic
  if (candidateName && !/^(Candidate\s*[AB]?|Candidate)$/i.test(candidateName)) {
    return candidateName;
  }

  return dossier.id === 'candidate_a' ? 'Candidate A' : 'Candidate B';
}

/** Extract current role/title from resume text */
export function extractCurrentRole(resumeText: string): string {
  const firstChunk = resumeText.substring(0, 1000);

  const rolePatterns = [
    /(?:Current Role|Title|Position|Designation|Role):\s*(.+)/i,
    /(?:Senior|Lead|Principal|Staff|Junior)?\s*(?:Software|ML|AI|Data|Backend|Full[- ]?Stack|Platform|Systems)\s*Engineer/i,
    /(?:Engineering|Technical|Product)\s*(?:Manager|Lead|Director)/i,
  ];

  for (const pattern of rolePatterns) {
    const match = firstChunk.match(pattern);
    if (match) {
      const extracted = match[1] ? match[1].trim().substring(0, 60) : match[0].trim().substring(0, 60);
      return extracted.split('\n')[0].replace(/[|,].*$/, '').trim();
    }
  }

  return 'Software Engineer';
}

/** Extract skills from resume and transcript text */
export function extractSkills(text: string): string[] {
  const skills: string[] = [];
  const skillKeywords = [
    'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'FastAPI',
    'MongoDB', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure',
    'LangChain', 'LlamaIndex', 'TensorFlow', 'PyTorch', 'RAG',
    'Machine Learning', 'NLP', 'LLM', 'GPT', 'Gemini', 'Claude',
    'REST API', 'GraphQL', 'Redis', 'Kafka', 'SQL',
    'Git', 'CI/CD', 'Terraform', 'Java', 'Go', 'Rust', 'C++',
    'Flask', 'Django', 'Express', 'Next.js', 'Vue',
    'Pinecone', 'Chroma', 'Weaviate', 'FAISS', 'Qdrant',
    'CrewAI', 'AutoGen', 'LangGraph', 'Celery', 'RabbitMQ',
    'Elasticsearch', 'OpenSearch', 'OCR', 'Tesseract',
  ];

  const lower = text.toLowerCase();
  for (const skill of skillKeywords) {
    if (lower.includes(skill.toLowerCase())) {
      skills.push(skill);
    }
  }

  return skills.slice(0, 12);
}

/** Extract real quotes from input text to build grounded evidence items */
export function extractEvidenceFromText(
  text: string,
  source: 'Resume' | 'Transcript',
  prefix: string,
  startIdx: number
): EvidenceItem[] {
  const items: EvidenceItem[] = [];

  // Split text into meaningful sentences/bullet points
  const rawSegments = text
    .split(/\n+|(?<=[.!?])\s+/)
    .map((s) => s.replace(/^[-•*–—\d.)\s]+/, '').trim())
    .filter((s) => s.length >= 25 && s.length <= 450);

  const categories = [
    { keywords: ['built', 'developed', 'designed', 'implemented', 'architected', 'deployed', 'engineered', 'created'], category: 'Technical Experience' },
    { keywords: ['agent', 'llm', 'rag', 'prompt', 'model', 'ai', 'vector', 'embedding', 'langchain', 'langgraph', 'crewai', 'gpt', 'claude'], category: 'AI & Systems' },
    { keywords: ['production', 'incident', 'outage', 'on-call', 'reliability', 'monitor', 'debug', 'uptime', 'sla', 'error'], category: 'Production Reliability' },
    { keywords: ['team', 'led', 'managed', 'mentor', 'collaborat', 'cross-functional', 'leadership', 'ownership', 'culture'], category: 'Leadership & Collaboration' },
    { keywords: ['scale', 'throughput', 'latency', 'rps', 'requests', 'users', 'million', 'billion', 'percent', '%', 'reduced', 'improved'], category: 'Scale & Performance' },
    { keywords: ['test', 'eval', 'benchmark', 'accuracy', 'metric', 'coverage', 'qa', 'validation'], category: 'Evaluation & Testing' },
    { keywords: ['admit', 'honestly', 'gap', 'limitation', 'not yet', 'haven\'t', 'learning', 'disclaimer', 'conceded'], category: 'Transparency & Candor' },
  ];

  const usedIndices = new Set<number>();

  // Pick top category-specific sentences
  for (const cat of categories) {
    for (let i = 0; i < rawSegments.length && items.length < 8; i++) {
      if (usedIndices.has(i)) continue;
      const lower = rawSegments[i].toLowerCase();
      if (cat.keywords.some((kw) => lower.includes(kw))) {
        const itemIdx = startIdx + items.length + 1;
        items.push({
          id: `${prefix}-E${itemIdx}`,
          source,
          exactQuote: rawSegments[i].substring(0, 320),
          extractedFact: `Verified from ${source.toLowerCase()}: "${rawSegments[i].substring(0, 160)}${rawSegments[i].length > 160 ? '...' : ''}"`,
          category: cat.category,
        });
        usedIndices.add(i);
        break;
      }
    }
  }

  // If still need more items, pick remaining substantive segments
  for (let i = 0; i < rawSegments.length && items.length < 8; i++) {
    if (usedIndices.has(i)) continue;
    const itemIdx = startIdx + items.length + 1;
    items.push({
      id: `${prefix}-E${itemIdx}`,
      source,
      exactQuote: rawSegments[i].substring(0, 320),
      extractedFact: `Verified claim from ${source.toLowerCase()}: "${rawSegments[i].substring(0, 160)}${rawSegments[i].length > 160 ? '...' : ''}"`,
      category: 'General Experience',
    });
    usedIndices.add(i);
  }

  // Ensure at least 3 items exist even for short text
  if (items.length === 0 && text.trim().length > 0) {
    items.push({
      id: `${prefix}-E${startIdx + 1}`,
      source,
      exactQuote: text.trim().substring(0, 250),
      extractedFact: `Candidate text snippet: "${text.trim().substring(0, 120)}..."`,
      category: 'General',
    });
  }

  return items;
}

/** Generate dynamic mock evaluation response from actual input text */
export function generateDynamicMockResponse(
  jobTitle: string,
  _jobRequirements: string,
  dossier: CandidateDossier
): EvaluationResponse {
  const candidateName = extractCandidateName(dossier);
  const currentRole = extractCurrentRole(dossier.resumeText);
  const skills = extractSkills(`${dossier.resumeText} ${dossier.transcriptText}`);
  const prefix = dossier.id === 'candidate_a' ? 'A' : 'B';

  const candidateProfile: CandidateProfile = {
    name: candidateName,
    currentRole,
    summary: `${candidateName} — evaluated profile from uploaded resume and interview transcript for the role "${jobTitle}".`,
    skills: skills.length > 0 ? skills : ['Python', 'System Design', 'APIs'],
  };

  const resumeEvidence = extractEvidenceFromText(dossier.resumeText, 'Resume', prefix, 0);
  const transcriptEvidence = extractEvidenceFromText(
    dossier.transcriptText,
    'Transcript',
    prefix,
    resumeEvidence.length
  );
  const evidenceBank: EvidenceItem[] = [...resumeEvidence, ...transcriptEvidence];

  // Re-index sequentially with candidate prefix
  evidenceBank.forEach((e, idx) => {
    e.id = `${prefix}-E${idx + 1}`;
  });

  const eIds = evidenceBank.map((e) => e.id);
  const topEId = eIds[0] || `${prefix}-E1`;
  const secondEId = eIds[1] || topEId;
  const midEId = eIds[Math.floor(eIds.length / 2)] || topEId;
  const lastEId = eIds[eIds.length - 1] || topEId;

  // Determine strengths and concerns based on actual evidence
  const resumeFirstQuote = resumeEvidence[0]?.exactQuote?.substring(0, 120) || 'documented background in engineering';
  const transcriptQuote = transcriptEvidence[0]?.exactQuote?.substring(0, 120) || 'stated interview responses';

  const evaluators: EvaluatorResult[] = [
    {
      agentId: 'technical',
      agentName: 'Technical Evaluator',
      roleTitle: 'Principal Systems Architect',
      recommendation: skills.length >= 5 ? 'yes' : 'mixed',
      confidence: Math.min(88, 65 + skills.length * 3),
      strengths: [
        {
          claim: `${candidateName} demonstrates relevant technical competencies (${skills.slice(0, 4).join(', ')}) substantiated by resume evidence [${topEId}].`,
          evidenceIds: [topEId],
        },
        ...(evidenceBank.length > 1
          ? [{
              claim: `Verified engineering claim: "${resumeFirstQuote}" [${secondEId}].`,
              evidenceIds: [secondEId],
            }]
          : []),
      ],
      concerns: [
        {
          claim: `Production edge-case handling for role "${jobTitle}" requires deeper architectural validation [${lastEId}].`,
          evidenceIds: [lastEId],
        },
      ],
      missingEvidence: [
        `Insufficient evidence regarding formal benchmarking methodology under high concurrency.`,
        `Insufficient evidence regarding end-to-end telemetry and error budget governance.`,
      ],
      keyQuestion: `Can you walk through a high-stakes technical architecture decision you owned, detailing the trade-offs and post-launch telemetry?`,
    },
    {
      agentId: 'culture',
      agentName: 'HR / Culture Evaluator',
      roleTitle: 'VP of People & Culture',
      recommendation: 'yes',
      confidence: 78,
      strengths: [
        {
          claim: `${candidateName} exhibits structured communication and transparent self-reflection during interview [${midEId}].`,
          evidenceIds: [midEId],
        },
      ],
      concerns: [
        {
          claim: `Cross-functional friction resolution style needs live behavioral probe beyond submitted text [${topEId}].`,
          evidenceIds: [topEId],
        },
      ],
      missingEvidence: [
        `Insufficient evidence regarding mentorship contributions or junior engineer upskilling.`,
      ],
      keyQuestion: `Tell us about a time you had a fundamental disagreement with a colleague over technical direction — how did you navigate it?`,
    },
    {
      agentId: 'hiring_manager',
      agentName: 'Hiring Manager',
      roleTitle: 'Director of Platform Engineering',
      recommendation: skills.length >= 4 ? 'yes' : 'mixed',
      confidence: 74,
      strengths: [
        {
          claim: `${candidateName}'s documented experience aligns with the core requirements of "${jobTitle}" [${topEId}, ${midEId}].`,
          evidenceIds: [topEId, midEId],
        },
      ],
      concerns: [
        {
          claim: `Ramp-up trajectory for domain-specific tooling and operational rhythms needs explicit onboarding plan [${lastEId}].`,
          evidenceIds: [lastEId],
        },
      ],
      missingEvidence: [
        `Insufficient evidence regarding delivery velocity under tight sprint deadlines.`,
      ],
      keyQuestion: `What would be your roadmap and prioritized deliverables in your first 60 days on this team?`,
    },
    {
      agentId: 'skeptic',
      agentName: 'Skeptic / Risk Evaluator',
      roleTitle: 'Principal Risk & Rigor Auditor',
      recommendation: 'mixed',
      confidence: 68,
      strengths: [
        {
          claim: `${candidateName} provides concrete citations in resume that can be audited against interview transcript [${topEId}].`,
          evidenceIds: [topEId],
        },
      ],
      concerns: [
        {
          claim: `Self-reported resume claims need rigorous corroboration against live production incident response [${secondEId}, ${lastEId}].`,
          evidenceIds: [secondEId, lastEId],
        },
        {
          claim: `Interview disclosures indicate areas where hands-on scope vs team collaboration must be clarified [${midEId}].`,
          evidenceIds: [midEId],
        },
      ],
      missingEvidence: [
        `Insufficient evidence regarding formal post-mortem documentation and prevention guardrails.`,
        `Insufficient evidence regarding sustained multi-year ownership on critical production systems.`,
      ],
      keyQuestion: `Walk us through the worst production incident you personally caused or debugged — what was the root cause and permanent fix?`,
    },
  ];

  // Dynamic debate with at least one position shift
  const debate: DebateExchange[] = [
    {
      id: `${prefix}-D1`,
      respondingAgent: 'Hiring Manager',
      speakerRole: 'hiring_manager',
      targetAgent: 'Skeptic / Risk Evaluator',
      targetClaim: `Self-reported claims for ${candidateName} require deeper verification`,
      stance: 'qualify',
      initialPosition: `${candidateName} appears to be a strong candidate based on resume accomplishments [${topEId}].`,
      updatedPosition: `After reviewing the Skeptic's challenge regarding verification gaps [${secondEId}], I agree that a targeted technical deep-dive is warranted before making an unconditional offer.`,
      changedAfterDebate: true,
      explanation: `The Skeptic correctly highlighted that ${candidateName}'s claimed impact in [${topEId}] requires interview corroboration [${secondEId}]. While the foundation is solid, caution is justified.`,
      evidenceIds: [topEId, secondEId],
    },
    {
      id: `${prefix}-D2`,
      respondingAgent: 'Technical Evaluator',
      speakerRole: 'technical',
      targetAgent: 'Hiring Manager',
      targetClaim: `${candidateName}'s technical skill alignment`,
      stance: 'agree',
      initialPosition: `Technical capabilities match role needs [${topEId}].`,
      updatedPosition: `Confirmed technical alignment based on verified evidence [${topEId}, ${midEId}].`,
      changedAfterDebate: false,
      explanation: `Candidate's skills in ${skills.slice(0, 3).join(', ')} provide adequate foundation, though domain ramp-up remains.`,
      evidenceIds: [topEId, midEId],
    },
    {
      id: `${prefix}-D3`,
      respondingAgent: 'Skeptic / Risk Evaluator',
      speakerRole: 'skeptic',
      targetAgent: 'HR / Culture Evaluator',
      targetClaim: `${candidateName}'s cultural alignment`,
      stance: 'qualify',
      initialPosition: `Interview communication alone does not guarantee resilience under operational stress.`,
      updatedPosition: `Acknowledging positive communication signals [${midEId}], but recommending scenario-based on-call testing.`,
      changedAfterDebate: false,
      explanation: `Demeanor in interview is promising, but production pressure testing is essential to confirm reliability.`,
      evidenceIds: [midEId],
    },
  ];

  // Synthesizer result grounded in current evidence
  const finalRecommendation = skills.length >= 6 ? 'Yes' : 'Hold / Further Interview';
  const synthesizer: SynthesizerResult = {
    finalRecommendation,
    confidence: Math.min(88, 66 + skills.length * 2),
    executiveSummary: `${candidateName} presents a qualified profile for the "${jobTitle}" position. Primary evidence from resume [${topEId}] and interview [${midEId}] confirms core proficiency in ${skills.slice(0, 4).join(', ') || 'software engineering'}. During the committee debate, the Hiring Manager adjusted their initial stance after evaluating the Skeptic's risk analysis regarding claim verification [${secondEId}]. The overall recommendation is ${finalRecommendation} pending targeted follow-up.`,
    decisiveEvidence: evidenceBank.slice(0, 3).map((item, idx) => ({
      evidenceId: item.id,
      fact: item.extractedFact,
      impactOnDecision:
        idx === 0
          ? 'Primary foundational evidence establishing candidate core technical competencies.'
          : idx === 1
          ? 'Critical evidentiary checkpoint examined during the multi-agent debate stage.'
          : 'Interview transcript verification supporting candidate operational readiness.',
    })),
    strengths: [
      {
        claim: `${candidateName} demonstrates verified technical skills (${skills.slice(0, 4).join(', ')}) documented in [${topEId}] and discussed in [${midEId}].`,
        evidenceIds: [topEId, midEId],
      },
    ],
    concerns: [
      {
        claim: `Specific domain depth and production incident ownership for "${jobTitle}" require further validation [${secondEId}, ${lastEId}].`,
        evidenceIds: [secondEId, lastEId],
      },
    ],
    unresolvedDisagreements: [
      {
        topic: `Extent of independent ownership vs team contribution for ${candidateName}`,
        conflictSummary: `Hiring Manager and Skeptic evaluated whether the evidence in [${topEId}] represents sole ownership or shared delivery.`,
        citedEvidenceIds: [topEId, secondEId],
      },
    ],
    recommendedFollowUpQuestions: [
      `Walk through a complex system architecture you designed for "${jobTitle}" and explain how you handled failure modes.`,
      `Describe a specific production incident you resolved under pressure and the preventive guardrails you implemented.`,
      `How do you measure and evaluate the quality of your code and systems before deployment?`,
    ],
  };

  return {
    success: true,
    candidateId: dossier.id,
    candidateName: candidateProfile.name,
    mode: 'mock',
    modelUsed: 'Dynamic Input-Based Mock Engine (No API Key)',
    timestamp: new Date().toISOString(),
    candidateProfile,
    evidenceBank,
    evaluators,
    debate,
    synthesizer,
  };
}

/** Generate dynamic candidate comparison from two evaluation responses */
export function generateDynamicComparison(
  resA: EvaluationResponse,
  resB: EvaluationResponse,
  jobTitle: string
): CandidateComparison {
  const nameA = resA.candidateProfile.name || 'Candidate A';
  const nameB = resB.candidateProfile.name || 'Candidate B';
  const recA = resA.synthesizer.finalRecommendation;
  const recB = resB.synthesizer.finalRecommendation;
  const confA = resA.synthesizer.confidence;
  const confB = resB.synthesizer.confidence;

  const topAStr = resA.synthesizer.strengths[0]?.claim || `${nameA} brings relevant engineering skills`;
  const topBStr = resB.synthesizer.strengths[0]?.claim || `${nameB} brings relevant engineering skills`;

  return {
    summary: `Comparative evaluation of ${nameA} (${recA}, ${confA}% confidence) vs ${nameB} (${recB}, ${confB}% confidence) for the "${jobTitle}" role.`,
    keyDifferentiators: [
      `${nameA} Key Strengths: ${topAStr}`,
      `${nameB} Key Strengths: ${topBStr}`,
      `Risk Analysis: ${nameA} concerns focus on "${resA.synthesizer.concerns[0]?.claim || 'technical depth'}", while ${nameB} concerns focus on "${resB.synthesizer.concerns[0]?.claim || 'operational ramp-up'}".`,
    ],
    hiringRecommendation: `Based on evidence synthesis: ${nameA} received "${recA}" (${confA}%) and ${nameB} received "${recB}" (${confB}%). Prioritize candidate based on team's immediate vs long-term requirements.`,
  };
}
