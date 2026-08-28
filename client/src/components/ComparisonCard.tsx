import React from 'react';
import { GitCompare, Award } from 'lucide-react';
import { EvaluationResponse, CandidateComparison } from '../types';

interface ComparisonCardProps {
  candidateAResult: EvaluationResponse;
  candidateBResult: EvaluationResponse;
  comparison?: CandidateComparison;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({
  candidateAResult,
  candidateBResult,
  comparison,
}) => {
  const nameA = candidateAResult.candidateProfile.name || 'Candidate A';
  const nameB = candidateBResult.candidateProfile.name || 'Candidate B';

  const recA = candidateAResult.synthesizer.finalRecommendation;
  const recB = candidateBResult.synthesizer.finalRecommendation;

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(168, 85, 247, 0.08))', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
      <div className="card-header">
        <div className="card-title-group">
          <GitCompare size={22} color="var(--primary)" />
          <div>
            <h2 className="card-title">Dual Candidate Comparative Synthesis (Bonus)</h2>
            <p className="card-subtitle">
              Executive synthesis comparing Candidate A ({nameA}) and Candidate B ({nameB}) against the target role.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Candidate A Summary Tile */}
        <div style={{ background: 'var(--bg-card-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span className="candidate-pill candidate-a-pill">Candidate A</span>
            <span className={`rec-badge rec-${recA.toLowerCase().replace(/[\s\/]/g, '_')}`}>
              {recA} ({candidateAResult.synthesizer.confidence}%)
            </span>
          </div>
          <strong style={{ fontSize: '1.05rem', color: '#fff' }}>{nameA}</strong>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            {candidateAResult.candidateProfile.currentRole}
          </p>
        </div>

        {/* Candidate B Summary Tile */}
        <div style={{ background: 'var(--bg-card-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span className="candidate-pill candidate-b-pill">Candidate B</span>
            <span className={`rec-badge rec-${recB.toLowerCase().replace(/[\s\/]/g, '_')}`}>
              {recB} ({candidateBResult.synthesizer.confidence}%)
            </span>
          </div>
          <strong style={{ fontSize: '1.05rem', color: '#fff' }}>{nameB}</strong>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            {candidateBResult.candidateProfile.currentRole}
          </p>
        </div>
      </div>

      {comparison?.summary && (
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Comparative Decision Rationale</h4>
          <p style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.45 }}>{comparison.summary}</p>
        </div>
      )}

      {comparison?.keyDifferentiators && comparison.keyDifferentiators.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            Key Evidence Differentiators
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {comparison.keyDifferentiators.map((diff, idx) => (
              <li key={idx} style={{ fontSize: '0.84rem', color: '#cbd5e1', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>•</span>
                <span>{diff}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {comparison?.hiringRecommendation && (
        <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.88rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={18} />
          <span><strong>Recommendation:</strong> {comparison.hiringRecommendation}</span>
        </div>
      )}
    </div>
  );
};
