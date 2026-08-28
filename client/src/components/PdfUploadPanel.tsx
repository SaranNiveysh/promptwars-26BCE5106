import React, { useRef, useState } from 'react';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
  Eye,
  ChevronDown,
  ChevronUp,
  Edit3,
  Sparkles,
  Layers,
  FileCode,
  Check,
} from 'lucide-react';
import { extractTextFromPdf } from '../services/pdfExtractor';
import { extractCandidateNameFromText } from '../services/nameExtractor';

type UploadTab = 'job' | 'candidate_a' | 'candidate_b';
type SlotStatus = 'empty' | 'loading' | 'success' | 'error';

interface SlotState {
  id: string;
  label: string;
  description: string;
  status: SlotStatus;
  fileName: string;
  extractedText: string;
  error: string;
  charCount: number;
}

interface PdfUploadPanelProps {
  onAllExtracted?: (data: {
    jobDescription: string;
    resumeA: string;
    transcriptA: string;
    resumeB: string;
    transcriptB: string;
    candidateAName?: string;
    candidateBName?: string;
  }) => void;
  isEvaluating: boolean;
  hasEvaluated?: boolean;
  jobRequirements: string;
  setJobRequirements: (val: string) => void;
  resumeA: string;
  setResumeA: (val: string) => void;
  transcriptA: string;
  setTranscriptA: (val: string) => void;
  resumeB: string;
  setResumeB: (val: string) => void;
  transcriptB: string;
  setTranscriptB: (val: string) => void;
  onEvaluateBoth: () => void;
}

export const PdfUploadPanel: React.FC<PdfUploadPanelProps> = ({
  onAllExtracted,
  isEvaluating,
  hasEvaluated = false,
  jobRequirements,
  setJobRequirements,
  resumeA,
  setResumeA,
  transcriptA,
  setTranscriptA,
  resumeB,
  setResumeB,
  transcriptB,
  setTranscriptB,
  onEvaluateBoth,
}) => {
  const [activeTab, setActiveTab] = useState<UploadTab>('job');
  const [isMaterialsCollapsed, setIsMaterialsCollapsed] = useState<boolean>(hasEvaluated);
  const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);
  const [isManualEditOpen, setIsManualEditOpen] = useState<boolean>(false);
  const [previewSlotId, setPreviewSlotId] = useState<string | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);

  const [slots, setSlots] = useState<Record<string, SlotState>>({
    job_description: {
      id: 'job_description',
      label: 'Job Description PDF',
      description: 'Shared requirements & mission document',
      status: jobRequirements.trim().length > 0 ? 'success' : 'empty',
      fileName: jobRequirements.trim().length > 0 ? '02_Job_Description.pdf' : '',
      extractedText: jobRequirements,
      error: '',
      charCount: jobRequirements.length,
    },
    resume_a: {
      id: 'resume_a',
      label: 'Candidate A Resume PDF',
      description: 'Background, claimed skills & employment history',
      status: resumeA.trim().length > 0 ? 'success' : 'empty',
      fileName: resumeA.trim().length > 0 ? '03_Resume_A.pdf' : '',
      extractedText: resumeA,
      error: '',
      charCount: resumeA.length,
    },
    transcript_a: {
      id: 'transcript_a',
      label: 'Candidate A Interview Transcript PDF',
      description: 'Verbatim technical interview Q&A responses',
      status: transcriptA.trim().length > 0 ? 'success' : 'empty',
      fileName: transcriptA.trim().length > 0 ? '05_Transcript_A.pdf' : '',
      extractedText: transcriptA,
      error: '',
      charCount: transcriptA.length,
    },
    resume_b: {
      id: 'resume_b',
      label: 'Candidate B Resume PDF',
      description: 'Background, claimed skills & employment history',
      status: resumeB.trim().length > 0 ? 'success' : 'empty',
      fileName: resumeB.trim().length > 0 ? '04_Resume_B.pdf' : '',
      extractedText: resumeB,
      error: '',
      charCount: resumeB.length,
    },
    transcript_b: {
      id: 'transcript_b',
      label: 'Candidate B Interview Transcript PDF',
      description: 'Verbatim technical interview Q&A responses',
      status: transcriptB.trim().length > 0 ? 'success' : 'empty',
      fileName: transcriptB.trim().length > 0 ? '06_Transcript_B.pdf' : '',
      extractedText: transcriptB,
      error: '',
      charCount: transcriptB.length,
    },
  });

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileSelect = async (slotId: string, file: File) => {
    setSlots((prev) => ({
      ...prev,
      [slotId]: {
        ...prev[slotId],
        status: 'loading',
        fileName: file.name,
        extractedText: '',
        error: '',
        charCount: 0,
      },
    }));

    try {
      const text = await extractTextFromPdf(file);
      setSlots((prev) => {
        const nextSlots = {
          ...prev,
          [slotId]: {
            ...prev[slotId],
            status: 'success' as SlotStatus,
            fileName: file.name,
            extractedText: text,
            error: '',
            charCount: text.length,
          },
        };

        // If onAllExtracted provided, notify with dynamically extracted names
        if (onAllExtracted) {
          const nameA = extractCandidateNameFromText(
            nextSlots.resume_a.extractedText,
            nextSlots.transcript_a.extractedText,
            'Candidate A'
          );
          const nameB = extractCandidateNameFromText(
            nextSlots.resume_b.extractedText,
            nextSlots.transcript_b.extractedText,
            'Candidate B'
          );
          onAllExtracted({
            jobDescription: nextSlots.job_description.extractedText,
            resumeA: nextSlots.resume_a.extractedText,
            transcriptA: nextSlots.transcript_a.extractedText,
            resumeB: nextSlots.resume_b.extractedText,
            transcriptB: nextSlots.transcript_b.extractedText,
            candidateAName: nameA,
            candidateBName: nameB,
          });
        }
        return nextSlots;
      });

      // Update corresponding external parent state
      if (slotId === 'job_description') setJobRequirements(text);
      if (slotId === 'resume_a') setResumeA(text);
      if (slotId === 'transcript_a') setTranscriptA(text);
      if (slotId === 'resume_b') setResumeB(text);
      if (slotId === 'transcript_b') setTranscriptB(text);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to extract text from PDF.';
      setSlots((prev) => ({
        ...prev,
        [slotId]: {
          ...prev[slotId],
          status: 'error',
          fileName: file.name,
          extractedText: '',
          error: msg,
          charCount: 0,
        },
      }));
    }
  };

  const clearSlot = (slotId: string) => {
    setSlots((prev) => ({
      ...prev,
      [slotId]: {
        ...prev[slotId],
        status: 'empty',
        fileName: '',
        extractedText: '',
        error: '',
        charCount: 0,
      },
    }));
    if (slotId === 'job_description') setJobRequirements('');
    if (slotId === 'resume_a') setResumeA('');
    if (slotId === 'transcript_a') setTranscriptA('');
    if (slotId === 'resume_b') setResumeB('');
    if (slotId === 'transcript_b') setTranscriptB('');

    const ref = fileInputRefs.current[slotId];
    if (ref) ref.value = '';
  };

  // Status counts per tab
  const isJobReady = slots.job_description.status === 'success' || jobRequirements.trim().length > 0;
  const countA = (slots.resume_a.status === 'success' || resumeA.trim().length > 0 ? 1 : 0) +
                 (slots.transcript_a.status === 'success' || transcriptA.trim().length > 0 ? 1 : 0);
  const countB = (slots.resume_b.status === 'success' || resumeB.trim().length > 0 ? 1 : 0) +
                 (slots.transcript_b.status === 'success' || transcriptB.trim().length > 0 ? 1 : 0);

  const totalReady = (isJobReady ? 1 : 0) + countA + countB;
  const allFiveReady = totalReady === 5;

  const handleTriggerEvaluate = () => {
    setIsMaterialsCollapsed(true);
    onEvaluateBoth();
  };

  return (
    <div className="pdf-upload-container" style={{ marginBottom: '1.75rem' }}>
      {/* ── Compact Summary Mode (when materials are collapsed after evaluation) ── */}
      {isMaterialsCollapsed ? (
        <div className="card compact-materials-summary">
          <div className="compact-summary-left">
            <div className="compact-badge-icon">
              <CheckCircle size={18} color="#34d399" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                  Source Materials Configured
                </span>
                <span className="upload-progress-badge" style={{ fontSize: '0.72rem' }}>
                  {totalReady}/5 Files Active
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Job Description &amp; Candidate A / Candidate B materials loaded for multi-agent evaluation.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem' }}
              onClick={() => setIsMaterialsCollapsed(false)}
            >
              <Edit3 size={14} /> Edit Materials
            </button>
          </div>
        </div>
      ) : (
        /* ── Full 3-Tab Upload Area ── */
        <div
          className="card pdf-upload-card"
          style={{
            border: '1px solid rgba(99, 102, 241, 0.35)',
            background: 'linear-gradient(180deg, #12192b 0%, #0d1322 100%)',
          }}
        >
          {/* Header */}
          <div className="card-header" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div className="card-title-group">
              <div className="brand-icon-wrapper" style={{ width: 38, height: 38 }}>
                <Upload size={18} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <h2 className="card-title" style={{ fontSize: '1.15rem' }}>
                    Upload Candidate Materials
                  </h2>
                  <span className="source-tag source-transcript" style={{ fontSize: '0.7rem' }}>
                    Browser-Local Extraction
                  </span>
                </div>
                <p className="card-subtitle">
                  Upload the 5 official challenge PDFs across the tabs below. Text is extracted securely in your browser.
                </p>
              </div>
            </div>

            {/* Overall Progress Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div className={`overall-progress-pill ${allFiveReady ? 'ready' : ''}`}>
                {allFiveReady ? <Check size={14} color="#34d399" /> : <Layers size={14} color="#a5b4fc" />}
                <span>{totalReady} of 5 files ready</span>
              </div>
              {hasEvaluated && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
                  onClick={() => setIsMaterialsCollapsed(true)}
                  title="Collapse to compact summary"
                >
                  Collapse
                </button>
              )}
            </div>
          </div>

          {/* ── 3-Tab Selector ── */}
          <div className="upload-tab-bar">
            <button
              type="button"
              className={`upload-tab-btn ${activeTab === 'job' ? 'active' : ''}`}
              onClick={() => setActiveTab('job')}
            >
              <FileText size={15} />
              <span>Job Description</span>
              <span className={`tab-progress-tag ${isJobReady ? 'ready' : ''}`}>
                {isJobReady ? '1/1 ready' : '0/1 ready'}
              </span>
            </button>

            <button
              type="button"
              className={`upload-tab-btn ${activeTab === 'candidate_a' ? 'active' : ''}`}
              onClick={() => setActiveTab('candidate_a')}
            >
              <span className="candidate-pill candidate-a-pill" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                A
              </span>
              <span>Candidate A</span>
              <span className={`tab-progress-tag ${countA === 2 ? 'ready' : ''}`}>
                {countA}/2 ready
              </span>
            </button>

            <button
              type="button"
              className={`upload-tab-btn ${activeTab === 'candidate_b' ? 'active' : ''}`}
              onClick={() => setActiveTab('candidate_b')}
            >
              <span className="candidate-pill candidate-b-pill" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                B
              </span>
              <span>Candidate B</span>
              <span className={`tab-progress-tag ${countB === 2 ? 'ready' : ''}`}>
                {countB}/2 ready
              </span>
            </button>
          </div>

          {/* ── Tab Contents: Only active tab's upload cards are displayed ── */}
          <div className="upload-tab-content" style={{ marginTop: '1.25rem' }}>
            {/* TAB 1: Job Description (1 card) */}
            {activeTab === 'job' && (
              <div className="pdf-tab-pane">
                <PdfSlotCard
                  slot={slots.job_description}
                  isEvaluating={isEvaluating}
                  isDragOver={dragOverSlot === 'job_description'}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverSlot('job_description');
                  }}
                  onDragLeave={() => setDragOverSlot(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOverSlot(null);
                    const f = e.dataTransfer.files?.[0];
                    if (f) handleFileSelect('job_description', f);
                  }}
                  onFileSelect={(f) => handleFileSelect('job_description', f)}
                  onClear={() => clearSlot('job_description')}
                  onPreview={() => setPreviewSlotId('job_description')}
                  inputRef={(el) => {
                    fileInputRefs.current['job_description'] = el;
                  }}
                />
              </div>
            )}

            {/* TAB 2: Candidate A (2 cards) */}
            {activeTab === 'candidate_a' && (
              <div className="pdf-tab-grid-two">
                <PdfSlotCard
                  slot={slots.resume_a}
                  isEvaluating={isEvaluating}
                  isDragOver={dragOverSlot === 'resume_a'}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverSlot('resume_a');
                  }}
                  onDragLeave={() => setDragOverSlot(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOverSlot(null);
                    const f = e.dataTransfer.files?.[0];
                    if (f) handleFileSelect('resume_a', f);
                  }}
                  onFileSelect={(f) => handleFileSelect('resume_a', f)}
                  onClear={() => clearSlot('resume_a')}
                  onPreview={() => setPreviewSlotId('resume_a')}
                  inputRef={(el) => {
                    fileInputRefs.current['resume_a'] = el;
                  }}
                />

                <PdfSlotCard
                  slot={slots.transcript_a}
                  isEvaluating={isEvaluating}
                  isDragOver={dragOverSlot === 'transcript_a'}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverSlot('transcript_a');
                  }}
                  onDragLeave={() => setDragOverSlot(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOverSlot(null);
                    const f = e.dataTransfer.files?.[0];
                    if (f) handleFileSelect('transcript_a', f);
                  }}
                  onFileSelect={(f) => handleFileSelect('transcript_a', f)}
                  onClear={() => clearSlot('transcript_a')}
                  onPreview={() => setPreviewSlotId('transcript_a')}
                  inputRef={(el) => {
                    fileInputRefs.current['transcript_a'] = el;
                  }}
                />
              </div>
            )}

            {/* TAB 3: Candidate B (2 cards) */}
            {activeTab === 'candidate_b' && (
              <div className="pdf-tab-grid-two">
                <PdfSlotCard
                  slot={slots.resume_b}
                  isEvaluating={isEvaluating}
                  isDragOver={dragOverSlot === 'resume_b'}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverSlot('resume_b');
                  }}
                  onDragLeave={() => setDragOverSlot(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOverSlot(null);
                    const f = e.dataTransfer.files?.[0];
                    if (f) handleFileSelect('resume_b', f);
                  }}
                  onFileSelect={(f) => handleFileSelect('resume_b', f)}
                  onClear={() => clearSlot('resume_b')}
                  onPreview={() => setPreviewSlotId('resume_b')}
                  inputRef={(el) => {
                    fileInputRefs.current['resume_b'] = el;
                  }}
                />

                <PdfSlotCard
                  slot={slots.transcript_b}
                  isEvaluating={isEvaluating}
                  isDragOver={dragOverSlot === 'transcript_b'}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverSlot('transcript_b');
                  }}
                  onDragLeave={() => setDragOverSlot(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOverSlot(null);
                    const f = e.dataTransfer.files?.[0];
                    if (f) handleFileSelect('transcript_b', f);
                  }}
                  onFileSelect={(f) => handleFileSelect('transcript_b', f)}
                  onClear={() => clearSlot('transcript_b')}
                  onPreview={() => setPreviewSlotId('transcript_b')}
                  inputRef={(el) => {
                    fileInputRefs.current['transcript_b'] = el;
                  }}
                />
              </div>
            )}
          </div>

          {/* ── Collapsible: Review Extracted Text ── */}
          <div className="collapsible-section" style={{ marginTop: '1.25rem' }}>
            <button
              type="button"
              className="collapsible-trigger"
              onClick={() => setIsReviewOpen(!isReviewOpen)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Eye size={15} color="var(--primary)" />
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Review Extracted Text</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  (Inspect extracted plain text across all 5 slots)
                </span>
              </div>
              {isReviewOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {isReviewOpen && (
              <div className="collapsible-body">
                <div className="review-slots-list">
                  {Object.values(slots).map((s) => (
                    <div key={s.id} className="review-slot-row">
                      <div className="review-slot-info">
                        <strong>{s.label}</strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {s.fileName ? `${s.fileName} (${s.charCount.toLocaleString()} chars)` : 'No file extracted yet'}
                        </span>
                      </div>
                      {s.extractedText ? (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ fontSize: '0.74rem', padding: '0.25rem 0.55rem' }}
                          onClick={() => setPreviewSlotId(s.id)}
                        >
                          <Eye size={12} /> View Text
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Pending</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Collapsible: Edit Source Text Manually ── */}
          <div className="collapsible-section" style={{ marginTop: '0.75rem' }}>
            <button
              type="button"
              className="collapsible-trigger"
              onClick={() => setIsManualEditOpen(!isManualEditOpen)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileCode size={15} color="var(--accent-tech)" />
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Edit Source Text Manually</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  (Fallback textarea inputs for raw text customization)
                </span>
              </div>
              {isManualEditOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {isManualEditOpen && (
              <div className="collapsible-body" style={{ marginTop: '0.75rem' }}>
                {/* Job Description Textarea */}
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">
                    <span>Job Description Text</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {jobRequirements.length.toLocaleString()} chars
                    </span>
                  </label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    value={jobRequirements}
                    onChange={(e) => setJobRequirements(e.target.value)}
                    placeholder="Paste or edit job requirements text..."
                    disabled={isEvaluating}
                  />
                </div>

                {/* Candidate A & B Textareas */}
                <div className="form-grid" style={{ marginBottom: 0 }}>
                  {/* Candidate A */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div className="form-group">
                      <label className="form-label">
                        <span className="candidate-pill candidate-a-pill" style={{ fontSize: '0.68rem' }}>A</span>
                        <span>Candidate A Resume</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {resumeA.length.toLocaleString()} chars
                        </span>
                      </label>
                      <textarea
                        className="form-textarea"
                        rows={4}
                        value={resumeA}
                        onChange={(e) => setResumeA(e.target.value)}
                        placeholder="Candidate A resume text..."
                        disabled={isEvaluating}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        <span>Candidate A Interview Transcript</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {transcriptA.length.toLocaleString()} chars
                        </span>
                      </label>
                      <textarea
                        className="form-textarea"
                        rows={4}
                        value={transcriptA}
                        onChange={(e) => setTranscriptA(e.target.value)}
                        placeholder="Candidate A interview transcript text..."
                        disabled={isEvaluating}
                      />
                    </div>
                  </div>

                  {/* Candidate B */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div className="form-group">
                      <label className="form-label">
                        <span className="candidate-pill candidate-b-pill" style={{ fontSize: '0.68rem' }}>B</span>
                        <span>Candidate B Resume</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {resumeB.length.toLocaleString()} chars
                        </span>
                      </label>
                      <textarea
                        className="form-textarea"
                        rows={4}
                        value={resumeB}
                        onChange={(e) => setResumeB(e.target.value)}
                        placeholder="Candidate B resume text..."
                        disabled={isEvaluating}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        <span>Candidate B Interview Transcript</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {transcriptB.length.toLocaleString()} chars
                        </span>
                      </label>
                      <textarea
                        className="form-textarea"
                        rows={4}
                        value={transcriptB}
                        onChange={(e) => setTranscriptB(e.target.value)}
                        placeholder="Candidate B interview transcript text..."
                        disabled={isEvaluating}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Main Action Row: Evaluate Both Candidates ── */}
          <div className="pdf-action-row" style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-primary"
                disabled={!allFiveReady || isEvaluating}
                onClick={handleTriggerEvaluate}
                style={{ fontSize: '0.92rem', padding: '0.65rem 1.4rem' }}
              >
                {isEvaluating ? (
                  <>
                    <span className="spinner">⚙</span>
                    Evaluating Both Candidates...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Evaluate Both Candidates (A &amp; B)
                  </>
                )}
              </button>

              {!allFiveReady && (
                <span style={{ fontSize: '0.78rem', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <AlertCircle size={13} />
                  Please complete all 5 PDF upload slots to begin evaluation ({totalReady}/5 ready).
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Extracted Text Preview Modal ── */}
      {previewSlotId && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(5, 8, 16, 0.85)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setPreviewSlotId(null)}
        >
          <div
            className="card"
            style={{
              maxWidth: '750px',
              width: '100%',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              background: '#111827',
              border: '1px solid var(--border-accent)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-header" style={{ marginBottom: '0.75rem' }}>
              <div className="card-title-group">
                <FileText size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                  Preview: {slots[previewSlotId]?.label} ({slots[previewSlotId]?.fileName || 'Extracted Text'})
                </h3>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.3rem 0.5rem', borderRadius: '50%' }}
                onClick={() => setPreviewSlotId(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Extracted {slots[previewSlotId]?.charCount.toLocaleString()} characters locally in browser.
            </div>

            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                background: 'var(--bg-card-subtle)',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                color: '#cbd5e1',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
              }}
            >
              {slots[previewSlotId]?.extractedText}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setPreviewSlotId(null)}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Reusable Individual PDF Slot Card ──
interface PdfSlotCardProps {
  slot: SlotState;
  isEvaluating: boolean;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (f: File) => void;
  onClear: () => void;
  onPreview: () => void;
  inputRef: (el: HTMLInputElement | null) => void;
}

const PdfSlotCard: React.FC<PdfSlotCardProps> = ({
  slot,
  isEvaluating,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onClear,
  onPreview,
  inputRef,
}) => {
  return (
    <div
      className={`pdf-slot pdf-slot-${slot.status} ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="pdf-slot-header">
        <div className="pdf-slot-label-group">
          <FileText
            size={16}
            color={
              slot.status === 'success'
                ? '#34d399'
                : slot.status === 'error'
                ? '#f87171'
                : 'var(--text-muted)'
            }
          />
          <div>
            <div className="pdf-slot-label">{slot.label}</div>
            <div className="pdf-slot-description">{slot.description}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {slot.status === 'success' && (
            <>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.2rem 0.45rem', fontSize: '0.72rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview();
                }}
                title="Preview Extracted Text"
              >
                <Eye size={12} /> View
              </button>

              <button
                type="button"
                className="pdf-slot-clear"
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
                title="Remove File"
              >
                <X size={14} />
              </button>
            </>
          )}
        </div>
      </div>

      {slot.status === 'empty' && (
        <label className="pdf-drop-zone">
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            style={{ display: 'none' }}
            disabled={isEvaluating}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFileSelect(f);
            }}
          />
          <Upload size={18} color="var(--text-muted)" />
          <span>Drop PDF or click to select</span>
        </label>
      )}

      {slot.status === 'loading' && (
        <div className="pdf-slot-status">
          <span className="spinner-subtle">⚙</span>
          <span>Extracting text from {slot.fileName}…</span>
        </div>
      )}

      {slot.status === 'success' && (
        <div className="pdf-slot-status pdf-slot-success">
          <CheckCircle size={14} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
            {slot.fileName}
          </span>
          <span className="pdf-char-badge">{slot.charCount.toLocaleString()} chars</span>
        </div>
      )}

      {slot.status === 'error' && (
        <div className="pdf-slot-status pdf-slot-error">
          <AlertCircle size={14} />
          <span style={{ fontSize: '0.78rem' }}>{slot.error}</span>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', marginLeft: 'auto' }}
            onClick={onClear}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};
