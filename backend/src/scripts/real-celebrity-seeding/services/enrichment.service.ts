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
  // Join all occupations for comprehensive matching
  const allOccupations = occupations.join(' ').toLowerCase();

  // ENTERTAINER CATEGORY
  // Film & TV
  if (allOccupations.match(/\b(actor|actress|film actor|television actor|character actor)\b/)) {
    return { universalCategory: 'Entertainer', professionalClass: 'Actor' };
  }
  if (allOccupations.match(/\b(film director|movie director|television director|filmmaker)\b/)) {
    return { universalCategory: 'Entertainer', professionalClass: 'Film Director' };
  }
  if (allOccupations.match(/\b(screenwriter|script writer|playwright)\b/)) {
    return { universalCategory: 'Entertainer', professionalClass: 'Screenwriter' };
  }
  if (allOccupations.match(/\b(film producer|television producer|movie producer)\b/)) {
    return { universalCategory: 'Entertainer', professionalClass: 'Producer' };
  }

  // Music
  if (allOccupations.match(/\b(singer|vocalist|pop singer|rock singer|jazz singer|opera singer)\b/)) {
    return { universalCategory: 'Entertainer', professionalClass: 'Singer' };
  }
  if (allOccupations.match(/\b(rapper|hip hop|mc)\b/)) {
    return { universalCategory: 'Entertainer', professionalClass: 'Rapper' };
  }
  if (allOccupations.match(/\b(musician|guitarist|pianist|drummer|bass player|instrumentalist)\b/)) {
    return { universalCategory: 'Entertainer', professionalClass: 'Musician' };
  }
  if (allOccupations.match(/\b(composer|music composer|songwriter)\b/)) {
    return { universalCategory: 'Entertainer', professionalClass: 'Composer' };
  }
  if (allOccupations.match(/\b(dj|disc jockey|music producer|record producer)\b/)) {
    return { universalCategory: 'Entertainer', professionalClass: 'DJ/Producer' };
  }

  // Performance
  if (allOccupations.match(/\b(comedian|stand-up comedian|comic)\b/)) {
    return { universalCategory: 'Entertainer', professionalClass: 'Comedian' };
  }
  if (allOccupations.match(/\b(dancer|choreographer|ballet dancer)\b/)) {
    return { universalCategory: 'Entertainer', professionalClass: 'Dancer' };
  }
  if (allOccupations.match(/\b(magician|illusionist)\b/)) {
    return { universalCategory: 'Entertainer', professionalClass: 'Magician' };
  }
  if (allOccupations.match(/\b(model|fashion model|supermodel)\b/)) {
    return { universalCategory: 'Entertainer', professionalClass: 'Model' };
  }

  // ATHLETE CATEGORY
  if (allOccupations.match(/\b(association football|soccer|football player|footballer)\b/)) {
    return { universalCategory: 'Athlete', professionalClass: 'Soccer Player' };
  }
  if (allOccupations.match(/\b(basketball|basketball player)\b/)) {
    return { universalCategory: 'Athlete', professionalClass: 'Basketball Player' };
  }
  if (allOccupations.match(/\b(tennis|tennis player)\b/)) {
    return { universalCategory: 'Athlete', professionalClass: 'Tennis Player' };
  }
  if (allOccupations.match(/\b(american football|nfl|football)\b/)) {
    return { universalCategory: 'Athlete', professionalClass: 'American Football Player' };
  }
  if (allOccupations.match(/\b(baseball|baseball player)\b/)) {
    return { universalCategory: 'Athlete', professionalClass: 'Baseball Player' };
  }
  if (allOccupations.match(/\b(boxer|boxing)\b/)) {
    return { universalCategory: 'Athlete', professionalClass: 'Boxer' };
  }
  if (allOccupations.match(/\b(mixed martial arts|mma|fighter|ufc)\b/)) {
    return { universalCategory: 'Athlete', professionalClass: 'MMA Fighter' };
  }
  if (allOccupations.match(/\b(golfer|golf)\b/)) {
    return { universalCategory: 'Athlete', professionalClass: 'Golfer' };
  }
  if (allOccupations.match(/\b(racing driver|formula one|nascar|race car)\b/)) {
    return { universalCategory: 'Athlete', professionalClass: 'Racing Driver' };
  }
  if (allOccupations.match(/\b(swimmer|swimming)\b/)) {
    return { universalCategory: 'Athlete', professionalClass: 'Swimmer' };
  }
  if (allOccupations.match(/\b(runner|track and field|sprinter|marathon)\b/)) {
    return { universalCategory: 'Athlete', professionalClass: 'Track & Field Athlete' };
  }
  if (allOccupations.match(/\b(gymnast|gymnastics)\b/)) {
    return { universalCategory: 'Athlete', professionalClass: 'Gymnast' };
  }
  if (allOccupations.match(/\b(skier|skiing)\b/)) {
    return { universalCategory: 'Athlete', professionalClass: 'Skier' };
  }
  if (allOccupations.match(/\b(wrestler|wrestling|wwe)\b/)) {
    return { universalCategory: 'Athlete', professionalClass: 'Wrestler' };
  }

  // CREATOR CATEGORY
  if (allOccupations.match(/\b(youtuber|youtube|video creator)\b/)) {
    return { universalCategory: 'Creator', professionalClass: 'YouTuber' };
  }
  if (allOccupations.match(/\b(influencer|social media|instagram|tiktok)\b/)) {
    return { universalCategory: 'Creator', professionalClass: 'Social Media Influencer' };
  }
  if (allOccupations.match(/\b(podcaster|podcast host)\b/)) {
    return { universalCategory: 'Creator', professionalClass: 'Podcaster' };
  }
  if (allOccupations.match(/\b(photographer|photojournalist)\b/)) {
    return { universalCategory: 'Creator', professionalClass: 'Photographer' };
  }
  if (allOccupations.match(/\b(artist|painter|sculptor|visual artist)\b/)) {
    return { universalCategory: 'Creator', professionalClass: 'Visual Artist' };
  }

  // BUSINESS CATEGORY
  if (allOccupations.match(/\b(entrepreneur|businessperson|business executive|ceo|founder)\b/)) {
    return { universalCategory: 'Business', professionalClass: 'Entrepreneur' };
  }
  if (allOccupations.match(/\b(author|writer|novelist)\b/)) {
    return { universalCategory: 'Business', professionalClass: 'Author' };
  }
  if (allOccupations.match(/\b(journalist|reporter|correspondent)\b/)) {
    return { universalCategory: 'Business', professionalClass: 'Journalist' };
  }
  if (allOccupations.match(/\b(chef|cook|culinary)\b/)) {
    return { universalCategory: 'Business', professionalClass: 'Chef' };
  }

  // PUBLIC FIGURE CATEGORY
  if (allOccupations.match(/\b(politician|president|senator|governor|minister|mayor)\b/)) {
    return { universalCategory: 'PublicFigure', professionalClass: 'Politician' };
  }
  if (allOccupations.match(/\b(activist|human rights|social activist)\b/)) {
    return { universalCategory: 'PublicFigure', professionalClass: 'Activist' };
  }
  if (allOccupations.match(/\b(television presenter|tv host|talk show host|presenter)\b/)) {
    return { universalCategory: 'PublicFigure', professionalClass: 'TV Host' };
  }
  if (allOccupations.match(/\b(radio personality|radio host)\b/)) {
    return { universalCategory: 'PublicFigure', professionalClass: 'Radio Host' };
  }

  // Fallback - try to categorize based on partial matches
  if (allOccupations.match(/\b(music|band|concert|album)\b/)) {
    return { universalCategory: 'Entertainer', professionalClass: 'Musician' };
  }
  if (allOccupations.match(/\b(sport|athlete|player|olympic)\b/)) {
    return { universalCategory: 'Athlete', professionalClass: 'Athlete' };
  }
  if (allOccupations.match(/\b(create|content|digital|online)\b/)) {
    return { universalCategory: 'Creator', professionalClass: 'Content Creator' };
  }

  // Default - assign to PublicFigure instead of Other
  return { universalCategory: 'PublicFigure', professionalClass: occupations[0] || 'Public Figure' };
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
