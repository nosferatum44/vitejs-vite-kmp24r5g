import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

export const stripe = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export async function createSetupIntent() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const response = await fetch(
    'https://nzpegmymcbvlxftyyvpd.supabase.co/functions/v1/stripe',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create setup intent');
  }

  return response.json();
}

export async function confirmPaymentSetup(clientSecret: string, paymentMethod: any) {
  const stripeInstance = await stripe;
  if (!stripeInstance) throw new Error('Stripe not initialized');
  
  return stripeInstance.confirmCardSetup(clientSecret, {
    payment_method: paymentMethod,
  });
}