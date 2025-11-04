import { Response } from 'express';
import { Booking, Celebrity, Payment } from '../models';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    console.log('Create booking request:', JSON.stringify(req.body, null, 2));

    const {
      celebrity_id,
      celebrity_name,
      meeting_type,
      booking_date,
      time_slot,
      contact_name,
      contact_email,
      contact_phone,
      special_requests,
      price
    } = req.body;

    // Find or create celebrity
    let celebrity;

    if (celebrity_id) {
      // Look up by ID
      celebrity = await Celebrity.findByPk(celebrity_id);
      if (!celebrity || !celebrity.is_active) {
        throw new AppError('Celebrity not found or inactive', 404);
      }
    } else if (celebrity_name) {
      // Look up by display_name
      celebrity = await Celebrity.findOne({
        where: { display_name: celebrity_name }
      });

      // If not found, create a temporary celebrity entry
      if (!celebrity) {
        const priceInCents = price ? Math.round(price * 100) : 150000; // Default $1,500

        celebrity = await Celebrity.create({
          username: celebrity_name.toLowerCase().replace(/\s+/g, '_'),
          display_name: celebrity_name,
          category: 'Celebrity',
          bio: 'Auto-created celebrity profile',
          quick_meet_price_cents: Math.round(priceInCents * 0.5),
          standard_meet_price_cents: priceInCents,
          premium_meet_price_cents: Math.round(priceInCents * 1.5),
          is_active: true,
          is_verified: false
        });
      }
    } else {
      throw new AppError('Either celebrity_id or celebrity_name is required', 400);
    }

    // Get pricing based on meeting type
    let subtotal_cents = 0;
    const meetingTypeLower = meeting_type.toLowerCase();

    if (meetingTypeLower.includes('quick')) {
      subtotal_cents = celebrity.quick_meet_price_cents || 0;
    } else if (meetingTypeLower.includes('standard')) {
      subtotal_cents = celebrity.standard_meet_price_cents || 0;
    } else if (meetingTypeLower.includes('premium') || meetingTypeLower.includes('extended')) {
      subtotal_cents = celebrity.premium_meet_price_cents || 0;
    } else {
      // Fallback: use custom price if provided
      if (price) {
        subtotal_cents = Math.round(price * 100);
      } else {
        throw new AppError('Invalid meeting type or price not provided', 400);
      }
    }

    if (subtotal_cents === 0) {
      throw new AppError('Pricing not available for this meeting type', 400);
    }

    // Calculate fees
    const platform_fee_cents = Math.round(subtotal_cents * 0.15); // 15% platform fee
    const tax_cents = Math.round(subtotal_cents * 0.10); // 10% tax (example)
    const total_cents = subtotal_cents + platform_fee_cents + tax_cents;

    // Generate booking number
    const booking_number = Booking.generateBookingNumber();

    // Create booking
    const booking = await Booking.create({
      booking_number,
      user_id: req.user?.userId,
      celebrity_id,
      meeting_type,
      booking_date,
      time_slot,
      contact_name,
      contact_email,
      contact_phone,
      special_requests,
      subtotal_cents,
      platform_fee_cents,
      tax_cents,
      total_cents,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      data: {
        booking: {
          ...booking.toJSON(),
          celebrity: {
            id: celebrity.id,
            display_name: celebrity.display_name,
            username: celebrity.username
          }
        }
      }
    });
  } catch (error) {
    throw error;
  }
};

export const getBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id, {
      include: [
        {
          model: Celebrity,
          attributes: ['id', 'display_name', 'username', 'avatar_url', 'category']
        },
        {
          model: Payment,
          attributes: ['id', 'status', 'amount_cents', 'paid_at']
        }
      ]
    });

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    // Check authorization
    if (req.user && booking.user_id !== req.user.userId) {
      throw new AppError('Unauthorized', 403);
    }

    res.json({
      success: true,
      data: { booking }
    });
  } catch (error) {
    throw error;
  }
};

export const listUserBookings = async (req: AuthRequest, res: Response) => {
  try {
    console.log('List user bookings for user:', req.user?.userId || req.user?.id);

    const { limit = 10, offset = 0, status } = req.query;

    const where: any = { user_id: req.user!.userId || req.user!.id };
    if (status) where.status = status;

    const { rows: bookings, count } = await Booking.findAndCountAll({
      where,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Celebrity,
          attributes: ['id', 'display_name', 'username', 'avatar_url', 'category']
        }
      ]
    }).catch(err => {
      console.error('Error fetching bookings:', err);
      return { rows: [], count: 0 };
    });

    res.json({
      success: true,
      data: {
        bookings: bookings || [],
        pagination: {
          total: count || 0,
          limit: parseInt(limit as string),
          offset: parseInt(offset as string)
        }
      }
    });
  } catch (error) {
    throw error;
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    // Check authorization
    if (booking.user_id !== req.user!.userId) {
      throw new AppError('Unauthorized', 403);
    }

    // Check if can cancel
    if (['completed', 'cancelled', 'refunded'].includes(booking.status)) {
      throw new AppError('Cannot cancel this booking', 400);
    }

    // Update status
    booking.status = 'cancelled';
    booking.cancelled_at = new Date();
    await booking.save();

    res.json({
      success: true,
      data: { booking }
    });
  } catch (error) {
    throw error;
  }
};
