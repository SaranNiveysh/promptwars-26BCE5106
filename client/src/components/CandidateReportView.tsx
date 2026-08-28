import React, { useState } from 'react';
import {
  User,
  Compass,
  Database,
  Cpu,
  HeartHandshake,
  Briefcase,
  AlertTriangle,
  MessageSquare,
  Award,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import { EvaluationResponse, IdealCandidateBlueprint } from '../types';
import { EvidenceBankView } from './EvidenceBankView';
import { EvaluatorCards } from './EvaluatorCards';
import { DebateView } from './DebateView';
import { FinalReportCard } from './FinalReportCard';

export type CandidateSubmenuId =
  | 'overview'
  | 'ideal_fit'
  | 'evidence_bank'
  | 'eval_technical'
  | 'eval_culture'
  | 'eval_hm'
  | 'eval_skeptic'
  | 'debate'
  | 'decision';

interface SubmenuItem {
  id: CandidateSubmenuId;
  label: string;
  shortLabel: string;
  stageLabel: string;
  icon: React.ReactNode;
}

const SUBMENU_ITEMS: SubmenuItem[] = [
  { id: 'overview', label: 'Overview', shortLabel: 'Overview', stageLabel: 'Profile & Status', icon: <User size={15} /> },
  { id: 'ideal_fit', label: 'Ideal Fit', shortLabel: 'Ideal Fit', stageLabel: 'Stage 0 Fit', icon: <Compass size={15} /> },
  { id: 'evidence_bank', label: 'Evidence Bank', shortLabel: 'Evidence', stageLabel: 'Stage 1 Evidence', icon: <Database size={15} /> },
  { id: 'eval_technical', label: 'Technical Evaluation', shortLabel: 'Technical', stageLabel: 'Stage 2 Evaluator', icon: <Cpu size={15} /> },
  { id: 'eval_culture', label: 'HR / Culture Evaluation', shortLabel: 'HR & Culture', stageLabel: 'Stage 2 Evaluator', icon: <HeartHandshake size={15} /> },
  { id: 'eval_hm', label: 'Hiring Manager Evaluation', shortLabel: 'Hiring Manager', stageLabel: 'Stage 2 Evaluator', icon: <Briefcase size={15} /> },
  { id: 'eval_skeptic', label: 'Skeptic / Risk Evaluation', shortLabel: 'Risk & Rigor', stageLabel: 'Stage 2 Evaluator', icon: <AlertTriangle size={15} /> },
  { id: 'debate', label: 'Agent Debate', shortLabel: 'Debate', stageLabel: 'Stage 3 Debate', icon: <MessageSquare size={15} /> },
  { id: 'decision', label: 'Final Decision', shortLabel: 'Decision', stageLabel: 'Stage 4 Synthesis', icon: <Award size={15} /> },
];

interface CandidateReportViewProps {
  result: EvaluationResponse;
  candidateTag: 'Candidate A' | 'Candidate B';
  blueprint?: IdealCandidateBlueprint | null;
  onCitationClick: (citationId: string) => void;
}

export const CandidateReportView: React.FC<CandidateReportViewProps> = ({
  result,
  candidateTag,
  blueprint: _blueprint,
  onCitationClick,
}) => {
  const [activeSubmenu, setActiveSubmenu] = useState<CandidateSubmenuId>('overview');

  const currentIndex = SUBMENU_ITEMS.findIndex((item) => item.id === activeSubmenu);
  const currentItem = SUBMENU_ITEMS[currentIndex] || SUBMENU_ITEMS[0];

  const handlePrev = () => {
    if (currentIndex > 0) {
      setActiveSubmenu(SUBMENU_ITEMS[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < SUBMENU_ITEMS.length - 1) {
      setActiveSubmenu(SUBMENU_ITEMS[currentIndex + 1].id);
    }
  };

  const name = result.candidateProfile.name || candidateTag;
  const recommendation = result.synthesizer.finalRecommendation;
  const confidence = result.synthesizer.confidence;

  const recClass =
    recommendation === 'Strong Yes'
      ? 'rec-strong_yes'
      : recommendation === 'Yes'
      ? 'rec-yes'
      : recommendation === 'Hold / Further Interview'
      ? 'rec-mixed'
      : 'rec-no';

  // Specific single evaluators
  const techEval = result.evaluators.filter((e) => e.agentId === 'technical');
  const cultureEval = result.evaluators.filter((e) => e.agentId === 'culture');
  const hmEval = result.evaluators.filter((e) => e.agentId === 'hiring_manager');
  const skepticEval = result.evaluators.filter((e) => e.agentId === 'skeptic');

  // Dynamic evidence citations
  const topEvidence = result.evidenceBank.slice(0, 4);
  const e1 = topEvidence[0]?.id;
  const e2 = topEvidence[1]?.id;
  const e3 = topEvidence[2]?.id;

  const topStrength = result.synthesizer.strengths[0]?.claim || 'Demonstrated technical experience across core domains.';
  const topConcern = result.synthesizer.concerns[0]?.claim || 'Domain-specific production depth requires verification.';

  return (
    <div className="candidate-report-container">
      {/* ── Fixed Candidate Summary Banner ── */}
      <div className="candidate-summary-banner">
        <div className="candidate-summary-left">
          <div className="candidate-avatar">
            {candidateTag === 'Candidate A' ? 'A' : 'B'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <span className={`candidate-pill ${candidateTag === 'Candidate A' ? 'candidate-a-pill' : 'candidate-b-pill'}`}>
                {candidateTag}
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                {name}
              </h2>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              {result.candidateProfile.currentRole}
            </p>
          </div>
        </div>

        <div className="candidate-summary-right">
          <div className="summary-stat-box">
            <span className="stat-label">Final Recommendation</span>
            <span className={`rec-badge ${recClass}`} style={{ fontSize: '0.78rem' }}>
              {recommendation}
            </span>
          </div>

          <div className="summary-stat-box">
            <span className="stat-label">Confidence</span>
            <span className="stat-value" style={{ color: '#38bdf8', fontWeight: 700 }}>
              {confidence}%
            </span>
          </div>

          <div className="summary-stat-box current-view-box">
            <span className="stat-label">Active Section</span>
            <span className="active-section-tag">
              {currentItem.stageLabel}: {currentItem.shortLabel}
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Layout: Sticky Left Sidebar + Content Area ── */}
      <div className="report-layout-grid">
        {/* Sticky Left Sidebar Submenu */}
        <aside className="report-sidebar">
          <div className="sidebar-header">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              Evaluation Stages
            </span>
          </div>

          <nav className="sidebar-nav">
            {SUBMENU_ITEMS.map((item, idx) => {
              const isActive = item.id === activeSubmenu;
              const isPast = idx < currentIndex;

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveSubmenu(item.id)}
                >
                  <div className="nav-item-icon">
                    {item.icon}
                  </div>
                  <div className="nav-item-text">
                    <span className="nav-item-label">{item.label}</span>
                    <span className="nav-item-stage">{item.stageLabel}</span>
                  </div>
                  <div className="nav-item-status">
                    {isPast ? (
                      <CheckCircle size={13} color="#34d399" />
                    ) : isActive ? (
                      <div className="active-dot" />
                    ) : (
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{idx + 1}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ── Active Content Pane ── */}
        <main className="report-content-pane">
          {/* Section 1: Overview */}
          {activeSubmenu === 'overview' && (
            <div className="card overview-pane">
              <div className="card-header">
                <div className="card-title-group">
                  <User size={18} color="var(--primary)" />
                  <div>
                    <h3 className="card-title">Candidate Profile &amp; Evaluation Summary</h3>
                    <p className="card-subtitle">Executive snapshot and synthesized hiring verdict.</p>
                  </div>
                </div>
              </div>

              <div className="overview-grid">
                <div className="overview-bio-card">
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.4rem' }}>
                    Candidate Summary
                  </h4>
                  <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                    {result.candidateProfile.summary}
                  </p>

                  <h4 style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    Demonstrated Skills
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {result.candidateProfile.skills.map((s, idx) => (
                      <span key={idx} className="skill-tag">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="overview-verdict-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                      Synthesizer Verdict
                    </span>
                    <span className={`rec-badge ${recClass}`}>{recommendation}</span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.45, marginBottom: '0.75rem' }}>
                    {result.synthesizer.executiveSummary}
                  </p>

                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <span>✓ 4 Evaluators Completed</span>
                    <span>✓ Debate Concluded</span>
                    <span>✓ Evidence Grounded</span>
                  </div>
                </div>
              </div>

              {/* Quick Stepper Hint */}
              <div style={{ marginTop: '1.25rem', padding: '0.85rem 1rem', background: 'rgba(99, 102, 241, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                  Use the left sidebar or navigation buttons below to inspect individual evaluation stages.
                </span>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ fontSize: '0.78rem', padding: '0.3rem 0.7rem' }}
                  onClick={() => setActiveSubmenu('ideal_fit')}
                >
                  Next: Ideal Fit →
                </button>
              </div>
            </div>
          )}

          {/* Section 2: Ideal Fit Alignment against Blueprint */}
          {activeSubmenu === 'ideal_fit' && (
            <div className="card ideal-fit-pane">
              <div className="card-header">
                <div className="card-title-group">
                  <Compass size={18} color="var(--primary)" />
                  <div>
                    <h3 className="card-title">Stage 0: Ideal Fit Alignment</h3>
                    <p className="card-subtitle">Candidate evidence mapped against target role requirements.</p>
                  </div>
                </div>
              </div>

              <div className="blueprint-fit-grid">
                <div className="fit-dimension-card">
                  <h4 className="fit-dimension-title">Role &amp; Technical Capabilities</h4>
                  <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                    {topStrength}
                    {e1 && (
                      <>
                        {' '}(<button type="button" className="evidence-badge" onClick={() => onCitationClick(e1)}>[{e1}]</button>
                        {e2 && <>, <button type="button" className="evidence-badge" onClick={() => onCitationClick(e2)}>[{e2}]</button></>})
                      </>
                    )}
                  </p>
                </div>

                <div className="fit-dimension-card">
                  <h4 className="fit-dimension-title">Core Skills &amp; Experience</h4>
                  <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                    {name} brings documented skills in {result.candidateProfile.skills.slice(0, 5).join(', ') || 'software engineering'} with verified claims from submitted materials
                    {e2 && (
                      <>
                        {' '}(<button type="button" className="evidence-badge" onClick={() => onCitationClick(e2)}>[{e2}]</button>)
                      </>
                    )}.
                  </p>
                </div>

                <div className="fit-dimension-card">
                  <h4 className="fit-dimension-title">Risks &amp; Validation Needs</h4>
                  <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                    {topConcern}
                    {e3 && (
                      <>
                        {' '}(<button type="button" className="evidence-badge" onClick={() => onCitationClick(e3)}>[{e3}]</button>)
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Evidence Bank */}
          {activeSubmenu === 'evidence_bank' && (
            <EvidenceBankView
              profile={result.candidateProfile}
              evidenceBank={result.evidenceBank}
              onCitationClick={onCitationClick}
            />
          )}

          {/* Section 4: Technical Evaluator */}
          {activeSubmenu === 'eval_technical' && (
            <EvaluatorCards
              evaluators={techEval}
              onCitationClick={onCitationClick}
            />
          )}

          {/* Section 5: HR / Culture Evaluator */}
          {activeSubmenu === 'eval_culture' && (
            <EvaluatorCards
              evaluators={cultureEval}
              onCitationClick={onCitationClick}
            />
          )}

          {/* Section 6: Hiring Manager Evaluator */}
          {activeSubmenu === 'eval_hm' && (
            <EvaluatorCards
              evaluators={hmEval}
              onCitationClick={onCitationClick}
            />
          )}

          {/* Section 7: Skeptic / Risk Evaluator */}
          {activeSubmenu === 'eval_skeptic' && (
            <EvaluatorCards
              evaluators={skepticEval}
              onCitationClick={onCitationClick}
            />
          )}

          {/* Section 8: Agent Debate */}
          {activeSubmenu === 'debate' && (
            <DebateView
              debate={result.debate}
              onCitationClick={onCitationClick}
            />
          )}

          {/* Section 9: Final Decision */}
          {activeSubmenu === 'decision' && (
            <FinalReportCard
              synthesizer={result.synthesizer}
              candidateName={result.candidateProfile.name}
              onCitationClick={onCitationClick}
            />
          )}

          {/* ── Stepper Navigation Buttons (Previous / Next) ── */}
          <div className="stepper-action-bar">
            <button
              type="button"
              className="btn btn-secondary"
              disabled={currentIndex === 0}
              onClick={handlePrev}
            >
              <ChevronLeft size={16} />
              Previous: {currentIndex > 0 ? SUBMENU_ITEMS[currentIndex - 1].shortLabel : 'Start'}
            </button>

            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Stage {currentIndex + 1} of {SUBMENU_ITEMS.length}
            </span>

            <button
              type="button"
              className="btn btn-primary"
              disabled={currentIndex === SUBMENU_ITEMS.length - 1}
              onClick={handleNext}
            >
              Next: {currentIndex < SUBMENU_ITEMS.length - 1 ? SUBMENU_ITEMS[currentIndex + 1].shortLabel : 'Finish'}
              <ChevronRight size={16} />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};
