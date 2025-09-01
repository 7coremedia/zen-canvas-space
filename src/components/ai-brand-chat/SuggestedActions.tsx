import React from 'react';
import { SuggestedAction } from '../../lib/ai/contextAnalyzer';

interface SuggestedActionsProps {
  actions: SuggestedAction[];
  onActionClick: (action: SuggestedAction) => void;
  visible: boolean;
}

export const SuggestedActions: React.FC<SuggestedActionsProps> = ({
  actions,
  onActionClick,
  visible
}) => {
  if (!visible || actions.length === 0) {
    return null;
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'brand-strategy':
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      case 'visual-identity':
        return 'bg-purple-50 border-purple-200 hover:bg-purple-100';
      case 'naming':
        return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'research':
        return 'bg-orange-50 border-orange-200 hover:bg-orange-100';
      case 'planning':
        return 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100';
      default:
        return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

  return (
    <div className="mt-6 mb-4 animate-in slide-in-from-bottom-2 duration-300">
      <div className="text-center mb-3">
        <h3 className="text-sm font-medium text-gray-700 mb-1">
          💡 Suggested Next Steps
        </h3>
        <p className="text-xs text-gray-500">
          Based on our conversation, here are some actions you might want to take:
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-[766px] mx-auto">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onActionClick(action)}
            className={`
              p-4 rounded-xl border transition-all duration-200 
              ${getCategoryColor(action.category)}
              transform hover:scale-105 hover:shadow-md
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            `}
          >
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="text-2xl mb-1">
                {action.icon}
              </div>
              <h4 className="font-semibold text-sm text-gray-900 leading-tight">
                {action.title}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {action.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
