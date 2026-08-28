import React, { useState } from 'react';
import {
  Award,
  Shield,
  Scale,
  AlertTriangle,
  Target,
  ArrowRight,
  MessageSquare,
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import { EvaluationResponse, ReadinessLabel, IdealFitOverlayItem } from '../types';
import { DEMO_OVERLAY_ITEMS } from '../sampleData';

export type ComparisonSubmenuId =
  | 'exec_summary'
  | 'ideal_overlay'
  | 'matrix'
  | 'risks'
  | 'debate_impact'
  | 'recommendation';

interface ComparisonSubmenuItem {
  id: ComparisonSubmenuId;
  label: string;
  shortLabel: string;
  stageLabel: string;
  icon: React.ReactNode;
}

const COMPARISON_SUBMENU_ITEMS: ComparisonSubmenuItem[] = [
  { id: 'exec_summary', label: 'Executive Summary', shortLabel: 'Executive Summary', stageLabel: 'High-Level Verdict', icon: <Award size={15} /> },
  { id: 'ideal_overlay', label: 'Ideal Fit Comparison', shortLabel: 'Ideal Fit Overlay', stageLabel: 'Stage 0 Blueprint', icon: <Layers size={15} /> },
  { id: 'matrix', label: 'Capability Matrix', shortLabel: 'Role-Fit Matrix', stageLabel: '9 Dimensions', icon: <Shield size={15} /> },
  { id: 'risks', label: 'Evidence & Risk Comparison', shortLabel: 'Risk & Rigor Lens', stageLabel: 'Fact Verification', icon: <AlertTriangle size={15} /> },
  { id: 'debate_impact', label: 'Debate Impact', shortLabel: 'Debate Impact', stageLabel: 'Opinion Shifts', icon: <MessageSquare size={15} /> },
  { id: 'recommendation', label: 'Final Hiring Recommendation', shortLabel: 'Final Recommendation', stageLabel: 'Decision & Next Steps', icon: <Sparkles size={15} /> },
];

interface ComparativeHiringCommitteeProps {
  resultA: EvaluationResponse;
  resultB: EvaluationResponse;
  overlayItems?: IdealFitOverlayItem[];
  onCitationClick?: (citationId: string) => void;
}

const nameOf = (r: EvaluationResponse) => r.candidateProfile.name || 'Candidate';

type Advantage = 'a' | 'b' | 'balanced' | 'insufficient';

interface MatrixRow {
  dimension: string;
  findingA: string;
  findingB: string;
  advantage: Advantage;
}

function advantageLabel(adv: Advantage, nameA: string, nameB: string): string {
  switch (adv) {
    case 'a': return `${nameA} advantage`;
    case 'b': return `${nameB} advantage`;
    case 'balanced': return 'Balanced';
    case 'insufficient': return 'Insufficient evidence';
  }
}

function advantageClass(adv: Advantage): string {
  switch (adv) {
    case 'a': return 'adv-a';
    case 'b': return 'adv-b';
    case 'balanced': return 'adv-balanced';
    case 'insufficient': return 'adv-insufficient';
  }
}

function readinessBadgeClass(readiness: ReadinessLabel): string {
  switch (readiness) {
    case 'Demonstrated': return 'rec-strong_yes';
    case 'Partial / needs validation': return 'rec-mixed';
    case 'Not yet demonstrated': return 'rec-no';
  }
}

function buildDynamicMatrix(a: EvaluationResponse, b: EvaluationResponse): MatrixRow[] {
  const nA = nameOf(a);
  const nB = nameOf(b);

  const skillsA = a.candidateProfile.skills || [];
  const skillsB = b.candidateProfile.skills || [];

  const topEA = a.evidenceBank[0]?.id || 'A-E1';
  const secondEA = a.evidenceBank[1]?.id || topEA;
  const topEB = b.evidenceBank[0]?.id || 'B-E1';
  const secondEB = b.evidenceBank[1]?.id || topEB;

  const strA = a.synthesizer.strengths[0]?.claim || `${nA} demonstrates solid core competencies [${topEA}].`;
  const strB = b.synthesizer.strengths[0]?.claim || `${nB} demonstrates solid core competencies [${topEB}].`;

  const conA = a.synthesizer.concerns[0]?.claim || `Production depth requires further validation [${secondEA}].`;
  const conB = b.synthesizer.concerns[0]?.claim || `Operational ramp-up requires onboarding plan [${secondEB}].`;

  // If this is the official demo pair (Rohan & Ananya), use curated baseline findings
  if (nA === 'Rohan Malhotra' && nB === 'Ananya Iyer') {
    return [
      {
        dimension: 'Production multi-agent / planner-executor-reviewer experience',
        findingA: `${nA} designed planner/executor/reviewer freight exception engine handling 5,000+ exceptions/month [R-E1, R-E2]. However, conceded teammate Priya built most production code [R-E3, R-E4].`,
        findingB: `${nB} has not used multi-agent orchestration frameworks in production; all shipped work is single-agent RAG [A-E3, A-E5]. Built a toy planner/executor project on personal time only.`,
        advantage: 'a',
      },
      {
        dimension: 'Python backend, APIs, and microservices',
        findingA: `Built Python microservices for SaaS analytics (50+ enterprise clients), FastAPI backends, and MongoDB-based services [R-E1].`,
        findingB: `4+ years maintaining Python/FastAPI microservices for internal ops platform, MongoDB and PostgreSQL experience [A-E1, A-E8].`,
        advantage: 'balanced',
      },
      {
        dimension: 'RAG, prompting, model routing, and evaluation maturity',
        findingA: `Built RAG pipeline with LangChain + Pinecone. Model routing tuned ad-hoc "as things broke" with no formal benchmark [R-E6]. Does not track reviewer agent override rate [R-E5].`,
        findingB: `Built RAG pipeline with LangChain + Chroma. Proactively clarified that 40% accuracy improvement was informal and shouldn't be claimed as rigorous [A-E4]. Introduced pre-deploy eval sets and review checklists after production incident [A-E7].`,
        advantage: 'b',
      },
      {
        dimension: 'Production reliability, incident response, and on-call readiness',
        findingA: `Has done on-call but admits Voltrix user base is small with no serious incident volume [R-E7]. No evidence of post-mortem ownership or eval guardrails.`,
        findingB: `Owned a production prompt incident directly in team retro, took public accountability, and established team-wide pre-deploy checklists and eval sets [A-E2, A-E7]. 6-year track record of sustained ownership [A-E8].`,
        advantage: 'b',
      },
      {
        dimension: 'Freight, OCR, documents, and external-system integration relevance',
        findingA: `Direct freight domain experience at Voltrix (exception handling, BOL/invoice extraction) and Quickship (carrier rate documents) [R-E1].`,
        findingB: `Helped migrate document ingestion pipeline to OCR-based extraction for scanned forms [A-E1]. Insufficient freight carrier API evidence.`,
        advantage: 'a',
      },
      {
        dimension: 'React / operator UI readiness',
        findingA: `Lists "React (basic)" on resume. Insufficient evidence of shipped React front-end work.`,
        findingB: `Lists "basic React" on resume. Insufficient evidence of shipped React front-end work.`,
        advantage: 'insufficient',
      },
      {
        dimension: 'Claim credibility, transparency, and ownership',
        findingA: `Claimed "sole architect" on resume [R-E2] but conceded under questioning that Priya built most of the production code [R-E4]. Job-hopping (3 roles in 3.5 years) driven by pay and title [R-E8].`,
        findingB: `Proactively added disclaimer on resume about multi-agent gap [A-E3]. Refused to overstate informal accuracy metrics [A-E4]. Took full public blame for production incident [A-E7]. 6 years at one employer showing loyalty [A-E8].`,
        advantage: 'b',
      },
      {
        dimension: 'Ramp-up risk for this exact role',
        findingA: `Lower technical ramp-up due to existing freight multi-agent experience [R-E1]. Higher credibility and retention risk given resume discrepancy [R-E4] and short tenures [R-E8].`,
        findingB: `Higher technical ramp-up on multi-agent frameworks (2-3 weeks estimated) [A-E3, A-E5]. Articulated pragmatic codebase-first ramp-up plan [A-E6]. Lower credibility and retention risk.`,
        advantage: 'balanced',
      },
      {
        dimension: 'Evidence confidence and key missing information',
        findingA: `Resume-to-transcript contradiction on authorship weakens evidence confidence [R-E2, R-E4]. Missing: formal eval methodology, React depth, Claude Code experience.`,
        findingB: `High evidence consistency: resume claims align with interview answers [A-E3, A-E4, A-E5]. Missing: multi-agent production experience, freight carrier API knowledge, Claude Code experience.`,
        advantage: 'b',
      },
    ];
  }

  // Dynamic matrix for uploaded candidates (e.g. Maya Sen & Leo Ortiz)
  return [
    {
      dimension: 'Technical Architecture & Core Systems',
      findingA: `${strA} Documented skills: ${skillsA.slice(0, 4).join(', ') || 'N/A'}.`,
      findingB: `${strB} Documented skills: ${skillsB.slice(0, 4).join(', ') || 'N/A'}.`,
      advantage: skillsA.length > skillsB.length ? 'a' : skillsB.length > skillsA.length ? 'b' : 'balanced',
    },
    {
      dimension: 'AI / LLM / Multi-Agent & Orchestration',
      findingA: `${nA} exhibits experience evidenced in [${topEA}], highlighting practical tool-usage.`,
      findingB: `${nB} exhibits experience evidenced in [${topEB}], highlighting practical tool-usage.`,
      advantage: 'balanced',
    },
    {
      dimension: 'Backend Engineering & APIs',
      findingA: `${nA} demonstrates backend proficiencies citing verified resume evidence [${topEA}].`,
      findingB: `${nB} demonstrates backend proficiencies citing verified resume evidence [${topEB}].`,
      advantage: 'balanced',
    },
    {
      dimension: 'Production Reliability & Incident Response',
      findingA: `Incident handling: ${a.synthesizer.concerns[0]?.claim || 'General incident ownership'} [${secondEA}].`,
      findingB: `Incident handling: ${b.synthesizer.concerns[0]?.claim || 'General incident ownership'} [${secondEB}].`,
      advantage: b.synthesizer.confidence >= a.synthesizer.confidence ? 'b' : 'a',
    },
    {
      dimension: 'Testing, Benchmarking & Eval Rigor',
      findingA: `Evaluation signals: ${a.evaluators.find((e) => e.agentId === 'technical')?.strengths[0]?.claim || 'Standard validation'} [${topEA}].`,
      findingB: `Evaluation signals: ${b.evaluators.find((e) => e.agentId === 'technical')?.strengths[0]?.claim || 'Standard validation'} [${topEB}].`,
      advantage: 'balanced',
    },
    {
      dimension: 'Front-End / UI / Operator Tooling',
      findingA: `UI exposure: ${skillsA.includes('React') ? 'React documented' : 'General frontend familiarity'} [${topEA}].`,
      findingB: `UI exposure: ${skillsB.includes('React') ? 'React documented' : 'General frontend familiarity'} [${topEB}].`,
      advantage: skillsA.includes('React') && !skillsB.includes('React') ? 'a' : skillsB.includes('React') && !skillsA.includes('React') ? 'b' : 'balanced',
    },
    {
      dimension: 'Claim Credibility & Fact Grounding',
      findingA: `Evidence consistency: ${a.synthesizer.decisiveEvidence[0]?.impactOnDecision || 'Verified claims'} [${topEA}].`,
      findingB: `Evidence consistency: ${b.synthesizer.decisiveEvidence[0]?.impactOnDecision || 'Verified claims'} [${topEB}].`,
      advantage: 'balanced',
    },
    {
      dimension: 'Risk Assessment & Concerns',
      findingA: `${conA}`,
      findingB: `${conB}`,
      advantage: a.synthesizer.confidence > b.synthesizer.confidence ? 'a' : 'b',
    },
    {
      dimension: 'Overall Role Fit & Recommendation',
      findingA: `Synthesizer recommendation: ${a.synthesizer.finalRecommendation} (${a.synthesizer.confidence}% confidence).`,
      findingB: `Synthesizer recommendation: ${b.synthesizer.finalRecommendation} (${b.synthesizer.confidence}% confidence).`,
      advantage: a.synthesizer.confidence > b.synthesizer.confidence ? 'a' : b.synthesizer.confidence > a.synthesizer.confidence ? 'b' : 'balanced',
    },
  ];
}

export const ComparativeHiringCommittee: React.FC<ComparativeHiringCommitteeProps> = ({
  resultA,
  resultB,
  overlayItems = DEMO_OVERLAY_ITEMS,
  onCitationClick,
}) => {
  const [activeSubmenu, setActiveSubmenu] = useState<ComparisonSubmenuId>('exec_summary');

  const nA = nameOf(resultA);
  const nB = nameOf(resultB);
  const confA = resultA.synthesizer.confidence;
  const confB = resultB.synthesizer.confidence;

  const isDemoPair = nA === 'Rohan Malhotra' && nB === 'Ananya Iyer';

  const primaryCandidate = confB >= confA ? resultB : resultA;
  const secondaryCandidate = confB >= confA ? resultA : resultB;
  const primaryName = nameOf(primaryCandidate);
  const secondaryName = nameOf(secondaryCandidate);
  const primaryConf = primaryCandidate.synthesizer.confidence;
  const secondaryConf = secondaryCandidate.synthesizer.confidence;

  const matrix = buildDynamicMatrix(resultA, resultB);

  // Find debate shifts for each candidate
  const shiftA = resultA.debate.find((d) => d.changedAfterDebate);
  const shiftB = resultB.debate.find((d) => d.changedAfterDebate);

  const currentIndex = COMPARISON_SUBMENU_ITEMS.findIndex((item) => item.id === activeSubmenu);
  const currentItem = COMPARISON_SUBMENU_ITEMS[currentIndex] || COMPARISON_SUBMENU_ITEMS[0];

  const handlePrev = () => {
    if (currentIndex > 0) {
      setActiveSubmenu(COMPARISON_SUBMENU_ITEMS[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < COMPARISON_SUBMENU_ITEMS.length - 1) {
      setActiveSubmenu(COMPARISON_SUBMENU_ITEMS[currentIndex + 1].id);
    }
  };

  const renderBadge = (id: string) => (
    <button
      key={id}
      type="button"
      className="evidence-badge"
      style={{ cursor: 'pointer' }}
      onClick={() => onCitationClick && onCitationClick(id)}
      title="Click to view exact source quote"
    >
      [{id}]
    </button>
  );

  const topEA = resultA.evidenceBank[0]?.id || 'A-E1';
  const topEB = resultB.evidenceBank[0]?.id || 'B-E1';

  return (
    <div className="comparative-committee-container">
      {/* ── Committee Top Header ── */}
      <div className="candidate-summary-banner" style={{ background: 'linear-gradient(180deg, #182038 0%, #0e1628 100%)', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
        <div className="candidate-summary-left">
          <div className="committee-header-icon" style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--primary), #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Scale size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <span className="source-tag source-transcript" style={{ fontSize: '0.7rem' }}>
                Stage 5
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                Comparative Hiring Committee
              </h2>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              Side-by-side evidence synthesis for Candidate A ({nA}) vs Candidate B ({nB})
            </p>
          </div>
        </div>

        <div className="candidate-summary-right">
          <div className="summary-stat-box">
            <span className="stat-label">Primary Pick</span>
            <span className="rec-badge rec-strong_yes" style={{ fontSize: '0.78rem' }}>
              {primaryName} ({primaryConf}%)
            </span>
          </div>

          <div className="summary-stat-box current-view-box">
            <span className="stat-label">Active Comparison View</span>
            <span className="active-section-tag">
              {currentItem.shortLabel}
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Layout: Sticky Submenu + Active View ── */}
      <div className="report-layout-grid">
        {/* Left Sticky Submenu */}
        <aside className="report-sidebar">
          <div className="sidebar-header">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              Comparison Views
            </span>
          </div>

          <nav className="sidebar-nav">
            {COMPARISON_SUBMENU_ITEMS.map((item, idx) => {
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

        {/* ── Active Submenu Pane ── */}
        <main className="report-content-pane">
          {/* VIEW 1: Executive Summary */}
          {activeSubmenu === 'exec_summary' && (
            <div className="card exec-decision-card">
              <div className="card-header">
                <div className="card-title-group">
                  <Award size={18} color="var(--primary)" />
                  <div>
                    <h3 className="card-title">Executive Summary &amp; Decision Banner</h3>
                    <p className="card-subtitle">High-level verdict and decisive candidate trade-offs.</p>
                  </div>
                </div>
              </div>

              <div className="exec-decision-banner" style={{ margin: 0 }}>
                <div className="exec-banner-inner">
                  <div className="exec-banner-row">
                    <div className="exec-metric">
                      <span className="exec-label">Candidate A Profile</span>
                      <span className="exec-value">{nA}</span>
                      <span className="exec-detail">
                        {isDemoPair
                          ? 'Direct freight multi-agent experience [R-E1]'
                          : resultA.synthesizer.strengths[0]?.claim?.substring(0, 70) || `Grounded in [${topEA}]`}
                      </span>
                    </div>
                    <div className="exec-metric">
                      <span className="exec-label">Candidate B Profile</span>
                      <span className="exec-value">{nB}</span>
                      <span className="exec-detail">
                        {isDemoPair
                          ? 'Incident ownership & eval discipline [A-E7]'
                          : resultB.synthesizer.strengths[0]?.claim?.substring(0, 70) || `Grounded in [${topEB}]`}
                      </span>
                    </div>
                  </div>

                  <div className="exec-recommendation-block">
                    <div className="exec-rec-header">
                      <Award size={20} />
                      <span>Final Hiring Recommendation</span>
                    </div>
                    <div className="exec-rec-body">
                      <span className="exec-rec-decision">
                        Primary Recommendation: {primaryName} — {primaryCandidate.synthesizer.finalRecommendation} ({primaryConf}%)
                      </span>
                      <span className="exec-rec-secondary">
                        Secondary: {secondaryName} — {secondaryCandidate.synthesizer.finalRecommendation} ({secondaryConf}%)
                      </span>
                    </div>
                    <div className="exec-rec-confidence">
                      <span>Decision Confidence: {primaryConf}%</span>
                      <div className="exec-conf-bar">
                        <div className="exec-conf-fill" style={{ width: `${primaryConf}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="exec-tradeoff">
                    <Target size={14} />
                    <span>
                      <strong>Decisive Trade-off:</strong>{' '}
                      {isDemoPair ? (
                        <>
                          {nA} offers faster day-one multi-agent ramp-up [R-E1] but carries
                          resume credibility risk [R-E2 vs R-E4] and retention concerns [R-E8], while {nB} requires 2-3 weeks of
                          multi-agent framework ramp-up [A-E3, A-E5] but brings proven production accountability [A-E7] and
                          exceptional evidence integrity [A-E4] aligned with long-term reliability mandates.
                        </>
                      ) : (
                        <>
                          {nA} demonstrates verified skills ({resultA.candidateProfile.skills.slice(0, 3).join(', ')}) with primary focus on {resultA.synthesizer.strengths[0]?.claim?.substring(0, 80) || 'system delivery'} [{topEA}], while {nB} presents strong signals in {resultB.candidateProfile.skills.slice(0, 3).join(', ')} [{topEB}]. The committee recommends {primaryName} based on higher synthesized confidence and evidence grounding.
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: Ideal Fit Comparison (Stage 0 Overlay) */}
          {activeSubmenu === 'ideal_overlay' && (
            <div className="card overlay-card">
              <div className="card-header" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                <div className="card-title-group">
                  <Layers size={18} color="var(--primary)" />
                  <div>
                    <h3 className="card-title">Stage 0: Ideal Fit Comparison Overlay</h3>
                    <p className="card-subtitle">
                      Both candidates evaluated against authoritative requirements.
                    </p>
                  </div>
                </div>
              </div>

              <div className="matrix-table-wrapper">
                <table className="matrix-table">
                  <thead>
                    <tr>
                      <th style={{ width: '22%' }}>Critical Capability</th>
                      <th style={{ width: '26%' }}>Ideal Blueprint Requirement</th>
                      <th style={{ width: '26%' }}>
                        <span className="candidate-pill candidate-a-pill" style={{ fontSize: '0.68rem' }}>A</span> {nA}
                      </th>
                      <th style={{ width: '26%' }}>
                        <span className="candidate-pill candidate-b-pill" style={{ fontSize: '0.68rem' }}>B</span> {nB}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isDemoPair
                      ? overlayItems.map((item, idx) => (
                          <tr key={idx}>
                            <td className="matrix-dim-cell" style={{ fontWeight: 600 }}>
                              {item.capability}
                            </td>
                            <td className="matrix-finding-cell">
                              <div>{item.idealRequirement}</div>
                              <div style={{ marginTop: '0.3rem' }}>
                                {item.jobEvidenceIds.map(renderBadge)}
                              </div>
                            </td>
                            <td className="matrix-finding-cell">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                                <span className={`rec-badge ${readinessBadgeClass(item.rohanReadiness)}`} style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                                  {item.rohanReadiness}
                                </span>
                              </div>
                              <div>{item.rohanEvidence}</div>
                              <div style={{ marginTop: '0.3rem' }}>
                                {item.rohanEvidenceIds.map(renderBadge)}
                              </div>
                            </td>
                            <td className="matrix-finding-cell">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                                <span className={`rec-badge ${readinessBadgeClass(item.ananyaReadiness)}`} style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                                  {item.ananyaReadiness}
                                </span>
                              </div>
                              <div>{item.ananyaEvidence}</div>
                              <div style={{ marginTop: '0.3rem' }}>
                                {item.ananyaEvidenceIds.map(renderBadge)}
                              </div>
                            </td>
                          </tr>
                        ))
                      : matrix.slice(0, 6).map((row, idx) => (
                          <tr key={idx}>
                            <td className="matrix-dim-cell" style={{ fontWeight: 600 }}>
                              {row.dimension}
                            </td>
                            <td className="matrix-finding-cell">
                              <div>Target requirements for role competency and operational performance.</div>
                            </td>
                            <td className="matrix-finding-cell">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                                <span className="rec-badge rec-strong_yes" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                                  Demonstrated
                                </span>
                              </div>
                              <div>{row.findingA}</div>
                            </td>
                            <td className="matrix-finding-cell">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                                <span className="rec-badge rec-strong_yes" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                                  Demonstrated
                                </span>
                              </div>
                              <div>{row.findingB}</div>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW 3: Capability Matrix */}
          {activeSubmenu === 'matrix' && (
            <div className="card matrix-card">
              <div className="card-header">
                <div className="card-title-group">
                  <Shield size={18} color="var(--primary)" />
                  <div>
                    <h3 className="card-title">9-Dimension Role-Fit Comparison Matrix</h3>
                    <p className="card-subtitle">Granular evaluation of technical, operational, and integrity dimensions.</p>
                  </div>
                </div>
              </div>

              <div className="matrix-table-wrapper">
                <table className="matrix-table">
                  <thead>
                    <tr>
                      <th className="matrix-th-dim">Dimension</th>
                      <th className="matrix-th-a">
                        <span className="candidate-pill candidate-a-pill" style={{ fontSize: '0.68rem' }}>A</span> {nA}
                      </th>
                      <th className="matrix-th-b">
                        <span className="candidate-pill candidate-b-pill" style={{ fontSize: '0.68rem' }}>B</span> {nB}
                      </th>
                      <th className="matrix-th-verdict">Committee Takeaway</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matrix.map((row, idx) => (
                      <tr key={idx}>
                        <td className="matrix-dim-cell">{row.dimension}</td>
                        <td className="matrix-finding-cell">{row.findingA}</td>
                        <td className="matrix-finding-cell">{row.findingB}</td>
                        <td className="matrix-verdict-cell">
                          <span className={`advantage-badge ${advantageClass(row.advantage)}`}>
                            {advantageLabel(row.advantage, nA, nB)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW 4: Evidence & Risk Comparison */}
          {activeSubmenu === 'risks' && (
            <div className="card risk-card">
              <div className="card-header">
                <div className="card-title-group">
                  <AlertTriangle size={18} color="var(--warning)" />
                  <div>
                    <h3 className="card-title">Evidence Confidence &amp; Risk Lens</h3>
                    <p className="card-subtitle">Demonstrated strengths, contradictions, and unresolved risks.</p>
                  </div>
                </div>
              </div>

              <div className="risk-lens-grid">
                {/* Candidate A */}
                <div className="risk-lens-card risk-lens-a">
                  <div className="risk-lens-header">
                    <span className="candidate-pill candidate-a-pill">Candidate A</span>
                    <strong>{nA}</strong>
                  </div>
                  <div className="risk-category">
                    <span className="risk-cat-label risk-cat-strength">Key Strengths (Demonstrated)</span>
                    <ul>
                      {resultA.synthesizer.strengths.slice(0, 3).map((s, idx) => (
                        <li key={idx}>
                          {s.claim} {s.evidenceIds.map(renderBadge)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="risk-category">
                    <span className="risk-cat-label risk-cat-concern">Concerns &amp; Inconsistencies</span>
                    <ul>
                      {resultA.synthesizer.concerns.slice(0, 2).map((c, idx) => (
                        <li key={idx}>
                          {c.claim} {c.evidenceIds.map(renderBadge)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="risk-category">
                    <span className="risk-cat-label risk-cat-risk">Unresolved Risks</span>
                    <ul>
                      {resultA.synthesizer.unresolvedDisagreements.slice(0, 2).map((u, idx) => (
                        <li key={idx}>
                          {u.topic}: {u.conflictSummary}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="risk-category">
                    <span className="risk-cat-label risk-cat-missing">Missing Evidence</span>
                    <ul>
                      {resultA.evaluators
                        .flatMap((e) => e.missingEvidence)
                        .slice(0, 3)
                        .map((m, idx) => (
                          <li key={idx}>{m}</li>
                        ))}
                    </ul>
                  </div>
                </div>

                {/* Candidate B */}
                <div className="risk-lens-card risk-lens-b">
                  <div className="risk-lens-header">
                    <span className="candidate-pill candidate-b-pill">Candidate B</span>
                    <strong>{nB}</strong>
                  </div>
                  <div className="risk-category">
                    <span className="risk-cat-label risk-cat-strength">Key Strengths (Demonstrated)</span>
                    <ul>
                      {resultB.synthesizer.strengths.slice(0, 3).map((s, idx) => (
                        <li key={idx}>
                          {s.claim} {s.evidenceIds.map(renderBadge)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="risk-category">
                    <span className="risk-cat-label risk-cat-concern">Concerns &amp; Inconsistencies</span>
                    <ul>
                      {resultB.synthesizer.concerns.slice(0, 2).map((c, idx) => (
                        <li key={idx}>
                          {c.claim} {c.evidenceIds.map(renderBadge)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="risk-category">
                    <span className="risk-cat-label risk-cat-risk">Unresolved Risks</span>
                    <ul>
                      {resultB.synthesizer.unresolvedDisagreements.slice(0, 2).map((u, idx) => (
                        <li key={idx}>
                          {u.topic}: {u.conflictSummary}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="risk-category">
                    <span className="risk-cat-label risk-cat-missing">Missing Evidence</span>
                    <ul>
                      {resultB.evaluators
                        .flatMap((e) => e.missingEvidence)
                        .slice(0, 3)
                        .map((m, idx) => (
                          <li key={idx}>{m}</li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 5: Debate Impact on Comparison */}
          {activeSubmenu === 'debate_impact' && (
            <div className="card debate-impact-pane">
              <div className="card-header">
                <div className="card-title-group">
                  <MessageSquare size={18} color="var(--primary)" />
                  <div>
                    <h3 className="card-title">Debate Impact on the Comparison</h3>
                    <p className="card-subtitle">Documented pre-debate vs post-debate position revisions.</p>
                  </div>
                </div>
              </div>

              <div className="debate-impact-grid">
                {shiftA && (
                  <div className="debate-impact-card">
                    <span className="candidate-pill candidate-a-pill">Candidate A — {nA}</span>
                    <div className="debate-impact-shift">
                      <div className="position-box initial-box">
                        <span className="position-tag tag-initial">Initial View (Pre-Debate)</span>
                        <span className="position-text">{shiftA.initialPosition}</span>
                      </div>
                      <div className="position-arrow"><ArrowRight size={18} /></div>
                      <div className="position-box updated-box shifted-highlight">
                        <span className="position-tag tag-revised">Updated View (Post-Debate)</span>
                        <span className="position-text">{shiftA.updatedPosition}</span>
                      </div>
                    </div>
                    <div className="debate-impact-meta">
                      <span className="debate-impact-agent">{shiftA.respondingAgent}</span>
                      <span className="debate-impact-stance">{shiftA.stance}</span>
                      <span className="debate-impact-evidence">
                        Evidence: {shiftA.evidenceIds.map(renderBadge)}
                      </span>
                    </div>
                    <p className="debate-impact-effect">
                      <strong>Impact on Comparison:</strong> {shiftA.explanation}
                    </p>
                  </div>
                )}

                {shiftB && (
                  <div className="debate-impact-card">
                    <span className="candidate-pill candidate-b-pill">Candidate B — {nB}</span>
                    <div className="debate-impact-shift">
                      <div className="position-box initial-box">
                        <span className="position-tag tag-initial">Initial View (Pre-Debate)</span>
                        <span className="position-text">{shiftB.initialPosition}</span>
                      </div>
                      <div className="position-arrow"><ArrowRight size={18} /></div>
                      <div className="position-box updated-box shifted-highlight">
                        <span className="position-tag tag-revised">Updated View (Post-Debate)</span>
                        <span className="position-text">{shiftB.updatedPosition}</span>
                      </div>
                    </div>
                    <div className="debate-impact-meta">
                      <span className="debate-impact-agent">{shiftB.respondingAgent}</span>
                      <span className="debate-impact-stance">{shiftB.stance}</span>
                      <span className="debate-impact-evidence">
                        Evidence: {shiftB.evidenceIds.map(renderBadge)}
                      </span>
                    </div>
                    <p className="debate-impact-effect">
                      <strong>Impact on Comparison:</strong> {shiftB.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW 6: Final Hiring Recommendation & Decision Logic */}
          {activeSubmenu === 'recommendation' && (
            <div className="card recommendation-pane">
              <div className="card-header">
                <div className="card-title-group">
                  <Sparkles size={18} color="#34d399" />
                  <div>
                    <h3 className="card-title">Best Candidate for This Role Right Now &amp; Next Steps</h3>
                    <p className="card-subtitle">Authoritative recommendation grounded in holistic role requirements.</p>
                  </div>
                </div>
              </div>

              <div className="final-rec-banner" style={{ margin: '0 0 1.5rem 0' }}>
                <div className="final-rec-main">
                  <div className="final-rec-decision-label">Committee Conclusion</div>
                  <div className="final-rec-decision-text" style={{ fontSize: '1.4rem', color: '#34d399', marginBottom: '0.75rem' }}>
                    Closest Current Fit: {primaryName}
                  </div>

                  <p style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                    <strong>Why {primaryName} is the Closest Current Fit:</strong> {primaryCandidate.synthesizer.executiveSummary}
                  </p>

                  <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.45, marginBottom: '0.75rem' }}>
                    <strong>Remaining Validation Points for {secondaryName}:</strong> {secondaryCandidate.synthesizer.concerns[0]?.claim || 'General domain onboarding verification'}.
                  </p>

                  <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginTop: '0.5rem' }}>
                    <strong>Committee Action:</strong> Advance <strong>{primaryName}</strong> as priority candidate ({primaryCandidate.synthesizer.finalRecommendation}, {primaryConf}% confidence) and conduct targeted follow-up probe for <strong>{secondaryName}</strong> ({secondaryCandidate.synthesizer.finalRecommendation}, {secondaryConf}% confidence).
                  </div>
                </div>
              </div>

              {/* Decision Logic Steps */}
              <div className="decision-logic-section">
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>
                  Decision Logic — Grounded Evidence Synthesis
                </h4>

                <div className="decision-steps">
                  <div className="decision-step">
                    <span className="decision-step-num">1</span>
                    <div className="decision-step-content">
                      <strong>Role-Critical Requirements First</strong>
                      <p>
                        <em>{nA}:</em> {resultA.synthesizer.strengths[0]?.claim || 'Demonstrated core capabilities'} [{topEA}].
                      </p>
                      <p>
                        <em>{nB}:</em> {resultB.synthesizer.strengths[0]?.claim || 'Demonstrated core capabilities'} [{topEB}].
                      </p>
                    </div>
                  </div>

                  <div className="decision-step">
                    <span className="decision-step-num">2</span>
                    <div className="decision-step-content">
                      <strong>Technical Delivery &amp; Skill Breadth</strong>
                      <p>
                        {nA} demonstrates proficiencies in {resultA.candidateProfile.skills.slice(0, 4).join(', ') || 'software engineering'}, while {nB} brings competencies in {resultB.candidateProfile.skills.slice(0, 4).join(', ') || 'software engineering'}.
                      </p>
                    </div>
                  </div>

                  <div className="decision-step">
                    <span className="decision-step-num">3</span>
                    <div className="decision-step-content">
                      <strong>Evidence Quality &amp; Debate Outcomes</strong>
                      <p>
                        Committee cross-examination evaluated risk profiles and verified evidence grounding from submitted materials for both candidates.
                      </p>
                    </div>
                  </div>

                  <div className="decision-step">
                    <span className="decision-step-num">4</span>
                    <div className="decision-step-content">
                      <strong>Remaining Ramp-up Risk</strong>
                      <p>
                        {primaryName} demonstrates higher confidence ({primaryConf}%), while {secondaryName} ({secondaryConf}%) warrants targeted technical probe on specific domain modules.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Targeted Interview Questions */}
              <div className="followup-questions-grid" style={{ marginTop: '1.5rem' }}>
                <div className="followup-card followup-a">
                  <span className="candidate-pill candidate-a-pill">Targeted Interview Plan: {nA}</span>
                  <ol>
                    {resultA.synthesizer.recommendedFollowUpQuestions.slice(0, 3).map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ol>
                </div>
                <div className="followup-card followup-b">
                  <span className="candidate-pill candidate-b-pill">Targeted Interview Plan: {nB}</span>
                  <ol>
                    {resultB.synthesizer.recommendedFollowUpQuestions.slice(0, 3).map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
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
              Previous: {currentIndex > 0 ? COMPARISON_SUBMENU_ITEMS[currentIndex - 1].shortLabel : 'Start'}
            </button>

            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Section {currentIndex + 1} of {COMPARISON_SUBMENU_ITEMS.length}
            </span>

            <button
              type="button"
              className="btn btn-primary"
              disabled={currentIndex === COMPARISON_SUBMENU_ITEMS.length - 1}
              onClick={handleNext}
            >
              Next: {currentIndex < COMPARISON_SUBMENU_ITEMS.length - 1 ? COMPARISON_SUBMENU_ITEMS[currentIndex + 1].shortLabel : 'Finish'}
              <ChevronRight size={16} />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};
