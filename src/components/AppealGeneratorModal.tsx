import React, { useState } from 'react';
import {
  X,
  FileText,
  Copy,
  Check,
  Sparkles,
  ShieldAlert,
  Send,
  HelpCircle,
  Cloud,
} from 'lucide-react';
import { AuditReport } from '../types/audit';
import { requestAppealGeneration } from '../services/auditClient';
import { saveAppealToCloud, auth, signInWithGoogle } from '../services/firebase';

interface AppealGeneratorModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  report: AuditReport;
  isEmbedded?: boolean;
  isLight?: boolean;
}

export const AppealGeneratorModal: React.FC<AppealGeneratorModalProps> = ({
  isOpen = true,
  onClose,
  report,
  isEmbedded = false,
  isLight = false,
}) => {
  if (!isEmbedded && !isOpen) return null;

  const [channelNiche, setChannelNiche] = useState('Comedy & Family Entertainment');
  const [defenseContext, setDefenseContext] = useState(
    'The video was recorded in a safe, fully supervised domestic environment. Props were blunt stage items and no minors or participants were exposed to genuine physical danger. The tone is humorous and educational with active guardian supervision.'
  );
  const [allegedViolation, setAllegedViolation] = useState(
    report.timelineViolations[0]?.youtubePolicyRef ||
      'YouTube Community Guidelines - Child Safety / Minor Endangerment'
  );
  const [flaggedTimestamps, setFlaggedTimestamps] = useState(
    report.timelineViolations[0]
      ? `${report.timelineViolations[0].timestampStart} - ${report.timelineViolations[0].timestampEnd}`
      : '00:04 - 00:08'
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAppeal, setGeneratedAppeal] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSavingCloud, setIsSavingCloud] = useState(false);
  const [cloudSaved, setCloudSaved] = useState(false);

  const handleGenerateAppeal = async () => {
    setIsGenerating(true);
    try {
      const text = await requestAppealGeneration({
        videoTitle: report.videoTitle,
        channelNiche,
        allegedViolation,
        contextDescription: defenseContext,
        timestamps: flaggedTimestamps,
      });
      setGeneratedAppeal(text);
      setCloudSaved(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToCloud = async () => {
    if (!generatedAppeal) return;
    setIsSavingCloud(true);
    try {
      let user = auth.currentUser;
      if (!user) {
        user = await signInWithGoogle();
      }
      if (user) {
        await saveAppealToCloud(
          {
            videoTitle: report.videoTitle,
            policyType: allegedViolation,
            appealLetter: generatedAppeal,
            status: 'draft',
          },
          user
        );
        setCloudSaved(true);
        setTimeout(() => setCloudSaved(false), 3500);
      }
    } catch (err: any) {
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request' ||
        err?.code === 'auth/popup-blocked'
      ) {
        // User dismissed the popup
        return;
      }
      console.error('Error saving appeal to cloud:', err);
    } finally {
      setIsSavingCloud(false);
    }
  };

  const handleCopy = () => {
    if (!generatedAppeal) return;
    navigator.clipboard.writeText(generatedAppeal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const modalContent = (
    <div
      className={`relative flex w-full flex-col overflow-hidden rounded-3xl border transition ${
        isEmbedded
          ? isLight
            ? 'border-slate-100 bg-white text-slate-900 shadow-2xs'
            : 'border-slate-800 bg-slate-900 text-slate-100 shadow-xl'
          : isLight
          ? 'max-h-[90vh] max-w-2xl border-slate-100 bg-white text-slate-900 shadow-2xl'
          : 'max-h-[90vh] max-w-2xl border-slate-800 bg-slate-900 text-slate-100 shadow-2xl'
      }`}
    >
      {/* Modal Header */}
      <div
        className={`flex items-center justify-between border-b px-5 py-4 ${
          isLight ? 'border-slate-200 bg-slate-50/80' : 'border-slate-800 bg-slate-900'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-xs ${
              isLight ? 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200' : 'bg-indigo-500/20 text-indigo-400 ring-1 ring-indigo-500/40'
            }`}
          >
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3
              className={`font-display text-sm font-bold sm:text-base ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              Official YouTube Strike & Removal Appeal Kit
            </h3>
            <p className={`font-body text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Automated counter-appeal generator citing YouTube EDSA Section 4 exceptions
            </p>
          </div>
        </div>
        {onClose && !isEmbedded && (
          <button
            onClick={onClose}
            className={`rounded-xl p-1.5 transition ${
              isLight
                ? 'text-slate-500 hover:bg-slate-200 hover:text-slate-900'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Modal Body */}
      <div className="flex-1 overflow-y-auto p-5 text-xs">
        <div className="flex flex-col gap-4">
          {/* Input form */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <label
                className={`font-body text-xs font-semibold ${
                  isLight ? 'text-slate-700' : 'text-slate-300'
                }`}
              >
                Video Title:
              </label>
              <input
                type="text"
                value={report.videoTitle}
                disabled
                className={`mt-1 w-full rounded-xl border px-3 py-2 font-mono text-xs ${
                  isLight
                    ? 'border-slate-200 bg-slate-50 text-slate-800'
                    : 'border-slate-800 bg-slate-950 text-slate-300'
                }`}
              />
            </div>

            <div>
              <label
                className={`font-body text-xs font-semibold ${
                  isLight ? 'text-slate-700' : 'text-slate-300'
                }`}
              >
                Channel Category / Niche:
              </label>
              <input
                type="text"
                value={channelNiche}
                onChange={(e) => setChannelNiche(e.target.value)}
                className={`mt-1 w-full rounded-xl border px-3 py-2 font-body text-xs transition focus:outline-none ${
                  isLight
                    ? 'border-slate-200 bg-white text-slate-900 focus:border-indigo-600'
                    : 'border-slate-800 bg-slate-950 text-slate-200 focus:border-indigo-500'
                }`}
                placeholder="e.g. Comedy, Culinary Masterclass, Documentary"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                className={`font-body text-xs font-semibold ${
                  isLight ? 'text-slate-700' : 'text-slate-300'
                }`}
              >
                Alleged YouTube Policy Citation:
              </label>
              <input
                type="text"
                value={allegedViolation}
                onChange={(e) => setAllegedViolation(e.target.value)}
                className={`mt-1 w-full rounded-xl border px-3 py-2 font-mono text-xs transition focus:outline-none ${
                  isLight
                    ? 'border-slate-200 bg-white text-slate-900 focus:border-indigo-600'
                    : 'border-slate-800 bg-slate-950 text-slate-200 focus:border-indigo-500'
                }`}
              />
            </div>

            <div className="sm:col-span-2">
              <label
                className={`font-body text-xs font-semibold ${
                  isLight ? 'text-slate-700' : 'text-slate-300'
                }`}
              >
                Creator Defense Context (Why this was a false-positive detection):
              </label>
              <textarea
                rows={3}
                value={defenseContext}
                onChange={(e) => setDefenseContext(e.target.value)}
                className={`mt-1 w-full rounded-xl border px-3 py-2 font-body text-xs leading-relaxed transition focus:outline-none ${
                  isLight
                    ? 'border-slate-200 bg-white text-slate-900 focus:border-indigo-600'
                    : 'border-slate-800 bg-slate-950 text-slate-200 focus:border-indigo-500'
                }`}
              />
            </div>
          </div>

          {/* Action trigger button */}
          <div>
            <button
              onClick={handleGenerateAppeal}
              disabled={isGenerating}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-display text-sm font-black tracking-wide text-white shadow-md transition hover:bg-indigo-500 active:scale-[0.99]"
            >
              <Sparkles className="h-4 w-4" />
              <span>
                {isGenerating
                  ? 'Drafting Policy Defense Argument...'
                  : 'Generate YouTube Studio Appeal Letter'}
              </span>
            </button>
          </div>

          {/* Generated Output in Newsreader Legal Serif */}
          {generatedAppeal && (
            <div
              className={`mt-2 flex flex-col gap-2 rounded-2xl border p-4.5 transition ${
                isLight
                  ? 'border-indigo-200 bg-indigo-50/50 text-slate-900'
                  : 'border-indigo-500/30 bg-slate-950 text-slate-100'
              }`}
            >
              <div
                className={`flex items-center justify-between border-b pb-2 ${
                  isLight ? 'border-indigo-200' : 'border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`font-display text-xs font-black uppercase tracking-wider ${
                      isLight ? 'text-indigo-900' : 'text-indigo-300'
                    }`}
                  >
                    Official Appeal Letter Draft:
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    ({generatedAppeal.length} / 800 chars)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveToCloud}
                    disabled={isSavingCloud}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-body text-xs font-bold transition ${
                      cloudSaved
                        ? 'bg-emerald-600 text-white'
                        : isLight
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <Cloud className={`h-3.5 w-3.5 ${cloudSaved ? 'text-white' : 'text-emerald-500'}`} />
                    <span>{cloudSaved ? 'Saved to Cloud!' : isSavingCloud ? 'Saving...' : 'Save to Firebase'}</span>
                  </button>

                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-body text-xs font-bold transition ${
                      isLight
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
                        : 'bg-indigo-900/60 text-indigo-200 hover:bg-indigo-800'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Appeal Text</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* The appeal body in authentic legal serif */}
              <div
                className={`max-h-64 overflow-y-auto whitespace-pre-wrap font-serif-legal text-xs sm:text-sm leading-relaxed p-3.5 rounded-xl ${
                  isLight
                    ? 'bg-white text-slate-900 border border-indigo-100/80 shadow-2xs'
                    : 'bg-slate-900/80 text-slate-100 border border-slate-800'
                }`}
              >
                {generatedAppeal}
              </div>

              <p
                className={`mt-1 font-body text-[11px] ${
                  isLight ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                Submission Tip: Open YouTube Studio &gt; Content &gt; Restrictions &gt; Appeal, and paste this text directly into the 800-character description box.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Footer */}
      {onClose && !isEmbedded && (
        <div
          className={`border-t px-5 py-3 ${
            isLight ? 'border-slate-200 bg-slate-50/60' : 'border-slate-800 bg-slate-950/60'
          }`}
        >
          <button
            onClick={onClose}
            className={`w-full rounded-xl py-2 font-body text-xs font-semibold transition ${
              isLight
                ? 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                : 'border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );

  if (isEmbedded) {
    return modalContent;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      {modalContent}
    </div>
  );
};
