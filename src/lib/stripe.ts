import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export type StripeCustomer = Stripe.Customer;

// Subscription statuses treated as "still theirs to manage": lets customers whose payment
// failed (past_due) keep logging in and cancelling, instead of getting locked out.
export const ALLOWED_SUBSCRIPTION_STATUSES: Stripe.Subscription.Status[] = ['active', 'past_due'];
