import React from 'react';
import { CTATemplate } from '../../lib/ai/contextAnalyzer';
import { useNavigate } from 'react-router-dom';

interface CTACardsProps {
  ctas: CTATemplate[];
  visible: boolean;
}

export const CTACards: React.FC<CTACardsProps> = ({ ctas, visible }) => {
  const navigate = useNavigate();

  if (!visible || ctas.length === 0) {
    return null;
  }

  const handleActionClick = (link: string) => {
    navigate(link);
  };

  return (
    <div className="mt-4 mb-3 animate-in slide-in-from-bottom-2 duration-300">
      <div className="text-center mb-3">
        <h3 className="text-sm font-medium text-gray-700 mb-1">
          🚀 Ready to take action?
        </h3>
        <p className="text-xs text-gray-500">
          Here are some next steps you can take:
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-[766px] mx-auto">
        {ctas.map((cta) => (
          <div
            key={cta.id}
            className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="text-center space-y-2">
              <h4 className="font-semibold text-gray-900 text-base leading-tight">
                {cta.title}
              </h4>
              {cta.subtitle && (
                <p className="text-xs text-gray-600 leading-relaxed">
                  {cta.subtitle}
                </p>
              )}
              
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={() => handleActionClick(cta.primaryAction.link)}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-semibold px-3 py-2 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                >
                  <span>{cta.primaryAction.icon}</span>
                  {cta.primaryAction.text}
                </button>
                
                {cta.secondaryAction && (
                  <button
                    onClick={() => handleActionClick(cta.secondaryAction!.link)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2"
                  >
                  <span>{cta.secondaryAction.icon}</span>
                  {cta.secondaryAction.text}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};