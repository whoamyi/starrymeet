/**
 * Pricing Service
 * Calculates popularity score and determines pricing tiers
 */

import { CelebrityCandidate, PriceTier } from '../types';
import { PRICING_WEIGHTS, PRICE_TIERS_MAPPING } from '../config';

/**
 * Normalize value using logarithmic scale
 */
function normalizeLog(value: number, max: number): number {
  if (value <= 0 || max <= 0) return 0;

  const normalized = Math.log10(value + 1) / Math.log10(max + 1);
  return Math.min(Math.max(normalized, 0), 1) * 100; // Scale to 0-100
}

/**
 * Calculate popularity score from various metrics
 */
export function calculatePopularityScore(candidate: Partial<CelebrityCandidate>): number {
  const metrics = {
    // Social followers (normalized to 100M max)
    socialFollowers: normalizeLog(
      candidate.social_followers || 0,
      100_000_000
    ),

    // Monthly listeners (normalized to 50M max)
    monthlyListeners: normalizeLog(
      candidate.monthly_listeners || 0,
      50_000_000
    ),

    // Monthly views (normalized to 1B max)
    monthlyViews: normalizeLog(
      candidate.monthly_views || 0,
      1_000_000_000
    ),

    // Box office (normalized to $2B max)
    boxOffice: normalizeLog(
      candidate.box_office_total || 0,
      2_000_000_000
    ),

    // Streaming views (normalized to 10B max)
    streamingViews: normalizeLog(
      candidate.streaming_views || 0,
      10_000_000_000
    ),

    // Awards (normalized to 50 max)
    awards: normalizeLog(
      candidate.awards_count || 0,
      50
    ),

    // Google Trends (already 0-100)
    googleTrends: candidate.google_trends_score || 0,

    // Media mentions (normalized to 10000 max)
    mediaMentions: normalizeLog(
      candidate.media_mentions || 0,
      10_000
    )
  };

  // Weighted sum
  const score =
    (metrics.socialFollowers * PRICING_WEIGHTS.socialFollowers) +
    (metrics.monthlyListeners * PRICING_WEIGHTS.monthlyListeners) +
    (metrics.monthlyViews * PRICING_WEIGHTS.monthlyViews) +
    (metrics.boxOffice * PRICING_WEIGHTS.boxOffice) +
    (metrics.streamingViews * PRICING_WEIGHTS.streamingViews) +
    (metrics.awards * PRICING_WEIGHTS.awards) +
    (metrics.googleTrends * PRICING_WEIGHTS.googleTrends) +
    (metrics.mediaMentions * PRICING_WEIGHTS.mediaMentions);

  return Math.min(Math.max(score, 0), 100); // Clamp to 0-100
}

/**
 * Get price tier from popularity score
 */
export function getPriceTier(popularityScore: number): {
  tier: PriceTier;
  basePrice: number;
} {
  for (const tierMapping of PRICE_TIERS_MAPPING) {
    if (popularityScore >= tierMapping.minScore) {
      return {
        tier: tierMapping.tier as PriceTier,
        basePrice: tierMapping.basePrice
      };
    }
  }

  // Default to Emerging
  return {
    tier: 'Emerging',
    basePrice: 100_00  // $100
  };
}

/**
 * Calculate rarity factor based on niche and uniqueness
 */
export function calculateRarityFactor(candidate: Partial<CelebrityCandidate>): number {
  let rarity = 1.0;

  // Rare professions get a boost
  const rareProfessions = ['Astronaut', 'Nobel Laureate', 'Olympic Gold Medalist'];
  if (rareProfessions.includes(candidate.professional_class || '')) {
    rarity *= 1.5;
  }

  // Multiple rare skills
  if ((candidate.industries?.length || 0) > 3) {
    rarity *= 1.2;
  }

  // Awards boost
  if ((candidate.awards_count || 0) > 10) {
    rarity *= 1.3;
  }

  return Math.min(rarity, 2.0); // Max 2x multiplier
}

/**
 * Calculate demand factor based on recent activity
 */
export function calculateDemandFactor(candidate: Partial<CelebrityCandidate>): number {
  let demand = 1.0;

  // Active status boost
  if (candidate.active_status === 'Active') {
    demand *= 1.2;
  } else if (candidate.active_status === 'Upcoming') {
    demand *= 1.5; // High demand for rising stars
  } else if (candidate.active_status === 'Retired') {
    demand *= 0.8;
  } else if (candidate.active_status === 'Legend') {
    demand *= 1.4;
  }

  // Social media engagement
  if ((candidate.social_followers || 0) > 10_000_000) {
    demand *= 1.3;
  }

  return Math.min(demand, 2.0); // Max 2x multiplier
}

/**
 * Calculate market multiplier based on geography
 */
export function calculateMarketMultiplier(candidate: Partial<CelebrityCandidate>): number {
  let multiplier = 1.0;

  // High-value markets
  const highValueMarkets = ['USA', 'UK', 'Japan', 'South Korea', 'UAE', 'Switzerland'];
  if (highValueMarkets.includes(candidate.country || '')) {
    multiplier *= 1.2;
  }

  // Major cities
  const majorCities = ['Los Angeles', 'New York', 'London', 'Tokyo', 'Seoul', 'Dubai'];
  if (majorCities.some(city => candidate.city?.includes(city))) {
    multiplier *= 1.15;
  }

  return Math.min(multiplier, 1.5); // Max 1.5x multiplier
}

/**
 * Calculate meeting complexity factor
 */
export function calculateMeetingComplexity(candidate: Partial<CelebrityCandidate>): number {
  let complexity = 1.0;

  // Security requirements increase cost
  if (candidate.security_requirements && candidate.security_requirements.length > 0) {
    complexity *= 1.2;
  }

  // NDA requirement
  if (candidate.nda_required) {
    complexity *= 1.1;
  }

  // Travel complexity
  if (candidate.travel_policy === 'no-travel') {
    complexity *= 0.9; // Easier to book
  } else if (candidate.travel_policy === 'buyer-pays') {
    complexity *= 1.0;
  } else if (candidate.travel_policy === 'negotiable') {
    complexity *= 1.2;
  }

  return Math.min(complexity, 1.5); // Max 1.5x multiplier
}

/**
 * Round price to nearest $50
 */
function roundToNearest50(cents: number): number {
  const dollars = cents / 100;
  const rounded = Math.round(dollars / 50) * 50;
  return rounded * 100; // Back to cents
}

/**
 * Calculate final price with all modifiers
 */
export function calculateFinalPrice(
  basePrice: number,
  rarity: number,
  demand: number,
  market: number,
  complexity: number
): number {
  const rawPrice = basePrice * rarity * demand * market * complexity;
  return roundToNearest50(rawPrice);
}

/**
 * Complete pricing calculation for a candidate
 */
export function calculatePricing(candidate: Partial<CelebrityCandidate>): {
  popularity_score: number;
  price_tier: PriceTier;
  base_price_cents: number;
  final_price_cents: number;
  rarity_factor: number;
  demand_factor: number;
  market_multiplier: number;
  meeting_complexity: number;
  pending_review: boolean;
} {
  // Calculate popularity score
  const popularityScore = calculatePopularityScore(candidate);

  // Get base tier and price
  const { tier, basePrice } = getPriceTier(popularityScore);

  // Calculate modifiers
  const rarityFactor = calculateRarityFactor(candidate);
  const demandFactor = calculateDemandFactor(candidate);
  const marketMultiplier = calculateMarketMultiplier(candidate);
  const meetingComplexity = calculateMeetingComplexity(candidate);

  // Calculate final price
  const finalPrice = calculateFinalPrice(
    basePrice,
    rarityFactor,
    demandFactor,
    marketMultiplier,
    meetingComplexity
  );

  // Flag for review if price is very high (top 500 will be > $25k)
  const pendingReview = finalPrice >= 25000_00; // $25k+

  return {
    popularity_score: Math.round(popularityScore * 100) / 100, // 2 decimal places
    price_tier: tier,
    base_price_cents: basePrice,
    final_price_cents: finalPrice,
    rarity_factor: Math.round(rarityFactor * 100) / 100,
    demand_factor: Math.round(demandFactor * 100) / 100,
    market_multiplier: Math.round(marketMultiplier * 100) / 100,
    meeting_complexity: Math.round(meetingComplexity * 100) / 100,
    pending_review: pendingReview
  };
}

export default {
  calculatePopularityScore,
  getPriceTier,
  calculateRarityFactor,
  calculateDemandFactor,
  calculateMarketMultiplier,
  calculateMeetingComplexity,
  calculateFinalPrice,
  calculatePricing
};
