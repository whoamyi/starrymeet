/**
 * Availability System Configuration
 * Based on StarryMeet Availability Algorithm Specification
 */

import { TierConfiguration, DurationWeight, CityPoolConfig, RotationConfig, CooldownConfig, CityCountry } from './types';

/**
 * Tier-based slot capacity configuration
 */
export const TIER_CONFIG: Record<string, TierConfiguration> = {
  S: {
    tier: 'S',
    virtualSlotsPerMonth: { min: 1, max: 3 },
    physicalSlotsPerMonth: { min: 0, max: 1 },
    description: 'Ultra exclusive'
  },
  A: {
    tier: 'A',
    virtualSlotsPerMonth: { min: 3, max: 7 },
    physicalSlotsPerMonth: { min: 1, max: 2 },
    description: 'High tier'
  },
  B: {
    tier: 'B',
    virtualSlotsPerMonth: { min: 6, max: 12 },
    physicalSlotsPerMonth: { min: 1, max: 3 },
    description: 'Notable'
  },
  C: {
    tier: 'C',
    virtualSlotsPerMonth: { min: 10, max: 18 },
    physicalSlotsPerMonth: { min: 2, max: 4 },
    description: 'Popular'
  },
  D: {
    tier: 'D',
    virtualSlotsPerMonth: { min: 15, max: 25 },
    physicalSlotsPerMonth: { min: 3, max: 6 },
    description: 'Accessible'
  }
};

/**
 * Duration weights for slot distribution
 * 15min: 45%, 30min: 40%, 60min: 15%
 */
export const DURATION_WEIGHTS: DurationWeight[] = [
  { duration: 15, weight: 45 },
  { duration: 30, weight: 40 },
  { duration: 60, weight: 15 }
];

/**
 * City pool configuration
 */
export const CITY_POOL_CONFIG: CityPoolConfig = {
  totalCountries: 12,
  citiesPerCountry: { min: 3, max: 6 },
  totalCityPool: { min: 36, max: 72 }
};

/**
 * Rotation configuration
 */
export const ROTATION_CONFIG: RotationConfig = {
  physical: {
    daysPerRotation: { min: 7, max: 14 },
    hoursStart: 10, // 10am
    hoursEnd: 21,   // 9pm
    citiesPerRotation: { min: 1, max: 3 }
  },
  virtual: {
    daysPerRotation: { min: 3, max: 7 },
    hoursStart: 6,  // 6am
    hoursEnd: 23,   // 11pm
    citiesPerRotation: { min: 1, max: 3 }
  }
};

/**
 * Cooldown configuration (3-6 months)
 */
export const COOLDOWN_CONFIG: CooldownConfig = {
  minMonths: 3,
  maxMonths: 6
};

/**
 * Global city pool for availability
 * Organized by developed markets and relevant destinations
 */
export const GLOBAL_CITY_POOL: CityCountry[] = [
  // North America
  { city: 'New York', country: 'United States', timezone: 'America/New_York' },
  { city: 'Los Angeles', country: 'United States', timezone: 'America/Los_Angeles' },
  { city: 'Chicago', country: 'United States', timezone: 'America/Chicago' },
  { city: 'Miami', country: 'United States', timezone: 'America/New_York' },
  { city: 'San Francisco', country: 'United States', timezone: 'America/Los_Angeles' },
  { city: 'Las Vegas', country: 'United States', timezone: 'America/Los_Angeles' },
  { city: 'Toronto', country: 'Canada', timezone: 'America/Toronto' },
  { city: 'Vancouver', country: 'Canada', timezone: 'America/Vancouver' },
  { city: 'Montreal', country: 'Canada', timezone: 'America/Montreal' },

  // Europe
  { city: 'London', country: 'United Kingdom', timezone: 'Europe/London' },
  { city: 'Paris', country: 'France', timezone: 'Europe/Paris' },
  { city: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin' },
  { city: 'Munich', country: 'Germany', timezone: 'Europe/Berlin' },
  { city: 'Rome', country: 'Italy', timezone: 'Europe/Rome' },
  { city: 'Milan', country: 'Italy', timezone: 'Europe/Rome' },
  { city: 'Madrid', country: 'Spain', timezone: 'Europe/Madrid' },
  { city: 'Barcelona', country: 'Spain', timezone: 'Europe/Madrid' },
  { city: 'Amsterdam', country: 'Netherlands', timezone: 'Europe/Amsterdam' },
  { city: 'Brussels', country: 'Belgium', timezone: 'Europe/Brussels' },
  { city: 'Vienna', country: 'Austria', timezone: 'Europe/Vienna' },
  { city: 'Zurich', country: 'Switzerland', timezone: 'Europe/Zurich' },
  { city: 'Stockholm', country: 'Sweden', timezone: 'Europe/Stockholm' },
  { city: 'Copenhagen', country: 'Denmark', timezone: 'Europe/Copenhagen' },
  { city: 'Oslo', country: 'Norway', timezone: 'Europe/Oslo' },
  { city: 'Dublin', country: 'Ireland', timezone: 'Europe/Dublin' },
  { city: 'Lisbon', country: 'Portugal', timezone: 'Europe/Lisbon' },
  { city: 'Athens', country: 'Greece', timezone: 'Europe/Athens' },
  { city: 'Prague', country: 'Czech Republic', timezone: 'Europe/Prague' },
  { city: 'Warsaw', country: 'Poland', timezone: 'Europe/Warsaw' },

  // Asia-Pacific
  { city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo' },
  { city: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul' },
  { city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore' },
  { city: 'Hong Kong', country: 'Hong Kong', timezone: 'Asia/Hong_Kong' },
  { city: 'Shanghai', country: 'China', timezone: 'Asia/Shanghai' },
  { city: 'Beijing', country: 'China', timezone: 'Asia/Shanghai' },
  { city: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok' },
  { city: 'Kuala Lumpur', country: 'Malaysia', timezone: 'Asia/Kuala_Lumpur' },
  { city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney' },
  { city: 'Melbourne', country: 'Australia', timezone: 'Australia/Melbourne' },
  { city: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland' },
  { city: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata' },
  { city: 'Dubai', country: 'United Arab Emirates', timezone: 'Asia/Dubai' },

  // Middle East
  { city: 'Tel Aviv', country: 'Israel', timezone: 'Asia/Jerusalem' },
  { city: 'Doha', country: 'Qatar', timezone: 'Asia/Qatar' },
  { city: 'Abu Dhabi', country: 'United Arab Emirates', timezone: 'Asia/Dubai' },

  // Latin America
  { city: 'Mexico City', country: 'Mexico', timezone: 'America/Mexico_City' },
  { city: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo' },
  { city: 'Rio de Janeiro', country: 'Brazil', timezone: 'America/Sao_Paulo' },
  { city: 'Buenos Aires', country: 'Argentina', timezone: 'America/Argentina/Buenos_Aires' },
  { city: 'Santiago', country: 'Chile', timezone: 'America/Santiago' },
  { city: 'Bogotá', country: 'Colombia', timezone: 'America/Bogota' },

  // Africa
  { city: 'Cape Town', country: 'South Africa', timezone: 'Africa/Johannesburg' },
  { city: 'Johannesburg', country: 'South Africa', timezone: 'Africa/Johannesburg' },
  { city: 'Nairobi', country: 'Kenya', timezone: 'Africa/Nairobi' },
  { city: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo' },
  { city: 'Marrakech', country: 'Morocco', timezone: 'Africa/Casablanca' }
];

/**
 * Probability of leaving slots unassigned (for exclusivity)
 * Higher tier = higher probability
 */
export const UNASSIGNED_PROBABILITY: Record<string, number> = {
  S: 0.40, // 40% chance slots remain unassigned
  A: 0.30, // 30%
  B: 0.20, // 20%
  C: 0.10, // 10%
  D: 0.05  // 5%
};

/**
 * Batch processing configuration
 */
export const BATCH_CONFIG = {
  celebritiesPerBatch: 50,
  delayBetweenBatchesMs: 1000, // 1 second delay to avoid DB overload
  maxRetries: 3
};
