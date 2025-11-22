import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';

interface InsightsPanelProps {
  stockSymbol?: string;
  stockName?: string;
  price?: number;
  change?: number;
  changePercent?: number;
  investmentScore?: number;
  isLoading?: boolean;
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({
  stockSymbol,
  stockName,
  price,
  change,
  changePercent,
  investmentScore,
  isLoading = false,
}) => {
  // If we have stock data, show it
  const hasData = stockSymbol && price !== undefined;

  if (isLoading) {
    return (
      <div className="w-1/3 bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 p-6 overflow-y-auto rounded-2xl border border-indigo-100 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        <div className="space-y-6 relative z-10">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-600">Loading insights...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasData) {
    // Show placeholder when no data
    return (
      <div className="w-1/3 bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 p-6 overflow-y-auto rounded-2xl border border-indigo-100 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        <div className="space-y-6 relative z-10">
          {/* Header */}
          <div className="pb-4 border-b border-indigo-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Insights Panel
              </h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Real-time charts, investment scores, and detailed metric explanations will appear here
            </p>
          </div>

          {/* Coming Soon Cards */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-md border border-indigo-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-xl">📈</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-800">Investment Score</h4>
                  <p className="text-xs text-gray-500">0-100 scoring with breakdown</p>
                </div>
              </div>
              <div className="h-2 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full overflow-hidden">
                <div className="h-full w-0 bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse"></div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md border border-blue-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                  <span className="text-xl">📉</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-800">Live Charts</h4>
                  <p className="text-xs text-gray-500">Dynamic visualizations</p>
                </div>
              </div>
              <div className="h-16 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg flex items-end justify-around p-2">
                {[40, 65, 45, 80, 60, 90, 75].map((height, i) => (
                  <div
                    key={i}
                    className="w-2 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t animate-pulse"
                    style={{ height: `${height}%`, animationDelay: `${i * 0.1}s` }}
                  ></div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md border border-emerald-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <span className="text-xl">💡</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-800">Deep Analysis</h4>
                  <p className="text-xs text-gray-500">Every metric explained</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 italic">
                "Understanding the WHY behind every number..."
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl p-4 border border-indigo-200">
              <p className="text-xs text-indigo-800 font-medium text-center">
                ✨ Start asking questions to see insights!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show actual data
  const isPositive = (change || 0) >= 0;

  return (
    <div className="w-1/3 bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 p-6 overflow-y-auto rounded-2xl border border-indigo-100 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="space-y-6 relative z-10">
        {/* Stock Header */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-indigo-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{stockSymbol}</h2>
              <p className="text-sm text-gray-500">{stockName || 'Loading...'}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {isPositive ? <TrendingUp className="inline w-3 h-3 mr-1" /> : <TrendingDown className="inline w-3 h-3 mr-1" />}
              {isPositive ? '+' : ''}{changePercent?.toFixed(2)}%
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-bold text-gray-900">
              ${price?.toFixed(2)}
            </span>
            <span className={`text-lg font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{change?.toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-gray-600">Market Cap</span>
              </div>
              <p className="text-sm font-bold text-gray-900">Coming soon</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-4 h-4 text-purple-600" />
                <span className="text-xs text-gray-600">Volume</span>
              </div>
              <p className="text-sm font-bold text-gray-900">Coming soon</p>
            </div>
          </div>
        </div>

        {/* Investment Score */}
        {investmentScore !== undefined && (
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-indigo-100">
            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-xs">📊</span>
              </div>
              Investment Score
            </h3>

            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {investmentScore}/100
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  investmentScore >= 70 ? 'bg-green-100 text-green-700' :
                  investmentScore >= 50 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {investmentScore >= 70 ? 'BUY' : investmentScore >= 50 ? 'HOLD' : 'SELL'}
                </span>
              </div>

              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    investmentScore >= 70 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                    investmentScore >= 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-600' :
                    'bg-gradient-to-r from-red-500 to-rose-600'
                  }`}
                  style={{ width: `${investmentScore}%` }}
                ></div>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                See full breakdown in the chat
              </p>
            </div>
          </div>
        )}

        {/* Key Metrics Placeholder */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-blue-100">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Key Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-xs text-gray-600">P/E Ratio</span>
              <span className="text-sm font-semibold text-gray-900">Loading...</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-xs text-gray-600">Market Cap</span>
              <span className="text-sm font-semibold text-gray-900">Loading...</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-xs text-gray-600">52W High</span>
              <span className="text-sm font-semibold text-gray-900">Loading...</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">52W Low</span>
              <span className="text-sm font-semibold text-gray-900">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
