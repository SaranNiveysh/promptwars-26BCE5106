import React from 'react';
import { Users, Code, HeartHandshake, Briefcase, AlertTriangle, HelpCircle } from 'lucide-react';
import { EvaluatorResult, EvaluatorRecommendation } from '../types';

interface EvaluatorCardsProps {
  evaluators: EvaluatorResult[];
  onCitationClick?: (citationId: string) => void;
}

const AGENT_ICONS = {
  technical: Code,
  culture: HeartHandshake,
  hiring_manager: Briefcase,
  skeptic: AlertTriangle,
};

const REC_LABELS: Record<EvaluatorRecommendation, string> = {
  strong_yes: 'Strong Yes',
  yes: 'Yes',
  mixed: 'Mixed / Neutral',
  no: 'No',
};

export const EvaluatorCards: React.FC<EvaluatorCardsProps> = ({
  evaluators,
  onCitationClick,
}) => {
  const renderBadge = (id: string) => (
    <button
      key={id}
      type="button"
      className="evidence-badge"
      style={{ cursor: 'pointer' }}
      onClick={() => onCitationClick && onCitationClick(id)}
      title="Click to view quote"
    >
      [{id}]
    </button>
  );

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Users size={22} color="var(--primary)" />
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700 }}>
              Stage 2: Four Independent Blind Evaluations
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              Parallel independent evaluator calls executed in strict isolation without seeing other agents' conclusions.
            </p>
          </div>
        </div>
      </div>

      <div className="evaluators-grid">
        {evaluators.map((ev) => {
          const Icon = AGENT_ICONS[ev.agentId] || Users;
          const recLabel = REC_LABELS[ev.recommendation] || ev.recommendation;

          return (
            <div key={ev.agentId} className={`evaluator-card ${ev.agentId}`}>
              <div className="evaluator-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-card-subtle)',
                      border: '1px solid var(--border-accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="evaluator-title">{ev.agentName}</h3>
                    <span className="evaluator-role">{ev.roleTitle}</span>
                  </div>
                </div>

                <div className={`rec-badge rec-${ev.recommendation}`}>
                  {recLabel}
                </div>
              </div>

              {/* Confidence Meter */}
              <div className="confidence-bar-container">
                <span>Confidence: {ev.confidence}%</span>
                <div className="confidence-bar-bg">
                  <div className="confidence-bar-fill" style={{ width: `${ev.confidence}%` }}></div>
                </div>
              </div>

              {/* Strengths */}
              <div>
                <h4 className="section-subtitle">Verified Strengths</h4>
                {ev.strengths && ev.strengths.length > 0 ? (
                  <ul className="claims-list strengths">
                    {ev.strengths.map((s, idx) => (
                      <li key={idx}>
                        <span>{s.claim}</span>
                        {s.evidenceIds && s.evidenceIds.length > 0 && (
                          <span style={{ marginLeft: '0.3rem' }}>
                            {s.evidenceIds.map(renderBadge)}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No strengths identified.</p>
                )}
              </div>

              {/* Concerns */}
              <div>
                <h4 className="section-subtitle">Grounded Concerns &amp; Risks</h4>
                {ev.concerns && ev.concerns.length > 0 ? (
                  <ul className="claims-list concerns">
                    {ev.concerns.map((c, idx) => (
                      <li key={idx}>
                        <span>{c.claim}</span>
                        {c.evidenceIds && c.evidenceIds.length > 0 && (
                          <span style={{ marginLeft: '0.3rem' }}>
                            {c.evidenceIds.map(renderBadge)}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No major concerns flagged.</p>
                )}
              </div>

              {/* Missing Evidence */}
              {ev.missingEvidence && ev.missingEvidence.length > 0 && (
                <div>
                  <h4 className="section-subtitle">Missing Information</h4>
                  <div className="missing-box">
                    {ev.missingEvidence.map((m, idx) => (
                      <div key={idx} style={{ marginBottom: idx === ev.missingEvidence.length - 1 ? 0 : '0.25rem' }}>
                        &bull; {m}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Probing Question */}
              {ev.keyQuestion && (
                <div style={{ marginTop: 'auto' }}>
                  <h4 className="section-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <HelpCircle size={13} /> Recommended Key Question
                  </h4>
                  <div className="key-question-box">
                    "{ev.keyQuestion}"
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
