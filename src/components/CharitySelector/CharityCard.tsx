import { Charity } from '../../types/database';

interface CharityCardProps {
  charity: Charity;
  isSelected: boolean;
  onSelect: () => void;
}

export function CharityCard({ charity, isSelected, onSelect }: CharityCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full p-4 rounded-lg border-2 transition-colors ${
        isSelected 
          ? 'border-indigo-600 bg-indigo-50' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center space-x-4">
        <img
          src={charity.image_url}
          alt={charity.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1 text-left">
          <h4 className="font-medium text-gray-900">{charity.name}</h4>
          <p className="text-sm text-gray-500 line-clamp-2">{charity.description}</p>
        </div>
      </div>
    </button>
  );
}