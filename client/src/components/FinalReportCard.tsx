import React from 'react';
import { Award, CheckCircle2, AlertCircle, HelpCircle, Scale, Download, Printer } from 'lucide-react';
import { SynthesizerResult, FinalRecommendation } from '../types';

interface FinalReportCardProps {
  synthesizer: SynthesizerResult;
  candidateName?: string;
  onCitationClick?: (citationId: string) => void;
}

const FINAL_REC_COLORS: Record<FinalRecommendation, { bg: string; text: string; border: string }> = {
  'Strong Yes': { bg: 'rgba(16, 185, 129, 0.2)', text: '#34d399', border: '#10b981' },
  'Yes': { bg: 'rgba(56, 189, 248, 0.2)', text: '#38bdf8', border: '#0ea5e9' },
  'Hold / Further Interview': { bg: 'rgba(245, 158, 11, 0.2)', text: '#fbbf24', border: '#f59e0b' },
  'No': { bg: 'rgba(239, 68, 68, 0.2)', text: '#f87171', border: '#ef4444' },
};

export const FinalReportCard: React.FC<FinalReportCardProps> = ({
  synthesizer,
  candidateName = 'Candidate',
  onCitationClick,
}) => {
  const recStyle = FINAL_REC_COLORS[synthesizer.finalRecommendation] || FINAL_REC_COLORS['Yes'];

  const handleExportMarkdown = () => {
    let md = `# Executive Hiring Committee Dossier: ${candidateName}\n\n`;
    md += `**Final Recommendation:** ${synthesizer.finalRecommendation} (${synthesizer.confidence}% Confidence)\n\n`;
    md += `## Executive Summary & Rationale\n${synthesizer.executiveSummary}\n\n`;

    if (synthesizer.decisiveEvidence && synthesizer.decisiveEvidence.length > 0) {
      md += `## Decisive Evidence Points\n`;
      synthesizer.decisiveEvidence.forEach((d) => {
        md += `- **[${d.evidenceId}]** ${d.fact} — *Impact:* ${d.impactOnDecision}\n`;
      });
      md += `\n`;
    }

    if (synthesizer.strengths && synthesizer.strengths.length > 0) {
      md += `## Synthesized Strengths\n`;
      synthesizer.strengths.forEach((s) => {
        md += `- ${s.claim} (Citations: ${s.evidenceIds.map((id) => `[${id}]`).join(', ')})\n`;
      });
      md += `\n`;
    }

    if (synthesizer.concerns && synthesizer.concerns.length > 0) {
      md += `## Synthesized Risks & Nuances\n`;
      synthesizer.concerns.forEach((c) => {
        md += `- ${c.claim} (Citations: ${c.evidenceIds.map((id) => `[${id}]`).join(', ')})\n`;
      });
      md += `\n`;
    }

    if (synthesizer.recommendedFollowUpQuestions && synthesizer.recommendedFollowUpQuestions.length > 0) {
      md += `## Recommended Follow-Up Interview Blueprint\n`;
      synthesizer.recommendedFollowUpQuestions.forEach((q, idx) => {
        md += `${idx + 1}. "${q}"\n`;
      });
    }

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${candidateName.replace(/\s+/g, '_')}_Evaluation_Report.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

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
    <div className="synthesis-card">
      <div className="synthesis-hero">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Award size={22} color="var(--primary)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)' }}>
              Stage 4: Executive Hiring Committee Synthesis
            </span>
          </div>
          <div className="final-rec-title" style={{ color: recStyle.text }}>
            {synthesizer.finalRecommendation}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
              onClick={handleExportMarkdown}
              title="Export report as Markdown"
            >
              <Download size={13} /> Export MD
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
              onClick={handlePrint}
              title="Print / Save as PDF"
            >
              <Printer size={13} /> Print
            </button>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Synthesis Confidence: <strong style={{ color: '#fff' }}>{synthesizer.confidence}%</strong>
          </div>
          <div style={{ width: 140, height: 8, background: 'var(--bg-card-subtle)', borderRadius: 9999, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
            <div style={{ width: `${synthesizer.confidence}%`, height: '100%', background: recStyle.text }}></div>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Evidence-weighted (Non-averaged)</span>
        </div>
      </div>

      {/* Executive Summary */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 className="section-subtitle" style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Executive Synthesis &amp; Rationale
        </h3>
        <p style={{ fontSize: '0.92rem', color: '#e2e8f0', lineHeight: 1.5, background: 'var(--bg-card-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          {synthesizer.executiveSummary}
        </p>
      </div>

      {/* Decisive Evidence */}
      {synthesizer.decisiveEvidence && synthesizer.decisiveEvidence.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 className="section-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
            <Scale size={16} color="var(--primary)" /> Decisive Evidence Points
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="decisive-evidence-table">
              <thead>
                <tr>
                  <th style={{ width: '95px' }}>Citation</th>
                  <th>Verified Fact</th>
                  <th>Impact On Final Decision</th>
                </tr>
              </thead>
              <tbody>
                {synthesizer.decisiveEvidence.map((d, idx) => (
                  <tr key={idx}>
                    <td>
                      {renderBadge(d.evidenceId)}
                    </td>
                    <td>{d.fact}</td>
                    <td style={{ color: '#cbd5e1' }}>{d.impactOnDecision}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid: Strengths & Concerns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div>
          <h3 className="section-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--success)' }}>
            <CheckCircle2 size={14} /> Synthesized Strengths
          </h3>
          <ul className="claims-list strengths" style={{ marginTop: '0.4rem' }}>
            {synthesizer.strengths.map((s, idx) => (
              <li key={idx}>
                {s.claim}
                {s.evidenceIds && s.evidenceIds.length > 0 && (
                  <span style={{ marginLeft: '0.3rem' }}>
                    {s.evidenceIds.map(renderBadge)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="section-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--warning)' }}>
            <AlertCircle size={14} /> Synthesized Risks &amp; Nuances
          </h3>
          <ul className="claims-list concerns" style={{ marginTop: '0.4rem' }}>
            {synthesizer.concerns.map((c, idx) => (
              <li key={idx}>
                {c.claim}
                {c.evidenceIds && c.evidenceIds.length > 0 && (
                  <span style={{ marginLeft: '0.3rem' }}>
                    {c.evidenceIds.map(renderBadge)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Unresolved Disagreements */}
      {synthesizer.unresolvedDisagreements && synthesizer.unresolvedDisagreements.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 className="section-subtitle" style={{ color: 'var(--warning)' }}>
            Unresolved Disagreements After Debate
          </h3>
          {synthesizer.unresolvedDisagreements.map((u, idx) => (
            <div key={idx} className="unresolved-item">
              <div className="unresolved-title">{u.topic}</div>
              <p style={{ color: '#cbd5e1', marginBottom: '0.4rem' }}>{u.conflictSummary}</p>
              {u.citedEvidenceIds && u.citedEvidenceIds.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Related Citations:</span>
                  {u.citedEvidenceIds.map(renderBadge)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Follow-up Questions */}
      {synthesizer.recommendedFollowUpQuestions && synthesizer.recommendedFollowUpQuestions.length > 0 && (
        <div>
          <h3 className="section-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-primary)' }}>
            <HelpCircle size={15} color="var(--primary)" /> Recommended Follow-Up Interview Blueprint
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.4rem' }}>
            {synthesizer.recommendedFollowUpQuestions.map((q, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-card-subtle)',
                  border: '1px solid var(--border-accent)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.86rem',
                  color: '#e2e8f0',
                }}
              >
                <strong style={{ color: 'var(--primary)', marginRight: '0.3rem' }}>Q{idx + 1}:</strong>
                "{q}"
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
