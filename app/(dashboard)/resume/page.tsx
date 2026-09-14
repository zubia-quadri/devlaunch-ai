'use client';
import { useState, useRef } from 'react';
import {
  Download, FileText, Briefcase, Building2,
  RotateCcw, CheckCircle, ArrowRight,
  Phone, MapPin, Mail, GitFork, Globe,
  Link2, Copy, Check, Sparkles, Terminal,
} from 'lucide-react';

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
  const [loadingMsg, setLoadingMsg] = useState('Reading job requirements...');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  const loadingMessages = [
    'Reading job requirements & technical keywords...',
    'Scanning your GitHub repositories...',
    'Evaluating semantic similarity against projects...',
    'Selecting top 2–3 matching projects...',
    'Drafting quantified achievement bullets...',
    'Compiling tailored professional summary...',
    'Finalizing ATS-compliant paper document...',
  ];

  async function handleGenerate() {
    if (jdText.trim().length < 50) {
      setError('Please paste a complete job description (at least 50 characters).');
      return;
    }
    setError('');
    setStep('loading');
    setLoadingProgress(10);

    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % loadingMessages.length;
      setLoadingMsg(loadingMessages[msgIndex]);
      setLoadingProgress(prev => Math.min(prev + 15, 95));
    }, 1800);

    try {
      const res = await fetch('/api/resume/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jdText, jobTitle, companyName }),
      });
      const data = await res.json();
      clearInterval(msgInterval);
      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        setStep('input');
        return;
      }
      setLoadingProgress(100);
      setTimeout(() => {
        setResult(data.data);
        setUserInfo(data.user);
        setStep('result');
      }, 400);
    } catch {
      clearInterval(msgInterval);
      setError('Network error. Please try again.');
      setStep('input');
    }
  }

  async function handleDownloadPDF() {
    if (!resumeRef.current) return;
    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).default;
    const canvas = await html2canvas(resumeRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    const filename = `${userInfo?.name?.replace(/\s+/g, '_') || 'Resume'}_${jobTitle || 'Resume'}.pdf`;
    pdf.save(filename);
  }

  function handleCopyText() {
    if (!result || !userInfo) return;
    const text = [
      userInfo.name,
      userInfo.currentRole || jobTitle || 'Software Developer',
      '',
      'PROFESSIONAL SUMMARY',
      result.professionalSummary,
      '',
      'RELEVANT PROJECTS',
      ...result.selectedProjects.flatMap(p => [
        `${p.name} — ${p.techStack.join(', ')}`,
        ...p.bullets,
        '',
      ]),
      'TECHNICAL SKILLS',
      result.skills.join(' • '),
    ].join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full relative">

      {/* Breadcrumb & Header */}
      <div className="mb-6 space-y-1">
        <div className="flex items-center gap-2 font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
          <span>workspace</span>
          <span>/</span>
          <span className="text-[hsl(var(--foreground))]">resume-builder</span>
          <span className="paper-tag-blue px-1.5 py-0.2 ml-1 text-[9px]">studio draft</span>
        </div>
        <h1 className="text-xl md:text-2xl font-medium tracking-tight text-[hsl(var(--foreground))]">
          resume drafting canvas
        </h1>
        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          paste any target job description to match repositories, compile bullets, and export an ats-optimized pdf.
        </p>
      </div>

      {/* Steps Pill Indicator */}
      <div className="flex items-center gap-2 mb-6 border-b border-[hsl(var(--border))] pb-3">
        {[
          { id: 'input', num: '01', label: 'job specification' },
          { id: 'loading', num: '02', label: 'semantic analysis' },
          { id: 'result', num: '03', label: 'export canvas' },
        ].map((s) => {
          const isCurrent = step === s.id;
          const isPassed = (step === 'loading' && s.id === 'input') || (step === 'result' && (s.id === 'input' || s.id === 'loading'));
          return (
            <div
              key={s.id}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                isCurrent
                  ? 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))]'
                  : isPassed
                  ? 'text-[hsl(var(--foreground))]'
                  : 'text-[hsl(var(--muted-foreground)/0.6)]'
              }`}
            >
              <span>[{s.num}]</span>
              <span className="font-sans font-medium text-[11px]">{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* STEP 1: INPUT */}
      {step === 'input' && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="paper-card overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.3)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-[#81ACEC]" />
                <span className="text-xs font-semibold text-[hsl(var(--foreground))]">role specification</span>
              </div>
              <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">gemini 3.6 engine</span>
            </div>

            <div className="p-5 space-y-4">
              {/* Optional Job Title & Company */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">
                    target job title <span className="normal-case opacity-60">(optional)</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[hsl(var(--muted-foreground))]" />
                    <input
                      value={jobTitle}
                      onChange={e => setJobTitle(e.target.value)}
                      placeholder="e.g. Senior Full Stack Engineer"
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-xs text-[hsl(var(--foreground))] outline-none focus:border-[#81ACEC] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">
                    company name <span className="normal-case opacity-60">(optional)</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[hsl(var(--muted-foreground))]" />
                    <input
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder="e.g. Google"
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-xs text-[hsl(var(--foreground))] outline-none focus:border-[#81ACEC] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* JD Textarea */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">
                    job description <span className="text-rose-500">*</span>
                  </label>
                  <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
                    {jdText.length} characters {jdText.length > 0 && jdText.length < 50 ? '(min 50)' : ''}
                  </span>
                </div>
                <textarea
                  value={jdText}
                  onChange={e => setJdText(e.target.value)}
                  placeholder="Paste the full job description from LinkedIn, Indeed, Naukri, or direct listing...&#10;&#10;DevLaunch AI will extract core competencies and pinpoint the 2–3 repositories that prove your qualifications."
                  rows={9}
                  className="w-full p-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-xs leading-relaxed text-[hsl(var(--foreground))] outline-none focus:border-[#81ACEC] transition-colors resize-none font-mono"
                />
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-5 py-3 border-t border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.2)] flex flex-col sm:flex-row items-center justify-between gap-3">
              {error ? (
                <p className="text-xs text-rose-500 font-mono">error: {error}</p>
              ) : (
                <p className="text-[11px] text-[hsl(var(--muted-foreground))] font-mono">
                  ai scans your repositories to highlight your best work
                </p>
              )}

              <button
                onClick={handleGenerate}
                disabled={jdText.trim().length < 50}
                className="paper-btn-primary text-xs py-2 px-4 rounded-lg w-full sm:w-auto shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>compile tailored resume</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: LOADING */}
      {step === 'loading' && (
        <div className="paper-card p-12 text-center space-y-6 animate-fade-in-up">
          <div className="w-10 h-10 rounded-lg bg-[#81ACEC] mx-auto flex items-center justify-center animate-pulse">
            <div className="w-4 h-4 bg-[hsl(var(--background))] rounded-xs" />
          </div>

          <div className="space-y-1.5 max-w-sm mx-auto">
            <p className="text-sm font-medium text-[hsl(var(--foreground))]">{loadingMsg}</p>
            <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
              analyzing role requirements across your github profile
            </p>
          </div>

          <div className="max-w-xs mx-auto space-y-2">
            <div className="h-1 w-full bg-[hsl(var(--border))] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#81ACEC] transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">{loadingProgress}%</span>
          </div>
        </div>
      )}

      {/* STEP 3: RESULT */}
      {step === 'result' && result && userInfo && (
        <div className="space-y-6 animate-fade-in-up">
          {/* Action Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-[hsl(var(--foreground))]">
                  tailored for {jobTitle || 'selected role'} {companyName ? `at ${companyName}` : ''}
                </span>
              </div>
              <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5">
                {result.selectedProjects.length} projects matched · {result.skills.length} skills highlighted
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => { setStep('input'); setResult(null); setError(''); }}
                className="paper-btn-secondary text-xs py-1.5 px-3 rounded-lg"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>new draft</span>
              </button>

              <button
                onClick={handleCopyText}
                className="paper-btn-secondary text-xs py-1.5 px-3 rounded-lg"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'copied' : 'copy'}</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                className="paper-btn-primary text-xs py-1.5 px-4 rounded-lg shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>download pdf</span>
              </button>
            </div>
          </div>

          {/* Matched Project Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {result.selectedProjects.map((p, i) => (
              <div key={p.name} className="p-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#4a77bf] dark:text-[#9ec2f7]">#0{i + 1} project</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <p className="text-xs font-semibold text-[hsl(var(--foreground))] truncate">{p.name}</p>
                <p className="text-[11px] text-[hsl(var(--muted-foreground))] line-clamp-2 leading-relaxed">
                  {p.relevanceReason}
                </p>
              </div>
            ))}
          </div>

          {/* The Physical Paper Drafting Sheet */}
          <div className="p-4 sm:p-8 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.3)] paper-grid flex justify-center">
            <div
              ref={resumeRef}
              className="paper-sheet w-full max-w-2xl px-10 py-10 rounded-sm font-serif text-neutral-900 shadow-md relative"
              style={{ minHeight: '840px' }}
            >
              {/* Technical Registration Marks */}
              <span className="absolute top-2 left-2 font-mono text-[8px] text-neutral-400 select-none">+00.00</span>
              <span className="absolute top-2 right-2 font-mono text-[8px] text-neutral-400 select-none">+96.00</span>

              {/* Header */}
              <div className="border-b-[2px] border-neutral-800 pb-4 mb-5">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900 leading-tight">
                  {userInfo.name}
                </h1>
                <p className="text-xs font-sans text-neutral-600 mt-1 font-medium">
                  {userInfo.currentRole || jobTitle || 'Software Developer'}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 font-sans text-[11px] text-neutral-600">
                  {userInfo.email && <span>{userInfo.email}</span>}
                  {userInfo.phone && <span>· {userInfo.phone}</span>}
                  {userInfo.location && <span>· {userInfo.location}</span>}
                  {userInfo.githubUsername && <span>· github.com/{userInfo.githubUsername}</span>}
                  {userInfo.linkedinUrl && <span>· {userInfo.linkedinUrl.replace('https://', '')}</span>}
                  {userInfo.website && <span>· {userInfo.website.replace('https://', '')}</span>}
                </div>
              </div>

              {/* Professional Summary */}
              <div className="mb-5">
                <h2 className="font-sans text-[10px] font-bold uppercase tracking-wider text-neutral-800 border-b border-neutral-300 pb-1 mb-2">
                  Professional Summary
                </h2>
                <p className="font-sans text-xs text-neutral-700 leading-relaxed">
                  {result.professionalSummary}
                </p>
              </div>

              {/* Selected Projects */}
              <div className="mb-5">
                <h2 className="font-sans text-[10px] font-bold uppercase tracking-wider text-neutral-800 border-b border-neutral-300 pb-1 mb-3">
                  Key Technical Projects
                </h2>
                <div className="space-y-3 font-sans">
                  {result.selectedProjects.map((p) => (
                    <div key={p.name} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-xs font-bold text-neutral-900">{p.name}</h3>
                        <span className="text-[10px] text-neutral-500 italic">
                          {p.techStack.slice(0, 4).join(' · ')}
                        </span>
                      </div>
                      <ul className="space-y-0.5">
                        {p.bullets.map((b, bi) => (
                          <li key={bi} className="text-xs text-neutral-700 leading-relaxed">
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Skills */}
              <div className="mb-5">
                <h2 className="font-sans text-[10px] font-bold uppercase tracking-wider text-neutral-800 border-b border-neutral-300 pb-1 mb-2">
                  Technical Core Competencies
                </h2>
                <p className="font-sans text-xs text-neutral-700 leading-relaxed">
                  {result.skills.join('  •  ')}
                </p>
              </div>

              {/* Education */}
              {userInfo.education && (
                <div>
                  <h2 className="font-sans text-[10px] font-bold uppercase tracking-wider text-neutral-800 border-b border-neutral-300 pb-1 mb-2">
                    Education
                  </h2>
                  <p className="font-sans text-xs text-neutral-700">{userInfo.education}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
