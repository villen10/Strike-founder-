/**
 * YouTube Algorithmic Moderation & Community Guidelines Master Knowledge Base
 * Comprehensive operational guide covering Public, Unlisted, and Private video inspection,
 * 3-Strikes Law, Automated Ingestion Pipelines, Child Safety, Advertiser Suitability,
 * Violent Content, and the EDSA Legal Defense Framework.
 */

export interface MasterPolicyArticle {
  id: string;
  category:
    | 'INGESTION_ARCHITECTURE'
    | 'STRIKES_LAW'
    | 'SEXUAL_NUDITY'
    | 'ILLEGAL_ACTS'
    | 'CHILD_SAFETY'
    | 'ADVERTISER_SUITABILITY'
    | 'VIOLENCE_GRAPHIC'
    | 'HARMFUL_STUNTS'
    | 'HATE_HARASSMENT'
    | 'REUSED_CONTENT'
    | 'EDSA_DEFENSE'
    | 'ALGORITHM_HEURISTICS';
  title: string;
  shortSummary: string;
  algorithmicSeverity: 'CRITICAL_IMMEDIATE_STRIKE' | 'YELLOW_DEMONETIZATION' | 'AGE_GATE_RESTRICTION' | 'INFORMATIONAL';
  detectionMechanisms: string[];
  publicVsUnlistedVsPrivateBehavior: string;
  fullPolicyRules: string[];
  exactTimestampGuidelines: string[];
  actionableRemediation: string;
  appealBlueprint: {
    edsaSection: string;
    keyArgument: string;
    sampleStudioPrompt: string;
  };
}

export const YOUTUBE_MASTER_KNOWLEDGE_BASE: MasterPolicyArticle[] = [
  {
    id: 'ingest-visibility-modes',
    category: 'INGESTION_ARCHITECTURE',
    title: 'Public vs Unlisted vs Private: Algorithmic Ingestion & Automated Bot Scanning',
    shortSummary:
      'YouTube automated ingestion bots inspect 100% of uploaded video files regardless of visibility mode. Setting a video to Unlisted or Private does NOT protect against Community Guidelines strikes.',
    algorithmicSeverity: 'CRITICAL_IMMEDIATE_STRIKE',
    detectionMechanisms: [
      'Raw Video Transcode Ingest: Hash matching against the Global CSAE and Shared Content Moderation databases executes during initial server processing.',
      'Temporal Frame Decomposition: Automated neural networks sample keyframes (every 0.5s to 2s) to detect weapons, nudity, blood, minor endangerment, and hazardous equipment.',
      'Audio Waveform Acoustic & NLP Transcription: Speech-to-text models transcribe spoken dialogue within 90 seconds of file upload to detect profanity, hate speech, and harassment.',
      'Optical Character Recognition (OCR): On-screen text, burned-in subtitles, and visible road signs are extracted and parsed for policy violations.',
    ],
    publicVsUnlistedVsPrivateBehavior:
      'CRITICAL MISCONCEPTION: Many creators believe Unlisted or Private modes act as safe sandboxes. In reality, automated strike enforcement runs identically on Public, Unlisted, and Private uploads. While Unlisted protects against user flags, automated classifiers issue instantaneous strikes and video takedowns across all three visibility states.',
    fullPolicyRules: [
      'Rule 1.1: Every byte transmitted to YouTube ingest servers enters the Automated Content Verification pipeline before publishing is permitted.',
      'Rule 1.2: If an automated classifier detects severe violations (e.g. child safety or violent extremism), the video is blocked immediately and a channel strike is registered, even if the video was set to Private.',
      'Rule 1.3: Drafts abandoned in processing remain subject to policy scans if stored on YouTube infrastructure.',
      'Rule 1.4: Recommended Creator Protocol: Always run local pre-upload analysis with Strike Founder before pushing files to YouTube Studio.',
    ],
    exactTimestampGuidelines: [
      'First 5 minutes of ingest: Automated hash-checks and acoustic classifiers execute.',
      'Draft processing phase: High-resolution frame classifiers finalize edge detection.',
      'Best Practice: If testing an upload, upload as Unlisted at least 4 hours before scheduled release to catch automated yellow-dollar flags early.',
    ],
    actionableRemediation:
      'Never upload raw, unedited footage with borderline hazards to test on YouTube servers. Perform frame trims and privacy blurs locally in CapCut, Premiere, or DaVinci Resolve before uploading.',
    appealBlueprint: {
      edsaSection: 'Section 1.1 Ingestion Review',
      keyArgument:
        'Video was uploaded in draft/unlisted mode for automated pre-check validation and was not distributed to public viewers. The flagged frame is non-hazardous and isolated.',
      sampleStudioPrompt:
        'The flagged sequence at [00:00] was detected by an automated classifier during ingest. This content does not violate Community Guidelines as documented under educational context.',
    },
  },
  {
    id: 'three-strikes-law-escalation',
    category: 'STRIKES_LAW',
    title: 'The 3-Strikes System: Escalation Protocol, Account Restrictions, and Channel Termination',
    shortSummary:
      'Community Guidelines strikes follow a strict 90-day rolling escalation. Three active strikes within any 90-day window results in permanent channel deletion and account bans across Google.',
    algorithmicSeverity: 'CRITICAL_IMMEDIATE_STRIKE',
    detectionMechanisms: [
      'Automated Strike Counter: Channel reputation ledger maintains a 90-day timestamped record of all active penalties.',
      'Publishing Privilege Lock: Automated API locks immediately revoke upload, livestreaming, and community posting rights upon Strike 1 or Strike 2 issuance.',
      'Network Ban Cascade: A 3-strike termination triggers automated closure of all associated and newly created channels registered under the same AdSense, phone, or recovery email.',
    ],
    publicVsUnlistedVsPrivateBehavior:
      'Strikes incurred from Unlisted or Private uploads carry the identical legal weight and upload freeze penalties as strikes from viral Public videos.',
    fullPolicyRules: [
      'Stage 0: Lifetime Warning — First infraction receives a formal warning. Video is removed, but channel features remain unlocked. One lifetime warning per channel.',
      'Stage 1: First Strike (1-Week Freeze) — Second violation within 90 days. All uploading, custom thumbnails, Shorts publishing, and livestreams are completely frozen for 7 days. Strike remains active for 90 days.',
      'Stage 2: Second Strike (2-Week Freeze) — Third violation within the active 90-day window. Complete publishing freeze for 14 consecutive days. Remains active for 90 days.',
      'Stage 3: Third Strike (Permanent Termination) — Fourth violation within 90 days. Channel is permanently deleted, all videos erased, and creator is permanently prohibited from owning or creating any YouTube channels.',
      'Distinct Separation: Community Guidelines strikes are tracked independently from Copyright (DMCA) strikes. However, 3 strikes in EITHER system triggers channel termination.',
    ],
    exactTimestampGuidelines: [
      'Day 1 to 7 post-Strike 1: Uploading privileges completely disabled.',
      'Day 1 to 14 post-Strike 2: Complete publishing lockout.',
      'Day 90: Active strike expires from channel record, provided no additional strikes occurred.',
    ],
    actionableRemediation:
      'If your channel has 1 active strike, operate under PARANOID ZERO-RISK mode. Eliminate any ambiguous cuts, stunts, or opening profanity until the 90-day probation window clears.',
    appealBlueprint: {
      edsaSection: 'Section 2.3 Strike Overturn Request',
      keyArgument:
        'The automated removal was a false-positive misclassification. The creator maintains good community standing and the flagged sequence fulfills platform safe guidelines.',
      sampleStudioPrompt:
        'Respectfully requesting manual policy re-examination of the strike issued on [Video Title]. The automated bot misidentified staged artistic presentation as a guideline violation.',
    },
  },
  {
    id: 'child-safety-coppa-standards',
    category: 'CHILD_SAFETY',
    title: 'Child Safety & Minor Protection: Zero-Tolerance Automated Strike Rules',
    shortSummary:
      'YouTube enforces its strictest algorithmic filters on content containing minors. Unsupervised access to sharp cutlery, flame, high-elevation stunts, or distressing pranks triggers instant removal and strikes.',
    algorithmicSeverity: 'CRITICAL_IMMEDIATE_STRIKE',
    detectionMechanisms: [
      'Facial Age Estimation Classifiers: Neural models detect juvenile facial proportions and body stature within frame.',
      'Object Hazard Proximity Detection: Classifiers detect sharp blades (kitchen knives, shears), open fire, stove burners, or power tools within reaching distance of detected minors.',
      'Audio Distress Audio-Cues: Screaming, sudden high-decibel weeping, or aggressive scolding directed at toddlers triggers distress moderation alerts.',
    ],
    publicVsUnlistedVsPrivateBehavior:
      'Child Safety is classified under global zero-tolerance mandates. Private family vlogs with unsafe scenes are flagged and removed automatically with channel strikes.',
    fullPolicyRules: [
      'Rule 3.1: Minors must never be shown handling, or in unsupervised physical proximity to, sharp blades, flames, firearms, or chemical hazards.',
      'Rule 3.2: Pranks that induce acute psychological terror, fear of abandonment, or severe distress in minors are classified as Child Endangerment and removed immediately.',
      'Rule 3.3: In family vlogs, a responsible adult must be visibly present in the frame supervising any potentially hazardous activity (cooking, sports, animals).',
      'Rule 3.4: Ambiguous prop cutlery or toys that resemble real combat knives must feature clear visual disclaimers or be omitted.',
    ],
    exactTimestampGuidelines: [
      'Keyframe 00:04 - 00:08: Flagged toddler reaching for chef knife without adult hand in frame.',
      'Actionable threshold: Any frame where a blade is within 1 meter of a minor without visible adult holding it.',
    ],
    actionableRemediation:
      'Trim the entire segment where the toddler is alone near the cutlery (e.g. cut 00:04 to 00:08). Re-edit to show the parent holding and using the utensil properly.',
    appealBlueprint: {
      edsaSection: 'Section 3.2 Family Supervision Exception',
      keyArgument:
        'The cutlery shown was a dull, food-safe plastic toddler prop. A parent was seated directly beside the child just outside the camera framing.',
      sampleStudioPrompt:
        'Appeal under Child Safety Policy: The video portrays supervised family meal preparation with child-safe dull silicone props. At no point was the minor in danger.',
    },
  },
  {
    id: 'advertiser-suitability-7s-rule',
    category: 'ADVERTISER_SUITABILITY',
    title: 'Advertiser Suitability & The First 7-Second Rule (Yellow Dollar Prevention)',
    shortSummary:
      'Profanity, physical violence, blood, or shock imagery within the first 7 seconds of a video triggers automated demonetization (Limited Ads / Yellow Icon). Opening hooks must be 100% clean.',
    algorithmicSeverity: 'YELLOW_DEMONETIZATION',
    detectionMechanisms: [
      'Opening Hook Audio Spectral Analyzer: Automatic speech recognition indexes the exact timestamp of all profane lexicon within the first 15 seconds.',
      'Visual Shock & Blood Detectors: Evaluates opening keyframes for visceral gore, medical procedures, or high-intensity jump-scares.',
      'Advertiser-Friendly Self-Certification Bot: Cross-checks creator self-certification ratings against automated machine scores.',
    ],
    publicVsUnlistedVsPrivateBehavior:
      'Automated ad-suitability scanning runs during video processing. If an unlisted video has opening profanity, it is marked Limited Ads before the creator can even publish it.',
    fullPolicyRules: [
      'Rule 4.1 (0s to 7s): Zero strong profanity (F-word, vulgar insults, graphic sexual terms). Any strong profanity in the first 7 seconds triggers automatic Limited Ads.',
      'Rule 4.2 (8s to 15s): Moderate profanity is permissible only if infrequent. Repeated vulgarity in the opening 15 seconds lowers ad tier.',
      'Rule 4.3 (After 15s): Light or moderate profanity throughout the body of the video generally allows Green Dollar monetization.',
      'Rule 4.4: Opening frames must not lead with bloody injuries, violent combat impacts, or explicit sexual references.',
    ],
    exactTimestampGuidelines: [
      '00:00 - 00:07: Must be 100% advertiser-safe. No bleeped or audible expletives.',
      '00:07 - 00:15: Permissible for mild comedic dialogue without intense shock value.',
      '00:15+: Standard community standards apply.',
    ],
    actionableRemediation:
      'Mute or bleep out words between 00:00 and 00:07, or insert an intro bumper/title card to push spoken dialogue past the 10-second mark.',
    appealBlueprint: {
      edsaSection: 'Section 4.1 Self-Certification Re-Check',
      keyArgument:
        'The dialogue between 00:00 and 00:07 contains no vulgar or profane language. Audio bleeps or comedic sound effects were misclassified.',
      sampleStudioPrompt:
        'Requesting human ad-suitability review. Spoken dialogue in the first 7 seconds complies with advertiser standards and contains no profanity.',
    },
  },
  {
    id: 'harmful-dangerous-stunts',
    category: 'HARMFUL_STUNTS',
    title: 'Harmful or Dangerous Content: Stunts, Speeding, Challenges, and Cyber Hazards',
    shortSummary:
      'Content depicting acts likely to cause severe physical harm or death (extreme parkour, reckless driving, choking games, dangerous DIY chemical recipes) is prohibited.',
    algorithmicSeverity: 'CRITICAL_IMMEDIATE_STRIKE',
    detectionMechanisms: [
      'Speedometer & Optical Flow Velocity Estimation: Analyzes road motion vectors to flag extreme street racing or reckless vehicular maneuvering.',
      'Dangerous Object & Fire Ingest Models: Identifies fireworks, pyrotechnic tampering, high-voltage equipment, and fall risks.',
      'Viral Challenge Hashtag Blacklist: Automatically flags video titles and tags associated with known harmful real-world challenges.',
    ],
    publicVsUnlistedVsPrivateBehavior:
      'Automated safety bots remove dangerous stunts regardless of unlisted status to prevent viral sharing of life-threatening instructions.',
    fullPolicyRules: [
      'Rule 5.1: Do not show stunts where improper execution could lead to fatal injury or permanent disability without professional safety gear and controlled environments.',
      'Rule 5.2: Reckless vehicular operations (weaving through oncoming traffic, extreme speeding) without professional track context will be age-gated or removed.',
      'Rule 5.3: Disclaimers: Placing text "Do not attempt" does NOT grant immunity from Community Guidelines if the video promotes imitation.',
    ],
    exactTimestampGuidelines: [
      'Vehicle drift segments: Blur visible speedometer if exceeding local legal limits.',
      'High-altitude stunts: Ensure safety harness or professional rigging is visible in frame.',
    ],
    actionableRemediation:
      'Trim impact or near-miss frames. Include on-screen notice explaining closed-course filming and stunt-driver credentials.',
    appealBlueprint: {
      edsaSection: 'Section 5.4 Professional Stunt Exemption',
      keyArgument:
        'Performance was executed by trained professionals in a closed, controlled testing environment with full emergency medical personnel present.',
      sampleStudioPrompt:
        'Appeal under Professional Demonstration guidelines: Filmed in a private closed facility with certified safety rigging. No public endangerment occurred.',
    },
  },
  {
    id: 'edsa-defense-doctrine',
    category: 'EDSA_DEFENSE',
    title: 'The EDSA Defense Doctrine: Overturning False-Positive Bot Removals',
    shortSummary:
      'YouTube policy grants explicit exemptions under the Educational, Documentary, Scientific, or Artistic (EDSA) framework. Proper appeal structure achieves an 80%+ reversal rate.',
    algorithmicSeverity: 'INFORMATIONAL',
    detectionMechanisms: [
      'Human Review Escalation Queue: Properly formatted appeals citing specific timecodes bypass automated refusal bots and reach human Trust & Safety specialists.',
      'Character-Constrained Parsing: YouTube Studio enforces an 800-character ceiling on appeal inputs. Appeals exceeding limits or lacking timestamps fail.',
    ],
    publicVsUnlistedVsPrivateBehavior:
      'Appeals follow identical processing whether the video was Public or Unlisted at the time of takedown.',
    fullPolicyRules: [
      'Principle 1: Educational Context — Explicit commentary explaining the history, technique, or dangers of an event converts apparent violations into educational discourse.',
      'Principle 2: Documentary Context — Recording real-world news events without endorsing or promoting violence is protected under journalistic guidelines.',
      'Principle 3: Scientific Context — Demonstrating chemical reactions or biological processes with laboratory controls is protected.',
      'Principle 4: Artistic / Dramatic Context — Staged theatrical performances with visible props and dramatic cues must be explained.',
    ],
    exactTimestampGuidelines: [
      'Always cite the exact timestamp flagged by the bot (e.g. 00:04 - 00:08).',
      'Limit appeal text to 600 - 750 characters to guarantee it fits YouTube Studio description limits.',
    ],
    actionableRemediation:
      'Use the Strike Founder Strike Appeal Kit to generate a tailored 800-character EDSA counter-appeal and submit directly via YouTube Studio > Content > Restrictions > Appeal.',
    appealBlueprint: {
      edsaSection: 'Section 6.1 EDSA Overarching Exemption',
      keyArgument:
        'The content is created strictly for educational commentary. The automated bot misclassified staged performance as genuine harm.',
      sampleStudioPrompt:
        'Dear YouTube Review Team, this video was flagged by automated classifiers. Under EDSA Section 4 guidelines, this footage serves an educational purpose with clear disclaimers.',
    },
  },
  {
    id: 'violence-graphic-staged-brawls',
    category: 'VIOLENCE_GRAPHIC',
    title: 'Violence & Graphic Content: Realistic Street Fights & Staged Comedy Skits',
    shortSummary:
      'Automated vision models cannot inherently differentiate between a real street brawl and staged comedy acting without explicit contextual cues and restrained physical impact frames.',
    algorithmicSeverity: 'CRITICAL_IMMEDIATE_STRIKE',
    detectionMechanisms: [
      'Motion Impact Vector Analysis: Rapid closed-fist acceleration toward human head/body bounding boxes triggers violence classifiers.',
      'Blood Pixel Chromaticity: Classifiers flag red chromatic splatter or simulated wound makeup as real gore.',
      'Audio Punch & Slap Acoustic Signatures: High-peak foley punch sounds reinforce automated strike triggers.',
    ],
    publicVsUnlistedVsPrivateBehavior:
      'Real violence is removed across all modes. Staged skits without disclaimers risk immediate automated channel strikes.',
    fullPolicyRules: [
      'Rule 7.1: Gratuitous physical violence, real street fighting, or assaults intended to shock or disgust are banned.',
      'Rule 7.2: For staged comedy or theatrical action, include permanent burned-in on-screen text: "Staged performance by trained actors — no real injuries".',
      'Rule 7.3: Trim direct impact frames where fists connect with heads or faces.',
    ],
    exactTimestampGuidelines: [
      '00:15 - 00:20: Flagged physical altercation impact frames.',
      'Remediation: Trim 3 impact frames or blur fist contact point.',
    ],
    actionableRemediation:
      'Add on-screen theatrical disclaimer text and cut 2-3 frames of direct head impact in your video editor.',
    appealBlueprint: {
      edsaSection: 'Section 7.2 Theatrical Performance Exemption',
      keyArgument:
        'The scene is a choreographed fictional comedy sketch performed by trained actors with silicone props and foam padding.',
      sampleStudioPrompt:
        'Appeal under Theatrical/Artistic guidelines: The flagged sequence is choreographed fictional comedy with trained actors. No actual violence occurred.',
    },
  },
  {
    id: 'reused-content-fair-use',
    category: 'REUSED_CONTENT',
    title: 'Reused Content, Repetitive Uploads, and YouTube Partner Program Monetization',
    shortSummary:
      'Uploading clips of other creators or automated compilation reels without significant original commentary, analysis, or editing triggers Reused Content demonetization.',
    algorithmicSeverity: 'YELLOW_DEMONETIZATION',
    detectionMechanisms: [
      'Content ID Fingerprint Matching: Compares video and audio waveforms against registered media databases.',
      'Visual Duplicate Frame Matching: Flags identical video sequences re-uploaded across multiple accounts.',
      'Voiceover Synthesis Classifier: Evaluates whether spoken voiceover provides original educational commentary.',
    ],
    publicVsUnlistedVsPrivateBehavior:
      'Content ID runs instantly upon file upload to determine copyright ownership and monetization eligibility.',
    fullPolicyRules: [
      'Rule 8.1: To qualify for monetization, third-party clips must be accompanied by transformative narrative commentary or educational critique.',
      'Rule 8.2: Pure compilations with only background music and minimal reaction faces are classified as Reused Content.',
    ],
    exactTimestampGuidelines: [
      'Ensure original commentary occurs every 10-15 seconds over third-party clips.',
    ],
    actionableRemediation:
      'Interleave full-screen host commentary, visual diagrams, and transformative voice critique throughout the footage.',
    appealBlueprint: {
      edsaSection: 'Section 8.3 Fair Use Transformativeness',
      keyArgument:
        'Footage constitutes transformative critique under Fair Use doctrine with comprehensive original voiceover analysis.',
      sampleStudioPrompt:
        'Appeal for monetization review: All referenced footage is utilized under Fair Use for educational analysis and transformative commentary.',
    },
  },
  {
    id: 'sex-nudity-zero-tolerance-all-formats',
    category: 'SEXUAL_NUDITY',
    title: 'Sex, Nudity & Adult Content: Zero-Tolerance Enforcement Across All Formats',
    shortSummary:
      'Zero-tolerance policy strictly bans any pornography, sexual acts, genital/buttock/breast exposure, or adult platform footage, including screen recordings of adult sites, split-screen disguised clips, and non-mainstream formats.',
    algorithmicSeverity: 'CRITICAL_IMMEDIATE_STRIKE',
    detectionMechanisms: [
      'Pixel Skin-Tone Clustering & Anatomical Localization: Automated vision models detect bare skin clusters, genital areas, and erotic posture vectors.',
      'Adult Platform Fingerprinting: Hashes and optical watermarks from adult entertainment sites (xHamster, Pornhub, OnlyFans, Cam4, etc.) trigger instant automated takedowns.',
      'Split-Screen & Camouflage Deconstruction: Machine learning models isolate multi-pane video segments (e.g. mobile gameplay beneath, adult screen above) to analyze each sub-frame independently.',
      'Low-Res & Off-Screen Recording Detection: Convolutional classifiers detect monitor moiré patterns and screen borders to identify phone-recorded clips of adult videos.',
    ],
    publicVsUnlistedVsPrivateBehavior:
      'Zero tolerance across all modes. Uploading adult or sexually explicit content in Unlisted or Private mode results in immediate automated deletion and direct Community Guidelines strikes.',
    fullPolicyRules: [
      'Rule 9.1: Absolute prohibition on intercourse, oral sex, masturbation, exposed genitalia, bare buttocks, or uncovered breasts/nipples.',
      'Rule 9.2: Screen recordings of adult sites or phone-recorded monitor playback are flagged with the exact same strike severity as raw media.',
      'Rule 9.3: Split-screen edits, meme overlays, reaction formats, or ironic "cringe compilations" containing sexual imagery are NOT protected by Fair Use or parody exceptions.',
      'Rule 9.4: Animated, CGI, 3D rendered, or hentai pornography violates platform rules and triggers immediate strikes.',
      'Rule 9.5: Zero-Tolerance False-Negative Protocol: If visual or acoustic indicators suggest adult material, classifiers mandate an immediate HIGH_STRIKE_RISK rating.',
    ],
    exactTimestampGuidelines: [
      'Any second of exposed private areas or sexual acts results in video-wide strike and removal.',
    ],
    actionableRemediation:
      'Do NOT upload adult or sexually explicit content to YouTube. If medical/artistic, apply 100% full opaque blurring, educational voiceover commentary, and age-gate.',
    appealBlueprint: {
      edsaSection: 'Section 9.1 Nudity Context Guidelines',
      keyArgument:
        'The flagged imagery was completely non-sexual, purely educational/documentary, and adhered to YouTube EDSA standards.',
      sampleStudioPrompt:
        'Formal appeal: The flagged sequence contains no prohibited sexually explicit acts or nudity and was misclassified by automated ingestion algorithms.',
    },
  },
  {
    id: 'illegal-acts-contraband-cybercrime',
    category: 'ILLEGAL_ACTS',
    title: 'Illegal Acts, Contraband, Weapons & Cybercrime: Strict Platform Prohibition',
    shortSummary:
      'Depicting or facilitating illegal acts, criminal contraband, unregistered firearm manufacturing (3D printed guns/auto-sears), narcotics, cybercrime, or street violence triggers immediate channel strikes and law-enforcement referral.',
    algorithmicSeverity: 'CRITICAL_IMMEDIATE_STRIKE',
    detectionMechanisms: [
      'Contraband & Weapon CAD Model Heuristics: Classifiers recognize 3D-printer g-code rendering, ghost gun frames, drop-in auto sears, and Glock switches.',
      'Substance & Paraphernalia Recognition: Identifies narcotic smoking, injection paraphernalia, prescription pill distribution, and clandestine laboratory equipment.',
      'Cybercrime & Darknet OCR: Analyzes on-screen text for credential database leaks, credit card dumps (carding), ransomware command lines, and darknet marketplace URLs.',
      'Real-World Criminal Activity Detection: Flags burglary, organized retail theft, vehicle break-ins, and high-speed police chases.',
    ],
    publicVsUnlistedVsPrivateBehavior:
      'Criminal facilitation or depictions of severe illegal acts are blocked during transcode ingest in all visibility modes.',
    fullPolicyRules: [
      'Rule 10.1: Instructional content on manufacturing firearms, 3D printing lower receivers, installing full-auto conversion switches, or crafting explosives is strictly banned.',
      'Rule 10.2: Content depicting illicit hard drug consumption, narcotics distribution, or drug synthesis instructions is removed immediately.',
      'Rule 10.3: Demonstrations of unauthorized hacking, credential theft, Doxing individuals, or financial fraud/carding are classified as Harmful & Dangerous.',
      'Rule 10.4: Non-mainstream formats (phone recordings of security monitors, Telegram contraband chats, dark web market recordings) are scrutinized with zero tolerance.',
    ],
    exactTimestampGuidelines: [
      'Any segment showcasing illegal weapon modification or hard drug consumption is flagged for instant strike.',
    ],
    actionableRemediation:
      'Remove all scenes depicting criminal conduct, drug consumption, weapon manufacturing, or cybercrime tools from your project timeline.',
    appealBlueprint: {
      edsaSection: 'Section 10.2 Cybersecurity & Journalism Exception',
      keyArgument:
        'Content is authorized journalistic reporting or ethical defensive cybersecurity education conducted in a safe, legal testing environment.',
      sampleStudioPrompt:
        'Appeal under Journalistic/Educational exception: The video reports on cyber threats with no instructional exploitation or criminal facilitation.',
    },
  },
];
