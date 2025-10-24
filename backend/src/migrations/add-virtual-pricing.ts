/**
 * Migration: Add Virtual Meeting Pricing Fields
 * Adds separate pricing columns for virtual meetings
 */

import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  // Add virtual meeting price columns
  await queryInterface.addColumn('celebrities', 'virtual_quick_meet_price_cents', {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null
  });

  await queryInterface.addColumn('celebrities', 'virtual_standard_meet_price_cents', {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null
  });

  await queryInterface.addColumn('celebrities', 'virtual_premium_meet_price_cents', {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null
  });

  console.log('✅ Added virtual pricing columns');
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.removeColumn('celebrities', 'virtual_quick_meet_price_cents');
  await queryInterface.removeColumn('celebrities', 'virtual_standard_meet_price_cents');
  await queryInterface.removeColumn('celebrities', 'virtual_premium_meet_price_cents');

  console.log('✅ Removed virtual pricing columns');
}
