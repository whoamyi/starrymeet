/**
 * Category Controller
 * Handles category listing for browse filters
 */

import { Request, Response } from 'express';
import sequelize from '../config/database';
import { QueryTypes } from 'sequelize';

/**
 * GET /api/categories
 * Returns all active categories
 */
export const getCategories = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT
        id,
        name,
        slug,
        description
      FROM categories
      WHERE active = true
      ORDER BY name ASC
    `;

    const categories = await sequelize.query(query, {
      type: QueryTypes.SELECT
    });

    res.json({
      success: true,
      data: categories
    });

  } catch (error: any) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
