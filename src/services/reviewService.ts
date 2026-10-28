import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType, User } from './firebase';
import { isUserSuperAdmin } from './adminService';

export interface ReviewReply {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  userAvatar?: string;
  message: string;
  isOfficial?: boolean;
  createdAt: string;
}

export interface ReviewItem {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  userAvatar?: string;
  rating: number; // 1 - 5 stars
  comment: string;
  likesCount: number;
  dislikesCount: number;
  likedBy: string[];
  dislikedBy: string[];
  replies: ReviewReply[];
  isEdited?: boolean;
  createdAt: string;
  updatedAt?: string;
}

const LOCAL_REVIEWS_KEY = 'striku_community_reviews_real_v3';
const REVIEWS_COLLECTION = 'reviews';

// Reviews start at 0. Only authentic reviews submitted by real creators via the UI are stored and shown.
export const SEED_REVIEWS: ReviewItem[] = [];
export const DRIP_REVIEWS_POOL: ReviewItem[] = [];

// Deprecated legacy seed list (disabled)
const _DISABLED_SEED_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-seed-1',
    userId: 'user-tariq-yt',
    userName: 'Tariq Mahmood (Vlog Nation)',
    userEmail: 'tariq@vlognation.pk',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=140&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Striku saved my 450K subscriber channel! Before uploading my Japan travel vlog, Striku detected a background music copyright sample at 04:12 that CapCut had embedded without warning. I trimmed 3 seconds based on the safe-cut timecode and uploaded with zero copyright claims or monetization yellow icons. Truly an indispensable tool for every creator!',
    likesCount: 52,
    dislikesCount: 1,
    likedBy: ['seed-user-1', 'seed-user-2'],
    dislikedBy: [],
    replies: [
      {
        id: 'rep-seed-1',
        userId: 'admin-striku',
        userName: 'Striku Official Support',
        userEmail: 'strikucloud@gmail.com',
        userAvatar: 'https://www.striku.cloud/logo.png',
        message: 'Thank you Tariq! We love seeing your travel vlogs stay 100% monetized and protected. Safe trimming is our top priority!',
        isOfficial: true,
        createdAt: '3 days ago',
      },
    ],
    createdAt: '4 days ago',
  },
  {
    id: 'rev-seed-2',
    userId: 'user-alina-tech',
    userName: 'Alina K. (Tech Bites Studio)',
    userEmail: 'alina@techbites.com',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=140&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'The CapCut safe-cut timecodes are incredible. You literally get exact start and end seconds where dangerous stunt warnings could trigger YouTube community guidelines. Saved me hours of re-rendering and testing. 10/10 recommend to all video editors!',
    likesCount: 38,
    dislikesCount: 0,
    likedBy: ['seed-user-3'],
    dislikedBy: [],
    replies: [],
    createdAt: '5 days ago',
  },
  {
    id: 'rev-seed-3',
    userId: 'user-hamza-gaming',
    userName: 'Hamza Gaming HD',
    userEmail: 'hamza@gamingpk.net',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=140&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Free pre-upload strike checker is legit! I had an intense battle royale montage and was worried about graphic violence flags in the first 10 seconds. Striku scored it 94% safe and flagged just one blood splatter frame. Zero channel risk.',
    likesCount: 31,
    dislikesCount: 0,
    likedBy: [],
    dislikedBy: [],
    replies: [
      {
        id: 'rep-seed-2',
        userId: 'user-tariq-yt',
        userName: 'Tariq Mahmood',
        message: 'Same here bro, the temporal frame detection is super accurate for gaming creators!',
        isOfficial: false,
        createdAt: '4 days ago',
      },
    ],
    createdAt: '6 days ago',
  },
  {
    id: 'rev-seed-4',
    userId: 'user-saad-tech',
    userName: 'Saad Ur Rehman (Karachi Tech Lens)',
    userEmail: 'saad@techlens.pk',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=140&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'I run a multi-editor studio in Karachi. We made it mandatory that every editor runs their 4K timeline export through Striku before sending to client channels. It caught 3 copyrighted commercial audio jingles this week alone!',
    likesCount: 44,
    dislikesCount: 0,
    likedBy: [],
    dislikedBy: [],
    replies: [
      {
        id: 'rep-seed-3',
        userId: 'admin-striku',
        userName: 'Striku Compliance Team',
        userEmail: 'blendagent.online@gmail.com',
        userAvatar: 'https://www.striku.cloud/logo.png',
        message: 'Delighted to support your studio team Saad! Multi-editor workflows are where automated pre-upload audits make the biggest financial impact.',
        isOfficial: true,
        createdAt: '5 days ago',
      },
    ],
    createdAt: '1 week ago',
  },
  {
    id: 'rev-seed-5',
    userId: 'user-ayesha-kitchen',
    userName: 'Ayesha Noor (Craft & Kitchen Diaries)',
    userEmail: 'ayesha@kitchencraft.com',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=140&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'As a cooking vlogger with 180K subscribers, copyright music claims used to be my biggest headache. Royalty-free tracks from Instagram reel downloads often get claimed on YouTube. Striku tells me beforehand which audio stems are risky. Love the peace of mind!',
    likesCount: 29,
    dislikesCount: 1,
    likedBy: [],
    dislikedBy: [],
    replies: [],
    createdAt: '1 week ago',
  },
  {
    id: 'rev-seed-6',
    userId: 'user-marcus-cinema',
    userName: 'Marcus Vance (Vance Cinematic)',
    userEmail: 'marcus@vancecinematic.io',
    userAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=140&auto=format&fit=crop&q=80',
    rating: 4,
    comment: 'The timeline violation inspector is remarkably polished. Clean UI, fast frame-level scans, and actionable trimming recommendations. My only suggestion is adding direct SRT subtitle flagging, but for audio and video policies it is top tier.',
    likesCount: 22,
    dislikesCount: 0,
    likedBy: [],
    dislikedBy: [],
    replies: [
      {
        id: 'rep-seed-4',
        userId: 'admin-striku',
        userName: 'Striku Official Support',
        userEmail: 'strikucloud@gmail.com',
        userAvatar: 'https://www.striku.cloud/logo.png',
        message: 'Great suggestion Marcus! Subtitle and closed-caption keyword policy scans are in active development for our next sprint.',
        isOfficial: true,
        createdAt: '6 days ago',
      },
    ],
    createdAt: '1 week ago',
  },
  {
    id: 'rev-seed-7',
    userId: 'user-bilal-wire',
    userName: 'Bilal Ahmed (Daily Urdu Wire)',
    userEmail: 'bilal@dailyurduwire.com',
    userAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=140&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'News and commentary channels face constant strikes due to graphic news footage. Striku gives us bilingual English & Urdu risk summaries with exact second-by-second blur recommendations. Highly recommended for news creators.',
    likesCount: 35,
    dislikesCount: 0,
    likedBy: [],
    dislikedBy: [],
    replies: [],
    createdAt: '1 week ago',
  },
  {
    id: 'rev-seed-8',
    userId: 'user-chloe-indie',
    userName: 'Chloe Dubois (Indie Film Beats)',
    userEmail: 'chloe@indiefilmbeats.fr',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=140&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'No other platform gives you pre-upload confidence scores like this. Being able to verify our documentary clips before pushing to public YouTube has saved us from 2 potential Content ID disputes with music publishers.',
    likesCount: 18,
    dislikesCount: 0,
    likedBy: [],
    dislikedBy: [],
    replies: [],
    createdAt: '2 weeks ago',
  },
  {
    id: 'rev-seed-9',
    userId: 'user-danial-code',
    userName: 'Danial Raza (SpeedCode Labs)',
    userEmail: 'danial@speedcode.dev',
    userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=140&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'The Channel Studio Tracker paired with the video audit is unbeatable. Real-time subscriber velocity and instant 24h view analytics without sluggish YouTube Studio delays. Awesome engineering work!',
    likesCount: 27,
    dislikesCount: 1,
    likedBy: [],
    dislikedBy: [],
    replies: [],
    createdAt: '2 weeks ago',
  },
  {
    id: 'rev-seed-10',
    userId: 'user-elena-synth',
    userName: 'Elena Rostova (Electro Beats & Synth)',
    userEmail: 'elena@electrobeats.de',
    userAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=140&auto=format&fit=crop&q=80',
    rating: 4,
    comment: 'Audio fingerprinting accuracy is very high. It detected a 7-second drum break sample from an old 80s track that I forgot was un-cleared in my mix. Saved my channel from a demonetization penalty.',
    likesCount: 19,
    dislikesCount: 0,
    likedBy: [],
    dislikedBy: [],
    replies: [],
    createdAt: '2 weeks ago',
  },
  {
    id: 'rev-seed-11',
    userId: 'user-zainab-health',
    userName: 'Zainab Farooq (Health & Mindset PK)',
    userEmail: 'zainab@mindsetpk.org',
    userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=140&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Medical and fitness advice can easily get flagged under YouTube harmful or dangerous content guidelines. Striku flags borderline disclaimer requirements so we can put the right warning labels on screen. Brilliant!',
    likesCount: 33,
    dislikesCount: 0,
    likedBy: [],
    dislikedBy: [],
    replies: [],
    createdAt: '2 weeks ago',
  },
  {
    id: 'rev-seed-12',
    userId: 'user-jason-tech',
    userName: 'Jason Miller (NextGen Tech Reviews)',
    userEmail: 'jason@nextgentech.tv',
    userAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=140&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'The appeal generator modal is a lifesaver. Had a bogus claim on fair use commentary footage, generated an official 3-clause appeal using Striku template, and YouTube dismissed the claim in 36 hours.',
    likesCount: 46,
    dislikesCount: 0,
    likedBy: [],
    dislikedBy: [],
    replies: [
      {
        id: 'rep-seed-5',
        userId: 'admin-striku',
        userName: 'Striku Legal & Compliance',
        userEmail: 'blendagent.online@gmail.com',
        userAvatar: 'https://www.striku.cloud/logo.png',
        message: 'Congratulations Jason! Fair use protections are legally sound when backed by structured timestamped evidence.',
        isOfficial: true,
        createdAt: '1 week ago',
      },
    ],
    createdAt: '3 weeks ago',
  },
  {
    id: 'rev-seed-13',
    userId: 'user-omar-auto',
    userName: 'Omar Siddiqui (The Auto Drive)',
    userEmail: 'omar@theautodrive.com',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=140&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'High speed car tracking shots often trigger automated dangerous stunt flags. Striku detected our closed-track safety warnings and confirmed zero strike risk before publishing. Extremely satisfied with this software.',
    likesCount: 25,
    dislikesCount: 0,
    likedBy: [],
    dislikedBy: [],
    replies: [],
    createdAt: '3 weeks ago',
  },
  {
    id: 'rev-seed-14',
    userId: 'user-priya-cinema',
    userName: 'Priya Sharma (Cinematic Storyteller)',
    userEmail: 'priya@cinestory.in',
    userAvatar: 'https://images.unsplash.com/photo-1534751516642-a171edd25218?w=140&auto=format&fit=crop&q=80',
    rating: 4,
    comment: 'Very intuitive dark mode and responsive layout on mobile. I can check an export while away from my editing desk before giving my assistant the green light to publish.',
    likesCount: 16,
    dislikesCount: 0,
    likedBy: [],
    dislikedBy: [],
    replies: [],
    createdAt: '3 weeks ago',
  },
  {
    id: 'rev-seed-15',
    userId: 'user-farhan-docu',
    userName: 'Farhan Malik (DocuSeries Central)',
    userEmail: 'farhan@docucentral.net',
    userAvatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=140&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Our historical documentary channel had 1 active strike that put us on thin ice. Using Striku for the past two months has kept us at 100% clean record. The peace of mind alone is worth ten times the subscription.',
    likesCount: 41,
    dislikesCount: 0,
    likedBy: [],
    dislikedBy: [],
    replies: [],
    createdAt: '4 weeks ago',
  },
  {
    id: 'rev-seed-16',
    userId: 'user-sophia-arts',
    userName: 'Sophia Chen (Visual Arts Lab)',
    userEmail: 'sophia@visualartslab.ca',
    userAvatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=140&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'The first 7 seconds violation check is brilliant. YouTube algorithms heavily scrutinize the video hook, and Striku makes sure your opening doesn’t trigger accidental shock or misleading content algorithms.',
    likesCount: 28,
    dislikesCount: 0,
    likedBy: [],
    dislikedBy: [],
    replies: [],
    createdAt: '1 month ago',
  },
  {
    id: 'rev-seed-17',
    userId: 'user-usman-cricket',
    userName: 'Usman Tariq (Cricket Talk Live)',
    userEmail: 'usman@crickettalk.pk',
    userAvatar: 'https://images.unsplash.com/photo-1528892952291-009c663ce843?w=140&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Cricket match highlight clips get taken down by broadcast syndicates in minutes. Striku pointed out exact still-image durations that satisfy fair use review standards. Essential for sports commentary creators!',
    likesCount: 39,
    dislikesCount: 1,
    likedBy: [],
    dislikedBy: [],
    replies: [],
    createdAt: '1 month ago',
  },
  {
    id: 'rev-seed-18',
    userId: 'user-david-audio',
    userName: 'David Kowalski (Audio Master HQ)',
    userEmail: 'david@audiomasterhq.com',
    userAvatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=140&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'I test audio mastering plugins on YouTube. Striku accurately identified isolated multi-track stems without giving false positives on standard synthesizer presets. Solid technical engineering!',
    likesCount: 21,
    dislikesCount: 0,
    likedBy: [],
    dislikedBy: [],
    replies: [],
    createdAt: '1 month ago',
  },
  {
    id: 'rev-seed-19',
    userId: 'user-maryam-anim',
    userName: 'Maryam Jamil (Byte-Sized Animation)',
    userEmail: 'maryam@byteanim.com',
    userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=140&auto=format&fit=crop&q=80',
    rating: 5,
    comment: '2D animation takes months to produce, so getting a strike after uploading is devastating. Striku gives us complete peace of mind before premiere night. Highly recommended!',
    likesCount: 34,
    dislikesCount: 0,
    likedBy: [],
    dislikedBy: [],
    replies: [],
    createdAt: '1 month ago',
  },
  {
    id: 'rev-seed-20',
    userId: 'user-sean-pod',
    userName: 'Sean O\'Connor (The Indie Podcaster)',
    userEmail: 'sean@indiepodcast.ie',
    userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=140&auto=format&fit=crop&q=80',
    rating: 4,
    comment: 'Great tool for long-form video podcasts (1-2 hours). Scans through conversational audio and flags sensitive topics that could restrict monetization to limited ads. Very helpful!',
    likesCount: 17,
    dislikesCount: 0,
    likedBy: [],
    dislikedBy: [],
    replies: [],
    createdAt: '1 month ago',
  },
  {
    id: 'rev-seed-21',
    userId: 'user-zeeshan-unbox',
    userName: 'Zeeshan Haider (Mobile Gadgets Unbox)',
    userEmail: 'zeeshan@gadgetsunbox.pk',
    userAvatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=140&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Unboxing tech gear requires background music to stay engaging. Striku flagged a trendy TikTok track that was claimed by Sony Music, so I swapped it before upload. 100% saved my monetization revenue!',
    likesCount: 48,
    dislikesCount: 0,
    likedBy: [],
    dislikedBy: [],
    replies: [
      {
        id: 'rep-seed-6',
        userId: 'admin-striku',
        userName: 'Striku Official Support',
        userEmail: 'strikucloud@gmail.com',
        userAvatar: 'https://www.striku.cloud/logo.png',
        message: 'Always check trending TikTok sounds Zeeshan! Record labels frequently license for TikTok only and enforce Content ID on YouTube.',
        isOfficial: true,
        createdAt: '3 weeks ago',
      },
    ],
    createdAt: '1 month ago',
  },
  {
    id: 'rev-seed-22',
    userId: 'user-nadia-travel',
    userName: 'Nadia Bashir (Lifestyle & Travel Diaries)',
    userEmail: 'nadia@traveldiaries.pk',
    userAvatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=140&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Best tool for Pakistani and international vloggers alike. Clean interface, super fast scans, and the official reply support is always helpful. Proud to support Striku!',
    likesCount: 50,
    dislikesCount: 0,
    likedBy: [],
    dislikedBy: [],
    replies: [],
    createdAt: '1 month ago',
  },
];

// Deprecated legacy drip pool (disabled)
const _DISABLED_DRIP_REVIEWS_POOL: Omit<ReviewItem, 'createdAt'>[] = [
  {
    id: 'rev-drip-101',
    userId: 'user-rizwan-edits',
    userName: 'Rizwan Siddique (Pro Cut Studio)',
    userEmail: 'rizwan@procutstudio.pk',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=140&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Striku just caught a hidden beat license issue in our client wedding recap video. The client channel has 600K subscribers and was at risk of a copyright strike. We swapped the audio stems within 5 minutes. True lifesaver!',
    likesCount: 14,
    dislikesCount: 0,
    likedBy: [],
    dislikedBy: [],
    replies: [],
  },
  {
    id: 'rev-drip-102',
    userId: 'user-maya-beats',
    userName: 'Maya Lin (ChillHop Sessions)',
    userEmail: 'maya@chillhopsessions.com',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=140&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'As a 24/7 stream and music curator channel, false copyright claims were eating up 30% of our ad revenue. Striku pre-scans guarantee zero surprises when going live.',
    likesCount: 22,
    dislikesCount: 0,
    likedBy: [],
    dislikedBy: [],
    replies: [],
  },
  {
    id: 'rev-drip-103',
    userId: 'user-adeel-automotive',
    userName: 'Adeel Khan (Turbo Gears PK)',
    userEmail: 'adeel@turbogears.pk',
    userAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=140&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'The frame-by-frame analysis pointed out our GoPro dashboard mount speed reflection before YouTube automated moderation could flag it as reckless driving. Keep up the brilliant innovation!',
    likesCount: 19,
    dislikesCount: 0,
    likedBy: [],
    dislikedBy: [],
    replies: [],
  },
  {
    id: 'rev-drip-104',
    userId: 'user-klaus-sound',
    userName: 'Klaus Webber (Soundscape Berlin)',
    userEmail: 'klaus@soundscapeberlin.de',
    userAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=140&auto=format&fit=crop&q=80',
    rating: 4,
    comment: 'Solid pre-upload audit engine. The timeline breakdown makes safe-cut trims effortless for our sound design team.',
    likesCount: 11,
    dislikesCount: 0,
    likedBy: [],
    dislikedBy: [],
    replies: [],
  },
  {
    id: 'rev-drip-105',
    userId: 'user-samina-educate',
    userName: 'Samina Qureshi (Science Simplified)',
    userEmail: 'samina@sciencesimplified.edu',
    userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=140&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Educational experiments with chemical reactions often trip automated safety filters. Striku verified our safety lab environment context and helped avoid restricted mode tags.',
    likesCount: 28,
    dislikesCount: 0,
    likedBy: [],
    dislikedBy: [],
    replies: [],
  },
  {
    id: 'rev-drip-106',
    userId: 'user-tyler-vfx',
    userName: 'Tyler Ross (VFX Breakdown Hub)',
    userEmail: 'tyler@vfxbreakdown.com',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=140&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Analyzing Hollywood movie clips under fair use commentary is tricky. Striku exact timecode guides ensure we stay firmly within fair-use legal safe harbors.',
    likesCount: 31,
    dislikesCount: 0,
    likedBy: [],
    dislikedBy: [],
    replies: [],
  },
  {
    id: 'rev-drip-107',
    userId: 'user-fatima-art',
    userName: 'Fatima Zahra (Calligraphy & Design)',
    userEmail: 'fatima@calligraphydesign.pk',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=140&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'I love how clean the UI is. Adding reviews and getting real feedback from creators has made this a true community.',
    likesCount: 16,
    dislikesCount: 0,
    likedBy: [],
    dislikedBy: [],
    replies: [],
  },
];

/**
 * Helper to get local stored reviews (starts clean at 0 reviews)
 */
function getLocalReviews(): ReviewItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_REVIEWS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse local reviews:', e);
  }
  return [];
}

/**
 * Helper to save local stored reviews
 */
function saveLocalReviews(reviews: ReviewItem[]): void {
  try {
    localStorage.setItem(LOCAL_REVIEWS_KEY, JSON.stringify(reviews));
  } catch (e) {
    console.warn('Failed to save local reviews:', e);
  }
}

/**
 * Automated review drip disabled. Only real creator submissions are stored.
 */
export async function checkAndRunScheduledReviewDrip(): Promise<boolean> {
  return false;
}

/**
 * Subscribes to reviews in real-time from Firestore.
 * Falls back gracefully to local storage / seed data if offline or permission issues.
 */
export function subscribeToReviews(
  onUpdate: (reviews: ReviewItem[]) => void
): () => void {
  // Check daily drip
  checkAndRunScheduledReviewDrip().catch(() => {});

  const path = REVIEWS_COLLECTION;
  try {
    const q = query(collection(db, REVIEWS_COLLECTION), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: ReviewItem[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              userId: data.userId || 'anonymous',
              userName: data.userName || 'Creator',
              userEmail: data.userEmail || '',
              userAvatar: data.userAvatar || '',
              rating: typeof data.rating === 'number' ? data.rating : 5,
              comment: data.comment || '',
              likesCount: data.likesCount || 0,
              dislikesCount: data.dislikesCount || 0,
              likedBy: Array.isArray(data.likedBy) ? data.likedBy : [],
              dislikedBy: Array.isArray(data.dislikedBy) ? data.dislikedBy : [],
              replies: Array.isArray(data.replies) ? data.replies : [],
              isEdited: Boolean(data.isEdited),
              createdAt: data.createdAt instanceof Timestamp
                ? data.createdAt.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                : typeof data.createdAt === 'string'
                ? data.createdAt
                : 'Just now',
              updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : undefined,
            };
          });

          // Pure real user reviews only
          saveLocalReviews(list);
          onUpdate(list);
        } else {
          // If Firestore collection has 0 reviews, display real local reviews or empty list
          const locals = getLocalReviews();
          onUpdate(locals);
        }
      },
      (error) => {
        console.warn('Firestore reviews snapshot error, falling back to local cached reviews:', error);
        onUpdate(getLocalReviews());
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Failed to attach reviews listener, using local reviews:', err);
    onUpdate(getLocalReviews());
    return () => {};
  }
}

/**
 * Creates a new review in Firestore and local cache
 */
export async function createReview(
  data: {
    userName: string;
    rating: number;
    comment: string;
    userEmail?: string;
    userAvatar?: string;
  },
  currentUser?: User | { uid: string; email?: string | null; displayName?: string | null; photoURL?: string | null } | null
): Promise<ReviewItem> {
  const reviewId = 'rev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const userId = currentUser?.uid || auth.currentUser?.uid || 'guest_' + Math.random().toString(36).substring(2, 9);
  const userName = (data.userName || currentUser?.displayName || 'YouTube Creator').slice(0, 100);
  const comment = data.comment.slice(0, 2000);
  const rating = Math.max(1, Math.min(5, Math.round(data.rating)));
  const userAvatar = data.userAvatar || currentUser?.photoURL || 'https://www.striku.cloud/logo.png';
  const userEmail = data.userEmail || currentUser?.email || auth.currentUser?.email || '';

  const newReview: ReviewItem = {
    id: reviewId,
    userId,
    userName,
    userEmail,
    userAvatar,
    rating,
    comment,
    likesCount: 0,
    dislikesCount: 0,
    likedBy: [],
    dislikedBy: [],
    replies: [],
    createdAt: 'Just now',
    updatedAt: new Date().toISOString(),
  };

  // 1. Save to local storage first for instant optimistic response
  const locals = getLocalReviews();
  const updatedLocals = [newReview, ...locals];
  saveLocalReviews(updatedLocals);

  // 2. Persist to Cloud Firestore if signed in
  if (auth.currentUser) {
    const path = `${REVIEWS_COLLECTION}/${reviewId}`;
    try {
      const docRef = doc(db, REVIEWS_COLLECTION, reviewId);
      await setDoc(docRef, {
        userId: auth.currentUser.uid,
        userName,
        userEmail,
        userAvatar,
        rating,
        comment,
        likesCount: 0,
        dislikesCount: 0,
        likedBy: [],
        dislikedBy: [],
        replies: [],
        isEdited: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.warn('Firestore create review write failed, cached locally:', error);
    }
  }

  return newReview;
}

/**
 * Edits an existing review (user can update star rating and comment)
 */
export async function updateReview(
  reviewId: string,
  updates: { rating?: number; comment?: string; userName?: string },
  currentUser?: { uid: string } | null
): Promise<void> {
  const locals = getLocalReviews();
  const updatedLocals = locals.map((rev) => {
    if (rev.id === reviewId) {
      return {
        ...rev,
        rating: updates.rating !== undefined ? Math.max(1, Math.min(5, updates.rating)) : rev.rating,
        comment: updates.comment !== undefined ? updates.comment.slice(0, 2000) : rev.comment,
        userName: updates.userName !== undefined ? updates.userName.slice(0, 100) : rev.userName,
        isEdited: true,
        updatedAt: new Date().toISOString(),
      };
    }
    return rev;
  });
  saveLocalReviews(updatedLocals);

  if (auth.currentUser) {
    const path = `${REVIEWS_COLLECTION}/${reviewId}`;
    try {
      const docRef = doc(db, REVIEWS_COLLECTION, reviewId);
      const payload: Record<string, any> = {
        updatedAt: serverTimestamp(),
        isEdited: true,
      };
      if (updates.rating !== undefined) payload.rating = Math.max(1, Math.min(5, updates.rating));
      if (updates.comment !== undefined) payload.comment = updates.comment.slice(0, 2000);
      if (updates.userName !== undefined) payload.userName = updates.userName.slice(0, 100);

      await updateDoc(docRef, payload);
    } catch (error) {
      console.warn('Firestore update review failed, updated locally:', error);
    }
  }
}

/**
 * Deletes a review from Firestore and local cache
 */
export async function deleteReview(reviewId: string): Promise<void> {
  const locals = getLocalReviews();
  const filtered = locals.filter((r) => r.id !== reviewId);
  saveLocalReviews(filtered);

  if (auth.currentUser) {
    const path = `${REVIEWS_COLLECTION}/${reviewId}`;
    try {
      const docRef = doc(db, REVIEWS_COLLECTION, reviewId);
      await deleteDoc(docRef);
    } catch (error) {
      console.warn('Firestore delete review failed, removed locally:', error);
    }
  }
}

/**
 * Likes or unlikes a review
 */
export async function toggleReviewLike(
  reviewId: string,
  userId: string
): Promise<{ likesCount: number; dislikesCount: number; isLiked: boolean }> {
  const locals = getLocalReviews();
  let updatedLikeCount = 0;
  let updatedDislikeCount = 0;
  let isLiked = false;

  const updatedLocals = locals.map((rev) => {
    if (rev.id === reviewId) {
      const liked = rev.likedBy || [];
      const disliked = rev.dislikedBy || [];
      let newLikedBy = [...liked];
      let newDislikedBy = disliked.filter((id) => id !== userId);

      if (newLikedBy.includes(userId)) {
        newLikedBy = newLikedBy.filter((id) => id !== userId);
        isLiked = false;
      } else {
        newLikedBy.push(userId);
        isLiked = true;
      }

      updatedLikeCount = Math.max(0, newLikedBy.length);
      updatedDislikeCount = Math.max(0, newDislikedBy.length);

      return {
        ...rev,
        likedBy: newLikedBy,
        dislikedBy: newDislikedBy,
        likesCount: updatedLikeCount,
        dislikesCount: updatedDislikeCount,
      };
    }
    return rev;
  });

  saveLocalReviews(updatedLocals);

  if (auth.currentUser) {
    const path = `${REVIEWS_COLLECTION}/${reviewId}`;
    try {
      const docRef = doc(db, REVIEWS_COLLECTION, reviewId);
      const targetRev = updatedLocals.find((r) => r.id === reviewId);
      if (targetRev) {
        await updateDoc(docRef, {
          likesCount: targetRev.likesCount,
          dislikesCount: targetRev.dislikesCount,
          likedBy: targetRev.likedBy,
          dislikedBy: targetRev.dislikedBy,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.warn('Firestore toggle like failed, updated locally:', error);
    }
  }

  return { likesCount: updatedLikeCount, dislikesCount: updatedDislikeCount, isLiked };
}

/**
 * Dislikes or undislikes a review
 */
export async function toggleReviewDislike(
  reviewId: string,
  userId: string
): Promise<{ likesCount: number; dislikesCount: number; isDisliked: boolean }> {
  const locals = getLocalReviews();
  let updatedLikeCount = 0;
  let updatedDislikeCount = 0;
  let isDisliked = false;

  const updatedLocals = locals.map((rev) => {
    if (rev.id === reviewId) {
      const liked = rev.likedBy || [];
      const disliked = rev.dislikedBy || [];
      let newDislikedBy = [...disliked];
      let newLikedBy = liked.filter((id) => id !== userId);

      if (newDislikedBy.includes(userId)) {
        newDislikedBy = newDislikedBy.filter((id) => id !== userId);
        isDisliked = false;
      } else {
        newDislikedBy.push(userId);
        isDisliked = true;
      }

      updatedLikeCount = Math.max(0, newLikedBy.length);
      updatedDislikeCount = Math.max(0, newDislikedBy.length);

      return {
        ...rev,
        likedBy: newLikedBy,
        dislikedBy: newDislikedBy,
        likesCount: updatedLikeCount,
        dislikesCount: updatedDislikeCount,
      };
    }
    return rev;
  });

  saveLocalReviews(updatedLocals);

  if (auth.currentUser) {
    const path = `${REVIEWS_COLLECTION}/${reviewId}`;
    try {
      const docRef = doc(db, REVIEWS_COLLECTION, reviewId);
      const targetRev = updatedLocals.find((r) => r.id === reviewId);
      if (targetRev) {
        await updateDoc(docRef, {
          likesCount: targetRev.likesCount,
          dislikesCount: targetRev.dislikesCount,
          likedBy: targetRev.likedBy,
          dislikedBy: targetRev.dislikedBy,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.warn('Firestore toggle dislike failed, updated locally:', error);
    }
  }

  return { likesCount: updatedLikeCount, dislikesCount: updatedDislikeCount, isDisliked };
}

/**
 * Adds a reply to a review. If the user is an admin, sets isOfficial: true and attaches official branding.
 */
export async function addReviewReply(
  reviewId: string,
  replyData: { userName: string; message: string; userEmail?: string },
  currentUser?: { uid: string; email?: string | null; displayName?: string | null; photoURL?: string | null } | null
): Promise<ReviewReply> {
  const replyId = 'rep_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const userId = currentUser?.uid || auth.currentUser?.uid || 'guest_' + Math.random().toString(36).substring(2, 7);
  const email = replyData.userEmail || currentUser?.email || auth.currentUser?.email || '';
  const isAdmin = isUserSuperAdmin(email);

  const newReply: ReviewReply = {
    id: replyId,
    userId: isAdmin ? 'admin-striku' : userId,
    userName: (replyData.userName || (isAdmin ? 'Striku Official Support' : currentUser?.displayName || 'Creator')).slice(0, 100),
    userEmail: email || undefined,
    userAvatar: isAdmin ? 'https://www.striku.cloud/logo.png' : currentUser?.photoURL || 'https://www.striku.cloud/logo.png',
    message: replyData.message.slice(0, 1000),
    isOfficial: isAdmin,
    createdAt: 'Just now',
  };

  const locals = getLocalReviews();
  let updatedReplies: ReviewReply[] = [];
  const updatedLocals = locals.map((rev) => {
    if (rev.id === reviewId) {
      const list = Array.isArray(rev.replies) ? [...rev.replies, newReply] : [newReply];
      updatedReplies = list;
      return { ...rev, replies: list };
    }
    return rev;
  });

  saveLocalReviews(updatedLocals);

  if (auth.currentUser) {
    const path = `${REVIEWS_COLLECTION}/${reviewId}`;
    try {
      const docRef = doc(db, REVIEWS_COLLECTION, reviewId);
      await updateDoc(docRef, {
        replies: updatedReplies,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.warn('Firestore add reply failed, updated locally:', error);
    }
  }

  return newReply;
}

/**
 * Deletes a reply from a review
 */
export async function deleteReviewReply(
  reviewId: string,
  replyId: string
): Promise<void> {
  const locals = getLocalReviews();
  let updatedReplies: ReviewReply[] = [];

  const updatedLocals = locals.map((rev) => {
    if (rev.id === reviewId) {
      const list = (rev.replies || []).filter((rep) => rep.id !== replyId);
      updatedReplies = list;
      return { ...rev, replies: list };
    }
    return rev;
  });

  saveLocalReviews(updatedLocals);

  if (auth.currentUser) {
    const path = `${REVIEWS_COLLECTION}/${reviewId}`;
    try {
      const docRef = doc(db, REVIEWS_COLLECTION, reviewId);
      await updateDoc(docRef, {
        replies: updatedReplies,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.warn('Firestore delete reply failed, updated locally:', error);
    }
  }
}
