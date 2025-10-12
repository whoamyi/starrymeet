import { Response } from 'express';
import { Booking, Payment } from '../models';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia'
});

export const createPaymentIntent = async (req: AuthRequest, res: Response) => {
  try {
    const { booking_id } = req.body;

    // Get booking
    const booking = await Booking.findByPk(booking_id);
    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    // Check if already has payment
    const existingPayment = await Payment.findOne({ where: { booking_id } });
    if (existingPayment && existingPayment.status === 'succeeded') {
      throw new AppError('Booking already paid', 400);
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: booking.total_cents,
      currency: 'usd',
      metadata: {
        booking_id: booking.id,
        booking_number: booking.booking_number,
        celebrity_id: booking.celebrity_id
      }
    });

    // Create or update payment record
    if (existingPayment) {
      existingPayment.stripe_payment_intent_id = paymentIntent.id;
      existingPayment.status = 'processing';
      await existingPayment.save();
    } else {
      await Payment.create({
        booking_id,
        stripe_payment_intent_id: paymentIntent.id,
        amount_cents: booking.total_cents,
        currency: 'usd',
        status: 'processing'
      });
    }

    // Update booking status
    booking.status = 'payment_processing';
    await booking.save();

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }
    });
  } catch (error) {
    throw error;
  }
};

export const handleStripeWebhook = async (req: Request, res: Response) => {
  try {
    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      throw new AppError(`Webhook signature verification failed: ${err.message}`, 400);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSuccess(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailure(failedIntent);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ success: true, received: true });
  } catch (error) {
    throw error;
  }
};

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const payment = await Payment.findOne({
    where: { stripe_payment_intent_id: paymentIntent.id }
  });

  if (payment) {
    payment.status = 'succeeded';
    payment.stripe_charge_id = paymentIntent.latest_charge as string;
    payment.paid_at = new Date();
    await payment.save();

    // Update booking
    const booking = await Booking.findByPk(payment.booking_id);
    if (booking) {
      booking.status = 'confirmed';
      booking.confirmed_at = new Date();
      await booking.save();

      // TODO: Send confirmation email
    }
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  const payment = await Payment.findOne({
    where: { stripe_payment_intent_id: paymentIntent.id }
  });

  if (payment) {
    payment.status = 'failed';
    await payment.save();

    // Update booking
    const booking = await Booking.findByPk(payment.booking_id);
    if (booking) {
      booking.status = 'pending';
      await booking.save();
    }
  }
}
