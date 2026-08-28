export type EvidenceSource = 'Resume' | 'Transcript' | 'Job Description';

export interface EvidenceItem {
  id: string; // e.g. "R-E1", "A-E1", "E1"
  source: EvidenceSource;
  exactQuote: string;
  extractedFact: string;
  category?: string;
}

export interface JobEvidenceItem {
  id: string; // e.g. "J-E1", "J-E2"
  exactQuote: string;
  extractedFact: string;
  category: string;
}

export interface BlueprintRequirement {
  title: string;
  description: string;
  evidenceIds: string[];
}

export interface IdealCandidateBlueprint {
  roleTitle: string;
  company: string;
  roleMission: BlueprintRequirement;
  dayOneCriticalCapabilities: BlueprintRequirement[];
  strongDifferentiators: BlueprintRequirement[];
  niceToHaveCapabilities: BlueprintRequirement[];
  productionOwnershipExpectations: BlueprintRequirement[];
  keyTechnicalSkills: {
    pythonBackend: BlueprintRequirement;
    multiAgentSystems: BlueprintRequirement;
    plannerExecutorReviewer: BlueprintRequirement;
    promptingRagRoutingEval: BlueprintRequirement;
    reactMongoOcrIntegrations: BlueprintRequirement;
    reliabilityMonitoringOnCall: BlueprintRequirement;
  };
  ownershipHonestyLearning: BlueprintRequirement[];
  interviewValidationRisks: BlueprintRequirement[];
  jobEvidenceBank: JobEvidenceItem[];
}

export type ReadinessLabel = 'Demonstrated' | 'Partial / needs validation' | 'Not yet demonstrated';

export interface IdealFitOverlayItem {
  capability: string;
  idealRequirement: string;
  jobEvidenceIds: string[];
  rohanEvidence: string;
  rohanEvidenceIds: string[];
  rohanReadiness: ReadinessLabel;
  ananyaEvidence: string;
  ananyaEvidenceIds: string[];
  ananyaReadiness: ReadinessLabel;
  takeaway: string;
}

export interface CandidateProfile {
  name: string;
  currentRole: string;
  summary: string;
  skills: string[];
}

export type EvaluatorRecommendation = 'strong_yes' | 'yes' | 'mixed' | 'no';

export interface EvaluatorClaim {
  claim: string;
  evidenceIds: string[];
}

export interface EvaluatorResult {
  agentId: 'technical' | 'culture' | 'hiring_manager' | 'skeptic';
  agentName: string;
  roleTitle: string;
  recommendation: EvaluatorRecommendation;
  confidence: number; // 0 to 100
  strengths: EvaluatorClaim[];
  concerns: EvaluatorClaim[];
  missingEvidence: string[];
  keyQuestion: string;
}

export type DebateStance = 'agree' | 'disagree' | 'qualify';

export interface DebateExchange {
  id: string;
  respondingAgent: string;
  speakerRole: 'technical' | 'culture' | 'hiring_manager' | 'skeptic';
  targetAgent: string;
  targetClaim: string;
  stance: DebateStance;
  initialPosition: string;
  updatedPosition: string;
  changedAfterDebate: boolean;
  explanation: string;
  evidenceIds: string[];
}

export type FinalRecommendation = 'Strong Yes' | 'Yes' | 'Hold / Further Interview' | 'No';

export interface DecisiveEvidenceItem {
  evidenceId: string;
  fact: string;
  impactOnDecision: string;
}

export interface SynthesizerResult {
  finalRecommendation: FinalRecommendation;
  confidence: number; // 0 to 100
  executiveSummary: string;
  decisiveEvidence: DecisiveEvidenceItem[];
  strengths: EvaluatorClaim[];
  concerns: EvaluatorClaim[];
  unresolvedDisagreements: {
    topic: string;
    conflictSummary: string;
    citedEvidenceIds: string[];
  }[];
  recommendedFollowUpQuestions: string[];
}

export interface CandidateDossier {
  id: 'candidate_a' | 'candidate_b';
  candidateName: string;
  resumeText: string;
  transcriptText: string;
}

export interface EvaluationInput {
  jobTitle: string;
  jobRequirements: string;
  resumeText: string;
  transcriptText: string;
  candidateName?: string;
  candidateId?: 'candidate_a' | 'candidate_b';
  forceMock?: boolean;
}

export interface BatchEvaluationInput {
  jobTitle: string;
  jobRequirements: string;
  candidates: CandidateDossier[];
  forceMock?: boolean;
}

export interface EvaluationResponse {
  success: boolean;
  candidateId?: string;
  candidateName?: string;
  mode: 'live' | 'mock';
  modelUsed?: string;
  timestamp: string;
  candidateProfile: CandidateProfile;
  evidenceBank: EvidenceItem[];
  evaluators: EvaluatorResult[];
  debate: DebateExchange[];
  synthesizer: SynthesizerResult;
  error?: string;
}

export interface CandidateComparison {
  summary: string;
  keyDifferentiators: string[];
  hiringRecommendation: string;
}

export interface BatchEvaluationResponse {
  success: boolean;
  mode: 'live' | 'mock';
  modelUsed?: string;
  timestamp: string;
  blueprint?: IdealCandidateBlueprint;
  results: Record<string, EvaluationResponse>;
  comparison?: CandidateComparison;
  error?: string;
}

export interface ServerHealth {
  status: string;
  geminiConfigured: boolean;
  model: string;
  timestamp: string;
}
