/**
 * Availability Cleanup Service
 * Automated service for expiring old slots and cleaning cooldowns
 * Should be run via cron job (e.g., daily)
 */

import sequelize from '../../config/database';
import { AvailabilityService } from './availability.service';

export class CleanupService {
  /**
   * Run full cleanup process
   */
  static async runCleanup(): Promise<{
    expired_slots: number;
    removed_cooldowns: number;
    duration_ms: number;
  }> {
    const startTime = Date.now();

    console.log('🧹 Starting availability cleanup...\n');

    try {
      await sequelize.authenticate();

      // Expire old slots
      console.log('⏰ Expiring old availability slots...');
      const expiredSlots = await AvailabilityService.expireOldSlots();
      console.log(`✅ Expired ${expiredSlots} slots\n`);

      // Clean up expired cooldowns
      console.log('🔄 Removing expired cooldowns...');
      const removedCooldowns = await AvailabilityService.cleanupExpiredCooldowns();
      console.log(`✅ Removed ${removedCooldowns} cooldowns\n`);

      // Archive old expired slots (optional - move to archive table)
      console.log('📦 Archiving expired slots older than 30 days...');
      const archivedCount = await this.archiveOldSlots();
      console.log(`✅ Archived ${archivedCount} slots\n`);

      const duration = Date.now() - startTime;

      console.log('✅ Cleanup complete!');
      console.log(`⏱️  Duration: ${duration}ms\n`);

      return {
        expired_slots: expiredSlots,
        removed_cooldowns: removedCooldowns,
        duration_ms: duration
      };

    } catch (error: any) {
      console.error('❌ Cleanup error:', error.message);
      throw error;
    }
  }

  /**
   * Archive slots that have been expired for over 30 days
   * (Optional - helps keep availability table performant)
   */
  static async archiveOldSlots(): Promise<number> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await sequelize.query(`
      DELETE FROM availability
      WHERE status = 'expired'
        AND expires_at < :thirtyDaysAgo
    `, {
      replacements: { thirtyDaysAgo: thirtyDaysAgo.toISOString() }
    });

    return (result[1] as any)?.rowCount || 0;
  }

  /**
   * Get cleanup statistics
   */
  static async getStats(): Promise<{
    active_slots: number;
    expired_slots: number;
    booked_slots: number;
    active_cooldowns: number;
  }> {
    const now = new Date();

    const [slotsStats] = await sequelize.query(`
      SELECT
        COUNT(*) FILTER (WHERE status = 'active') as active_slots,
        COUNT(*) FILTER (WHERE status = 'expired') as expired_slots,
        COUNT(*) FILTER (WHERE status = 'booked') as booked_slots
      FROM availability
    `, { type: 'SELECT' }) as any[];

    const [cooldownStats] = await sequelize.query(`
      SELECT COUNT(*) as active_cooldowns
      FROM city_cooldown
      WHERE cooldown_end > :now
    `, {
      replacements: { now: now.toISOString() },
      type: 'SELECT'
    }) as any[];

    return {
      active_slots: Number(slotsStats.active_slots || 0),
      expired_slots: Number(slotsStats.expired_slots || 0),
      booked_slots: Number(slotsStats.booked_slots || 0),
      active_cooldowns: Number(cooldownStats.active_cooldowns || 0)
    };
  }
}

// Run if executed directly
if (require.main === module) {
  CleanupService.runCleanup()
    .then(async () => {
      console.log('📊 Current statistics:');
      const stats = await CleanupService.getStats();
      console.log(`  Active slots: ${stats.active_slots}`);
      console.log(`  Expired slots: ${stats.expired_slots}`);
      console.log(`  Booked slots: ${stats.booked_slots}`);
      console.log(`  Active cooldowns: ${stats.active_cooldowns}\n`);
      await sequelize.close();
      process.exit(0);
    })
    .catch(async (error) => {
      console.error(error);
      await sequelize.close();
      process.exit(1);
    });
}

export default CleanupService;
