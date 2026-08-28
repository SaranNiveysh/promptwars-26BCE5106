import {
  EvaluationInput,
  EvaluationResponse,
  BatchEvaluationInput,
  BatchEvaluationResponse,
  ServerHealth,
  CandidateDossier,
} from '../types';
import {
  DEMO_JOB,
  DEMO_CANDIDATE_A,
  DEMO_CANDIDATE_B,
} from '../sampleData';

const API_BASE = '/api';

export async function checkServerHealth(): Promise<ServerHealth> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) {
      throw new Error(`Health check failed: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.warn('[API] Server health check failed, using offline fallback:', error);
    return {
      status: 'offline',
      geminiConfigured: false,
      model: 'gemini-2.5-flash',
      timestamp: new Date().toISOString(),
    };
  }
}

export async function getDemoData(): Promise<{
  job: { jobTitle: string; jobRequirements: string };
  candidateA: CandidateDossier;
  candidateB: CandidateDossier;
}> {
  try {
    const res = await fetch(`${API_BASE}/demo-data`);
    if (res.ok) {
      const data = await res.json();
      if (data.candidateA && data.candidateB) {
        return {
          job: data.job || DEMO_JOB,
          candidateA: data.candidateA,
          candidateB: data.candidateB,
        };
      }
    }
  } catch (err) {
    console.warn('[API] Failed to fetch demo data from server, using local fallback:', err);
  }
  return {
    job: DEMO_JOB,
    candidateA: DEMO_CANDIDATE_A,
    candidateB: DEMO_CANDIDATE_B,
  };
}

export async function runEvaluation(input: EvaluationInput): Promise<EvaluationResponse> {
  const res = await fetch(`${API_BASE}/evaluate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Evaluation failed with status ${res.status}`);
  }

  return await res.json();
}

export async function runBatchEvaluation(
  input: BatchEvaluationInput
): Promise<BatchEvaluationResponse> {
  const res = await fetch(`${API_BASE}/evaluate-batch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Batch evaluation failed with status ${res.status}`);
  }

  return await res.json();
}
