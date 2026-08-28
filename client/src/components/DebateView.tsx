import React, { useState, useEffect } from 'react';
import { MessageSquareQuote, ArrowRight, CornerDownRight, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { DebateExchange, DebateStance } from '../types';

interface DebateViewProps {
  debate: DebateExchange[];
  onCitationClick?: (citationId: string) => void;
}

const STANCE_LABELS: Record<DebateStance, string> = {
  agree: 'Agrees With',
  disagree: 'Disagrees With',
  qualify: 'Qualifies Claim Of',
};

export const DebateView: React.FC<DebateViewProps> = ({ debate, onCitationClick }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!debate || debate.length === 0) {
    return null;
  }

  const handlePlayDebate = () => {
    if (!('speechSynthesis' in window)) {
      alert('SpeechSynthesis is not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    setIsPlayingAudio(true);

    const fullScript = debate
      .map(
        (entry) =>
          `${entry.respondingAgent} addresses ${entry.targetAgent}. ${entry.explanation}.`
      )
      .join(' ... Next point ... ');

    const utterance = new SpeechSynthesisUtterance(fullScript);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const renderBadge = (id: string) => (
    <button
      key={id}
      type="button"
      className="evidence-badge"
      style={{ cursor: 'pointer' }}
      onClick={() => onCitationClick && onCitationClick(id)}
      title="Click to view exact quote"
    >
      [{id}]
    </button>
  );

  return (
    <div className="debate-room">
      <div className="card-header" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div className="card-title-group">
          <MessageSquareQuote size={22} color="var(--primary)" />
          <div>
            <h2 className="card-title">Stage 3: Multi-Agent Cross-Examination Debate &amp; Visible Opinion Shifts</h2>
            <p className="card-subtitle">
              Agents directly challenge claims and qualify positions upon reviewing cited evidence. Notice the explicit <strong>"Initial View &rarr; Updated View"</strong> evolution.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          onClick={handlePlayDebate}
          title="Listen to debate cross-examination using browser audio"
        >
          {isPlayingAudio ? (
            <>
              <VolumeX size={14} color="#f87171" /> Stop Debate Audio
            </>
          ) : (
            <>
              <Volume2 size={14} color="var(--primary)" /> Play Debate Audio (TTS)
            </>
          )}
        </button>
      </div>

      <div className="debate-timeline">
        {debate.map((entry, idx) => {
          const stanceLabel = STANCE_LABELS[entry.stance] || entry.stance;
          const citedIds = entry.evidenceIds || [];

          return (
            <div
              key={entry.id || idx}
              className={`debate-entry ${entry.changedAfterDebate ? 'debate-entry-shifted' : ''}`}
            >
              <div className="debate-entry-header">
                <div className="speaker-title">
                  <span>{entry.respondingAgent}</span>
                  <ArrowRight size={14} color="var(--text-muted)" />
                  <span style={{ color: 'var(--text-secondary)' }}>{entry.targetAgent}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {entry.changedAfterDebate && (
                    <span className="opinion-shift-badge">
                      <RefreshCw size={11} className="spinner-subtle" /> Opinion Revised After Counter-Evidence
                    </span>
                  )}
                  <div className={`stance-pill stance-${entry.stance}`}>
                    {stanceLabel}
                  </div>
                </div>
              </div>

              {entry.targetClaim && (
                <div className="target-claim-quote">
                  <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <CornerDownRight size={12} /> Claim Addressed:
                  </span>
                  <span>"{entry.targetClaim}"</span>
                </div>
              )}

              {/* Explicit Initial vs Updated Position View */}
              {(entry.initialPosition || entry.updatedPosition) && (
                <div className="opinion-shift-container">
                  <div className="position-box initial-box">
                    <span className="position-tag tag-initial">Initial View (Pre-Debate)</span>
                    <p className="position-text">{entry.initialPosition || 'Maintained initial assessment.'}</p>
                  </div>

                  <div className="position-arrow">
                    <ArrowRight size={16} />
                  </div>

                  <div className={`position-box updated-box ${entry.changedAfterDebate ? 'shifted-highlight' : ''}`}>
                    <span className={`position-tag ${entry.changedAfterDebate ? 'tag-revised' : 'tag-updated'}`}>
                      {entry.changedAfterDebate ? '✓ Updated / Revised Position' : 'Updated Position (Reaffirmed)'}
                    </span>
                    <p className="position-text">{entry.updatedPosition || entry.initialPosition}</p>
                  </div>
                </div>
              )}

              <p className="debate-argument" style={{ marginTop: '0.6rem' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Debate Argument &amp; Rationale:</strong> {entry.explanation}
              </p>

              {citedIds.length > 0 && (
                <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Grounded Citations:</span>
                  {citedIds.map(renderBadge)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
