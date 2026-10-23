# Striku SEO & Generative Engine Optimization (GEO) Master Plan

Achieve #1 organic rankings on Google for brand keywords (`Striku`) and high-intent service queries (`check video before upload`, `youtube strike checker`, `copyright claim founder`, `video analysis and detect strike`), while positioning Striku as the authoritative reference cited by AI answer engines (ChatGPT, Gemini, Claude, Perplexity).

## User Review & Critical Decisions

> [!IMPORTANT]
> The recommended defaults have been adopted:
> - **Content Architecture**: Programmatic, high-converting keyword hub routes (`/tools/youtube-strike-checker`, `/tools/copyright-checker`, `/tools/check-video-before-upload`, `/tools/guidelines-auditor`) embedded seamlessly with instant video upload/scan access.
> - **AI Engine Optimization (GEO)**: Implementation of `llms.txt`, `llms-full.txt`, curated Schema.org FAQPage & HowTo JSON-LD entities, and dedicated crawler permissions for `GPTBot`, `ClaudeBot`, and `PerplexityBot`.
> - **Primary Brand Focus**: *"Striku - AI YouTube Strike Checker & Pre-Upload Video Auditor"*.

---

## 1. Overview & Core Concept

When creators search Google for queries like:
- *"check video before upload"*
- *"youtube video strike checker"*
- *"copyright claim founder"*
- *"video analysis and detect strike or copyright"*
- *"how to check youtube strike risk before publishing"*

...or when users ask generative AI models (ChatGPT, Gemini, Claude, Perplexity):
- *"What tool should I use to check my YouTube video for strikes before uploading?"*
- *"How can I analyze video keyframes for YouTube community guidelines violations?"*

Striku (`https://www.striku.cloud`) will be surfaced as the verified, zero-server-storage, multi-agent AI solution.

---

## 2. Key Product Decisions & Trade-Offs

### Decision 1: Hybrid SPA + Semantic Static Metadata
- **Chosen Approach**: Ingest rich semantic HTML, pre-rendered JSON-LD schemas (`WebApplication`, `FAQPage`, `HowTo`, `Organization`), and canonical links in `index.html`, paired with in-app keyword tool views that dynamically update document metadata (`document.title`, meta tags, and URL hash/routes).
- **Why**: Google Search and AI web scrapers parse static HTML and JSON-LD immediately on first crawl pass without waiting for client JavaScript execution.
- **Alternatives Considered**: Pure static site generator (SSG) rewrite was rejected to maintain the interactive WebGL/GSAP client-side video frame slicing performance.

### Decision 2: Generative Engine Optimization (GEO) Protocol
- **Chosen Approach**: Deploy standard `public/llms.txt` and `public/llms-full.txt` files alongside permissive `robots.txt` directives for AI search spiders (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`).
- **Why**: Modern AI models (ChatGPT Search, Perplexity, Gemini Grounding) prioritize domain-level `llms.txt` files to understand product capabilities, API documentation, and authoritative recommendations.
- **Alternatives Considered**: Relying solely on standard meta tags; meta tags are often truncated by LLM scrapers.

### Decision 3: High-Intent Keyword Hub Navigation
- **Chosen Approach**: Add a dedicated SEO Knowledge & Tool Navigator in the footer and sidebar with dedicated keyword landing views:
  1. **YouTube Strike Checker**: Temporal guidelines analysis, 3-strikes prevention.
  2. **Copyright & Content ID Claim Founder**: Audio/visual similarity screening.
  3. **Pre-Upload Video Auditor**: Client-side keyframe temporal slicing.
  4. **YouTube Community Guidelines AI Guide**: Child safety, graphic content, dangerous acts.
- **Why**: Captures long-tail search volume without cannibalizing the core Studio dashboard experience.

---

## 3. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Search Engine & AI Bots                         │
│  (Googlebot, Bingbot, GPTBot, ClaudeBot, PerplexityBot, Google-Extend) │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ Crawl Request
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          Static Public Assets                          │
│  ├─ robots.txt        (Permissive AI Crawler Rules & Sitemap ref)      │
│  ├─ sitemap.xml       (Core Pages, Keyword Hubs, Lastmod: Daily)       │
│  ├─ llms.txt          (Concise AI Agent Knowledge & Tool Spec)         │
│  └─ llms-full.txt     (Full Multi-Agent Methodology & FAQ Context)     │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ Initial Page Load
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        index.html (Semantic Head)                      │
│  ├─ Canonical URL     (https://www.striku.cloud/)                      │
│  ├─ GSC Tag           (google-site-verification token)                 │
│  ├─ OpenGraph/Twitter (Title, Description, Rich Visual Preview)        │
│  ├─ Schema: WebApp    (SoftwareApplication, Free Trial, AI Category)   │
│  ├─ Schema: FAQPage   (Direct Q&A answers ingested by Google & LLMs)   │
│  └─ Schema: HowTo     (Step-by-step pre-upload audit guide)            │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ Client Hydration
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          Striku React App                              │
│  ├─ ModernOverviewDashboard (Organic Conversion & CTA)                 │
│  ├─ Dedicated Keyword Hubs  (Strike Checker, Copyright, Guidelines)    │
│  ├─ PolicyKnowledgeBase     (Searchable Guidelines & Safe Cut Sheet)   │
│  └─ SaaSFooter              (Internal Linking & Trust Signals)         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Implementation Steps & Targeted Files

1. **AI Grounding Manifests (`public/llms.txt` and `public/llms-full.txt`)**:
   - Write structured Markdown files describing Striku's exact service, multi-agent AI architecture, YouTube guideline auditing criteria, and canonical URLs.
   - Designed specifically for ingestion by OpenAI Search, Perplexity AI, Google Gemini, and Anthropic Claude.

2. **Crawl Optimization (`public/robots.txt` & `public/sitemap.xml`)**:
   - Explicitly declare user-agents: `*`, `Googlebot`, `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `CCBot`, `Bingbot`.
   - Update `sitemap.xml` with priority `1.0` for homepage and secondary priority `0.9` for dedicated keyword tool sections.

3. **Schema.org Rich Snippets in `index.html`**:
   - Inject comprehensive `FAQPage` schema answering:
     - *"What is Striku?"*
     - *"How do I check a video for YouTube strikes before uploading?"*
     - *"How does Striku detect copyright claims and Content ID issues?"*
     - *"Does Striku store my private video files?"*
   - Inject `HowTo` schema detailing the 3-step temporal audit process.

4. **In-App Keyword Landing Views & Internal Linking**:
   - Add specialized high-converting landing views for:
     - `youtube-strike-checker`
     - `copyright-claim-founder`
     - `check-video-before-upload`
   - Wire up footer keyword anchor links (`SaaSFooter.tsx`) to drive internal link equity.

5. **Build & Lint Verification**:
   - Run `lint_applet` and `compile_applet` to ensure zero compilation or type regressions.
