/**
 * Migration: Add Celebrity Metrics Fields
 * Adds popularity/pricing metric fields to celebrities table
 */

import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.addColumn('celebrities', 'social_followers', {
    type: DataTypes.BIGINT,
    allowNull: true,
    defaultValue: null
  });

  await queryInterface.addColumn('celebrities', 'monthly_listeners', {
    type: DataTypes.BIGINT,
    allowNull: true,
    defaultValue: null
  });

  await queryInterface.addColumn('celebrities', 'monthly_views', {
    type: DataTypes.BIGINT,
    allowNull: true,
    defaultValue: null
  });

  await queryInterface.addColumn('celebrities', 'box_office_total', {
    type: DataTypes.BIGINT,
    allowNull: true,
    defaultValue: null
  });

  await queryInterface.addColumn('celebrities', 'streaming_views', {
    type: DataTypes.BIGINT,
    allowNull: true,
    defaultValue: null
  });

  await queryInterface.addColumn('celebrities', 'awards_count', {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  });

  await queryInterface.addColumn('celebrities', 'popularity_score', {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: 0
  });

  console.log('✅ Added celebrity metrics columns');
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.removeColumn('celebrities', 'social_followers');
  await queryInterface.removeColumn('celebrities', 'monthly_listeners');
  await queryInterface.removeColumn('celebrities', 'monthly_views');
  await queryInterface.removeColumn('celebrities', 'box_office_total');
  await queryInterface.removeColumn('celebrities', 'streaming_views');
  await queryInterface.removeColumn('celebrities', 'awards_count');
  await queryInterface.removeColumn('celebrities', 'popularity_score');

  console.log('✅ Removed celebrity metrics columns');
}
