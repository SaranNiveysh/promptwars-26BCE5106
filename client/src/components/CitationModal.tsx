import React from 'react';
import { X, Quote, FileText } from 'lucide-react';

export interface CitationModalData {
  citationId: string;
  source: string;
  exactQuote: string;
  extractedFact: string;
  category?: string;
}

interface CitationModalProps {
  data: CitationModalData | null;
  onClose: () => void;
}

export const CitationModal: React.FC<CitationModalProps> = ({ data, onClose }) => {
  if (!data) return null;

  const isJob = data.citationId.startsWith('J-');
  const isRohan = data.citationId.startsWith('R-');
  const isAnanya = data.citationId.startsWith('A-');

  let pillClass = 'candidate-a-pill';
  let pillText = 'Candidate A';
  if (isJob) {
    pillClass = 'source-resume';
    pillText = 'Job Description';
  } else if (isRohan) {
    pillClass = 'candidate-a-pill';
    pillText = 'Rohan Malhotra';
  } else if (isAnanya) {
    pillClass = 'candidate-b-pill';
    pillText = 'Ananya Iyer';
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 8, 16, 0.82)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          maxWidth: '620px',
          width: '100%',
          background: '#111827',
          border: '1px solid var(--border-accent)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(99, 102, 241, 0.2)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-header" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="evidence-badge" style={{ fontSize: '0.88rem', padding: '0.3rem 0.65rem' }}>
              {data.citationId}
            </span>
            <span className={`candidate-pill ${pillClass}`}>{pillText}</span>
            <span className="source-tag" style={{ fontSize: '0.75rem' }}>
              {data.source}
            </span>
          </div>

          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.35rem 0.55rem', borderRadius: '50%' }}
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {data.category && (
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
            Category: <span style={{ color: '#cbd5e1' }}>{data.category}</span>
          </div>
        )}

        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            <Quote size={14} />
            Exact Grounded Quote
          </div>
          <blockquote className="evidence-quote" style={{ fontSize: '0.92rem', lineHeight: 1.5, background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)' }}>
            "{data.exactQuote}"
          </blockquote>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            <FileText size={14} />
            Extracted Atomic Fact
          </div>
          <p style={{ fontSize: '0.88rem', color: '#e2e8f0', background: 'var(--bg-card-subtle)', padding: '0.75rem 0.9rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            {data.extractedFact}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
          <button className="btn btn-secondary" onClick={onClose} style={{ fontSize: '0.85rem' }}>
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
