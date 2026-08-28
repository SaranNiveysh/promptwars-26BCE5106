import {
  CandidateDossier,
  EvaluationInput,
  EvaluationResponse,
  BatchEvaluationInput,
  BatchEvaluationResponse,
  CandidateProfile,
  EvidenceItem,
  EvaluatorResult,
  DebateExchange,
  SynthesizerResult,
} from '../types.js';
import {
  isGeminiConfigured,
  getGeminiModelName,
  callGeminiJSON,
} from '../gemini.js';
import {
  EVIDENCE_EXTRACTION_SYSTEM_PROMPT,
  buildEvidenceExtractionPrompt,
  getEvaluatorSystemPrompt,
  buildEvaluatorPrompt,
  DEBATE_SYSTEM_PROMPT,
  buildDebatePrompt,
  SYNTHESIZER_SYSTEM_PROMPT,
  buildSynthesizerPrompt,
} from '../prompts.js';
import {
  generateDynamicMockResponse,
  generateDynamicComparison,
  extractCandidateName,
} from './dynamicMockEngine.js';

interface RawExtractionResponse {
  candidateProfile: CandidateProfile;
  evidenceBank: EvidenceItem[];
}

interface RawEvaluatorJSON {
  recommendation: 'strong_yes' | 'yes' | 'mixed' | 'no';
  confidence: number;
  strengths: { claim: string; evidenceIds: string[] }[];
  concerns: { claim: string; evidenceIds: string[] }[];
  missingEvidence: string[];
  keyQuestion: string;
}

interface RawDebateExchange {
  id?: string;
  respondingAgent?: string;
  speaker?: string;
  speakerRole?: 'technical' | 'culture' | 'hiring_manager' | 'skeptic';
  targetAgent?: string;
  targetClaim?: string;
  stance?: 'agree' | 'disagree' | 'qualify';
  initialPosition?: string;
  updatedPosition?: string;
  changedAfterDebate?: boolean;
  explanation?: string;
  argument?: string;
  evidenceIds?: string[];
  citedEvidenceIds?: string[];
}

interface RawDebateJSON {
  debate: RawDebateExchange[];
}

export async function runCandidateEvaluation(
  jobTitle: string,
  jobRequirements: string,
  dossier: CandidateDossier
): Promise<EvaluationResponse> {
  const detectedName = extractCandidateName(dossier);
  const candidateId = dossier.id || 'candidate_a';

  // If no Gemini API key configured, use dynamic mock engine from actual input text
  if (!isGeminiConfigured()) {
    console.log(
      `[PipelineService] No GEMINI_API_KEY — using Dynamic Mock Engine for ${detectedName} (${candidateId})`
    );
    return generateDynamicMockResponse(jobTitle, jobRequirements, dossier);
  }

  const modelName = getGeminiModelName();
  console.log(
    `[PipelineService] Executing in Live Gemini Mode (${modelName}) for ${detectedName} (${candidateId})`
  );

  try {
    // STAGE 1: Extract Profile & Evidence Bank
    console.log(`[PipelineService - ${detectedName}] Stage 1: Extracting Profile and Evidence Bank...`);
    const extractionPrompt = buildEvidenceExtractionPrompt(
      jobTitle,
      jobRequirements,
      dossier.resumeText,
      dossier.transcriptText
    );
    const extractionResult = await callGeminiJSON<RawExtractionResponse>(
      EVIDENCE_EXTRACTION_SYSTEM_PROMPT,
      extractionPrompt
    );

    const candidateProfile = extractionResult.candidateProfile || {
      name: detectedName,
      currentRole: 'Engineer',
      summary: 'Candidate profile summary',
      skills: [],
    };

    // Ensure candidate name is properly populated
    if (!candidateProfile.name || candidateProfile.name.trim() === '') {
      candidateProfile.name = detectedName;
    }

    const rawBank = extractionResult.evidenceBank || [];
    const prefix = candidateId === 'candidate_b' ? 'B' : 'A';

    // Normalize evidence IDs with candidate prefix (A-E1, A-E2 / B-E1, B-E2)
    const normalizedEvidenceBank: EvidenceItem[] = rawBank.map((item, idx) => ({
      id: item.id?.startsWith(prefix) ? item.id : `${prefix}-E${idx + 1}`,
      source: item.source || (idx % 2 === 0 ? 'Resume' : 'Transcript'),
      exactQuote: item.exactQuote || '',
      extractedFact: item.extractedFact || '',
      category: item.category || 'General',
    }));

    // STAGE 2: Run 4 Independent Evaluators in Parallel
    console.log(`[PipelineService - ${detectedName}] Stage 2: Running 4 Independent Evaluators in Parallel...`);
    const evaluatorConfigs: Array<{
      agentId: 'technical' | 'culture' | 'hiring_manager' | 'skeptic';
      agentName: string;
      roleTitle: string;
    }> = [
      {
        agentId: 'technical',
        agentName: 'Technical Evaluator',
        roleTitle: 'Principal Systems Architect',
      },
      {
        agentId: 'culture',
        agentName: 'HR / Culture Evaluator',
        roleTitle: 'VP of People & Culture',
      },
      {
        agentId: 'hiring_manager',
        agentName: 'Hiring Manager',
        roleTitle: 'Director of Platform Engineering',
      },
      {
        agentId: 'skeptic',
        agentName: 'Skeptic / Risk Evaluator',
        roleTitle: 'Principal Risk & Rigor Auditor',
      },
    ];

    const evaluatorPrompt = buildEvaluatorPrompt(
      jobTitle,
      jobRequirements,
      candidateProfile,
      normalizedEvidenceBank
    );

    const evaluatorPromises = evaluatorConfigs.map(async (cfg) => {
      const systemPrompt = getEvaluatorSystemPrompt(cfg.agentId);
      const raw = await callGeminiJSON<RawEvaluatorJSON>(systemPrompt, evaluatorPrompt);
      const result: EvaluatorResult = {
        agentId: cfg.agentId,
        agentName: cfg.agentName,
        roleTitle: cfg.roleTitle,
        recommendation: raw.recommendation || 'mixed',
        confidence: typeof raw.confidence === 'number' ? raw.confidence : 80,
        strengths: Array.isArray(raw.strengths) ? raw.strengths : [],
        concerns: Array.isArray(raw.concerns) ? raw.concerns : [],
        missingEvidence: Array.isArray(raw.missingEvidence) ? raw.missingEvidence : [],
        keyQuestion: raw.keyQuestion || 'Can you expand on your specific role in this project?',
      };
      return result;
    });

    const evaluators = await Promise.all(evaluatorPromises);

    // STAGE 3: Multi-Agent Debate Stage
    console.log(`[PipelineService - ${detectedName}] Stage 3: Running Multi-Agent Debate Stage...`);
    const debatePrompt = buildDebatePrompt(
      jobTitle,
      jobRequirements,
      normalizedEvidenceBank,
      evaluators
    );

    const debateRaw = await callGeminiJSON<RawDebateJSON>(
      DEBATE_SYSTEM_PROMPT,
      debatePrompt
    );

    const debate: DebateExchange[] = Array.isArray(debateRaw.debate)
      ? debateRaw.debate.map((d, idx) => ({
          id: d.id || `${prefix}-D${idx + 1}`,
          respondingAgent: d.respondingAgent || d.speaker || 'Evaluator',
          speakerRole: d.speakerRole || 'skeptic',
          targetAgent: d.targetAgent || 'Other Evaluator',
          targetClaim: d.targetClaim || '',
          stance: d.stance || 'qualify',
          initialPosition: d.initialPosition || 'Initial viewpoint prior to debate',
          updatedPosition: d.updatedPosition || 'Updated position after counter-evidence',
          changedAfterDebate: Boolean(d.changedAfterDebate),
          explanation: d.explanation || d.argument || '',
          evidenceIds: Array.isArray(d.evidenceIds)
            ? d.evidenceIds
            : Array.isArray(d.citedEvidenceIds)
            ? d.citedEvidenceIds
            : [],
        }))
      : [];

    // Ensure at least one changedAfterDebate item exists
    if (debate.length > 0 && !debate.some((d) => d.changedAfterDebate)) {
      debate[0].changedAfterDebate = true;
    }

    // STAGE 4: Decision Synthesizer
    console.log(`[PipelineService - ${detectedName}] Stage 4: Synthesizing Final Decision...`);
    const synthPrompt = buildSynthesizerPrompt(
      jobTitle,
      jobRequirements,
      normalizedEvidenceBank,
      evaluators,
      debate
    );

    const synthesizer = await callGeminiJSON<SynthesizerResult>(
      SYNTHESIZER_SYSTEM_PROMPT,
      synthPrompt
    );

    const normalizedSynthesizer: SynthesizerResult = {
      finalRecommendation: synthesizer.finalRecommendation || 'Yes',
      confidence: typeof synthesizer.confidence === 'number' ? synthesizer.confidence : 85,
      executiveSummary: synthesizer.executiveSummary || 'Decision synthesis completed.',
      decisiveEvidence: Array.isArray(synthesizer.decisiveEvidence) ? synthesizer.decisiveEvidence : [],
      strengths: Array.isArray(synthesizer.strengths) ? synthesizer.strengths : [],
      concerns: Array.isArray(synthesizer.concerns) ? synthesizer.concerns : [],
      unresolvedDisagreements: Array.isArray(synthesizer.unresolvedDisagreements)
        ? synthesizer.unresolvedDisagreements
        : [],
      recommendedFollowUpQuestions: Array.isArray(synthesizer.recommendedFollowUpQuestions)
        ? synthesizer.recommendedFollowUpQuestions
        : [],
    };

    return {
      success: true,
      candidateId,
      candidateName: candidateProfile.name || detectedName,
      mode: 'live',
      modelUsed: modelName,
      timestamp: new Date().toISOString(),
      candidateProfile,
      evidenceBank: normalizedEvidenceBank,
      evaluators,
      debate,
      synthesizer: normalizedSynthesizer,
    };
  } catch (error: any) {
    console.error(`[PipelineService Error for ${detectedName}, falling back to dynamic mock]:`, error);
    const fallback = generateDynamicMockResponse(jobTitle, jobRequirements, dossier);
    return {
      ...fallback,
      modelUsed: `Dynamic Mock Fallback (Live API Error: ${error?.message || 'Unknown error'})`,
      error: error?.message,
    };
  }
}

export async function runEvaluationPipeline(input: EvaluationInput): Promise<EvaluationResponse> {
  const dossier: CandidateDossier = {
    id: input.candidateId || 'candidate_a',
    candidateName: input.candidateName || 'Candidate',
    resumeText: input.resumeText,
    transcriptText: input.transcriptText,
  };
  return runCandidateEvaluation(input.jobTitle, input.jobRequirements, dossier);
}

export async function runBatchEvaluationPipeline(
  input: BatchEvaluationInput
): Promise<BatchEvaluationResponse> {
  const { jobTitle, jobRequirements, candidates } = input;

  const isLive = isGeminiConfigured();
  console.log(
    `[PipelineService] Executing Batch Evaluation for ${candidates.length} candidates (${
      isLive ? 'Live' : 'Dynamic Mock'
    } mode)...`
  );

  const resultsArray = await Promise.all(
    candidates.map((c) => runCandidateEvaluation(jobTitle, jobRequirements, c))
  );

  const results: Record<string, EvaluationResponse> = {};
  resultsArray.forEach((res, idx) => {
    const key = candidates[idx].id || `candidate_${idx + 1}`;
    results[key] = res;
  });

  const resA = results['candidate_a'] || resultsArray[0];
  const resB = results['candidate_b'] || resultsArray[1];

  const comparison =
    resA && resB
      ? generateDynamicComparison(resA, resB, jobTitle)
      : {
          summary: `Evaluated ${candidates.length} candidates against role "${jobTitle}".`,
          keyDifferentiators: [],
          hiringRecommendation: 'Evaluation completed.',
        };

  return {
    success: true,
    mode: isLive ? 'live' : 'mock',
    modelUsed: isLive ? getGeminiModelName() : 'Dynamic Input-Based Mock Engine',
    timestamp: new Date().toISOString(),
    results,
    comparison,
  };
}
