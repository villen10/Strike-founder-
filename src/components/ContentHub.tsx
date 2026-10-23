import React, { useState } from 'react';
import {
  FileText,
  Search,
  ShieldCheck,
  Youtube,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Share2,
  Bookmark,
  ArrowLeft,
  Zap,
} from 'lucide-react';
import { ReadingProgressBar } from './ReadingProgressBar';

interface ContentHubProps {
  isLight: boolean;
  onNavigateScanner: () => void;
  onNavigateKnowledge: () => void;
}

interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  lastUpdated: string;
  summary: string;
  content: {
    heading: string;
    paragraphs: string[];
    subheading?: string;
    bulletPoints?: string[];
  }[];
  seoKeywords: string[];
}

const ARTICLES: Article[] = [
  {
    id: 'check-video-before-upload-youtube',
    title: 'How to Check Video Before Upload to YouTube and Prevent Strikes (2026 Guide)',
    category: 'Pre-Upload Audit',
    readTime: '6 min read',
    lastUpdated: 'October 2026',
    summary: 'Discover the exact step-by-step workflow to pre-screen your video footage for community guidelines violations, copyright claims, and monetization yellow-dollar risks before hitting publish on YouTube.',
    seoKeywords: [
      'check video before upload',
      'youtube video strike checker',
      'striku video analysis',
      'pre upload compliance check',
    ],
    content: [
      {
        heading: 'Why Pre-Upload Video Auditing is Crucial for Creators',
        paragraphs: [
          'Uploading a video to YouTube without a pre-screening check is one of the riskiest moves for modern content creators. When YouTube Content ID or automated community guideline filters flag a video after publishing, your channel can suffer immediate reach suppression, yellow monetization icons (limited ads), or a formal copyright strike.',
          'With Striku (strikucloud@gmail.com), creators can run an instant client-side frame-by-frame audit before uploading. This guarantees zero channel risk and gives you exact second-by-second timestamps of any risky frames.',
        ],
        subheading: 'Top 3 Risks Avoided Before Publishing:',
        bulletPoints: [
          'Unlicensed audio snippets triggering automated Content ID claims.',
          'Accidental exposure of minor safety hazards or dangerous stunts.',
          'Graphic violence or intense action sequences flagged by AI visual filters.',
        ],
      },
      {
        heading: 'Step-by-Step Workflow Using Striku',
        paragraphs: [
          '1. Drop your final export (MP4, MOV, or WebM) into the Striku Video Scanner at striku.cloud.\n2. Allow the 3-Pass Multi-Agent Neural Consensus Engine to analyze your temporal frames locally in your browser memory.\n3. Review exact risk timestamps and export the CapCut / Premiere safe-cut guide.',
          'By fixing flagged segments before uploading, you maintain 100% YouTube monetization status and safeguard your upload streak.',
        ],
      },
    ],
  },
  {
    id: 'youtube-copyright-claim-founder-guide',
    title: 'YouTube Copyright Claim Founder: How to Detect and Remove Content ID Risks',
    category: 'Copyright Protection',
    readTime: '5 min read',
    lastUpdated: 'October 2026',
    summary: 'Learn how YouTube Content ID audio and video matching works, how to spot copyrighted music samples before publishing, and how to use safe-cut timecodes to keep 100% ad revenue.',
    seoKeywords: [
      'copyright claim founder',
      'youtube copyright check before upload',
      'content id pre screen',
      'avoid copyright strike youtube',
    ],
    content: [
      {
        heading: 'Understanding YouTube Content ID in 2026',
        paragraphs: [
          'Content ID is an automated digital fingerprinting system used by copyright owners to identify their content on YouTube. When a match is found, a copyright claim can transfer ad revenue to the claimant or block your video entirely.',
          'Many creators discover claims hours after publishing, resulting in lost views and monetization freezes. Pre-screening with Striku ensures you catch unlicensed background music and video loops beforehand.',
        ],
        subheading: 'How to Sanitize Copyrighted Audio:',
        bulletPoints: [
          'Mute background audio segments identified by the compliance scanner.',
          'Apply royalty-free alternative audio tracks from the YouTube Audio Library.',
          'Use precise millisecond jump-cuts for short visual clips.',
        ],
      },
    ],
  },
  {
    id: 'capcut-safe-cut-timecodes-tutorial',
    title: 'CapCut Safe-Cut Timecodes: How to Fix Flagged Video Segments Without Re-Rendering',
    category: 'Editing Workflows',
    readTime: '4 min read',
    lastUpdated: 'October 2026',
    summary: 'Master the art of second-by-second timeline trimming. Use Striku safe-cut export guides to edit CapCut, Adobe Premiere, and DaVinci Resolve projects efficiently.',
    seoKeywords: [
      'capcut safe cut timecodes',
      'video analysis and detect strike',
      'fix youtube strike risk',
      'zero video retention privacy',
    ],
    content: [
      {
        heading: 'Precision Editing with Millisecond Timecodes',
        paragraphs: [
          'When Striku flags a specific visual hazard in your video (such as a 3-second action sequence or prop), you do not need to re-render your entire 20-minute video or compromise your creative vision.',
          'Instead, copy the exact start and end timecodes provided in the Striku audit report, open your editor (CapCut or Premiere), and apply a quick split cut or Gaussian blur.',
        ],
      },
    ],
  },
];

export const ContentHub: React.FC<ContentHubProps> = ({
  isLight,
  onNavigateScanner,
  onNavigateKnowledge,
}) => {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Pre-Upload Audit', 'Copyright Protection', 'Editing Workflows'];

  const filteredArticles = ARTICLES.filter((article) => {
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.seoKeywords.some((kw) => kw.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const activeArticle = ARTICLES.find((a) => a.id === selectedArticleId);

  const renderLinkedParagraph = (text: string) => {
    return (
      <span className={`text-sm sm:text-base leading-relaxed whitespace-pre-line ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
        {text.split(/(copyright strike|YouTube monetization|check video before upload|Content ID)/gi).map((part, i) => {
          const lower = part.toLowerCase();
          if (lower === 'copyright strike' || lower === 'content id') {
            return (
              <button
                key={i}
                onClick={onNavigateKnowledge}
                className="text-red-600 dark:text-red-400 font-bold underline decoration-dotted underline-offset-4 hover:text-red-500 cursor-pointer inline-flex items-center gap-0.5 mx-0.5"
                title="View Knowledge Base Article"
              >
                {part}
              </button>
            );
          }
          if (lower === 'youtube monetization' || lower === 'check video before upload') {
            return (
              <button
                key={i}
                onClick={onNavigateScanner}
                className="text-red-600 dark:text-red-400 font-bold underline decoration-dotted underline-offset-4 hover:text-red-500 cursor-pointer inline-flex items-center gap-0.5 mx-0.5"
                title="Open Scanner Tool"
              >
                {part}
              </button>
            );
          }
          return part;
        })}
      </span>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {activeArticle ? (
        /* Article View */
        <div className="flex flex-col gap-6">
          <ReadingProgressBar />
          <button
            onClick={() => setSelectedArticleId(null)}
            className={`inline-flex items-center gap-2 self-start rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer border ${
              isLight
                ? 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                : 'border-slate-800 bg-slate-900 hover:bg-slate-850 text-slate-300'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Guides Hub</span>
          </button>

          <article
            className={`rounded-3xl border p-6 sm:p-10 shadow-lg ${
              isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900'
            }`}
          >
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider">
                {activeArticle.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                <Clock className="h-3.5 w-3.5" />
                {activeArticle.readTime}
              </span>
              <span className="text-xs text-slate-500 font-mono">· Updated {activeArticle.lastUpdated}</span>
            </div>

            <h1 className={`font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-4 ${isLight ? 'text-slate-950' : 'text-white'}`}>
              {activeArticle.title}
            </h1>

            <p className={`text-base sm:text-lg leading-relaxed mb-8 font-sans ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              {activeArticle.summary}
            </p>

            <div className="flex flex-col gap-8 border-t border-slate-200 dark:border-slate-800 pt-8">
              {activeArticle.content.map((section, idx) => (
                <div key={idx} className="flex flex-col gap-3">
                  <h3 className={`font-display text-lg sm:text-xl font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                    {section.heading}
                  </h3>
                  {section.paragraphs.map((p, pIdx) => (
                    <div key={pIdx} className="my-1">
                      {renderLinkedParagraph(p)}
                    </div>
                  ))}
                  {section.subheading && (
                    <h4 className={`font-mono text-xs uppercase tracking-wider font-bold mt-2 text-red-600 dark:text-red-400`}>
                      {section.subheading}
                    </h4>
                  )}
                  {section.bulletPoints && (
                    <ul className="flex flex-col gap-2 mt-2">
                      {section.bulletPoints.map((bp, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-1" />
                          <span>{bp}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Box inside Article */}
            <div className="mt-12 rounded-2xl bg-gradient-to-r from-red-600/10 via-rose-600/10 to-amber-600/10 border border-red-500/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-col gap-1 text-center sm:text-left">
                <span className="font-mono text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                  Ready to audit your next video?
                </span>
                <h4 className={`font-display text-base sm:text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Check your video for strikes &amp; copyright claims in seconds
                </h4>
              </div>
              <button
                onClick={onNavigateScanner}
                className="rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-sans text-xs font-bold px-5 py-2.5 shadow-lg shadow-red-900/40 transition cursor-pointer shrink-0"
              >
                Scan Video Now
              </button>
            </div>
          </article>
        </div>
      ) : (
        /* Guides & Articles Directory View */
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-red-500/10 px-3 py-1 font-mono text-xs font-bold text-red-600 dark:text-red-400 border border-red-500/20">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Creator Knowledge &amp; SEO Guides Hub</span>
            </div>
            <h1 className={`font-display text-2xl sm:text-4xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
              Master YouTube Compliance &amp; Strike Prevention
            </h1>
            <p className={`text-sm sm:text-base max-w-2xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Expert guides, pre-upload workflows, and copyright defense tutorials designed to keep your YouTube channel 100% safe and fully monetized.
            </p>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search guides (e.g. check video before upload, copyright)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full rounded-xl border pl-10 pr-4 py-2 text-xs sm:text-sm font-sans transition outline-none ${
                  isLight
                    ? 'border-slate-200 bg-white text-slate-900 focus:border-red-500 shadow-xs'
                    : 'border-slate-800 bg-slate-900 text-slate-100 focus:border-red-500 shadow-sm'
                }`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-red-600 text-white shadow-md shadow-red-900/30'
                      : isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => setSelectedArticleId(article.id)}
                className={`group rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-sm hover:shadow-xl ${
                  isLight
                    ? 'border-slate-200 bg-white hover:border-red-300'
                    : 'border-slate-800 bg-slate-900/80 hover:border-red-900/50'
                }`}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-red-500/10 text-red-600 dark:text-red-400 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className={`font-display text-base sm:text-lg font-bold group-hover:text-red-600 dark:group-hover:text-red-400 transition leading-snug ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                    {article.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3">
                    {article.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                    Read Guide
                    <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">{article.lastUpdated}</span>
                </div>
              </div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-16 text-slate-500 font-mono text-xs">
              No matching guides found. Try searching for "check video", "copyright", or "strike".
            </div>
          )}
        </div>
      )}
    </div>
  );
};
