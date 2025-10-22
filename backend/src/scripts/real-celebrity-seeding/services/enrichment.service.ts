/**
 * Enrichment Service
 * Orchestrates data enrichment from multiple APIs
 */

import { WikidataEntity, CelebrityCandidate, EnrichmentResult, UniversalCategory } from '../types';
import { enrichWithTMDB } from './tmdb.service';
import { enrichWithSpotify } from './spotify.service';
import { enrichWithYouTube } from './youtube.service';
import { uploadCelebrityImages } from './cloudinary.service';
import { calculatePricing } from './pricing.service';
import { performSafetyCheck, validateBio, determineBookable } from './safety.service';
import { PROFESSIONAL_CLASSES, REGIONS, DEFAULT_BOOKING_CONFIG } from '../config';

/**
 * Generate slug from name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Extract region from country
 */
function getRegionFromCountry(country?: string): string {
  if (!country) return 'Other';

  for (const [region, countries] of Object.entries(REGIONS)) {
    if (countries.includes(country)) {
      return region;
    }
  }

  return 'Other';
}

/**
 * Map occupation to universal category and professional class
 */
function mapOccupationToTaxonomy(occupations: string[]): {
  universalCategory: UniversalCategory;
  professionalClass: string;
} {
  const occupation = occupations[0]?.toLowerCase() || '';

  // Entertainer
  if (occupation.includes('actor') || occupation.includes('actress')) {
    return { universalCategory: 'Entertainer', professionalClass: 'Actor' };
  }
  if (occupation.includes('singer') || occupation.includes('musician')) {
    return { universalCategory: 'Entertainer', professionalClass: 'Musician' };
  }
  if (occupation.includes('comedian')) {
    return { universalCategory: 'Entertainer', professionalClass: 'Comedian' };
  }
  if (occupation.includes('director')) {
    return { universalCategory: 'Entertainer', professionalClass: 'Film Director' };
  }

  // Athlete
  if (occupation.includes('football') || occupation.includes('soccer')) {
    return { universalCategory: 'Athlete', professionalClass: 'Soccer Player' };
  }
  if (occupation.includes('basketball')) {
    return { universalCategory: 'Athlete', professionalClass: 'Basketball Player' };
  }
  if (occupation.includes('tennis')) {
    return { universalCategory: 'Athlete', professionalClass: 'Tennis Player' };
  }
  if (occupation.includes('boxer') || occupation.includes('fighter')) {
    return { universalCategory: 'Athlete', professionalClass: 'Fighter' };
  }

  // Creator
  if (occupation.includes('youtuber') || occupation.includes('content creator')) {
    return { universalCategory: 'Creator', professionalClass: 'YouTuber' };
  }
  if (occupation.includes('influencer')) {
    return { universalCategory: 'Creator', professionalClass: 'Instagram Influencer' };
  }

  // Business
  if (occupation.includes('entrepreneur') || occupation.includes('businessperson')) {
    return { universalCategory: 'Business', professionalClass: 'Entrepreneur' };
  }
  if (occupation.includes('author') || occupation.includes('writer')) {
    return { universalCategory: 'Business', professionalClass: 'Author' };
  }

  // Default
  return { universalCategory: 'Other', professionalClass: 'Other' };
}

/**
 * Generate short bio (max 140 chars)
 */
function generateShortBio(
  name: string,
  professionalClass: string,
  knownFor: string[],
  tmdbBio?: string
): string {
  // Try to extract from TMDB bio
  if (tmdbBio && tmdbBio.length > 0) {
    // Take first sentence
    const firstSentence = tmdbBio.split(/[.!?]/)[0];
    if (firstSentence.length <= 140) {
      return firstSentence.trim() + '.';
    }
  }

  // Generate from known_for
  if (knownFor.length > 0) {
    const works = knownFor.slice(0, 2).join(' & ');
    const bio = `${professionalClass} known for ${works}`;

    if (bio.length <= 140) {
      return bio;
    }

    // Fallback: just first work
    return `${professionalClass} known for ${knownFor[0]}`;
  }

  // Minimal fallback
  return `${professionalClass}`;
}

/**
 * Enrich a single Wikidata entity with data from all sources
 */
export async function enrichCandidate(
  entity: WikidataEntity,
  retryCount: number = 0
): Promise<EnrichmentResult> {
  const errors: string[] = [];
  const apiCalls: EnrichmentResult['apiCalls'] = {};

  try {
    console.log(`\n🔄 Enriching: ${entity.name}...`);

    // Safety check first
    const safetyCheck = performSafetyCheck({
      name: entity.name,
      birthDate: entity.birthDate,
      deathDate: entity.deathDate,
      occupations: entity.occupation || [],
      bio: undefined,
      country: entity.country
    });

    if (!safetyCheck.allowed) {
      console.log(`❌ Safety check failed: ${safetyCheck.reason}`);
      return {
        success: false,
        errors: [safetyCheck.reason || 'Safety check failed'],
        apiCalls
      };
    }

    // Generate slug
    const slug = generateSlug(entity.name);

    // Map occupation to taxonomy
    const { universalCategory, professionalClass } = mapOccupationToTaxonomy(entity.occupation || []);

    // Initialize candidate
    const candidate: Partial<CelebrityCandidate> = {
      wikidata_qid: entity.qid,
      imdb_id: entity.imdbId,
      tmdb_id: entity.tmdbId,
      spotify_id: entity.spotifyId,
      youtube_channel_id: entity.youtubeChannelId,
      name: entity.name,
      slug,
      birth_date: entity.birthDate,
      country: entity.country,
      region: getRegionFromCountry(entity.country),
      universal_category: universalCategory,
      professional_class: professionalClass,
      languages: [], // TODO: Extract from Wikidata
      known_for: entity.notableWorks || [],
      awards_count: entity.awards?.length || 0,
      popularity_score: 0,
      base_price_cents: 0,
      price_tier: 'Emerging',
      rarity_factor: 1.0,
      demand_factor: 1.0,
      market_multiplier: 1.0,
      meeting_complexity: 1.0,
      pending_review_for_price: false,
      is_verified: false,
      is_featured: false,
      is_active: true,
      bookable: false,
      nda_required: false,
      meet_duration: DEFAULT_BOOKING_CONFIG.meetDuration,
      meeting_options: DEFAULT_BOOKING_CONFIG.meetingOptions,
      travel_policy: DEFAULT_BOOKING_CONFIG.travelPolicy,
      cancellation_policy: DEFAULT_BOOKING_CONFIG.cancellationPolicy,
      source_apis: ['wikidata']
    };

    // Enrich from TMDB (for actors/directors)
    if (universalCategory === 'Entertainer' && (professionalClass.includes('Actor') || professionalClass.includes('Director'))) {
      try {
        const tmdbData = await enrichWithTMDB(entity.name, entity.tmdbId);
        apiCalls.tmdb = true;

        if (tmdbData) {
          candidate.tmdb_id = tmdbData.tmdbId;
          candidate.short_bio = tmdbData.bio ? tmdbData.bio.substring(0, 140) : undefined;
          candidate.known_for = tmdbData.knownFor;
          candidate.box_office_total = tmdbData.boxOfficeEstimate;
          candidate.hero_image_url = tmdbData.imageUrl;
          candidate.source_apis?.push('tmdb');

          console.log(`  ✅ TMDB: ${tmdbData.popularity} popularity, ${tmdbData.knownFor.length} known works`);
        }
      } catch (error: any) {
        errors.push(`TMDB error: ${error.message}`);
      }
    }

    // Enrich from Spotify (for musicians)
    if (professionalClass.includes('Musician') || professionalClass.includes('Singer')) {
      try {
        const spotifyData = await enrichWithSpotify(entity.name, entity.spotifyId);
        apiCalls.spotify = true;

        if (spotifyData) {
          candidate.spotify_id = spotifyData.spotifyId;
          candidate.social_followers = spotifyData.followers;
          candidate.monthly_listeners = spotifyData.monthlyListeners;
          candidate.genres = spotifyData.genres;
          candidate.known_for = spotifyData.topTracks;
          candidate.hero_image_url = candidate.hero_image_url || spotifyData.imageUrl;
          candidate.source_apis?.push('spotify');

          console.log(`  ✅ Spotify: ${spotifyData.followers.toLocaleString()} followers`);
        }
      } catch (error: any) {
        errors.push(`Spotify error: ${error.message}`);
      }
    }

    // Enrich from YouTube (for creators)
    if (universalCategory === 'Creator' || entity.youtubeChannelId) {
      try {
        const youtubeData = await enrichWithYouTube(entity.name, entity.youtubeChannelId);
        apiCalls.youtube = true;

        if (youtubeData) {
          candidate.youtube_channel_id = youtubeData.youtubeChannelId;
          candidate.social_followers = (candidate.social_followers || 0) + youtubeData.subscribers;
          candidate.monthly_views = youtubeData.monthlyViews;
          candidate.hero_image_url = candidate.hero_image_url || youtubeData.imageUrl;
          candidate.source_apis?.push('youtube');

          console.log(`  ✅ YouTube: ${youtubeData.subscribers.toLocaleString()} subscribers`);
        }
      } catch (error: any) {
        errors.push(`YouTube error: ${error.message}`);
      }
    }

    // Generate bio if not set
    if (!candidate.short_bio) {
      candidate.short_bio = generateShortBio(
        entity.name,
        professionalClass,
        candidate.known_for || [],
        undefined
      );
    }

    // Validate bio
    const bioValidation = validateBio(candidate.short_bio);
    if (!bioValidation.valid) {
      console.log(`  ⚠️  Bio validation failed: ${bioValidation.reason}`);
      candidate.short_bio = generateShortBio(
        entity.name,
        professionalClass,
        candidate.known_for || []
      );
    }

    // Calculate pricing
    const pricing = calculatePricing(candidate);
    candidate.popularity_score = pricing.popularity_score;
    candidate.price_tier = pricing.price_tier;
    candidate.base_price_cents = pricing.final_price_cents; // Store final price as base price
    candidate.rarity_factor = pricing.rarity_factor;
    candidate.demand_factor = pricing.demand_factor;
    candidate.market_multiplier = pricing.market_multiplier;
    candidate.meeting_complexity = pricing.meeting_complexity;
    candidate.pending_review_for_price = pricing.pending_review;

    console.log(`  💰 Price: $${(pricing.final_price_cents / 100).toLocaleString()} (${pricing.price_tier})`);

    // Upload images to Cloudinary
    try {
      const images = await uploadCelebrityImages(
        entity.name,
        slug,
        candidate.region || 'Other',
        candidate.hero_image_url
      );

      candidate.hero_image_url = images.heroUrl;
      candidate.thumbnail_url = images.thumbnailUrl;
      candidate.image_sources = images.source ? [{ url: images.source }] : [];

      console.log(`  📸 Images uploaded to Cloudinary`);

    } catch (error: any) {
      errors.push(`Cloudinary error: ${error.message}`);
    }

    // Determine if bookable
    candidate.bookable = determineBookable(safetyCheck);

    // Set verification status (verified if from major sources)
    candidate.is_verified = !!(candidate.tmdb_id || candidate.spotify_id || candidate.youtube_channel_id);

    // Set featured (top 10% by price)
    candidate.is_featured = pricing.final_price_cents >= 25000_00; // $25k+

    // Set enrichment timestamp
    candidate.enriched_at = new Date();

    console.log(`✅ Enrichment complete for ${entity.name}`);

    return {
      success: true,
      candidate: candidate as CelebrityCandidate,
      apiCalls
    };

  } catch (error: any) {
    console.error(`❌ Enrichment failed for ${entity.name}:`, error.message);

    return {
      success: false,
      errors: [...errors, error.message],
      apiCalls
    };
  }
}

/**
 * Enrich multiple candidates with retry logic
 */
export async function enrichCandidatesWithRetry(
  entities: WikidataEntity[],
  maxRetries: number = 3
): Promise<{
  successful: CelebrityCandidate[];
  failed: Array<{ entity: WikidataEntity; errors: string[] }>;
}> {
  const successful: CelebrityCandidate[] = [];
  const failed: Array<{ entity: WikidataEntity; errors: string[] }> = [];

  for (const entity of entities) {
    let attempts = 0;
    let enriched = false;

    while (attempts < maxRetries && !enriched) {
      const result = await enrichCandidate(entity, attempts);

      if (result.success && result.candidate) {
        successful.push(result.candidate);
        enriched = true;
      } else {
        attempts++;

        if (attempts < maxRetries) {
          console.log(`  ⚠️  Retry ${attempts}/${maxRetries} for ${entity.name}...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts)); // Exponential backoff
        } else {
          failed.push({
            entity,
            errors: result.errors || ['Unknown error']
          });
        }
      }
    }
  }

  return { successful, failed };
}

export default {
  enrichCandidate,
  enrichCandidatesWithRetry
};
