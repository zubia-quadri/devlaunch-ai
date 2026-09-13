'use client';
import { useState, useRef } from 'react';
import { Sparkles, Download, FileText, Briefcase, Building2, ChevronRight, RotateCcw, CheckCircle } from 'lucide-react';

interface ResumeProject {
  name: string;
  relevanceReason: string;
  bullets: string[];
  techStack: string[];
}

interface ResumeResult {
  selectedProjects: ResumeProject[];
  professionalSummary: string;
  skills: string[];
}

interface UserInfo {
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  linkedinUrl: string | null;
  education: string | null;
  currentRole: string | null;
  githubUsername: string | null;
  website: string | null;
}

export default function ResumePage() {
  const [step, setStep] = useState<'input' | 'loading' | 'result'>('input');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jdText, setJdText] = useState('');
  const [result, setResult] = useState<ResumeResult | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [error, setError] = useState('');
  const [loadingMsg, setLoadingMsg] = useState('Analyzing job description...');
  const resumeRef = useRef<HTMLDivElement>(null);

  const loadingMessages = [
    'Analyzing job description...',
    'Scanning your GitHub projects...',
    'Matching projects to role requirements...',
    'Writing tailored resume bullets...',
    'Crafting your professional summary...',
    'Finalizing your resume...',
  ];

  async function handleGenerate() {
    if (jdText.trim().length < 50) {
      setError('Please paste a complete job description (at least 50 characters).');
      return;
    }
    setError('');
    setStep('loading');

    // Cycle loading messages
    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % loadingMessages.length;
      setLoadingMsg(loadingMessages[msgIndex]);
    }, 2000);

    try {
      const res = await fetch('/api/resume/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jdText, jobTitle, companyName }),
      });
      const data = await res.json();
      clearInterval(msgInterval);
      if (!res.ok) { setError(data.error || 'Something went wrong.'); setStep('input'); return; }
      setResult(data.data);
      setUserInfo(data.user);
      setStep('result');
    } catch {
      clearInterval(msgInterval);
      setError('Network error. Please try again.');
      setStep('input');
    }
  }

  async function handleDownloadPDF() {
    if (!resumeRef.current) return;
    // Dynamic import to avoid SSR issues
    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).default;
    const canvas = await html2canvas(resumeRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    const filename = `${userInfo?.name?.replace(/\s+/g, '_') || 'Resume'}_${jobTitle || 'Resume'}.pdf`;
    pdf.save(filename);
  }

  return (
    <div className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">AI Resume Builder</h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Paste a job description → get a tailored resume in seconds</p>
          </div>
        </div>
      </div>

      {/* Step: Input */}
      {step === 'input' && (
        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-bold">1</div>
              <span className="text-sm font-medium text-[hsl(var(--foreground))]">Job Details</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
            <div className="flex items-center gap-2 opacity-40">
              <div className="w-7 h-7 rounded-full border-2 border-[hsl(var(--border))] flex items-center justify-center text-xs font-bold">2</div>
              <span className="text-sm">AI Analysis</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[hsl(var(--muted-foreground))] opacity-40" />
            <div className="flex items-center gap-2 opacity-40">
              <div className="w-7 h-7 rounded-full border-2 border-[hsl(var(--border))] flex items-center justify-center text-xs font-bold">3</div>
              <span className="text-sm">Download Resume</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[hsl(var(--foreground))]">Job Title <span className="text-[hsl(var(--muted-foreground))]">(optional)</span></label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                <input
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] text-sm outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[hsl(var(--foreground))]">Company <span className="text-[hsl(var(--muted-foreground))]">(optional)</span></label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                <input
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="e.g. Google"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] text-sm outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[hsl(var(--foreground))]">Job Description <span className="text-rose-400">*</span></label>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">Paste the full job description from LinkedIn, Naukri, Indeed, etc.</p>
            <textarea
              value={jdText}
              onChange={e => setJdText(e.target.value)}
              placeholder="Paste the complete job description here..."
              rows={12}
              className="w-full px-4 py-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] text-sm outline-none focus:border-violet-500 transition-colors resize-none"
            />
            <div className="flex justify-between text-xs text-[hsl(var(--muted-foreground))]">
              <span>{jdText.length < 50 && jdText.length > 0 ? '⚠️ Too short — paste the full JD' : ''}</span>
              <span>{jdText.length} chars</span>
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">{error}</div>
          )}

          <button
            onClick={handleGenerate}
            disabled={jdText.trim().length < 50}
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Generate Tailored Resume
          </button>

          <p className="text-xs text-center text-[hsl(var(--muted-foreground))]">AI will select your top 2-3 matching projects and write resume bullets tailored to this role</p>
        </div>
      )}

      {/* Step: Loading */}
      {step === 'loading' && (
        <div className="flex flex-col items-center justify-center py-24 space-y-6">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-violet-500/20" />
            <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-violet-400" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-[hsl(var(--foreground))]">{loadingMsg}</p>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">This takes about 10-15 seconds</p>
          </div>
          <div className="flex gap-1.5">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      )}

      {/* Step: Result */}
      {step === 'result' && result && userInfo && (
        <div className="space-y-6">
          {/* Action bar */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-medium text-[hsl(var(--foreground))]">Resume generated for {jobTitle || 'this role'}</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setStep('input'); setResult(null); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[hsl(var(--border))] text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> New Resume
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          </div>

          {/* Matched projects summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {result.selectedProjects.map((p) => (
              <div key={p.name} className="p-4 rounded-xl border border-violet-500/20 bg-violet-500/5">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-violet-400 shrink-0" />
                  <span className="text-sm font-semibold text-[hsl(var(--foreground))] truncate">{p.name}</span>
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground))] line-clamp-2">{p.relevanceReason}</p>
              </div>
            ))}
          </div>

          {/* Resume Preview */}
          <div className="border border-[hsl(var(--border))] rounded-2xl overflow-hidden shadow-xl">
            <div className="bg-[hsl(var(--muted))] px-4 py-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
              <span className="text-xs text-[hsl(var(--muted-foreground))]">Resume Preview</span>
            </div>
            {/* Actual printable resume */}
            <div ref={resumeRef} className="bg-white text-gray-900 p-10 font-sans" style={{ minHeight: '297mm', fontFamily: 'Georgia, serif' }}>
              {/* Header */}
              <div className="border-b-2 border-gray-800 pb-4 mb-5">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{userInfo.name}</h1>
                <p className="text-base text-gray-600 mt-0.5">{userInfo.currentRole || jobTitle || 'Software Developer'}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
                  {userInfo.email && <span>{userInfo.email}</span>}
                  {userInfo.phone && <span>{userInfo.phone}</span>}
                  {userInfo.location && <span>{userInfo.location}</span>}
                  {userInfo.linkedinUrl && <span>{userInfo.linkedinUrl.replace('https://', '')}</span>}
                  {userInfo.githubUsername && <span>github.com/{userInfo.githubUsername}</span>}
                  {userInfo.website && <span>{userInfo.website.replace('https://', '')}</span>}
                </div>
              </div>

              {/* Professional Summary */}
              <div className="mb-5">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-1 mb-2">Professional Summary</h2>
                <p className="text-sm text-gray-700 leading-relaxed">{result.professionalSummary}</p>
              </div>

              {/* Projects */}
              <div className="mb-5">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-1 mb-3">Relevant Projects</h2>
                {result.selectedProjects.map((project) => (
                  <div key={project.name} className="mb-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-bold text-gray-900">{project.name}</h3>
                      <span className="text-xs text-gray-500 ml-4">{project.techStack.slice(0, 4).join(' · ')}</span>
                    </div>
                    <ul className="mt-1 space-y-1">
                      {project.bullets.map((bullet, bi) => (
                        <li key={bi} className="text-sm text-gray-700 leading-relaxed pl-1">{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div className="mb-5">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-1 mb-2">Technical Skills</h2>
                <p className="text-sm text-gray-700">{result.skills.join(' • ')}</p>
              </div>

              {/* Education */}
              {userInfo.education && (
                <div>
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-1 mb-2">Education</h2>
                  <p className="text-sm text-gray-700">{userInfo.education}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
