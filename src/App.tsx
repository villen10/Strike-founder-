import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { Sidebar, MobileBottomNav, NavView } from './components/Sidebar';
import { VideoScanner } from './components/VideoScanner';
import { AuditSummaryCard } from './components/AuditSummaryCard';
import { TimelineViolations } from './components/TimelineViolations';
import { ChannelHealthTrend, HistoricalUploadRecord } from './components/ChannelHealthTrend';
import { AppealGeneratorModal } from './components/AppealGeneratorModal';
import { SafeCutGuideModal } from './components/SafeCutGuideModal';
import { PolicyKnowledgeBase } from './components/PolicyKnowledgeBase';
import { COLOR_THEMES } from './services/themeConfig';
import { SAMPLE_VIDEOS } from './services/sampleData';
import { AuditReport, ColorThemeId, SampleVideoOption } from './types/audit';
import { ExtractedFrame } from './services/frameExtractor';
import { requestVideoAudit } from './services/auditClient';
import {
  auth,
  signInWithGoogle,
  logOut,
  saveAuditReportToCloud,
  fetchUserAuditReports,
  CloudAuditRecord,
  onAuthStateChanged,
  User,
} from './services/firebase';
import {
  LayoutDashboard,
  FileVideo,
  Activity,
  AlertTriangle,
  FileText,
  BookOpen,
  Scissors,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Layers,
  HelpCircle,
  ExternalLink,
  Info,
  Cloud,
  CheckCircle2,
} from 'lucide-react';

// Seed historical upload compliance records (Last 10 Uploads)
const INITIAL_HISTORY: HistoricalUploadRecord[] = [
  { id: 'up-1', index: 1, date: 'Sep 12', title: 'Cooking Vlog: Master Chef Knife Skills', complianceScore: 96, status: 'SAFE_TO_UPLOAD', issuesCount: 0 },
  { id: 'up-2', index: 2, date: 'Sep 15', title: 'Tech Review: Ultra Smartphone Unboxing', complianceScore: 94, status: 'SAFE_TO_UPLOAD', issuesCount: 0 },
  { id: 'up-3', index: 3, date: 'Sep 19', title: 'Motorcycle Highway Drift POV', complianceScore: 64, status: 'MONETIZATION_AT_RISK', issuesCount: 1 },
  { id: 'up-4', index: 4, date: 'Sep 22', title: 'Travel Vlog: City Street Market Food', complianceScore: 92, status: 'SAFE_TO_UPLOAD', issuesCount: 0 },
  { id: 'up-5', index: 5, date: 'Sep 26', title: 'Gaming Highlights & Commentary', complianceScore: 82, status: 'MONETIZATION_AT_RISK', issuesCount: 1 },
  { id: 'up-6', index: 6, date: 'Sep 30', title: 'Studio Setup Tour & Gear', complianceScore: 98, status: 'SAFE_TO_UPLOAD', issuesCount: 0 },
  { id: 'up-7', index: 7, date: 'Oct 03', title: 'Fitness Gym Workout Tips', complianceScore: 91, status: 'SAFE_TO_UPLOAD', issuesCount: 0 },
  { id: 'up-8', index: 8, date: 'Oct 06', title: 'Podcast: Creator Economy Q&A', complianceScore: 89, status: 'SAFE_TO_UPLOAD', issuesCount: 0 },
  { id: 'up-9', index: 9, date: 'Oct 08', title: 'Speed Run Challenge Reactions', complianceScore: 78, status: 'MONETIZATION_AT_RISK', issuesCount: 1 },
  { id: 'up-10', index: 10, date: 'Latest', title: 'Home Kitchen Prank with Toddler & Knife', complianceScore: 8, status: 'HIGH_STRIKE_RISK', issuesCount: 2 },
];

export default function App() {
  const [currentView, setCurrentView] = useState<NavView>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [strictnessMode, setStrictnessMode] = useState<'STANDARD' | 'PARANOID_ZERO_RISK'>('STANDARD');
  const [currentTheme, setCurrentTheme] = useState<ColorThemeId>('YOUTUBE_STUDIO_LIGHT');
  const theme = COLOR_THEMES[currentTheme];
  const isLight = theme.isLight;

  // Firebase Authentication & Cloud State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cloudReports, setCloudReports] = useState<CloudAuditRecord[]>([]);
  const [isSavingToCloud, setIsSavingToCloud] = useState(false);
  const [cloudSaveMessage, setCloudSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const records = await fetchUserAuditReports(user.uid);
          setCloudReports(records);
        } catch (err) {
          console.error('Failed to load cloud audits:', err);
        }
      } else {
        setCloudReports([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (e) {
      console.error('Sign-in failed:', e);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      setCloudReports([]);
    } catch (e) {
      console.error('Sign-out failed:', e);
    }
  };

  const handleSaveToCloud = async () => {
    try {
      setIsSavingToCloud(true);
      let user = currentUser;
      if (!user) {
        user = await signInWithGoogle();
      }
      if (user && report) {
        await saveAuditReportToCloud(report, user);
        const records = await fetchUserAuditReports(user.uid);
        setCloudReports(records);
        setCloudSaveMessage('Audit report successfully saved to Firebase Firestore!');
        setTimeout(() => setCloudSaveMessage(null), 4000);
      }
    } catch (err) {
      console.error('Save to cloud failed:', err);
    } finally {
      setIsSavingToCloud(false);
    }
  };

  // Active video & audit states - initialize with high-interest sample so UI is immediately rich & populated
  const defaultSample = SAMPLE_VIDEOS[0];
  const [videoTitle, setVideoTitle] = useState(defaultSample.title);
  const [videoDurationSec, setVideoDurationSec] = useState(defaultSample.durationSec);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [extractedFrames, setExtractedFrames] = useState<ExtractedFrame[]>([]);
  const [report, setReport] = useState<AuditReport>(defaultSample.mockReport);
  const [currentTime, setCurrentTime] = useState(0);

  // Channel Historical uploads (Last 10 uploads tracking compliance score)
  const [uploadHistory, setUploadHistory] = useState<HistoricalUploadRecord[]>(() => {
    try {
      const saved = localStorage.getItem('sg_channel_upload_history');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return INITIAL_HISTORY;
  });

  const avgComplianceScore =
    uploadHistory.length > 0
      ? Math.round(uploadHistory.reduce((acc, curr) => acc + curr.complianceScore, 0) / uploadHistory.length)
      : 100;

  // Sync historical upload when report updates
  const updateHistoryWithReport = (rep: AuditReport, title: string) => {
    const complianceScore = Math.max(0, 100 - rep.overallRiskScore);
    setUploadHistory((prev) => {
      const next = [...prev];
      const lastIndex = next.length;
      const newRecord: HistoricalUploadRecord = {
        id: 'up-' + Date.now(),
        index: lastIndex,
        date: 'Latest',
        title,
        complianceScore,
        status: rep.safetyGrade,
        issuesCount: rep.totalIssuesCount,
      };

      const updated = [...next.slice(-9), newRecord];
      try {
        localStorage.setItem('sg_channel_upload_history', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Scanning progress state
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState<{ percent: number; status: string }>({
    percent: 0,
    status: '',
  });

  // Modals
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
  const [isCutGuideOpen, setIsCutGuideOpen] = useState(false);
  const [isKnowledgeBaseOpen, setIsKnowledgeBaseOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  // When user selects a sample scenario
  const handleSelectSample = (sample: SampleVideoOption) => {
    setVideoTitle(sample.title);
    setVideoDurationSec(sample.durationSec);
    setCurrentVideoUrl(null);
    setCurrentTime(0);

    const adjustedReport: AuditReport = {
      ...sample.mockReport,
      strictnessMode,
      overallRiskScore:
        strictnessMode === 'PARANOID_ZERO_RISK'
          ? Math.min(100, sample.mockReport.overallRiskScore + (sample.mockReport.overallRiskScore > 20 ? 8 : 4))
          : sample.mockReport.overallRiskScore,
    };

    setReport(adjustedReport);
    updateHistoryWithReport(adjustedReport, sample.title);
  };

  // When user drops / uploads their own video file
  const handleUploadFile = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setCurrentVideoUrl(objectUrl);
    setVideoTitle(file.name);
    setCurrentTime(0);

    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.src = objectUrl;
    tempVideo.onloadedmetadata = () => {
      const dur = Math.round(tempVideo.duration) || 30;
      setVideoDurationSec(dur);
      handleTriggerAudit(file, dur, objectUrl);
    };
  };

  // Trigger full frame extraction & AI audit
  const handleTriggerAudit = async (uploadedFile?: File, durationOverride?: number, url?: string) => {
    setIsScanning(true);
    setScanProgress({ percent: 15, status: 'Initializing algorithmic ingest analyzer...' });

    const dur = durationOverride || videoDurationSec;

    setTimeout(() => {
      setScanProgress({ percent: 45, status: 'Scanning multi-frame sequences & audio cues...' });
    }, 400);

    setTimeout(() => {
      setScanProgress({ percent: 75, status: 'Evaluating against YouTube Community Guidelines & 3-Strikes Law...' });
    }, 700);

    setTimeout(async () => {
      try {
        if (uploadedFile) {
          const audit = await requestVideoAudit({
            videoTitle: uploadedFile.name,
            durationSec: dur,
            durationFormatted: `00:${dur < 10 ? '0' + dur : dur}`,
            strictnessMode,
            frames: extractedFrames,
          });
          setReport(audit);
          updateHistoryWithReport(audit, uploadedFile.name);
        } else {
          const base = SAMPLE_VIDEOS.find((s) => s.title === videoTitle) || SAMPLE_VIDEOS[0];
          const updatedReport: AuditReport = {
            ...base.mockReport,
            strictnessMode,
            overallRiskScore:
              strictnessMode === 'PARANOID_ZERO_RISK'
                ? Math.min(100, base.mockReport.overallRiskScore + 8)
                : base.mockReport.overallRiskScore,
          };
          setReport(updatedReport);
          updateHistoryWithReport(updatedReport, videoTitle);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setScanProgress({ percent: 100, status: 'Audit complete!' });
        setIsScanning(false);
      }
    }, 900);
  };

  // Seek video playback to specific seconds
  const handleSeek = (seconds: number) => {
    setCurrentTime(seconds);
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
    }
  };

  // Switch strictness mode
  const handleToggleStrictness = (mode: 'STANDARD' | 'PARANOID_ZERO_RISK') => {
    setStrictnessMode(mode);
    if (report) {
      const updated: AuditReport = {
        ...report,
        strictnessMode: mode,
        overallRiskScore:
          mode === 'PARANOID_ZERO_RISK'
            ? Math.min(100, report.overallRiskScore + (report.overallRiskScore > 20 ? 8 : 4))
            : Math.max(0, report.overallRiskScore - (report.overallRiskScore > 20 ? 8 : 4)),
      };
      setReport(updated);
      updateHistoryWithReport(updated, videoTitle);
    }
  };

  // Navigation Items
  const navTabs = [
    { id: 'overview' as NavView, label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'scanner' as NavView, label: 'Video Scanner', icon: FileVideo },
    { id: 'analytics' as NavView, label: 'Channel Health (10 Uploads)', icon: Activity },
    {
      id: 'violations' as NavView,
      label: 'Flags & Safe Cuts',
      icon: AlertTriangle,
      badge: report?.timelineViolations.length ? `${report.timelineViolations.length}` : null,
    },
    { id: 'appeal' as NavView, label: 'Strike Appeal Kit', icon: FileText },
    { id: 'knowledge' as NavView, label: 'Policy Encyclopedia', icon: BookOpen },
  ];

  return (
    <div
      className={`min-h-screen ${theme.bgClass} ${
        isLight ? 'text-slate-900' : 'text-slate-100'
      } flex flex-col justify-between selection:bg-red-500/20 selection:text-red-900 transition-colors duration-200`}
    >
      {/* Top Header */}
      <div>
        <Header
          strictnessMode={strictnessMode}
          onToggleStrictness={handleToggleStrictness}
          onOpenKnowledgeBase={() => setCurrentView('knowledge')}
          currentTheme={currentTheme}
          onSelectTheme={setCurrentTheme}
          currentUser={currentUser}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
        />

        {/* Main Workspace with Desktop Sidebar */}
        <div className="flex w-full min-h-[calc(100vh-65px)]">
          {/* Desktop Left Sidebar Navigation */}
          <Sidebar
            currentView={currentView}
            onSelectView={setCurrentView}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            theme={theme}
            violationsCount={report?.timelineViolations.length || 0}
            avgComplianceScore={avgComplianceScore}
          />

          {/* Main View Area */}
          <main className="flex-1 min-w-0 max-w-full px-3 py-4 sm:px-6 sm:py-6 pb-28 md:pb-12 flex flex-col gap-6">
            {/* Top Navigation Tabs (Easy 1-Click Page Navigation) */}
            <div
              className={`flex items-center justify-between gap-2 overflow-x-auto pb-1 border-b ${
                isLight ? 'border-slate-200' : 'border-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 py-1">
                {navTabs.map((tab) => {
                  const isActive = currentView === tab.id;
                  const Icon = tab.icon;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setCurrentView(tab.id)}
                      className={`flex items-center gap-1.5 rounded-xl px-3 py-2 font-sans text-xs font-semibold transition shrink-0 ${
                        isActive
                          ? isLight
                            ? 'bg-red-600 text-white shadow-xs font-bold'
                            : `${theme.accentBg} text-white shadow-xs font-bold`
                          : isLight
                          ? 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                          : 'border border-slate-800/90 bg-slate-900/70 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{tab.label}</span>
                      {tab.badge && (
                        <span
                          className={`rounded-full px-1.5 py-0.2 font-mono text-[10px] font-bold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-red-500 text-white'
                          }`}
                        >
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Strictness Mode Indicator */}
              <div className="hidden lg:flex items-center gap-2 text-xs shrink-0 font-medium">
                <span
                  className={`rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold flex items-center gap-1.5 ${
                    strictnessMode === 'PARANOID_ZERO_RISK'
                      ? 'bg-rose-500/10 text-rose-600 ring-1 ring-rose-500/20'
                      : 'bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20'
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>
                    {strictnessMode === 'PARANOID_ZERO_RISK'
                      ? 'Paranoid Zero-Risk Filter Active'
                      : 'Standard YouTube Filter Active'}
                  </span>
                </span>
              </div>
            </div>

            {/* View 1: STUDIO OVERVIEW DASHBOARD */}
            <AnimatePresence mode="wait">
              {currentView === 'overview' && (
                <motion.div
                  key="view-overview"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-5"
                >
                  {/* Top Bar with Quick Actions (Clean, No Clutter Banner) */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Algorithmic Pre-Upload Audit
                        </span>
                        <span className={isLight ? 'text-slate-300' : 'text-slate-600'}>·</span>
                        <span className="font-mono text-[11px] text-slate-500">
                          {videoTitle}
                        </span>
                      </div>
                      <h2
                        className={`mt-0.5 font-display text-xl sm:text-2xl font-black tracking-tight ${
                          isLight ? 'text-slate-950' : 'text-white'
                        }`}
                      >
                        Studio Compliance Verdict
                      </h2>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={handleSaveToCloud}
                        disabled={isSavingToCloud}
                        className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 font-sans text-xs font-semibold transition ${
                          isLight
                            ? 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                            : 'border-emerald-800/80 bg-emerald-950/60 hover:bg-emerald-900 text-emerald-200'
                        }`}
                        title="Sync current audit verdict to Firebase Firestore"
                      >
                        <Cloud className={`h-4 w-4 ${isSavingToCloud ? 'animate-bounce text-emerald-600' : 'text-emerald-500'}`} />
                        <span>{isSavingToCloud ? 'Saving...' : 'Save to Cloud'}</span>
                      </button>

                      <button
                        onClick={() => setCurrentView('scanner')}
                        className={`flex items-center gap-2 rounded-xl px-3.5 py-2 font-sans text-xs font-bold transition shadow-xs ${
                          isLight
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : `${theme.accentBg} text-white`
                        }`}
                      >
                        <FileVideo className="h-4 w-4" />
                        <span>Scan Video</span>
                      </button>
                      <button
                        onClick={() => setIsCutGuideOpen(true)}
                        className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 font-sans text-xs font-semibold transition ${
                          isLight
                            ? 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                            : 'border-slate-800 bg-slate-800 hover:bg-slate-750 text-slate-200'
                        }`}
                      >
                        <Scissors className="h-3.5 w-3.5 text-red-600" />
                        <span>Safe Cut Sheet</span>
                      </button>
                    </div>
                  </div>

                  {/* Cloud save notification */}
                  {cloudSaveMessage && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 dark:border-emerald-800 p-3 text-xs text-emerald-800 dark:text-emerald-200">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="font-medium">{cloudSaveMessage}</span>
                    </div>
                  )}

                  {/* Section: Audit Verdict Summary Card */}
                  {report && (
                    <AuditSummaryCard
                      report={report}
                      onOpenCutGuide={() => setIsCutGuideOpen(true)}
                      onOpenAppealModal={() => setCurrentView('appeal')}
                      isLight={isLight}
                    />
                  )}

                  {/* Section: Video Scanner Preview & Interactive Scrubber */}
                  <VideoScanner
                    currentVideoUrl={currentVideoUrl}
                    videoTitle={videoTitle}
                    videoDurationSec={videoDurationSec}
                    isScanning={isScanning}
                    scanProgress={scanProgress}
                    violations={report?.timelineViolations || []}
                    onUploadFile={handleUploadFile}
                    onSelectSample={handleSelectSample}
                    onTriggerAudit={handleTriggerAudit}
                    videoRef={videoRef}
                    currentTime={currentTime}
                    onSeek={handleSeek}
                    isLight={isLight}
                  />

                  {/* Section: Flagged Timeline Incidents */}
                  {report && (
                    <TimelineViolations
                      violations={report.timelineViolations}
                      onSeekToViolation={handleSeek}
                      isLight={isLight}
                    />
                  )}

                  {/* Section: Channel Health Historical Trend (10 Uploads) */}
                  <ChannelHealthTrend
                    history={uploadHistory}
                    isLight={isLight}
                  />

                  {/* Section: Firebase Cloud Vault (Persistent Multi-Device Audits) */}
                  <div
                    className={`rounded-2xl border p-4 sm:p-5 transition ${
                      isLight
                        ? 'border-slate-200/90 bg-white shadow-xs'
                        : 'border-slate-800/90 bg-slate-900/90 shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3 mb-4 border-slate-200/80 dark:border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                            <Cloud className="h-3.5 w-3.5" />
                            Firebase Firestore Database
                          </span>
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <h3 className={`mt-0.5 font-display text-base sm:text-lg font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                          Cloud Audit Records
                        </h3>
                      </div>

                      {currentUser ? (
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-slate-500">
                            Logged in as: <strong className="text-slate-700 dark:text-slate-300">{currentUser.email}</strong>
                          </span>
                          <button
                            onClick={handleSaveToCloud}
                            disabled={isSavingToCloud}
                            className={`rounded-lg px-2.5 py-1 text-xs font-semibold border ${
                              isLight
                                ? 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                                : 'border-emerald-800 bg-emerald-950/60 hover:bg-emerald-900 text-emerald-200'
                            }`}
                          >
                            {isSavingToCloud ? 'Saving...' : '+ Sync Current'}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={handleSignIn}
                          className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white dark:bg-slate-800 dark:border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-xs hover:bg-slate-50 transition"
                        >
                          <svg className="h-3 w-3" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"/>
                            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                          </svg>
                          <span>Connect Google to View Cloud Audits</span>
                        </button>
                      )}
                    </div>

                    {currentUser ? (
                      cloudReports.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {cloudReports.map((rec) => (
                            <div
                              key={rec.id}
                              className={`rounded-xl border p-3.5 flex flex-col justify-between gap-2 ${
                                isLight
                                  ? 'border-slate-200 bg-slate-50/70'
                                  : 'border-slate-800 bg-slate-950/70'
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <span className="font-mono text-[10px] text-slate-500 truncate">
                                    {rec.id}
                                  </span>
                                  <span
                                    className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-bold ${
                                      rec.safetyGrade === 'SAFE_TO_UPLOAD'
                                        ? 'bg-emerald-500/10 text-emerald-600'
                                        : 'bg-red-500/10 text-red-600'
                                    }`}
                                  >
                                    {rec.safetyGrade}
                                  </span>
                                </div>
                                <h4 className="font-sans font-bold text-xs sm:text-sm line-clamp-1">
                                  {rec.videoTitle}
                                </h4>
                                <p className="font-sans text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                                  {rec.summaryVerdictEn}
                                </p>
                              </div>
                              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px] font-mono">
                                <span>Compliance: <strong className="text-slate-900 dark:text-white">{Math.max(0, 100 - rec.overallRiskScore)}%</strong></span>
                                <span>Flags: <strong className="text-red-500">{rec.totalIssuesCount}</strong></span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-slate-500 font-sans text-xs">
                          <Cloud className="h-8 w-8 text-slate-400 mx-auto mb-2 opacity-60" />
                          <p className="font-medium">No video audits saved in your Firebase Cloud yet.</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Click &quot;Save to Cloud&quot; above to store this audit permanently to Firestore.
                          </p>
                        </div>
                      )
                    ) : (
                      <div className="text-center py-6 text-slate-500 font-sans text-xs">
                        <Cloud className="h-8 w-8 text-slate-400 mx-auto mb-2 opacity-60" />
                        <p className="font-medium">Firebase cloud synchronization is active and ready.</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Sign in with Google to preserve audit histories and strike appeal documents in Firestore.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* View 2: DEDICATED VIDEO SCANNER PAGE */}
              {currentView === 'scanner' && (
                <motion.div
                  key="view-scanner"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-6"
                >
                  <div
                    className={`rounded-2xl border p-4 sm:p-5 ${
                      isLight ? 'border-slate-200 bg-white shadow-xs' : 'border-slate-800 bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-red-600">
                          <FileVideo className="h-4 w-4" />
                          <span>Video Scanner & Ingest Engine</span>
                        </div>
                        <h2 className="mt-1 font-display text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                          Automated Community Guidelines Ingest Auditor
                        </h2>
                        <p className={`font-sans text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                          Extract high-resolution temporal keyframes client-side and cross-examine them against YouTube moderation policies.
                        </p>
                      </div>

                      <button
                        onClick={() => setCurrentView('violations')}
                        className={`hidden sm:flex items-center gap-1.5 rounded-xl border px-3 py-2 font-sans text-xs font-semibold transition ${
                          isLight
                            ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                            : 'border-slate-800 bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span>View Detected Flags</span>
                      </button>
                    </div>
                  </div>

                  <VideoScanner
                    currentVideoUrl={currentVideoUrl}
                    videoTitle={videoTitle}
                    videoDurationSec={videoDurationSec}
                    isScanning={isScanning}
                    scanProgress={scanProgress}
                    violations={report?.timelineViolations || []}
                    onUploadFile={handleUploadFile}
                    onSelectSample={handleSelectSample}
                    onTriggerAudit={handleTriggerAudit}
                    videoRef={videoRef}
                    currentTime={currentTime}
                    onSeek={handleSeek}
                    isLight={isLight}
                  />

                  {report && (
                    <TimelineViolations
                      violations={report.timelineViolations}
                      onSeekToViolation={handleSeek}
                      isLight={isLight}
                    />
                  )}
                </motion.div>
              )}

              {/* View 3: CHANNEL HEALTH & TREND ANALYTICS */}
              {currentView === 'analytics' && (
                <motion.div
                  key="view-analytics"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-6"
                >
                  <div
                    className={`rounded-2xl border p-4 sm:p-5 ${
                      isLight ? 'border-slate-200 bg-white shadow-xs' : 'border-slate-800 bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                      <Activity className="h-4 w-4" />
                      <span>Channel Health & Historical Compliance Record</span>
                    </div>
                    <h2 className="mt-1 font-display text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      Average Compliance Score Trend (Last 10 Uploads)
                    </h2>
                    <p className={`font-sans text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      Continuous temporal tracking of your channel standing across historical uploads. Protect your monetization standing and keep algorithmic trust high.
                    </p>
                  </div>

                  <ChannelHealthTrend
                    history={uploadHistory}
                    isLight={isLight}
                  />

                  {/* Historical Uploads Table */}
                  <div
                    className={`rounded-2xl border p-4 sm:p-5 ${
                      isLight ? 'border-slate-200 bg-white shadow-xs' : 'border-slate-800 bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b pb-3 mb-3">
                      <div>
                        <h3 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                          Channel Upload Ledger (Last 10 Videos)
                        </h3>
                        <p className="font-sans text-xs text-slate-500">
                          Comprehensive audit record of recent uploads
                        </p>
                      </div>
                      <span className="font-mono text-xs font-bold text-emerald-600 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
                        Channel Avg: {avgComplianceScore}%
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr
                            className={`border-b ${
                              isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'
                            }`}
                          >
                            <th className="py-2.5 px-2 font-mono font-bold uppercase text-[10px]">#</th>
                            <th className="py-2.5 px-3 font-mono font-bold uppercase text-[10px]">Date</th>
                            <th className="py-2.5 px-3 font-sans font-bold uppercase text-[10px]">Video Title</th>
                            <th className="py-2.5 px-3 font-mono font-bold uppercase text-[10px]">Compliance</th>
                            <th className="py-2.5 px-3 font-sans font-bold uppercase text-[10px]">Standing</th>
                            <th className="py-2.5 px-2 font-mono font-bold uppercase text-[10px] text-right">Audit</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800/40">
                          {uploadHistory.map((item, idx) => (
                            <tr
                              key={item.id}
                              className={`transition ${
                                isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/50'
                              }`}
                            >
                              <td className="py-3 px-2 font-mono text-slate-500">{idx + 1}</td>
                              <td className="py-3 px-3 font-mono text-slate-500">{item.date}</td>
                              <td className="py-3 px-3 font-sans font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[240px]">{item.title}</td>
                              <td className="py-3 px-3 font-mono font-bold tabular-nums">
                                <span
                                  className={
                                    item.complianceScore >= 80
                                      ? 'text-emerald-600'
                                      : item.complianceScore >= 50
                                      ? 'text-amber-600'
                                      : 'text-rose-600'
                                  }
                                >
                                  {item.complianceScore}%
                                </span>
                              </td>
                              <td className="py-3 px-3">
                                <span
                                  className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                                    item.status === 'SAFE_TO_UPLOAD'
                                      ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-200 dark:border-emerald-800/40'
                                      : item.status === 'MONETIZATION_AT_RISK'
                                      ? 'bg-amber-500/10 text-amber-600 border border-amber-200 dark:border-amber-800/40'
                                      : 'bg-rose-500/10 text-rose-600 border border-rose-200 dark:border-rose-800/40'
                                  }`}
                                >
                                  {item.status === 'SAFE_TO_UPLOAD'
                                    ? 'CLEAN'
                                    : item.status === 'MONETIZATION_AT_RISK'
                                    ? 'YELLOW'
                                    : 'STRIKE RISK'}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-right">
                                <button
                                  onClick={() => {
                                    setVideoTitle(item.title);
                                    setCurrentView('scanner');
                                  }}
                                  className={`rounded-lg px-2.5 py-1 font-sans text-[11px] font-semibold transition ${
                                    isLight
                                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                                  }`}
                                >
                                  Load
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* View 4: POLICY FLAGS & SAFE CUTS */}
              {currentView === 'violations' && (
                <motion.div
                  key="view-violations"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-6"
                >
                  <div
                    className={`rounded-2xl border p-4 sm:p-5 ${
                      isLight ? 'border-slate-200 bg-white shadow-xs' : 'border-slate-800 bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-rose-600">
                      <Scissors className="h-4 w-4" />
                      <span>Policy Flags & Editing Remediation Sheet</span>
                    </div>
                    <h2 className="mt-1 font-display text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      Frame-Accurate Video Trims & Blurs
                    </h2>
                    <p className={`font-sans text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      Trim or blur these exact timestamps in CapCut, Premiere Pro, or DaVinci Resolve to guarantee 100% compliance before publishing to YouTube.
                    </p>
                  </div>

                  {report && (
                    <TimelineViolations
                      violations={report.timelineViolations}
                      onSeekToViolation={handleSeek}
                      isLight={isLight}
                    />
                  )}

                  {report && (
                    <SafeCutGuideModal
                      isOpen={true}
                      isEmbedded={true}
                      isLight={isLight}
                      report={report}
                    />
                  )}
                </motion.div>
              )}

              {/* View 5: OFFICIAL YOUTUBE STRIKE APPEAL KIT */}
              {currentView === 'appeal' && (
                <motion.div
                  key="view-appeal"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-6"
                >
                  <div
                    className={`rounded-2xl border p-4 sm:p-5 ${
                      isLight ? 'border-slate-200 bg-white shadow-xs' : 'border-slate-800 bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                      <FileText className="h-4 w-4" />
                      <span>Official YouTube Strike Appeal Kit</span>
                    </div>
                    <h2 className="mt-1 font-display text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      Counter-Appeal Generator (EDSA Exceptions)
                    </h2>
                    <p className={`font-sans text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      Generates compliant, high-approval legal counter-appeals citing YouTube Educational, Documentary, Scientific, or Artistic exceptions within YouTube Studio's 800-character ceiling.
                    </p>
                  </div>

                  {report && (
                    <AppealGeneratorModal
                      isOpen={true}
                      isEmbedded={true}
                      isLight={isLight}
                      report={report}
                    />
                  )}
                </motion.div>
              )}

              {/* View 6: YOUTUBE POLICY ENCYCLOPEDIA */}
              {currentView === 'knowledge' && (
                <motion.div
                  key="view-knowledge"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-6"
                >
                  <div
                    className={`rounded-2xl border p-4 sm:p-5 ${
                      isLight ? 'border-slate-200 bg-white shadow-xs' : 'border-slate-800 bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-rose-600">
                      <BookOpen className="h-4 w-4" />
                      <span>YouTube Community Guidelines Encyclopedia</span>
                    </div>
                    <h2 className="mt-1 font-display text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      Public vs Unlisted vs Private & 3-Strikes Master Guide
                    </h2>
                    <p className={`font-sans text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      Comprehensive analysis of how automated algorithms inspect videos across all visibility states, how strikes escalate to channel closure, and how to stay 100% compliant.
                    </p>
                  </div>

                  <PolicyKnowledgeBase
                    isOpen={true}
                    isEmbedded={true}
                    isLight={isLight}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Clean Creator Footer */}
      <footer
        className={`border-t py-6 text-xs transition mb-14 md:mb-0 ${
          isLight
            ? 'border-slate-200 bg-white text-slate-500'
            : 'border-slate-900 bg-slate-950/90 text-slate-500'
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <span
              className={`font-display font-bold ${
                isLight ? 'text-slate-800' : 'text-slate-300'
              }`}
            >
              StrikeGuard AI
            </span>
            <span>·</span>
            <span className="font-sans text-slate-500">
              YouTube Community Guidelines & Algorithmic Strike Pre-Auditor
            </span>
          </div>

          <div className="flex items-center gap-4 font-sans text-[11px]">
            <button
              onClick={() => setCurrentView('knowledge')}
              className={`transition flex items-center gap-1 font-medium ${
                isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Info className="h-3.5 w-3.5 text-red-600" />
              <span>YouTube Rules & Guidelines</span>
            </button>
            <span>·</span>
            <button
              onClick={() => setCurrentView('appeal')}
              className={`transition font-medium ${
                isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              Strike Appeal Kit
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (Thumb-Friendly on Phones) */}
      <MobileBottomNav
        currentView={currentView}
        onSelectView={setCurrentView}
        theme={theme}
        violationsCount={report?.timelineViolations.length || 0}
      />

      {/* Pop-up Modals */}
      {report && (
        <>
          <AppealGeneratorModal
            isOpen={isAppealModalOpen}
            onClose={() => setIsAppealModalOpen(false)}
            report={report}
            isLight={isLight}
          />

          <SafeCutGuideModal
            isOpen={isCutGuideOpen}
            onClose={() => setIsCutGuideOpen(false)}
            report={report}
            isLight={isLight}
          />
        </>
      )}

      <PolicyKnowledgeBase
        isOpen={isKnowledgeBaseOpen}
        onClose={() => setIsKnowledgeBaseOpen(false)}
        isLight={isLight}
      />
    </div>
  );
}
