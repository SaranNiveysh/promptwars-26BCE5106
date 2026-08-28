import React from 'react';
import { ShieldCheck, Sparkles, Cpu, RotateCcw, FolderOpen } from 'lucide-react';
import { ServerHealth } from '../types';

interface HeaderProps {
  health: ServerHealth | null;
  mode: 'live' | 'mock';
  onLoadDemo: () => void;
  onResetAll?: () => void;
  isEvaluating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  health,
  mode,
  onLoadDemo,
  onResetAll,
  isEvaluating,
}) => {
  const isLive = health?.geminiConfigured || mode === 'live';

  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="brand-icon-wrapper">
          <ShieldCheck size={26} />
        </div>
        <div>
          <h1 className="brand-title">EvidenceHire</h1>
          <p className="brand-tagline">
            Multi-Agent Candidate Evaluation Committee &bull; Grounded Citations &bull; Stage 0 Blueprint &bull; Stage 5 Comparison
          </p>
        </div>
      </div>

      <div className="header-status-group">
        <div className={`status-badge ${isLive ? 'status-live' : 'status-mock'}`}>
          <span className="status-dot"></span>
          {isLive ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={13} />
              Gemini Live API ({health?.model || 'Configured'})
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Cpu size={13} />
              Grounded Multi-Agent Mock Engine
            </span>
          )}
        </div>

        {onResetAll && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onResetAll}
            disabled={isEvaluating}
            style={{ fontSize: '0.82rem', padding: '0.5rem 0.85rem' }}
            title="Reset all inputs and evaluation results"
          >
            <RotateCcw size={14} />
            Reset All
          </button>
        )}

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onLoadDemo}
          disabled={isEvaluating}
          style={{ fontSize: '0.82rem', padding: '0.5rem 0.95rem' }}
          title="Load official demo candidates (Rohan Malhotra & Ananya Iyer for Cargonet AI)"
        >
          <FolderOpen size={14} />
          Load Official Demo Candidates
        </button>
      </div>
    </header>
  );
};
