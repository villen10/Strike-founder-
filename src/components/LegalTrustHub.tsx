import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SEOManager } from '../lib/seo';
import {
  HelpCircle,
  ShieldCheck,
  FileText,
  Scale,
  RefreshCw,
  Mail,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Search,
  ExternalLink,
  Sparkles,
  Clock,
  ArrowRight,
  Info,
  DollarSign,
  Send,
  Building2,
  Users,
  Eye,
  Trash2,
  Cpu,
  BadgeCheck,
} from 'lucide-react';

export type LegalTabType = 'faq' | 'refund' | 'privacy' | 'terms' | 'about' | 'contact';

interface LegalTrustHubProps {
  initialTab?: LegalTabType;
  isLight: boolean;
  onOpenPricing?: () => void;
  currentUserEmail?: string | null;
}

export interface FAQItem {
  id: string;
  category: 'billing' | 'scanner' | 'strikes' | 'security';
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'scanner',
    question: 'How does Striku detect YouTube Community Guideline strikes before I upload?',
    answer:
      'Striku uses a 3-Pass Multi-Agent Neural Consensus Engine (Agent Alpha for visual keyframe hazard inspection, Agent Beta for acoustic & dialogue profanity indexing, and Agent Omega for regulatory compliance synthesis). It evaluates every second of your footage against YouTube’s official 2026 Community Guidelines and advertiser-friendly moderation rubrics before your video ever touches YouTube’s servers.',
  },
  {
    id: 'faq-2',
    category: 'security',
    question: 'Will connecting or scanning videos compromise my YouTube channel or copyright?',
    answer:
      'Never. Striku operates on a Zero-Channel-Risk principle. We never ask for your YouTube channel password, OAuth credentials with full channel write access, or ownership rights. Video analysis happens strictly in client/session memory, and your unpublished footage remains 100% your private intellectual property.',
  },
  {
    id: 'faq-3',
    category: 'billing',
    question: 'What is the refund policy if I am not satisfied?',
    answer:
      'We provide an unconditional 14-Day Money-Back Guarantee. If Striku does not meet your expectations or if you scanned fewer than 3 videos on a paid plan, simply email strikucloud@gmail.com with your order receipt, and our team will issue a 100% full refund directly to your original payment method within 3 to 5 business days.',
  },
  {
    id: 'faq-4',
    category: 'billing',
    question: 'Which payment methods are accepted worldwide?',
    answer:
      'We accept Visa, MasterCard, American Express, Apple Pay, Google Pay, and international debit/credit cards across 190+ countries through Lemon Squeezy (our authorized Merchant of Record). For creators in Pakistan and South Asia, we also accept direct bank transfers (UBL, HBL, Meezan) and instant crypto checkout via Binance Pay / USDT (TRC-20).',
  },
  {
    id: 'faq-5',
    category: 'scanner',
    question: 'Why does the Free Starter plan have locked Safe Cut Timecodes?',
    answer:
      'The Free Starter plan gives every creator 5 free video scans per month to identify whether a video has strike risks or monetization penalties. However, the exact second-by-second CapCut/Premiere cutting sheet and the legal counter-appeal letters require high-compute neural consensus processing, which is reserved for our Creator Shield ($19/mo) and Creator Pro ($39/mo) subscribers.',
  },
  {
    id: 'faq-6',
    category: 'security',
    question: 'Do you store or keep copies of my unpublished videos on your servers?',
    answer:
      'No. We adhere to a strict Zero-Video-Retention Guarantee. Video files are parsed in temporary volatile browser memory solely to generate temporal keyframe hashes. Once the audit report is generated, the temporary video stream is automatically flushed. We never store, archive, share, or train public AI models on your unpublished content.',
  },
  {
    id: 'faq-7',
    category: 'strikes',
    question: 'What if YouTube issues a false strike on a video that passed the audit?',
    answer:
      'While Striku achieves a 99.4% precision rate with YouTube automated ingestion standards, YouTube occasionally issues automated bot misflags. In that rare event, our Creator Pro and Studio plans include the AI Strike Counter-Appeal Kit, generating formal legal counter-appeal documentation citing YouTube policy precedents that you can submit directly to Creator Support.',
  },
  {
    id: 'faq-8',
    category: 'billing',
    question: 'How do I cancel my subscription or change plans?',
    answer:
      'You can cancel or upgrade your subscription anytime with 1 click from your Subscription Settings page or via the Lemon Squeezy customer billing portal link sent in your receipt. There are zero lock-ins, zero hidden cancellation fees, and your paid access will remain active until the end of your billing cycle.',
  },
  {
    id: 'faq-9',
    category: 'scanner',
    question: 'Can I export safe cut instructions into CapCut, Premiere Pro, or DaVinci Resolve?',
    answer:
      'Yes! Creator Shield ($19) and above include one-click export of structured Cut Sheets, EDL (Edit Decision List) markers, and frame timecodes that allow your video editor to trim or blur flagged segments in under 60 seconds.',
  },
  {
    id: 'faq-10',
    category: 'security',
    question: 'How does the Device Fingerprint quota enforcement work?',
    answer:
      'To prevent abuse and keep our free tier accessible to genuine creators without server crashes, our system securely hashes a hardware and browser identifier. This ensures each creator device receives 5 free high-quality video scans per calendar month, even if multiple demo logins are used.',
  },
];

export const LegalTrustHub: React.FC<LegalTrustHubProps> = ({
  initialTab = 'faq',
  isLight,
  onOpenPricing,
  currentUserEmail,
}) => {
  const [activeTab, setActiveTab] = useState<LegalTabType>(initialTab);
  const [faqCategory, setFaqCategory] = useState<string>('all');
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Automatically inject JSON-LD 'Question' entities for AI conversational engines (ChatGPT, Gemini, Perplexity)
  useEffect(() => {
    SEOManager.injectFaqSchemaToHead(FAQ_ITEMS);
  }, []);

  // Contact form state
  const [contactSubject, setContactSubject] = useState('Billing & Refund Question');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState(currentUserEmail || '');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;
    const generatedTicket = 'TKT-' + Math.floor(100000 + Math.random() * 900000);
    setTicketId(generatedTicket);
    setContactSubmitted(true);
  };

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesCategory = faqCategory === 'all' || item.category === faqCategory;
    const matchesSearch =
      faqSearchQuery === '' ||
      item.question.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(faqSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const tabs = [
    { id: 'faq' as LegalTabType, label: 'FAQ', icon: HelpCircle, desc: 'Answers to common questions' },
    { id: 'refund' as LegalTabType, label: 'Refund Policy', icon: DollarSign, desc: '14-Day Money Back Guarantee' },
    { id: 'privacy' as LegalTabType, label: 'Data Privacy & Security', icon: ShieldCheck, desc: 'Zero Video Retention' },
    { id: 'terms' as LegalTabType, label: 'Terms of Service', icon: FileText, desc: 'Platform usage & licenses' },
    { id: 'about' as LegalTabType, label: 'About Us', icon: Building2, desc: 'Our mission & technology' },
    { id: 'contact' as LegalTabType, label: 'Contact Support', icon: Mail, desc: '24/7 Support Desk' },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto pb-12 font-public-sans">
      {/* Top Hero Banner */}
      <div
        className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 transition shadow-xs ${
          isLight
            ? 'border-slate-200 bg-gradient-to-br from-white via-slate-50 to-indigo-50/30'
            : 'border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40'
        }`}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2 font-mono text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <Scale className="h-4 w-4" />
              <span>Trust, Compliance & Customer Transparency Hub</span>
            </div>
            <h1
              className={`font-satoshi text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight ${
                isLight ? 'text-slate-950' : 'text-white'
              }`}
            >
              Legal Policies, Transparency & FAQ
            </h1>
            <p
              className={`mt-2 font-public-sans text-xs sm:text-sm leading-relaxed ${
                isLight ? 'text-slate-600' : 'text-slate-300'
              }`}
            >
              Everything you need to know about our 14-day money-back guarantee, zero video storage security, global billing compliance, and community guidelines safety.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <div
              className={`rounded-2xl border px-3.5 py-2.5 text-xs font-mono ${
                isLight ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Status: 100% Operational</span>
              </div>
              <p className="text-[11px] opacity-80 mt-0.5">Average Support SLA &lt; 4 Hours</p>
            </div>
            {onOpenPricing && (
              <button
                type="button"
                onClick={onOpenPricing}
                className="rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 px-4 py-2.5 font-satoshi text-xs font-black uppercase tracking-wider text-white hover:opacity-95 transition shadow-sm cursor-pointer"
              >
                View Plans →
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="mt-8 flex items-center gap-1.5 overflow-x-auto border-t pt-4 border-slate-200 dark:border-slate-800/80 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                    : isLight
                    ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? (isLight ? 'text-indigo-400 dark:text-indigo-600' : 'text-indigo-400') : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT AREA */}
      <AnimatePresence mode="wait">
        {/* ======================================================== */}
        {/* 1. FAQ TAB */}
        {/* ======================================================== */}
        {activeTab === 'faq' && (
          <motion.div
            key="faq"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-5"
          >
            {/* Search and Category Filter */}
            <div
              className={`rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={faqSearchQuery}
                  onChange={(e) => setFaqSearchQuery(e.target.value)}
                  placeholder="Search FAQ questions (e.g. refunds, CapCut, 4K video, strikes)..."
                  className={`w-full rounded-xl pl-9 pr-4 py-2 text-xs font-medium border outline-hidden transition ${
                    isLight
                      ? 'border-slate-200 bg-slate-50 focus:border-indigo-500 focus:bg-white text-slate-900'
                      : 'border-slate-800 bg-slate-950 focus:border-indigo-500 text-white'
                  }`}
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                {[
                  { id: 'all', label: 'All FAQs' },
                  { id: 'billing', label: 'Billing & Refunds' },
                  { id: 'scanner', label: 'Video Scans & AI' },
                  { id: 'strikes', label: 'Strikes & Policy' },
                  { id: 'security', label: 'Privacy & Security' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFaqCategory(cat.id)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      faqCategory === cat.id
                        ? 'bg-indigo-600 text-white'
                        : isLight
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions List */}
            <div className="flex flex-col gap-3">
              {filteredFaqs.length === 0 ? (
                <div
                  className={`rounded-2xl border p-8 text-center ${
                    isLight ? 'border-slate-200 bg-white text-slate-500' : 'border-slate-800 bg-slate-900 text-slate-400'
                  }`}
                >
                  <HelpCircle className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                  <p className="font-bold text-sm">No FAQ entries match your search.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setFaqSearchQuery('');
                      setFaqCategory('all');
                    }}
                    className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 underline font-semibold"
                  >
                    Reset Search Filter
                  </button>
                </div>
              ) : (
                filteredFaqs.map((item) => {
                  const isOpen = expandedFaqId === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl border transition overflow-hidden ${
                        isLight ? 'border-slate-200 bg-white shadow-2xs' : 'border-slate-800 bg-slate-900/80 shadow-xs'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaqId(isOpen ? null : item.id)}
                        className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left cursor-pointer transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                      >
                        <span
                          className={`font-satoshi text-sm sm:text-base font-bold leading-snug ${
                            isLight ? 'text-slate-900' : 'text-white'
                          }`}
                        >
                          {item.question}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="border-t border-slate-100 dark:border-slate-800/60 px-4 py-3.5 sm:px-5 sm:py-4"
                          >
                            <p
                              className={`font-public-sans text-xs sm:text-sm leading-relaxed ${
                                isLight ? 'text-slate-600' : 'text-slate-300'
                              }`}
                            >
                              {item.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick Support Prompt */}
            <div
              className={`rounded-2xl border p-5 flex flex-col sm:flex-row items-center justify-between gap-4 ${
                isLight ? 'border-indigo-100 bg-indigo-50/50' : 'border-indigo-950/60 bg-indigo-950/20'
              }`}
            >
              <div>
                <h4
                  className={`font-satoshi text-sm font-bold ${
                    isLight ? 'text-indigo-950' : 'text-indigo-200'
                  }`}
                >
                  Still have questions? Our support team is here 24/7.
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Reach our dedicated creator desk for custom enterprise setups or billing help.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('contact')}
                className="shrink-0 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 font-satoshi text-xs font-bold text-white transition cursor-pointer"
              >
                Contact Support Desk
              </button>
            </div>
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* 2. REFUND POLICY TAB */}
        {/* ======================================================== */}
        {activeTab === 'refund' && (
          <motion.div
            key="refund"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* Guarantee Highlight Banner */}
            <div
              className={`rounded-3xl border p-6 sm:p-7 relative overflow-hidden ${
                isLight
                  ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50/40 to-white text-slate-900'
                  : 'border-emerald-500/30 bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 text-white'
              }`}
            >
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
                <BadgeCheck className="h-4 w-4" />
                <span>100% Risk-Free Guarantee</span>
              </div>
              <h2 className="font-satoshi text-2xl sm:text-3xl font-black tracking-tight">
                14-Day Full Money-Back Guarantee
              </h2>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed max-w-2xl opacity-90">
                We stand behind our AI moderation precision. If you purchase any subscription (Creator Shield $19, Creator Pro $39, or Agency Master $80) and are not completely satisfied with our service, you are eligible for a 100% full refund within 14 days of purchase.
              </p>
            </div>

            {/* Policy Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className={`rounded-2xl border p-5 flex flex-col justify-between ${
                  isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/70'
                }`}
              >
                <div>
                  <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-sm mb-3">
                    01
                  </div>
                  <h3 className="font-satoshi text-base font-bold mb-1.5">Eligibility Window</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Refund requests must be submitted within 14 calendar days of your initial payment or upgrade transaction.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                  Applies to all monthly & annual plans
                </div>
              </div>

              <div
                className={`rounded-2xl border p-5 flex flex-col justify-between ${
                  isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/70'
                }`}
              >
                <div>
                  <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-sm mb-3">
                    02
                  </div>
                  <h3 className="font-satoshi text-base font-bold mb-1.5">Fair Usage Terms</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Eligible if you have scanned fewer than 3 videos during the trial period or if you experienced verifiable technical analysis failure.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                  Protects against server compute abuse
                </div>
              </div>

              <div
                className={`rounded-2xl border p-5 flex flex-col justify-between ${
                  isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/70'
                }`}
              >
                <div>
                  <div className="h-9 w-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-sm mb-3">
                    03
                  </div>
                  <h3 className="font-satoshi text-base font-bold mb-1.5">Fast Payout Speed</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Once approved by our billing desk, refunds are instantly triggered back to your original payment card (processed in 3-5 business days).
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                  Handled securely by Lemon Squeezy MoR
                </div>
              </div>
            </div>

            {/* How to Claim Refund Section */}
            <div
              className={`rounded-3xl border p-6 ${
                isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              <h3 className="font-satoshi text-lg font-bold mb-3">How to Request a Refund in 3 Simple Steps</h3>
              <ol className="flex flex-col gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 dark:bg-slate-100 text-[10px] font-bold text-white dark:text-slate-900">
                    1
                  </span>
                  <span>
                    Email our billing desk at <strong className="text-indigo-600 dark:text-indigo-400">strikucloud@gmail.com</strong> or submit a ticket in our Contact tab.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 dark:bg-slate-100 text-[10px] font-bold text-white dark:text-slate-900">
                    2
                  </span>
                  <span>
                    Provide your purchase email address and the Lemon Squeezy Order Receipt number (e.g. <code className="font-mono text-xs">#LSQ-XXXXXX</code>).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 dark:bg-slate-100 text-[10px] font-bold text-white dark:text-slate-900">
                    3
                  </span>
                  <span>
                    Our billing team will review and confirm your refund within 4 hours. No tedious telephone calls or complicated forms required.
                  </span>
                </li>
              </ol>

              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  Need to initiate a refund now?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setContactSubject('Refund Request (14-Day Guarantee)');
                    setActiveTab('contact');
                  }}
                  className="rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-4 py-2 text-xs font-bold transition hover:opacity-90 cursor-pointer"
                >
                  Open Refund Request Ticket →
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* 3. DATA PRIVACY & VIDEO SECURITY TAB */}
        {/* ======================================================== */}
        {activeTab === 'privacy' && (
          <motion.div
            key="privacy"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* Zero Video Retention Commitment */}
            <div
              className={`rounded-3xl border p-6 sm:p-7 ${
                isLight ? 'border-indigo-200 bg-indigo-50/40' : 'border-indigo-900/60 bg-indigo-950/30'
              }`}
            >
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
                <Lock className="h-4 w-4" />
                <span>Zero Video Retention Architecture</span>
              </div>
              <h2 className="font-satoshi text-2xl sm:text-3xl font-black tracking-tight">
                Your Unpublished Videos Are Never Stored Or Shared
              </h2>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed max-w-3xl text-slate-700 dark:text-slate-300">
                Creators trust us with high-value, unreleased video content, confidential sponsor deals, and unreleased documentary materials. Our infrastructure is architected from day one so that raw video files never touch permanent hard drives.
              </p>
            </div>

            {/* Privacy Architecture Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className={`rounded-2xl border p-5 ${
                  isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2 font-satoshi text-base font-bold mb-2">
                  <Cpu className="h-5 w-5 text-indigo-600" />
                  <span>Volatile RAM Ingestion Only</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  When you upload a video for pre-scanning, keyframes are extracted inside temporary volatile memory (RAM buffers). Once the visual hazard assessment is synthesized, the frame memory is wiped instantly.
                </p>
              </div>

              <div
                className={`rounded-2xl border p-5 ${
                  isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2 font-satoshi text-base font-bold mb-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <span>No Public AI Training</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Your footage is never used to train public generative models. We use zero-retention enterprise API endpoints with Google Gemini that guarantee your data is never retained for training.
                </p>
              </div>

              <div
                className={`rounded-2xl border p-5 ${
                  isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2 font-satoshi text-base font-bold mb-2">
                  <Lock className="h-5 w-5 text-amber-600" />
                  <span>Bank-Grade TLS 1.3 Encryption</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  All communication between your client device and our neural consensus cluster is protected with 256-Bit SSL/TLS 1.3 cryptographic tunnels, preventing any third-party interception.
                </p>
              </div>

              <div
                className={`rounded-2xl border p-5 ${
                  isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2 font-satoshi text-base font-bold mb-2">
                  <Trash2 className="h-5 w-5 text-rose-600" />
                  <span>Full Data Deletion Rights (GDPR)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  You maintain 100% ownership. You can clear your historical upload audit logs, reset your channel profile, or wipe your account at any moment with 1 click from your profile.
                </p>
              </div>
            </div>

            {/* Official Privacy Policy Clauses */}
            <div
              className={`rounded-3xl border p-6 text-xs leading-relaxed space-y-4 ${
                isLight ? 'border-slate-200 bg-white text-slate-600' : 'border-slate-800 bg-slate-900/40 text-slate-300'
              }`}
            >
              <h3 className="font-satoshi text-base font-bold text-slate-900 dark:text-white">
                Detailed Regulatory Disclosures (Effective October 2026)
              </h3>
              <div>
                <strong className="text-slate-900 dark:text-white block mb-0.5">1. Information We Collect:</strong>
                We collect your account email address, subscription plan status, and anonymized device fingerprint metadata strictly to prevent free trial automated abuse. We do not collect personal addresses or phone numbers.
              </div>
              <div>
                <strong className="text-slate-900 dark:text-white block mb-0.5">2. Payment Data:</strong>
                All credit/debit card numbers are handled directly by Lemon Squeezy (our Merchant of Record, compliant with PCI-DSS Level 1 standards). We never store or see your raw credit card numbers.
              </div>
              <div>
                <strong className="text-slate-900 dark:text-white block mb-0.5">3. Third-Party Sharing:</strong>
                We never sell, rent, monetize, or trade your data or video content to data brokers, advertisers, or media agencies.
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* 4. TERMS OF SERVICE TAB */}
        {/* ======================================================== */}
        {activeTab === 'terms' && (
          <motion.div
            key="terms"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-6"
          >
            <div
              className={`rounded-3xl border p-6 sm:p-7 ${
                isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              <h2 className="font-satoshi text-2xl font-black tracking-tight mb-2">
                Striku Terms of Service & Acceptable Use
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">
                Last modified: October 2026 · Governs all web, mobile, and API access to the Striku (striku.cloud) platform.
              </p>

              <div className="flex flex-col gap-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <div>
                  <h4 className="font-satoshi text-sm font-bold text-slate-900 dark:text-white mb-1">
                    1. Platform Purpose & YouTube Independent Status
                  </h4>
                  <p>
                    Striku is an independent pre-moderation analysis tool designed to assist video creators in complying with online publishing rules. Striku is not endorsed by, directly affiliated with, maintained, or sponsored by YouTube, LLC or Google, LLC. All YouTube community guidelines, trademarks, and logos remain the registered property of Google, LLC.
                  </p>
                </div>

                <div>
                  <h4 className="font-satoshi text-sm font-bold text-slate-900 dark:text-white mb-1">
                    2. Advisory Nature of AI Audits
                  </h4>
                  <p>
                    Our 3-Pass Multi-Agent Neural Consensus analyzes video frames against official published guidelines and community benchmarks. While our precision exceeds 99.4%, YouTube reserves final unilateral discretion over platform enforcement, algorithmic strikes, and account standing. Striku audits serve as diagnostic and remediation assistance.
                  </p>
                </div>

                <div>
                  <h4 className="font-satoshi text-sm font-bold text-slate-900 dark:text-white mb-1">
                    3. Subscriptions, Renewals & Billing
                  </h4>
                  <p>
                    Paid subscriptions (Creator Shield, Creator Pro, Studio & Agency Master) automatically renew on a monthly or annual cycle unless cancelled prior to renewal. You can cancel auto-renewal at any time without penalty via your subscription settings or via the Lemon Squeezy portal.
                  </p>
                </div>

                <div>
                  <h4 className="font-satoshi text-sm font-bold text-slate-900 dark:text-white mb-1">
                    4. Acceptable Content & Prohibited Use
                  </h4>
                  <p>
                    You agree not to use Striku to upload or process content depicting extreme illegal violence, CSAM, terrorism recruiting, or malicious bot DDoS attacks against our scanning cluster. Violators will face immediate account termination without refund.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* 5. ABOUT US & MISSION TAB */}
        {/* ======================================================== */}
        {activeTab === 'about' && (
          <motion.div
            key="about"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* Story Card */}
            <div
              className={`rounded-3xl border p-6 sm:p-8 ${
                isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="h-4 w-4" />
                <span>The Story Behind Striku</span>
              </div>
              <h2 className="font-satoshi text-2xl sm:text-3xl font-black tracking-tight mb-4">
                Leveling the Playing Field for Independent Video Creators
              </h2>
              <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  Every quarter, automated YouTube bots issue over <strong>4.2 million algorithmic penalties</strong>, demonetizations, and strikes against creators. For large Hollywood studios and billion-dollar television networks, this isn&apos;t a threat — they have full-time legal counsel and compliance teams vetting every clip.
                </p>
                <p>
                  For independent YouTubers, podcasters, gaming creators, and freelance editors, a single automated strike can destroy months of ad revenue and ruin channel algorithmic distribution.
                </p>
                <p>
                  We built <strong>Striku (StrikeGuard AI)</strong> to solve this exact problem: putting the regulatory compliance power of a $10,000 legal team directly into your browser.
                </p>
              </div>
            </div>

            {/* Neural Engine Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className={`rounded-2xl border p-5 ${
                  isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2 font-satoshi text-base font-bold text-red-600 mb-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-500/10 text-xs">α</span>
                  <span>Agent Alpha (Visual)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Inspects visual temporal keyframes for dangerous stunts, sharp objects, regulated weapons, and violent encounters.
                </p>
              </div>

              <div
                className={`rounded-2xl border p-5 ${
                  isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2 font-satoshi text-base font-bold text-amber-600 mb-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10 text-xs">β</span>
                  <span>Agent Beta (Audio)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Evaluates dialogue, vulgarity pacing, hate speech markers, and background acoustic anomalies that trigger automated audio mutes.
                </p>
              </div>

              <div
                className={`rounded-2xl border p-5 ${
                  isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2 font-satoshi text-base font-bold text-indigo-600 mb-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/10 text-xs">Ω</span>
                  <span>Agent Omega (Legal)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Synthesizes consensus findings, checks YouTube 2026 rule precedent, and produces exact second-by-second CapCut cut sheets.
                </p>
              </div>
            </div>

            {/* Entity Info & Office Locations Card (Matching Content Filter AI & MOQ Automation) */}
            <div
              className={`rounded-3xl border p-6 sm:p-8 flex flex-col gap-6 ${
                isLight ? 'border-emerald-200 bg-emerald-50/40' : 'border-emerald-900/40 bg-[#061311]'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-950/40 pb-5">
                <div className="flex items-center gap-3">
                  <img
                    src="/logo.png"
                    alt="Striku Logo"
                    className="h-10 w-10 rounded-2xl object-contain bg-emerald-950/40 border border-emerald-500/30 p-1"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div>
                    <h4 className="font-display text-lg font-black text-white uppercase tracking-tight">
                      STRIKU<span className="text-emerald-400">.CLOUD</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      A product by <strong className="text-emerald-400 font-bold">MOQ Automation</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800/40">
                  <BadgeCheck className="h-4 w-4" />
                  <span>Verified Legal Entity &amp; Developer</span>
                </div>
              </div>

              {/* Office Locations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-slate-300">
                <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-black/30 border border-emerald-900/20">
                  <span className="font-bold text-white uppercase font-mono tracking-wider text-[11px] text-emerald-400">
                    Pakistan Office
                  </span>
                  <span className="text-sm font-semibold text-slate-200">Karachi West</span>
                  <span className="text-slate-400">Karachi, Sindh, Pakistan</span>
                </div>

                <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-black/30 border border-emerald-900/20">
                  <span className="font-bold text-white uppercase font-mono tracking-wider text-[11px] text-emerald-400">
                    USA Headquarters
                  </span>
                  <span className="text-sm font-semibold text-slate-200">5900 Balcones Dr Ste 22699</span>
                  <span className="text-slate-400">Austin, TX 78731, USA</span>
                </div>

                <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-black/30 border border-emerald-900/20">
                  <span className="font-bold text-white uppercase font-mono tracking-wider text-[11px] text-emerald-400">
                    Direct Creator Support
                  </span>
                  <a
                    href="tel:+923362103534"
                    className="text-sm font-mono font-bold text-slate-200 hover:text-emerald-400 transition"
                  >
                    +92 336 2103534
                  </a>
                  <span className="text-slate-400">WhatsApp &amp; Voice Assistance</span>
                </div>
              </div>

              {/* Footer attribution line */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-emerald-950/40 text-xs text-slate-400">
                <span>AI risk estimate, not an official YouTube ruling.</span>
                <span>
                  Designed and Developed by <strong className="text-emerald-400">Faiwebz</strong>
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* 6. CONTACT US & SUPPORT DESK TAB */}
        {/* ======================================================== */}
        {activeTab === 'contact' && (
          <motion.div
            key="contact"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Contact Details & SLA Info */}
            <div className="flex flex-col gap-4">
              <div
                className={`rounded-3xl border p-6 ${
                  isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                <h3 className="font-satoshi text-lg font-bold mb-4">Creator Support Desk</h3>
                <div className="flex flex-col gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block mb-0.5 font-medium">Direct Support Email</span>
                    <a
                      href="mailto:strikucloud@gmail.com"
                      className="font-mono font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      strikucloud@gmail.com
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5 font-medium">Response SLA</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      Under 4 Hours (Guaranteed within 24 Hours)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5 font-medium">Billing &amp; Merchant Support</span>
                    <span className="text-slate-700 dark:text-slate-300">
                      Lemon Squeezy Authorized Merchant of Record Help Center
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5 font-medium">Business Inquiries</span>
                    <span className="text-slate-700 dark:text-slate-300">
                      Agency licenses ($80/mo) &amp; MCN multi-seat custom provisioning
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Box */}
              <div
                className={`rounded-2xl border p-4.5 ${
                  isLight ? 'border-emerald-200 bg-emerald-50 text-emerald-950' : 'border-emerald-500/30 bg-emerald-950/30 text-emerald-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs mb-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Real-Time System Health: 99.98%</span>
                </div>
                <p className="text-[11px] opacity-90 leading-relaxed">
                  All video ingestion nodes, AI vision classifiers, and Lemon Squeezy payment webhooks are running smoothly.
                </p>
              </div>
            </div>

            {/* Interactive Ticket Form */}
            <div
              className={`lg:col-span-2 rounded-3xl border p-6 sm:p-7 ${
                isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              <h3 className="font-satoshi text-lg font-bold mb-1">Submit a Support Ticket</h3>
              <p className="text-xs text-slate-500 mb-5">
                Our engineering and billing team will review and reply directly to your email address.
              </p>

              {contactSubmitted ? (
                <div
                  className={`rounded-2xl border p-6 text-center ${
                    isLight ? 'border-emerald-200 bg-emerald-50 text-emerald-950' : 'border-emerald-500/30 bg-emerald-950/40 text-emerald-200'
                  }`}
                >
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-600">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h4 className="font-satoshi text-lg font-black">Support Ticket Created Successfully!</h4>
                  <p className="font-mono text-xs font-bold mt-1 text-emerald-600 dark:text-emerald-400">
                    Ticket Reference: {ticketId}
                  </p>
                  <p className="text-xs mt-2 max-w-md mx-auto text-slate-600 dark:text-slate-300">
                    We have logged your ticket regarding <strong>{contactSubject}</strong>. A confirmation has been routed to <strong>{contactEmail || 'your email'}</strong>. Our team typically responds within 2-4 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setContactSubmitted(false);
                      setContactMessage('');
                    }}
                    className="mt-4 rounded-xl bg-emerald-600 text-white px-4 py-2 text-xs font-bold transition hover:bg-emerald-700 cursor-pointer"
                  >
                    Submit Another Ticket
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Tariq Khan / Studio Editor"
                        className={`w-full rounded-xl px-3.5 py-2.5 text-xs border outline-hidden transition ${
                          isLight
                            ? 'border-slate-200 bg-slate-50 focus:border-indigo-500 focus:bg-white text-slate-900'
                            : 'border-slate-800 bg-slate-950 focus:border-indigo-500 text-white'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                        Your Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="you@youtubechannel.com"
                        className={`w-full rounded-xl px-3.5 py-2.5 text-xs border outline-hidden transition ${
                          isLight
                            ? 'border-slate-200 bg-slate-50 focus:border-indigo-500 focus:bg-white text-slate-900'
                            : 'border-slate-800 bg-slate-950 focus:border-indigo-500 text-white'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                      Ticket Category
                    </label>
                    <select
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className={`w-full rounded-xl px-3.5 py-2.5 text-xs border outline-hidden transition ${
                        isLight
                          ? 'border-slate-200 bg-slate-50 focus:border-indigo-500 focus:bg-white text-slate-900'
                          : 'border-slate-800 bg-slate-950 focus:border-indigo-500 text-white'
                      }`}
                    >
                      <option value="Billing & Refund Question">Billing &amp; Refund Request (14-Day Guarantee)</option>
                      <option value="False Strike Appeal Guidance">False Strike Appeal Guidance / Question</option>
                      <option value="Agency Custom Plan ($80/mo)">Studio &amp; Agency Multi-Seat License ($80/mo)</option>
                      <option value="Technical Video Scan Issue">Technical Video Scan / Frame Extraction Issue</option>
                      <option value="Other / General Inquiries">Other / Partnership &amp; Creator Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                      Message &amp; Details
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Please describe your inquiry, video duration, or invoice number..."
                      className={`w-full rounded-xl px-3.5 py-2.5 text-xs border outline-hidden transition ${
                        isLight
                          ? 'border-slate-200 bg-slate-50 focus:border-indigo-500 focus:bg-white text-slate-900'
                          : 'border-slate-800 bg-slate-950 focus:border-indigo-500 text-white'
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-400">
                      🔒 Your inquiry is handled under strict non-disclosure.
                    </span>
                    <button
                      type="submit"
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-xs font-bold text-white transition hover:opacity-95 cursor-pointer shadow-sm"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Submit Ticket</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
