import { SampleVideoOption } from '../types/audit';

export const SAMPLE_VIDEOS: SampleVideoOption[] = [
  {
    id: 'sample-child-safety-risk',
    title: 'Home Kitchen Prank with Toddler & Knife',
    category: 'Prank / Family Vlog',
    durationSec: 28,
    durationFormatted: '00:28',
    expectedResult: 'CRITICAL_STRIKE',
    shortDesc: 'A prank video where an unsupervised toddler reaches towards a sharp chef knife.',
    thumbnailPlaceholderColor: 'from-rose-950 to-slate-900',
    mockReport: {
      id: 'report-child-safety',
      videoTitle: 'Home Kitchen Prank with Toddler & Knife',
      videoDurationSec: 28,
      durationFormatted: '00:28',
      overallRiskScore: 92,
      safetyGrade: 'HIGH_STRIKE_RISK',
      strikeProbabilityPct: 88,
      demonetizationProbabilityPct: 96,
      first7SecondsStatus: 'FLAGGED',
      totalIssuesCount: 2,
      criticalIssuesCount: 1,
      warningsCount: 1,
      summaryVerdictEn: 'Immediate Community Guidelines strike hazard detected. Minor child is exposed to accessible sharp cutlery in an unsupervised prank setting.',
      summaryVerdictUrdu: 'Immediate Community Guidelines strike hazard detected. Minor child is exposed to accessible sharp cutlery in an unsupervised prank setting.',
      timelineViolations: [
        {
          id: 'viol-1',
          timestampStart: '00:04',
          timestampEnd: '00:08',
          secondsStart: 4,
          secondsEnd: 8,
          severity: 'CRITICAL_STRIKE',
          category: 'CHILD_SAFETY',
          categoryLabel: 'Child Safety & Endangerment',
          title: 'Unattended Minor with Dangerous Blade',
          youtubePolicyRef: 'YouTube Child Safety Policy - Minor Endangerment & Physical Harm',
          descriptionEn: 'Automated moderation algorithms classify minors near unguarded sharp blades or flames as acute child endangerment, leading to immediate video removal and channel strike.',
          descriptionUrdu: 'Automated moderation algorithms classify minors near unguarded sharp blades or flames as acute child endangerment, leading to immediate video removal and channel strike.',
          actionableFix: {
            actionType: 'TRIM_CLIP',
            instructionsEn: 'Completely remove the 4-second sequence from 00:04 to 00:08. Do not keep the knife within reach of the child.',
            instructionsUrdu: 'Completely remove the 4-second sequence from 00:04 to 00:08. Do not keep the knife within reach of the child.',
            suggestedCut: 'Cut 00:04 - 00:08 (4 seconds)'
          }
        },
        {
          id: 'viol-2',
          timestampStart: '00:19',
          timestampEnd: '00:22',
          secondsStart: 19,
          secondsEnd: 22,
          severity: 'MILD_CAUTION',
          category: 'ADVERTISER_FRIENDLY',
          categoryLabel: 'Advertiser-Friendly Guidelines',
          title: 'Startling Jump Scare Reaction',
          youtubePolicyRef: 'YouTube Ad-Suitability - Extreme Shock Value & Distress',
          descriptionEn: 'Sudden high-decibel screaming directed at children triggers YouTube distress detection algorithms.',
          descriptionUrdu: 'Sudden high-decibel screaming directed at children triggers YouTube distress detection algorithms.',
          actionableFix: {
            actionType: 'MUTE_AUDIO',
            instructionsEn: 'Lower audio volume peak by -8dB or replace screaming with soft comedy music.',
            instructionsUrdu: 'Lower audio volume peak by -8dB or replace screaming with soft comedy music.',
            suggestedCut: 'Audio level reduction at 00:19'
          }
        }
      ],
      categoryScores: {
        childSafety: 94,
        violenceGore: 45,
        harmfulDangerous: 78,
        hateHarassment: 10,
        sexualContent: 0,
        advertiserSuitability: 82
      },
      recommendedActionsList: [
        'Trim out seconds 00:04 to 00:08 before uploading.',
        'Never feature toddlers interacting with dangerous kitchen implements.',
        'Review audio volume spikes at 00:19.'
      ],
      safeCutSummary: {
        originalDuration: '00:28',
        safeDurationAfterCuts: '00:24',
        removedSecondsTotal: 4
      },
      scannedAt: 'Just now',
      strictnessMode: 'STANDARD'
    }
  },
  {
    id: 'sample-street-sparring',
    title: 'Public Street Sparring Prank & Shouting',
    category: 'Challenge / Comedy',
    durationSec: 42,
    durationFormatted: '00:42',
    expectedResult: 'CRITICAL_STRIKE',
    shortDesc: 'A street fight simulation with aggressive body posture and uncensored profanity in the opening 5 seconds.',
    thumbnailPlaceholderColor: 'from-amber-950 to-slate-900',
    mockReport: {
      id: 'report-street-fight',
      videoTitle: 'Public Street Sparring Prank & Shouting',
      videoDurationSec: 42,
      durationFormatted: '00:42',
      overallRiskScore: 84,
      safetyGrade: 'HIGH_STRIKE_RISK',
      strikeProbabilityPct: 76,
      demonetizationProbabilityPct: 98,
      first7SecondsStatus: 'FLAGGED',
      totalIssuesCount: 3,
      criticalIssuesCount: 1,
      warningsCount: 2,
      summaryVerdictEn: 'High risk of both Violent Content strike and Yellow Dollar demonetization due to realistic physical aggression and opening profanity.',
      summaryVerdictUrdu: 'High risk of both Violent Content strike and Yellow Dollar demonetization due to realistic physical aggression and opening profanity.',
      timelineViolations: [
        {
          id: 'viol-sf-1',
          timestampStart: '00:01',
          timestampEnd: '00:05',
          secondsStart: 1,
          secondsEnd: 5,
          severity: 'DEMONETIZATION_WARNING',
          category: 'ADVERTISER_FRIENDLY',
          categoryLabel: 'Advertiser Suitability - Opening Hook',
          title: 'Strong Profanity in First 7 Seconds',
          youtubePolicyRef: 'YouTube Self-Certification Policy - Inappropriate Language in Hook',
          descriptionEn: 'YouTube guidelines mandate that profanity within the first 7 seconds triggers automated demonetization (Limited Ads / Yellow Icon).',
          descriptionUrdu: 'YouTube guidelines mandate that profanity within the first 7 seconds triggers automated demonetization (Limited Ads / Yellow Icon).',
          actionableFix: {
            actionType: 'MUTE_AUDIO',
            instructionsEn: 'Censor or bleep out words at 00:02 - 00:04, or shift spoken dialogue after the 10-second mark.',
            instructionsUrdu: 'Censor or bleep out words at 00:02 - 00:04, or shift spoken dialogue after the 10-second mark.',
            suggestedCut: 'Mute / Bleep audio at 00:02 - 00:04'
          }
        },
        {
          id: 'viol-sf-2',
          timestampStart: '00:14',
          timestampEnd: '00:21',
          secondsStart: 14,
          secondsEnd: 21,
          severity: 'CRITICAL_STRIKE',
          category: 'VIOLENCE_GRAPHIC',
          categoryLabel: 'Violent & Graphic Content',
          title: 'Realistic Public Physical Altercation',
          youtubePolicyRef: 'YouTube Violent Content Policy - Non-consensual street fights',
          descriptionEn: 'Automated video recognition models cannot verify that a street brawl is staged without explicit on-screen disclaimers and theatrical cues.',
          descriptionUrdu: 'Automated video recognition models cannot verify that a street brawl is staged without explicit on-screen disclaimers and theatrical cues.',
          actionableFix: {
            actionType: 'ADD_DISCLAIMER',
            instructionsEn: 'Add clear on-screen text: "Staged comedy sketch with trained actors" and trim impact frames 00:17 - 00:19.',
            instructionsUrdu: 'Add clear on-screen text: "Staged comedy sketch with trained actors" and trim impact frames 00:17 - 00:19.',
            suggestedCut: 'Trim 00:17 - 00:19 + Overlay Disclaimer'
          }
        }
      ],
      categoryScores: {
        childSafety: 12,
        violenceGore: 86,
        harmfulDangerous: 74,
        hateHarassment: 68,
        sexualContent: 0,
        advertiserSuitability: 95
      },
      recommendedActionsList: [
        'Mute opening 5-second profanity to preserve ad revenue.',
        'Add persistent "Staged Comedy Sketch" disclaimer watermark.',
        'Trim high-impact punch frames at 00:18.'
      ],
      safeCutSummary: {
        originalDuration: '00:42',
        safeDurationAfterCuts: '00:39',
        removedSecondsTotal: 3
      },
      scannedAt: 'Just now',
      strictnessMode: 'STANDARD'
    }
  },
  {
    id: 'sample-culinary-masterclass',
    title: 'Japanese Sashimi Knife Slicing Masterclass',
    category: 'Cooking & Education',
    durationSec: 54,
    durationFormatted: '00:54',
    expectedResult: 'CLEAN',
    shortDesc: 'A professional chef slicing salmon with a sharp Yanagiba knife in a clean restaurant kitchen.',
    thumbnailPlaceholderColor: 'from-emerald-950 to-slate-900',
    mockReport: {
      id: 'report-chef-safe',
      videoTitle: 'Japanese Sashimi Knife Slicing Masterclass',
      videoDurationSec: 54,
      durationFormatted: '00:54',
      overallRiskScore: 6,
      safetyGrade: 'SAFE_TO_UPLOAD',
      strikeProbabilityPct: 2,
      demonetizationProbabilityPct: 4,
      first7SecondsStatus: 'COMPLIANT',
      totalIssuesCount: 0,
      criticalIssuesCount: 0,
      warningsCount: 0,
      summaryVerdictEn: '100% Safe to Upload. Sharp cutlery is used in an authentic culinary and educational context with controlled professional technique.',
      summaryVerdictUrdu: '100% Safe to Upload. Sharp cutlery is used in an authentic culinary and educational context with controlled professional technique.',
      timelineViolations: [],
      categoryScores: {
        childSafety: 0,
        violenceGore: 4,
        harmfulDangerous: 5,
        hateHarassment: 0,
        sexualContent: 0,
        advertiserSuitability: 2
      },
      recommendedActionsList: [
        'Video is fully compliant with YouTube Community Guidelines.',
        'Green light for immediate monetization and public scheduling.'
      ],
      safeCutSummary: {
        originalDuration: '00:54',
        safeDurationAfterCuts: '00:54',
        removedSecondsTotal: 0
      },
      scannedAt: 'Just now',
      strictnessMode: 'STANDARD'
    }
  },
  {
    id: 'sample-motorcycle-stunt',
    title: 'Highway Motorcycle Acceleration & Lane Splitting',
    category: 'Automotive / Vlogging',
    durationSec: 36,
    durationFormatted: '00:36',
    expectedResult: 'DEMONETIZATION_WARNING',
    shortDesc: 'POV helmet camera showing rapid highway speeding and close vehicle passing.',
    thumbnailPlaceholderColor: 'from-amber-950 to-slate-900',
    mockReport: {
      id: 'report-moto-stunt',
      videoTitle: 'Highway Motorcycle Acceleration & Lane Splitting',
      videoDurationSec: 36,
      durationFormatted: '00:36',
      overallRiskScore: 58,
      safetyGrade: 'MONETIZATION_AT_RISK',
      strikeProbabilityPct: 28,
      demonetizationProbabilityPct: 74,
      first7SecondsStatus: 'COMPLIANT',
      totalIssuesCount: 1,
      criticalIssuesCount: 0,
      warningsCount: 1,
      summaryVerdictEn: 'Moderate risk. Reckless driving and rapid traffic weaving can trigger YouTube Dangerous Organizations & Harmful Acts soft-demonetization or age restrictions.',
      summaryVerdictUrdu: 'Moderate risk. Reckless driving and rapid traffic weaving can trigger YouTube Dangerous Organizations & Harmful Acts soft-demonetization or age restrictions.',
      timelineViolations: [
        {
          id: 'viol-moto-1',
          timestampStart: '00:18',
          timestampEnd: '00:24',
          secondsStart: 18,
          secondsEnd: 24,
          severity: 'DEMONETIZATION_WARNING',
          category: 'DANGEROUS_CONTENT',
          categoryLabel: 'Harmful or Dangerous Acts',
          title: 'High-Speed Traffic Weaving',
          youtubePolicyRef: 'YouTube Harmful or Dangerous Acts Policy - Reckless Driving without Safety Controls',
          descriptionEn: 'Showing apparent extreme traffic violation without a safety warning prompt may result in age-gating (18+) or advertiser suppression.',
          descriptionUrdu: 'Showing apparent extreme traffic violation without a safety warning prompt may result in age-gating (18+) or advertiser suppression.',
          actionableFix: {
            actionType: 'ADD_DISCLAIMER',
            instructionsEn: 'Include a road safety notice and blur speedometer readout at 00:20.',
            instructionsUrdu: 'Include a road safety notice and blur speedometer readout at 00:20.',
            suggestedCut: 'Blur speedometer reading at 00:20 - 00:23'
          }
        }
      ],
      categoryScores: {
        childSafety: 0,
        violenceGore: 10,
        harmfulDangerous: 62,
        hateHarassment: 0,
        sexualContent: 0,
        advertiserSuitability: 70
      },
      recommendedActionsList: [
        'Blur the speedometer display between 00:20 and 00:23.',
        'Include a disclaimer that riding was conducted on a regulated track or in full compliance.',
        'Avoid title phrasing like "Insane 200km/h Speed Run".'
      ],
      safeCutSummary: {
        originalDuration: '00:36',
        safeDurationAfterCuts: '00:36',
        removedSecondsTotal: 0
      },
      scannedAt: 'Just now',
      strictnessMode: 'STANDARD'
    }
  }
];
