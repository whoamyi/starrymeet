/**
 * Migration: Add fame_tier column to celebrities table
 */

import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.addColumn('celebrities', 'fame_tier', {
    type: DataTypes.STRING(1),
    allowNull: true,
    comment: 'Fame tier: S (mega), A (elite), B (high), C (mid), D (emerging)'
  });

  console.log('✅ Added fame_tier column to celebrities table');
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.removeColumn('celebrities', 'fame_tier');
  console.log('✅ Removed fame_tier column from celebrities table');
}
