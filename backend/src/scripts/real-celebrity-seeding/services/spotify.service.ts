/**
 * Spotify Service
 * Fetches musician data, follower counts, popularity metrics
 */

import axios from 'axios';
import { SpotifyArtist } from '../types';
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

const spotifyRateLimiter = new RateLimiter(API_CONFIG.spotify.rateLimit);

let accessToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Get Spotify access token using Client Credentials flow
 */
async function getAccessToken(): Promise<string> {
  // Return cached token if still valid
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    const credentials = Buffer.from(
      `${API_CONFIG.spotify.clientId}:${API_CONFIG.spotify.clientSecret}`
    ).toString('base64');

    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000; // 1 min buffer

    return accessToken;

  } catch (error: any) {
    console.error('❌ Spotify auth error:', error.message);
    throw error;
  }
}

/**
 * Search for artist by name
 */
export async function searchArtist(name: string): Promise<SpotifyArtist | null> {
  await spotifyRateLimiter.throttle();

  try {
    const token = await getAccessToken();

    const response = await axios.get('https://api.spotify.com/v1/search', {
      params: {
        q: name,
        type: 'artist',
        limit: 1
      },
      headers: {
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000
    });

    const artists = response.data.artists?.items || [];

    if (artists.length === 0) {
      return null;
    }

    return artists[0];

  } catch (error: any) {
    console.error(`❌ Spotify search error for "${name}":`, error.message);
    return null;
  }
}

/**
 * Get artist by Spotify ID
 */
export async function getArtist(spotifyId: string): Promise<SpotifyArtist | null> {
  await spotifyRateLimiter.throttle();

  try {
    const token = await getAccessToken();

    const response = await axios.get(`https://api.spotify.com/v1/artists/${spotifyId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000
    });

    return response.data;

  } catch (error: any) {
    console.error(`❌ Spotify artist error for ID ${spotifyId}:`, error.message);
    return null;
  }
}

/**
 * Get artist's top tracks
 */
export async function getArtistTopTracks(spotifyId: string): Promise<any[]> {
  await spotifyRateLimiter.throttle();

  try {
    const token = await getAccessToken();

    const response = await axios.get(`https://api.spotify.com/v1/artists/${spotifyId}/top-tracks`, {
      params: {
        market: 'US'
      },
      headers: {
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000
    });

    return response.data.tracks || [];

  } catch (error: any) {
    console.error(`❌ Spotify top tracks error:`, error.message);
    return [];
  }
}

/**
 * Calculate monthly listeners estimate from followers and popularity
 */
function estimateMonthlyListeners(followers: number, popularity: number): number {
  // Rough estimate: followers * engagement rate * popularity factor
  const engagementRate = 0.3; // 30% of followers listen monthly
  const popularityMultiplier = popularity / 50; // 0-2x multiplier

  return Math.round(followers * engagementRate * popularityMultiplier);
}

/**
 * Enrich celebrity candidate with Spotify data
 */
export async function enrichWithSpotify(name: string, spotifyId?: string): Promise<{
  spotifyId?: string;
  followers: number;
  monthlyListeners: number;
  popularity: number;
  genres: string[];
  imageUrl?: string;
  topTracks: string[];
} | null> {
  try {
    let artist: SpotifyArtist | null = null;

    // Get artist
    if (spotifyId) {
      artist = await getArtist(spotifyId);
    } else {
      artist = await searchArtist(name);
    }

    if (!artist) {
      return null;
    }

    // Get top tracks
    const topTracks = await getArtistTopTracks(artist.id);

    return {
      spotifyId: artist.id,
      followers: artist.followers?.total || 0,
      monthlyListeners: estimateMonthlyListeners(
        artist.followers?.total || 0,
        artist.popularity || 0
      ),
      popularity: artist.popularity || 0,
      genres: artist.genres || [],
      imageUrl: artist.images?.[0]?.url,
      topTracks: topTracks.slice(0, 5).map(t => t.name)
    };

  } catch (error: any) {
    console.error(`❌ Spotify enrichment error for "${name}":`, error.message);
    return null;
  }
}

export default {
  searchArtist,
  getArtist,
  getArtistTopTracks,
  enrichWithSpotify
};
