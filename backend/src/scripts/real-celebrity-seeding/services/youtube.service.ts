/**
 * YouTube Service
 * Fetches creator data, subscriber counts, view metrics
 */

import axios from 'axios';
import { YouTubeChannel } from '../types';
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

const youtubeRateLimiter = new RateLimiter(API_CONFIG.youtube.rateLimit);

/**
 * Search for channel by name
 */
export async function searchChannel(name: string): Promise<YouTubeChannel | null> {
  await youtubeRateLimiter.throttle();

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: name,
        type: 'channel',
        maxResults: 1,
        key: API_CONFIG.youtube.apiKey
      },
      timeout: 10000
    });

    const items = response.data.items || [];

    if (items.length === 0) {
      return null;
    }

    const channelId = items[0].id.channelId;

    // Get full channel details
    return await getChannelDetails(channelId);

  } catch (error: any) {
    console.error(`❌ YouTube search error for "${name}":`, error.message);
    return null;
  }
}

/**
 * Get channel details by ID
 */
export async function getChannelDetails(channelId: string): Promise<YouTubeChannel | null> {
  await youtubeRateLimiter.throttle();

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
      params: {
        part: 'snippet,statistics,contentDetails',
        id: channelId,
        key: API_CONFIG.youtube.apiKey
      },
      timeout: 10000
    });

    const items = response.data.items || [];

    if (items.length === 0) {
      return null;
    }

    const channel = items[0];

    return {
      id: channel.id,
      title: channel.snippet.title,
      description: channel.snippet.description,
      subscriberCount: parseInt(channel.statistics.subscriberCount || '0'),
      viewCount: parseInt(channel.statistics.viewCount || '0'),
      videoCount: parseInt(channel.statistics.videoCount || '0'),
      thumbnails: channel.snippet.thumbnails
    };

  } catch (error: any) {
    console.error(`❌ YouTube channel details error for ID ${channelId}:`, error.message);
    return null;
  }
}

/**
 * Calculate monthly views estimate
 */
function estimateMonthlyViews(totalViews: number, videoCount: number): number {
  if (videoCount === 0) return 0;

  // Rough estimate: average views per video * videos uploaded per month
  const avgViewsPerVideo = totalViews / videoCount;
  const videosPerMonth = 4; // assume 1 video per week average

  return Math.round(avgViewsPerVideo * videosPerMonth);
}

/**
 * Enrich celebrity candidate with YouTube data
 */
export async function enrichWithYouTube(name: string, channelId?: string): Promise<{
  youtubeChannelId?: string;
  subscribers: number;
  totalViews: number;
  monthlyViews: number;
  videoCount: number;
  imageUrl?: string;
} | null> {
  try {
    let channel: YouTubeChannel | null = null;

    // Get channel
    if (channelId) {
      channel = await getChannelDetails(channelId);
    } else {
      channel = await searchChannel(name);
    }

    if (!channel) {
      return null;
    }

    return {
      youtubeChannelId: channel.id,
      subscribers: channel.subscriberCount,
      totalViews: channel.viewCount,
      monthlyViews: estimateMonthlyViews(channel.viewCount, channel.videoCount),
      videoCount: channel.videoCount,
      imageUrl: channel.thumbnails?.high?.url
    };

  } catch (error: any) {
    console.error(`❌ YouTube enrichment error for "${name}":`, error.message);
    return null;
  }
}

export default {
  searchChannel,
  getChannelDetails,
  enrichWithYouTube
};
