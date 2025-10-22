/**
 * TMDB (The Movie Database) Service
 * Fetches actor/director data, images, credits, and popularity metrics
 */

import axios from 'axios';
import { TMDBPerson } from '../types';
import { API_CONFIG } from '../config';

class RateLimiter {
  private queue: Array<() => void> = [];
  private lastCallTime = 0;
  private readonly minInterval: number;

  constructor(requestsPerSecond: number) {
    this.minInterval = 1000 / requestsPerSecond;
  }

  async throttle(): Promise<void> {
    return new Promise((resolve) => {
      const now = Date.now();
      const timeSinceLastCall = now - this.lastCallTime;

      if (timeSinceLastCall >= this.minInterval) {
        this.lastCallTime = now;
        resolve();
      } else {
        const delay = this.minInterval - timeSinceLastCall;
        setTimeout(() => {
          this.lastCallTime = Date.now();
          resolve();
        }, delay);
      }
    });
  }
}

const tmdbRateLimiter = new RateLimiter(API_CONFIG.tmdb.rateLimit);

/**
 * Search TMDB for person by name
 */
export async function searchPerson(name: string): Promise<TMDBPerson | null> {
  await tmdbRateLimiter.throttle();

  try {
    const response = await axios.get(`${API_CONFIG.tmdb.baseUrl}/search/person`, {
      params: {
        api_key: API_CONFIG.tmdb.apiKey,
        query: name,
        page: 1
      },
      timeout: 10000
    });

    const results = response.data.results || [];

    if (results.length === 0) {
      return null;
    }

    // Return most popular match
    return results[0];

  } catch (error: any) {
    console.error(`❌ TMDB search error for "${name}":`, error.message);
    return null;
  }
}

/**
 * Get person details by TMDB ID
 */
export async function getPersonDetails(tmdbId: number): Promise<TMDBPerson | null> {
  await tmdbRateLimiter.throttle();

  try {
    const response = await axios.get(`${API_CONFIG.tmdb.baseUrl}/person/${tmdbId}`, {
      params: {
        api_key: API_CONFIG.tmdb.apiKey,
        append_to_response: 'combined_credits,external_ids,images'
      },
      timeout: 10000
    });

    return response.data;

  } catch (error: any) {
    console.error(`❌ TMDB person details error for ID ${tmdbId}:`, error.message);
    return null;
  }
}

/**
 * Get person's movie/TV credits
 */
export async function getPersonCredits(tmdbId: number): Promise<any[]> {
  await tmdbRateLimiter.throttle();

  try {
    const response = await axios.get(`${API_CONFIG.tmdb.baseUrl}/person/${tmdbId}/combined_credits`, {
      params: {
        api_key: API_CONFIG.tmdb.apiKey
      },
      timeout: 10000
    });

    const cast = response.data.cast || [];
    const crew = response.data.crew || [];

    return [...cast, ...crew];

  } catch (error: any) {
    console.error(`❌ TMDB credits error for ID ${tmdbId}:`, error.message);
    return [];
  }
}

/**
 * Get profile image URL
 */
export function getImageUrl(path: string | null, size: 'w185' | 'h632' | 'original' = 'original'): string | null {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

/**
 * Calculate popularity metrics from TMDB data
 */
export function calculateTMDBMetrics(person: TMDBPerson, credits: any[]): {
  popularity: number;
  boxOfficeEstimate: number;
  knownFor: string[];
} {
  // TMDB popularity is 0-100+ scale
  const popularity = person.popularity || 0;

  // Estimate box office from high-rated, popular movies
  const topCredits = credits
    .filter((c: any) => c.vote_count > 100)
    .sort((a: any, b: any) => (b.vote_average * b.vote_count) - (a.vote_average * a.vote_count))
    .slice(0, 10);

  // Rough box office estimate (not accurate, just for scoring)
  const boxOfficeEstimate = topCredits.reduce((sum: number, credit: any) => {
    return sum + (credit.vote_count * credit.vote_average * 10000); // rough multiplier
  }, 0);

  // Known for (top titles)
  const knownFor = topCredits
    .slice(0, 5)
    .map((c: any) => c.title || c.name)
    .filter(Boolean);

  return {
    popularity,
    boxOfficeEstimate,
    knownFor
  };
}

/**
 * Enrich celebrity candidate with TMDB data
 */
export async function enrichWithTMDB(name: string, tmdbId?: number): Promise<{
  tmdbId?: number;
  bio?: string;
  imageUrl?: string;
  placeOfBirth?: string;
  birthday?: string;
  popularity: number;
  boxOfficeEstimate: number;
  knownFor: string[];
} | null> {
  try {
    let person: TMDBPerson | null = null;

    // Get person details
    if (tmdbId) {
      person = await getPersonDetails(tmdbId);
    } else {
      person = await searchPerson(name);
    }

    if (!person) {
      return null;
    }

    // Get credits
    const credits = await getPersonCredits(person.id);

    // Calculate metrics
    const metrics = calculateTMDBMetrics(person, credits);

    return {
      tmdbId: person.id,
      bio: person.biography || undefined,
      imageUrl: getImageUrl(person.profile_path) || undefined,
      placeOfBirth: person.place_of_birth || undefined,
      birthday: person.birthday || undefined,
      ...metrics
    };

  } catch (error: any) {
    console.error(`❌ TMDB enrichment error for "${name}":`, error.message);
    return null;
  }
}

export default {
  searchPerson,
  getPersonDetails,
  getPersonCredits,
  getImageUrl,
  calculateTMDBMetrics,
  enrichWithTMDB
};
