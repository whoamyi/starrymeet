import { Request, Response } from 'express';
import { Celebrity, Review } from '../models';
import { AppError } from '../middleware/errorHandler';
import { Op } from 'sequelize';

export const listCelebrities = async (req: Request, res: Response) => {
  try {
    const {
      category,
      location,
      minPrice,
      maxPrice,
      rating,
      search,
      featured,
      limit = 12,
      offset = 0
    } = req.query;

    const where: any = { is_active: true };

    // Filters
    if (category) where.category = category;
    if (location) where.location = { [Op.iLike]: `%${location}%` };
    if (featured === 'true') where.is_featured = true;
    if (rating) where.average_rating = { [Op.gte]: parseFloat(rating as string) };
    if (search) {
      where[Op.or] = [
        { display_name: { [Op.iLike]: `%${search}%` } },
        { username: { [Op.iLike]: `%${search}%` } },
        { bio: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Price filter (check any of the meeting types)
    if (minPrice || maxPrice) {
      const priceConditions: any[] = [];
      if (minPrice && maxPrice) {
        priceConditions.push(
          { quick_meet_price_cents: { [Op.between]: [parseInt(minPrice as string), parseInt(maxPrice as string)] } },
          { standard_meet_price_cents: { [Op.between]: [parseInt(minPrice as string), parseInt(maxPrice as string)] } },
          { premium_meet_price_cents: { [Op.between]: [parseInt(minPrice as string), parseInt(maxPrice as string)] } }
        );
      } else if (minPrice) {
        priceConditions.push(
          { quick_meet_price_cents: { [Op.gte]: parseInt(minPrice as string) } },
          { standard_meet_price_cents: { [Op.gte]: parseInt(minPrice as string) } },
          { premium_meet_price_cents: { [Op.gte]: parseInt(minPrice as string) } }
        );
      } else if (maxPrice) {
        priceConditions.push(
          { quick_meet_price_cents: { [Op.lte]: parseInt(maxPrice as string) } },
          { standard_meet_price_cents: { [Op.lte]: parseInt(maxPrice as string) } },
          { premium_meet_price_cents: { [Op.lte]: parseInt(maxPrice as string) } }
        );
      }
      if (priceConditions.length > 0) {
        where[Op.or] = priceConditions;
      }
    }

    const { rows: celebrities, count } = await Celebrity.findAndCountAll({
      where,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
      order: [['average_rating', 'DESC'], ['total_bookings', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        celebrities,
        pagination: {
          total: count,
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          hasMore: count > (parseInt(offset as string) + parseInt(limit as string))
        }
      }
    });
  } catch (error) {
    throw error;
  }
};

export const getCelebrity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const celebrity = await Celebrity.findOne({
      where: { [Op.or]: [{ id }, { username: id }] }
    });

    if (!celebrity) {
      throw new AppError('Celebrity not found', 404);
    }

    res.json({
      success: true,
      data: { celebrity }
    });
  } catch (error) {
    throw error;
  }
};

export const getCelebrityReviews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const celebrity = await Celebrity.findByPk(id);
    if (!celebrity) {
      throw new AppError('Celebrity not found', 404);
    }

    const { rows: reviews, count } = await Review.findAndCountAll({
      where: { celebrity_id: id },
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
      order: [['created_at', 'DESC']],
      include: [
        {
          model: require('../models').User,
          attributes: ['id', 'first_name', 'last_name']
        }
      ]
    });

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          total: count,
          limit: parseInt(limit as string),
          offset: parseInt(offset as string)
        }
      }
    });
  } catch (error) {
    throw error;
  }
};
