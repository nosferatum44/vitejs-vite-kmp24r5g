import { useState } from 'react';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripe } from '../lib/stripe';
import { createSetupIntent, confirmPaymentSetup } from '../lib/stripe';

function PaymentFormInner() {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      // Create SetupIntent
      const { clientSecret } = await createSetupIntent();
      
      // Get payment method
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card element not found');

      const { setupIntent, error } = await confirmPaymentSetup(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            // Add billing details if needed
          },
        },
      });

      if (error) {
        setError(error.message || 'An error occurred');
      } else if (setupIntent.status === 'succeeded') {
        setSucceeded(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-md">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>

      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}

      {succeeded && (
        <div className="text-sm text-green-600">
          Payment method successfully added!
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {processing ? 'Processing...' : 'Add Payment Method'}
      </button>
    </form>
  );
}

export function PaymentForm() {
  return (
    <Elements stripe={stripe}>
      <PaymentFormInner />
    </Elements>
  );
}