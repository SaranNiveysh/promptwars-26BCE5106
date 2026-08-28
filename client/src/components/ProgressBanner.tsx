import React from 'react';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

interface ProgressBannerProps {
  currentStage: number; // 0 = idle, 1 = extraction, 2 = evaluators, 3 = debate, 4 = synthesizer, 5 = complete
}

const STAGES = [
  { id: 1, label: '1. Extracting Candidate Profile & Grounded Evidence Bank', desc: 'Parsing atomic verbatim quotes and factual statements from resume & transcript' },
  { id: 2, label: '2. Running 4 Independent Evaluators in Parallel', desc: 'Technical, Culture/HR, Hiring Manager, and Skeptic evaluate in strict isolation' },
  { id: 3, label: '3. Multi-Agent Cross-Examination Debate', desc: 'Agents directly cross-examine named claims with stances and cited evidence' },
  { id: 4, label: '4. Executive Decision Synthesizer', desc: 'Synthesizing evidence-weighted recommendation and decisive proof points' },
];

export const ProgressBanner: React.FC<ProgressBannerProps> = ({ currentStage }) => {
  return (
    <div className="card progress-card">
      <div className="card-title-group" style={{ marginBottom: '0.75rem' }}>
        <Loader2 className="spinner" size={20} color="var(--primary)" />
        <h3 className="card-title" style={{ fontSize: '1.05rem' }}>
          Multi-Agent Pipeline Executing
        </h3>
      </div>

      <div className="progress-steps-list">
        {STAGES.map((s) => {
          const isCompleted = currentStage > s.id;
          const isActive = currentStage === s.id;

          return (
            <div
              key={s.id}
              className={`progress-step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
            >
              <div className="step-icon-badge">
                {isCompleted ? (
                  <CheckCircle2 size={16} />
                ) : isActive ? (
                  <Loader2 className="spinner" size={14} />
                ) : (
                  <Circle size={14} />
                )}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{s.label}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{s.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
