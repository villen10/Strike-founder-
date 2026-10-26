import { AuditReport } from '../types/audit';

export interface DynamicSeoMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogType: string;
  twitterTitle: string;
  twitterDescription: string;
  jsonLd?: Record<string, unknown>;
}

export const DEFAULT_SEO_METADATA: DynamicSeoMetadata = {
  title: 'Striku - striku.cloud | Striku Video Analysis & YouTube Strike Checker',
  description:
    'Striku (striku.cloud) - Official Striku video analysis tool. Check video before upload to YouTube to detect strikes, copyright claims, and monetization risks with frame-accurate timestamps.',
  canonicalUrl: 'https://www.striku.cloud/',
  ogTitle: 'Striku - striku.cloud | Striku Video Analysis & YouTube Strike Checker',
  ogDescription:
    'Check video before upload with Striku. AI YouTube strike checker and copyright claim founder. Analyzes video frames to detect community guidelines strikes, copyright risks, and monetization issues with frame-accurate timestamps.',
  ogUrl: 'https://www.striku.cloud/',
  ogType: 'website',
  twitterTitle: 'Striku - striku.cloud | Striku Video Analysis & YouTube Strike Checker',
  twitterDescription:
    'Check video before upload with Striku. AI YouTube strike checker and copyright claim founder. Analyzes video frames to detect community guidelines strikes, copyright risks, and monetization issues with frame-accurate timestamps.',
};

/**
 * Dynamically generates meta descriptions, OpenGraph tags, and Schema.org
 * structured data for an individual video audit report.
 */
export function generateAuditReportMetadata(
  report: AuditReport,
  customTitle?: string
): DynamicSeoMetadata {
  const videoTitle = (customTitle || report.videoTitle || 'Uploaded Video').trim();
  const complianceScore = Math.max(0, Math.min(100, 100 - report.overallRiskScore));

  let gradeLabel = 'Safe to Upload';
  if (report.safetyGrade === 'HIGH_STRIKE_RISK') {
    gradeLabel = 'Critical Strike Risk';
  } else if (report.safetyGrade === 'MONETIZATION_AT_RISK') {
    gradeLabel = 'Monetization Warning';
  }

  const issuesCount = report.totalIssuesCount || report.timelineViolations?.length || 0;
  const criticalCount = report.criticalIssuesCount || 0;

  // Punchy, search-optimized dynamic title focusing on: Striku, striku.cloud, striku video analysis
  const title = `${videoTitle} - Striku Video Analysis (${gradeLabel} · ${complianceScore}% Score) | striku.cloud`;

  // Dynamic meta description (130-155 chars) describing the exact video audit results
  let description = `Striku video analysis for "${videoTitle}": ${complianceScore}% compliance score. `;
  if (issuesCount === 0) {
    description += `Passed all YouTube community guidelines with zero strike risk. Safe to upload via striku.cloud.`;
  } else {
    description += `${issuesCount} issue${issuesCount > 1 ? 's' : ''} detected (${criticalCount} critical). Frame-by-frame CapCut safe-cut timecodes on striku.cloud.`;
  }

  // Ensure description length stays within optimal search crawler snippet limits
  if (description.length > 160) {
    description = description.slice(0, 157) + '...';
  }

  const reportUrl = `https://www.striku.cloud/?report=${encodeURIComponent(report.id || 'current')}`;

  // Schema.org structured data specifically representing this analytical report
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': `${reportUrl}#audit-report`,
    headline: `Striku Video Analysis: ${videoTitle}`,
    description: description,
    datePublished: report.scannedAt || new Date().toISOString(),
    inLanguage: 'en-US',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': reportUrl,
    },
    author: {
      '@type': 'Organization',
      name: 'Striku',
      url: 'https://www.striku.cloud',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Striku',
      url: 'https://www.striku.cloud',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.striku.cloud/logo.png',
      },
    },
    about: [
      {
        '@type': 'Thing',
        name: 'Striku Video Analysis',
      },
      {
        '@type': 'Thing',
        name: 'YouTube Community Guidelines & Strike Checker',
      },
      {
        '@type': 'Thing',
        name: 'Content ID Copyright Claim Screening',
      },
    ],
  };

  return {
    title,
    description,
    canonicalUrl: reportUrl,
    ogTitle: `${videoTitle} - Striku Video Analysis Report`,
    ogDescription: description,
    ogUrl: reportUrl,
    ogType: 'article',
    twitterTitle: `${videoTitle} - Striku Video Analysis Report`,
    twitterDescription: description,
    jsonLd,
  };
}

/**
 * Helper to update or create a <meta> tag in the DOM head
 */
function setMetaTag(attributeName: 'name' | 'property', attributeValue: string, content: string) {
  if (typeof document === 'undefined') return;
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Helper to update or create a <link rel="canonical"> tag
 */
function setCanonicalUrl(url: string) {
  if (typeof document === 'undefined') return;
  let element = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', url);
}

const DYNAMIC_SCHEMA_SCRIPT_ID = 'striku-dynamic-report-schema';

/**
 * Injects or updates an application/ld+json script tag for the report
 */
function setDynamicSchema(jsonLd?: Record<string, unknown>) {
  if (typeof document === 'undefined') return;
  const existingScript = document.getElementById(DYNAMIC_SCHEMA_SCRIPT_ID);

  if (!jsonLd) {
    if (existingScript) existingScript.remove();
    return;
  }

  const script = (existingScript as HTMLScriptElement) || document.createElement('script');
  script.id = DYNAMIC_SCHEMA_SCRIPT_ID;
  script.type = 'application/ld+json';
  script.text = JSON.stringify(jsonLd);

  if (!existingScript) {
    document.head.appendChild(script);
  }
}

/**
 * Applies dynamic metadata to the live document for crawlers, social share cards, and browser tabs.
 */
export function applyDynamicMetadata(meta: DynamicSeoMetadata) {
  if (typeof document === 'undefined') return;

  // 1. Page Title
  document.title = meta.title;

  // 2. Standard Meta Description
  setMetaTag('name', 'description', meta.description);

  // 3. Canonical Link
  setCanonicalUrl(meta.canonicalUrl);

  // 4. OpenGraph Tags & Logo Image
  setMetaTag('property', 'og:title', meta.ogTitle);
  setMetaTag('property', 'og:description', meta.ogDescription);
  setMetaTag('property', 'og:url', meta.ogUrl);
  setMetaTag('property', 'og:type', meta.ogType);
  setMetaTag('property', 'og:site_name', 'Striku');
  setMetaTag('property', 'og:image', 'https://www.striku.cloud/logo.png');
  setMetaTag('property', 'og:image:width', '512');
  setMetaTag('property', 'og:image:height', '512');

  // 5. Twitter Card Tags & Image
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', meta.twitterTitle);
  setMetaTag('name', 'twitter:description', meta.twitterDescription);
  setMetaTag('name', 'twitter:url', meta.ogUrl);
  setMetaTag('name', 'twitter:image', 'https://www.striku.cloud/logo.png');

  // 6. Dynamic JSON-LD Structured Data
  setDynamicSchema(meta.jsonLd);
}

/**
 * Resets document metadata to the official Striku homepage defaults.
 */
export function resetToDefaultMetadata() {
  applyDynamicMetadata(DEFAULT_SEO_METADATA);
}

/**
 * Constructs a shareable URL for an audit report
 */
export function getReportShareUrl(reportId?: string): string {
  const id = reportId || 'latest';
  return `https://www.striku.cloud/?report=${encodeURIComponent(id)}`;
}

/**
 * Returns unique SEO metadata (title, description, og:title, og:description) for each internal view/route.
 */
export function getViewMetadata(view: string): DynamicSeoMetadata {
  const baseUrl = 'https://www.striku.cloud';
  switch (view) {
    case 'overview':
      return {
        ...DEFAULT_SEO_METADATA,
        title: 'Striku Dashboard - YouTube Channel Compliance & Strike Prevention | striku.cloud',
        description:
          'Monitor your YouTube channel compliance score, pre-upload scan history, and active copyright risks on striku.cloud.',
        ogTitle: 'Striku Dashboard - YouTube Channel Compliance & Strike Prevention',
        ogDescription: 'Monitor your YouTube channel compliance score, pre-upload scan history, and active copyright risks on striku.cloud.',
        canonicalUrl: `${baseUrl}/#overview`,
        ogUrl: `${baseUrl}/#overview`,
      };
    case 'scanner':
    case 'home-video-scan':
    case 'video-copyright-checker-online-free':
      return {
        ...DEFAULT_SEO_METADATA,
        title: 'Video Copyright Checker Online Free - Striku | YouTube Strike & Claim Audit',
        description:
          'Free online video copyright checker. Screen videos before upload to YouTube for Content ID claims, audio copyright, and strike risks with frame-accurate timestamps on striku.cloud.',
        ogTitle: 'Video Copyright Checker Online Free - Striku',
        ogDescription: 'Free online video copyright checker for YouTube creators. Screen videos for copyright claims, audio copyright, and strike risks before upload.',
        canonicalUrl: `${baseUrl}/#video-copyright-checker-online-free`,
        ogUrl: `${baseUrl}/#video-copyright-checker-online-free`,
      };
    case 'video-copyright-checker':
    case 'copyright-checker-youtube':
      return {
        ...DEFAULT_SEO_METADATA,
        title: 'Video Copyright Checker - Pre-Upload YouTube Content ID Audit | striku.cloud',
        description:
          'Online video copyright checker for YouTube creators. Detect Content ID claims, commercial audio loops, and video strike risks before publishing.',
        ogTitle: 'Video Copyright Checker - Pre-Upload YouTube Content ID Audit',
        ogDescription: 'Online video copyright checker for YouTube creators. Detect Content ID claims and copyright risks before publishing.',
        canonicalUrl: `${baseUrl}/#video-copyright-checker`,
        ogUrl: `${baseUrl}/#video-copyright-checker`,
      };
    case 'youtube-video-strike-checker':
      return {
        ...DEFAULT_SEO_METADATA,
        title: 'YouTube Video Strike Checker - Community Guidelines & Safety Auditor | striku.cloud',
        description:
          'Automated YouTube video strike checker. Audit video frames for community guidelines strikes, child safety hazards, and dangerous stunts before you upload.',
        ogTitle: 'YouTube Video Strike Checker - Community Guidelines & Safety Auditor',
        ogDescription: 'Audit video frames for YouTube community guidelines strikes, child safety hazards, and dangerous stunts before you upload.',
        canonicalUrl: `${baseUrl}/#youtube-video-strike-checker`,
        ogUrl: `${baseUrl}/#youtube-video-strike-checker`,
      };
    case 'copyright-checker-youtube-audio':
      return {
        ...DEFAULT_SEO_METADATA,
        title: 'Copyright Checker YouTube Audio - Check Music & Soundtracks Free | striku.cloud',
        description:
          'Free YouTube audio copyright checker. Scan background music, songs, and audio tracks for Content ID claims and commercial licensing issues before uploading.',
        ogTitle: 'Copyright Checker YouTube Audio - Check Music & Soundtracks Free',
        ogDescription: 'Free YouTube audio copyright checker. Scan background music and songs for Content ID claims before uploading.',
        canonicalUrl: `${baseUrl}/#copyright-checker-youtube-audio`,
        ogUrl: `${baseUrl}/#copyright-checker-youtube-audio`,
      };
    case 'copyright-checker-youtube-link':
      return {
        ...DEFAULT_SEO_METADATA,
        title: 'Copyright Checker YouTube Link - Check Video Strikes by URL | striku.cloud',
        description:
          'Check YouTube video copyright and strikes by link. Analyze channel compliance history, metadata risk factors, and policy flags on striku.cloud.',
        ogTitle: 'Copyright Checker YouTube Link - Check Video Strikes by URL',
        ogDescription: 'Check YouTube video copyright and strikes by link. Analyze channel compliance history and policy risk factors.',
        canonicalUrl: `${baseUrl}/#copyright-checker-youtube-link`,
        ogUrl: `${baseUrl}/#copyright-checker-youtube-link`,
      };
    case 'check-video-before-upload':
      return {
        ...DEFAULT_SEO_METADATA,
        title: 'Check Video Before Upload to YouTube - Prevent Strikes | striku.cloud',
        description:
          'Check your video before upload to YouTube Studio. Catch strikes, copyright claims, and monetization issues with second-by-second CapCut safe-cut timecodes.',
        ogTitle: 'Check Video Before Upload to YouTube - Prevent Strikes',
        ogDescription: 'Check your video before upload to YouTube Studio. Catch strikes and copyright claims with second-by-second timecodes.',
        canonicalUrl: `${baseUrl}/#check-video-before-upload`,
        ogUrl: `${baseUrl}/#check-video-before-upload`,
      };
    case 'channels':
      return {
        ...DEFAULT_SEO_METADATA,
        title: 'YouTube Channel Tracker & Compliance History - Striku | striku.cloud',
        description:
          'Track historical upload compliance scores, active strike risks, and monetization warnings across your YouTube creator channel.',
        ogTitle: 'YouTube Channel Tracker & Compliance History - Striku',
        ogDescription: 'Track historical upload compliance scores, active strike risks, and monetization warnings across your YouTube creator channel.',
        canonicalUrl: `${baseUrl}/#channels`,
        ogUrl: `${baseUrl}/#channels`,
      };
    case 'analytics':
      return {
        ...DEFAULT_SEO_METADATA,
        title: 'Channel Health & Violation Trends Analysis - Striku | striku.cloud',
        description:
          'Analyze multi-pass neural consensus metrics, temporal risk heatmaps, and safety trends for your uploaded video library.',
        ogTitle: 'Channel Health & Violation Trends Analysis - Striku',
        ogDescription: 'Analyze multi-pass neural consensus metrics, temporal risk heatmaps, and safety trends for your uploaded video library.',
        canonicalUrl: `${baseUrl}/#analytics`,
        ogUrl: `${baseUrl}/#analytics`,
      };
    case 'violations':
      return {
        ...DEFAULT_SEO_METADATA,
        title: 'Frequent Community Guidelines & Content ID Violations - Striku',
        description:
          'Review frequent hazard alerts, copyright claim patterns, and automated policy flags to keep your YouTube channel safe.',
        ogTitle: 'Frequent Community Guidelines & Content ID Violations - Striku',
        ogDescription: 'Review frequent hazard alerts, copyright claim patterns, and automated policy flags to keep your YouTube channel safe.',
        canonicalUrl: `${baseUrl}/#violations`,
        ogUrl: `${baseUrl}/#violations`,
      };
    case 'appeal':
      return {
        ...DEFAULT_SEO_METADATA,
        title: 'AI Appeal Letter & Monetization Defense Generator - Striku | striku.cloud',
        description:
          'Generate professional YouTube creator appeal letters and dispute monetization claims with AI-backed policy citations.',
        ogTitle: 'AI Appeal Letter & Monetization Defense Generator - Striku',
        ogDescription: 'Generate professional YouTube creator appeal letters and dispute monetization claims with AI-backed policy citations.',
        canonicalUrl: `${baseUrl}/#appeal`,
        ogUrl: `${baseUrl}/#appeal`,
      };
    case 'knowledge':
      return {
        ...DEFAULT_SEO_METADATA,
        title: 'YouTube Policy Knowledge Base & Safety Guidelines - Striku | striku.cloud',
        description:
          'Explore comprehensive YouTube community guidelines, copyright rules, and safety documentation to prevent channel strikes.',
        ogTitle: 'YouTube Policy Knowledge Base & Safety Guidelines - Striku',
        ogDescription: 'Explore comprehensive YouTube community guidelines, copyright rules, and safety documentation to prevent channel strikes.',
        canonicalUrl: `${baseUrl}/#knowledge`,
        ogUrl: `${baseUrl}/#knowledge`,
      };
    case 'content-hub':
      return {
        ...DEFAULT_SEO_METADATA,
        title: 'Creator SEO Guides & YouTube Strike Prevention Hub - Striku | striku.cloud',
        description:
          'Expert SEO guides and tutorials on how to check videos before upload, avoid copyright claims, and master YouTube compliance.',
        ogTitle: 'Creator SEO Guides & YouTube Strike Prevention Hub - Striku',
        ogDescription: 'Expert SEO guides and tutorials on how to check videos before upload, avoid copyright claims, and master YouTube compliance.',
        canonicalUrl: `${baseUrl}/#content-hub`,
        ogUrl: `${baseUrl}/#content-hub`,
      };
    case 'reviews':
      return {
        ...DEFAULT_SEO_METADATA,
        title: 'Creator Reviews & Testimonials (4.9 ★) - Striku | striku.cloud',
        description:
          'Read authentic creator reviews for Striku video strike checker and copyright analysis tool. Share your feedback, like, dislike, and reply to community reviews.',
        ogTitle: 'Creator Reviews & Testimonials (4.9 ★) - Striku',
        ogDescription: 'Read authentic creator reviews for Striku video strike checker and copyright analysis tool.',
        canonicalUrl: `${baseUrl}/#reviews`,
        ogUrl: `${baseUrl}/#reviews`,
      };
    case 'my-reviews':
      return {
        ...DEFAULT_SEO_METADATA,
        title: 'My Reviews & Community Feedback - Striku | striku.cloud',
        description:
          'Manage, edit, or delete your submitted reviews and replies on Striku.',
        ogTitle: 'My Reviews & Community Feedback - Striku',
        ogDescription: 'Manage, edit, or delete your submitted reviews and replies on Striku.',
        canonicalUrl: `${baseUrl}/#my-reviews`,
        ogUrl: `${baseUrl}/#my-reviews`,
      };
    case 'profile':
      return {
        ...DEFAULT_SEO_METADATA,
        title: 'Creator Account Settings & Security - Striku | striku.cloud',
        description: 'Manage your Striku creator account profile, cloud sync preferences, and Pro Shield subscription status.',
        ogTitle: 'Creator Account Settings & Security - Striku',
        ogDescription: 'Manage your Striku creator account profile, cloud sync preferences, and Pro Shield subscription status.',
        canonicalUrl: `${baseUrl}/#profile`,
        ogUrl: `${baseUrl}/#profile`,
      };
    case 'subscription':
      return {
        ...DEFAULT_SEO_METADATA,
        title: 'Pro Shield & Enterprise Subscription Plans - Striku | striku.cloud',
        description: 'Upgrade to Striku Pro Shield for unlimited video scans, priority neural consensus, and advanced copyright detection.',
        ogTitle: 'Pro Shield & Enterprise Subscription Plans - Striku',
        ogDescription: 'Upgrade to Striku Pro Shield for unlimited video scans, priority neural consensus, and advanced copyright detection.',
        canonicalUrl: `${baseUrl}/#subscription`,
        ogUrl: `${baseUrl}/#subscription`,
      };
    case 'admin':
      return {
        ...DEFAULT_SEO_METADATA,
        title: 'Super Admin Compliance Control Center - Striku | striku.cloud',
        description: 'Super admin management console for platform analytics, user verification, and global compliance monitoring.',
        ogTitle: 'Super Admin Compliance Control Center - Striku',
        ogDescription: 'Super admin management console for platform analytics, user verification, and global compliance monitoring.',
        canonicalUrl: `${baseUrl}/#admin`,
        ogUrl: `${baseUrl}/#admin`,
      };
    case 'legal':
      return {
        ...DEFAULT_SEO_METADATA,
        title: 'Legal, Privacy Policy & Terms of Service - Striku | striku.cloud',
        description: 'Read Striku privacy policy, terms of service, and zero-retention data security commitments.',
        ogTitle: 'Legal, Privacy Policy & Terms of Service - Striku',
        ogDescription: 'Read Striku privacy policy, terms of service, and zero-retention data security commitments.',
        canonicalUrl: `${baseUrl}/#legal`,
        ogUrl: `${baseUrl}/#legal`,
      };
    default:
      return DEFAULT_SEO_METADATA;
  }
}
