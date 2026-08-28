import React, { useState } from 'react';
import {
  Compass,
  CheckCircle,
  Zap,
  ShieldCheck,
  Code2,
  Terminal,
  Cpu,
  Layers,
  HeartHandshake,
  AlertOctagon,
  ChevronDown,
  ChevronUp,
  FileSearch,
} from 'lucide-react';
import { IdealCandidateBlueprint } from '../types';

interface BlueprintViewProps {
  blueprint: IdealCandidateBlueprint;
  onCitationClick?: (evidenceId: string) => void;
}

export const BlueprintView: React.FC<BlueprintViewProps> = ({
  blueprint,
  onCitationClick,
}) => {
  const [showEvidenceBank, setShowEvidenceBank] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = [
    'all',
    ...Array.from(new Set(blueprint.jobEvidenceBank.map((e) => e.category))),
  ];

  const filteredEvidence =
    filterCategory === 'all'
      ? blueprint.jobEvidenceBank
      : blueprint.jobEvidenceBank.filter((e) => e.category === filterCategory);

  const renderBadge = (id: string) => (
    <button
      key={id}
      type="button"
      className="evidence-badge"
      style={{ cursor: 'pointer', border: '1px solid rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}
      onClick={() => onCitationClick && onCitationClick(id)}
      title="Click to view exact quote from Job Description"
    >
      [{id}]
    </button>
  );

  return (
    <div className="card" style={{ border: '1px solid rgba(14, 165, 233, 0.4)', background: 'linear-gradient(180deg, #0d1527 0%, #0b0f19 100%)' }}>
      {/* Header */}
      <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div className="card-title-group">
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <Compass size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className="source-tag source-resume" style={{ fontSize: '0.72rem' }}>
                Stage 0
              </span>
              <h2 className="card-title" style={{ fontSize: '1.25rem' }}>
                Ideal Candidate Blueprint
              </h2>
            </div>
            <p className="card-subtitle">
              Generated exclusively from the uploaded Job Description for <strong>{blueprint.company}</strong> ({blueprint.roleTitle}).
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
          onClick={() => setShowEvidenceBank(!showEvidenceBank)}
        >
          <FileSearch size={14} />
          {showEvidenceBank ? 'Hide Job Evidence Bank' : `View Job Evidence Bank (${blueprint.jobEvidenceBank.length} quotes)`}
          {showEvidenceBank ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Role Mission Banner */}
      <div
        style={{
          background: 'rgba(14, 165, 233, 0.08)',
          border: '1px solid rgba(14, 165, 233, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '1.1rem 1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: 700, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
          <Zap size={16} />
          Role Mission: What Success Means in Production
          {blueprint.roleMission.evidenceIds.map(renderBadge)}
        </div>
        <p style={{ fontSize: '0.92rem', color: '#f1f5f9', lineHeight: 1.5 }}>
          {blueprint.roleMission.description}
        </p>
      </div>

      {/* 3 Key Columns: Day-One Critical, Strong Differentiators, Nice-to-Have */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {/* Day-One Critical */}
        <div style={{ background: 'var(--bg-card-subtle)', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.85rem' }}>
            <CheckCircle size={15} />
            Day-One Critical Capabilities
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {blueprint.dayOneCriticalCapabilities.map((cap, idx) => (
              <div key={idx} style={{ fontSize: '0.84rem' }}>
                <div style={{ fontWeight: 600, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span>• {cap.title}</span>
                  {cap.evidenceIds.map(renderBadge)}
                </div>
                <div style={{ color: 'var(--text-secondary)', marginTop: '0.2rem', paddingLeft: '0.75rem' }}>
                  {cap.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strong Differentiators */}
        <div style={{ background: 'var(--bg-card-subtle)', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a855f7', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.85rem' }}>
            <Zap size={15} />
            Strong Differentiators
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {blueprint.strongDifferentiators.map((diff, idx) => (
              <div key={idx} style={{ fontSize: '0.84rem' }}>
                <div style={{ fontWeight: 600, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span>• {diff.title}</span>
                  {diff.evidenceIds.map(renderBadge)}
                </div>
                <div style={{ color: 'var(--text-secondary)', marginTop: '0.2rem', paddingLeft: '0.75rem' }}>
                  {diff.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nice to Have & Production Ownership */}
        <div style={{ background: 'var(--bg-card-subtle)', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.85rem' }}>
            <ShieldCheck size={15} />
            Production Ownership &amp; Nice-to-Haves
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {blueprint.productionOwnershipExpectations.map((own, idx) => (
              <div key={`own-${idx}`} style={{ fontSize: '0.84rem' }}>
                <div style={{ fontWeight: 600, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span>★ {own.title}</span>
                  {own.evidenceIds.map(renderBadge)}
                </div>
                <div style={{ color: 'var(--text-secondary)', marginTop: '0.2rem', paddingLeft: '0.75rem' }}>
                  {own.description}
                </div>
              </div>
            ))}
            {blueprint.niceToHaveCapabilities.map((nth, idx) => (
              <div key={`nth-${idx}`} style={{ fontSize: '0.84rem' }}>
                <div style={{ fontWeight: 600, color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span>• {nth.title}</span>
                  {nth.evidenceIds.map(renderBadge)}
                </div>
                <div style={{ color: 'var(--text-secondary)', marginTop: '0.2rem', paddingLeft: '0.75rem' }}>
                  {nth.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Technical Skills Breakdown */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Code2 size={16} /> Key Technical Competency Domains
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
          <div className="key-question-box">
            <div style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.25rem' }}>
              <Terminal size={14} /> {blueprint.keyTechnicalSkills.pythonBackend.title}
              {blueprint.keyTechnicalSkills.pythonBackend.evidenceIds.map(renderBadge)}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
              {blueprint.keyTechnicalSkills.pythonBackend.description}
            </div>
          </div>

          <div className="key-question-box">
            <div style={{ fontWeight: 700, color: '#a855f7', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.25rem' }}>
              <Cpu size={14} /> {blueprint.keyTechnicalSkills.multiAgentSystems.title}
              {blueprint.keyTechnicalSkills.multiAgentSystems.evidenceIds.map(renderBadge)}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
              {blueprint.keyTechnicalSkills.multiAgentSystems.description}
            </div>
          </div>

          <div className="key-question-box">
            <div style={{ fontWeight: 700, color: '#34d399', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.25rem' }}>
              <Layers size={14} /> {blueprint.keyTechnicalSkills.plannerExecutorReviewer.title}
              {blueprint.keyTechnicalSkills.plannerExecutorReviewer.evidenceIds.map(renderBadge)}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
              {blueprint.keyTechnicalSkills.plannerExecutorReviewer.description}
            </div>
          </div>

          <div className="key-question-box">
            <div style={{ fontWeight: 700, color: '#fbbf24', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.25rem' }}>
              <Zap size={14} /> {blueprint.keyTechnicalSkills.promptingRagRoutingEval.title}
              {blueprint.keyTechnicalSkills.promptingRagRoutingEval.evidenceIds.map(renderBadge)}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
              {blueprint.keyTechnicalSkills.promptingRagRoutingEval.description}
            </div>
          </div>

          <div className="key-question-box">
            <div style={{ fontWeight: 700, color: '#0ea5e9', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.25rem' }}>
              <Code2 size={14} /> {blueprint.keyTechnicalSkills.reactMongoOcrIntegrations.title}
              {blueprint.keyTechnicalSkills.reactMongoOcrIntegrations.evidenceIds.map(renderBadge)}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
              {blueprint.keyTechnicalSkills.reactMongoOcrIntegrations.description}
            </div>
          </div>

          <div className="key-question-box">
            <div style={{ fontWeight: 700, color: '#f43f5e', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.25rem' }}>
              <ShieldCheck size={14} /> {blueprint.keyTechnicalSkills.reliabilityMonitoringOnCall.title}
              {blueprint.keyTechnicalSkills.reliabilityMonitoringOnCall.evidenceIds.map(renderBadge)}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
              {blueprint.keyTechnicalSkills.reliabilityMonitoringOnCall.description}
            </div>
          </div>
        </div>
      </div>

      {/* Ownership, Honesty, Learning & Interview Validation Risks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
          <div style={{ fontWeight: 700, color: '#34d399', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
            <HeartHandshake size={16} /> Ownership, Honesty &amp; Continuous Learning
          </div>
          {blueprint.ownershipHonestyLearning.map((item, idx) => (
            <div key={idx} style={{ fontSize: '0.82rem', marginBottom: '0.5rem' }}>
              <strong style={{ color: '#f1f5f9' }}>{item.title}</strong> {item.evidenceIds.map(renderBadge)}
              <div style={{ color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{item.description}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
          <div style={{ fontWeight: 700, color: '#fbbf24', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
            <AlertOctagon size={16} /> Interview Validation Risks (Not Auto-Disqualifiers)
          </div>
          {blueprint.interviewValidationRisks.map((risk, idx) => (
            <div key={idx} style={{ fontSize: '0.82rem', marginBottom: '0.5rem' }}>
              <strong style={{ color: '#f1f5f9' }}>{risk.title}</strong> {risk.evidenceIds.map(renderBadge)}
              <div style={{ color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{risk.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Collapsible Job Evidence Bank */}
      {showEvidenceBank && (
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8' }}>
              Job Description Evidence Bank ({filteredEvidence.length} items)
            </h4>

            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`tab-btn ${filterCategory === cat ? 'active' : ''}`}
                  style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem' }}
                  onClick={() => setFilterCategory(cat)}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="evidence-grid">
            {filteredEvidence.map((item) => (
              <div key={item.id} className="evidence-card" style={{ borderLeft: '3px solid #0ea5e9' }}>
                <div className="evidence-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span className="evidence-badge" style={{ color: '#38bdf8' }}>
                      {item.id}
                    </span>
                    <span className="source-tag source-resume">Job Description</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {item.category}
                  </span>
                </div>
                <div className="evidence-quote">"{item.exactQuote}"</div>
                <div className="evidence-fact">
                  <strong>Fact:</strong> {item.extractedFact}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
