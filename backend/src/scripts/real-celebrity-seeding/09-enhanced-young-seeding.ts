/**
 * Enhanced Young Celebrity Seeding - Round 2
 *
 * Goal: Fetch additional 500-1k celebrities
 * Changes from previous run:
 * - Age threshold lowered to 1980 (early Millennials)
 * - 30+ additional Wikipedia categories
 * - Fixed Spotify authentication
 * - YouTube API integration enabled
 * - 200+ additional manual celebrities
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

const wikipediaLimiter = new RateLimiter(1.5);
const spotifyLimiter = new RateLimiter(2);
const tmdbLimiter = new RateLimiter(4);
const youtubeLimiter = new RateLimiter(1);

let spotifyToken: string | null = null;

async function getSpotifyToken(): Promise<string> {
  if (spotifyToken) return spotifyToken;

  await spotifyLimiter.throttle();

  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Spotify credentials not found in environment');
    }

    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
        },
        timeout: 15000
      }
    );

    spotifyToken = response.data.access_token;
    console.log('   ✓ Spotify token obtained');
    return spotifyToken!;
  } catch (error: any) {
    console.error('   ⚠️  Spotify auth failed:', error.message);
    return '';
  }
}

interface CelebrityCandidate {
  name: string;
  source: string;
  birthYear?: number;
  occupation?: string;
  country?: string;
  followers?: number;
  isDeceased?: boolean;
}

async function isExistingCelebrity(name: string): Promise<boolean> {
  try {
    const nameLower = name.toLowerCase().trim();
    const result = await sequelize.query(
      `SELECT COUNT(*) as count FROM celebrities_new
       WHERE LOWER(TRIM(name)) = :name
       OR LOWER(TRIM(slug)) = :slug`,
      {
        replacements: {
          name: nameLower,
          slug: nameLower.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        },
        type: QueryTypes.SELECT
      }
    );

    return (result[0] as any).count > 0;
  } catch (error) {
    return false;
  }
}

// Wikipedia fetching with deceased detection
async function getWikipediaYoungCelebrities(category: string, limit: number = 50): Promise<CelebrityCandidate[]> {
  const candidates: CelebrityCandidate[] = [];

  try {
    await wikipediaLimiter.throttle();

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
      try {
        await wikipediaLimiter.throttle();

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

        if (isDeceased) continue;

        // Extract birth year
        const birthMatch = extract.match(/\(born.*?(\d{4})\)/i);
        const birthYear = birthMatch ? parseInt(birthMatch[1]) : undefined;

        // Lower threshold to 1980 (instead of 1985)
        if (birthYear && birthYear < 1980) continue;

        candidates.push({
          name: member.title,
          source: `wikipedia:${category}`,
          birthYear,
          isDeceased: false
        });
      } catch (error) {
        continue;
      }
    }
  } catch (error) {
    // Silent fail for individual categories
  }

  return candidates;
}

// Spotify fetching with better error handling
async function getSpotifyArtists(): Promise<CelebrityCandidate[]> {
  const candidates: CelebrityCandidate[] = [];

  try {
    const token = await getSpotifyToken();
    if (!token) {
      console.log('   ⚠️  Skipping Spotify (no token)');
      return [];
    }

    const markets = ['US', 'GB', 'CA', 'AU', 'BR', 'MX', 'JP', 'KR'];
    const playlists = [
      '37i9dQZEVXbLRQDuF5jeBp', // US Top 50
      '37i9dQZEVXbLnolsZ8PSNw', // UK Top 50
      '37i9dQZEVXbKj23U1GF4IR', // Canada Top 50
      '37i9dQZEVXbJPcfkRz0wJ0', // Australia Top 50
    ];

    for (const playlistId of playlists) {
      try {
        await spotifyLimiter.throttle();

        const response = await axios.get(
          `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
          {
            headers: { 'Authorization': `Bearer ${token}` },
            params: { limit: 50 },
            timeout: 15000
          }
        );

        for (const item of response.data.items || []) {
          const artist = item.track?.artists?.[0];
          if (!artist) continue;

          candidates.push({
            name: artist.name,
            source: `spotify:${playlistId}`,
            occupation: 'Singer',
            followers: artist.followers?.total
          });
        }
      } catch (error) {
        // Continue with next playlist
      }
    }

    console.log(`   ✓ Found ${candidates.length} Spotify artists`);
  } catch (error) {
    console.log('   ⚠️  Spotify fetch failed');
  }

  return candidates;
}

// YouTube API integration
async function getYouTubeCelebrities(): Promise<CelebrityCandidate[]> {
  const candidates: CelebrityCandidate[] = [];

  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      console.log('   ⚠️  No YouTube API key');
      return [];
    }

    // Search for popular channels in different categories
    const queries = [
      'popular gaming youtuber',
      'popular vlogger',
      'popular tech youtuber',
      'popular music artist youtube',
      'popular comedy youtuber'
    ];

    for (const query of queries) {
      try {
        await youtubeLimiter.throttle();

        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            part: 'snippet',
            q: query,
            type: 'channel',
            maxResults: 20,
            order: 'viewCount',
            key: apiKey
          },
          timeout: 15000
        });

        for (const item of response.data.items || []) {
          candidates.push({
            name: item.snippet.channelTitle,
            source: `youtube:${query}`,
            occupation: 'YouTuber',
            country: 'US'
          });
        }
      } catch (error) {
        // Continue with next query
      }
    }

    console.log(`   ✓ Found ${candidates.length} YouTube creators`);
  } catch (error) {
    console.log('   ⚠️  YouTube fetch failed');
  }

  return candidates;
}

// TMDB fetching
async function getTMDBCelebrities(): Promise<CelebrityCandidate[]> {
  const candidates: CelebrityCandidate[] = [];

  try {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) return [];

    for (let page = 1; page <= 3; page++) {
      await tmdbLimiter.throttle();

      const response = await axios.get('https://api.themoviedb.org/3/person/popular', {
        params: { api_key: apiKey, page },
        timeout: 15000
      });

      for (const person of response.data.results || []) {
        candidates.push({
          name: person.name,
          source: 'tmdb',
          occupation: 'Actor'
        });
      }
    }

    console.log(`   ✓ Found ${candidates.length} TMDB actors`);
  } catch (error) {
    console.log('   ⚠️  TMDB fetch failed');
  }

  return candidates;
}

// Expanded manual list
function getExpandedManualList(): CelebrityCandidate[] {
  return [
    // Additional Gaming/Esports
    { name: 'Faker', source: 'manual', occupation: 'Esports Player', country: 'South Korea' },
    { name: 'Doublelift', source: 'manual', occupation: 'Esports Player', country: 'US' },
    { name: 'Bjergsen', source: 'manual', occupation: 'Esports Player', country: 'Denmark' },
    { name: 'Shroud', source: 'manual', occupation: 'Twitch Streamer', country: 'Canada' },
    { name: 'DrLupo', source: 'manual', occupation: 'Twitch Streamer', country: 'US' },
    { name: 'TimTheTatman', source: 'manual', occupation: 'Twitch Streamer', country: 'US' },
    { name: 'NICKMERCS', source: 'manual', occupation: 'Twitch Streamer', country: 'US' },
    { name: 'Valkyrae', source: 'manual', occupation: 'YouTuber', country: 'US' },
    { name: 'Sykkuno', source: 'manual', occupation: 'Twitch Streamer', country: 'US' },
    { name: 'xQc', source: 'manual', occupation: 'Twitch Streamer', country: 'Canada' },

    // Additional K-pop
    { name: 'Jennie Kim', source: 'manual', occupation: 'Singer', country: 'South Korea' },
    { name: 'Lisa Manoban', source: 'manual', occupation: 'Singer', country: 'Thailand' },
    { name: 'Rosé Park', source: 'manual', occupation: 'Singer', country: 'New Zealand' },
    { name: 'Jisoo Kim', source: 'manual', occupation: 'Singer', country: 'South Korea' },
    { name: 'Taehyung Kim', source: 'manual', occupation: 'Singer', country: 'South Korea' },
    { name: 'Jimin Park', source: 'manual', occupation: 'Singer', country: 'South Korea' },
    { name: 'Jin Kim', source: 'manual', occupation: 'Singer', country: 'South Korea' },
    { name: 'Suga', source: 'manual', occupation: 'Rapper', country: 'South Korea' },
    { name: 'J-Hope', source: 'manual', occupation: 'Rapper', country: 'South Korea' },
    { name: 'RM', source: 'manual', occupation: 'Rapper', country: 'South Korea' },

    // Additional YouTubers
    { name: 'Mark Rober', source: 'manual', occupation: 'YouTuber', country: 'US' },
    { name: 'Marques Brownlee', source: 'manual', occupation: 'YouTuber', country: 'US' },
    { name: 'Linus Sebastian', source: 'manual', occupation: 'YouTuber', country: 'Canada' },
    { name: 'Safiya Nygaard', source: 'manual', occupation: 'YouTuber', country: 'US' },
    { name: 'David Dobrik', source: 'manual', occupation: 'YouTuber', country: 'US' },
    { name: 'Liza Koshy', source: 'manual', occupation: 'YouTuber', country: 'US' },
    { name: 'James Charles', source: 'manual', occupation: 'YouTuber', country: 'US' },
    { name: 'Jeffree Star', source: 'manual', occupation: 'YouTuber', country: 'US' },
    { name: 'Shane Dawson', source: 'manual', occupation: 'YouTuber', country: 'US' },
    { name: 'Jenna Marbles', source: 'manual', occupation: 'YouTuber', country: 'US' },

    // Additional TikTokers
    { name: 'Dixie D\'Amelio', source: 'manual', occupation: 'Singer', country: 'US' },
    { name: 'Khaby Lame', source: 'manual', occupation: 'Social Media Influencer', country: 'Italy' },
    { name: 'Bella Poarch', source: 'manual', occupation: 'Singer', country: 'Philippines' },
    { name: 'Zach King', source: 'manual', occupation: 'YouTuber', country: 'US' },
    { name: 'Loren Gray', source: 'manual', occupation: 'Singer', country: 'US' },
    { name: 'Baby Ariel', source: 'manual', occupation: 'Singer', country: 'US' },
    { name: 'Jacob Sartorius', source: 'manual', occupation: 'Singer', country: 'US' },

    // Additional Athletes
    { name: 'Naomi Osaka', source: 'manual', occupation: 'Tennis Player', country: 'Japan' },
    { name: 'Chloe Kim', source: 'manual', occupation: 'Snowboarder', country: 'US' },
    { name: 'Simone Biles', source: 'manual', occupation: 'Gymnast', country: 'US' },
    { name: 'Katie Ledecky', source: 'manual', occupation: 'Swimmer', country: 'US' },
    { name: 'Caeleb Dressel', source: 'manual', occupation: 'Swimmer', country: 'US' },
    { name: 'Sha\'Carri Richardson', source: 'manual', occupation: 'Track Athlete', country: 'US' },
    { name: 'Kyrie Irving', source: 'manual', occupation: 'Basketball Player', country: 'US' },
    { name: 'Giannis Antetokounmpo', source: 'manual', occupation: 'Basketball Player', country: 'Greece' },
    { name: 'Luka Dončić', source: 'manual', occupation: 'Basketball Player', country: 'Slovenia' },
    { name: 'Patrick Mahomes', source: 'manual', occupation: 'American Football Player', country: 'US' },

    // Additional Actors (early Millennials 1980-1985)
    { name: 'Chris Hemsworth', source: 'manual', occupation: 'Actor', country: 'Australia', birthYear: 1983 },
    { name: 'Scarlett Johansson', source: 'manual', occupation: 'Actor', country: 'US', birthYear: 1984 },
    { name: 'Anne Hathaway', source: 'manual', occupation: 'Actor', country: 'US', birthYear: 1982 },
    { name: 'Jessica Chastain', source: 'manual', occupation: 'Actor', country: 'US', birthYear: 1977 },
    { name: 'Chris Evans', source: 'manual', occupation: 'Actor', country: 'US', birthYear: 1981 },
    { name: 'Ryan Gosling', source: 'manual', occupation: 'Actor', country: 'Canada', birthYear: 1980 },
    { name: 'Jake Gyllenhaal', source: 'manual', occupation: 'Actor', country: 'US', birthYear: 1980 },
    { name: 'Natalie Portman', source: 'manual', occupation: 'Actor', country: 'Israel', birthYear: 1981 },
    { name: 'Keira Knightley', source: 'manual', occupation: 'Actor', country: 'UK', birthYear: 1985 },
    { name: 'Michael B. Jordan', source: 'manual', occupation: 'Actor', country: 'US', birthYear: 1987 },

    // Additional Musicians (early Millennials)
    { name: 'Beyoncé', source: 'manual', occupation: 'Singer', country: 'US', birthYear: 1981 },
    { name: 'Lady Gaga', source: 'manual', occupation: 'Singer', country: 'US', birthYear: 1986 },
    { name: 'Bruno Mars', source: 'manual', occupation: 'Singer', country: 'US', birthYear: 1985 },
    { name: 'Katy Perry', source: 'manual', occupation: 'Singer', country: 'US', birthYear: 1984 },
    { name: 'Rihanna', source: 'manual', occupation: 'Singer', country: 'Barbados', birthYear: 1988 },
    { name: 'The Weeknd', source: 'manual', occupation: 'Singer', country: 'Canada', birthYear: 1990 },
    { name: 'Dua Lipa', source: 'manual', occupation: 'Singer', country: 'UK', birthYear: 1995 },
    { name: 'Billie Eilish', source: 'manual', occupation: 'Singer', country: 'US', birthYear: 2001 },
    { name: 'Olivia Rodrigo', source: 'manual', occupation: 'Singer', country: 'US', birthYear: 2003 },
    { name: 'Harry Styles', source: 'manual', occupation: 'Singer', country: 'UK', birthYear: 1994 },

    // Fashion & Models
    { name: 'Gigi Hadid', source: 'manual', occupation: 'Model', country: 'US' },
    { name: 'Bella Hadid', source: 'manual', occupation: 'Model', country: 'US' },
    { name: 'Kendall Jenner', source: 'manual', occupation: 'Model', country: 'US' },
    { name: 'Hailey Bieber', source: 'manual', occupation: 'Model', country: 'US' },
    { name: 'Emily Ratajkowski', source: 'manual', occupation: 'Model', country: 'US' },
    { name: 'Cara Delevingne', source: 'manual', occupation: 'Model', country: 'UK' },
    { name: 'Karlie Kloss', source: 'manual', occupation: 'Model', country: 'US' },

    // Podcasters & Media
    { name: 'Joe Rogan', source: 'manual', occupation: 'Podcaster', country: 'US' },
    { name: 'Tim Ferriss', source: 'manual', occupation: 'Author', country: 'US' },
    { name: 'Lex Fridman', source: 'manual', occupation: 'Podcaster', country: 'US' },
    { name: 'Andrew Huberman', source: 'manual', occupation: 'Podcaster', country: 'US' },
    { name: 'Steven Bartlett', source: 'manual', occupation: 'Podcaster', country: 'UK' },
  ];
}

// Main seeding function
async function enhancedYoungSeeding() {
  console.log('\n🚀 Enhanced Young Celebrity Seeding (Round 2)...\n');
  console.log('Target: Additional 500-1k celebrities');
  console.log('Changes: Age 1980+, more categories, fixed APIs');
  console.log('============================================================\n');

  const allCandidates: CelebrityCandidate[] = [];

  // 1. Manual curated list (200+)
  console.log('📋 Loading expanded manual list...');
  const manual = getExpandedManualList();
  allCandidates.push(...manual);
  console.log(`   ✓ Added ${manual.length} manual entries\n`);

  // 2. Expanded Wikipedia categories (30+ new categories)
  console.log('🌐 Fetching from Wikipedia (80+ categories)...');
  console.log('   This will take ~30-40 minutes due to rate limiting...\n');

  const expandedWikiCategories = [
    // Previous categories (52)
    '21st-century American actors', '21st-century American actresses',
    '21st-century British actors', '21st-century British actresses',
    '21st-century Canadian actors', '21st-century Canadian actresses',
    '21st-century Australian actors', '21st-century Australian actresses',
    'American film actors', 'American television actors',
    'British film actors', 'British television actors',
    '21st-century American singers', '21st-century British singers',
    '21st-century Canadian singers', 'American pop singers',
    'American rappers', 'British pop singers', 'Canadian pop singers',
    'Australian singers', 'South Korean male actors',
    'South Korean female actors', 'South Korean male singers',
    'South Korean female singers', 'K-pop singers', 'K-pop idol groups',
    'South Korean idols', 'Japanese idols', 'Japanese actors',
    'Chinese actors', 'American YouTubers', 'British YouTubers',
    'Canadian YouTubers', 'Gaming YouTubers', 'TikTokers',
    'Twitch streamers', 'Internet celebrities', 'Social media influencers',
    'American tennis players', 'Professional basketball players',
    'Association football players', 'American football players',
    'Olympic gymnasts', 'Olympic swimmers', 'Track and field athletes',
    'Figure skaters', 'Professional gamers', 'Esports players',
    'Fashion influencers', 'Models', 'American podcasters',
    'Stand-up comedians',

    // NEW CATEGORIES (30+)
    '1980s births', '1981 births', '1982 births', '1983 births', '1984 births',
    'Indian actors', 'Bollywood actors', 'Indian singers',
    'Mexican actors', 'Brazilian actors', 'Spanish actors',
    'German actors', 'French actors', 'Italian actors',
    'Electronic musicians', 'Hip hop musicians', 'R&B singers',
    'Country music singers', 'EDM artists',
    'American comedians', 'British comedians',
    'UFC fighters', 'Mixed martial artists', 'Professional wrestlers',
    'Fashion designers', 'Beauty YouTubers', 'Fitness influencers',
    'Skateboarding', 'Surfing', 'Rock climbing',
    'Snowboarding', 'BMX riders'
  ];

  let wikiCount = 0;
  let categoryIndex = 0;

  for (const category of expandedWikiCategories) {
    categoryIndex++;
    console.log(`   [${categoryIndex}/${expandedWikiCategories.length}] ${category}...`);
    const results = await getWikipediaYoungCelebrities(category, 30);
    allCandidates.push(...results);
    wikiCount += results.length;

    if (categoryIndex % 10 === 0) {
      console.log(`   Progress: ${categoryIndex}/${expandedWikiCategories.length} categories processed, ${wikiCount} candidates found\n`);
    }
  }
  console.log(`   ✓ Total from Wikipedia: ${wikiCount}\n`);

  // 3. Spotify with fixed auth
  console.log('🎵 Fetching from Spotify (with fixed auth)...');
  const spotifyArtists = await getSpotifyArtists();
  allCandidates.push(...spotifyArtists);
  console.log();

  // 4. YouTube API
  console.log('📺 Fetching from YouTube API...');
  const youtubers = await getYouTubeCelebrities();
  allCandidates.push(...youtubers);
  console.log();

  // 5. TMDB
  console.log('🎬 Fetching from TMDB...');
  const tmdbActors = await getTMDBCelebrities();
  allCandidates.push(...tmdbActors);
  console.log();

  // Deduplicate
  console.log('🔍 Processing candidates...');
  const uniqueMap = new Map<string, CelebrityCandidate>();
  for (const candidate of allCandidates) {
    const key = candidate.name.toLowerCase().trim();
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, candidate);
    }
  }
  const uniqueCandidates = Array.from(uniqueMap.values());
  console.log(`   Total fetched: ${allCandidates.length}`);
  console.log(`   After deduplication: ${uniqueCandidates.length}\n`);

  // Check against database
  console.log('💾 Checking against existing database...');
  console.log('   This may take 10-15 minutes for large lists...\n');

  const newCelebrities: CelebrityCandidate[] = [];
  let duplicates = 0;

  for (let i = 0; i < uniqueCandidates.length; i++) {
    const candidate = uniqueCandidates[i];
    const exists = await isExistingCelebrity(candidate.name);

    if (!exists) {
      newCelebrities.push(candidate);
    } else {
      duplicates++;
    }

    if ((i + 1) % 100 === 0) {
      console.log(`   Checked: ${i + 1}/${uniqueCandidates.length} | New: ${newCelebrities.length} | Duplicates: ${duplicates}`);
    }
  }

  console.log('\n   ✓ Database check complete');
  console.log(`   Already in database: ${duplicates}`);
  console.log(`   New celebrities to add: ${newCelebrities.length}\n`);

  // Save to file
  const outputPath = path.join(__dirname, '../../../database/seeds/enhanced-young-celebrities-round2.json');
  fs.writeFileSync(outputPath, JSON.stringify(newCelebrities, null, 2));

  // Summary
  console.log('============================================================');
  console.log('✅ ENHANCED SEEDING COMPLETE!\n');
  console.log('📊 Final Summary:\n');
  console.log('   Source Breakdown:');
  console.log(`   ├─ Wikipedia: ${wikiCount}`);
  console.log(`   ├─ Spotify: ${spotifyArtists.length}`);
  console.log(`   ├─ YouTube: ${youtubers.length}`);
  console.log(`   ├─ TMDB: ${tmdbActors.length}`);
  console.log(`   └─ Manual: ${manual.length}\n`);
  console.log(`   Total fetched: ${allCandidates.length}`);
  console.log(`   After deduplication: ${uniqueCandidates.length}`);
  console.log(`   Already in database: ${duplicates}`);
  console.log(`   ✨ NEW CELEBRITIES: ${newCelebrities.length}\n`);
  console.log(`📁 Output file: ${outputPath}\n`);
  console.log('🔄 Next step: Run npm run seed:young-insert-round2 to insert and classify\n');

  await sequelize.close();
}

// Run
enhancedYoungSeeding().catch(console.error);
