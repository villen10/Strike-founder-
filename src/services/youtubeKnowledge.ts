export interface KnowledgeArticle {
  id: string;
  category: 'VISIBILITY' | 'STRIKES' | 'MONETIZATION' | 'CHILD_SAFETY' | 'VIOLENCE' | 'APPEALS';
  titleEn: string;
  titleUrdu: string;
  summaryEn: string;
  summaryUrdu: string;
  fullRulesEn: string[];
  fullRulesUrdu: string[];
  proTipEn: string;
  proTipUrdu: string;
  strikeSeverity: 'CRITICAL' | 'WARNING' | 'INFO';
}

export const YOUTUBE_KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'public-unlisted-private',
    category: 'VISIBILITY',
    titleEn: 'Public vs Unlisted vs Private: How YouTube Algorithms Scan Each Mode',
    titleUrdu: 'Public vs Unlisted vs Private: How YouTube Algorithms Scan Each Mode',
    summaryEn: 'A widespread misconception is that Unlisted or Private videos are immune from community strikes. In reality, YouTube automated ingest algorithms scan 100% of video uploads immediately.',
    summaryUrdu: 'A widespread misconception is that Unlisted or Private videos are immune from community strikes. In reality, YouTube automated ingest algorithms scan 100% of video uploads immediately.',
    fullRulesEn: [
      'Algorithmic Ingestion: The moment you upload a video (even in draft, processing, or private status), YouTube executes automated Content ID, Child Safety, and Violent Extremism hash checks.',
      'Unlisted Videos: While unlisted mode shields your video from human user reports, it is 100% exposed to automated bot strikes. An unlisted video containing severe violations will be taken down with a channel strike within minutes.',
      'Private Videos: Private videos undergo automated abuse analysis. Severe Community Guidelines breaches on private uploads will still trigger official strikes and upload restrictions.',
      'Recommended Workflow: Upload your video as Unlisted at least 2 to 4 hours before your planned public release to allow automated processing and compliance checks to finalize safely.'
    ],
    fullRulesUrdu: [
      'Algorithmic Ingestion: The moment you upload a video (even in draft, processing, or private status), YouTube executes automated Content ID, Child Safety, and Violent Extremism hash checks.',
      'Unlisted Videos: While unlisted mode shields your video from human user reports, it is 100% exposed to automated bot strikes. An unlisted video containing severe violations will be taken down with a channel strike within minutes.',
      'Private Videos: Private videos undergo automated abuse analysis. Severe Community Guidelines breaches on private uploads will still trigger official strikes and upload restrictions.',
      'Recommended Workflow: Upload your video as Unlisted at least 2 to 4 hours before your planned public release to allow automated processing and compliance checks to finalize safely.'
    ],
    proTipEn: 'Never treat Unlisted or Private status as a sandbox for rule-breaking clips. Always run an audit with Strike Founder and apply necessary cuts before publishing to YouTube.',
    proTipUrdu: 'Never treat Unlisted or Private status as a sandbox for rule-breaking clips. Always run an audit with Strike Founder and apply necessary cuts before publishing to YouTube.',
    strikeSeverity: 'CRITICAL',
  },
  {
    id: 'strike-system-rules',
    category: 'STRIKES',
    titleEn: 'The 3-Strikes System: Escalation, Penalties, and Termination',
    titleUrdu: 'The 3-Strikes System: Escalation, Penalties, and Termination',
    summaryEn: 'Community Guidelines strikes expire after 90 days, but receiving 3 active strikes within a 90-day window results in permanent channel termination and account closure.',
    summaryUrdu: 'Community Guidelines strikes expire after 90 days, but receiving 3 active strikes within a 90-day window results in permanent channel termination and account closure.',
    fullRulesEn: [
      'Lifetime Warning: On your first violation, you receive a single warning that stays on your channel permanently. No upload privileges are suspended at this initial stage.',
      'First Strike (1 Week Freeze): If another violation occurs, you receive Strike 1. You cannot upload videos, Shorts, live streams, custom thumbnails, or community posts for 7 consecutive days. The strike expires after 90 days.',
      'Second Strike (2 Week Freeze): A second strike within 90 days triggers a complete 14-day ban on publishing any content or community media.',
      'Third Strike (Permanent Termination): Accumulating 3 strikes within 90 days results in immediate channel deletion, erasure of all public videos, and a permanent ban from owning YouTube accounts.'
    ],
    fullRulesUrdu: [
      'Lifetime Warning: On your first violation, you receive a single warning that stays on your channel permanently. No upload privileges are suspended at this initial stage.',
      'First Strike (1 Week Freeze): If another violation occurs, you receive Strike 1. You cannot upload videos, Shorts, live streams, custom thumbnails, or community posts for 7 consecutive days. The strike expires after 90 days.',
      'Second Strike (2 Week Freeze): A second strike within 90 days triggers a complete 14-day ban on publishing any content or community media.',
      'Third Strike (Permanent Termination): Accumulating 3 strikes within 90 days results in immediate channel deletion, erasure of all public videos, and a permanent ban from owning YouTube accounts.'
    ],
    proTipEn: 'Community Guidelines strikes are tracked separately from Copyright strikes. However, reaching 3 active strikes in either system will terminate your channel.',
    proTipUrdu: 'Community Guidelines strikes are tracked separately from Copyright strikes. However, reaching 3 active strikes in either system will terminate your channel.',
    strikeSeverity: 'CRITICAL',
  },
  {
    id: 'first-7-second-rule',
    category: 'MONETIZATION',
    titleEn: 'The Opening 7-Second Rule: Advertiser Suitability & Yellow Dollar Prevention',
    titleUrdu: 'The Opening 7-Second Rule: Advertiser Suitability & Yellow Dollar Prevention',
    summaryEn: 'YouTube Advertiser-Friendly Guidelines strictly evaluate the opening hook. Profanity, blood, or shock value in the first 7 to 15 seconds triggers automatic Limited Ads (Yellow Dollar).',
    summaryUrdu: 'YouTube Advertiser-Friendly Guidelines strictly evaluate the opening hook. Profanity, blood, or shock value in the first 7 to 15 seconds triggers automatic Limited Ads (Yellow Dollar).',
    fullRulesEn: [
      'Opening 7 Seconds: Strong profanity (F-words, intense slurs, graphic vulgarity) in the first 7 seconds triggers automated demonetization across premium advertiser tiers.',
      'Seconds 8 to 15: Moderate profanity in this window may still restrict monetization to limited ad formats unless appropriately bleeped or muted.',
      'Graphic Shock Value: Opening a video with sudden traumatic sounds, violent collisions, or visible bloodshed guarantees automatic ad suppression.',
      'Self-Certification Score: Consistently misrepresenting video content in YouTube Studio Self-Certification will revoke your manual rating privileges and subject all future uploads to delayed automated review.'
    ],
    fullRulesUrdu: [
      'Opening 7 Seconds: Strong profanity (F-words, intense slurs, graphic vulgarity) in the first 7 seconds triggers automated demonetization across premium advertiser tiers.',
      'Seconds 8 to 15: Moderate profanity in this window may still restrict monetization to limited ad formats unless appropriately bleeped or muted.',
      'Graphic Shock Value: Opening a video with sudden traumatic sounds, violent collisions, or visible bloodshed guarantees automatic ad suppression.',
      'Self-Certification Score: Consistently misrepresenting video content in YouTube Studio Self-Certification will revoke your manual rating privileges and subject all future uploads to delayed automated review.'
    ],
    proTipEn: 'Keep the opening 15 seconds 100% clean and family-friendly. Position mature jokes, loud sound effects, or intense audio cues beyond the 30-second mark.',
    proTipUrdu: 'Keep the opening 15 seconds 100% clean and family-friendly. Position mature jokes, loud sound effects, or intense audio cues beyond the 30-second mark.',
    strikeSeverity: 'WARNING',
  },
  {
    id: 'child-safety-coppa',
    category: 'CHILD_SAFETY',
    titleEn: 'Child Safety & Minor Endangerment: Strict Zero-Tolerance Standards',
    titleUrdu: 'Child Safety & Minor Endangerment: Strict Zero-Tolerance Standards',
    summaryEn: 'YouTube applies its most aggressive algorithmic inspection to child-related content. Even innocent family vlog moments can trigger immediate automated channel strikes.',
    summaryUrdu: 'YouTube applies its most aggressive algorithmic inspection to child-related content. Even innocent family vlog moments can trigger immediate automated channel strikes.',
    fullRulesEn: [
      'Accessible Blades & Hazards: Minors shown within arm reach of sharp kitchen knives, scissors, open flames, or fireworks will trigger instant strike action.',
      'Distress & Frightening Pranks: Pranks where children show genuine terror, intense crying, or believe their guardians are in peril are strictly prohibited.',
      'Uncontrolled Stunts with Minors: Children riding vehicle exteriors, jumping from elevated surfaces without protective gear, or handling motorized machinery.',
      'COPPA Classification: Videos predominantly intended for children must be correctly marked as "Made for Kids" to comply with federal regulations.'
    ],
    fullRulesUrdu: [
      'Accessible Blades & Hazards: Minors shown within arm reach of sharp kitchen knives, scissors, open flames, or fireworks will trigger instant strike action.',
      'Distress & Frightening Pranks: Pranks where children show genuine terror, intense crying, or believe their guardians are in peril are strictly prohibited.',
      'Uncontrolled Stunts with Minors: Children riding vehicle exteriors, jumping from elevated surfaces without protective gear, or handling motorized machinery.',
      'COPPA Classification: Videos predominantly intended for children must be correctly marked as "Made for Kids" to comply with federal regulations.'
    ],
    proTipEn: 'Whenever minors appear in footage, ensure responsible adults are visibly supervising within the frame at all times and avoid ambiguous prop cutlery.',
    proTipUrdu: 'Whenever minors appear in footage, ensure responsible adults are visibly supervising within the frame at all times and avoid ambiguous prop cutlery.',
    strikeSeverity: 'CRITICAL',
  },
  {
    id: 'edsa-appeals-doctrine',
    category: 'APPEALS',
    titleEn: 'The EDSA Defense Doctrine: Overturning False-Positive Strikes',
    titleUrdu: 'The EDSA Defense Doctrine: Overturning False-Positive Strikes',
    summaryEn: 'YouTube policy provides specific exemptions under the Educational, Documentary, Scientific, or Artistic (EDSA) framework when appropriate context is documented.',
    summaryUrdu: 'YouTube policy provides specific exemptions under the Educational, Documentary, Scientific, or Artistic (EDSA) framework when appropriate context is documented.',
    fullRulesEn: [
      'Educational: Demonstrating how kitchen knives are utilized in an instructional culinary tutorial.',
      'Documentary: Covering real-world historical events or news reporting with contextual journalistic narration.',
      'Scientific: Documenting laboratory chemical experiments under controlled safety conditions.',
      'Artistic / Theatrical: Scripted sketch comedy, theatrical performances, or cinematic short films with visible disclaimer watermarks.'
    ],
    fullRulesUrdu: [
      'Educational: Demonstrating how kitchen knives are utilized in an instructional culinary tutorial.',
      'Documentary: Covering real-world historical events or news reporting with contextual journalistic narration.',
      'Scientific: Documenting laboratory chemical experiments under controlled safety conditions.',
      'Artistic / Theatrical: Scripted sketch comedy, theatrical performances, or cinematic short films with visible disclaimer watermarks.'
    ],
    proTipEn: 'Use our automated Strike Appeal Kit. It structures your argument directly around EDSA Section 4 principles and adheres strictly to YouTube Studio 800-character limits.',
    proTipUrdu: 'Use our automated Strike Appeal Kit. It structures your argument directly around EDSA Section 4 principles and adheres strictly to YouTube Studio 800-character limits.',
    strikeSeverity: 'INFO',
  },
];
