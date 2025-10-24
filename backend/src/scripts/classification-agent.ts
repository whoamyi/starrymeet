/**
 * Celebrity Classification Agent
 *
 * Uses fame comparison logic (NOT follower counts) to classify celebrities
 * based on global recognition, career legacy, relevance, demand, and affluence.
 */

import sequelize from '../config/database';
import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';
import { QueryTypes } from 'sequelize';
import * as fs from 'fs';
import * as path from 'path';

// API Configuration
const TMDB_API_KEY = process.env.TMDB_API_KEY || '';
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '';
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || '';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || ''
});

// ============================================
// TIER REFERENCE DATABASE (Comparison-Based)
// ============================================

const TIER_REFERENCES = {
  S: [
    'Cristiano Ronaldo', 'Lionel Messi', 'Beyoncé', 'Taylor Swift', 'Elon Musk',
    'LeBron James', 'Tom Cruise', 'Dwayne Johnson', 'Rihanna', 'Kim Kardashian',
    'Ariana Grande', 'Justin Bieber', 'Drake', 'Adele', 'Ed Sheeran'
  ],
  A: [
    '50 Cent', 'Jason Statham', 'Tyga', 'Jennifer Lopez', 'Will Smith',
    'Scarlett Johansson', 'Chris Hemsworth', 'Robert Downey Jr', 'Angelina Jolie',
    'Brad Pitt', 'Leonardo DiCaprio', 'Zendaya', 'Billie Eilish'
  ],
  B: [
    'Wiz Khalifa', 'Idris Elba', 'John Boyega', 'Michael B. Jordan',
    'Margot Robbie', 'Timothée Chalamet', 'Zac Efron', 'Ryan Reynolds',
    'Gal Gadot', 'Post Malone', 'Travis Scott', 'Lil Wayne'
  ],
  C: [],  // National TV stars, regional singers
  D: []   // Local/niche figures
};

// Known mega-celebrities for S-tier (must match exactly)
const MEGA_CELEBRITIES = new Set([
  'cristiano ronaldo', 'lionel messi', 'beyoncé', 'beyonce', 'taylor swift',
  'lebron james', 'tom cruise', 'dwayne johnson', 'the rock', 'rihanna',
  'kim kardashian', 'ariana grande', 'justin bieber', 'drake', 'adele',
  'ed sheeran', 'lady gaga', 'kanye west', 'jay-z', 'oprah winfrey'
]);

// A-tier recognition
const A_TIER_CELEBRITIES = new Set([
  '50 cent', 'jason statham', 'tyga', 'jennifer lopez', 'j lo', 'will smith',
  'scarlett johansson', 'chris hemsworth', 'robert downey jr', 'angelina jolie',
  'brad pitt', 'leonardo dicaprio', 'leo dicaprio', 'zendaya', 'billie eilish',
  'eminem', 'snoop dogg', 'kevin hart', 'chris rock', 'samuel l jackson',
  'aamir khan', 'shah rukh khan', 'salman khan', 'priyanka chopra'
]);

// B-tier recognition
const B_TIER_CELEBRITIES = new Set([
  'wiz khalifa', 'idris elba', 'john boyega', 'michael b jordan', 'margot robbie',
  'timothee chalamet', 'zac efron', 'ryan reynolds', 'gal gadot', 'post malone',
  'travis scott', 'lil wayne', 'adam sandler', 'ben affleck', 'matt damon'
]);

// ============================================
// PRICING CONFIGURATION (from docs/class_agent.txt)
// ============================================

/**
 * Tier-based price ranges (in cents)
 *
 * These ranges represent the TOTAL price window for BOTH physical and virtual meetings.
 * Physical meetings are MORE expensive (base price).
 * Virtual meetings are 20-40% LESS than physical.
 *
 * Example: S-tier, 60min physical = $1M → virtual = $600K-$800K (20-40% discount)
 */
const TIER_PRICE_RANGES = {
  S: { min: 10000000,  max: 200000000 },  // $100K - $2M (updated from $500K-$5M)
  A: { min: 2000000,   max: 50000000 },   // $20K - $500K
  B: { min: 500000,    max: 5000000 },    // $5K - $50K
  C: { min: 100000,    max: 1000000 },    // $1K - $10K
  D: { min: 10000,     max: 200000 }      // $100 - $2K
};

/**
 * Duration multipliers (apply to base 15min price)
 */
const DURATION_MULTIPLIERS = {
  15: 1.0,   // Base price
  30: 1.8,   // 80% more
  60: 3.0    // 3x base price
};

/**
 * Max monthly slots per tier (for celebrity_settings)
 */
const TIER_MAX_SLOTS = {
  S: { min: 2, max: 4 },
  A: { min: 4, max: 8 },
  B: { min: 8, max: 15 },
  C: { min: 15, max: 25 },
  D: { min: 20, max: 40 }
};

/**
 * Random number in range (inclusive)
 */
function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Random float in range
 */
function randomFloatInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generate 6-package tier-based pricing
 *
 * Algorithm:
 * 1. Pick base physical price for 15min within tier range
 * 2. Calculate physical prices for all durations (15/30/60min)
 * 3. Calculate virtual prices (20-40% discount from physical)
 * 4. Validate all 6 prices stay within tier range
 * 5. Scale down if needed to fit within range
 */
function generateTierPricing(tier: 'S' | 'A' | 'B' | 'C' | 'D'): Array<{
  meeting_type: 'virtual' | 'physical';
  duration: number;
  price_cents: number;
}> {
  const range = TIER_PRICE_RANGES[tier];

  // Pick base physical price for 15min (start lower in range to allow room for 60min)
  // Use 30-60% of range for base to ensure 60min doesn't exceed max
  const rangeSize = range.max - range.min;
  const base15Physical = range.min + Math.floor(rangeSize * randomFloatInRange(0.3, 0.6));

  // Calculate physical prices for all durations
  const physical15 = base15Physical;
  const physical30 = Math.floor(base15Physical * DURATION_MULTIPLIERS[30]);
  const physical60 = Math.floor(base15Physical * DURATION_MULTIPLIERS[60]);

  // Calculate virtual prices (20-40% discount = multiply by 0.6-0.8)
  const virtualDiscount = randomFloatInRange(0.6, 0.8);
  const virtual15 = Math.floor(physical15 * virtualDiscount);
  const virtual30 = Math.floor(physical30 * virtualDiscount);
  const virtual60 = Math.floor(physical60 * virtualDiscount);

  // Check if physical60 exceeds max (highest price)
  let scaleFactor = 1.0;
  if (physical60 > range.max) {
    scaleFactor = range.max / physical60;
  }

  // Apply scale factor if needed
  const pricing = [
    { meeting_type: 'virtual' as const, duration: 15, price_cents: Math.floor(virtual15 * scaleFactor) },
    { meeting_type: 'virtual' as const, duration: 30, price_cents: Math.floor(virtual30 * scaleFactor) },
    { meeting_type: 'virtual' as const, duration: 60, price_cents: Math.floor(virtual60 * scaleFactor) },
    { meeting_type: 'physical' as const, duration: 15, price_cents: Math.floor(physical15 * scaleFactor) },
    { meeting_type: 'physical' as const, duration: 30, price_cents: Math.floor(physical30 * scaleFactor) },
    { meeting_type: 'physical' as const, duration: 60, price_cents: Math.floor(physical60 * scaleFactor) }
  ];

  return pricing;
}

// ============================================
// PROFESSION MAPPING FOR KNOWN CELEBRITIES
// ============================================

const KNOWN_PROFESSIONS: { [key: string]: string } = {
  // Musicians/Singers
  'adele': 'Singer',
  'taylor swift': 'Singer',
  'ariana grande': 'Singer',
  'justin bieber': 'Singer',
  'ed sheeran': 'Singer',
  'lady gaga': 'Singer',
  'rihanna': 'Singer',
  'beyoncé': 'Singer',
  'beyonce': 'Singer',
  'billie eilish': 'Singer',
  'post malone': 'Singer',

  // Rappers
  '50 cent': 'Rapper',
  'drake': 'Rapper',
  'kanye west': 'Rapper',
  'jay-z': 'Rapper',
  'eminem': 'Rapper',
  'snoop dogg': 'Rapper',
  'wiz khalifa': 'Rapper',
  '2 chainz': 'Rapper',
  'travis scott': 'Rapper',
  'lil wayne': 'Rapper',
  'tyga': 'Rapper',

  // Comedians/Parody
  'weird al yankovic': 'Singer',
  '"weird al" yankovic': 'Singer',

  // Actors
  'tom cruise': 'Actor',
  'dwayne johnson': 'Actor',
  'the rock': 'Actor',
  'leonardo dicaprio': 'Actor',
  'leo dicaprio': 'Actor',
  'brad pitt': 'Actor',
  'angelina jolie': 'Actor',
  'scarlett johansson': 'Actor',
  'chris hemsworth': 'Actor',
  'robert downey jr': 'Actor',
  'jason statham': 'Actor',
  'zendaya': 'Actor',
  'margot robbie': 'Actor',
  'idris elba': 'Actor',
  'john boyega': 'Actor',
  'michael b jordan': 'Actor',
  'timothee chalamet': 'Actor',
  'zac efron': 'Actor',
  'ryan reynolds': 'Actor',
  'gal gadot': 'Actor',
  'adam sandler': 'Actor',
  'ben affleck': 'Actor',
  'matt damon': 'Actor',
  'kevin hart': 'Comedian',
  'chris rock': 'Comedian',
  'samuel l jackson': 'Actor',
  'aamir khan': 'Actor',
  'shah rukh khan': 'Actor',
  'salman khan': 'Actor',
  'priyanka chopra': 'Actor',
  'will smith': 'Rapper',  // Started as rapper, now actor - but known primarily for music
  'jennifer lopez': 'Singer',  // J.Lo - singer/actress but known for music

  // Athletes
  'cristiano ronaldo': 'Soccer Player',
  'lionel messi': 'Soccer Player',
  'lebron james': 'Basketball Player',

  // TV/Media
  'oprah winfrey': 'TV Host',
  'kim kardashian': 'Social Media Influencer'
};

// ============================================
// COUNTRY NORMALIZATION
// ============================================

const COUNTRY_MAPPING: { [key: string]: string } = {
  'Kingdom of the Netherlands': 'Netherlands',
  'People\'s Republic of China': 'China',
  'German Democratic Republic': 'Germany',
  'Socialist Federal Republic of Yugoslavia': 'Serbia',
  'Kingdom of Yugoslavia': 'Serbia',
  'Federal People\'s Republic of Yugoslavia': 'Serbia',
  'Polish People\'s Republic': 'Poland',
  'Byelorussian Soviet Socialist Republic': 'Belarus',
  'United Arab Republic': 'Egypt',
  'Komi Republic': 'Russia',
  'Kingdom of Denmark': 'Denmark',
  'Democratic Republic of the Congo': 'Congo',
  'Republic of the Congo': 'Congo',
  'Dominican Republic': 'Dominican Republic',
  'Czech Republic': 'Czech Republic'
};

// ============================================
// RATE LIMITERS
// ============================================

class RateLimiter {
  private lastCall = 0;
  private minInterval: number;

  constructor(requestsPerSecond: number) {
    this.minInterval = 1000 / requestsPerSecond;
  }

  async throttle(): Promise<void> {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCall;
    if (timeSinceLastCall < this.minInterval) {
      await new Promise(resolve => setTimeout(resolve, this.minInterval - timeSinceLastCall));
    }
    this.lastCall = Date.now();
  }
}

const tmdbLimiter = new RateLimiter(4);
const spotifyLimiter = new RateLimiter(2);
const wikipediaLimiter = new RateLimiter(1);

// ============================================
// DATA GATHERING FUNCTIONS
// ============================================

interface CelebrityData {
  name: string;
  category: string;
  bio: string;
  imageUrl: string | null;
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
  justification: string;
  tmdbPopularity?: number;
  spotifyFollowers?: number;
  knownFor?: string[];
}

/**
 * Search TMDB for person
 */
async function searchTMDB(name: string): Promise<any> {
  if (!TMDB_API_KEY) return null;

  await tmdbLimiter.throttle();
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/search/person`, {
      params: { api_key: TMDB_API_KEY, query: name },
      timeout: 10000
    });
    return response.data.results?.[0] || null;
  } catch (error) {
    return null;
  }
}

/**
 * Get TMDB person details
 */
async function getTMDBDetails(tmdbId: number): Promise<any> {
  if (!TMDB_API_KEY) return null;

  await tmdbLimiter.throttle();
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/person/${tmdbId}`, {
      params: {
        api_key: TMDB_API_KEY,
        append_to_response: 'combined_credits,external_ids'
      },
      timeout: 10000
    });
    return response.data;
  } catch (error) {
    return null;
  }
}

/**
 * Get Spotify access token
 */
async function getSpotifyToken(): Promise<string | null> {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) return null;

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
        }
      }
    );
    return response.data.access_token;
  } catch (error) {
    return null;
  }
}

/**
 * Search Spotify for artist
 */
async function searchSpotify(name: string, token: string): Promise<any> {
  if (!token) return null;

  await spotifyLimiter.throttle();
  try {
    const response = await axios.get(`https://api.spotify.com/v1/search`, {
      params: { q: name, type: 'artist', limit: 1 },
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000
    });
    return response.data.artists?.items?.[0] || null;
  } catch (error) {
    return null;
  }
}

/**
 * Get comprehensive Wikipedia data (biography, categories, image)
 */
async function getWikipediaData(name: string): Promise<any> {
  await wikipediaLimiter.throttle();

  try {
    // First, search for the page
    const searchResponse = await axios.get(`https://en.wikipedia.org/w/api.php`, {
      params: {
        action: 'query',
        list: 'search',
        srsearch: name,
        format: 'json',
        srlimit: 1
      },
      timeout: 10000
    });

    const pageTitle = searchResponse.data.query?.search?.[0]?.title;
    if (!pageTitle) return null;

    // Get comprehensive page data: extract (bio), categories, image, pageprops (for death info)
    const pageResponse = await axios.get(`https://en.wikipedia.org/w/api.php`, {
      params: {
        action: 'query',
        titles: pageTitle,
        prop: 'extracts|categories|pageimages|pageprops',
        exintro: true,  // Get intro/summary only
        explaintext: true,  // Plain text (no HTML)
        pithumbsize: 500,
        cllimit: 50,  // Get up to 50 categories
        format: 'json'
      },
      timeout: 10000
    });

    const pages = pageResponse.data.query?.pages;
    const page = pages?.[Object.keys(pages)[0]];

    if (!page || page.missing) return null;

    // Check if person is deceased
    const extract = page.extract || '';
    const categories = (page.categories || []).map((c: any) => c.title.replace('Category:', ''));

    // Look for death indicators - be very strict to avoid false positives
    const categoryText = categories.join(' ').toLowerCase();
    const isDeceased =
      // Check for death year categories (most reliable indicator)
      categoryText.match(/\d{4}\s+deaths/) ||  // "2020 deaths"
      categoryText.match(/deaths\s+in\s+\d{4}/) ||  // "Deaths in 2020"
      // Check for birth-death pattern at START of extract (first sentence)
      extract.match(/^[^.]{0,100}\(\d{4}\s*[-–]\s*\d{4}\)/) ||  // (1980-2020) in first sentence
      // Check for explicit death statement in first 200 chars
      extract.substring(0, 200).match(/\s+died\s+(?:on\s+)?\d{1,2}\s+\w+\s+\d{4}/i);

    return {
      title: page.title,
      extract: extract,
      categories: categories,
      imageUrl: page.thumbnail?.source || null,
      isDeceased: !!isDeceased
    };
  } catch (error) {
    return null;
  }
}

/**
 * Search Wikipedia for image only (fallback)
 */
async function searchWikipediaImage(name: string): Promise<string | null> {
  await wikipediaLimiter.throttle();

  try {
    const searchResponse = await axios.get(`https://en.wikipedia.org/w/api.php`, {
      params: {
        action: 'query',
        list: 'search',
        srsearch: name,
        format: 'json',
        srlimit: 1
      },
      timeout: 10000
    });

    const pageTitle = searchResponse.data.query?.search?.[0]?.title;
    if (!pageTitle) return null;

    const imageResponse = await axios.get(`https://en.wikipedia.org/w/api.php`, {
      params: {
        action: 'query',
        titles: pageTitle,
        prop: 'pageimages',
        pithumbsize: 500,
        format: 'json'
      },
      timeout: 10000
    });

    const pages = imageResponse.data.query?.pages;
    const page = pages?.[Object.keys(pages)[0]];
    return page?.thumbnail?.source || null;
  } catch (error) {
    return null;
  }
}

/**
 * Upload image to Cloudinary
 */
async function uploadToCloudinary(imageUrl: string, publicId: string): Promise<string | null> {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      public_id: publicId,
      folder: 'starrymeet/celebrities',
      overwrite: true,
      transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }]
    });
    return result.secure_url;
  } catch (error) {
    return null;
  }
}

// ============================================
// CLASSIFICATION LOGIC (Comparison-Based)
// ============================================

/**
 * Determine tier using fame comparison logic
 */
function determineTier(name: string, tmdbData: any, spotifyData: any): {
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
  justification: string;
} {
  const nameLower = name.toLowerCase();

  // 1. Check known S-tier celebrities
  if (MEGA_CELEBRITIES.has(nameLower)) {
    return {
      tier: 'S',
      justification: 'Era-defining global icon with universal recognition'
    };
  }

  // 2. Check known A-tier celebrities
  if (A_TIER_CELEBRITIES.has(nameLower)) {
    return {
      tier: 'A',
      justification: 'International superstar with massive recognition and influence'
    };
  }

  // 3. Check known B-tier celebrities
  if (B_TIER_CELEBRITIES.has(nameLower)) {
    return {
      tier: 'B',
      justification: 'Strong international fame with consistent visibility'
    };
  }

  // 4. Use TMDB data for context (not formula)
  if (tmdbData) {
    const popularity = tmdbData.popularity || 0;
    const hasAwards = tmdbData.known_for_department === 'Acting' && popularity > 10;
    const hasLegacy = tmdbData.combined_credits?.cast?.length > 20;

    // High TMDB popularity suggests A/B tier
    if (popularity >= 50 || hasLegacy) {
      return {
        tier: 'A',
        justification: 'Established film career with significant body of work and recognition'
      };
    }

    if (popularity >= 20 || hasAwards) {
      return {
        tier: 'B',
        justification: 'Notable acting career with consistent film/TV presence'
      };
    }

    if (popularity >= 5) {
      return {
        tier: 'C',
        justification: 'Recognized actor with national or regional fame'
      };
    }
  }

  // 5. Use Spotify data for context (not formula)
  if (spotifyData) {
    const followers = spotifyData.followers?.total || 0;
    const isMainstream = spotifyData.popularity >= 70;

    // High Spotify presence suggests B/C tier
    if (followers >= 1000000 || isMainstream) {
      return {
        tier: 'B',
        justification: 'Successful music career with strong fan base and recognition'
      };
    }

    if (followers >= 100000) {
      return {
        tier: 'C',
        justification: 'Established musician with solid regional or genre recognition'
      };
    }
  }

  // 6. Default tier (if unsure, assign higher tier as per rules)
  return {
    tier: 'D',
    justification: 'Public figure with niche or regional influence'
  };
}

/**
 * Determine category with proper prioritization
 */
/**
 * Determine profession from Wikipedia categories and biography
 */
function determineCategoryFromWikipedia(wikipediaData: any): string | null {
  if (!wikipediaData || !wikipediaData.categories) return null;

  const categories = wikipediaData.categories.map((c: string) => c.toLowerCase());
  const bio = (wikipediaData.extract || '').toLowerCase();

  // Check categories for profession keywords
  const categoryText = categories.join(' ');

  // Athletes
  if (categoryText.includes('basketball players') || categoryText.includes('basketball player')) return 'Basketball Player';
  if (categoryText.includes('footballers') || categoryText.includes('association football') || categoryText.includes('soccer players')) return 'Soccer Player';
  if (categoryText.includes('american football') || categoryText.includes('nfl players')) return 'American Football Player';
  if (categoryText.includes('tennis players') || categoryText.includes('tennis player')) return 'Tennis Player';
  if (categoryText.includes('boxers') || categoryText.includes('boxer')) return 'Boxer';
  if (categoryText.includes('baseball players') || categoryText.includes('baseball player')) return 'Baseball Player';
  if (categoryText.includes('golfers') || categoryText.includes('golfer')) return 'Golfer';
  if (categoryText.includes('racing drivers') || categoryText.includes('formula one')) return 'Racing Driver';
  if (categoryText.includes('mma') || categoryText.includes('mixed martial')) return 'MMA Fighter';

  // Musicians/Singers
  if (categoryText.includes('rappers') || categoryText.includes('rapper') || categoryText.includes('hip hop')) return 'Rapper';
  if (categoryText.includes('singers') || categoryText.includes('vocalist')) return 'Singer';
  if (categoryText.includes('musicians') || categoryText.includes('guitarist') || categoryText.includes('pianist') || categoryText.includes('drummer')) return 'Musician';
  if (categoryText.includes('composers') || categoryText.includes('songwriter')) return 'Musician';

  // Actors/Entertainment
  if (categoryText.includes('film directors') || categoryText.includes('television directors')) return 'Film Director';
  if (categoryText.includes('actresses') || categoryText.includes('actors') || categoryText.includes('film actor')) return 'Actor';
  if (categoryText.includes('comedians') || categoryText.includes('comedian')) return 'Comedian';
  if (categoryText.includes('television presenters') || categoryText.includes('television hosts')) return 'TV Host';
  if (categoryText.includes('models') || categoryText.includes('fashion model')) return 'Model';

  // Content Creators
  if (categoryText.includes('youtubers') || categoryText.includes('youtube')) return 'YouTuber';
  if (categoryText.includes('influencers') || categoryText.includes('social media')) return 'Social Media Influencer';
  if (categoryText.includes('podcasters') || categoryText.includes('podcast')) return 'Podcaster';

  // Other Professions
  if (categoryText.includes('chefs') || categoryText.includes('chef')) return 'Chef';
  if (categoryText.includes('authors') || categoryText.includes('writers') || categoryText.includes('novelist')) return 'Author';
  if (categoryText.includes('journalists') || categoryText.includes('journalist')) return 'Journalist';
  if (categoryText.includes('entrepreneurs') || categoryText.includes('businesspeople')) return 'Entrepreneur';
  if (categoryText.includes('politicians') || categoryText.includes('politician')) return 'Politician';
  if (categoryText.includes('photographers') || categoryText.includes('photographer')) return 'Photographer';
  if (categoryText.includes('producers') || categoryText.includes('film producers')) return 'Producer';

  // If no category match, check biography text
  if (bio.includes('basketball') && (bio.includes('nba') || bio.includes('played for'))) return 'Basketball Player';
  if (bio.includes('football') && (bio.includes('nfl') || bio.includes('quarterback'))) return 'American Football Player';
  if (bio.includes('soccer') || (bio.includes('football') && bio.includes('fifa'))) return 'Soccer Player';

  return null;
}

function determineCategory(name: string, wikipediaData: any, tmdbData: any, spotifyData: any): string {
  const nameLower = name.toLowerCase();

  // RULE 1: Check known celebrity profession mapping FIRST
  if (KNOWN_PROFESSIONS[nameLower]) {
    return KNOWN_PROFESSIONS[nameLower];
  }

  // RULE 2: Use Wikipedia as PRIMARY source (most comprehensive)
  const wikiCategory = determineCategoryFromWikipedia(wikipediaData);
  if (wikiCategory) {
    return wikiCategory;
  }

  // RULE 3: Check Spotify for musicians
  if (spotifyData && spotifyData.genres && spotifyData.genres.length > 0) {
    const genres = spotifyData.genres;
    if (genres.some((g: string) => g.includes('hip hop') || g.includes('rap'))) {
      return 'Rapper';
    }
    return 'Singer';
  }

  // RULE 4: Check TMDB for actors/directors
  if (tmdbData && tmdbData.known_for_department) {
    const dept = tmdbData.known_for_department.toLowerCase();
    if (dept === 'acting') return 'Actor';
    if (dept === 'directing') return 'Film Director';
    if (dept === 'writing') return 'Screenwriter';
    if (dept === 'production') return 'Producer';
  }

  // RULE 5: If TMDB found them → likely actor
  if (tmdbData && tmdbData.known_for && tmdbData.known_for.length > 0) {
    return 'Actor';
  }

  // RULE 6: Spotify presence without genres → musician
  if (spotifyData && spotifyData.followers && spotifyData.followers.total > 0) {
    return 'Musician';
  }

  // Default: Public Figure
  return 'Public Figure';
}

/**
 * Generate bio from collected data
 */
function generateBio(name: string, category: string, wikipediaData: any, tmdbData: any, spotifyData: any): string {
  // PRIORITY 1: Use Wikipedia extract (most comprehensive for ALL professions)
  if (wikipediaData && wikipediaData.extract) {
    const bio = wikipediaData.extract.trim();
    // Keep first 2-3 sentences (usually gives name, profession, achievements)
    const sentences = bio.split('. ').slice(0, 3);
    const shortBio = sentences.join('. ');

    if (shortBio.length > 200) {
      return shortBio.substring(0, 200).trim() + '...';
    }
    return shortBio + (shortBio.endsWith('.') ? '' : '.');
  }

  // PRIORITY 2: Generate from TMDB/Spotify data
  const knownFor: string[] = [];

  if (tmdbData && tmdbData.combined_credits) {
    const topMovies = tmdbData.combined_credits.cast
      ?.sort((a: any, b: any) => (b.vote_count || 0) - (a.vote_count || 0))
      .slice(0, 3)
      .map((m: any) => m.title || m.name)
      .filter(Boolean);

    if (topMovies) knownFor.push(...topMovies);
  }

  if (spotifyData && spotifyData.genres) {
    knownFor.push(...spotifyData.genres.slice(0, 2).map((g: string) =>
      g.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    ));
  }

  if (knownFor.length > 0) {
    return `${category} known for ${knownFor.slice(0, 3).join(', ')}.`;
  }

  if (tmdbData && tmdbData.biography) {
    return tmdbData.biography.substring(0, 200).trim() + '...';
  }

  // Default fallback
  return `${category} with ${category === 'Actor' ? 'notable film career' : 'established career'}.`;
}

// ============================================
// MAIN CLASSIFICATION FUNCTION
// ============================================

/**
 * Classify a single celebrity
 */
async function classifyCelebrity(
  celebrity: any,
  spotifyToken: string | null
): Promise<CelebrityData | null> {
  try {
    console.log(`\n🔍 Classifying: ${celebrity.name}...`);

    let wikipediaData = null;
    let tmdbData = null;
    let spotifyData = null;
    let imageUrl: string | null = null;

    // 1. Try Wikipedia FIRST (most comprehensive source)
    wikipediaData = await getWikipediaData(celebrity.name);

    // SKIP DECEASED CELEBRITIES
    if (wikipediaData?.isDeceased) {
      console.log(`  ⚰️  SKIPPED - Deceased`);
      return null;
    }

    if (wikipediaData?.imageUrl) {
      imageUrl = wikipediaData.imageUrl;
    }

    // 2. Try TMDB (for actors/directors)
    const tmdbPerson = await searchTMDB(celebrity.name);
    if (tmdbPerson) {
      tmdbData = await getTMDBDetails(tmdbPerson.id);
      if (tmdbData?.profile_path && !imageUrl) {
        imageUrl = `https://image.tmdb.org/t/p/original${tmdbData.profile_path}`;
      }
    }

    // 3. Try Spotify (for musicians)
    if (spotifyToken) {
      spotifyData = await searchSpotify(celebrity.name, spotifyToken);
      if (spotifyData?.images?.[0]?.url && !imageUrl) {
        imageUrl = spotifyData.images[0].url;
      }
    }

    // 4. Classify using comprehensive data
    const { tier, justification } = determineTier(celebrity.name, tmdbData, spotifyData);
    const category = determineCategory(celebrity.name, wikipediaData, tmdbData, spotifyData);
    const bio = generateBio(celebrity.name, category, wikipediaData, tmdbData, spotifyData);

    console.log(`  ✅ ${category}, Tier ${tier}: ${justification}`);
    if (imageUrl) console.log(`  📸 Image found`);

    return {
      name: celebrity.name,
      category,
      bio,
      imageUrl,
      tier,
      justification,
      tmdbPopularity: tmdbData?.popularity,
      spotifyFollowers: spotifyData?.followers?.total,
      knownFor: tmdbData?.combined_credits?.cast?.slice(0, 3).map((m: any) => m.title || m.name)
    };

  } catch (error: any) {
    console.error(`  ❌ Error classifying ${celebrity.name}:`, error.message);
    return null;
  }
}

// ============================================
// DATABASE UPDATE
// ============================================

/**
 * Update celebrity in database with classification data
 *
 * Updates:
 * - Category, bio, images, tier
 * - Verified flag (set to true)
 * - Country (fix NULL → "United States")
 * - Max monthly slots (tier-based)
 * - Pricing (6 packages: 3 durations × 2 types, tier-based)
 */
async function updateCelebrity(celebrity: any, data: CelebrityData): Promise<void> {
  const transaction = await sequelize.transaction();

  try {
    // Get category ID
    const categoryResult = await sequelize.query(
      `SELECT id FROM categories WHERE name = :category LIMIT 1`,
      {
        replacements: { category: data.category },
        type: QueryTypes.SELECT,
        transaction
      }
    );

    const categoryId = (categoryResult[0] as any)?.id || null;

    // Upload image if found
    let avatarUrl = celebrity.avatar_url;
    if (data.imageUrl) {
      const cloudinaryUrl = await uploadToCloudinary(data.imageUrl, `enriched/${celebrity.slug}`);
      if (cloudinaryUrl) {
        avatarUrl = cloudinaryUrl;

        // Update media table
        await sequelize.query(
          `UPDATE celebrity_media
           SET url = :url, thumbnail_url = :url, updated_at = NOW()
           WHERE celebrity_id = :celeb_id AND media_type = 'avatar'`,
          {
            replacements: { url: cloudinaryUrl, celeb_id: celebrity.id },
            type: QueryTypes.UPDATE,
            transaction
          }
        );
      }
    }

    // Fix NULL country (default: "United States")
    const country = celebrity.country || 'United States';

    // Update celebrities_new table
    await sequelize.query(
      `UPDATE celebrities_new
       SET category_id = :category_id,
           bio = :bio,
           avatar_url = :avatar_url,
           country = :country,
           verified = true,
           social_followers = :social_followers,
           monthly_listeners = :monthly_listeners,
           updated_at = NOW()
       WHERE id = :celeb_id`,
      {
        replacements: {
          category_id: categoryId,
          bio: data.bio,
          avatar_url: avatarUrl,
          country: country,
          social_followers: data.spotifyFollowers || data.tmdbPopularity ? Math.floor((data.tmdbPopularity || 0) * 10000) : 0,
          monthly_listeners: data.spotifyFollowers || 0,
          celeb_id: celebrity.id
        },
        type: QueryTypes.UPDATE,
        transaction
      }
    );

    // Generate max_monthly_slots based on tier
    const slotsRange = TIER_MAX_SLOTS[data.tier];
    const maxMonthlySlots = randomInRange(slotsRange.min, slotsRange.max);

    // Update celebrity_settings table (tier + max_monthly_slots)
    await sequelize.query(
      `UPDATE celebrity_settings
       SET tier = :tier,
           max_monthly_slots = :max_monthly_slots,
           updated_at = NOW()
       WHERE celebrity_id = :celeb_id`,
      {
        replacements: {
          tier: data.tier,
          max_monthly_slots: maxMonthlySlots,
          celeb_id: celebrity.id
        },
        type: QueryTypes.UPDATE,
        transaction
      }
    );

    // Delete old pricing
    await sequelize.query(
      `DELETE FROM celebrity_pricing WHERE celebrity_id = :celeb_id`,
      {
        replacements: { celeb_id: celebrity.id },
        type: QueryTypes.DELETE,
        transaction
      }
    );

    // Generate new tier-based pricing (6 packages)
    const pricing = generateTierPricing(data.tier);

    // Insert new pricing
    for (const pkg of pricing) {
      await sequelize.query(
        `INSERT INTO celebrity_pricing (
          celebrity_id,
          meeting_type,
          duration,
          price_cents,
          created_at,
          updated_at
        ) VALUES (
          :celeb_id,
          :meeting_type,
          :duration,
          :price_cents,
          NOW(),
          NOW()
        )`,
        {
          replacements: {
            celeb_id: celebrity.id,
            meeting_type: pkg.meeting_type,
            duration: pkg.duration,
            price_cents: pkg.price_cents
          },
          type: QueryTypes.INSERT,
          transaction
        }
      );
    }

    await transaction.commit();

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

// ============================================
// MAIN EXECUTION
// ============================================

async function main() {
  try {
    console.log('🚀 Starting Celebrity Classification Agent...\n');
    console.log('='.repeat(60));

    // Get Spotify token
    console.log('\n🔐 Getting Spotify access token...');
    const spotifyToken = await getSpotifyToken();
    if (spotifyToken) {
      console.log('✅ Spotify token obtained');
    } else {
      console.log('⚠️  No Spotify token (will skip Spotify)');
    }

    // Get ALL celebrities (or use SAMPLE_SIZE env var for testing)
    const SAMPLE_SIZE = process.env.SAMPLE_SIZE ? parseInt(process.env.SAMPLE_SIZE) : null;
    const DATE_FILTER = process.env.CLASSIFY_DATE_FILTER || null;

    // Get celebrities
    let query = `SELECT id, name, slug, country, bio, avatar_url
                 FROM celebrities_new`;

    if (DATE_FILTER) {
      query += ` WHERE created_at > :dateFilter::date`;
    }

    query += ` ORDER BY name`;

    if (SAMPLE_SIZE) {
      query += ` LIMIT :limit`;
    }

    const replacements: any = {};
    if (DATE_FILTER) replacements.dateFilter = DATE_FILTER;
    if (SAMPLE_SIZE) replacements.limit = SAMPLE_SIZE;

    const celebrities = await sequelize.query(
      query,
      {
        replacements,
        type: QueryTypes.SELECT
      }
    );

    console.log(`\n📊 Found ${celebrities.length} celebrities to classify`);
    console.log('='.repeat(60));

    let processed = 0;
    let categorized = 0;
    let imagesFound = 0;
    let biosGenerated = 0;
    let errors = 0;
    let deceased = 0;
    const deceasedList: string[] = [];  // Track deceased celebrities for cross-checking

    // Process in batches
    const batchSize = 10;
    for (let i = 0; i < celebrities.length; i += batchSize) {
      const batch = celebrities.slice(i, i + batchSize);

      console.log(`\n📦 Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(celebrities.length / batchSize)}`);

      for (const celebrity of batch) {
        try {
          const data = await classifyCelebrity(celebrity as any, spotifyToken);

          if (data) {
            await updateCelebrity(celebrity as any, data);
            processed++;

            if (data.category !== 'Other') categorized++;
            if (data.imageUrl) imagesFound++;
            if (data.bio.length > 50) biosGenerated++;
          } else {
            // Data is null - deceased celebrity (logged by classifyCelebrity)
            deceased++;
            deceasedList.push((celebrity as any).name);
          }

        } catch (error: any) {
          console.error(`  ❌ Failed to update ${(celebrity as any).name}:`, error.message);
          errors++;
        }
      }

      console.log(`\n📊 Progress: ${Math.min(i + batchSize, celebrities.length)}/${celebrities.length}`);
      console.log(`   Processed: ${processed}, Categorized: ${categorized}, Images: ${imagesFound}, Bios: ${biosGenerated}, Deceased: ${deceased}, Errors: ${errors}`);
    }

    // Normalize country names
    console.log('\n🌍 Normalizing country names...');
    for (const [oldName, newName] of Object.entries(COUNTRY_MAPPING)) {
      await sequelize.query(
        `UPDATE celebrities_new SET country = :new WHERE country = :old`,
        {
          replacements: { new: newName, old: oldName },
          type: QueryTypes.UPDATE
        }
      );
    }
    console.log('✅ Country names normalized');

    // Save deceased celebrities list for cross-checking
    if (deceasedList.length > 0) {
      const deceasedFilePath = path.join(__dirname, '../../logs/deceased-celebrities.txt');
      const deceasedDir = path.dirname(deceasedFilePath);

      // Create logs directory if it doesn't exist
      if (!fs.existsSync(deceasedDir)) {
        fs.mkdirSync(deceasedDir, { recursive: true });
      }

      const timestamp = new Date().toISOString();
      const fileContent = `# Deceased Celebrities Filtered Out\n# Generated: ${timestamp}\n# Total: ${deceasedList.length}\n\n${deceasedList.join('\n')}\n`;

      fs.writeFileSync(deceasedFilePath, fileContent, 'utf-8');
      console.log(`\n📝 Deceased list saved to: ${deceasedFilePath}`);
      console.log(`   Total deceased filtered: ${deceasedList.length}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎉 CLASSIFICATION COMPLETE!');
    console.log('='.repeat(60));
    console.log(`\n📊 Summary:`);
    console.log(`   Total celebrities: ${celebrities.length}`);
    console.log(`   Successfully processed: ${processed}`);
    console.log(`   Skipped (deceased): ${deceased}`);
    console.log(`   Categorized: ${categorized}`);
    console.log(`   Images found: ${imagesFound}`);
    console.log(`   Bios generated: ${biosGenerated}`);
    console.log(`   Errors: ${errors}`);
    console.log('');

    await sequelize.close();
    process.exit(errors > 0 ? 1 : 0);

  } catch (error: any) {
    console.error('\n❌ Classification failed:', error.message);
    console.error(error.stack);
    await sequelize.close();
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export default main;
