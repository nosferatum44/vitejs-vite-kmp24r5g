import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Charity } from '../../types/database';
import { CharityCard } from './CharityCard';

interface CharitySelectorProps {
  selectedCharityId: string | null;
  onSelectCharity: (charityId: string | null) => void;
}

export function CharitySelector({ selectedCharityId, onSelectCharity }: CharitySelectorProps) {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    try {
      const { data, error } = await supabase
        .from('charities')
        .select('*')
        .order('name');

      if (error) throw error;
      setCharities(data || []);
    } catch (error) {
      console.error('Error fetching charities:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading charities...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => onSelectCharity(null)}
          className={`w-full p-4 rounded-lg border-2 transition-colors ${
            selectedCharityId === null 
              ? 'border-indigo-600 bg-indigo-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-xl">💰</span>
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-medium text-gray-900">Donate to Creator</h4>
              <p className="text-sm text-gray-500">The penalty amount will go to the promise creator</p>
            </div>
          </div>
        </button>
        
        {charities.map((charity) => (
          <CharityCard
            key={charity.id}
            charity={charity}
            isSelected={selectedCharityId === charity.id}
            onSelect={() => onSelectCharity(charity.id)}
          />
        ))}
      </div>
    </div>
  );
}