/**
 * Young Emerging Celebrity Seeding Script
 *
 * Target: 3-4k new young celebrities (Gen Z and Millennial stars)
 * Focus: Western-relevant markets, including K-pop, Asian stars, YouTubers, athletes
 * Tiers: Mostly B and C tier (established but not mega-stars)
 *
 * Sources:
 * - Wikipedia: Young living celebrities by category
 * - Spotify: Emerging artists, viral hits
 * - YouTube: Popular content creators
 * - TMDB: Young actors
 * - K-pop/Asian entertainment stars
 * - Athletes, gamers, influencers
 *
 * Features:
 * - Automatic deceased filtering
 * - Duplicate checking against existing database
 * - Western market relevance scoring
 * - Age filtering (born after 1985)
 */

import axios from 'axios';
import sequelize from '../../config/database';
import { QueryTypes } from 'sequelize';
import * as fs from 'fs';
import * as path from 'path';

// Rate limiters
class RateLimiter {
  private lastCall: number = 0;
  private minInterval: number;

  constructor(callsPerSecond: number) {
    this.minInterval = 1000 / callsPerSecond;
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

const wikipediaLimiter = new RateLimiter(1); // 1 req/sec
const spotifyLimiter = new RateLimiter(2); // 2 req/sec
const tmdbLimiter = new RateLimiter(4); // 4 req/sec

// Spotify authentication
let spotifyToken: string | null = null;

async function getSpotifyToken(): Promise<string> {
  if (spotifyToken) return spotifyToken;

  await spotifyLimiter.throttle();

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString('base64')
        }
      }
    );

    spotifyToken = response.data.access_token;
    console.log('✅ Spotify token obtained');
    return spotifyToken!;
  } catch (error) {
    console.error('❌ Failed to get Spotify token:', error);
    throw error;
  }
}

// Types
interface CelebrityCandidate {
  name: string;
  source: 'wikipedia' | 'spotify' | 'youtube' | 'tmdb' | 'manual';
  birthYear?: number;
  occupation?: string;
  country?: string;
  westernRelevance?: number; // 0-100 score
  followers?: number;
  isDeceased?: boolean;
}

// Check if celebrity already exists in database
async function isExistingCelebrity(name: string): Promise<boolean> {
  try {
    const result = await sequelize.query(
      `SELECT COUNT(*) as count FROM celebrities_new WHERE LOWER(name) = LOWER(:name)`,
      {
        replacements: { name },
        type: QueryTypes.SELECT
      }
    );

    return (result[0] as any).count > 0;
  } catch (error) {
    console.error('Error checking existing celebrity:', error);
    return false;
  }
}

// Wikipedia: Get young celebrities from categories
async function getWikipediaYoungCelebrities(category: string, limit: number = 50): Promise<CelebrityCandidate[]> {
  const candidates: CelebrityCandidate[] = [];

  try {
    await wikipediaLimiter.throttle();

    // Get category members
    const response = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        list: 'categorymembers',
        cmtitle: `Category:${category}`,
        cmlimit: limit,
        format: 'json'
      },
      timeout: 15000
    });

    const members = response.data.query?.categorymembers || [];

    for (const member of members) {
      await wikipediaLimiter.throttle();

      // Get page details
      const pageResponse = await axios.get('https://en.wikipedia.org/w/api.php', {
        params: {
          action: 'query',
          titles: member.title,
          prop: 'extracts|categories|pageprops',
          exintro: true,
          explaintext: true,
          cllimit: 50,
          format: 'json'
        },
        timeout: 15000
      });

      const pages = pageResponse.data.query?.pages;
      const page = pages?.[Object.keys(pages)[0]];

      if (!page || page.missing) continue;

      const extract = page.extract || '';
      const categories = (page.categories || []).map((c: any) => c.title.toLowerCase());

      // Check if deceased
      const isDeceased =
        categories.some((c: string) => c.match(/\d{4}\s+deaths/) || c.match(/deaths\s+in\s+\d{4}/)) ||
        extract.match(/^[^.]{0,100}\(\d{4}\s*[-–]\s*\d{4}\)/) ||
        extract.substring(0, 200).match(/\s+died\s+(?:on\s+)?\d{1,2}\s+\w+\s+\d{4}/i);

      if (isDeceased) continue; // Skip deceased

      // Extract birth year from extract
      const birthMatch = extract.match(/\(born.*?(\d{4})\)/i);
      const birthYear = birthMatch ? parseInt(birthMatch[1]) : undefined;

      // Only include people born after 1985 (Gen Z and Millennials)
      if (birthYear && birthYear < 1985) continue;

      candidates.push({
        name: member.title,
        source: 'wikipedia',
        birthYear,
        isDeceased: false
      });
    }
  } catch (error) {
    console.error(`Error fetching Wikipedia category ${category}:`, error);
  }

  return candidates;
}

// Spotify: Get emerging artists and viral tracks
async function getSpotifyEmergingArtists(market: string = 'US', limit: number = 50): Promise<CelebrityCandidate[]> {
  const candidates: CelebrityCandidate[] = [];

  try {
    const token = await getSpotifyToken();
    await spotifyLimiter.throttle();

    // Get several playlists: Viral 50, Top 50, New Music Friday
    const playlists = [
      '37i9dQZEVXbLRQDuF5jeBp', // US Viral 50
      '37i9dQZEVXbLp5XoPON0wI', // US Top 50
      '37i9dQZF1DX4JAvHpjipBk', // New Music Friday
    ];

    for (const playlistId of playlists) {
      await spotifyLimiter.throttle();

      const response = await axios.get(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
          params: { limit: 50, market },
          timeout: 15000
        }
      );

      const tracks = response.data.items || [];

      for (const item of tracks) {
        const artist = item.track?.artists?.[0];
        if (!artist) continue;

        // Get artist details
        await spotifyLimiter.throttle();
        const artistResponse = await axios.get(
          `https://api.spotify.com/v1/artists/${artist.id}`,
          {
            headers: { 'Authorization': `Bearer ${token}` },
            timeout: 15000
          }
        );

        const artistData = artistResponse.data;

        candidates.push({
          name: artistData.name,
          source: 'spotify',
          occupation: 'Singer',
          followers: artistData.followers?.total || 0,
          isDeceased: false
        });

        if (candidates.length >= limit) break;
      }

      if (candidates.length >= limit) break;
    }
  } catch (error) {
    console.error('Error fetching Spotify emerging artists:', error);
  }

  return candidates;
}

// TMDB: Get young actors from popular movies/shows
async function getTMDBYoungActors(limit: number = 50): Promise<CelebrityCandidate[]> {
  const candidates: CelebrityCandidate[] = [];

  try {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      console.log('⚠️  TMDB API key not found, skipping TMDB actors');
      return candidates;
    }

    await tmdbLimiter.throttle();

    // Get popular people
    const response = await axios.get(
      `https://api.themoviedb.org/3/person/popular`,
      {
        params: { api_key: apiKey, page: 1 },
        timeout: 15000
      }
    );

    const people = response.data.results || [];

    for (const person of people.slice(0, limit)) {
      // Get person details
      await tmdbLimiter.throttle();

      const detailsResponse = await axios.get(
        `https://api.themoviedb.org/3/person/${person.id}`,
        {
          params: { api_key: apiKey },
          timeout: 15000
        }
      );

      const details = detailsResponse.data;

      // Check birth year
      const birthYear = details.birthday ? parseInt(details.birthday.split('-')[0]) : undefined;
      if (birthYear && birthYear < 1985) continue;

      // Check if deceased
      if (details.deathday) continue;

      candidates.push({
        name: details.name,
        source: 'tmdb',
        birthYear,
        occupation: 'Actor',
        isDeceased: false
      });
    }
  } catch (error) {
    console.error('Error fetching TMDB actors:', error);
  }

  return candidates;
}

// Manual list of popular young celebrities (YouTubers, influencers, K-pop, etc.)
function getManualYoungCelebrities(): CelebrityCandidate[] {
  return [
    // YouTubers & Content Creators
    { name: 'MrBeast', source: 'manual', occupation: 'YouTuber', country: 'US' },
    { name: 'PewDiePie', source: 'manual', occupation: 'YouTuber', country: 'Sweden' },
    { name: 'Emma Chamberlain', source: 'manual', occupation: 'YouTuber', country: 'US' },
    { name: 'David Dobrik', source: 'manual', occupation: 'YouTuber', country: 'Slovakia' },
    { name: 'Liza Koshy', source: 'manual', occupation: 'YouTuber', country: 'US' },
    { name: 'James Charles', source: 'manual', occupation: 'YouTuber', country: 'US' },
    { name: 'Addison Rae', source: 'manual', occupation: 'TikToker', country: 'US' },
    { name: 'Charli D\'Amelio', source: 'manual', occupation: 'TikToker', country: 'US' },
    { name: 'Dixie D\'Amelio', source: 'manual', occupation: 'TikToker', country: 'US' },
    { name: 'Khaby Lame', source: 'manual', occupation: 'TikToker', country: 'Italy' },

    // K-pop Stars
    { name: 'Cha Eun-woo', source: 'manual', occupation: 'Actor', country: 'South Korea' },
    { name: 'Jungkook', source: 'manual', occupation: 'Singer', country: 'South Korea' },
    { name: 'V', source: 'manual', occupation: 'Singer', country: 'South Korea' },
    { name: 'Jimin', source: 'manual', occupation: 'Singer', country: 'South Korea' },
    { name: 'Lisa', source: 'manual', occupation: 'Singer', country: 'Thailand' },
    { name: 'Jennie Kim', source: 'manual', occupation: 'Singer', country: 'South Korea' },
    { name: 'Rosé', source: 'manual', occupation: 'Singer', country: 'New Zealand' },
    { name: 'Jisoo', source: 'manual', occupation: 'Singer', country: 'South Korea' },
    { name: 'Felix Lee', source: 'manual', occupation: 'Singer', country: 'Australia' },
    { name: 'Bang Chan', source: 'manual', occupation: 'Singer', country: 'Australia' },

    // Young Actors/Actresses
    { name: 'Zendaya', source: 'manual', occupation: 'Actor', country: 'US' },
    { name: 'Tom Holland', source: 'manual', occupation: 'Actor', country: 'UK' },
    { name: 'Timothée Chalamet', source: 'manual', occupation: 'Actor', country: 'US' },
    { name: 'Florence Pugh', source: 'manual', occupation: 'Actor', country: 'UK' },
    { name: 'Anya Taylor-Joy', source: 'manual', occupation: 'Actor', country: 'Argentina' },
    { name: 'Jacob Elordi', source: 'manual', occupation: 'Actor', country: 'Australia' },
    { name: 'Sydney Sweeney', source: 'manual', occupation: 'Actor', country: 'US' },
    { name: 'Hunter Schafer', source: 'manual', occupation: 'Actor', country: 'US' },
    { name: 'Jenna Ortega', source: 'manual', occupation: 'Actor', country: 'US' },
    { name: 'Milly Alcock', source: 'manual', occupation: 'Actor', country: 'Australia' },

    // Young Musicians
    { name: 'Billie Eilish', source: 'manual', occupation: 'Singer', country: 'US' },
    { name: 'Olivia Rodrigo', source: 'manual', occupation: 'Singer', country: 'US' },
    { name: 'Dua Lipa', source: 'manual', occupation: 'Singer', country: 'UK' },
    { name: 'Harry Styles', source: 'manual', occupation: 'Singer', country: 'UK' },
    { name: 'Shawn Mendes', source: 'manual', occupation: 'Singer', country: 'Canada' },
    { name: 'Camila Cabello', source: 'manual', occupation: 'Singer', country: 'Cuba' },
    { name: 'Lil Nas X', source: 'manual', occupation: 'Rapper', country: 'US' },
    { name: 'Doja Cat', source: 'manual', occupation: 'Rapper', country: 'US' },
    { name: 'Tyler, the Creator', source: 'manual', occupation: 'Rapper', country: 'US' },
    { name: 'SZA', source: 'manual', occupation: 'Singer', country: 'US' },

    // Athletes
    { name: 'Naomi Osaka', source: 'manual', occupation: 'Tennis Player', country: 'Japan' },
    { name: 'Coco Gauff', source: 'manual', occupation: 'Tennis Player', country: 'US' },
    { name: 'Kylian Mbappé', source: 'manual', occupation: 'Soccer Player', country: 'France' },
    { name: 'Erling Haaland', source: 'manual', occupation: 'Soccer Player', country: 'Norway' },
    { name: 'Giannis Antetokounmpo', source: 'manual', occupation: 'Basketball Player', country: 'Greece' },
    { name: 'Luka Dončić', source: 'manual', occupation: 'Basketball Player', country: 'Slovenia' },
    { name: 'Simone Biles', source: 'manual', occupation: 'Gymnast', country: 'US' },
    { name: 'Suni Lee', source: 'manual', occupation: 'Gymnast', country: 'US' },

    // Gamers & Streamers
    { name: 'Ninja', source: 'manual', occupation: 'Gamer', country: 'US' },
    { name: 'Pokimane', source: 'manual', occupation: 'Gamer', country: 'Morocco' },
    { name: 'Valkyrae', source: 'manual', occupation: 'Gamer', country: 'US' },
    { name: 'Ludwig Ahgren', source: 'manual', occupation: 'Gamer', country: 'US' },
    { name: 'xQc', source: 'manual', occupation: 'Gamer', country: 'Canada' },
  ];
}

// Main seeding function
async function seedYoungCelebrities() {
  console.log('\n🚀 Starting Young Emerging Celebrity Seeding...\n');
  console.log('============================================================\n');

  const allCandidates: CelebrityCandidate[] = [];
  let duplicates = 0;
  let deceased = 0;

  try {
    // 1. Get manual list (high-priority young celebrities)
    console.log('📋 Fetching manual list of popular young celebrities...');
    const manualList = getManualYoungCelebrities();
    console.log(`   Found ${manualList.length} manual entries\n`);

    // 2. Get Wikipedia young celebrities from various categories
    console.log('🌐 Fetching from Wikipedia...');
    const wikiCategories = [
      '21st-century American actors',
      '21st-century American singers',
      'South Korean male actors',
      'South Korean female singers',
      'K-pop singers',
      'American YouTubers',
      'British actors',
      'Australian actors',
      'Canadian actors',
      '21st-century British actors',
      'Gen Z',
      'TikTokers',
      'Twitch streamers',
      'Professional gamers'
    ];

    for (const category of wikiCategories) {
      console.log(`   Fetching: ${category}...`);
      const candidates = await getWikipediaYoungCelebrities(category, 30);
      allCandidates.push(...candidates);
      console.log(`   ✓ Found ${candidates.length} candidates`);
    }
    console.log(`   Total from Wikipedia: ${allCandidates.length}\n`);

    // 3. Get Spotify emerging artists
    console.log('🎵 Fetching from Spotify...');
    await getSpotifyToken();
    const spotifyArtists = await getSpotifyEmergingArtists('US', 100);
    allCandidates.push(...spotifyArtists);
    console.log(`   Found ${spotifyArtists.length} Spotify artists\n`);

    // 4. Get TMDB young actors
    console.log('🎬 Fetching from TMDB...');
    const tmdbActors = await getTMDBYoungActors(100);
    allCandidates.push(...tmdbActors);
    console.log(`   Found ${tmdbActors.length} TMDB actors\n`);

    // 5. Add manual list
    allCandidates.push(...manualList);

    // 6. Remove duplicates within candidates
    console.log('\n🔍 Processing candidates...');
    const uniqueNames = new Set<string>();
    const uniqueCandidates: CelebrityCandidate[] = [];

    for (const candidate of allCandidates) {
      const nameLower = candidate.name.toLowerCase();
      if (uniqueNames.has(nameLower)) continue;
      uniqueNames.add(nameLower);
      uniqueCandidates.push(candidate);
    }

    console.log(`   Removed ${allCandidates.length - uniqueCandidates.length} internal duplicates`);
    console.log(`   Unique candidates: ${uniqueCandidates.length}\n`);

    // 7. Filter out existing celebrities in database
    console.log('💾 Checking against existing database...');
    const newCandidates: CelebrityCandidate[] = [];

    for (const candidate of uniqueCandidates) {
      const exists = await isExistingCelebrity(candidate.name);
      if (exists) {
        duplicates++;
      } else {
        newCandidates.push(candidate);
      }
    }

    console.log(`   Found ${duplicates} already in database`);
    console.log(`   New celebrities to add: ${newCandidates.length}\n`);

    // 8. Save to file for classification
    const outputPath = path.join(__dirname, '../../../database/seeds/young-emerging-celebrities.json');
    const outputDir = path.dirname(outputPath);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(
      outputPath,
      JSON.stringify(newCandidates, null, 2),
      'utf-8'
    );

    console.log('============================================================');
    console.log('✅ SEEDING COMPLETE!\n');
    console.log('📊 Summary:');
    console.log(`   Total candidates found: ${allCandidates.length}`);
    console.log(`   Unique candidates: ${uniqueCandidates.length}`);
    console.log(`   Already in database: ${duplicates}`);
    console.log(`   New celebrities: ${newCandidates.length}`);
    console.log(`   Deceased filtered: ${deceased}`);
    console.log(`\n📁 Output file: ${outputPath}`);
    console.log('\n🔄 Next step: Run classification agent to process these celebrities');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run seeding
seedYoungCelebrities().catch(console.error);
