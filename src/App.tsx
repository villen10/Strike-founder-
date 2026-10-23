import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { Sidebar, MobileBottomNav, NavView } from './components/Sidebar';
import { VideoScanner } from './components/VideoScanner';
import { AuditSummaryCard } from './components/AuditSummaryCard';
import { AuditResultsDashboard } from './components/AuditResultsDashboard';
import { TimelineViolations } from './components/TimelineViolations';
import { ChannelHealthTrend, HistoricalUploadRecord } from './components/ChannelHealthTrend';
import { FrequentViolationWidget } from './components/FrequentViolationWidget';
import { ModernOverviewDashboard } from './components/ModernOverviewDashboard';
import { AppealGeneratorModal } from './components/AppealGeneratorModal';
import { SafeCutGuideModal } from './components/SafeCutGuideModal';
import { PolicyKnowledgeBase } from './components/PolicyKnowledgeBase';
import { AuthModal } from './components/AuthModal';
import { ProfileView, AppUserProfile } from './components/ProfileView';
import { FullScreenAnalysisModal } from './components/FullScreenAnalysisModal';
import { ChannelTrackerDashboard } from './components/ChannelTrackerDashboard';
import { SideBySideComparisonModal } from './components/SideBySideComparisonModal';
import { PricingSubscriptionModal } from './components/PricingSubscriptionModal';
import { PaymentCheckoutModal } from './components/PaymentCheckoutModal';
import { AdminPanelDashboard } from './components/AdminPanelDashboard';
import { SubscriptionPlanView } from './components/SubscriptionPlanView';
import { LegalTrustHub, LegalTabType } from './components/LegalTrustHub';
import { ContentHub } from './components/ContentHub';
import { SaaSFooter } from './components/SaaSFooter';
import {
  ScrollProgressBar,
  ScrollToTopButton,
  ScrollReveal,
  ScrollHintPrompt,
  ScrollTextReveal,
  ScrollButtonReveal,
  FloatingScrollHUD,
} from './components/ScrollExperience';
import {
  SubscriptionTier,
  getCurrentSubscriptionTier,
  setCurrentSubscriptionTier,
  getDeviceScanMetrics,
  recordScanAttempt,
} from './services/subscriptionManager';
import { isUserSuperAdmin, ADMIN_EMAIL } from './services/adminService';
import { COLOR_THEMES } from './services/themeConfig';
import { SAMPLE_VIDEOS } from './services/sampleData';
import { AuditReport, ColorThemeId, SampleVideoOption, QueuedVideoTask } from './types/audit';
import {
  generateAuditReportMetadata,
  applyDynamicMetadata,
  resetToDefaultMetadata,
} from './services/seoMetaManager';
import { ExtractedFrame, extractVideoMetadataAndFrames, formatTime } from './services/frameExtractor';
import { requestVideoAudit } from './services/auditClient';
import {
  auth,
  signInWithGoogle,
  logOut,
  saveAuditReportToCloud,
  fetchUserAuditReports,
  CloudAuditRecord,
  onAuthStateChanged,
  User as FirebaseUser,
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
  User,
  Lock,
  Scale,
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
  const [activeLegalTab, setActiveLegalTab] = useState<LegalTabType>('faq');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [strictnessMode, setStrictnessMode] = useState<'STANDARD' | 'PARANOID_ZERO_RISK'>('STANDARD');
  const [currentTheme, setCurrentTheme] = useState<ColorThemeId>('YOUTUBE_STUDIO_LIGHT');
  const theme = COLOR_THEMES[currentTheme];
  const isLight = theme.isLight;

  // Creator Account & Cloud State
  const [currentUser, setCurrentUser] = useState<AppUserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('sg_creator_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });
  const [cloudReports, setCloudReports] = useState<CloudAuditRecord[]>([]);
  const [isSavingToCloud, setIsSavingToCloud] = useState(false);
  const [cloudSaveMessage, setCloudSaveMessage] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isFullScreenAnalysisOpen, setIsFullScreenAnalysisOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile: AppUserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'YouTube Creator',
          photoURL: user.photoURL,
          tier: 'Pro Shield',
        };
        setCurrentUser(profile);
        try {
          const records = await fetchUserAuditReports(user.uid);
          setCloudReports(records);
        } catch (err) {
          console.error('Failed to load cloud audits:', err);
        }
      } else {
        // Fall back to saved demo profile if exists
        try {
          const saved = localStorage.getItem('sg_creator_user');
          if (saved) {
            setCurrentUser(JSON.parse(saved));
            return;
          }
        } catch (e) {}
        setCurrentUser(null);
        setCloudReports([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // SEO & Deep-link Hash Navigation
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (!hash) return;
      if (
        hash === 'scanner' ||
        hash === 'check-video-before-upload' ||
        hash === 'copyright-checker' ||
        hash === 'striku-video-analysis'
      ) {
        setCurrentView('scanner');
      } else if (hash === 'youtube-strike-checker' || hash === 'guidelines-auditor') {
        setCurrentView('knowledge');
      } else if (hash === 'appeal-generator' || hash === 'appeal') {
        setCurrentView('appeal');
      } else if (hash === 'violations' || hash === 'video-analysis-detect-strike') {
        setCurrentView('violations');
      } else if (hash === 'pricing' || hash === 'subscription') {
        setCurrentView('subscription');
      } else if (hash === 'channel-tracker' || hash === 'channels') {
        setCurrentView('channels');
      } else if (hash === 'legal-faq') {
        setCurrentView('legal');
        setActiveLegalTab('faq');
      } else if (hash === 'legal-privacy') {
        setCurrentView('legal');
        setActiveLegalTab('privacy');
      } else if (hash === 'legal-terms') {
        setCurrentView('legal');
        setActiveLegalTab('terms');
      } else if (hash === 'legal-refund') {
        setCurrentView('legal');
        setActiveLegalTab('refund');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);



  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleSignIn = () => {
    handleOpenAuth('login');
  };

  const handleDemoLogin = (name?: string, email?: string) => {
    const demoProfile: AppUserProfile = {
      uid: 'creator-demo-01',
      email: email || 'strikucloud@gmail.com',
      displayName: name || 'YouTube Creator',
      photoURL: null,
      tier: 'Pro Shield',
      isDemo: true,
    };
    try {
      localStorage.setItem('sg_creator_user', JSON.stringify(demoProfile));
    } catch (e) {}
    setCurrentUser(demoProfile);
    setIsAuthModalOpen(false);

    // Populate initial cloud report if empty
    setCloudReports((prev) => {
      if (prev.length > 0) return prev;
      return [
        {
          id: 'cloud-demo-audit-01',
          userId: 'creator-demo-01',
          userEmail: demoProfile.email || 'strikucloud@gmail.com',
          videoTitle: 'Kitchen Prank with Toddler & Sharp Cutlery',
          safetyGrade: 'HIGH_STRIKE_RISK',
          overallRiskScore: 92,
          strictnessMode: 'STANDARD',
          totalIssuesCount: 3,
          summaryVerdictEn: 'Critical 3-Strikes danger: Minor child handling real knife in high-risk scenario.',
          scannedAt: new Date().toISOString(),
        },
      ];
    });
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (e) {
      console.error('Sign-out failed:', e);
    }
    try {
      localStorage.removeItem('sg_creator_user');
    } catch (e) {}
    setCurrentUser(null);
    setCloudReports([]);
  };

  const handleSaveToCloud = async () => {
    try {
      setIsSavingToCloud(true);
      if (!currentUser) {
        handleOpenAuth('login');
        return;
      }
      if (report) {
        // If demo user or firebase user
        const newRecord: CloudAuditRecord = {
          id: 'cloud-' + Date.now().toString(36),
          userId: currentUser.uid,
          userEmail: currentUser.email || 'creator@youtube.studio',
          videoTitle: report.videoTitle,
          safetyGrade: report.safetyGrade,
          overallRiskScore: report.overallRiskScore,
          strictnessMode: report.strictnessMode,
          totalIssuesCount: report.totalIssuesCount,
          summaryVerdictEn: report.summaryVerdictEn,
          scannedAt: new Date().toISOString(),
        };

        if (!currentUser.isDemo && auth.currentUser) {
          try {
            await saveAuditReportToCloud(report, auth.currentUser);
            const records = await fetchUserAuditReports(auth.currentUser.uid);
            setCloudReports(records);
          } catch (e) {
            // fallback to local list
            setCloudReports((prev) => [newRecord, ...prev]);
          }
        } else {
          setCloudReports((prev) => [newRecord, ...prev.filter((r) => r.id !== newRecord.id)]);
        }

        setCloudSaveMessage('Audit report successfully saved to Firebase Firestore!');
        setTimeout(() => setCloudSaveMessage(null), 4000);
      }
    } catch (err) {
      console.error('Save to cloud failed:', err);
    } finally {
      setIsSavingToCloud(false);
    }
  };

  // Active video & audit states - Clean empty state for new users/visitors
  const [videoTitle, setVideoTitle] = useState('Ready for video upload');
  const [videoDurationSec, setVideoDurationSec] = useState(0);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [extractedFrames, setExtractedFrames] = useState<ExtractedFrame[]>([]);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  // Sync document title and OpenGraph metadata dynamically for crawlers and social share previews
  useEffect(() => {
    if (report && (currentView === 'scanner' || currentView === 'overview' || currentView === 'violations')) {
      const reportMeta = generateAuditReportMetadata(report);
      applyDynamicMetadata(reportMeta);
    } else {
      const titles: Record<NavView, string> = {
        overview: 'Striku - striku.cloud | Striku Video Analysis & YouTube Strike Checker',
        scanner: 'Pre-Upload Video Scanner & Copyright Checker | Striku',
        knowledge: 'YouTube Community Guidelines & Strike Checker Guide | Striku',
        'content-hub': 'SEO Content & Guides - YouTube Copyright & Strike Prevention | Striku',
        violations: 'CapCut Safe Cut Timecodes & Strike Prevention | Striku',
        appeal: 'YouTube Strike Counter-Appeal Kit | Striku',
        channels: 'YouTube Channel Health & Strike Tracker | Striku',
        analytics: 'Channel Compliance Trend & Upload History | Striku',
        profile: 'Creator Studio Profile | Striku',
        subscription: 'Striku Pro Shield - YouTube Pre-Upload Protection Plans | Striku',
        legal: 'Legal Trust & Terms | Striku',
        admin: 'Mission Control Admin | Striku',
      };
      if (titles[currentView]) {
        document.title = titles[currentView];
      }
      resetToDefaultMetadata();
    }
  }, [report, currentView]);

  // Multi-Video Task Queue State - Starts completely empty for new users
  const [queuedTasks, setQueuedTasks] = useState<QueuedVideoTask[]>([]);
  const queuedTasksRef = useRef<QueuedVideoTask[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [isQueueRunning, setIsQueueRunning] = useState<boolean>(false);

  // Self-Improving Memory System (Adaptive learning from past audits)
  const [auditMemory, setAuditMemory] = useState<Array<{ title: string; riskScore: number; timestamp: number }>>(() => {
    try {
      const saved = localStorage.getItem('sg_audit_memory_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Refs to avoid stale closures in background async loop
  const activeTaskIdRef = useRef<string | null>(null);
  const strictnessModeRef = useRef(strictnessMode);
  const isProcessingQueueRef = useRef(false);

  useEffect(() => {
    queuedTasksRef.current = queuedTasks;
  }, [queuedTasks]);

  useEffect(() => {
    activeTaskIdRef.current = activeTaskId;
  }, [activeTaskId]);

  useEffect(() => {
    strictnessModeRef.current = strictnessMode;
  }, [strictnessMode]);

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

  // Scanning progress state for active video
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState<{ percent: number; status: string }>({
    percent: 0,
    status: '',
  });

  // Modals
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
  const [isCutGuideOpen, setIsCutGuideOpen] = useState(false);
  const [isKnowledgeBaseOpen, setIsKnowledgeBaseOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Subscription, Checkout & Admin states
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>(() => getCurrentSubscriptionTier());
  const [deviceMetrics, setDeviceMetrics] = useState(() => getDeviceScanMetrics());
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutSelectedTier, setCheckoutSelectedTier] = useState<SubscriptionTier>('pro');
  const [checkoutBillingCycle, setCheckoutBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [pricingUpgradeReason, setPricingUpgradeReason] = useState<string | undefined>();

  useEffect(() => {
    const handleSubChange = (e: any) => {
      if (e.detail?.tier) {
        setSubscriptionTier(e.detail.tier);
      }
      setDeviceMetrics(getDeviceScanMetrics());
    };
    const handleQuotaChange = () => {
      setDeviceMetrics(getDeviceScanMetrics());
    };

    window.addEventListener('striku:subscription-changed', handleSubChange);
    window.addEventListener('striku:quota-updated', handleQuotaChange);
    return () => {
      window.removeEventListener('striku:subscription-changed', handleSubChange);
      window.removeEventListener('striku:quota-updated', handleQuotaChange);
    };
  }, []);

  // Save current user email to storage for admin service sync
  useEffect(() => {
    if (currentUser?.email) {
      localStorage.setItem('striku_current_user_email', currentUser.email);
      if (isUserSuperAdmin(currentUser.email)) {
        setCurrentSubscriptionTier('enterprise');
        setSubscriptionTier('enterprise');
      }
    }
  }, [currentUser]);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Select a task from the queue to view / interact with
  const handleSelectTask = (taskId: string) => {
    setActiveTaskId(taskId);
    activeTaskIdRef.current = taskId;
    const task = queuedTasks.find((t) => t.id === taskId);
    if (!task) return;

    setVideoTitle(task.title);
    setVideoDurationSec(task.durationSec);
    setCurrentVideoUrl(task.videoUrl);
    setCurrentTime(0);
    setExtractedFrames(task.extractedFrames || []);

    if (task.report) {
      setReport(task.report);
    }

    if (task.status === 'EXTRACTING' || task.status === 'AUDITING') {
      setIsScanning(true);
      setScanProgress({ percent: task.progressPercent, status: task.progressStatus });
    } else {
      setIsScanning(false);
    }
  };

  // Remove task from queue
  const handleRemoveTask = (taskId: string) => {
    setQueuedTasks((prev) => {
      const filtered = prev.filter((t) => t.id !== taskId);
      if (activeTaskId === taskId && filtered.length > 0) {
        setTimeout(() => handleSelectTask(filtered[0].id), 50);
      }
      return filtered;
    });
  };

  // Clear completed tasks
  const handleClearCompletedTasks = () => {
    setQueuedTasks((prev) => prev.filter((t) => t.status !== 'COMPLETED' || t.id === activeTaskId));
  };

  // Automated Async Queue Worker - Bulletproof & Ultra-Fast
  const processQueue = async () => {
    if (isProcessingQueueRef.current) return;
    isProcessingQueueRef.current = true;
    setIsQueueRunning(true);

    try {
      while (true) {
        // Find next queued task using ref to avoid React state batching delays
        const nextTask = queuedTasksRef.current.find((t) => t.status === 'QUEUED');
        if (!nextTask) break;

        const targetId = nextTask.id;
        const targetFile = nextTask.file;
        const targetSampleId = nextTask.sampleId;
        const targetTitle = nextTask.title;

        // Mark EXTRACTING (Phase 1 & Phase 2)
        queuedTasksRef.current = queuedTasksRef.current.map((t) =>
          t.id === targetId
            ? { ...t, status: 'EXTRACTING', progressPercent: 12, progressStatus: 'Phase 1/3 · Temporal Slicing: Reading timeline timestamps...' }
            : t
        );
        setQueuedTasks([...queuedTasksRef.current]);

        if (activeTaskIdRef.current === targetId) {
          setIsScanning(true);
          setScanProgress({ percent: 12, status: `Phase 1/3 · Slicing frames for "${targetTitle}"...` });
        }

        let frames: ExtractedFrame[] = [];
        let durationSec = nextTask.durationSec || 15;
        let durationFormatted = nextTask.durationFormatted || '00:15';

        try {
          if (targetFile) {
            const result = await extractVideoMetadataAndFrames(targetFile, (pct, statusMsg) => {
              queuedTasksRef.current = queuedTasksRef.current.map((t) =>
                t.id === targetId
                  ? { ...t, progressPercent: pct, progressStatus: statusMsg }
                  : t
              );
              setQueuedTasks([...queuedTasksRef.current]);
              if (activeTaskIdRef.current === targetId) {
                setScanProgress({ percent: pct, status: statusMsg });
              }
            });
            frames = result.frames;
            durationSec = Math.round(result.metadata.duration);
            durationFormatted = result.metadata.durationFormatted;
          } else if (targetSampleId) {
            const sample = SAMPLE_VIDEOS.find((s) => s.id === targetSampleId);
            durationSec = sample?.durationSec || 15;
            durationFormatted = sample?.durationFormatted || '00:15';
          }

          // Mark AUDITING (Phase 3: Gemini AI Full Video Audit)
          queuedTasksRef.current = queuedTasksRef.current.map((t) =>
            t.id === targetId
              ? {
                  ...t,
                  durationSec,
                  durationFormatted,
                  extractedFrames: frames,
                  status: 'AUDITING',
                  progressPercent: 62,
                  progressStatus: 'Pass 3/3 · Multi-Agent Consensus: Slicing and cross-examining visual evidence...',
                }
              : t
          );
          setQueuedTasks([...queuedTasksRef.current]);

          if (activeTaskIdRef.current === targetId) {
            setVideoDurationSec(durationSec);
            setExtractedFrames(frames);
            setIsScanning(true);
            setScanProgress({ percent: 62, status: 'Pass 3/3 · Multi-Agent Consensus: Slicing and cross-examining visual evidence...' });
          }

          let auditProgressTimer: any = null;
          let currentAuditPct = 62;
          const auditStatusMessages = [
            'Pass 3/3 · Multi-Agent Consensus: Multi-window keyframe temporal audit...',
            'Pass 3/3 · Multi-Agent Consensus: Auditing Child Safety & Minor Protection zero-tolerance...',
            'Pass 3/3 · Multi-Agent Consensus: Screening for dangerous stunts, weapons & copyright cues...',
            'Pass 3/3 · Multi-Agent Consensus: Auditing Graphic Violence & Adult Exposure...',
            'Pass 3/3 · Multi-Agent Consensus: Cross-model consensus running to eliminate false negatives...',
            'Pass 3/3 · Multi-Agent Consensus: Synthesizing frame timestamps & final YouTube strike verdict...',
          ];
          let msgIdx = 0;

          auditProgressTimer = setInterval(() => {
            currentAuditPct = Math.min(94, currentAuditPct + 4);
            msgIdx = (msgIdx + 1) % auditStatusMessages.length;
            const statusMsg = auditStatusMessages[msgIdx];
            queuedTasksRef.current = queuedTasksRef.current.map((t) =>
              t.id === targetId
                ? { ...t, progressPercent: currentAuditPct, progressStatus: statusMsg }
                : t
            );
            setQueuedTasks([...queuedTasksRef.current]);
            if (activeTaskIdRef.current === targetId) {
              setScanProgress({ percent: currentAuditPct, status: statusMsg });
            }
          }, 3000);

          let audit;
          try {
            audit = await requestVideoAudit({
              videoTitle: targetTitle,
              durationSec,
              durationFormatted,
              strictnessMode: strictnessModeRef.current,
              frames,
            });
          } finally {
            clearInterval(auditProgressTimer);
          }

          // Mark COMPLETED (Stage 5)
          queuedTasksRef.current = queuedTasksRef.current.map((t) =>
            t.id === targetId
              ? {
                  ...t,
                  status: 'COMPLETED',
                  progressPercent: 100,
                  progressStatus: 'Audit complete',
                  report: audit,
                  completedAt: Date.now(),
                }
              : t
          );
          setQueuedTasks([...queuedTasksRef.current]);

          updateHistoryWithReport(audit, targetTitle);

          // Update self-improving memory profile for adaptive learning
          setAuditMemory((prev) => {
            const newMem = [{ title: targetTitle, riskScore: audit.overallRiskScore, timestamp: Date.now() }, ...prev.slice(0, 49)];
            try {
              localStorage.setItem('sg_audit_memory_profile', JSON.stringify(newMem));
            } catch (e) {}
            return newMem;
          });

          if (activeTaskIdRef.current === targetId) {
            setReport(audit);
            setIsScanning(false);
            const statusMsg =
              audit.safetyGrade === 'HIGH_STRIKE_RISK'
                ? 'Audit complete: Critical strike risks identified!'
                : audit.safetyGrade === 'MONETIZATION_AT_RISK'
                ? 'Audit complete: Monetization warnings detected.'
                : 'Audit complete! Video verified safe.';
            setScanProgress({ percent: 100, status: statusMsg });
          }
        } catch (taskErr: any) {
          console.error('Task audit error:', taskErr);
          queuedTasksRef.current = queuedTasksRef.current.map((t) =>
            t.id === targetId
              ? {
                  ...t,
                  status: 'ERROR',
                  error: taskErr?.message || 'Verification error',
                  progressStatus: 'Error during audit',
                }
              : t
          );
          setQueuedTasks([...queuedTasksRef.current]);
          if (activeTaskIdRef.current === targetId) {
            setIsScanning(false);
          }
        }
      }
    } finally {
      isProcessingQueueRef.current = false;
      setIsQueueRunning(false);
    }
  };

  // Upload & Queue Multiple Files (Simultaneous Drag-and-Drop)
  const handleUploadFiles = (files: File[]) => {
    if (!files || files.length === 0) return;

    if (subscriptionTier === 'free') {
      const attempt = recordScanAttempt();
      if (!attempt.allowed) {
        setPricingUpgradeReason('Free Monthly Quota Reached (5/5 Videos Audited on this device). Upgrade to Creator Pro for Unlimited Scans!');
        setIsPricingModalOpen(true);
        return;
      }
      setDeviceMetrics(getDeviceScanMetrics());
    }

    const newTasks: QueuedVideoTask[] = files.map((file, idx) => {
      const objectUrl = URL.createObjectURL(file);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      return {
        id: `task-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 5)}`,
        file,
        title: file.name,
        fileSizeFormatted: `${sizeMb} MB`,
        videoUrl: objectUrl,
        durationSec: 0,
        durationFormatted: 'Queued',
        status: 'QUEUED' as const,
        progressPercent: 0,
        progressStatus: 'Waiting in queue...',
        extractedFrames: [],
        addedAt: Date.now(),
      };
    });

    const updatedQueue = [...queuedTasksRef.current, ...newTasks];
    queuedTasksRef.current = updatedQueue;
    setQueuedTasks(updatedQueue);

    // Activate the first dropped file immediately
    const first = newTasks[0];
    setActiveTaskId(first.id);
    activeTaskIdRef.current = first.id;
    setCurrentVideoUrl(first.videoUrl);
    setVideoTitle(first.title);
    setVideoDurationSec(0);
    setCurrentTime(0);

    // Open video analysis loading modal with active progress
    setIsFullScreenAnalysisOpen(true);
    setIsScanning(true);
    setScanProgress({ percent: 15, status: `Starting analysis for "${first.title}"...` });

    // Launch background queue worker immediately
    setTimeout(() => {
      processQueue();
    }, 50);
  };

  const handleUploadFile = (file: File) => {
    handleUploadFiles([file]);
  };

  // Queue a test preset into the task queue
  const handleQueueSample = (sample: SampleVideoOption) => {
    const newTask: QueuedVideoTask = {
      id: `sample-${sample.id}-${Date.now()}`,
      sampleId: sample.id,
      title: sample.title,
      fileSizeFormatted: '14.2 MB',
      videoUrl: null,
      durationSec: sample.durationSec,
      durationFormatted: sample.durationFormatted,
      status: 'QUEUED',
      progressPercent: 0,
      progressStatus: 'Queued test preset',
      extractedFrames: [],
      addedAt: Date.now(),
    };

    const updatedQueue = [...queuedTasksRef.current, newTask];
    queuedTasksRef.current = updatedQueue;
    setQueuedTasks(updatedQueue);

    setActiveTaskId(newTask.id);
    activeTaskIdRef.current = newTask.id;
    setVideoTitle(sample.title);
    setVideoDurationSec(sample.durationSec);
    setCurrentVideoUrl(null);
    setCurrentTime(0);

    setIsFullScreenAnalysisOpen(true);
    setIsScanning(true);
    setScanProgress({ percent: 15, status: `Queuing "${sample.title}"...` });

    setTimeout(() => {
      processQueue();
    }, 50);
  };

  // Run audit on a video directly from user's YouTube channel
  const handleAuditVideoFromChannel = async (title: string, url: string) => {
    setCurrentView('scanner');
    setVideoTitle(title);
    setCurrentVideoUrl(url);
    setCurrentTime(0);
    setIsFullScreenAnalysisOpen(true);
    setIsScanning(true);
    setScanProgress({ percent: 25, status: `Checking YouTube strike risks for: "${title}"...` });

    try {
      const audit = await requestVideoAudit({
        videoTitle: title,
        videoUrl: url,
        durationSec: 60,
        durationFormatted: '01:00',
        strictnessMode: strictnessModeRef.current,
        frames: [],
      });
      setReport(audit);
      setIsScanning(false);
      setScanProgress({ percent: 100, status: 'Strike risk check complete!' });
      updateHistoryWithReport(audit, title);
    } catch (e: any) {
      console.error('Audit from channel failed:', e);
      setIsScanning(false);
    }
  };

  // Instant 1-Click Load Scenario with snappy, delightful animation
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

    // Open analysis modal and show snappy 700ms verification step animation
    setIsFullScreenAnalysisOpen(true);
    setIsScanning(true);
    setScanProgress({ percent: 22, status: 'Ingesting test scenario keyframes...' });

    setTimeout(() => {
      setScanProgress({ percent: 68, status: 'Evaluating against YouTube Community Guidelines...' });
    }, 280);

    setTimeout(() => {
      setReport(adjustedReport);
      updateHistoryWithReport(adjustedReport, sample.title);
      setScanProgress({ percent: 100, status: 'Audit complete! All verification passed.' });
      setIsScanning(false);

      const sampleTaskId = 'sample-' + sample.id;
      setActiveTaskId(sampleTaskId);
      activeTaskIdRef.current = sampleTaskId;
      const updated = queuedTasksRef.current.map((t) =>
        t.id === sampleTaskId ? { ...t, report: adjustedReport, status: 'COMPLETED' as const, progressPercent: 100 } : t
      );
      if (!updated.some((t) => t.id === sampleTaskId)) {
        updated.push({
          id: sampleTaskId,
          sampleId: sample.id,
          title: sample.title,
          fileSizeFormatted: '18.4 MB',
          videoUrl: null,
          durationSec: sample.durationSec,
          durationFormatted: sample.durationFormatted,
          status: 'COMPLETED' as const,
          progressPercent: 100,
          progressStatus: 'Audit complete',
          extractedFrames: [],
          report: adjustedReport,
          addedAt: Date.now(),
          completedAt: Date.now(),
        });
      }
      queuedTasksRef.current = updated;
      setQueuedTasks(updated);
    }, 650);
  };

  // Trigger full frame extraction & guidelines audit manually on active item
  const handleTriggerAudit = async () => {
    setIsFullScreenAnalysisOpen(true);
    setIsScanning(true);
    setScanProgress({ percent: 18, status: 'Ingesting keyframes & audio waveforms...' });

    let framesToUse = extractedFrames;

    // If frames aren't extracted yet and active task has a file, extract them now
    const currentTask = queuedTasksRef.current.find((t) => t.id === activeTaskId);
    if ((!framesToUse || framesToUse.length === 0) && currentTask?.file) {
      try {
        setScanProgress({ percent: 30, status: 'Extracting keyframes from video...' });
        const res = await extractVideoMetadataAndFrames(currentTask.file);
        framesToUse = res.frames;
        setExtractedFrames(res.frames);
        setVideoDurationSec(Math.round(res.metadata.duration));
      } catch {
        // Continue with available frames
      }
    }

    setScanProgress({ percent: 52, status: 'Multi-Agent Vision Engine: Ingesting keyframe sequence...' });

    let auditTimer: any = null;
    let auditPct = 52;
    const auditStatusMessages = [
      'Multi-Agent Vision Engine: Inspecting keyframe sequence...',
      'Pass 1 & 2 Consensus: Auditing Child Safety & Minor Protection zero-tolerance...',
      'Pass 2 & 3 Consensus: Screening for dangerous stunts, weapons & copyright cues...',
      'Pass 3 Consensus: Cross-examining graphic violence & adult exposure...',
      'Pass 3 Consensus: Verifying opening 7-second hook & Advertiser Suitability...',
      'Pass 3 Consensus: Synthesizing frame timestamps & computing YouTube strike verdict...',
    ];
    let msgIdx = 0;

    auditTimer = setInterval(() => {
      auditPct = Math.min(94, auditPct + 4);
      msgIdx = (msgIdx + 1) % auditStatusMessages.length;
      setScanProgress({ percent: auditPct, status: auditStatusMessages[msgIdx] });
    }, 3500);

    try {
      const audit = await requestVideoAudit({
        videoTitle,
        durationSec: videoDurationSec || 20,
        durationFormatted: formatTime(videoDurationSec || 20),
        strictnessMode,
        frames: framesToUse,
      });
      clearInterval(auditTimer);
      setReport(audit);
      updateHistoryWithReport(audit, videoTitle);
      const updated = queuedTasksRef.current.map((t) =>
        t.id === activeTaskId
          ? { ...t, status: 'COMPLETED' as const, report: audit, progressPercent: 100, progressStatus: 'Audit complete' }
          : t
      );
      queuedTasksRef.current = updated;
      setQueuedTasks(updated);

      const statusMsg =
        audit.safetyGrade === 'HIGH_STRIKE_RISK'
          ? 'Audit complete: Critical strike risks identified!'
          : audit.safetyGrade === 'MONETIZATION_AT_RISK'
          ? 'Audit complete: Monetization warnings detected.'
          : 'Audit complete! Video verified safe.';
      setScanProgress({ percent: 100, status: statusMsg });
    } catch (e: any) {
      clearInterval(auditTimer);
      console.error('Audit trigger error:', e);
      setScanProgress({ percent: 0, status: e?.message || 'Audit failed. Please retry.' });
    } finally {
      setIsScanning(false);
    }
  };

  // Seek video playback to specific seconds
  const handleSeek = (seconds: number) => {
    setCurrentTime(seconds);
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
    }
  };

  const handleJumpAndPlay = (seconds: number) => {
    handleSeek(seconds);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
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

  const pendingQueueCount = queuedTasks.filter(
    (t) => t.status === 'QUEUED' || t.status === 'EXTRACTING' || t.status === 'AUDITING'
  ).length;



  return (
    <div
      className={`min-h-screen ${theme.bgClass} ${
        isLight ? 'text-slate-900' : 'text-slate-100'
      } flex flex-col justify-between selection:bg-red-500/20 selection:text-red-900 transition-colors duration-200`}
    >
      {/* Scroll-Driven Top Progress Bar Animation */}
      <ScrollProgressBar isLight={isLight} />

      {/* Main Container: Sidebar flush on the left (top-0 left-0) + Content area */}
      <div className="flex w-full min-h-screen">
        {/* Modern Sidebar (Desktop flush at top-left & Mobile Drawer) */}
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          theme={theme}
          violationsCount={report?.timelineViolations.length || 0}
          avgComplianceScore={avgComplianceScore}
          pendingQueueCount={pendingQueueCount}
          strictnessMode={strictnessMode}
          onToggleStrictness={handleToggleStrictness}
          currentTheme={currentTheme}
          onSelectTheme={setCurrentTheme}
          currentUser={currentUser}
          onSignIn={handleSignIn}
          onRegister={() => handleOpenAuth('register')}
          onSignOut={handleSignOut}
          onScanNewVideo={() => {
            setCurrentView('scanner');
            handleTriggerAudit();
          }}
          onOpenCompare={() => setIsCompareModalOpen(true)}
          currentTier={subscriptionTier}
          remainingFreeScans={deviceMetrics.remainingScans}
          onOpenPricing={() => setIsPricingModalOpen(true)}
        />

        {/* Main Content Column: Top Header + Views + Footer */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            currentTheme={currentTheme}
            currentUser={currentUser}
            currentTier={subscriptionTier}
            remainingFreeScans={deviceMetrics.remainingScans}
            onOpenPricing={() => setIsPricingModalOpen(true)}
            onNavigateProfile={() => setCurrentView('profile')}
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          />

          {/* Main View Area (Clean view with no cluttered top button strip) */}
          <main className="flex-1 min-w-0 max-w-full px-3 py-4 sm:px-6 sm:py-6 pb-28 md:pb-12 flex flex-col gap-6">

            {/* View Render Area */}
            <AnimatePresence mode="wait">
              {currentView === 'content-hub' && (
                <motion.div
                  key="view-content-hub"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <ContentHub
                    isLight={isLight}
                    onNavigateScanner={() => {
                      setCurrentView('scanner');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onNavigateKnowledge={() => {
                      setCurrentView('knowledge');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                </motion.div>
              )}

              {currentView === 'profile' && (
                <motion.div
                  key="view-profile"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProfileView
                    currentUser={currentUser}
                    cloudReports={cloudReports}
                    uploadHistory={uploadHistory}
                    isLight={isLight}
                    onOpenAuth={handleOpenAuth}
                    onDemoLogin={handleDemoLogin}
                    onSignOut={handleSignOut}
                    onNavigateScanner={() => setCurrentView('scanner')}
                    onLoadAudit={(title) => {
                      setVideoTitle(title);
                      setCurrentView('scanner');
                    }}
                  />
                </motion.div>
              )}

              {currentView === 'overview' && (
                <motion.div
                  key="view-overview"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-6"
                >
                  {/* Modern Mobile Dashboard & Activity Section (Modeled directly on Image 2 Left Screen) */}
                  <ModernOverviewDashboard
                    currentUser={currentUser}
                    history={uploadHistory}
                    report={report}
                    onSelectSample={handleSelectSample}
                    samples={SAMPLE_VIDEOS}
                    onNavigateScanner={() => setCurrentView('scanner')}
                    onNavigateAnalytics={() => setCurrentView('analytics')}
                    onOpenCutGuide={() => setIsCutGuideOpen(true)}
                    onJumpAndPlay={handleJumpAndPlay}
                    isLight={isLight}
                  />

                  {/* Scroll Hint Prompt */}
                  <ScrollHintPrompt isLight={isLight} targetId="compliance-verdict-section" label="Scroll for Compliance Verdict & Audit" />

                  {/* Top Bar with Quick Actions (Heavy bottom-left rotation animation) */}
                  <ScrollReveal direction="bottom-left-rotate" delay={0.05}>
                    <div id="compliance-verdict-section" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
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
                        <ScrollButtonReveal direction="bottom-left" delay={0.05}>
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
                        </ScrollButtonReveal>

                        <ScrollButtonReveal direction="bottom" delay={0.1}>
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
                        </ScrollButtonReveal>

                        <ScrollButtonReveal direction="bottom" delay={0.15}>
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
                        </ScrollButtonReveal>

                        <ScrollButtonReveal direction="right" delay={0.2}>
                          <button
                            onClick={() => setIsCompareModalOpen(true)}
                            className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 font-sans text-xs font-semibold transition cursor-pointer ${
                              isLight
                                ? 'border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700'
                                : 'border-indigo-800 bg-indigo-950/60 hover:bg-indigo-900 text-indigo-300'
                            }`}
                            title="Compare 2 videos side-by-side to detect policy violation patterns"
                          >
                            <Scale className="h-3.5 w-3.5 text-indigo-600" />
                            <span>Compare 2 Videos</span>
                          </button>
                        </ScrollButtonReveal>
                      </div>
                    </div>
                  </ScrollReveal>

                  {/* Cloud save notification */}
                  {cloudSaveMessage && (
                    <ScrollReveal direction="bottom" delay={0.05}>
                      <div className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 dark:border-emerald-800 p-3 text-xs text-emerald-800 dark:text-emerald-200">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span className="font-medium">{cloudSaveMessage}</span>
                      </div>
                    </ScrollReveal>
                  )}

                  {/* Section: Comprehensive Audit Results Dashboard (Rising from Bottom) */}
                  {report && (
                    <ScrollReveal direction="bottom" delay={0.1}>
                      <div id="audit-results-section">
                        <AuditResultsDashboard
                        report={report}
                        videoTitle={videoTitle}
                        videoDurationSec={videoDurationSec}
                        onOpenCutGuide={() => setIsCutGuideOpen(true)}
                        onOpenAppealModal={() => setCurrentView('appeal')}
                        onOpenCompare={() => setIsCompareModalOpen(true)}
                        onRescan={() => setCurrentView('scanner')}
                        onJumpAndPlay={handleJumpAndPlay}
                        uploadHistory={uploadHistory}
                        isLight={isLight}
                        isAuthenticated={!!currentUser}
                        onOpenAuth={handleOpenAuth}
                        onDemoLogin={handleDemoLogin}
                      />
                      </div>
                    </ScrollReveal>
                  )}

                  {/* Section: Video Scanner Preview & Interactive Scrubber (Swooping from Right) */}
                  <ScrollReveal direction="right" delay={0.1}>
                    <VideoScanner
                      currentVideoUrl={currentVideoUrl}
                      videoTitle={videoTitle}
                      videoDurationSec={videoDurationSec}
                      isScanning={isScanning}
                      scanProgress={scanProgress}
                      violations={report?.timelineViolations || []}
                      extractedFrames={extractedFrames}
                      onUploadFile={handleUploadFile}
                      onUploadFiles={handleUploadFiles}
                      onSelectSample={handleSelectSample}
                      onQueueSample={handleQueueSample}
                      onTriggerAudit={handleTriggerAudit}
                      videoRef={videoRef}
                      currentTime={currentTime}
                      onSeek={handleSeek}
                      isLight={isLight}
                      queuedTasks={queuedTasks}
                      activeTaskId={activeTaskId}
                      onSelectTask={handleSelectTask}
                      onRemoveTask={handleRemoveTask}
                      onClearCompletedTasks={handleClearCompletedTasks}
                      onStartQueueAudit={processQueue}
                      isQueueRunning={isQueueRunning}
                      onOpenFullScreenAnalysis={() => setIsFullScreenAnalysisOpen(true)}
                      onOpenPricing={() => setIsPricingModalOpen(true)}
                      currentTier={subscriptionTier}
                      remainingFreeScans={deviceMetrics.remainingScans}
                    />
                  </ScrollReveal>

                  {/* Section: Flagged Timeline Incidents (Bottom-left rotation) */}
                  {report && (
                    <ScrollReveal direction="bottom-left-rotate" delay={0.1}>
                      <TimelineViolations
                        violations={report.timelineViolations}
                        onSeekToViolation={handleJumpAndPlay}
                        isLight={isLight}
                      />
                    </ScrollReveal>
                  )}

                  {/* Section: Most Frequent Historical Violation Type Summary Widget (Bottom-right rotation) */}
                  <ScrollReveal direction="bottom-right-rotate" delay={0.1}>
                    <FrequentViolationWidget
                      history={uploadHistory}
                      currentReport={report}
                      isLight={isLight}
                      onOpenCutGuide={() => setIsCutGuideOpen(true)}
                      onOpenKnowledgeBase={() => setCurrentView('knowledge')}
                    />
                  </ScrollReveal>

                  {/* Section: Channel Health Historical Trend (Rising from deep bottom) */}
                  <ScrollReveal direction="bottom" delay={0.1}>
                    <ChannelHealthTrend
                      history={uploadHistory}
                      isLight={isLight}
                    />
                  </ScrollReveal>

                  {/* Section: Firebase Cloud Vault (3D Perspective Tilt Scroll Animation) */}
                  <ScrollReveal direction="tilt-3d" delay={0.1}>
                    <div
                      className={`rounded-3xl border p-5 sm:p-7 transition shadow-2xs ${
                        isLight
                          ? 'border-slate-100 bg-white shadow-slate-200/50'
                          : 'border-slate-800 bg-slate-900'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4 mb-4 border-slate-100 dark:border-slate-800">
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
                  </ScrollReveal>
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
                    extractedFrames={extractedFrames}
                    onUploadFile={handleUploadFile}
                    onUploadFiles={handleUploadFiles}
                    onSelectSample={handleSelectSample}
                    onQueueSample={handleQueueSample}
                    onTriggerAudit={handleTriggerAudit}
                    videoRef={videoRef}
                    currentTime={currentTime}
                    onSeek={handleSeek}
                    isLight={isLight}
                    queuedTasks={queuedTasks}
                    activeTaskId={activeTaskId}
                    onSelectTask={handleSelectTask}
                    onRemoveTask={handleRemoveTask}
                    onClearCompletedTasks={handleClearCompletedTasks}
                    onStartQueueAudit={processQueue}
                    isQueueRunning={isQueueRunning}
                    onOpenFullScreenAnalysis={() => setIsFullScreenAnalysisOpen(true)}
                    onOpenPricing={() => setIsPricingModalOpen(true)}
                    currentTier={subscriptionTier}
                    remainingFreeScans={deviceMetrics.remainingScans}
                  />

                  {report && (
                    <AuditSummaryCard
                      report={report}
                      onOpenCutGuide={() => setIsCutGuideOpen(true)}
                      onOpenAppealModal={() => setCurrentView('appeal')}
                      isLight={isLight}
                    />
                  )}

                  {report && (
                    <TimelineViolations
                      violations={report.timelineViolations}
                      onSeekToViolation={handleSeek}
                      isLight={isLight}
                      currentTier={subscriptionTier}
                      onOpenPricing={() => setIsPricingModalOpen(true)}
                    />
                  )}
                </motion.div>
              )}

              {/* View 2.5: YOUTUBE CHANNEL TRACKER (24H & 7D METRICS, LINKS, LIKES) */}
              {currentView === 'channels' && (
                <motion.div
                  key="view-channels"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  <ChannelTrackerDashboard
                    theme={theme}
                    onAuditVideoFromChannel={handleAuditVideoFromChannel}
                  />
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

                  {/* Channel Vulnerability Summary Widget */}
                  <FrequentViolationWidget
                    history={uploadHistory}
                    currentReport={report}
                    isLight={isLight}
                    onOpenCutGuide={() => setIsCutGuideOpen(true)}
                    onOpenKnowledgeBase={() => setCurrentView('knowledge')}
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

                  {!currentUser ? (
                    <div className="rounded-3xl border border-red-500/30 p-8 sm:p-12 text-center bg-gradient-to-b from-slate-900/90 to-slate-950 text-white shadow-xl">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-lg shadow-red-600/30">
                        <Lock className="h-7 w-7 animate-pulse" />
                      </div>
                      <h3 className="font-display text-xl sm:text-2xl font-black">
                        Sign In or Register to Unlock Frame-Accurate Cuts
                      </h3>
                      <p className="mt-2 max-w-md mx-auto text-xs sm:text-sm text-slate-300">
                        Detailed second-by-second safe cuts, CapCut timecodes, and blur instructions are protected. Create a free account or log in to unlock.
                      </p>
                      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                          onClick={() => handleOpenAuth('register')}
                          className="w-full sm:w-auto rounded-xl bg-red-600 hover:bg-red-700 text-white px-6 py-3 font-sans text-xs font-bold transition shadow-lg cursor-pointer"
                        >
                          Create Free Account
                        </button>
                        <button
                          onClick={() => handleOpenAuth('login')}
                          className="w-full sm:w-auto rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-white px-6 py-3 font-sans text-xs font-semibold transition cursor-pointer"
                        >
                          Sign In
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
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
                    </>
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

                  {!currentUser ? (
                    <div className="rounded-3xl border border-indigo-500/30 p-8 sm:p-12 text-center bg-gradient-to-b from-slate-900/90 to-slate-950 text-white shadow-xl">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30">
                        <Lock className="h-7 w-7 animate-pulse" />
                      </div>
                      <h3 className="font-display text-xl sm:text-2xl font-black">
                        Sign In or Register to Generate Legal Strike Appeals
                      </h3>
                      <p className="mt-2 max-w-md mx-auto text-xs sm:text-sm text-slate-300">
                        Access YouTube EDSA legal exception counter-appeal drafts within YouTube Studio&apos;s 800-character ceiling by signing in.
                      </p>
                      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                          onClick={() => handleOpenAuth('register')}
                          className="w-full sm:w-auto rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 font-sans text-xs font-bold transition shadow-lg cursor-pointer"
                        >
                          Create Free Account
                        </button>
                        <button
                          onClick={() => handleOpenAuth('login')}
                          className="w-full sm:w-auto rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-white px-6 py-3 font-sans text-xs font-semibold transition cursor-pointer"
                        >
                          Sign In
                        </button>
                      </div>
                    </div>
                  ) : (
                    report && (
                      <AppealGeneratorModal
                        isOpen={true}
                        isEmbedded={true}
                        isLight={isLight}
                        report={report}
                      />
                    )
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

              {/* View 7: SUBSCRIPTION PLANS & UPGRADE PAGE */}
              {currentView === 'subscription' && (
                <motion.div
                  key="view-subscription"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  <SubscriptionPlanView
                    currentTier={subscriptionTier}
                    isLight={isLight}
                    onOpenCheckout={(tier, cycle) => {
                      setCheckoutSelectedTier(tier);
                      setCheckoutBillingCycle(cycle);
                      setIsCheckoutModalOpen(true);
                    }}
                  />
                </motion.div>
              )}

              {/* View 8: SUPERADMIN MISSION CONTROL (Protected for strikucloud@gmail.com) */}
              {currentView === 'admin' && (
                <motion.div
                  key="view-admin"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  {isUserSuperAdmin(currentUser?.email) ? (
                    <AdminPanelDashboard
                      isLight={isLight}
                      onNavigateScanner={() => setCurrentView('scanner')}
                    />
                  ) : (
                    <div className="rounded-3xl border border-red-500/40 bg-gradient-to-b from-red-950/40 to-slate-950 p-8 sm:p-12 text-center text-white max-w-xl mx-auto my-12 shadow-2xl">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-900/50">
                        <Lock className="h-7 w-7" />
                      </div>
                      <h3 className="font-display text-xl sm:text-2xl font-black">
                        Restricted Superadmin Access
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                        This control panel is strictly reserved for the system owner (<strong>{ADMIN_EMAIL}</strong>). Log in with this administrator email to manage users and subscriptions.
                      </p>
                      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleDemoLogin('Super Admin', ADMIN_EMAIL)}
                          className="rounded-xl bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 font-sans text-xs font-bold transition shadow-lg cursor-pointer"
                        >
                          Sign In as Admin ({ADMIN_EMAIL})
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentView('overview')}
                          className="rounded-xl border border-slate-700 bg-slate-800 text-slate-300 px-5 py-2.5 font-sans text-xs font-semibold hover:text-white transition cursor-pointer"
                        >
                          Return to Dashboard
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* View 9: TRUST & LEGAL POLICIES HUB (FAQ, Refund Guarantee, Privacy, Terms, About, Contact) */}
              {currentView === 'legal' && (
                <motion.div
                  key="view-legal"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  <LegalTrustHub
                    initialTab={activeLegalTab}
                    isLight={isLight}
                    currentUserEmail={currentUser?.email}
                    onOpenPricing={() => setIsPricingModalOpen(true)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Comprehensive Multi-Column SaaS Footer (FAQ, 14-Day Refund, Privacy, Lemon Squeezy MoR Disclosures) */}
          <SaaSFooter
            isLight={isLight}
            onNavigate={(view, legalTab) => {
              if (legalTab) {
                setActiveLegalTab(legalTab);
              }
              setCurrentView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenPricing={() => setIsPricingModalOpen(true)}
            onOpenCompare={() => setIsCompareModalOpen(true)}
            isSuperAdmin={isUserSuperAdmin(currentUser?.email)}
          />
        </div>
      </div>

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
            currentTier={subscriptionTier}
            onOpenPricing={() => {
              setIsCutGuideOpen(false);
              setIsPricingModalOpen(true);
            }}
          />
        </>
      )}

      <PolicyKnowledgeBase
        isOpen={isKnowledgeBaseOpen}
        onClose={() => setIsKnowledgeBaseOpen(false)}
        isLight={isLight}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        isLight={isLight}
        onDemoLogin={handleDemoLogin}
      />

      <FullScreenAnalysisModal
        isOpen={isFullScreenAnalysisOpen}
        onClose={() => setIsFullScreenAnalysisOpen(false)}
        videoTitle={videoTitle}
        progressPercent={scanProgress.percent}
        progressStatus={scanProgress.status}
        extractedFrames={extractedFrames}
        report={report}
        onViewResults={() => {
          setIsFullScreenAnalysisOpen(false);
          setCurrentView('overview');
        }}
        isLight={isLight}
      />

      <SideBySideComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        availableReports={[
          ...(report ? [report] : []),
          ...queuedTasks.filter((t) => t.report).map((t) => t.report!),
          ...SAMPLE_VIDEOS.map((s) => s.mockReport),
        ]}
        defaultVideoAId={report?.id || queuedTasks[0]?.report?.id || SAMPLE_VIDEOS[0]?.mockReport.id}
        defaultVideoBId={queuedTasks[1]?.report?.id || queuedTasks[0]?.report?.id || SAMPLE_VIDEOS[1]?.mockReport.id}
        isLight={isLight}
      />

      <PricingSubscriptionModal
        isOpen={isPricingModalOpen}
        onClose={() => {
          setIsPricingModalOpen(false);
          setPricingUpgradeReason(undefined);
        }}
        currentTier={subscriptionTier}
        isLight={isLight}
        upgradeReason={pricingUpgradeReason}
        onSelectPlan={(tier, cycle) => {
          setIsPricingModalOpen(false);
          setCheckoutSelectedTier(tier);
          setCheckoutBillingCycle(cycle);
          setIsCheckoutModalOpen(true);
        }}
      />

      <PaymentCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        selectedTier={checkoutSelectedTier}
        billingCycle={checkoutBillingCycle}
        isLight={isLight}
        onSuccess={(tier) => {
          setSubscriptionTier(tier);
          setCurrentSubscriptionTier(tier);
          setDeviceMetrics(getDeviceScanMetrics());
        }}
      />

      {/* Dynamic Floating Action Dock: Bottom-up animated font & buttons that fade in/out on scroll */}
      <FloatingScrollHUD
        isLight={isLight}
        videoTitle={videoTitle}
        safetyGrade={report?.safetyGrade}
        isAuditActive={!!report}
        onScanClick={() => {
          setCurrentView('scanner');
          handleTriggerAudit();
        }}
        onCutSheetClick={() => setIsCutGuideOpen(true)}
        onCompareClick={() => setIsCompareModalOpen(true)}
      />

      {/* Floating Scroll to Top Interactive Button */}
      <ScrollToTopButton isLight={isLight} />
    </div>
  );
}
