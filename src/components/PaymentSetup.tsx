import { PaymentForm } from './PaymentForm';

export function PaymentSetup() {
  return (
    <div className="max-w-md mx-auto bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Setup</h2>
      <p className="text-gray-600 mb-6">
        To create promises, you need to set up a payment method first. This will be used to collect penalties if you fail to keep your promises.
      </p>
      <PaymentForm />
    </div>
  );
}