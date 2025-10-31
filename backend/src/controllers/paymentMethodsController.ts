import { Request, Response } from 'express';
import { PaymentMethod } from '../models';

// Get all payment methods for user
export const getPaymentMethods = async (req: Request, res: Response) => {
  try {
    const methods = await PaymentMethod.findAll({
      where: { user_id: req.user!.id },
      order: [
        ['is_default', 'DESC'],
        ['created_at', 'DESC']
      ]
    });

    res.json({
      success: true,
      data: methods
    });
  } catch (error) {
    console.error('Payment methods fetch error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch payment methods' }
    });
  }
};

// Add new payment method
export const addPaymentMethod = async (req: Request, res: Response) => {
  try {
    const {
      stripe_payment_method_id,
      card_last4,
      card_brand,
      card_exp_month,
      card_exp_year,
      is_default
    } = req.body;

    // If setting as default, unset all others
    if (is_default) {
      await PaymentMethod.update(
        { is_default: false },
        { where: { user_id: req.user!.id } }
      );
    }

    const paymentMethod = await PaymentMethod.create({
      user_id: req.user!.id,
      stripe_payment_method_id,
      card_last4,
      card_brand,
      card_exp_month,
      card_exp_year,
      is_default: is_default || false
    });

    res.json({
      success: true,
      data: paymentMethod
    });
  } catch (error) {
    console.error('Add payment method error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to add payment method' }
    });
  }
};

// Set payment method as default
export const setDefaultPaymentMethod = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Unset all defaults
    await PaymentMethod.update(
      { is_default: false },
      { where: { user_id: req.user!.id } }
    );

    // Set this one as default
    const [updatedRows] = await PaymentMethod.update(
      { is_default: true },
      {
        where: {
          id,
          user_id: req.user!.id
        }
      }
    );

    if (updatedRows === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Payment method not found' }
      });
    }

    res.json({
      success: true,
      message: 'Default payment method updated'
    });
  } catch (error) {
    console.error('Set default error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to set default payment method' }
    });
  }
};

// Delete payment method
export const deletePaymentMethod = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedRows = await PaymentMethod.destroy({
      where: {
        id,
        user_id: req.user!.id
      }
    });

    if (deletedRows === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Payment method not found' }
      });
    }

    res.json({
      success: true,
      message: 'Payment method removed'
    });
  } catch (error) {
    console.error('Delete payment method error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to delete payment method' }
    });
  }
};
