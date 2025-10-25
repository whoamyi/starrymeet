/**
 * Celebrity Availability Service
 * Implements tier-based, rotation-based availability generation
 */

import sequelize from '../../config/database';
import { QueryTypes } from 'sequelize';
import {
  CelebrityTier,
  MeetingType,
  MeetingDuration,
  AvailabilitySlot,
  CityCooldown,
  CelebrityProfile,
  CityCountry,
  GenerationResult
} from './types';
import {
  TIER_CONFIG,
  DURATION_WEIGHTS,
  ROTATION_CONFIG,
  COOLDOWN_CONFIG,
  GLOBAL_CITY_POOL,
  UNASSIGNED_PROBABILITY
} from './config';

export class AvailabilityService {
  /**
   * Determine celebrity tier based on pricing
   */
  static determineTier(celebrity: CelebrityProfile): CelebrityTier {
    const standardPrice = celebrity.standard_meet_price_cents || 0;

    // Tier thresholds based on physical standard meet price
    if (standardPrice >= 50000000) return 'S';  // $500k+
    if (standardPrice >= 10000000) return 'A';  // $100k+
    if (standardPrice >= 2000000) return 'B';   // $20k+
    if (standardPrice >= 500000) return 'C';    // $5k+
    return 'D';                                  // < $5k
  }

  /**
   * Get celebrity's home country from location
   */
  static getHomeCountry(location: string): string {
    if (!location) return '';
    const parts = location.split(',').map(p => p.trim());
    return parts[parts.length - 1]; // Last part is typically country
  }

  /**
   * Get eligible cities for celebrity (excluding home country)
   */
  static getEligibleCities(celebrity: CelebrityProfile): CityCountry[] {
    const homeCountry = this.getHomeCountry(celebrity.location);

    return GLOBAL_CITY_POOL.filter(city =>
      city.country.toLowerCase() !== homeCountry.toLowerCase()
    );
  }

  /**
   * Get cities currently in cooldown for celebrity
   */
  static async getCitiesInCooldown(celebrityId: string): Promise<Set<string>> {
    const now = new Date();

    const cooldowns = await sequelize.query(`
      SELECT city, country
      FROM city_cooldown
      WHERE celebrity_id = :celebrityId
        AND cooldown_end > :now
    `, {
      replacements: { celebrityId, now: now.toISOString() },
      type: QueryTypes.SELECT
    }) as CityCooldown[];

    return new Set(cooldowns.map(c => `${c.city}, ${c.country}`));
  }

  /**
   * Get available cities (eligible minus cooldown)
   */
  static async getAvailableCities(celebrity: CelebrityProfile): Promise<CityCountry[]> {
    const eligibleCities = this.getEligibleCities(celebrity);
    const cooldownCities = await this.getCitiesInCooldown(celebrity.id);

    return eligibleCities.filter(city =>
      !cooldownCities.has(`${city.city}, ${city.country}`)
    );
  }

  /**
   * Randomly select duration based on weighted distribution
   */
  static selectDuration(): MeetingDuration {
    const random = Math.random() * 100;
    let cumulative = 0;

    for (const { duration, weight } of DURATION_WEIGHTS) {
      cumulative += weight;
      if (random <= cumulative) {
        return duration;
      }
    }

    return 30; // Default fallback
  }

  /**
   * Select N random cities from available pool
   */
  static selectRandomCities(availableCities: CityCountry[], count: number): CityCountry[] {
    const shuffled = [...availableCities].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, availableCities.length));
  }

  /**
   * Generate random date within rotation window
   */
  static generateRandomDate(meetingType: MeetingType): Date {
    const config = ROTATION_CONFIG[meetingType];
    const daysRange = config.daysPerRotation.max - config.daysPerRotation.min;
    const randomDays = config.daysPerRotation.min + Math.floor(Math.random() * daysRange);

    const date = new Date();
    date.setDate(date.getDate() + randomDays);
    date.setHours(0, 0, 0, 0); // Reset to midnight

    return date;
  }

  /**
   * Generate random time within realistic hours
   */
  static generateRandomTime(meetingType: MeetingType): string {
    const config = ROTATION_CONFIG[meetingType];
    const hourRange = config.hoursEnd - config.hoursStart;
    const randomHour = config.hoursStart + Math.floor(Math.random() * hourRange);
    const randomMinute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45

    return `${String(randomHour).padStart(2, '0')}:${String(randomMinute).padStart(2, '0')}:00`;
  }

  /**
   * Check if slot time collides with existing slots
   */
  static async hasTimeCollision(
    celebrityId: string,
    date: Date,
    time: string,
    duration: MeetingDuration
  ): Promise<boolean> {
    const dateStr = date.toISOString().split('T')[0];

    // Parse time and calculate end time
    const [hours, minutes] = time.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + duration;

    // Check for overlapping slots
    const existing = await sequelize.query(`
      SELECT time, duration
      FROM availability
      WHERE celebrity_id = :celebrityId
        AND date = :date
        AND status = 'active'
    `, {
      replacements: { celebrityId, date: dateStr },
      type: QueryTypes.SELECT
    }) as AvailabilitySlot[];

    for (const slot of existing) {
      const [slotHours, slotMinutes] = slot.time.split(':').map(Number);
      const slotStart = slotHours * 60 + slotMinutes;
      const slotEnd = slotStart + slot.duration;

      // Check for overlap
      if (
        (startMinutes >= slotStart && startMinutes < slotEnd) ||
        (endMinutes > slotStart && endMinutes <= slotEnd) ||
        (startMinutes <= slotStart && endMinutes >= slotEnd)
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get price for specific meeting type and duration
   */
  static getPrice(celebrity: CelebrityProfile, meetingType: MeetingType, duration: MeetingDuration): number {
    if (meetingType === 'virtual') {
      if (duration === 15) return celebrity.virtual_quick_meet_price_cents || 0;
      if (duration === 30) return celebrity.virtual_standard_meet_price_cents || 0;
      if (duration === 60) return celebrity.virtual_premium_meet_price_cents || 0;
    } else {
      if (duration === 15) return celebrity.quick_meet_price_cents || 0;
      if (duration === 30) return celebrity.standard_meet_price_cents || 0;
      if (duration === 60) return celebrity.premium_meet_price_cents || 0;
    }
    return celebrity.standard_meet_price_cents || 0;
  }

  /**
   * Generate rotation ID for grouping
   */
  static generateRotationId(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const week = Math.ceil(now.getDate() / 7);
    return `${year}-${month}-W${week}`;
  }

  /**
   * Calculate expiration date for slot
   */
  static calculateExpiration(date: Date): Date {
    const expiration = new Date(date);
    expiration.setDate(expiration.getDate() + 1); // Expires day after meeting date
    return expiration;
  }

  /**
   * Generate availability slots for a single celebrity and meeting type
   */
  static async generateSlotsForCelebrity(
    celebrity: CelebrityProfile,
    meetingType: MeetingType,
    tier: CelebrityTier
  ): Promise<GenerationResult> {
    const result: GenerationResult = {
      celebrity_id: celebrity.id,
      celebrity_name: celebrity.display_name,
      tier,
      meeting_type: meetingType,
      slots_generated: 0,
      slots_skipped: 0,
      cities_used: 0,
      cities_in_cooldown: 0
    };

    try {
      // Get tier configuration
      const tierConfig = TIER_CONFIG[tier];
      const slotsConfig = meetingType === 'virtual'
        ? tierConfig.virtualSlotsPerMonth
        : tierConfig.physicalSlotsPerMonth;

      // Determine number of slots to generate (random within range)
      const maxSlots = slotsConfig.min + Math.floor(Math.random() * (slotsConfig.max - slotsConfig.min + 1));

      // Apply unassigned probability (some slots intentionally not created)
      const unassignedProb = UNASSIGNED_PROBABILITY[tier] || 0;
      const actualSlots = Math.floor(maxSlots * (1 - unassignedProb * Math.random()));

      if (actualSlots === 0) {
        result.slots_skipped = maxSlots;
        return result;
      }

      // Get available cities
      const availableCities = await this.getAvailableCities(celebrity);
      result.cities_in_cooldown = this.getEligibleCities(celebrity).length - availableCities.length;

      if (availableCities.length === 0) {
        result.slots_skipped = actualSlots;
        return result;
      }

      // Select cities for this rotation
      const rotationConfig = ROTATION_CONFIG[meetingType];
      const numCities = Math.min(
        actualSlots,
        rotationConfig.citiesPerRotation.min + Math.floor(
          Math.random() * (rotationConfig.citiesPerRotation.max - rotationConfig.citiesPerRotation.min + 1)
        )
      );

      const selectedCities = this.selectRandomCities(availableCities, numCities);
      result.cities_used = selectedCities.length;

      // Generate slots
      const rotationId = this.generateRotationId();
      const slots: AvailabilitySlot[] = [];
      const citiesToCooldown: CityCountry[] = [];

      for (let i = 0; i < actualSlots; i++) {
        const city = selectedCities[i % selectedCities.length]; // Distribute across selected cities
        const duration = this.selectDuration();
        const date = this.generateRandomDate(meetingType);
        const time = this.generateRandomTime(meetingType);

        // Check for collision
        const hasCollision = await this.hasTimeCollision(celebrity.id, date, time, duration);
        if (hasCollision) {
          result.slots_skipped++;
          continue;
        }

        const price = this.getPrice(celebrity, meetingType, duration);
        const expires_at = this.calculateExpiration(date);

        const slot: AvailabilitySlot = {
          celebrity_id: celebrity.id,
          meeting_type: meetingType,
          duration,
          city: city.city,
          country: city.country,
          date: date.toISOString().split('T')[0],
          time,
          timezone: city.timezone,
          slots_remaining: 1,
          price_cents: price,
          tier,
          status: 'active',
          rotation_id: rotationId,
          expires_at: expires_at.toISOString()
        };

        slots.push(slot);

        // Mark city for cooldown
        if (!citiesToCooldown.find(c => c.city === city.city && c.country === city.country)) {
          citiesToCooldown.push(city);
        }
      }

      // Insert slots into database
      if (slots.length > 0) {
        await this.insertSlots(slots);
        result.slots_generated = slots.length;

        // Add cities to cooldown
        await this.addCitiesToCooldown(celebrity.id, citiesToCooldown);
      }

    } catch (error: any) {
      console.error(`Error generating slots for ${celebrity.display_name}:`, error.message);
      throw error;
    }

    return result;
  }

  /**
   * Insert availability slots into database
   */
  static async insertSlots(slots: AvailabilitySlot[]): Promise<void> {
    const values = slots.map(slot => `(
      '${slot.celebrity_id}',
      '${slot.meeting_type}',
      ${slot.duration},
      '${slot.city}',
      '${slot.country}',
      '${slot.date}',
      '${slot.time}',
      '${slot.timezone}',
      ${slot.slots_remaining},
      ${slot.price_cents},
      '${slot.tier}',
      '${slot.status}',
      '${slot.rotation_id}',
      '${slot.expires_at}'
    )`).join(',');

    await sequelize.query(`
      INSERT INTO availability (
        celebrity_id, meeting_type, duration, city, country, date, time,
        timezone, slots_remaining, price_cents, tier, status, rotation_id, expires_at
      ) VALUES ${values}
      ON CONFLICT (celebrity_id, date, time, meeting_type) DO NOTHING
    `);
  }

  /**
   * Add cities to cooldown table
   */
  static async addCitiesToCooldown(celebrityId: string, cities: CityCountry[]): Promise<void> {
    if (cities.length === 0) return;

    const now = new Date();
    const cooldownMonths = COOLDOWN_CONFIG.minMonths +
      Math.floor(Math.random() * (COOLDOWN_CONFIG.maxMonths - COOLDOWN_CONFIG.minMonths + 1));

    const cooldownEnd = new Date(now);
    cooldownEnd.setMonth(cooldownEnd.getMonth() + cooldownMonths);

    const values = cities.map(city => `(
      '${celebrityId}',
      '${city.city}',
      '${city.country}',
      '${now.toISOString()}',
      '${cooldownEnd.toISOString()}'
    )`).join(',');

    await sequelize.query(`
      INSERT INTO city_cooldown (celebrity_id, city, country, cooldown_start, cooldown_end)
      VALUES ${values}
      ON CONFLICT (celebrity_id, city, country)
      DO UPDATE SET cooldown_end = EXCLUDED.cooldown_end
    `);
  }

  /**
   * Expire old availability slots
   */
  static async expireOldSlots(): Promise<number> {
    const now = new Date();

    const result = await sequelize.query(`
      UPDATE availability
      SET status = 'expired'
      WHERE status = 'active'
        AND expires_at < :now
    `, {
      replacements: { now: now.toISOString() }
    });

    return (result[1] as any)?.rowCount || 0;
  }

  /**
   * Clean up expired cooldowns
   */
  static async cleanupExpiredCooldowns(): Promise<number> {
    const now = new Date();

    const result = await sequelize.query(`
      DELETE FROM city_cooldown
      WHERE cooldown_end < :now
    `, {
      replacements: { now: now.toISOString() }
    });

    return (result[1] as any)?.rowCount || 0;
  }
}
