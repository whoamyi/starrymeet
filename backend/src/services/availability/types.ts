/**
 * Availability System Types
 */

export type CelebrityTier = 'S' | 'A' | 'B' | 'C' | 'D';
export type MeetingType = 'virtual' | 'physical';
export type MeetingDuration = 15 | 30 | 60;
export type AvailabilityStatus = 'active' | 'booked' | 'expired' | 'cancelled';

export interface TierConfiguration {
  tier: CelebrityTier;
  virtualSlotsPerMonth: { min: number; max: number };
  physicalSlotsPerMonth: { min: number; max: number };
  description: string;
}

export interface DurationWeight {
  duration: MeetingDuration;
  weight: number; // Percentage (e.g., 45 for 45%)
}

export interface CityPoolConfig {
  totalCountries: number;
  citiesPerCountry: { min: number; max: number };
  totalCityPool: { min: number; max: number };
}

export interface RotationConfig {
  physical: {
    daysPerRotation: { min: number; max: number };
    hoursStart: number;
    hoursEnd: number;
    citiesPerRotation: { min: number; max: number };
  };
  virtual: {
    daysPerRotation: { min: number; max: number };
    hoursStart: number;
    hoursEnd: number;
    citiesPerRotation: { min: number; max: number };
  };
}

export interface CooldownConfig {
  minMonths: number;
  maxMonths: number;
}

export interface AvailabilitySlot {
  id?: number;
  celebrity_id: string;
  meeting_type: MeetingType;
  duration: MeetingDuration;
  city: string;
  country: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
  timezone: string;
  slots_remaining: number;
  price_cents: number;
  tier: CelebrityTier;
  status: AvailabilityStatus;
  rotation_id: string;
  expires_at: string; // ISO date
  created_at?: string;
  updated_at?: string;
}

export interface CityCooldown {
  id?: number;
  celebrity_id: string;
  city: string;
  country: string;
  cooldown_start: string;
  cooldown_end: string;
  created_at?: string;
}

export interface CelebrityProfile {
  id: string;
  username: string;
  display_name: string;
  location: string; // Celebrity's home location
  tier: CelebrityTier;
  standard_meet_price_cents: number;
  quick_meet_price_cents?: number;
  premium_meet_price_cents?: number;
  virtual_quick_meet_price_cents?: number;
  virtual_standard_meet_price_cents?: number;
  virtual_premium_meet_price_cents?: number;
}

export interface CityCountry {
  city: string;
  country: string;
  timezone: string;
}

export interface GenerationResult {
  celebrity_id: string;
  celebrity_name: string;
  tier: CelebrityTier;
  meeting_type: MeetingType;
  slots_generated: number;
  slots_skipped: number;
  cities_used: number;
  cities_in_cooldown: number;
}

export interface BatchGenerationResult {
  total_celebrities_processed: number;
  total_slots_generated: number;
  total_slots_skipped: number;
  results_by_tier: Record<CelebrityTier, GenerationResult[]>;
  duration_seconds: number;
  errors: string[];
}
