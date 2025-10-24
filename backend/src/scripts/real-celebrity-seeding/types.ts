/**
 * Type Definitions for Real Celebrity Seeding
 */

// ============================================
// TIER DEFINITIONS
// ============================================

export type PriceTier = 'Exclusive' | 'Ultra-Elite' | 'Elite' | 'A-Lister' | 'B-Lister' | 'C-Lister' | 'Rising' | 'Emerging';

export interface TierDistribution {
  'Exclusive': number;      // A+ tier
  'Elite': number;           // A tier
  'High': number;            // B tier
  'Mid': number;             // C tier
  'Emerging': number;        // D tier
}

// ============================================
// EXTERNAL API TYPES
// ============================================

export interface WikidataEntity {
  qid: string;
  name: string;
  birthDate?: string;
  deathDate?: string;
  occupation: string[];
  country?: string;
  imdbId?: string;
  tmdbId?: number;
  musicbrainzId?: string;
  spotifyId?: string;
  youtubeChannelId?: string;
  transfermarktId?: string;
  awards?: string[];
  notableWorks?: string[];
}

export interface TMDBPerson {
  id: number;
  name: string;
  biography: string;
  birthday: string;
  place_of_birth: string;
  profile_path: string;
  popularity: number;
  known_for_department: string;
  credits?: {
    cast?: Array<{ title: string; vote_average: number; vote_count: number }>;
  };
}

export interface IMDBPerson {
  id: string;
  name: string;
  bio: string;
  image: string;
  birthDate: string;
  awards?: string[];
  knownFor?: Array<{ title: string; year: number }>;
}

export interface MusicBrainzArtist {
  id: string;
  name: string;
  country?: string;
  type?: string;
  genres?: string[];
  releaseGroups?: Array<{ title: string; primaryType: string }>;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  followers: { total: number };
  popularity: number;
  genres: string[];
  images: Array<{ url: string; height: number; width: number }>;
}

export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  thumbnails: { high: { url: string } };
}

// ============================================
// CELEBRITY CANDIDATE
// ============================================

export interface CelebrityCandidate {
  // Identity
  wikidata_qid?: string;
  imdb_id?: string;
  tmdb_id?: number;
  musicbrainz_id?: string;
  spotify_id?: string;
  youtube_channel_id?: string;
  transfermarkt_id?: string;

  // Basic Info
  name: string;
  slug: string;
  birth_date?: string;
  country?: string;
  city?: string;
  location?: string;

  // Taxonomy
  universal_category: UniversalCategory;
  professional_class: string;
  primary_industry?: string;
  industries?: string[];
  primary_medium?: string;
  mediums?: string[];
  genres?: string[];
  fame_context?: string;
  region?: string;
  subregion?: string;
  languages?: string[];
  active_status?: ActiveStatus;

  // Content
  short_bio?: string;
  known_for?: string[];
  tags?: string[];
  affiliations?: string[];

  // Metrics
  popularity_score: number;
  social_followers?: number;
  monthly_listeners?: number;
  monthly_views?: number;
  box_office_total?: number;
  streaming_views?: number;
  awards_count?: number;
  google_trends_score?: number;
  media_mentions?: number;

  // Pricing
  base_price_cents: number;
  price_tier: PriceTier;
  rarity_factor: number;
  demand_factor: number;
  market_multiplier: number;
  meeting_complexity: number;

  // Booking Info
  meet_duration?: number;
  meeting_options?: string[];
  travel_policy?: string;
  nda_required: boolean;
  security_requirements?: string[];
  cancellation_policy?: string;
  bookable: boolean;

  // Images
  hero_image_url?: string;
  thumbnail_url?: string;
  image_sources?: Array<{ url: string; license?: string }>;

  // SEO
  seo_title?: string;
  seo_description?: string;
  canonical_url?: string;

  // Flags
  pending_review_for_price: boolean;
  is_verified: boolean;
  is_featured: boolean;
  is_active: boolean;

  // Audit
  enriched_at?: Date;
  source_apis?: string[];
}

// ============================================
// TAXONOMY TYPES
// ============================================

export type UniversalCategory =
  | 'Entertainer'
  | 'Athlete'
  | 'Creator'
  | 'Business'
  | 'PublicFigure'
  | 'Professional'
  | 'Artist'
  | 'Spiritual'
  | 'Other';

export type ActiveStatus =
  | 'Active'
  | 'Retired'
  | 'Legend'
  | 'Upcoming'
  | 'Posthumous';

// ============================================
// API CONFIGURATION
// ============================================

export interface APIConfig {
  wikidata: {
    endpoint: string;
    rateLimit: number; // requests per second
  };
  tmdb: {
    apiKey: string;
    baseUrl: string;
    rateLimit: number;
  };
  imdb: {
    apiKey?: string;
    rateLimit: number;
  };
  musicbrainz: {
    baseUrl: string;
    rateLimit: number;
  };
  spotify: {
    clientId: string;
    clientSecret: string;
    rateLimit: number;
  };
  youtube: {
    apiKey: string;
    rateLimit: number;
  };
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
    uploadPreset?: string;
  };
}

// ============================================
// PROCESSING TYPES
// ============================================

export interface EnrichmentResult {
  success: boolean;
  candidate?: CelebrityCandidate;
  errors?: string[];
  apiCalls: {
    wikidata?: boolean;
    tmdb?: boolean;
    imdb?: boolean;
    musicbrainz?: boolean;
    spotify?: boolean;
    youtube?: boolean;
  };
}

export interface ImportResult {
  total: number;
  successful: number;
  failed: number;
  skipped: number;
  failedRecords: Array<{
    candidate: Partial<CelebrityCandidate>;
    error: string;
  }>;
}

export interface SummaryReport {
  timestamp: string;
  totalProcessed: number;
  totalImported: number;
  totalFailed: number;

  // Distribution by tier
  tierDistribution: Record<PriceTier, number>;

  // Distribution by region
  regionDistribution: Record<string, number>;

  // Price statistics
  priceStats: {
    average: number;
    median: number;
    min: number;
    max: number;
    top100Expensive: Array<{
      name: string;
      price: number;
      tier: string;
    }>;
  };

  // API statistics
  apiStats: {
    wikidataCalls: number;
    tmdbCalls: number;
    imdbCalls: number;
    musicbrainzCalls: number;
    spotifyCalls: number;
    youtubeCalls: number;
    cloudinaryCalls: number;
    totalErrors: number;
    totalRetries: number;
  };

  // Processing time
  processingTime: {
    startTime: string;
    endTime: string;
    durationMinutes: number;
  };
}

// ============================================
// SAFETY FILTER TYPES
// ============================================

export interface SafetyCheckResult {
  allowed: boolean;
  reason?: string;
  flagForReview?: boolean;
  riskLevel?: 'low' | 'medium' | 'high';
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  existingId?: string;
  matchReason?: string;
  similarityScore?: number;
}
