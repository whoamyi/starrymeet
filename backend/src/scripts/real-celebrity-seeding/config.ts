/**
 * Configuration for Real Celebrity Seeding
 */

import { APIConfig, TierDistribution } from './types';
import dotenv from 'dotenv';

dotenv.config();

// ============================================
// TARGET DISTRIBUTION
// ============================================

export const TARGET_DISTRIBUTION: TierDistribution = {
  'Exclusive': 500,     // A+ tier
  'Elite': 2000,        // A tier
  'High': 3000,         // B tier
  'Mid': 4000,          // C tier
  'Emerging': 3000      // D tier
};

export const TOTAL_TARGET = Object.values(TARGET_DISTRIBUTION).reduce((sum, val) => sum + val, 0);

// Ensure ≥30% non-US profiles
export const MIN_NON_US_PERCENTAGE = 0.30;

// ============================================
// API CONFIGURATION
// ============================================

export const API_CONFIG: APIConfig = {
  wikidata: {
    endpoint: 'https://query.wikidata.org/sparql',
    rateLimit: 5  // 5 requests per second max
  },

  tmdb: {
    apiKey: process.env.TMDB_API_KEY || '',
    baseUrl: 'https://api.themoviedb.org/3',
    rateLimit: 40  // 40 requests per second (TMDB limit is 40/10s)
  },

  imdb: {
    apiKey: process.env.IMDB_API_KEY, // Optional - IMDB doesn't have official API
    rateLimit: 5
  },

  musicbrainz: {
    baseUrl: 'https://musicbrainz.org/ws/2',
    rateLimit: 1  // MusicBrainz requires 1 req/sec max
  },

  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID || '',
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
    rateLimit: 10
  },

  youtube: {
    apiKey: process.env.YOUTUBE_API_KEY || '',
    rateLimit: 100  // YouTube API quota is generous
  },

  cloudinary: {
    cloudName: 'dd0ou581d',
    apiKey: '331969854289545',
    apiSecret: 'irAFHME5wEYftKj0aN849RaL3Hk',
    uploadPreset: 'starrymeet_celebrities'
  }
};

// ============================================
// CLOUDINARY CONFIGURATION
// ============================================

export const CLOUDINARY_CONFIG = {
  cloud_name: API_CONFIG.cloudinary.cloudName,
  api_key: API_CONFIG.cloudinary.apiKey,
  api_secret: API_CONFIG.cloudinary.apiSecret,
  secure: true
};

export const IMAGE_CONFIG = {
  hero: {
    maxWidth: 1600,
    format: 'webp',
    quality: 75
  },
  thumbnail: {
    maxWidth: 400,
    format: 'webp',
    quality: 80
  },
  pathTemplate: 'starrymeet/{region}/{slug}/'
};

// ============================================
// CATEGORY TAXONOMY
// ============================================

export const UNIVERSAL_CATEGORIES = [
  'Entertainer',
  'Athlete',
  'Creator',
  'Business',
  'PublicFigure',
  'Professional',
  'Artist',
  'Spiritual',
  'Other'
] as const;

export const PROFESSIONAL_CLASSES = {
  Entertainer: ['Actor', 'Musician', 'Singer', 'Comedian', 'TV Host', 'Radio Host', 'Voice Actor', 'Dancer'],
  Athlete: ['Soccer Player', 'Basketball Player', 'Tennis Player', 'Swimmer', 'Track Athlete', 'Fighter', 'Golfer', 'Cyclist'],
  Creator: ['YouTuber', 'TikToker', 'Instagram Influencer', 'Podcaster', 'Blogger', 'Streamer', 'Content Creator'],
  Business: ['Entrepreneur', 'CEO', 'Investor', 'Tech Founder', 'Author', 'Speaker'],
  PublicFigure: ['Politician', 'Activist', 'Philanthropist', 'Public Speaker'],
  Professional: ['Scientist', 'Engineer', 'Doctor', 'Lawyer', 'Educator', 'Journalist'],
  Artist: ['Painter', 'Sculptor', 'Photographer', 'Fashion Designer', 'Architect'],
  Spiritual: ['Religious Leader', 'Spiritual Teacher', 'Motivational Speaker'],
  Other: ['Other']
};

// ============================================
// WIKIDATA OCCUPATION MAPPING
// ============================================

export const WIKIDATA_OCCUPATIONS = {
  // Entertainers
  'Q33999': 'Actor',                    // actor
  'Q2526255': 'Film Director',          // film director
  'Q177220': 'Singer',                  // singer
  'Q639669': 'Musician',                // musician
  'Q488205': 'Singer-Songwriter',       // singer-songwriter
  'Q245068': 'Comedian',                // comedian
  'Q947873': 'TV Host',                 // television presenter

  // Athletes
  'Q937857': 'Soccer Player',           // association football player
  'Q3665646': 'Basketball Player',      // basketball player
  'Q10833314': 'Tennis Player',         // tennis player
  'Q13382576': 'Swimmer',               // swimmer
  'Q11513337': 'Boxer',                 // boxer
  'Q11338576': 'Golfer',                // golfer

  // Creators & Business
  'Q36180': 'Author',                   // writer
  'Q1930187': 'Journalist',             // journalist
  'Q43845': 'Entrepreneur',             // businessperson
  'Q189290': 'YouTuber',                // YouTuber

  // Public Figures
  'Q82955': 'Politician',               // politician
  'Q1281618': 'Activist',               // activist

  // Professionals
  'Q901': 'Scientist',                  // scientist
  'Q39631': 'Physician',                // physician
  'Q66763': 'Engineer',                 // engineer

  // Artists
  'Q1028181': 'Painter',                // painter
  'Q33231': 'Photographer',             // photographer
  'Q5482740': 'Fashion Designer'        // fashion designer
};

// ============================================
// PRICING ALGORITHM WEIGHTS
// ============================================

export const PRICING_WEIGHTS = {
  socialFollowers: 0.25,
  monthlyListeners: 0.20,
  monthlyViews: 0.15,
  boxOffice: 0.15,
  streamingViews: 0.10,
  awards: 0.05,
  googleTrends: 0.05,
  mediaMentions: 0.05
};

export const PRICE_TIERS_MAPPING = [
  { minScore: 95, tier: 'Exclusive', basePrice: 100000_00 },      // $100k
  { minScore: 90, tier: 'Ultra-Elite', basePrice: 50000_00 },     // $50k
  { minScore: 80, tier: 'Elite', basePrice: 25000_00 },           // $25k
  { minScore: 70, tier: 'A-Lister', basePrice: 10000_00 },        // $10k
  { minScore: 55, tier: 'B-Lister', basePrice: 4000_00 },         // $4k
  { minScore: 40, tier: 'C-Lister', basePrice: 1000_00 },         // $1k
  { minScore: 25, tier: 'Rising', basePrice: 400_00 },            // $400
  { minScore: 0, tier: 'Emerging', basePrice: 100_00 }            // $100
] as const;

// ============================================
// PROCESSING CONFIGURATION
// ============================================

export const PROCESSING_CONFIG = {
  batchSize: 250,           // Database insert batch size
  maxRetries: 3,            // Max retries for failed API calls
  retryDelay: 1000,         // Initial retry delay (ms)
  backoffMultiplier: 2,     // Exponential backoff multiplier
  parallelWorkers: 5,       // Number of parallel enrichment workers
  cacheDuration: 24 * 60 * 60 * 1000,  // 24 hours
  requestTimeout: 30000     // 30 seconds
};

// ============================================
// SAFETY FILTERS
// ============================================

export const EXCLUDED_OCCUPATIONS = [
  'Q2304859',  // head of state
  'Q48352',    // head of government
  'Q42530',    // religious leader
  'Q82821',    // clergy
];

export const MIN_AGE = 18;  // Exclude minors

export const CONTROVERSIAL_KEYWORDS = [
  'terrorist',
  'convicted',
  'war criminal',
  'dictator',
  'sanctioned',
  'banned'
];

// ============================================
// OUTPUT PATHS
// ============================================

export const OUTPUT_PATHS = {
  baseDir: '/tmp/starrymeet_seeding',
  successCSV: '/tmp/starrymeet_seeding/imports_success.csv',
  failedCSV: '/tmp/starrymeet_seeding/imports_failed.csv',
  mergeCandidatesCSV: '/tmp/starrymeet_seeding/merge_candidates.csv',
  top500ReviewCSV: '/tmp/starrymeet_seeding/top_500_pending_price_review.csv',
  summaryReport: '/tmp/starrymeet_seeding/summary_report.json',
  sampleProfiles: '/tmp/starrymeet_seeding/sample_profiles.jsonl',
  logsDir: '/tmp/starrymeet_seeding/logs'
};

// ============================================
// BOOKING DEFAULTS
// ============================================

export const DEFAULT_BOOKING_CONFIG = {
  meetDuration: 60,  // minutes
  meetingOptions: ['in-person', 'virtual'],
  travelPolicy: 'buyer-pays',
  cancellationPolicy: 'refundable >72h, else no refund',
  ndaRequired: false,
  securityRequirements: []
};

// ============================================
// REGIONS & COUNTRIES
// ============================================

export const REGIONS = {
  'North America': ['USA', 'Canada', 'Mexico'],
  'Latin America': ['Brazil', 'Argentina', 'Colombia', 'Chile', 'Peru'],
  'Europe': ['UK', 'France', 'Germany', 'Spain', 'Italy', 'Netherlands', 'Sweden', 'Switzerland'],
  'Asia': ['Japan', 'South Korea', 'China', 'India', 'Singapore', 'Thailand', 'Philippines'],
  'Middle East': ['UAE', 'Saudi Arabia', 'Israel', 'Turkey'],
  'Africa': ['South Africa', 'Nigeria', 'Kenya', 'Ghana'],
  'Oceania': ['Australia', 'New Zealand']
};

export default API_CONFIG;
