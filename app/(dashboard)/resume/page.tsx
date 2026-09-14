'use client';
import { useState, useRef } from 'react';
import {
  Sparkles, Download, FileText, Briefcase, Building2,
  RotateCcw, CheckCircle, Wand2, Zap, ArrowRight,
  Phone, GraduationCap, MapPin, Mail, GitFork, Globe,
  Link2, Copy, Check,
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
  const [loadingMsg, setLoadingMsg] = useState('Analyzing job description...');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  const loadingMessages = [
    'Reading job requirements...',
    'Scanning your GitHub projects...',
    'Matching skills to role...',
    'Selecting top projects...',
    'Writing resume bullets...',
    'Crafting professional summary...',
    'Polishing your resume...',
  ];

  async function handleGenerate() {
    if (jdText.trim().length < 50) {
      setError('Please paste a complete job description (at least 50 characters).');
      return;
    }
    setError('');
    setStep('loading');
    setLoadingProgress(0);

    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % loadingMessages.length;
      setLoadingMsg(loadingMessages[msgIndex]);
      setLoadingProgress(prev => Math.min(prev + 14, 95));
    }, 2000);

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
      }, 500);
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
    <div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">

      {/* ── Header ── */}
      <div className="mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Wand2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[hsl(var(--foreground))] tracking-tight">
              AI Resume Builder
            </h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
              Paste a job description → AI tailors your resume → Download PDF
            </p>
          </div>
        </div>
      </div>

      {/* ── STEP: INPUT ── */}
      {step === 'input' && (
        <div className="space-y-6 animate-fade-in-up">

          {/* Step Progress */}
          <div className="flex items-center gap-2 md:gap-3">
            {[
              { num: 1, label: 'Paste JD', active: true },
              { num: 2, label: 'AI Analysis', active: false },
              { num: 3, label: 'Download', active: false },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center gap-2">
                {i > 0 && (
                  <div className={`hidden sm:block w-8 md:w-12 h-px ${s.active ? 'bg-violet-500' : 'bg-[hsl(var(--border))]'}`} />
                )}
                <div className="flex items-center gap-1.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                    s.active
                      ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25'
                      : 'border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
                  }`}>
                    {s.num}
                  </div>
                  <span className={`hidden sm:block text-xs font-medium ${
                    s.active ? 'text-violet-400' : 'text-[hsl(var(--muted-foreground))]'
                  }`}>
                    {s.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Form Card */}
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
            {/* Card header */}
            <div className="px-6 py-4 border-b border-[hsl(var(--border))] bg-gradient-to-r from-violet-500/5 to-fuchsia-500/5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span className="text-sm font-semibold text-[hsl(var(--foreground))]">Job Details</span>
              </div>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                AI will analyze the JD and match your best projects to it
              </p>
            </div>

            <div className="p-6 space-y-5">
              {/* Job title + company */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                    Job Title <span className="normal-case text-[hsl(var(--muted-foreground))]">(optional)</span>
                  </label>
                  <div className="relative group">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))] group-focus-within:text-violet-400 transition-colors" />
                    <input
                      value={jobTitle}
                      onChange={e => setJobTitle(e.target.value)}
                      placeholder="e.g. Senior Frontend Engineer"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] text-sm outline-none focus:border-violet-500/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] transition-all placeholder:text-[hsl(var(--muted-foreground)/0.5)]"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                    Company <span className="normal-case text-[hsl(var(--muted-foreground))]">(optional)</span>
                  </label>
                  <div className="relative group">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))] group-focus-within:text-violet-400 transition-colors" />
                    <input
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder="e.g. Google"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] text-sm outline-none focus:border-violet-500/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] transition-all placeholder:text-[hsl(var(--muted-foreground)/0.5)]"
                    />
                  </div>
                </div>
              </div>

              {/* JD textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                    Job Description <span className="text-rose-400">*</span>
                  </label>
                  <span className={`text-[10px] font-mono ${
                    jdText.length > 0 && jdText.length < 50
                      ? 'text-amber-400'
                      : jdText.length >= 50
                        ? 'text-emerald-400'
                        : 'text-[hsl(var(--muted-foreground))]'
                  }`}>
                    {jdText.length} chars {jdText.length > 0 && jdText.length < 50 ? '• need 50+' : ''}
                  </span>
                </div>
                <textarea
                  value={jdText}
                  onChange={e => setJdText(e.target.value)}
                  placeholder="Paste the full job description from LinkedIn, Naukri, Indeed, etc.&#10;&#10;The more detail you paste, the better the AI can match your projects..."
                  rows={10}
                  className="w-full px-4 py-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] text-sm outline-none focus:border-violet-500/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] transition-all resize-none leading-relaxed placeholder:text-[hsl(var(--muted-foreground)/0.4)]"
                />
              </div>
            </div>

            {/* Card footer */}
            <div className="px-6 py-4 border-t border-[hsl(var(--border))] bg-[hsl(var(--accent)/0.3)]">
              {error && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-2">
                  <span className="shrink-0">⚠️</span> {error}
                </div>
              )}
              <button
                onClick={handleGenerate}
                disabled={jdText.trim().length < 50}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:from-gray-700 disabled:to-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Sparkles className="w-4 h-4" />
                Generate Tailored Resume
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-center text-[hsl(var(--muted-foreground))] mt-3">
                <Zap className="w-3 h-3 inline-block mr-1 text-violet-400" />
                AI selects your top 2-3 matching projects and writes achievement-oriented resume bullets
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP: LOADING ── */}
      {step === 'loading' && (
        <div className="flex flex-col items-center justify-center py-20 space-y-8 animate-fade-in-up">
          {/* Animated orb */}
          <div className="relative w-28 h-28">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 animate-ping" style={{ animationDuration: '2s' }} />
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
            <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
            <div className="absolute inset-0 rounded-full border-2 border-t-violet-500 border-r-fuchsia-500 animate-spin" style={{ animationDuration: '1.5s' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Wand2 className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="text-center space-y-3 max-w-sm">
            <p className="text-lg font-bold text-[hsl(var(--foreground))]">{loadingMsg}</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              Analyzing {jdText.length.toLocaleString()} characters of job description
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-64">
            <div className="h-1.5 rounded-full bg-[hsl(var(--accent))] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-1000 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="text-[10px] text-[hsl(var(--muted-foreground))] text-center mt-2 font-mono">
              {loadingProgress}%
            </p>
          </div>
        </div>
      )}

      {/* ── STEP: RESULT ── */}
      {step === 'result' && result && userInfo && (
        <div className="space-y-6 animate-fade-in-up">

          {/* Success banner */}
          <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[hsl(var(--foreground))]">
                    Resume ready {jobTitle ? `for "${jobTitle}"` : ''}
                    {companyName ? ` at ${companyName}` : ''}
                  </p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    {result.selectedProjects.length} projects matched • {result.skills.length} skills highlighted
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setStep('input'); setResult(null); setError(''); }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[hsl(var(--border))] text-xs font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> New
                </button>
                <button
                  onClick={handleCopyText}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[hsl(var(--border))] text-xs font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs font-bold transition-all shadow-lg shadow-violet-500/20 hover:-translate-y-0.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
              </div>
            </div>
          </div>

          {/* Matched Projects Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {result.selectedProjects.map((p, i) => (
              <div key={p.name} className="group relative rounded-xl border border-violet-500/15 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 p-4 hover:border-violet-500/30 transition-all duration-300">
                <div className="absolute top-3 right-3 w-5 h-5 rounded-md bg-violet-500/15 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-violet-400">#{i + 1}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-violet-400 shrink-0" />
                  <span className="text-sm font-bold text-[hsl(var(--foreground))] truncate">{p.name}</span>
                </div>
                <p className="text-[11px] text-[hsl(var(--muted-foreground))] leading-relaxed line-clamp-2">{p.relevanceReason}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.techStack.slice(0, 3).map(t => (
                    <span key={t} className="px-1.5 py-0.5 rounded-md bg-violet-500/10 text-violet-300 text-[9px] font-semibold">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Resume Preview */}
          <div className="rounded-2xl border border-[hsl(var(--border))] overflow-hidden shadow-2xl shadow-black/20">
            <div className="bg-[hsl(var(--accent)/0.5)] px-5 py-3 flex items-center justify-between border-b border-[hsl(var(--border))]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                <span className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">Resume Preview</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
              </div>
            </div>

            {/* Actual printable resume */}
            <div
              ref={resumeRef}
              className="bg-white text-gray-900 px-12 py-10"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif", minHeight: '800px' }}
            >
              {/* Header */}
              <div className="border-b-[3px] border-gray-900 pb-4 mb-6">
                <h1 className="text-[28px] font-bold text-gray-900 tracking-tight leading-tight">
                  {userInfo.name}
                </h1>
                <p className="text-[15px] text-gray-500 mt-1 font-medium">
                  {userInfo.currentRole || jobTitle || 'Software Developer'}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-[12px] text-gray-600">
                  {userInfo.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {userInfo.email}
                    </span>
                  )}
                  {userInfo.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {userInfo.phone}
                    </span>
                  )}
                  {userInfo.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {userInfo.location}
                    </span>
                  )}
                  {userInfo.linkedinUrl && (
                    <span className="flex items-center gap-1">
                      <Link2 className="w-3 h-3" /> {userInfo.linkedinUrl.replace('https://', '')}
                    </span>
                  )}
                  {userInfo.githubUsername && (
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3 h-3" /> github.com/{userInfo.githubUsername}
                    </span>
                  )}
                  {userInfo.website && (
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" /> {userInfo.website.replace('https://', '')}
                    </span>
                  )}
                </div>
              </div>

              {/* Professional Summary */}
              <div className="mb-6">
                <h2 className="text-[11px] font-bold text-gray-900 uppercase tracking-[0.2em] border-b-[1.5px] border-gray-200 pb-1.5 mb-3">
                  Professional Summary
                </h2>
                <p className="text-[13px] text-gray-700 leading-[1.7]">{result.professionalSummary}</p>
              </div>

              {/* Projects */}
              <div className="mb-6">
                <h2 className="text-[11px] font-bold text-gray-900 uppercase tracking-[0.2em] border-b-[1.5px] border-gray-200 pb-1.5 mb-3">
                  Key Projects
                </h2>
                {result.selectedProjects.map((project) => (
                  <div key={project.name} className="mb-4 last:mb-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-[14px] font-bold text-gray-900">{project.name}</h3>
                      <span className="text-[11px] text-gray-400 ml-4 shrink-0 italic">
                        {project.techStack.slice(0, 4).join(' · ')}
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {project.bullets.map((bullet, bi) => (
                        <li key={bi} className="text-[13px] text-gray-700 leading-[1.6] pl-0">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h2 className="text-[11px] font-bold text-gray-900 uppercase tracking-[0.2em] border-b-[1.5px] border-gray-200 pb-1.5 mb-3">
                  Technical Skills
                </h2>
                <p className="text-[13px] text-gray-700 leading-[1.7]">
                  {result.skills.join('  •  ')}
                </p>
              </div>

              {/* Education */}
              {userInfo.education && (
                <div>
                  <h2 className="text-[11px] font-bold text-gray-900 uppercase tracking-[0.2em] border-b-[1.5px] border-gray-200 pb-1.5 mb-3">
                    Education
                  </h2>
                  <p className="text-[13px] text-gray-700">{userInfo.education}</p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom action */}
          <div className="flex justify-center pt-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-sm transition-all duration-300 shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-1"
            >
              <Download className="w-5 h-5" />
              Download Resume as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
