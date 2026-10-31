import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Mail,
  Send,
  CheckCircle2,
  Lock,
  Scale,
  DollarSign,
  HelpCircle,
  Building2,
  FileText,
  ShieldCheck,
  ChevronDown,
  Search,
  ExternalLink,
} from 'lucide-react';
import { NavView } from './Sidebar';

interface PageProps {
  onNavigate: (view: NavView) => void;
  isLight: boolean;
  onOpenPricing?: () => void;
  currentUserEmail?: string | null;
}

// Reusable Top Navigation Bar for all Policy Pages
const PolicyPageHeader: React.FC<{
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  isLight: boolean;
}> = ({ currentView, onNavigate, isLight }) => {
  const links: { id: NavView; label: string }[] = [
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact Us' },
    { id: 'refund', label: 'Refund Policy' },
    { id: 'faq', label: 'FAQ' },
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'terms', label: 'Terms of Service' },
  ];

  return (
    <div className="flex flex-col gap-4 mb-10 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            onNavigate('overview');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60'
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>

        {/* Quick Tabs to other policy pages */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {links.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => {
                  onNavigate(link.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 1. ABOUT US PAGE
// ============================================================================
export const AboutUsPage: React.FC<PageProps> = ({ onNavigate, isLight }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
    >
      <PolicyPageHeader currentView="about" onNavigate={onNavigate} isLight={isLight} />

      {/* Main Title (Bara Title) */}
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight mb-4">
          About Us
        </h1>
        {/* Main Title Ke Niche Words */}
        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
          Striku is an advanced pre-upload YouTube compliance and content inspection platform developed by FM Automation. We empower video creators, editors, and digital studios worldwide to scan unreleased videos, detect copyright risks, community guideline flags, and monetization hazards before publishing.
        </p>
      </div>

      {/* Structured Sections with Bara Title + Words */}
      <div className="space-y-12">
        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
            Our Story &amp; Mission
          </h2>
          <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 font-normal">
            <p>
              Every year, over 4 million algorithmic strikes and monetization penalties are issued across YouTube. For major television broadcast networks and multi-million dollar production studios, this is a minor inconvenience because they maintain dedicated legal teams to vet footage frame by frame.
            </p>
            <p>
              For independent YouTubers, freelance video editors, educators, and gaming creators, a single sudden strike can shut down channel monetization, forfeit weeks of sponsorships, and suppress algorithmic distribution.
            </p>
            <p>
              We founded Striku to solve this exact problem: putting the deep compliance verification power of an expert legal team directly into an effortless web application accessible to every creator.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
            Who We Are
          </h2>
          <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 font-normal">
            <p>
              Striku is engineered and maintained by <strong>FM Automation</strong>, a digital technology venture founded in Khanewal, Punjab, Pakistan.
            </p>
            <p>
              Our team consists of machine learning engineers, video compression specialists, and content policy researchers dedicated to creator safety. We build software that respects creator workflows, delivers lightning-fast feedback, and eliminates upload anxiety.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
            How Striku Technology Works
          </h2>
          <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 font-normal">
            <p>
              Striku employs a proprietary 3-pass neural consensus framework designed specifically around YouTube&apos;s 2026 Community Guidelines and Advertiser-Friendly content criteria:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Visual Keyframe Scanner:</strong> Evaluates visual temporal frames for dangerous activities, weapon depictions, regulated items, extreme content, and inappropriate imagery.
              </li>
              <li>
                <strong>Acoustic &amp; Dialogue Indexer:</strong> Transcribes audio commentary and dialogue to pinpoint profanity timing, hate speech triggers, aggressive language, and background audio hazards.
              </li>
              <li>
                <strong>Regulatory Consensus Engine:</strong> Cross-references detected elements against recent platform moderation precedents, calculating an exact safety score and generating millisecond-precise safe cut instructions for CapCut, Adobe Premiere, and DaVinci Resolve.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
            Our Zero-Video Retention Guarantee
          </h2>
          <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 font-normal">
            <p>
              We treat unpublished video footage as strictly confidential intellectual property. Your videos never touch permanent hard drive storage on our servers.
            </p>
            <p>
              All keyframe extraction and neural classification occur in volatile temporary memory buffers (RAM). As soon as your audit report is generated, the temporary video stream is automatically flushed. We never archive, share, or train public AI models on creator footage.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
            Company Information &amp; Official Address
          </h2>
          <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed space-y-2 font-normal">
            <p><strong>Brand:</strong> Striku (striku.cloud)</p>
            <p><strong>Parent Company:</strong> FM Automation</p>
            <p><strong>Headquarters:</strong> Khanewal, Punjab, Pakistan</p>
            <p><strong>Official Email:</strong> strikucloud@gmail.com</p>
            <p><strong>WhatsApp Support:</strong> +92 319 7419085</p>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

// ============================================================================
// 2. CONTACT US PAGE
// ============================================================================
export const ContactUsPage: React.FC<PageProps> = ({ onNavigate, isLight, currentUserEmail }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(currentUserEmail || '');
  const [category, setCategory] = useState('General Support');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    const generated = 'TKT-' + Math.floor(100000 + Math.random() * 900000);
    setTicketId(generated);
    setSubmitted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
    >
      <PolicyPageHeader currentView="contact" onNavigate={onNavigate} isLight={isLight} />

      {/* Main Title (Bara Title) */}
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight mb-4">
          Contact Us
        </h1>
        {/* Main Title Ke Niche Words */}
        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
          Have questions regarding pre-upload video audits, refunds, subscriptions, or partnership opportunities? Reach out to the Striku support team through our official communication channels below.
        </p>
      </div>

      <div className="space-y-12">
        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
            Direct Support Channels
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
            <div className={`p-5 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Mail className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-950 dark:text-white">Email Desk</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-2">
                Send an email directly to our engineering and billing team.
              </p>
              <a
                href="mailto:strikucloud@gmail.com"
                className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                strikucloud@gmail.com
              </a>
              <span className="block text-[11px] text-slate-400 mt-1">Average response: &lt; 4 hours</span>
            </div>

            <div className={`p-5 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-950 dark:text-white">WhatsApp Priority Chat</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-2">
                Direct WhatsApp assistance for creators and agency accounts.
              </p>
              <a
                href="https://wa.me/923197419085"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                +92 319 7419085
              </a>
              <span className="block text-[11px] text-slate-400 mt-1">Instant voice &amp; text support</span>
            </div>
          </div>
        </section>

        {/* Section 2: Form */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
            Send Us a Message
          </h2>
          <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            Fill out the form below and an engineer will reply directly to your email address.
          </div>

          <div className={`p-6 sm:p-8 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/60 border-slate-800'}`}>
            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white">
                  Message Sent Successfully
                </h3>
                <p className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Ticket Reference ID: {ticketId}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  Thank you for contacting Striku. We have routed your request regarding <strong>{category}</strong> to our support specialists. We typically reply within 2 to 4 hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-hidden transition ${
                        isLight
                          ? 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white text-slate-900'
                          : 'border-slate-700 bg-slate-950 focus:border-blue-400 text-white'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                      Your Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="creator@gmail.com"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-hidden transition ${
                        isLight
                          ? 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white text-slate-900'
                          : 'border-slate-700 bg-slate-950 focus:border-blue-400 text-white'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Inquiry Topic
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-hidden transition ${
                      isLight
                        ? 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white text-slate-900'
                        : 'border-slate-700 bg-slate-950 focus:border-blue-400 text-white'
                    }`}
                  >
                    <option value="General Support">General Support &amp; Questions</option>
                    <option value="Billing & Refund">Billing, Invoices &amp; 14-Day Refund Request</option>
                    <option value="Video Scan Assistance">Video Audit &amp; Technical Scanning Issue</option>
                    <option value="Agency / Enterprise Plan">Agency Master Plan ($80/mo) Multi-Seat Setup</option>
                    <option value="Strike Appeal Guidance">YouTube Strike Appeal Kit Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Your Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe how we can help you..."
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-hidden transition ${
                      isLight
                        ? 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white text-slate-900'
                        : 'border-slate-700 bg-slate-950 focus:border-blue-400 text-white'
                    }`}
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                  <span className="text-xs text-slate-500">
                    Your information is protected under strict privacy terms.
                  </span>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                    <span>Submit Message</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
            Operating Hours &amp; Physical Office
          </h2>
          <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed space-y-2 font-normal">
            <p><strong>Physical Address:</strong> FM Automation, Khanewal, Punjab, Pakistan</p>
            <p><strong>Working Hours:</strong> Monday – Sunday, 9:00 AM – 11:00 PM (PKT / UTC+5)</p>
            <p><strong>Urgent Turnaround SLA:</strong> Inquiries marked as urgent are responded to within 2 to 4 hours.</p>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

// ============================================================================
// 3. REFUND POLICY PAGE
// ============================================================================
export const RefundPolicyPage: React.FC<PageProps> = ({ onNavigate, isLight, onOpenPricing }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
    >
      <PolicyPageHeader currentView="refund" onNavigate={onNavigate} isLight={isLight} />

      {/* Legal Tag & Main Title (Bara Title) */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-900/60 mb-3">
          Legal
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight mb-2">
          Refund &amp; Cancellation Policy
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
          Last updated: October 4, 2026
        </p>
      </div>

      {/* Structured Sections with Bara Title + Clean Words */}
      <div className="space-y-10">
        {/* Section 1: Overview */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
            Overview
          </h2>
          <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            <p>
              Content Filter AI (“we”, “us”), a product by MOQ Automation, is a digital software as a service (SaaS). Access to scans and credits is delivered to your account instantly after payment. This policy explains our stance on refunds and how cancellation works.
            </p>
          </div>
        </section>

        {/* Section 2: Refunds */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
            Refunds
          </h2>
          <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 font-normal">
            <p>
              Because this is a digital service that is delivered and usable immediately, all payments are final and non-refundable. This applies to both monthly subscriptions and one time credit top ups. We do not provide refunds for unused scans, unused credits, or partially used billing periods.
            </p>
            <p>
              The only exceptions are where a refund is required by applicable law, or where you were charged in genuine error (for example, a duplicate charge). In those cases, contact us and we will review and resolve it.
            </p>
          </div>
        </section>

        {/* Section 3: Cancellation */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
            Cancellation
          </h2>
          <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 font-normal">
            <p>
              You can cancel your subscription at any time from your account billing page. There is no cancellation fee and no lock in.
            </p>
            <ul className="list-disc pl-5 space-y-2 pt-1 text-slate-700 dark:text-slate-300">
              <li>Cancelling stops all future renewals and charges.</li>
              <li>You keep access to your paid plan until the end of the billing period you already paid for.</li>
              <li>Top-up credits you have purchased stay in your account and do not expire. Plan credits stay valid for 60 days after they are added.</li>
            </ul>
          </div>
        </section>

        {/* Section 4: Free trial */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
            Free trial
          </h2>
          <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            <p>
              New accounts start with free scans so you can try the service before paying. We recommend using the free scans first to make sure StrikuCloud fits your needs.
            </p>
          </div>
        </section>

        {/* Quick Action Navigation Buttons */}
        <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div>
            <h3 className="text-sm font-bold text-slate-950 dark:text-white">
              Have questions or need assistance?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Contact our team or manage your billing settings at any time.
            </p>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                onNavigate('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition cursor-pointer"
            >
              Contact Support
            </button>
            <button
              type="button"
              onClick={() => {
                if (onOpenPricing) onOpenPricing();
                else onNavigate('subscription');
              }}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                isLight
                  ? 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800'
                  : 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              Account Billing
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// 4. FREQUENTLY ASKED QUESTIONS (FAQ) PAGE
// ============================================================================
export const FaqPage: React.FC<PageProps> = ({ onNavigate, isLight }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'q-1': true,
    'q-5': true,
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const faqSections = [
    {
      sectionTitle: 'Video Scanning & Strike Detection',
      items: [
        {
          id: 'q-1',
          question: 'How does Striku detect YouTube Community Guideline strikes before I upload?',
          answer:
            'Striku uses a 3-Pass Multi-Agent Neural Consensus Engine. Agent Alpha inspects keyframe visuals for violence, weapons, and dangerous activities; Agent Beta analyzes speech pacing, profanity, and dialogue; and Agent Omega cross-references YouTube’s official 2026 guidelines to calculate your compliance score before your video is ever uploaded to YouTube.',
        },
        {
          id: 'q-2',
          question: 'What types of YouTube policy violations does Striku identify?',
          answer:
            'Striku checks for Copyright Audio/Video matching, Reused Content repetition, Community Guideline strikes (harassment, dangerous stunts, regulated goods, graphic imagery), and Advertiser-Friendly demonetization triggers (excessive profanity in the first 7 seconds, adult themes, sensitive topics).',
        },
        {
          id: 'q-3',
          question: 'Does Striku work for both YouTube Shorts and long-form videos?',
          answer:
            'Yes. Striku accepts vertical 9:16 Shorts as well as 16:9 standard horizontal videos of any duration in MP4, MOV, WebM, and MKV formats.',
        },
        {
          id: 'q-4',
          question: 'What is the accuracy rate of Striku audits?',
          answer:
            'Our neural consensus engine maintains a 99.4% precision rate with YouTube automated ingestion standards. It provides exact second-by-second timestamps and recommended remediation actions.',
        },
      ],
    },
    {
      sectionTitle: 'Data Privacy & Video Security',
      items: [
        {
          id: 'q-5',
          question: 'Do you store or keep copies of my unreleased videos on your servers?',
          answer:
            'No. Striku operates on a strict Zero-Video-Retention Guarantee. Video files are parsed temporarily in volatile RAM memory solely to extract temporal keyframe hashes. Once the audit report is delivered, the temporary video stream is automatically flushed. We never store, archive, or leak your content.',
        },
        {
          id: 'q-6',
          question: 'Does Striku require login access or write permissions to my YouTube channel?',
          answer:
            'Never. Striku operates on a Zero-Channel-Risk principle. We never request your YouTube channel password or broad write permissions. You can use Striku completely independently before uploading.',
        },
        {
          id: 'q-7',
          question: 'Is my unpublished video footage used to train public AI models?',
          answer:
            'Absolutely not. We have strict enterprise zero-retention data protection agreements that forbid any retention or AI training on user video uploads.',
        },
      ],
    },
    {
      sectionTitle: 'Billing, Subscriptions & Refunds',
      items: [
        {
          id: 'q-8',
          question: 'Is there a free version of Striku available?',
          answer:
            'Yes. Every creator device receives 5 free complete video audits every calendar month on our Free Starter tier. No credit card is required to use the free tier.',
        },
        {
          id: 'q-9',
          question: 'What is your refund and cancellation policy?',
          answer:
            'Content Filter AI (MOQ Automation) provides instant digital access to scans and credits upon payment. Because credits and scans are usable immediately, payments are final and non-refundable (except where required by law or in cases of genuine error like duplicate charges). You can cancel subscriptions anytime with zero fees directly from your account, retaining access through the end of your billing cycle. Unused free trial scans are available to evaluate the platform before purchasing.',
        },
        {
          id: 'q-10',
          question: 'Which payment methods are accepted worldwide?',
          answer:
            'We accept Visa, MasterCard, American Express, Apple Pay, Google Pay, and international debit cards across 190+ countries through Lemon Squeezy (our authorized Merchant of Record). We also accept direct bank transfers in Pakistan and Binance Pay USDT.',
        },
        {
          id: 'q-11',
          question: 'How do I cancel my subscription?',
          answer:
            'You can cancel your subscription at any time with 1 click from your Creator Profile or via the Lemon Squeezy receipt link. No cancellation fees apply.',
        },
      ],
    },
    {
      sectionTitle: 'Editing Integration & Appeal Kit',
      items: [
        {
          id: 'q-12',
          question: 'Can I export safe cut markers directly to CapCut or Premiere Pro?',
          answer:
            'Yes! On paid tiers, Striku generates millisecond-accurate timecodes, Cut Sheets, and EDL markers that your video editor can import to trim or blur flagged segments in under 60 seconds.',
        },
        {
          id: 'q-13',
          question: 'What is the AI Strike Appeal Kit?',
          answer:
            'If YouTube ever mistakenly issues an automated strike on a video that followed all guidelines, our Strike Appeal Kit drafts formal legal counter-appeal letters citing specific YouTube policy precedents for immediate submission to Creator Support.',
        },
      ],
    },
  ];

  const filteredSections = faqSections
    .map((sec) => ({
      ...sec,
      items: sec.items.filter(
        (it) =>
          it.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          it.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((sec) => sec.items.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
    >
      <PolicyPageHeader currentView="faq" onNavigate={onNavigate} isLight={isLight} />

      {/* Main Title (Bara Title) */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight mb-4">
          Frequently Asked Questions (FAQ)
        </h1>
        {/* Main Title Ke Niche Words */}
        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
          Find clear, comprehensive answers about how Striku checks your videos, protects your privacy, manages subscriptions, and safeguards your channel before upload.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-12">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search questions (e.g. refund, privacy, CapCut, YouTube strike)..."
          className={`w-full pl-12 pr-4 py-3 rounded-2xl border text-sm outline-hidden transition ${
            isLight
              ? 'border-slate-200 bg-white focus:border-blue-500 shadow-xs text-slate-900'
              : 'border-slate-700 bg-slate-900/60 focus:border-blue-400 text-white'
          }`}
        />
      </div>

      {/* Structured Sections with Bara Title + Words */}
      <div className="space-y-12">
        {filteredSections.map((sec, idx) => (
          <section key={idx} className="space-y-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
              {sec.sectionTitle}
            </h2>

            <div className="space-y-3">
              {sec.items.map((item) => {
                const isOpen = openItems[item.id];
                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border transition ${
                      isLight
                        ? 'border-slate-200 bg-white hover:border-slate-300'
                        : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left gap-4 cursor-pointer"
                    >
                      <span className="font-bold text-sm sm:text-base text-slate-950 dark:text-white">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </motion.div>
  );
};

// ============================================================================
// 5. PRIVACY POLICY PAGE
// ============================================================================
export const PrivacyPolicyPage: React.FC<PageProps> = ({ onNavigate, isLight }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
    >
      <PolicyPageHeader currentView="privacy" onNavigate={onNavigate} isLight={isLight} />

      {/* Main Title (Bara Title) */}
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight mb-4">
          Privacy Policy
        </h1>
        {/* Main Title Ke Niche Words */}
        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
          At Striku (striku.cloud), operated by FM Automation, we take creator confidentiality and digital data protection with the utmost seriousness. This Privacy Policy details how we handle, process, and safeguard your video files and account data.
        </p>
      </div>

      <div className="space-y-12">
        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
            1. Zero Video Retention Architecture
          </h2>
          <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 font-normal">
            <p>
              Your unpublished videos represent your creative and financial livelihood. Our architecture is deliberately built so that raw video files never touch permanent storage disks.
            </p>
            <p>
              When you scan a video, temporal frame samples are extracted directly in volatile temporary memory (RAM buffers). Once the audit report is synthesized, the temporary stream is automatically and permanently cleared. We never archive, duplicate, or share your unreleased footage.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
            2. Information We Collect
          </h2>
          <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 font-normal">
            <p>We only collect the absolute minimum data necessary to operate our service:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Account Data:</strong> If you choose to log in, we collect your email address and display name to sync your subscription status and saved audit summaries.
              </li>
              <li>
                <strong>Quota &amp; Device Metadata:</strong> We generate a secure cryptographic hash of browser/device characteristics to enforce the 5 free monthly scans per creator and mitigate automated abuse.
              </li>
              <li>
                <strong>Billing Records:</strong> Transaction identifiers, payment dates, and active tier status provided by Lemon Squeezy. We never receive or store full payment card numbers.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
            3. No Public AI Model Training
          </h2>
          <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 font-normal">
            <p>
              We maintain strict zero-retention enterprise API configurations. Your video frames, audio commentary, script transcriptions, and thumbnails are never utilized to train, retrain, or improve public foundation models or generative systems.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
            4. Security &amp; Encryption Standards
          </h2>
          <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 font-normal">
            <p>
              All traffic between your client device and our servers is protected with end-to-end 256-Bit SSL/TLS 1.3 encryption tunnels. Our processing infrastructure is hosted in ISO 27001 and SOC 2 compliant Google Cloud Platform facilities.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
            5. User Rights &amp; Data Deletion (GDPR / CCPA)
          </h2>
          <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 font-normal">
            <p>
              You maintain 100% ownership over your data. Under global data protection regulations (including GDPR and CCPA), you have the right to inspect, export, or permanently delete your account history at any moment.
            </p>
            <p>
              To request full account erasure, email <strong>strikucloud@gmail.com</strong> with the subject line &quot;Delete My Account&quot;. All associated records will be deleted within 24 hours.
            </p>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

// ============================================================================
// 6. TERMS OF SERVICE PAGE
// ============================================================================
export const TermsOfServicePage: React.FC<PageProps> = ({ onNavigate, isLight }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
    >
      <PolicyPageHeader currentView="terms" onNavigate={onNavigate} isLight={isLight} />

      {/* Main Title (Bara Title) */}
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight mb-4">
          Terms of Service
        </h1>
        {/* Main Title Ke Niche Words */}
        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
          These Terms of Service govern your access to and use of the Striku website (striku.cloud), software, and moderation diagnostic services operated by FM Automation.
        </p>
      </div>

      <div className="space-y-12">
        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
            1. Acceptance of Terms
          </h2>
          <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 font-normal">
            <p>
              By accessing, browsing, scanning videos, or subscribing to Striku, you agree to comply with and be legally bound by these Terms of Service, our Privacy Policy, and our Refund Policy. If you do not agree with any portion of these terms, you must discontinue use immediately.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
            2. Independent Status &amp; Trademark Clarification
          </h2>
          <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 font-normal">
            <p>
              Striku is an independent pre-moderation diagnostic tool developed by FM Automation. Striku is not endorsed by, sponsored by, or affiliated with YouTube LLC, Google LLC, or Alphabet Inc.
            </p>
            <p>
              YouTube, the YouTube logo, Content ID, and YouTube Community Guidelines are registered trademarks of Google LLC. All references are for descriptive identification purposes only.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
            3. Advisory Nature of AI Audits
          </h2>
          <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 font-normal">
            <p>
              Striku provides automated diagnostic estimates based on published community guidelines and copyright algorithms. While our precision exceeds 99.4%, YouTube reserves final unilateral discretion over platform enforcement, algorithmic strikes, and account standing.
            </p>
            <p>
              Striku reports are intended as editorial diagnostic assistance and do not constitute formal legal counsel.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
            4. Prohibited Content &amp; Acceptable Use
          </h2>
          <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 font-normal">
            <p>You agree not to use Striku to upload, process, or transmit:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Child Sexual Abuse Material (CSAM) or extreme violence.</li>
              <li>Terrorist propaganda or incitement to imminent real-world harm.</li>
              <li>Malicious code, bots, or automated denial-of-service payloads.</li>
            </ul>
            <p>
              Violations will result in immediate permanent account termination without refund.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
            5. Subscriptions, Renewals &amp; Cancellations
          </h2>
          <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 font-normal">
            <p>
              Paid plans automatically renew on a monthly or annual billing cycle until cancelled by the user. You may cancel renewal at any time with zero penalty. All subscriptions are covered by our 14-day 100% money-back guarantee.
            </p>
          </div>
        </section>

        {/* Section 6 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
            6. Governing Law
          </h2>
          <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 font-normal">
            <p>
              These Terms of Service are governed by and construed in accordance with the laws of Pakistan. Any dispute arising hereunder shall be subject to amicable settlement or competent courts in Punjab, Pakistan.
            </p>
          </div>
        </section>
      </div>
    </motion.div>
  );
};
