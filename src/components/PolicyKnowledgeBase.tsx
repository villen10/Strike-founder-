import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Search,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  FileVideo,
  Sparkles,
  Lock,
  ArrowRight,
  Shield,
  Lightbulb,
} from 'lucide-react';
import {
  YOUTUBE_MASTER_KNOWLEDGE_BASE,
  MasterPolicyArticle,
} from '../services/youtubeMasterKnowledgeBase';

interface PolicyKnowledgeBaseProps {
  isOpen?: boolean;
  onClose?: () => void;
  isEmbedded?: boolean;
  isLight?: boolean;
  onNavigateScanner?: () => void;
}

export const PolicyKnowledgeBase: React.FC<PolicyKnowledgeBaseProps> = ({
  isOpen = true,
  onClose,
  isEmbedded = false,
  isLight = false,
  onNavigateScanner,
}) => {
  if (!isEmbedded && !isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeArticleId, setActiveArticleId] = useState<string>(
    YOUTUBE_MASTER_KNOWLEDGE_BASE[0].id
  );

  const categories = [
    { id: 'ALL', label: 'All Policies' },
    { id: 'REUSED_CONTENT', label: 'Fair Use & Copyright' },
    { id: 'ADVERTISER_SUITABILITY', label: 'Monetization & Yellow Dollar' },
    { id: 'STRIKES_LAW', label: '3-Strikes System' },
    { id: 'INGESTION_ARCHITECTURE', label: 'Visibility Checks' },
    { id: 'CHILD_SAFETY', label: 'Child Protection' },
    { id: 'HARMFUL_STUNTS', label: 'Harmful Stunts' },
    { id: 'VIOLENCE_GRAPHIC', label: 'Violence & Gore' },
    { id: 'EDSA_DEFENSE', label: 'EDSA Appeals' },
  ];

  const filteredArticles = YOUTUBE_MASTER_KNOWLEDGE_BASE.filter((article) => {
    const matchesCategory =
      selectedCategory === 'ALL' || article.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      article.title.toLowerCase().includes(query) ||
      article.shortSummary.toLowerCase().includes(query) ||
      article.publicVsUnlistedVsPrivateBehavior.toLowerCase().includes(query) ||
      article.fullPolicyRules.some((r) => r.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  const activeArticle =
    YOUTUBE_MASTER_KNOWLEDGE_BASE.find((a) => a.id === activeArticleId) ||
    filteredArticles[0] ||
    YOUTUBE_MASTER_KNOWLEDGE_BASE[0];

  return (
    <div
      className={`relative flex w-full flex-col overflow-hidden rounded-3xl border transition shadow-2xl ${
        isLight
          ? 'border-slate-200 bg-white text-slate-900'
          : 'border-slate-800 bg-[#0b0e1f] text-slate-100'
      }`}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 px-5 sm:px-8 py-5 gap-4 bg-[#0d122b]/60">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 shrink-0">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base sm:text-lg font-black text-white">
                YouTube Community Guidelines &amp; Policy Guide
              </h2>
              <span className="font-mono hidden md:inline-block rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                2026 OFFICIAL
              </span>
            </div>
            <p className="font-sans text-xs text-slate-400 mt-0.5">
              Clear rules, strike prevention guidelines, and creator compliance standards.
            </p>
          </div>
        </div>

        {onClose && !isEmbedded && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer self-start sm:self-auto"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Bar & Clean Category Pills */}
      <div className="border-b border-slate-800/80 p-4 sm:px-8 bg-[#090d1a]/80 flex flex-col gap-3">
        {/* Search Input */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rules: copyright music, reused content, unlisted videos, yellow dollar, 3 strikes..."
            className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 py-2.5 pl-10 pr-4 font-sans text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 transition"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 rounded-xl px-3 py-1.5 font-sans text-xs font-semibold transition cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Split: Article List & Active Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        {/* Left Column: List of Policy Cards (5 cols) */}
        <div className="lg:col-span-5 border-r border-slate-800/80 p-3 sm:p-4 overflow-y-auto max-h-[620px] flex flex-col gap-2.5 bg-[#080c18]/60">
          {filteredArticles.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No matching policy found. Try another search term.
            </div>
          ) : (
            filteredArticles.map((article) => {
              const isActive = article.id === activeArticle?.id;
              const isStrike =
                article.algorithmicSeverity === 'CRITICAL_IMMEDIATE_STRIKE';

              return (
                <button
                  key={article.id}
                  type="button"
                  onClick={() => setActiveArticleId(article.id)}
                  className={`flex flex-col rounded-2xl p-3.5 text-left transition cursor-pointer border ${
                    isActive
                      ? 'border-blue-500/60 bg-blue-500/10 text-white shadow-md'
                      : 'border-slate-800/80 bg-[#0e1326]/60 text-slate-300 hover:border-slate-700 hover:bg-[#0e1326]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                      {article.category}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isStrike
                          ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {isStrike ? (
                        <ShieldAlert className="h-3 w-3" />
                      ) : (
                        <AlertTriangle className="h-3 w-3" />
                      )}
                      <span>{isStrike ? 'Strike Risk' : 'Ad Risk'}</span>
                    </span>
                  </div>

                  <h3 className="font-display text-xs font-bold leading-snug text-white">
                    {article.title}
                  </h3>

                  <p className="mt-1 line-clamp-2 font-sans text-[11px] text-slate-400 leading-relaxed">
                    {article.shortSummary}
                  </p>
                </button>
              );
            })
          )}
        </div>

        {/* Right Column: Deep Regulatory Reader (7 cols) */}
        <div className="lg:col-span-7 p-5 sm:p-8 overflow-y-auto max-h-[620px] bg-[#0b0e1f] flex flex-col gap-5">
          {activeArticle && (
            <>
              {/* Header Details */}
              <div className="border-b border-slate-800 pb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono text-[10px] font-bold uppercase mb-2">
                  <Shield className="h-3 w-3" />
                  <span>{activeArticle.category} POLICY</span>
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-black text-white leading-tight">
                  {activeArticle.title}
                </h2>
                <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed mt-2">
                  {activeArticle.shortSummary}
                </p>
              </div>

              {/* Ingestion & Algorithmic Behavior Box */}
              <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-4">
                <div className="flex items-center gap-2 font-display text-xs font-bold text-indigo-300 mb-1.5">
                  <Lightbulb className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>How YouTube Ingestion Handles This:</span>
                </div>
                <p className="font-sans text-xs text-slate-300 leading-relaxed">
                  {activeArticle.publicVsUnlistedVsPrivateBehavior}
                </p>
              </div>

              {/* Bot Detection Mechanisms */}
              <div className="flex flex-col gap-2">
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  How Violations Are Flagged:
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {activeArticle.detectionMechanisms.map((mech, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 text-xs font-sans text-slate-300"
                    >
                      <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                      <span>{mech}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Official Rules & Clauses */}
              <div className="flex flex-col gap-2">
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Creator Compliance Guidelines:
                </h4>
                <div className="flex flex-col gap-2">
                  {activeArticle.fullPolicyRules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 text-xs font-sans text-slate-300 leading-relaxed flex items-start gap-2.5"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-600/20 text-blue-400 font-mono text-[10px] font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Quick Action: Check Video */}
              <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Scanned locally before upload. Zero server video retention.</span>
                </span>

                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateScanner) {
                      onNavigateScanner();
                    } else if (onClose) {
                      onClose();
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <FileVideo className="h-3.5 w-3.5" />
                  <span>Check Video in Scanner →</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
