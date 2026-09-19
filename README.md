# BuildFolio 🚀
> **Turn what you build into your next opportunity.**

BuildFolio bridges the gap between your real code and your career. Connect your GitHub account, let Gemini AI analyze your repositories and technical depth, and instantly synthesize tailored, ATS-friendly resumes for any job description.

---

## ✨ Features

- **📄 AI-Powered Resume Builder**: Paste any job description from LinkedIn, Indeed, or Naukri. Gemini AI scans your synchronized repositories, selects the top 2–3 matching projects, and drafts achievement-oriented bullet points tailored to the role.
- **📥 Instant PDF Export**: Download ATS-formatted, printable PDF resumes generated right in your browser with 1-click export.
- **🔍 Deep Repository Analysis**: Automated architectural scans assessing repository complexity, engineering patterns, and primary tech stacks.
- **🌐 Public Developer Portfolio**: A responsive, shareable portfolio (`/[username]`) showcasing your GitHub telemetry, language distribution, and highlighted projects.
- **✨ 3D HUD & AuthKit-Inspired Visuals**: Modern glassmorphism, 3D card tilt physics, telemetry headers, and a 60fps interactive starlight particle background with seamless dark/light mode switching.
- **🛡️ Secure & Scalable Architecture**: NextAuth.js v5 (Auth.js) with GitHub OAuth, Prisma ORM, in-memory sliding window rate limiting, and zero hardcoded credentials.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI Engine**: [Google Gemini API](https://aistudio.google.com/) (`@google/generative-ai`)
- **Database & ORM**: [Prisma ORM](https://www.prisma.io/) with [PostgreSQL](https://neon.tech)
- **Authentication**: [NextAuth.js v5](https://authjs.dev/) (GitHub OAuth Provider)
- **Document Export**: `jspdf` & `html2canvas`
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/zubia-quadri/devlaunch-ai.git
cd devlaunch-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file and fill in your keys:

```bash
cp .env.example .env.local
```

Configure the following variables in `.env.local`:

| Variable | Description | Where to obtain |
|---|---|---|
| `AUTH_URL` | Canonical URL of your app | `http://localhost:3000` for local dev |
| `AUTH_SECRET` | Auth.js session encryption secret | Run `openssl rand -base64 32` |
| `AUTH_GITHUB_ID` | GitHub OAuth App Client ID | [GitHub Developer Settings](https://github.com/settings/developers) |
| `AUTH_GITHUB_SECRET` | GitHub OAuth App Client Secret | [GitHub Developer Settings](https://github.com/settings/developers) |
| `DATABASE_URL` | PostgreSQL connection string | [Neon](https://neon.tech), Supabase, or local Postgres |
| `GEMINI_API_KEY` | Google Gemini API Key | [Google AI Studio](https://aistudio.google.com/app/apikey) |

### 4. Push database schema

```bash
npx prisma db push
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Security & Environment Safety

- **Zero Secrets Tracked**: All credentials and API keys are stored strictly in `.env.local` (enforced via `.gitignore`).
- **OAuth Scopes**: Requests only public repository read scopes for GitHub integration.
- **Rate Limiting**: AI analysis endpoints and resume matchers are protected by sliding-window rate limiters.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

