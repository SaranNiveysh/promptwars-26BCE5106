import React, { useState } from 'react';
import { Play, RotateCcw, FileText, Users } from 'lucide-react';
import { CandidateDossier } from '../types';

interface InputFormProps {
  jobTitle: string;
  jobRequirements: string;
  candidateA: CandidateDossier;
  candidateB: CandidateDossier;
  forceMock: boolean;
  onJobChange: (updated: { jobTitle?: string; jobRequirements?: string }) => void;
  onCandidateAChange: (updated: Partial<CandidateDossier>) => void;
  onCandidateBChange: (updated: Partial<CandidateDossier>) => void;
  onForceMockChange: (val: boolean) => void;
  onEvaluateBoth: () => void;
  onEvaluateCandidateA: () => void;
  onEvaluateCandidateB: () => void;
  onReset: () => void;
  isEvaluating: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({
  jobTitle,
  jobRequirements,
  candidateA,
  candidateB,
  forceMock,
  onJobChange,
  onCandidateAChange,
  onCandidateBChange,
  onForceMockChange,
  onEvaluateBoth,
  onEvaluateCandidateA,
  onEvaluateCandidateB,
  onReset,
  isEvaluating,
}) => {
  const [activeTab, setActiveTab] = useState<'both' | 'candidate_a' | 'candidate_b'>('both');

  const isJobValid = jobTitle.trim().length > 0 && jobRequirements.trim().length > 0;
  const isAValid = candidateA.resumeText.trim().length > 0 && candidateA.transcriptText.trim().length > 0;
  const isBValid = candidateB.resumeText.trim().length > 0 && candidateB.transcriptText.trim().length > 0;
  const canEvaluateBoth = isJobValid && isAValid && isBValid;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title-group">
          <FileText size={20} color="var(--primary)" />
          <div>
            <h2 className="card-title">Recruitment Dossier & Candidate Bench</h2>
            <p className="card-subtitle">
              Configure the target role requirements and candidate dossiers (Candidate A & Candidate B) for parallel multi-agent evaluation.
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="candidate-tab-group">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'both' ? 'active' : ''}`}
            onClick={() => setActiveTab('both')}
          >
            <Users size={14} /> Both Candidates (A & B)
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'candidate_a' ? 'active' : ''}`}
            onClick={() => setActiveTab('candidate_a')}
          >
            Candidate A ({candidateA.candidateName || 'A'})
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'candidate_b' ? 'active' : ''}`}
            onClick={() => setActiveTab('candidate_b')}
          >
            Candidate B ({candidateB.candidateName || 'B'})
          </button>
        </div>
      </div>

      {/* Shared Job Description */}
      <div style={{ background: 'var(--bg-card-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-accent)' }}>
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label">
            <span>Target Job Title</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Shared Role</span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Staff Distributed Systems Engineer"
            value={jobTitle}
            onChange={(e) => onJobChange({ jobTitle: e.target.value })}
            disabled={isEvaluating}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <span>Role Requirements & Critical Competencies</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {jobRequirements.length} chars
            </span>
          </label>
          <textarea
            className="form-textarea"
            placeholder="Paste role requirements, mandatory competencies, tech stack, and experience criteria..."
            value={jobRequirements}
            onChange={(e) => onJobChange({ jobRequirements: e.target.value })}
            disabled={isEvaluating}
            rows={4}
          />
        </div>
      </div>

      {/* Candidate Dossiers */}
      <div className="candidate-dossiers-container">
        {/* Candidate A Section */}
        {(activeTab === 'both' || activeTab === 'candidate_a') && (
          <div className="candidate-dossier-card" style={{ flex: 1 }}>
            <div className="dossier-badge-header">
              <span className="candidate-pill candidate-a-pill">Candidate A</span>
              <input
                type="text"
                className="form-input candidate-name-input"
                value={candidateA.candidateName}
                onChange={(e) => onCandidateAChange({ candidateName: e.target.value })}
                placeholder="Candidate A Name"
                disabled={isEvaluating}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">
                <span>Resume Text</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {candidateA.resumeText.length} chars
                </span>
              </label>
              <textarea
                className="form-textarea"
                placeholder="Paste Candidate A resume text..."
                value={candidateA.resumeText}
                onChange={(e) => onCandidateAChange({ resumeText: e.target.value })}
                disabled={isEvaluating}
                rows={6}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Interview Transcript Text</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {candidateA.transcriptText.length} chars
                </span>
              </label>
              <textarea
                className="form-textarea"
                placeholder="Paste Candidate A interview transcript..."
                value={candidateA.transcriptText}
                onChange={(e) => onCandidateAChange({ transcriptText: e.target.value })}
                disabled={isEvaluating}
                rows={6}
              />
            </div>
          </div>
        )}

        {/* Candidate B Section */}
        {(activeTab === 'both' || activeTab === 'candidate_b') && (
          <div className="candidate-dossier-card" style={{ flex: 1 }}>
            <div className="dossier-badge-header">
              <span className="candidate-pill candidate-b-pill">Candidate B</span>
              <input
                type="text"
                className="form-input candidate-name-input"
                value={candidateB.candidateName}
                onChange={(e) => onCandidateBChange({ candidateName: e.target.value })}
                placeholder="Candidate B Name"
                disabled={isEvaluating}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">
                <span>Resume Text</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {candidateB.resumeText.length} chars
                </span>
              </label>
              <textarea
                className="form-textarea"
                placeholder="Paste Candidate B resume text..."
                value={candidateB.resumeText}
                onChange={(e) => onCandidateBChange({ resumeText: e.target.value })}
                disabled={isEvaluating}
                rows={6}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Interview Transcript Text</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {candidateB.transcriptText.length} chars
                </span>
              </label>
              <textarea
                className="form-textarea"
                placeholder="Paste Candidate B interview transcript..."
                value={candidateB.transcriptText}
                onChange={(e) => onCandidateBChange({ transcriptText: e.target.value })}
                disabled={isEvaluating}
                rows={6}
              />
            </div>
          </div>
        )}
      </div>

      {/* Form Action Controls */}
      <div className="form-actions" style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onReset}
            disabled={isEvaluating}
            style={{ fontSize: '0.85rem' }}
          >
            <RotateCcw size={15} />
            Clear
          </button>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={forceMock}
              onChange={(e) => onForceMockChange(e.target.checked)}
              disabled={isEvaluating}
            />
            <span>Force Mock Mode</span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onEvaluateCandidateA}
            disabled={!isJobValid || !isAValid || isEvaluating}
          >
            Evaluate A Only ({candidateA.candidateName})
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onEvaluateCandidateB}
            disabled={!isJobValid || !isBValid || isEvaluating}
          >
            Evaluate B Only ({candidateB.candidateName})
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onEvaluateBoth}
            disabled={!canEvaluateBoth || isEvaluating}
          >
            {isEvaluating ? (
              <>
                <span className="spinner">⚙</span>
                Evaluating Candidates...
              </>
            ) : (
              <>
                <Play size={16} />
                Evaluate Both Candidates (A & B)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
