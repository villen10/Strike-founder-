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
        url: 'https://lh3.googleusercontent.com/d/1wD4MS3OLJmAjuuAy1OueuNM2EFW7TYCI',
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
  setMetaTag('property', 'og:image', 'https://lh3.googleusercontent.com/d/1wD4MS3OLJmAjuuAy1OueuNM2EFW7TYCI');
  setMetaTag('property', 'og:image:width', '512');
  setMetaTag('property', 'og:image:height', '512');

  // 5. Twitter Card Tags & Image
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', meta.twitterTitle);
  setMetaTag('name', 'twitter:description', meta.twitterDescription);
  setMetaTag('name', 'twitter:url', meta.ogUrl);
  setMetaTag('name', 'twitter:image', 'https://lh3.googleusercontent.com/d/1wD4MS3OLJmAjuuAy1OueuNM2EFW7TYCI');

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
