import React, { useState } from 'react';
import { Database, ChevronDown, ChevronUp, UserCheck, Tag, Search } from 'lucide-react';
import { CandidateProfile, EvidenceItem } from '../types';

interface EvidenceBankViewProps {
  profile: CandidateProfile;
  evidenceBank: EvidenceItem[];
  onCitationClick?: (citationId: string) => void;
}

export const EvidenceBankView: React.FC<EvidenceBankViewProps> = ({
  profile,
  evidenceBank,
  onCitationClick,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'Resume' | 'Transcript'>('all');

  const filteredEvidence = evidenceBank.filter((item) => {
    const matchesSource = sourceFilter === 'all' || item.source === sourceFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.exactQuote.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.extractedFact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSource && matchesSearch;
  });

  return (
    <div className="card">
      <div className="card-header" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
        <div className="card-title-group">
          <Database size={20} color="var(--primary)" />
          <div>
            <h2 className="card-title">Stage 1: Grounded Evidence Bank &amp; Profile</h2>
            <p className="card-subtitle">
              {evidenceBank.length} verified evidence items extracted with verbatim quotes and facts.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setIsOpen(!isOpen)}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
          >
            {isOpen ? (
              <>
                <ChevronUp size={16} /> Hide Bank
              </>
            ) : (
              <>
                <ChevronDown size={16} /> Show Bank ({evidenceBank.length})
              </>
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <>
          {/* Candidate Profile Summary */}
          <div
            style={{
              background: 'var(--bg-card-subtle)',
              border: '1px solid var(--border-accent)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <UserCheck size={18} color="var(--success)" />
              <strong style={{ fontSize: '1rem', color: '#fff' }}>{profile.name}</strong>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>&bull; {profile.currentRole}</span>
            </div>
            <p style={{ fontSize: '0.86rem', color: '#cbd5e1', marginBottom: '0.6rem' }}>
              {profile.summary}
            </p>
            {profile.skills && profile.skills.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {profile.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: 'rgba(99, 102, 241, 0.15)',
                      color: '#a5b4fc',
                      fontSize: '0.74rem',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '9999px',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Search & Filter Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search evidence by quote, fact, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-card-subtle)',
                  border: '1px solid var(--border-accent)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.4rem 0.75rem 0.4rem 2rem',
                  color: '#fff',
                  fontSize: '0.82rem',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                type="button"
                className={`tab-btn ${sourceFilter === 'all' ? 'active' : ''}`}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                onClick={() => setSourceFilter('all')}
              >
                All Sources
              </button>
              <button
                type="button"
                className={`tab-btn ${sourceFilter === 'Resume' ? 'active' : ''}`}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                onClick={() => setSourceFilter('Resume')}
              >
                Resume
              </button>
              <button
                type="button"
                className={`tab-btn ${sourceFilter === 'Transcript' ? 'active' : ''}`}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                onClick={() => setSourceFilter('Transcript')}
              >
                Transcript
              </button>
            </div>
          </div>

          {/* Evidence Grid */}
          <div className="evidence-grid">
            {filteredEvidence.map((item) => {
              const isResume = item.source === 'Resume';
              return (
                <div key={item.id} id={`evidence-${item.id}`} className="evidence-card">
                  <div className="evidence-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        type="button"
                        className="evidence-badge"
                        style={{ cursor: 'pointer' }}
                        onClick={() => onCitationClick && onCitationClick(item.id)}
                        title="Click to view quotation"
                      >
                        [{item.id}]
                      </button>
                      <span className={`source-tag ${isResume ? 'source-resume' : 'source-transcript'}`}>
                        {item.source}
                      </span>
                    </div>
                    {item.category && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Tag size={11} /> {item.category}
                      </span>
                    )}
                  </div>

                  <blockquote className="evidence-quote">
                    "{item.exactQuote}"
                  </blockquote>

                  <div className="evidence-fact">
                    <strong style={{ color: 'var(--text-primary)' }}>Extracted Fact:</strong> {item.extractedFact}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
