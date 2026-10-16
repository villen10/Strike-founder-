import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Search,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Sparkles,
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
}

export const PolicyKnowledgeBase: React.FC<PolicyKnowledgeBaseProps> = ({
  isOpen = true,
  onClose,
  isEmbedded = false,
  isLight = false,
}) => {
  if (!isEmbedded && !isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeArticleId, setActiveArticleId] = useState<string>(
    YOUTUBE_MASTER_KNOWLEDGE_BASE[0].id
  );

  const categories = [
    { id: 'ALL', label: 'All Policy Rules' },
    { id: 'INGESTION_ARCHITECTURE', label: 'Public vs Unlisted Ingest' },
    { id: 'STRIKES_LAW', label: '3-Strikes Law' },
    { id: 'CHILD_SAFETY', label: 'Child Protection' },
    { id: 'ADVERTISER_SUITABILITY', label: 'Opening 7s & Ads' },
    { id: 'HARMFUL_STUNTS', label: 'Stunts & Hazards' },
    { id: 'VIOLENCE_GRAPHIC', label: 'Violence & Gore' },
    { id: 'EDSA_DEFENSE', label: 'EDSA Legal Appeals' },
    { id: 'REUSED_CONTENT', label: 'Fair Use & Reused' },
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

  const content = (
    <div
      className={`relative flex w-full flex-col overflow-hidden rounded-3xl border transition ${
        isEmbedded
          ? isLight
            ? 'border-slate-100 bg-white text-slate-900 shadow-2xs'
            : 'border-slate-800 bg-slate-900 text-slate-100 shadow-xl'
          : isLight
          ? 'max-h-[92vh] max-w-4xl border-slate-100 bg-white text-slate-900 shadow-2xl'
          : 'max-h-[92vh] max-w-4xl border-slate-800 bg-slate-900 text-slate-100 shadow-2xl'
      }`}
    >
      {/* Top Header */}
      <div
        className={`flex items-center justify-between border-b px-4 sm:px-6 py-4 ${
          isLight ? 'border-slate-200 bg-slate-50/80' : 'border-slate-800 bg-slate-900'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-xs shrink-0 ${
              isLight
                ? 'bg-red-50 text-red-600 ring-1 ring-red-200'
                : 'bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/40'
            }`}
          >
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3
                className={`font-display text-sm sm:text-base font-black ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                YouTube Community Guidelines & Automated Ingestion Encyclopedia
              </h3>
              <span
                className={`font-mono hidden sm:inline-block rounded px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase ${
                  isLight ? 'bg-red-100 text-red-700' : 'bg-rose-500/20 text-rose-300'
                }`}
              >
                MASTER REPOSITORY
              </span>
            </div>
            <p className={`font-sans text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Deep algorithmic policy repository covering Public, Unlisted, Private bots, 3-Strikes, and EDSA defense
            </p>
          </div>
        </div>
        {onClose && !isEmbedded && (
          <button
            onClick={onClose}
            className={`rounded-xl p-1.5 transition ${
              isLight
                ? 'text-slate-500 hover:bg-slate-200 hover:text-slate-800'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div
        className={`border-b p-3 sm:px-6 ${
          isLight ? 'border-slate-200 bg-slate-50/60' : 'border-slate-800 bg-slate-950/60'
        }`}
      >
        <div className="flex flex-col gap-2.5">
          {/* Search Input */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search master policies: unlisted videos, 3 strikes, child safety, opening 7 seconds, EDSA Section 4..."
              className={`w-full rounded-xl border py-2 pl-9 pr-4 font-sans text-xs transition focus:outline-none ${
                isLight
                  ? 'border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-red-500'
                  : 'border-slate-800 bg-slate-900 text-slate-200 placeholder-slate-500 focus:border-rose-500'
              }`}
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 rounded-xl px-2.5 py-1 font-sans text-[11px] font-semibold transition ${
                  selectedCategory === cat.id
                    ? isLight
                      ? 'bg-red-600 text-white shadow-xs font-bold'
                      : 'bg-rose-950 text-rose-200 ring-1 ring-rose-500/40 shadow-sm font-bold'
                    : isLight
                    ? 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Article List & Active Reader */}
      <div className="grid flex-1 grid-cols-1 overflow-hidden md:grid-cols-12">
        {/* Left Column: Article List (5 cols) */}
        <div
          className={`border-r overflow-y-auto p-3 md:col-span-5 ${
            isLight ? 'border-slate-200 bg-slate-50/50' : 'border-slate-800 bg-slate-950/40'
          } ${isEmbedded ? 'max-h-[60vh]' : 'max-h-[35vh] md:max-h-[58vh]'}`}
        >
          <div className="flex flex-col gap-2">
            {filteredArticles.map((article) => {
              const isActive = article.id === activeArticle?.id;
              const isCrit = article.algorithmicSeverity === 'CRITICAL_IMMEDIATE_STRIKE';

              return (
                <button
                  key={article.id}
                  onClick={() => setActiveArticleId(article.id)}
                  className={`flex flex-col rounded-xl p-3 text-left transition ${
                    isActive
                      ? isLight
                        ? 'border border-red-300 bg-red-50/70 text-slate-900 shadow-xs ring-1 ring-red-200'
                        : 'border border-rose-500/40 bg-rose-950/20 text-white shadow-md'
                      : isLight
                      ? 'border border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                      : 'border border-slate-800/80 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-mono text-[9px] font-bold uppercase tracking-wider ${
                        isLight ? 'text-slate-500' : 'text-slate-400'
                      }`}
                    >
                      {article.category}
                    </span>
                    <span
                      className={`flex items-center gap-1 font-mono text-[10px] font-bold ${
                        isCrit
                          ? isLight
                            ? 'text-red-600'
                            : 'text-rose-400'
                          : isLight
                          ? 'text-amber-600'
                          : 'text-amber-400'
                      }`}
                    >
                      {isCrit ? (
                        <ShieldAlert className="h-3 w-3" />
                      ) : (
                        <AlertTriangle className="h-3 w-3" />
                      )}
                      <span>{isCrit ? 'Strike Hazard' : 'Monetization'}</span>
                    </span>
                  </div>

                  <h4
                    className={`mt-1 font-display text-xs font-bold leading-snug ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {article.title}
                  </h4>

                  <p
                    className={`mt-1 line-clamp-2 font-sans text-[11px] ${
                      isLight ? 'text-slate-600' : 'text-slate-400'
                    }`}
                  >
                    {article.shortSummary}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Regulatory Reader (7 cols) */}
        <div
          className={`flex-1 overflow-y-auto p-5 md:col-span-7 ${
            isEmbedded ? 'max-h-[60vh]' : 'max-h-[58vh]'
          }`}
        >
          {activeArticle ? (
            <div className="flex flex-col gap-5 text-xs">
              {/* Header Box */}
              <div className={`border-b pb-3.5 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                <div
                  className={`flex items-center gap-2 ${
                    isLight ? 'text-red-600' : 'text-rose-400'
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
                    {activeArticle.category} RULEBOOK
                  </span>
                </div>
                <h3
                  className={`mt-1 font-display text-base sm:text-lg font-black leading-snug ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  {activeArticle.title}
                </h3>
                <p
                  className={`mt-1.5 font-sans text-xs sm:text-sm leading-relaxed ${
                    isLight ? 'text-slate-700' : 'text-slate-300'
                  }`}
                >
                  {activeArticle.shortSummary}
                </p>
              </div>

              {/* Public vs Unlisted vs Private Behavior Highlight */}
              <div
                className={`rounded-2xl border p-4 ${
                  isLight
                    ? 'border-amber-200 bg-amber-50/70 text-amber-950'
                    : 'border-amber-500/30 bg-amber-950/20 text-amber-200'
                }`}
              >
                <div className="flex items-center gap-2 font-display text-xs font-bold">
                  <ShieldAlert className="h-4 w-4 text-amber-600" />
                  <span>Public vs Unlisted vs Private Algorithmic Behavior:</span>
                </div>
                <p className="mt-1.5 font-sans text-xs leading-relaxed">
                  {activeArticle.publicVsUnlistedVsPrivateBehavior}
                </p>
              </div>

              {/* Detection Mechanisms */}
              <div>
                <h4
                  className={`font-mono font-bold uppercase tracking-wider text-[10px] mb-2 ${
                    isLight ? 'text-slate-600' : 'text-slate-300'
                  }`}
                >
                  How YouTube Bots Detect This:
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {activeArticle.detectionMechanisms.map((mech, i) => (
                    <div
                      key={i}
                      className={`rounded-xl border p-2.5 text-xs font-sans leading-relaxed ${
                        isLight
                          ? 'border-slate-200 bg-slate-50 text-slate-800'
                          : 'border-slate-800/80 bg-slate-950/60 text-slate-300'
                      }`}
                    >
                      • {mech}
                    </div>
                  ))}
                </div>
              </div>

              {/* Regulatory Clauses */}
              <div>
                <h4
                  className={`font-mono font-bold uppercase tracking-wider text-[10px] mb-2.5 ${
                    isLight ? 'text-slate-600' : 'text-slate-300'
                  }`}
                >
                  Official Regulatory Clauses:
                </h4>
                <ul className="flex flex-col gap-2">
                  {activeArticle.fullPolicyRules.map((rule, idx) => (
                    <li
                      key={idx}
                      className={`flex items-start gap-3 rounded-xl border p-3 leading-relaxed transition ${
                        isLight
                          ? 'border-slate-200 bg-white text-slate-800'
                          : 'border-slate-800/80 bg-slate-950/60 text-slate-300'
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg font-mono text-[10px] font-bold ${
                          isLight
                            ? 'bg-red-100 text-red-700'
                            : 'bg-slate-800 text-rose-400'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="font-serif-legal text-xs sm:text-sm leading-relaxed">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Appeal Strategy Blueprint */}
              <div
                className={`rounded-2xl border p-4 ${
                  isLight
                    ? 'border-indigo-200 bg-indigo-50/70 text-slate-800'
                    : 'border-indigo-500/30 bg-indigo-950/20 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between font-display font-bold text-xs">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2
                      className={`h-4 w-4 ${isLight ? 'text-indigo-700' : 'text-indigo-400'}`}
                    />
                    <span>EDSA Legal Appeal Blueprint:</span>
                  </div>
                  <span className="font-mono text-[10px] text-indigo-600">
                    {activeArticle.appealBlueprint.edsaSection}
                  </span>
                </div>
                <p className="mt-1.5 font-sans text-xs leading-relaxed">
                  <strong>Key Legal Defense:</strong> {activeArticle.appealBlueprint.keyArgument}
                </p>
                <div
                  className={`mt-2 p-2.5 rounded-xl font-serif-legal text-xs italic ${
                    isLight
                      ? 'bg-white border border-indigo-100 text-slate-800'
                      : 'bg-slate-900 border border-slate-800 text-slate-200'
                  }`}
                >
                  "{activeArticle.appealBlueprint.sampleStudioPrompt}"
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center p-6 font-sans text-slate-500">
              No matching policy article found
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        className={`flex items-center justify-between border-t px-4 sm:px-6 py-3 ${
          isLight ? 'border-slate-200 bg-slate-50/80' : 'border-slate-800 bg-slate-950/70'
        }`}
      >
        <span
          className={`font-sans text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-500'}`}
        >
          YouTube Algorithmic Moderation Knowledge Base · Integrated with Strike Founder Engine
        </span>
        {onClose && !isEmbedded && (
          <button
            onClick={onClose}
            className={`rounded-xl px-4 py-1.5 font-sans text-xs font-semibold transition ${
              isLight
                ? 'border border-slate-200 bg-white text-slate-800 hover:bg-slate-100'
                : 'border border-slate-800 bg-slate-800 text-white hover:bg-slate-700'
            }`}
          >
            Close Guide
          </button>
        )}
      </div>
    </div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-5 backdrop-blur-md">
      {content}
    </div>
  );
};
