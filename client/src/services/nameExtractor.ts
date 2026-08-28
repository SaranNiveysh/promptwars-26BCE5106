/**
 * Extract candidate name from resume or transcript text
 */
export function extractCandidateNameFromText(
  resumeText: string,
  transcriptText: string = '',
  defaultFallback: string = 'Candidate'
): string {
  const combined = `${resumeText.substring(0, 1200)}\n${transcriptText.substring(0, 1200)}`;

  // Pattern 1: Explicit labels
  const labelPatterns = [
    /(?:Candidate Name|Candidate|Name|Applicant|Interviewee):\s*([A-Z][a-zA-Z.'-]+(?:\s+[A-Z][a-zA-Z.'-]+){1,2})/i,
    /(?:Resume of|CV of|Interview with|Transcript for|Candidate Dossier:)\s*([A-Z][a-zA-Z.'-]+(?:\s+[A-Z][a-zA-Z.'-]+){1,2})/i,
  ];

  for (const pattern of labelPatterns) {
    const match = combined.match(pattern);
    if (match && match[1]) {
      const name = match[1].trim().replace(/^(Mr\.|Ms\.|Dr\.)\s*/i, '');
      if (name.length >= 3 && name.length <= 35 && !/^(A|B|Candidate|Resume|Transcript|Job|Engineer)$/i.test(name)) {
        return name;
      }
    }
  }

  // Pattern 2: First capitalized name line
  const lines = resumeText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  for (const line of lines.slice(0, 6)) {
    if (/^(resume|curriculum vitae|cv|contact|email|phone|profile|summary|experience|education)/i.test(line)) {
      continue;
    }
    if (/^[A-Z][a-zA-Z.'-]+\s+[A-Z][a-zA-Z.'-]+(?:\s+[A-Z][a-zA-Z.'-]+)?$/.test(line) && line.length <= 35) {
      return line;
    }
  }

  return defaultFallback;
}
