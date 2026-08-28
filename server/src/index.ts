import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { runEvaluationPipeline, runBatchEvaluationPipeline } from './services/pipelineService.js';
import { DEMO_JOB, DEMO_CANDIDATE_A, DEMO_CANDIDATE_B, DEMO_BATCH_RESPONSE } from './mockData.js';
import { isGeminiConfigured, getGeminiModelName } from './gemini.js';
import { EvaluationInput, BatchEvaluationInput } from './types.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health and configuration endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: isGeminiConfigured(),
    model: getGeminiModelName(),
    timestamp: new Date().toISOString(),
  });
});

// Demo data endpoint for both Candidate A & Candidate B
app.get('/api/demo-data', (req, res) => {
  res.json({
    success: true,
    job: DEMO_JOB,
    candidateA: DEMO_CANDIDATE_A,
    candidateB: DEMO_CANDIDATE_B,
    mockBatch: DEMO_BATCH_RESPONSE,
  });
});

// Single candidate evaluation pipeline endpoint
app.post('/api/evaluate', async (req, res) => {
  try {
    const input: EvaluationInput = req.body;

    if (!input.jobTitle || !input.jobRequirements || !input.resumeText || !input.transcriptText) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: jobTitle, jobRequirements, resumeText, transcriptText',
      });
      return;
    }

    const result = await runEvaluationPipeline(input);
    res.json(result);
  } catch (error: any) {
    console.error('Error in /api/evaluate:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Internal evaluation pipeline failure',
    });
  }
});

// Batch evaluation pipeline endpoint for Candidate A & Candidate B
app.post('/api/evaluate-batch', async (req, res) => {
  try {
    const input: BatchEvaluationInput = req.body;

    if (!input.jobTitle || !input.jobRequirements || !Array.isArray(input.candidates) || input.candidates.length === 0) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: jobTitle, jobRequirements, candidates array',
      });
      return;
    }

    const result = await runBatchEvaluationPipeline(input);
    res.json(result);
  } catch (error: any) {
    console.error('Error in /api/evaluate-batch:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Internal batch evaluation failure',
    });
  }
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` EvidenceHire Backend running on http://localhost:${PORT}`);
  console.log(` Gemini API Configured: ${isGeminiConfigured() ? 'YES (Live Mode)' : 'NO (Mock Mode)'}`);
  console.log(` Model Name: ${getGeminiModelName()}`);
  console.log(`====================================================`);
});
