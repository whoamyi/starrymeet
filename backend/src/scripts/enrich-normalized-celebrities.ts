/**
 * Enrichment Script for Normalized Celebrity Schema
 *
 * Enriches 7,612 celebrities with:
 * 1. Real images from Wikipedia/Wikidata/TMDB/Spotify
 * 2. Proper categories based on TMDB/Spotify/YouTube queries
 * 3. Real bios from TMDB/Wikipedia
 * 4. Fame tiers (S/A/B/C/D) based on popularity metrics
 * 5. Normalized country names
 */

import sequelize from '../config/database';
import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';

// API Configuration
const TMDB_API_KEY = process.env.TMDB_API_KEY || '';
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '';
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || '';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || ''
});

// Country normalization mapping
const COUNTRY_NORMALIZATION: Record<string, string> = {
  'United Kingdom': 'United Kingdom',
  'United States': 'United States',
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
  'Kingdom of Denmark': 'Denmark'
};

// Rate limiters
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
const wikidataLimiter = new RateLimiter(1);

interface EnrichmentResult {
  category?: string;
  bio?: string;
  imageUrl?: string;
  tier?: 'S' | 'A' | 'B' | 'C' | 'D';
  popularityScore?: number;
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
      params: { api_key: TMDB_API_KEY },
      timeout: 10000
    });
    return response.data;
  } catch (error) {
    return null;
  }
}

/**
 * Search Spotify for artist
 */
async function searchSpotify(name: string, accessToken: string): Promise<any> {
  if (!accessToken) return null;

  await spotifyLimiter.throttle();
  try {
    const response = await axios.get(`https://api.spotify.com/v1/search`, {
      params: { q: name, type: 'artist', limit: 1 },
      headers: { Authorization: `Bearer ${accessToken}` },
      timeout: 10000
    });
    return response.data.artists?.items?.[0] || null;
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
 * Search Wikipedia/Wikidata for image
 */
async function searchWikidataImage(name: string): Promise<string | null> {
  await wikidataLimiter.throttle();

  try {
    // First, search Wikipedia for the person
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

    // Get page images
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
 * Determine category from TMDB/Spotify data
 */
function determineCategory(tmdbData: any, spotifyData: any): string {
  if (tmdbData) {
    const dept = tmdbData.known_for_department?.toLowerCase();
    if (dept === 'acting') return 'Actor';
    if (dept === 'directing') return 'Film Director';
    if (dept === 'writing') return 'Screenwriter';
    return 'Actor'; // Default for TMDB
  }

  if (spotifyData) {
    const genres = spotifyData.genres || [];
    if (genres.some((g: string) => g.includes('hip hop') || g.includes('rap'))) {
      return 'Rapper';
    }
    return 'Musician';
  }

  return 'Other';
}

/**
 * Calculate fame tier based on popularity metrics
 */
function calculateTier(tmdbData: any, spotifyData: any): 'S' | 'A' | 'B' | 'C' | 'D' {
  let score = 0;

  if (tmdbData) {
    score = tmdbData.popularity || 0;
    // TMDB popularity: 100+ = S, 50-100 = A, 20-50 = B, 5-20 = C, <5 = D
    if (score >= 100) return 'S';
    if (score >= 50) return 'A';
    if (score >= 20) return 'B';
    if (score >= 5) return 'C';
  }

  if (spotifyData) {
    const followers = spotifyData.followers?.total || 0;
    // Spotify followers: 10M+ = S, 1M-10M = A, 100k-1M = B, 10k-100k = C, <10k = D
    if (followers >= 10000000) return 'S';
    if (followers >= 1000000) return 'A';
    if (followers >= 100000) return 'B';
    if (followers >= 10000) return 'C';
  }

  return 'D';
}

/**
 * Enrich single celebrity
 */
async function enrichCelebrity(
  celebrity: any,
  spotifyToken: string | null
): Promise<EnrichmentResult> {
  const result: EnrichmentResult = {};

  console.log(`\n🔍 Enriching: ${celebrity.name}...`);

  // 1. Try TMDB
  const tmdbPerson = await searchTMDB(celebrity.name);
  if (tmdbPerson) {
    const tmdbDetails = await getTMDBDetails(tmdbPerson.id);
    if (tmdbDetails) {
      result.category = determineCategory(tmdbDetails, null);
      result.bio = tmdbDetails.biography?.substring(0, 200) || undefined;
      result.tier = calculateTier(tmdbDetails, null);
      result.popularityScore = tmdbDetails.popularity;

      if (tmdbDetails.profile_path) {
        result.imageUrl = `https://image.tmdb.org/t/p/original${tmdbDetails.profile_path}`;
      }

      console.log(`  ✅ TMDB: ${result.category}, tier ${result.tier}, popularity ${result.popularityScore}`);
    }
  }

  // 2. Try Spotify (if TMDB didn't work or for musicians)
  if (!result.category || result.category === 'Other') {
    const spotifyArtist = await searchSpotify(celebrity.name, spotifyToken || '');
    if (spotifyArtist) {
      result.category = determineCategory(null, spotifyArtist);
      result.tier = calculateTier(null, spotifyArtist);
      result.popularityScore = spotifyArtist.followers?.total;

      if (spotifyArtist.images?.[0]?.url) {
        result.imageUrl = spotifyArtist.images[0].url;
      }

      console.log(`  ✅ Spotify: ${result.category}, tier ${result.tier}, followers ${result.popularityScore}`);
    }
  }

  // 3. Try Wikipedia/Wikidata for image (if still no image)
  if (!result.imageUrl) {
    const wikiImage = await searchWikidataImage(celebrity.name);
    if (wikiImage) {
      result.imageUrl = wikiImage;
      console.log(`  ✅ Wikipedia: Found image`);
    }
  }

  // 4. Default values if nothing found
  if (!result.category) {
    result.category = 'Other';
  }
  if (!result.tier) {
    result.tier = 'D';
  }

  return result;
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

/**
 * Main enrichment process
 */
async function main() {
  try {
    console.log('🚀 Starting celebrity enrichment...\n');
    console.log('='.repeat(60));

    // Get Spotify token
    console.log('\n🔐 Getting Spotify access token...');
    const spotifyToken = await getSpotifyToken();
    if (spotifyToken) {
      console.log('✅ Spotify token obtained');
    } else {
      console.log('⚠️  No Spotify token (will skip Spotify enrichment)');
    }

    // Get sample of celebrities from new schema
    const SAMPLE_SIZE = process.env.SAMPLE_SIZE ? parseInt(process.env.SAMPLE_SIZE) : 100;

    const [celebrities]: any = await sequelize.query(`
      SELECT id, name, slug, country, bio
      FROM celebrities_new
      ORDER BY name
      LIMIT ${SAMPLE_SIZE}
    `);

    console.log(`\n📊 Found ${celebrities.length} celebrities to enrich`);
    console.log('='.repeat(60));

    let enriched = 0;
    let categorized = 0;
    let imagesFound = 0;
    let biosFound = 0;

    // Process in batches
    const batchSize = 10;
    for (let i = 0; i < celebrities.length; i += batchSize) {
      const batch = celebrities.slice(i, i + batchSize);

      console.log(`\n📦 Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(celebrities.length / batchSize)}`);

      for (const celebrity of batch) {
        const enrichment = await enrichCelebrity(celebrity, spotifyToken);

        // Update database
        const updates: string[] = [];

        // Update category
        if (enrichment.category && enrichment.category !== 'Other') {
          const [categoryResult]: any = await sequelize.query(`
            SELECT id FROM categories WHERE name = '${enrichment.category}' LIMIT 1
          `);
          if (categoryResult[0]) {
            updates.push(`category_id = ${categoryResult[0].id}`);
            categorized++;
          }
        }

        // Update bio
        if (enrichment.bio) {
          updates.push(`bio = '${enrichment.bio.replace(/'/g, "''")}'`);
          biosFound++;
        }

        // Update tier
        if (enrichment.tier) {
          await sequelize.query(`
            UPDATE celebrity_settings
            SET tier = '${enrichment.tier}'
            WHERE celebrity_id = '${celebrity.id}'
          `);
        }

        // Upload and update image
        if (enrichment.imageUrl) {
          const cloudinaryUrl = await uploadToCloudinary(
            enrichment.imageUrl,
            `enriched/${celebrity.slug}`
          );

          if (cloudinaryUrl) {
            updates.push(`avatar_url = '${cloudinaryUrl}'`);

            // Update media table
            await sequelize.query(`
              UPDATE celebrity_media
              SET url = '${cloudinaryUrl}', thumbnail_url = '${cloudinaryUrl}'
              WHERE celebrity_id = '${celebrity.id}' AND media_type = 'avatar'
            `);

            imagesFound++;
          }
        }

        // Apply all updates
        if (updates.length > 0) {
          await sequelize.query(`
            UPDATE celebrities_new
            SET ${updates.join(', ')}, updated_at = NOW()
            WHERE id = '${celebrity.id}'
          `);
          enriched++;
        }
      }

      // Progress update
      console.log(`\n📊 Progress: ${Math.min(i + batchSize, celebrities.length)}/${celebrities.length}`);
      console.log(`   Enriched: ${enriched}, Categorized: ${categorized}, Images: ${imagesFound}, Bios: ${biosFound}`);
    }

    // Normalize country names
    console.log('\n🌍 Normalizing country names...');
    for (const [old, normalized] of Object.entries(COUNTRY_NORMALIZATION)) {
      await sequelize.query(`
        UPDATE celebrities_new
        SET country = '${normalized}'
        WHERE country = '${old}'
      `);
    }
    console.log('✅ Country names normalized');

    console.log('\n' + '='.repeat(60));
    console.log('🎉 ENRICHMENT COMPLETE!');
    console.log('='.repeat(60));
    console.log(`\n📊 Summary:`);
    console.log(`   Total celebrities: ${celebrities.length}`);
    console.log(`   Enriched: ${enriched}`);
    console.log(`   Categorized: ${categorized}`);
    console.log(`   Real images found: ${imagesFound}`);
    console.log(`   Bios found: ${biosFound}`);
    console.log('');

    await sequelize.close();
    process.exit(0);

  } catch (error: any) {
    console.error('\n❌ Enrichment failed:', error.message);
    console.error(error.stack);
    await sequelize.close();
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export default main;
