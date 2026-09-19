'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Download, FileText, Briefcase, Building2,
  RotateCcw, CheckCircle, ArrowRight,
  Phone, MapPin, Mail, GitFork, Globe,
  Link2, Copy, Check, Sparkles, Terminal,
  ExternalLink, GraduationCap, Award, ShieldCheck,
} from 'lucide-react';

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

interface ResumeProject {
  name: string;
  relevanceReason: string;
  bullets: string[];
  techStack: string[];
}

interface SkillsCategory {
  languages?: string[];
  frameworks?: string[];
  tools?: string[];
  databases?: string[];
}

interface ResumeResult {
  selectedProjects: ResumeProject[];
  professionalSummary: string;
  skills: SkillsCategory | string[];
  certifications?: string[];
  achievements?: string[];
}

interface UserInfo {
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  linkedinUrl: string | null;
  education: string | null;
  certifications: string | null;
  achievements: string | null;
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
    'Categorizing technical skills (Languages, Frameworks, Tools)...',
    'Integrating stored qualifications, certifications & achievements...',
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
      setLoadingProgress(prev => Math.min(prev + 12, 95));
    }, 1600);

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
    const filename = `${userInfo?.name?.replace(/\s+/g, '_') || 'Resume'}_${jobTitle || 'Tailored_Resume'}.pdf`;
    pdf.save(filename);
  }

  function getCategorizedSkills() {
    if (!result?.skills) {
      return { languages: [], frameworks: [], tools: [], databases: [] };
    }
    if (Array.isArray(result.skills)) {
      return {
        languages: result.skills.slice(0, 4),
        frameworks: result.skills.slice(4, 8),
        tools: result.skills.slice(8, 12),
        databases: result.skills.slice(12),
      };
    }
    return {
      languages: result.skills.languages || [],
      frameworks: result.skills.frameworks || [],
      tools: result.skills.tools || [],
      databases: result.skills.databases || [],
    };
  }

  const certsList: string[] =
    result?.certifications && result.certifications.length > 0
      ? result.certifications
      : userInfo?.certifications
      ? userInfo.certifications
          .split('\n')
          .map(c => c.replace(/^[•\-\*]\s*/, '').trim())
          .filter(Boolean)
      : [];

  const achievementsList: string[] =
    result?.achievements && result.achievements.length > 0
      ? result.achievements
      : userInfo?.achievements
      ? userInfo.achievements
          .split('\n')
          .map(a => a.replace(/^[•\-\*]\s*/, '').trim())
          .filter(Boolean)
      : [];

  const categorizedSkills = getCategorizedSkills();

  function handleCopyText() {
    if (!result || !userInfo) return;
    const parts: string[] = [];

    // Header
    parts.push(userInfo.name.toUpperCase());
    parts.push(userInfo.currentRole || jobTitle || 'Software Engineer');
    const contacts = [
      userInfo.email,
      userInfo.phone,
      userInfo.location,
      userInfo.githubUsername ? `github.com/${userInfo.githubUsername}` : null,
      userInfo.linkedinUrl ? userInfo.linkedinUrl.replace(/^https?:\/\//, '') : null,
      userInfo.website ? userInfo.website.replace(/^https?:\/\//, '') : null,
    ].filter(Boolean);
    parts.push(contacts.join(' | '));
    parts.push('');

    // Summary
    parts.push('PROFESSIONAL SUMMARY');
    parts.push(result.professionalSummary);
    parts.push('');

    // Skills
    parts.push('TECHNICAL SKILLS');
    if (categorizedSkills.languages.length > 0) parts.push(`Languages: ${categorizedSkills.languages.join(', ')}`);
    if (categorizedSkills.frameworks.length > 0) parts.push(`Frameworks & Libraries: ${categorizedSkills.frameworks.join(', ')}`);
    if (categorizedSkills.tools.length > 0) parts.push(`Developer Tools & Cloud: ${categorizedSkills.tools.join(', ')}`);
    if (categorizedSkills.databases.length > 0) parts.push(`Databases & Concepts: ${categorizedSkills.databases.join(', ')}`);
    parts.push('');

    // Projects
    parts.push('KEY TECHNICAL PROJECTS');
    result.selectedProjects.forEach(p => {
      parts.push(`${p.name} | ${p.techStack.join(', ')}`);
      p.bullets.forEach(b => parts.push(`  • ${b.replace(/^[•\-\*]\s*/, '')}`));
      parts.push('');
    });

    // Education
    if (userInfo.education) {
      parts.push('EDUCATION & QUALIFICATIONS');
      parts.push(userInfo.education);
      parts.push('');
    }

    // Certifications
    if (certsList.length > 0) {
      parts.push('CERTIFICATIONS & LICENSES');
      certsList.forEach(c => parts.push(`  • ${c}`));
      parts.push('');
    }

    // Achievements
    if (achievementsList.length > 0) {
      parts.push('ACHIEVEMENTS & HONORS');
      achievementsList.forEach(a => parts.push(`  • ${a}`));
      parts.push('');
    }

    navigator.clipboard.writeText(parts.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full relative space-y-7">

      {/* ── 3D Futuristic HUD Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.65)] backdrop-blur-md shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-72 h-20 bg-[#81ACEC]/15 blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
            <span className="inline-flex items-center gap-1 text-[#81ACEC] bg-[#81ACEC]/10 px-2 py-0.5 rounded-full border border-[#81ACEC]/25 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#81ACEC] animate-pulse" />
              RESUME.SYNTHESIS // ACTIVE
            </span>
            <span>//</span>
            <span className="text-[hsl(var(--foreground))]">ATS.COMPLIANT</span>
          </div>
          <h1 className="text-xl md:text-2xl font-normal tracking-tight text-[hsl(var(--foreground))] pt-0.5">
            ai resume drafting studio
          </h1>
          <p className="font-mono text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-2">
            <span>paste target job description</span>
            <span>·</span>
            <span className="text-[#81ACEC] font-semibold">semantic repo matching</span>
            <span>·</span>
            <span>full engineering format</span>
          </p>
        </div>

        <Link
          href="/settings"
          className="relative z-10 self-start sm:self-center paper-btn-secondary text-xs py-2 px-3.5 rounded-xl border border-[hsl(var(--border))] hover:border-[#81ACEC] transition-colors flex items-center gap-2"
        >
          <GraduationCap className="w-3.5 h-3.5 text-[#81ACEC]" />
          <span>Edit Profile &amp; Credentials</span>
        </Link>
      </div>

      {/* Steps Pill Indicator in 3D */}
      <div className="flex items-center gap-2 border-b border-[hsl(var(--border))] pb-4">
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
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all duration-200 ${
                isCurrent
                  ? 'bg-[#81ACEC] text-slate-950 font-bold shadow-[0_0_15px_rgba(129,172,236,0.4)]'
                  : isPassed
                  ? 'border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))]'
                  : 'border border-[hsl(var(--border)/0.5)] text-[hsl(var(--muted-foreground)/0.5)]'
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
          {/* Informational Callout */}
          <div className="p-4 rounded-xl border border-[#81ACEC]/25 bg-[#81ACEC]/5 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-[#81ACEC] mt-0.5 shrink-0" />
            <div className="text-xs space-y-1">
              <p className="font-semibold text-[hsl(var(--foreground))]">
                Permanent Credentials + Dynamic JD Matching
              </p>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                Your <strong>Qualifications</strong>, <strong>Certifications</strong>, <strong>Achievements</strong>, <strong>LinkedIn</strong>, and <strong>GitHub</strong> profiles are permanently fetched from your{' '}
                <Link href="/settings" className="text-[#81ACEC] underline underline-offset-2 hover:opacity-80 font-medium">
                  Settings Profile
                </Link>
                . Only your technical skills and project highlights are dynamically tailored to each job description.
              </p>
            </div>
          </div>

          <div className="card-3d overflow-hidden p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[hsl(var(--border)/0.5)] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#81ACEC]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--foreground))]">
                  target role specification
                </span>
              </div>
              <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-[#81ACEC]/10 text-[#81ACEC] border border-[#81ACEC]/20">
                GEMINI FLASH PROMPT ENGINE
              </span>
            </div>

            <div className="space-y-4">
              {/* Optional Job Title & Company */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">
                    target job title <span className="normal-case opacity-60">(optional)</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                    <input
                      value={jobTitle}
                      onChange={e => setJobTitle(e.target.value)}
                      placeholder="e.g. Senior Full Stack Engineer"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-xs text-[hsl(var(--foreground))] outline-none focus:border-[#81ACEC] focus:shadow-[0_0_12px_rgba(129,172,236,0.25)] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">
                    company name <span className="normal-case opacity-60">(optional)</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                    <input
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder="e.g. Google / Microsoft / Stripe"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-xs text-[hsl(var(--foreground))] outline-none focus:border-[#81ACEC] focus:shadow-[0_0_12px_rgba(129,172,236,0.25)] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* JD Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">
                    job description <span className="text-rose-500">*</span>
                  </label>
                  <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
                    {jdText.length} chars {jdText.length > 0 && jdText.length < 50 ? '(min 50 required)' : ''}
                  </span>
                </div>
                <textarea
                  value={jdText}
                  onChange={e => setJdText(e.target.value)}
                  placeholder="Paste the complete job description from LinkedIn, Indeed, Naukri, or employer website...&#10;&#10;BuildFolio will extract core competencies, match relevant repositories, synthesize ATS bullets, and format your complete qualifications and certifications."
                  rows={9}
                  className="w-full p-3.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-xs leading-relaxed text-[hsl(var(--foreground))] outline-none focus:border-[#81ACEC] focus:shadow-[0_0_15px_rgba(129,172,236,0.2)] transition-all resize-none font-mono"
                />
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[hsl(var(--border)/0.4)]">
              {error ? (
                <p className="text-xs text-rose-500 font-mono">error: {error}</p>
              ) : (
                <p className="text-[11px] text-[hsl(var(--muted-foreground))] font-mono">
                  ai scans your repositories to match the best projects
                </p>
              )}

              <button
                onClick={handleGenerate}
                disabled={jdText.trim().length < 50}
                className="paper-btn-primary text-xs py-2.5 px-5 rounded-xl w-full sm:w-auto shadow-sm hover:shadow-[0_0_20px_rgba(129,172,236,0.35)] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
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
        <div className="card-3d p-14 text-center space-y-6 animate-fade-in-up">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-[#81ACEC]/20 animate-ping" />
            <div className="absolute inset-0 rounded-full border-2 border-t-[#81ACEC] animate-spin" />
            <div className="absolute inset-2 rounded-xl bg-[#81ACEC] flex items-center justify-center shadow-[0_0_20px_#81ACEC]">
              <Sparkles className="w-5 h-5 text-slate-950 animate-pulse" />
            </div>
          </div>

          <div className="space-y-1.5 max-w-sm mx-auto">
            <p className="text-sm font-semibold text-[hsl(var(--foreground))]">{loadingMsg}</p>
            <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
              quantum matching engine active across your code index
            </p>
          </div>

          <div className="max-w-xs mx-auto space-y-2">
            <div className="h-1.5 w-full bg-[hsl(var(--muted))] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#81ACEC] to-emerald-400 transition-all duration-300 ease-out shadow-[0_0_8px_#81ACEC]"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">{loadingProgress}% completed</span>
          </div>
        </div>
      )}

      {/* STEP 3: RESULT */}
      {step === 'result' && result && userInfo && (
        <div className="space-y-6 animate-fade-in-up">
          {/* Action Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.7)] backdrop-blur-md shadow-lg">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                <span className="text-xs font-semibold text-[hsl(var(--foreground))]">
                  tailored for {jobTitle || 'selected role'} {companyName ? `at ${companyName}` : ''}
                </span>
              </div>
              <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5">
                {result.selectedProjects.length} projects matched · {categorizedSkills.languages.length + categorizedSkills.frameworks.length + categorizedSkills.tools.length + categorizedSkills.databases.length} skills · {certsList.length} certs · {achievementsList.length} achievements
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => { setStep('input'); setResult(null); setError(''); }}
                className="paper-btn-secondary text-xs py-2 px-3.5 rounded-xl hover:border-[#81ACEC] transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>new draft</span>
              </button>

              <button
                onClick={handleCopyText}
                className="paper-btn-secondary text-xs py-2 px-3.5 rounded-xl hover:border-[#81ACEC] transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'copied text' : 'copy text'}</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                className="paper-btn-primary text-xs py-2 px-4 rounded-xl shadow-xs hover:shadow-[0_0_20px_rgba(129,172,236,0.35)] transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>download pdf</span>
              </button>
            </div>
          </div>

          {/* Matched Project Chips in 3D */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {result.selectedProjects.map((p, i) => (
              <div
                key={p.name}
                className="card-3d p-4 space-y-2 group hover:-translate-y-1 hover:border-[#81ACEC]/50 hover:shadow-[0_0_15px_rgba(129,172,236,0.2)] transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#81ACEC] font-semibold">#0{i + 1} MATCH</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                </div>
                <p className="text-xs font-semibold text-[hsl(var(--foreground))] group-hover:text-[#81ACEC] transition-colors truncate">
                  {p.name}
                </p>
                <p className="text-[11px] text-[hsl(var(--muted-foreground))] line-clamp-2 leading-relaxed">
                  {p.relevanceReason}
                </p>
              </div>
            ))}
          </div>

          {/* Notice if credentials not yet added in settings */}
          {(!userInfo.education || certsList.length === 0 || achievementsList.length === 0 || !userInfo.linkedinUrl) && (
            <div className="p-3.5 rounded-xl border border-amber-500/25 bg-amber-500/5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-[hsl(var(--foreground))]">
                  Want to add or update your <strong>Education</strong>, <strong>Certifications</strong>, <strong>Achievements</strong>, or <strong>LinkedIn</strong>?
                </span>
              </div>
              <Link
                href="/settings"
                className="font-medium text-[#81ACEC] hover:underline shrink-0 text-[11px]"
              >
                Update Profile Settings →
              </Link>
            </div>
          )}

          {/* The Physical Paper Drafting Sheet inside 3D elevated frame */}
          <div className="p-4 sm:p-8 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.5)] paper-grid flex justify-center shadow-xl">
            <div
              ref={resumeRef}
              className="paper-sheet w-full max-w-2xl px-8 sm:px-10 py-8 sm:py-10 rounded-sm font-sans text-neutral-900 shadow-md relative bg-white"
              style={{ minHeight: '940px' }}
            >
              {/* Header */}
              <div className="text-center border-b-[1.5px] border-neutral-900 pb-3.5 mb-4">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 uppercase">
                  {userInfo.name}
                </h1>
                <p className="text-xs sm:text-sm text-neutral-700 font-semibold tracking-wide mt-0.5">
                  {userInfo.currentRole || jobTitle || 'Software Engineer'}
                </p>

                {/* Contact Information Bar */}
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-2 text-[11px] text-neutral-600">
                  {userInfo.email && (
                    <a href={`mailto:${userInfo.email}`} className="hover:text-blue-600 transition-colors inline-flex items-center gap-1">
                      <Mail className="w-3 h-3 text-neutral-500" />
                      <span>{userInfo.email}</span>
                    </a>
                  )}
                  {userInfo.phone && (
                    <span className="inline-flex items-center gap-1">
                      <Phone className="w-3 h-3 text-neutral-500" />
                      <span>{userInfo.phone}</span>
                    </span>
                  )}
                  {userInfo.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-neutral-500" />
                      <span>{userInfo.location}</span>
                    </span>
                  )}
                  {userInfo.githubUsername && (
                    <a
                      href={`https://github.com/${userInfo.githubUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 underline underline-offset-2 transition-colors font-medium inline-flex items-center gap-1 text-neutral-800"
                    >
                      <GitHubIcon className="w-3 h-3 text-neutral-800" />
                      <span>github.com/{userInfo.githubUsername}</span>
                    </a>
                  )}
                  {userInfo.linkedinUrl && (
                    <a
                      href={userInfo.linkedinUrl.startsWith('http') ? userInfo.linkedinUrl : `https://${userInfo.linkedinUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 underline underline-offset-2 transition-colors font-medium inline-flex items-center gap-1 text-blue-700"
                    >
                      <LinkedinIcon className="w-3 h-3 text-blue-700" />
                      <span>{userInfo.linkedinUrl.replace(/^https?:\/\/(www\.)?/, '')}</span>
                    </a>
                  )}
                  {userInfo.website && (
                    <a
                      href={userInfo.website.startsWith('http') ? userInfo.website : `https://${userInfo.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 underline underline-offset-2 transition-colors font-medium inline-flex items-center gap-1 text-neutral-800"
                    >
                      <Globe className="w-3 h-3 text-neutral-500" />
                      <span>{userInfo.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* 1. Professional Summary */}
              <div className="mb-4">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-0.5 mb-1.5">
                  Professional Summary
                </h2>
                <p className="text-[11px] text-neutral-700 leading-relaxed text-justify">
                  {result.professionalSummary}
                </p>
              </div>

              {/* 2. Technical Skills */}
              <div className="mb-4">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-0.5 mb-1.5">
                  Technical Core Competencies
                </h2>
                <div className="space-y-1 text-[11px] text-neutral-800">
                  {categorizedSkills.languages.length > 0 && (
                    <div>
                      <span className="font-bold text-neutral-900">Languages: </span>
                      <span className="text-neutral-700">{categorizedSkills.languages.join(', ')}</span>
                    </div>
                  )}
                  {categorizedSkills.frameworks.length > 0 && (
                    <div>
                      <span className="font-bold text-neutral-900">Frameworks &amp; Libraries: </span>
                      <span className="text-neutral-700">{categorizedSkills.frameworks.join(', ')}</span>
                    </div>
                  )}
                  {categorizedSkills.tools.length > 0 && (
                    <div>
                      <span className="font-bold text-neutral-900">Developer Tools &amp; Cloud: </span>
                      <span className="text-neutral-700">{categorizedSkills.tools.join(', ')}</span>
                    </div>
                  )}
                  {categorizedSkills.databases.length > 0 && (
                    <div>
                      <span className="font-bold text-neutral-900">Databases &amp; Architecture: </span>
                      <span className="text-neutral-700">{categorizedSkills.databases.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Key Technical Projects */}
              <div className="mb-4">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-0.5 mb-2">
                  Key Technical Projects
                </h2>
                <div className="space-y-3">
                  {result.selectedProjects.map((p) => (
                    <div key={p.name} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-neutral-900">{p.name}</span>
                          {userInfo.githubUsername && (
                            <a
                              href={`https://github.com/${userInfo.githubUsername}/${p.name}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-neutral-500 hover:text-blue-600 transition-colors inline-flex items-center gap-0.5"
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                              <span>Code</span>
                            </a>
                          )}
                        </div>
                        <span className="text-[10px] font-medium text-neutral-600 italic">
                          {p.techStack.join(' · ')}
                        </span>
                      </div>
                      <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11px] text-neutral-700 leading-relaxed">
                        {p.bullets.map((b, bi) => (
                          <li key={bi}>{b.replace(/^[•\-\*]\s*/, '')}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Education & Qualifications */}
              {userInfo.education && (
                <div className="mb-4">
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-0.5 mb-1.5">
                    Education &amp; Qualifications
                  </h2>
                  <div className="text-[11px] text-neutral-700 space-y-0.5">
                    {userInfo.education.split('\n').map((line, li) => (
                      <p key={li} className="leading-snug">{line.replace(/^[•\-\*]\s*/, '')}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. Certifications & Licenses */}
              {certsList.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-0.5 mb-1.5">
                    Certifications &amp; Licenses
                  </h2>
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11px] text-neutral-700 leading-relaxed">
                    {certsList.map((cert, ci) => (
                      <li key={ci}>{cert}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 6. Key Achievements & Honors */}
              {achievementsList.length > 0 && (
                <div>
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-0.5 mb-1.5">
                    Key Achievements &amp; Honors
                  </h2>
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11px] text-neutral-700 leading-relaxed">
                    {achievementsList.map((ach, ai) => (
                      <li key={ai}>{ach}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
