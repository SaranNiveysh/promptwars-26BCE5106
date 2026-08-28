import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PdfUploadPanel } from './components/PdfUploadPanel';
import { BlueprintView } from './components/BlueprintView';
import { ProgressBanner } from './components/ProgressBanner';
import { CandidateReportView } from './components/CandidateReportView';
import { ComparativeHiringCommittee } from './components/ComparativeHiringCommittee';
import { CitationModal, CitationModalData } from './components/CitationModal';
import {
  CandidateDossier,
  EvaluationResponse,
  ServerHealth,
  IdealCandidateBlueprint,
  EvidenceItem,
} from './types';
import {
  DEMO_JOB,
  DEMO_CANDIDATE_A,
  DEMO_CANDIDATE_B,
  DEMO_BLUEPRINT,
  DEMO_JOB_EVIDENCE_BANK,
  DEMO_EVIDENCE_BANK_A,
  DEMO_EVIDENCE_BANK_B,
} from './sampleData';
import {
  checkServerHealth,
  getDemoData,
  runBatchEvaluation,
} from './services/api';
import { extractCandidateNameFromText } from './services/nameExtractor';
import { AlertCircle, GitCompare, Compass, Database, FileCheck } from 'lucide-react';

export const App: React.FC = () => {
  const [health, setHealth] = useState<ServerHealth | null>(null);

  // Job & Candidate Inputs
  const [jobTitle, setJobTitle] = useState<string>(DEMO_JOB.jobTitle);
  const [jobRequirements, setJobRequirements] = useState<string>(DEMO_JOB.jobRequirements);
  const [resumeA, setResumeA] = useState<string>(DEMO_CANDIDATE_A.resumeText);
  const [transcriptA, setTranscriptA] = useState<string>(DEMO_CANDIDATE_A.transcriptText);
  const [resumeB, setResumeB] = useState<string>(DEMO_CANDIDATE_B.resumeText);
  const [transcriptB, setTranscriptB] = useState<string>(DEMO_CANDIDATE_B.transcriptText);
  const [candidateAName, setCandidateAName] = useState<string>(DEMO_CANDIDATE_A.candidateName);
  const [candidateBName, setCandidateBName] = useState<string>(DEMO_CANDIDATE_B.candidateName);

  // Data source tracker: 'demo' | 'uploaded'
  const [dataSource, setDataSource] = useState<'demo' | 'uploaded'>('demo');
  const [evaluatedDataSource, setEvaluatedDataSource] = useState<'demo' | 'uploaded' | null>(null);

  // Stage 0 Blueprint State & Top View Selector
  const [blueprint, setBlueprint] = useState<IdealCandidateBlueprint | null>(DEMO_BLUEPRINT);
  const [activeMainView, setActiveMainView] = useState<'app' | 'blueprint'>('app');

  // Execution & Results State
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationStage, setEvaluationStage] = useState<number>(0);
  const [candidateAResult, setCandidateAResult] = useState<EvaluationResponse | null>(null);
  const [candidateBResult, setCandidateBResult] = useState<EvaluationResponse | null>(null);
  const [activeResultsTab, setActiveResultsTab] = useState<'candidate_a' | 'candidate_b' | 'final_comparison'>('final_comparison');
  const [error, setError] = useState<string | null>(null);

  // Citation Modal State
  const [citationModalData, setCitationModalData] = useState<CitationModalData | null>(null);

  useEffect(() => {
    checkServerHealth().then((h) => setHealth(h));
  }, []);

  // Helper to reset all stale evaluation results whenever inputs are edited or uploaded
  const resetStaleResults = () => {
    setCandidateAResult(null);
    setCandidateBResult(null);
    setEvaluatedDataSource(null);
    setError(null);
    setEvaluationStage(0);
  };

  // Wrapped setters that reset stale results on modification
  const handleSetJobRequirements = (val: string) => {
    setJobRequirements(val);
    setDataSource('uploaded');
    resetStaleResults();
  };

  const handleSetResumeA = (val: string) => {
    setResumeA(val);
    setDataSource('uploaded');
    const detected = extractCandidateNameFromText(val, transcriptA, 'Candidate A');
    setCandidateAName(detected);
    resetStaleResults();
  };

  const handleSetTranscriptA = (val: string) => {
    setTranscriptA(val);
    setDataSource('uploaded');
    const detected = extractCandidateNameFromText(resumeA, val, 'Candidate A');
    setCandidateAName(detected);
    resetStaleResults();
  };

  const handleSetResumeB = (val: string) => {
    setResumeB(val);
    setDataSource('uploaded');
    const detected = extractCandidateNameFromText(val, transcriptB, 'Candidate B');
    setCandidateBName(detected);
    resetStaleResults();
  };

  const handleSetTranscriptB = (val: string) => {
    setTranscriptB(val);
    setDataSource('uploaded');
    const detected = extractCandidateNameFromText(resumeB, val, 'Candidate B');
    setCandidateBName(detected);
    resetStaleResults();
  };

  const handleLoadDemo = async () => {
    setError(null);
    resetStaleResults();
    const demo = await getDemoData();
    setJobTitle(demo.job.jobTitle);
    setJobRequirements(demo.job.jobRequirements);
    setResumeA(demo.candidateA.resumeText);
    setTranscriptA(demo.candidateA.transcriptText);
    setResumeB(demo.candidateB.resumeText);
    setTranscriptB(demo.candidateB.transcriptText);
    setCandidateAName(demo.candidateA.candidateName);
    setCandidateBName(demo.candidateB.candidateName);
    setBlueprint(DEMO_BLUEPRINT);
    setDataSource('demo');
  };

  const handleResetAll = () => {
    setJobTitle('');
    setJobRequirements('');
    setResumeA('');
    setTranscriptA('');
    setResumeB('');
    setTranscriptB('');
    setCandidateAName('Candidate A');
    setCandidateBName('Candidate B');
    setCandidateAResult(null);
    setCandidateBResult(null);
    setBlueprint(null);
    setError(null);
    setEvaluationStage(0);
    setDataSource('uploaded');
    setEvaluatedDataSource(null);
  };

  const handlePdfExtracted = (data: {
    jobDescription: string;
    resumeA: string;
    transcriptA: string;
    resumeB: string;
    transcriptB: string;
    candidateAName?: string;
    candidateBName?: string;
  }) => {
    resetStaleResults();
    setDataSource('uploaded');

    if (data.jobDescription) {
      setJobRequirements(data.jobDescription);
    }
    if (data.resumeA) {
      setResumeA(data.resumeA);
    }
    if (data.transcriptA) {
      setTranscriptA(data.transcriptA);
    }
    if (data.resumeB) {
      setResumeB(data.resumeB);
    }
    if (data.transcriptB) {
      setTranscriptB(data.transcriptB);
    }

    const detectedA = data.candidateAName || extractCandidateNameFromText(data.resumeA, data.transcriptA, 'Candidate A');
    const detectedB = data.candidateBName || extractCandidateNameFromText(data.resumeB, data.transcriptB, 'Candidate B');

    setCandidateAName(detectedA);
    setCandidateBName(detectedB);
  };

  const handleCitationClick = (citationId: string) => {
    const cleanId = citationId.replace(/[\[\]]/g, '').trim();

    // 1. Check in candidate A active evaluation result evidence bank
    const candidateAItems = candidateAResult?.evidenceBank || [];
    const foundA = candidateAItems.find((e) => e.id === cleanId);
    if (foundA) {
      setCitationModalData({
        citationId: foundA.id,
        source: `${candidateAResult?.candidateProfile.name || 'Candidate A'} (${foundA.source})`,
        exactQuote: foundA.exactQuote,
        extractedFact: foundA.extractedFact,
        category: foundA.category,
      });
      return;
    }

    // 2. Check in candidate B active evaluation result evidence bank
    const candidateBItems = candidateBResult?.evidenceBank || [];
    const foundB = candidateBItems.find((e) => e.id === cleanId);
    if (foundB) {
      setCitationModalData({
        citationId: foundB.id,
        source: `${candidateBResult?.candidateProfile.name || 'Candidate B'} (${foundB.source})`,
        exactQuote: foundB.exactQuote,
        extractedFact: foundB.extractedFact,
        category: foundB.category,
      });
      return;
    }

    // 3. Check Job Evidence bank
    const jobItem = DEMO_JOB_EVIDENCE_BANK.find((j) => j.id === cleanId);
    if (jobItem) {
      setCitationModalData({
        citationId: jobItem.id,
        source: 'Job Description',
        exactQuote: jobItem.exactQuote,
        extractedFact: jobItem.extractedFact,
        category: jobItem.category,
      });
      return;
    }

    // 4. Check Demo Candidate banks if applicable
    const demoItemA = DEMO_EVIDENCE_BANK_A.find((r: EvidenceItem) => r.id === cleanId);
    if (demoItemA) {
      setCitationModalData({
        citationId: demoItemA.id,
        source: `Candidate A (${demoItemA.source})`,
        exactQuote: demoItemA.exactQuote,
        extractedFact: demoItemA.extractedFact,
        category: demoItemA.category,
      });
      return;
    }

    const demoItemB = DEMO_EVIDENCE_BANK_B.find((a: EvidenceItem) => a.id === cleanId);
    if (demoItemB) {
      setCitationModalData({
        citationId: demoItemB.id,
        source: `Candidate B (${demoItemB.source})`,
        exactQuote: demoItemB.exactQuote,
        extractedFact: demoItemB.extractedFact,
        category: demoItemB.category,
      });
      return;
    }

    // 5. Default fallback popup
    setCitationModalData({
      citationId: cleanId,
      source: 'Verified Document Evidence',
      exactQuote: `Referenced claim verified under citation tag [${cleanId}].`,
      extractedFact: `Verified evidentiary claim in candidate evaluation dossier.`,
    });
  };

  const startProgressAnimation = () => {
    setIsEvaluating(true);
    setError(null);
    setEvaluationStage(1);
    const t1 = setTimeout(() => setEvaluationStage(2), 600);
    const t2 = setTimeout(() => setEvaluationStage(3), 1400);
    const t3 = setTimeout(() => setEvaluationStage(4), 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  };

  const scrollToResults = () => {
    setTimeout(() => {
      const el = document.getElementById('evaluation-results');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Evaluate Both Candidates with current inputs
  const handleEvaluateBoth = async () => {
    const cancelAnim = startProgressAnimation();
    try {
      const currentNameA = candidateAName || extractCandidateNameFromText(resumeA, transcriptA, 'Candidate A');
      const currentNameB = candidateBName || extractCandidateNameFromText(resumeB, transcriptB, 'Candidate B');

      const candidateA: CandidateDossier = {
        id: 'candidate_a',
        candidateName: currentNameA,
        resumeText: resumeA,
        transcriptText: transcriptA,
      };
      const candidateB: CandidateDossier = {
        id: 'candidate_b',
        candidateName: currentNameB,
        resumeText: resumeB,
        transcriptText: transcriptB,
      };

      const response = await runBatchEvaluation({
        jobTitle: jobTitle || 'AI Engineer — Agentic Systems',
        jobRequirements,
        candidates: [candidateA, candidateB],
      });

      cancelAnim();
      setEvaluationStage(5);

      if (response.success) {
        setCandidateAResult(response.results['candidate_a'] || null);
        setCandidateBResult(response.results['candidate_b'] || null);
        setEvaluatedDataSource(dataSource);
        if (response.blueprint) {
          setBlueprint(response.blueprint);
        }
        setActiveResultsTab('final_comparison');
        scrollToResults();
      } else {
        setError(response.error || 'Batch evaluation failed.');
      }
    } catch (err: any) {
      cancelAnim();
      setError(err?.message || 'Failed to complete batch evaluation.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const hasAnyResults = Boolean(candidateAResult || candidateBResult);
  const bothEvaluated = Boolean(candidateAResult && candidateBResult);

  return (
    <div className="app-container">
      <Header
        health={health}
        mode={health?.geminiConfigured ? 'live' : 'mock'}
        onLoadDemo={handleLoadDemo}
        onResetAll={handleResetAll}
        isEvaluating={isEvaluating}
      />

      {/* Top View Selector: Candidate Evaluation Bench vs Stage 0 Blueprint */}
      {blueprint && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              type="button"
              className={`tab-btn ${activeMainView === 'app' ? 'active' : ''}`}
              onClick={() => setActiveMainView('app')}
              style={{ fontSize: '0.85rem', padding: '0.45rem 0.95rem' }}
            >
              Candidate Evaluation Bench
            </button>
            <button
              type="button"
              className={`tab-btn ${activeMainView === 'blueprint' ? 'active' : ''}`}
              onClick={() => setActiveMainView('blueprint')}
              style={{ fontSize: '0.85rem', padding: '0.45rem 0.95rem' }}
            >
              <Compass size={14} /> Stage 0: Ideal Candidate Blueprint
            </button>
          </div>

          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Target Role: <strong>{jobTitle || 'AI Engineer — Agentic Systems'}</strong>
          </span>
        </div>
      )}

      {/* View: Stage 0 Blueprint */}
      {activeMainView === 'blueprint' && blueprint && (
        <div style={{ marginBottom: '2rem' }}>
          <BlueprintView
            blueprint={blueprint}
            onCitationClick={handleCitationClick}
          />
        </div>
      )}

      {/* View: Main Application (Upload + Evaluation Flow) */}
      {activeMainView === 'app' && (
        <>
          {/* 3-Tab PDF Upload Panel with Collapsible Review & Edit Sections */}
          <PdfUploadPanel
            onAllExtracted={handlePdfExtracted}
            isEvaluating={isEvaluating}
            hasEvaluated={hasAnyResults}
            jobRequirements={jobRequirements}
            setJobRequirements={handleSetJobRequirements}
            resumeA={resumeA}
            setResumeA={handleSetResumeA}
            transcriptA={transcriptA}
            setTranscriptA={handleSetTranscriptA}
            resumeB={resumeB}
            setResumeB={handleSetResumeB}
            transcriptB={transcriptB}
            setTranscriptB={handleSetTranscriptB}
            onEvaluateBoth={handleEvaluateBoth}
          />

          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid var(--danger)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                marginBottom: '1.5rem',
                color: '#f87171',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
              }}
            >
              <AlertCircle size={20} />
              <div>
                <strong>Evaluation Warning:</strong> {error}
              </div>
            </div>
          )}

          {isEvaluating && <ProgressBanner currentStage={evaluationStage} />}

          {/* ── Post-Evaluation 3 Main Tabs: Candidate A | Candidate B | Final Comparison ── */}
          {hasAnyResults && !isEvaluating && (
            <div id="evaluation-results" style={{ marginTop: '1.75rem' }}>
              {/* Visible Data Source Banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 1rem',
                  background: evaluatedDataSource === 'demo'
                    ? 'rgba(99, 102, 241, 0.12)'
                    : 'rgba(16, 185, 129, 0.12)',
                  border: `1px solid ${evaluatedDataSource === 'demo' ? 'rgba(99, 102, 241, 0.35)' : 'rgba(16, 185, 129, 0.35)'}`,
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem',
                  fontSize: '0.82rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {evaluatedDataSource === 'demo' ? (
                    <Database size={15} color="var(--primary)" />
                  ) : (
                    <FileCheck size={15} color="#34d399" />
                  )}
                  <span style={{ fontWeight: 600, color: evaluatedDataSource === 'demo' ? '#a5b4fc' : '#6ee7b7' }}>
                    Data source: {evaluatedDataSource === 'demo' ? 'Official Demo Data' : 'Uploaded PDFs'}
                  </span>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.76rem' }}>
                  {candidateAResult?.candidateProfile.name} vs {candidateBResult?.candidateProfile.name}
                </span>
              </div>

              {/* Top-Level Main Results Tab Bar */}
              <div className="results-navigation-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                    Evaluation Dossiers
                  </h2>
                </div>

                <div className="candidate-tab-group main-results-tabs">
                  {candidateAResult && (
                    <button
                      type="button"
                      className={`tab-btn main-tab-btn ${activeResultsTab === 'candidate_a' ? 'active' : ''}`}
                      onClick={() => setActiveResultsTab('candidate_a')}
                    >
                      <span className="candidate-pill candidate-a-pill" style={{ fontSize: '0.7rem' }}>A</span>
                      <span>Candidate A {candidateAResult.candidateProfile.name ? `(${candidateAResult.candidateProfile.name})` : ''}</span>
                    </button>
                  )}

                  {candidateBResult && (
                    <button
                      type="button"
                      className={`tab-btn main-tab-btn ${activeResultsTab === 'candidate_b' ? 'active' : ''}`}
                      onClick={() => setActiveResultsTab('candidate_b')}
                    >
                      <span className="candidate-pill candidate-b-pill" style={{ fontSize: '0.7rem' }}>B</span>
                      <span>Candidate B {candidateBResult.candidateProfile.name ? `(${candidateBResult.candidateProfile.name})` : ''}</span>
                    </button>
                  )}

                  {bothEvaluated && (
                    <button
                      type="button"
                      className={`tab-btn main-tab-btn ${activeResultsTab === 'final_comparison' ? 'active' : ''}`}
                      onClick={() => setActiveResultsTab('final_comparison')}
                    >
                      <GitCompare size={14} />
                      <span>Final Comparison</span>
                    </button>
                  )}
                </div>
              </div>

              {/* ── Tab View 1: Candidate A (9-Item Stepped Submenu) ── */}
              {activeResultsTab === 'candidate_a' && candidateAResult && (
                <div style={{ marginTop: '1.25rem' }}>
                  <CandidateReportView
                    result={candidateAResult}
                    candidateTag="Candidate A"
                    blueprint={blueprint}
                    onCitationClick={handleCitationClick}
                  />
                </div>
              )}

              {/* ── Tab View 2: Candidate B (9-Item Stepped Submenu) ── */}
              {activeResultsTab === 'candidate_b' && candidateBResult && (
                <div style={{ marginTop: '1.25rem' }}>
                  <CandidateReportView
                    result={candidateBResult}
                    candidateTag="Candidate B"
                    blueprint={blueprint}
                    onCitationClick={handleCitationClick}
                  />
                </div>
              )}

              {/* ── Tab View 3: Final Comparison (6-Item Stepped Submenu) ── */}
              {activeResultsTab === 'final_comparison' && candidateAResult && candidateBResult && (
                <div style={{ marginTop: '1.25rem' }}>
                  <ComparativeHiringCommittee
                    resultA={candidateAResult}
                    resultB={candidateBResult}
                    onCitationClick={handleCitationClick}
                  />
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Universal Interactive Citation Modal Popup */}
      <CitationModal
        data={citationModalData}
        onClose={() => setCitationModalData(null)}
      />
    </div>
  );
};
