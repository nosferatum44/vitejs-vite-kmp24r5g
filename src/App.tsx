import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { AuthForm } from './components/AuthForm';
import { PromiseForm } from './components/PromiseForm';
import { Dashboard } from './components/Dashboard';
import { PaymentSetup } from './components/PaymentSetup';
import { Navigation } from './components/Navigation';

function App() {
  const [session, setSession] = useState(null);
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <AuthForm />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route
                path="/new-promise"
                element={
                  hasPaymentMethod ? (
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create a New Promise</h1>
                      <PromiseForm />
                    </div>
                  ) : (
                    <Navigate to="/payment-setup" replace />
                  )
                }
              />
              <Route path="/payment-setup" element={<PaymentSetup />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;