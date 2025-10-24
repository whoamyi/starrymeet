/**
 * Celebrity Profile Controller
 * Handles celebrity cards (browse) and full profiles
 * Uses celebrities_new table with proper joins
 */

import { Request, Response } from 'express';
import sequelize from '../config/database';
import { QueryTypes } from 'sequelize';

/**
 * GET /api/celebrities
 * Returns minimal data for celebrity cards in browse grid
 * Supports pagination, filtering, and search
 */
export const getCelebrityCards = async (req: Request, res: Response) => {
  try {
    const {
      category,
      search,
      tier,
      minPrice,
      maxPrice,
      verified,
      limit = 24,
      offset = 0,
      sortBy = 'name' // name, price, rating
    } = req.query;

    // Build WHERE clause
    const conditions: string[] = ['c.status = \'active\''];
    const replacements: any = {
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    };

    if (category) {
      conditions.push('cat.name ILIKE :category');
      replacements.category = `%${category}%`;
    }

    if (search) {
      conditions.push('(c.name ILIKE :search OR c.bio ILIKE :search)');
      replacements.search = `%${search}%`;
    }

    if (tier) {
      conditions.push('cs.tier = :tier');
      replacements.tier = tier;
    }

    if (minPrice) {
      conditions.push('c.min_price >= :minPrice');
      replacements.minPrice = parseFloat(minPrice as string);
    }

    if (maxPrice) {
      conditions.push('c.min_price <= :maxPrice');
      replacements.maxPrice = parseFloat(maxPrice as string);
    }

    if (verified === 'true') {
      conditions.push('c.verified = true');
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Build ORDER BY clause
    let orderBy = 'c.name ASC';
    if (sortBy === 'price') {
      orderBy = 'c.min_price ASC';
    } else if (sortBy === 'rating') {
      orderBy = 'c.review_rate DESC, c.review_count DESC';
    }

    // Query for cards data
    const cardsQuery = `
      SELECT
        c.id,
        c.name,
        c.slug,
        c.avatar_url as picture_url,
        cat.name as category,
        c.verified,
        c.min_price,
        c.review_rate,
        c.review_count,
        cs.allow_virtual as virtual_available,
        cs.allow_physical as physical_available,
        c.country
      FROM celebrities_new c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN celebrity_settings cs ON c.id = cs.celebrity_id
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT :limit
      OFFSET :offset
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM celebrities_new c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN celebrity_settings cs ON c.id = cs.celebrity_id
      ${whereClause}
    `;

    const [cards, countResult] = await Promise.all([
      sequelize.query(cardsQuery, { replacements, type: QueryTypes.SELECT }),
      sequelize.query(countQuery, { replacements, type: QueryTypes.SELECT })
    ]);

    const total = (countResult[0] as any).total;

    res.json({
      success: true,
      data: {
        celebrities: cards,
        pagination: {
          total: parseInt(total),
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          hasMore: parseInt(total) > (parseInt(offset as string) + parseInt(limit as string))
        }
      }
    });

  } catch (error: any) {
    console.error('Error fetching celebrity cards:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * GET /api/celebrities/:slug
 * Returns full celebrity profile data
 */
export const getCelebrityProfile = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    // Get celebrity profile data
    const profileQuery = `
      SELECT
        c.id,
        c.name,
        c.slug,
        c.avatar_url as picture_url,
        cat.name as category,
        c.bio,
        c.verified,
        c.min_price,
        c.review_rate,
        c.review_count,
        c.country,
        c.social_followers,
        c.monthly_listeners,
        cs.tier,
        cs.allow_virtual as virtual_available,
        cs.allow_physical as physical_available,
        cs.max_monthly_slots,
        cs.timezone
      FROM celebrities_new c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN celebrity_settings cs ON c.id = cs.celebrity_id
      WHERE c.slug = :slug
      LIMIT 1
    `;

    const profiles = await sequelize.query(profileQuery, {
      replacements: { slug },
      type: QueryTypes.SELECT
    });

    if (profiles.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Celebrity not found'
      });
    }

    const profile = profiles[0] as any;

    // Get pricing packages
    const pricingQuery = `
      SELECT
        meeting_type,
        duration,
        price_cents,
        currency
      FROM celebrity_pricing
      WHERE celebrity_id = :celebrity_id
      ORDER BY
        CASE meeting_type WHEN 'virtual' THEN 1 ELSE 2 END,
        duration ASC
    `;

    const pricing = await sequelize.query(pricingQuery, {
      replacements: { celebrity_id: profile.id },
      type: QueryTypes.SELECT
    });

    // Format pricing by type
    const virtualPricing = pricing.filter((p: any) => p.meeting_type === 'virtual');
    const physicalPricing = pricing.filter((p: any) => p.meeting_type === 'physical');

    // Get availability (placeholder - will be populated by availability agent)
    // For now, return empty arrays
    const physicalAvailability: any[] = [];
    const virtualAvailability: any[] = [];

    res.json({
      success: true,
      data: {
        profile: {
          ...profile,
          pricing: {
            virtual: virtualPricing.map((p: any) => ({
              duration: p.duration,
              price: p.price_cents / 100,
              currency: p.currency
            })),
            physical: physicalPricing.map((p: any) => ({
              duration: p.duration,
              price: p.price_cents / 100,
              currency: p.currency
            }))
          },
          availability: {
            physical: physicalAvailability,
            virtual: virtualAvailability
          }
        }
      }
    });

  } catch (error: any) {
    console.error('Error fetching celebrity profile:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * GET /api/celebrities/featured
 * Returns featured celebrities for homepage
 */
export const getFeaturedCelebrities = async (req: Request, res: Response) => {
  try {
    const { limit = 12 } = req.query;

    const query = `
      SELECT
        c.id,
        c.name,
        c.slug,
        c.avatar_url as picture_url,
        cat.name as category,
        c.verified,
        c.min_price,
        c.review_rate,
        c.review_count,
        cs.allow_virtual as virtual_available,
        cs.allow_physical as physical_available,
        cs.tier
      FROM celebrities_new c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN celebrity_settings cs ON c.id = cs.celebrity_id
      WHERE c.status = 'active'
        AND c.verified = true
        AND cs.tier IN ('S', 'A', 'B')
      ORDER BY
        CASE cs.tier
          WHEN 'S' THEN 1
          WHEN 'A' THEN 2
          WHEN 'B' THEN 3
          ELSE 4
        END,
        RANDOM()
      LIMIT :limit
    `;

    const featured = await sequelize.query(query, {
      replacements: { limit: parseInt(limit as string) },
      type: QueryTypes.SELECT
    });

    res.json({
      success: true,
      data: {
        celebrities: featured
      }
    });

  } catch (error: any) {
    console.error('Error fetching featured celebrities:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
