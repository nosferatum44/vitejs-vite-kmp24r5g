import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import { Promise } from '../types/database';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { PromiseCalendar } from './PromiseCalendar';

export function Dashboard() {
  const [promises, setPromises] = useState<Promise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromises();
  }, []);

  const fetchPromises = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('promises')
        .select('*')
        .eq('user_id', user.id)
        .order('deadline', { ascending: true });

      if (error) throw error;
      setPromises(data || []);
    } catch (error) {
      console.error('Error fetching promises:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (promiseId: string) => {
    try {
      const { error } = await supabase
        .from('promises')
        .update({ status: 'completed' })
        .eq('id', promiseId);

      if (error) throw error;
      fetchPromises();
    } catch (error) {
      console.error('Error completing promise:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Your Promises</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar Section */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Calendar View</h3>
          <div className="h-[400px]">
            <PromiseCalendar promises={promises} />
          </div>
        </div>

        {/* List Section */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">List View</h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {promises.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                You haven't made any promises yet.
              </div>
            ) : (
              promises.map((promise) => (
                <div
                  key={promise.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{promise.title}</h4>
                      <p className="text-sm text-gray-500">{promise.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      promise.status === 'completed' ? 'bg-green-100 text-green-800' :
                      promise.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {promise.status.charAt(0).toUpperCase() + promise.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div>
                      Deadline: {format(new Date(promise.deadline), 'PPP')}
                    </div>
                    <div>
                      Penalty: ${promise.penalty_amount}
                    </div>
                  </div>
                  {promise.status === 'pending' && (
                    <button
                      onClick={() => handleComplete(promise.id)}
                      className="w-full flex justify-center items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                      Mark as Completed
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}