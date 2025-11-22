import React from 'react';
import { QuickAction } from '../types';
import { TrendingUp, Search, BarChart3, Lightbulb, DollarSign, AlertCircle } from 'lucide-react';

const quickActions: QuickAction[] = [
  {
    id: '1',
    label: 'Analyze Apple',
    query: "Analyze Apple's financial health and investment potential",
    icon: 'search',
  },
  {
    id: '2',
    label: 'Compare Tech Giants',
    query: 'Compare Apple, Microsoft, and Google across key financial metrics',
    icon: 'chart',
  },
  {
    id: '3',
    label: "Why is Tesla's P/E high?",
    query: "Why is Tesla's P/E ratio so high? Is it justified?",
    icon: 'lightbulb',
  },
  {
    id: '4',
    label: 'Find Undervalued Stocks',
    query: 'Find undervalued stocks in the technology sector',
    icon: 'trending',
  },
  {
    id: '5',
    label: 'Best Dividend Stocks',
    query: 'What are the best dividend stocks for long-term investment?',
    icon: 'dollar',
  },
  {
    id: '6',
    label: 'Insider Trading Activity',
    query: 'Show me recent insider trading activity for NVIDIA',
    icon: 'alert',
  },
];

const iconMap: Record<string, React.ReactNode> = {
  search: <Search size={16} />,
  chart: <BarChart3 size={16} />,
  lightbulb: <Lightbulb size={16} />,
  trending: <TrendingUp size={16} />,
  dollar: <DollarSign size={16} />,
  alert: <AlertCircle size={16} />,
};

interface QuickActionsProps {
  onSelectAction: (query: string) => void;
  disabled?: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onSelectAction, disabled }) => {
  const gradients = [
    'from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600',
    'from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
    'from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
    'from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600',
    'from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600',
    'from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600',
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-indigo-50">
      <h3 className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-3 uppercase tracking-wide flex items-center gap-2">
        <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
        </svg>
        Quick Start Options
      </h3>
      <div className="grid grid-cols-2 gap-2.5">
        {quickActions.map((action, index) => (
          <button
            key={action.id}
            onClick={() => onSelectAction(action.query)}
            disabled={disabled}
            className={`group relative flex items-center gap-3 px-4 py-3 text-sm text-left bg-gradient-to-r ${gradients[index]} text-white rounded-xl transition-all shadow-md hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden`}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

            <span className="flex-shrink-0 relative z-10 transform group-hover:scale-110 transition-transform">
              {iconMap[action.icon || 'search']}
            </span>
            <span className="font-semibold relative z-10 text-xs leading-tight">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
