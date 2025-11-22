import {
  FinancialMetrics,
  InvestmentScore,
  ComponentScore,
  MetricExplanation,
  AnalystData,
  SentimentAnalysis,
  InsiderTransaction
} from '../types/index.js';

export class InvestmentScoreService {
  /**
   * Calculate comprehensive investment score with full breakdown
   */
  calculateScore(
    symbol: string,
    metrics: FinancialMetrics,
    analystData: AnalystData,
    sentiment?: SentimentAnalysis,
    insiders?: InsiderTransaction[]
  ): InvestmentScore {
    const financialHealth = this.scoreFinancialHealth(metrics);
    const valuation = this.scoreValuation(metrics, symbol);
    const growth = this.scoreGrowth(metrics);
    const sentimentScore = this.scoreSentiment(analystData, sentiment, insiders);

    const total = financialHealth.score + valuation.score + growth.score + sentimentScore.score;
    const maxScore = 100;

    let rating: 'BUY' | 'HOLD' | 'SELL';
    if (total >= 78) rating = 'BUY';
    else if (total >= 58) rating = 'HOLD';
    else rating = 'SELL';

    return {
      total,
      maxScore,
      rating,
      breakdown: {
        financialHealth,
        valuation,
        growth,
        sentiment: sentimentScore,
      },
      summary: this.generateSummary(total, rating, financialHealth, valuation, growth, sentimentScore),
      bullCase: this.generateBullCase(financialHealth, valuation, growth, sentimentScore),
      bearCase: this.generateBearCase(financialHealth, valuation, growth, sentimentScore),
      verdict: this.generateVerdict(symbol, total, rating, metrics),
    };
  }

  /**
   * Score Financial Health (30 points max)
   */
  private scoreFinancialHealth(metrics: FinancialMetrics): ComponentScore {
    let score = 0;
    const explanations: MetricExplanation[] = [];

    // Current Ratio (10 points max)
    let currentRatioPoints = 0;
    let currentRatioReason = '';
    if (metrics.currentRatio >= 2.0) {
      currentRatioPoints = 10;
      currentRatioReason = `Excellent liquidity - can cover short-term obligations ${metrics.currentRatio.toFixed(1)}x over. Healthy buffer for operations.`;
    } else if (metrics.currentRatio >= 1.5) {
      currentRatioPoints = 7;
      currentRatioReason = `Good liquidity - comfortable coverage of obligations. Sector average is typically 1.5.`;
    } else if (metrics.currentRatio >= 1.0) {
      currentRatioPoints = 4;
      currentRatioReason = `Adequate liquidity - can cover obligations but with little buffer. Monitor closely.`;
    } else {
      currentRatioPoints = 1;
      currentRatioReason = `⚠️ Weak liquidity - may struggle with short-term obligations. Risk of cash flow issues.`;
    }
    score += currentRatioPoints;

    explanations.push({
      metric: 'Current Ratio',
      value: metrics.currentRatio.toFixed(2),
      points: currentRatioPoints,
      maxPoints: 10,
      reason: currentRatioReason,
      implications: 'Measures ability to pay short-term debts. Higher is safer.',
      source: 'Yahoo Finance - Balance Sheet',
    });

    // Debt-to-Equity (10 points max)
    let debtPoints = 0;
    let debtReason = '';
    if (metrics.debtToEquity <= 0.5) {
      debtPoints = 10;
      debtReason = `Very conservative capital structure. Low financial risk. Company relies more on equity than debt.`;
    } else if (metrics.debtToEquity <= 1.0) {
      debtPoints = 7;
      debtReason = `Moderate debt load, below typical threshold of 1.0. Balanced approach to financing.`;
    } else if (metrics.debtToEquity <= 2.0) {
      debtPoints = 4;
      debtReason = `⚠️ Higher debt levels. Company is leveraged, which amplifies both gains and risks.`;
    } else {
      debtPoints = 1;
      debtReason = `🚨 Very high debt load. Significant financial risk, especially if rates rise or earnings fall.`;
    }
    score += debtPoints;

    explanations.push({
      metric: 'Debt-to-Equity',
      value: metrics.debtToEquity.toFixed(2),
      points: debtPoints,
      maxPoints: 10,
      reason: debtReason,
      implications: 'Lower ratios indicate less financial risk and more stability.',
      source: 'Yahoo Finance - Balance Sheet',
    });

    // Interest Coverage (10 points max)
    let coveragePoints = 0;
    let coverageReason = '';
    if (metrics.interestCoverage >= 8.0) {
      coveragePoints = 10;
      coverageReason = `Excellent - earnings cover interest ${metrics.interestCoverage.toFixed(1)}x over. Very safe debt position.`;
    } else if (metrics.interestCoverage >= 5.0) {
      coveragePoints = 7;
      coverageReason = `Good coverage - company can comfortably service debt obligations.`;
    } else if (metrics.interestCoverage >= 2.5) {
      coveragePoints = 4;
      coverageReason = `⚠️ Adequate but declining coverage. Rising rates or falling earnings could cause stress.`;
    } else if (metrics.interestCoverage > 0) {
      coveragePoints = 1;
      coverageReason = `🚨 Weak coverage - barely covering interest. High risk of financial distress.`;
    } else {
      coveragePoints = 0;
      coverageReason = `🚨 Cannot cover interest payments. Serious financial trouble.`;
    }
    score += coveragePoints;

    explanations.push({
      metric: 'Interest Coverage',
      value: `${metrics.interestCoverage.toFixed(1)}x`,
      points: coveragePoints,
      maxPoints: 10,
      reason: coverageReason,
      implications: 'Measures ability to pay interest on debt. Below 2.5x is concerning.',
      source: 'Yahoo Finance - Income Statement',
    });

    return {
      score,
      maxScore: 30,
      explanations,
      summary: this.generateHealthSummary(score, explanations),
    };
  }

  /**
   * Score Valuation (25 points max)
   */
  private scoreValuation(metrics: FinancialMetrics, symbol: string): ComponentScore {
    let score = 0;
    const explanations: MetricExplanation[] = [];

    // P/E Ratio (15 points max)
    // Assuming sector average around 20-25 for tech/growth
    const sectorAvgPE = 22;
    let pePoints = 0;
    let peReason = '';

    if (metrics.peRatio <= 0) {
      pePoints = 0;
      peReason = `🚨 Negative earnings - company is not profitable. Cannot assign value using P/E.`;
    } else if (metrics.peRatio < sectorAvgPE * 0.7) {
      pePoints = 15;
      peReason = `Undervalued - P/E significantly below sector average of ${sectorAvgPE}. Potential bargain if quality is good.`;
    } else if (metrics.peRatio < sectorAvgPE) {
      pePoints = 12;
      peReason = `Fair value - P/E slightly below sector average. Reasonable entry point.`;
    } else if (metrics.peRatio < sectorAvgPE * 1.3) {
      pePoints = 8;
      peReason = `⚠️ Slight premium - paying ${((metrics.peRatio / sectorAvgPE - 1) * 100).toFixed(0)}% more than sector average. Growth must justify this.`;
    } else if (metrics.peRatio < sectorAvgPE * 2) {
      pePoints = 4;
      peReason = `⚠️ Significant premium - P/E is ${((metrics.peRatio / sectorAvgPE - 1) * 100).toFixed(0)}% above sector. High expectations priced in.`;
    } else {
      pePoints = 1;
      peReason = `🚨 Very expensive - P/E extremely high. Implies massive growth expectations or potential bubble.`;
    }
    score += pePoints;

    explanations.push({
      metric: 'P/E Ratio',
      value: metrics.peRatio.toFixed(1),
      points: pePoints,
      maxPoints: 15,
      reason: peReason,
      context: {
        sectorAverage: sectorAvgPE,
      },
      implications: `You're paying $${metrics.peRatio.toFixed(2)} for every $1 of annual earnings.`,
      source: 'Yahoo Finance',
    });

    // PEG Ratio (10 points max)
    let pegPoints = 0;
    let pegReason = '';

    if (metrics.pegRatio <= 0) {
      pegPoints = 0;
      pegReason = `Cannot calculate PEG - negative growth or P/E.`;
    } else if (metrics.pegRatio < 1.0) {
      pegPoints = 10;
      pegReason = `Excellent - growth justifies or exceeds the P/E premium. Strong value.`;
    } else if (metrics.pegRatio < 1.5) {
      pegPoints = 7;
      pegReason = `Good - P/E is reasonable given growth rate. Fair valuation.`;
    } else if (metrics.pegRatio < 2.0) {
      pegPoints = 4;
      pegReason = `⚠️ Somewhat expensive - paying a premium even accounting for growth.`;
    } else {
      pegPoints = 1;
      pegReason = `🚨 Overvalued - P/E way too high relative to growth expectations.`;
    }
    score += pegPoints;

    explanations.push({
      metric: 'PEG Ratio',
      value: metrics.pegRatio.toFixed(2),
      points: pegPoints,
      maxPoints: 10,
      reason: pegReason,
      implications: 'P/E divided by growth rate. Under 1.5 suggests growth justifies premium.',
      source: 'Yahoo Finance',
    });

    return {
      score,
      maxScore: 25,
      explanations,
      summary: `Valuation score: ${score}/25. ${pePoints < 8 ? 'Premium valuation' : 'Reasonable pricing'}.`,
    };
  }

  /**
   * Score Growth (25 points max)
   */
  private scoreGrowth(metrics: FinancialMetrics): ComponentScore {
    let score = 0;
    const explanations: MetricExplanation[] = [];

    // Revenue Growth (10 points max)
    const revenueGrowthPct = metrics.revenueGrowth * 100;
    let revPoints = 0;
    let revReason = '';

    if (revenueGrowthPct >= 20) {
      revPoints = 10;
      revReason = `Exceptional growth - expanding ${revenueGrowthPct.toFixed(1)}% YoY. Strong market demand.`;
    } else if (revenueGrowthPct >= 12) {
      revPoints = 7;
      revReason = `Good growth - above typical market growth. Gaining market share.`;
    } else if (revenueGrowthPct >= 5) {
      revPoints = 4;
      revReason = `Moderate growth - keeping pace with economy but not exceptional.`;
    } else if (revenueGrowthPct >= 0) {
      revPoints = 2;
      revReason = `⚠️ Slow growth - barely growing. Market may be saturated.`;
    } else {
      revPoints = 0;
      revReason = `🚨 Revenue declining - losing market share or facing headwinds.`;
    }
    score += revPoints;

    explanations.push({
      metric: 'Revenue Growth',
      value: `${revenueGrowthPct.toFixed(1)}% YoY`,
      points: revPoints,
      maxPoints: 10,
      reason: revReason,
      implications: 'Revenue growth drives stock appreciation. Higher growth = higher valuations.',
      source: 'Yahoo Finance - Income Statement',
    });

    // EPS Growth (10 points max)
    const epsGrowthPct = metrics.epsGrowth * 100;
    let epsPoints = 0;
    let epsReason = '';

    if (epsGrowthPct >= 25) {
      epsPoints = 10;
      epsReason = `Outstanding - earnings growing ${epsGrowthPct.toFixed(1)}% YoY. Expanding profitability.`;
    } else if (epsGrowthPct >= 15) {
      epsPoints = 7;
      epsReason = `Strong growth - earnings growing faster than typical. Good operational efficiency.`;
    } else if (epsGrowthPct >= 8) {
      epsPoints = 4;
      epsReason = `Moderate growth - steady but not spectacular. Keeping up with market.`;
    } else if (epsGrowthPct >= 0) {
      epsPoints = 2;
      epsReason = `⚠️ Weak growth - earnings barely growing. Margin pressure possible.`;
    } else {
      epsPoints = 0;
      epsReason = `🚨 Earnings declining - profitability under pressure. Red flag.`;
    }
    score += epsPoints;

    explanations.push({
      metric: 'EPS Growth',
      value: `${epsGrowthPct.toFixed(1)}% YoY`,
      points: epsPoints,
      maxPoints: 10,
      reason: epsReason,
      implications: 'Earnings growth drives stock prices. Faster than revenue = improving margins.',
      source: 'Yahoo Finance',
    });

    // Profit Margin (5 points max)
    const profitMarginPct = metrics.profitMargin * 100;
    let marginPoints = 0;
    let marginReason = '';

    if (profitMarginPct >= 25) {
      marginPoints = 5;
      marginReason = `Exceptional margins - keeping ${profitMarginPct.toFixed(1)}% of revenue. Strong pricing power.`;
    } else if (profitMarginPct >= 15) {
      marginPoints = 4;
      marginReason = `Good margins - healthy profitability. Efficient operations.`;
    } else if (profitMarginPct >= 8) {
      marginPoints = 3;
      marginReason = `Average margins - competitive but not standout.`;
    } else if (profitMarginPct >= 0) {
      marginPoints = 1;
      marginReason = `⚠️ Thin margins - little room for error. Cost pressure concerns.`;
    } else {
      marginPoints = 0;
      marginReason = `🚨 Unprofitable - losing money on sales.`;
    }
    score += marginPoints;

    explanations.push({
      metric: 'Profit Margin',
      value: `${profitMarginPct.toFixed(1)}%`,
      points: marginPoints,
      maxPoints: 5,
      reason: marginReason,
      implications: 'Higher margins = better business quality and pricing power.',
      source: 'Yahoo Finance',
    });

    return {
      score,
      maxScore: 25,
      explanations,
      summary: `Growth score: ${score}/25. ${score >= 20 ? 'Strong momentum' : score >= 15 ? 'Moderate growth' : 'Weak growth'}.`,
    };
  }

  /**
   * Score Market Sentiment (20 points max)
   */
  private scoreSentiment(
    analystData: AnalystData,
    sentiment?: SentimentAnalysis,
    insiders?: InsiderTransaction[]
  ): ComponentScore {
    let score = 0;
    const explanations: MetricExplanation[] = [];

    // Analyst Ratings (10 points max)
    let analystPoints = 0;
    let analystReason = '';

    if (analystData.percentage >= 70) {
      analystPoints = 10;
      analystReason = `Strong consensus - ${analystData.percentage}% of ${analystData.count} analysts rate "Buy". High conviction.`;
    } else if (analystData.percentage >= 50) {
      analystPoints = 7;
      analystReason = `Positive lean - majority (${analystData.percentage}%) recommend buying.`;
    } else if (analystData.percentage >= 30) {
      analystPoints = 4;
      analystReason = `⚠️ Mixed views - no clear consensus among analysts. Do your own research.`;
    } else {
      analystPoints = 2;
      analystReason = `🚨 Bearish - most analysts cautious or negative. Concerns about outlook.`;
    }
    score += analystPoints;

    const upside = ((analystData.priceTarget.average - analystData.priceTarget.current) / analystData.priceTarget.current) * 100;

    explanations.push({
      metric: 'Analyst Consensus',
      value: `${analystData.percentage}% Buy`,
      points: analystPoints,
      maxPoints: 10,
      reason: analystReason,
      context: {
        peers: [
          { symbol: 'Average Price Target', value: analystData.priceTarget.average },
          { symbol: 'Current Price', value: analystData.priceTarget.current },
        ],
      },
      implications: `Analysts see ${upside >= 0 ? '+' : ''}${upside.toFixed(1)}% upside to target price.`,
      source: 'Yahoo Finance - Analyst Ratings',
    });

    // News Sentiment (7 points max)
    if (sentiment) {
      let sentimentPoints = 0;
      let sentimentReason = '';

      if (sentiment.score >= 0.5) {
        sentimentPoints = 7;
        sentimentReason = `Very positive news cycle - ${sentiment.label}. Strong market buzz.`;
      } else if (sentiment.score >= 0.2) {
        sentimentPoints = 5;
        sentimentReason = `Positive sentiment - ${sentiment.articleCount} recent articles mostly favorable.`;
      } else if (sentiment.score >= -0.2) {
        sentimentPoints = 3;
        sentimentReason = `Neutral sentiment - balanced news coverage, no major themes.`;
      } else if (sentiment.score >= -0.5) {
        sentimentPoints = 2;
        sentimentReason = `⚠️ Negative sentiment - concerns in media coverage.`;
      } else {
        sentimentPoints = 0;
        sentimentReason = `🚨 Very negative - bad news dominating headlines.`;
      }
      score += sentimentPoints;

      explanations.push({
        metric: 'News Sentiment',
        value: `${sentiment.score > 0 ? '+' : ''}${sentiment.score.toFixed(2)}`,
        points: sentimentPoints,
        maxPoints: 7,
        reason: sentimentReason,
        implications: `Sentiment analysis of ${sentiment.articleCount} recent articles via FinGPT.`,
        source: sentiment.source,
      });
    } else {
      // No sentiment data available
      score += 3; // Neutral score
      explanations.push({
        metric: 'News Sentiment',
        value: 'N/A',
        points: 3,
        maxPoints: 7,
        reason: 'Sentiment data not available',
        implications: 'Unable to analyze recent news sentiment.',
        source: 'N/A',
      });
    }

    // Insider Trading (3 points max)
    if (insiders && insiders.length > 0) {
      const netAmount = insiders.reduce((sum, tx) => sum + (tx.type === 'buy' ? tx.amount : -tx.amount), 0);
      const buyCount = insiders.filter(tx => tx.type === 'buy').length;
      const sellCount = insiders.filter(tx => tx.type === 'sell').length;

      let insiderPoints = 0;
      let insiderReason = '';

      if (netAmount > 1000000 && buyCount > sellCount) {
        insiderPoints = 3;
        insiderReason = `✅ Net insider buying of $${(netAmount / 1000000).toFixed(1)}M. Bullish signal.`;
      } else if (netAmount >= 0) {
        insiderPoints = 2;
        insiderReason = `Neutral - balanced insider activity.`;
      } else if (netAmount > -5000000) {
        insiderPoints = 1;
        insiderReason = `⚠️ Modest insider selling - could be routine diversification.`;
      } else {
        insiderPoints = 0;
        insiderReason = `🚨 Heavy insider selling of $${(Math.abs(netAmount) / 1000000).toFixed(1)}M. Concerning signal.`;
      }
      score += insiderPoints;

      explanations.push({
        metric: 'Insider Trading',
        value: `$${(netAmount / 1000000).toFixed(1)}M net`,
        points: insiderPoints,
        maxPoints: 3,
        reason: insiderReason,
        implications: `${buyCount} buys, ${sellCount} sells in last 90 days.`,
        source: 'SEC Form 4 Filings via Yahoo Finance',
      });
    } else {
      score += 2; // Neutral when no data
      explanations.push({
        metric: 'Insider Trading',
        value: 'No data',
        points: 2,
        maxPoints: 3,
        reason: 'No recent insider transactions available',
        implications: 'Unable to assess insider sentiment.',
        source: 'Yahoo Finance',
      });
    }

    return {
      score,
      maxScore: 20,
      explanations,
      summary: `Sentiment score: ${score}/20. ${score >= 15 ? 'Positive market mood' : score >= 10 ? 'Mixed sentiment' : 'Negative sentiment'}.`,
    };
  }

  private generateHealthSummary(score: number, explanations: MetricExplanation[]): string {
    if (score >= 24) {
      return `Strong financial foundation (${score}/30). Balance sheet is healthy with good liquidity and manageable debt.`;
    } else if (score >= 18) {
      return `Adequate financial health (${score}/30). Some areas of concern but overall stable.`;
    } else {
      return `⚠️ Weak financial position (${score}/30). Monitor closely for signs of distress.`;
    }
  }

  private generateSummary(
    total: number,
    rating: string,
    health: ComponentScore,
    valuation: ComponentScore,
    growth: ComponentScore,
    sentiment: ComponentScore
  ): string {
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    if (health.score >= 24) strengths.push('strong financials');
    else if (health.score < 18) weaknesses.push('weak balance sheet');

    if (valuation.score >= 20) strengths.push('attractive valuation');
    else if (valuation.score < 12) weaknesses.push('stretched valuation');

    if (growth.score >= 20) strengths.push('accelerating growth');
    else if (growth.score < 12) weaknesses.push('weak growth');

    if (sentiment.score >= 15) strengths.push('positive sentiment');
    else if (sentiment.score < 10) weaknesses.push('negative sentiment');

    return `${strengths.join(', ')} ${strengths.length > 0 && weaknesses.length > 0 ? 'but' : ''} ${weaknesses.join(', ')}.`.replace(/^./, str => str.toUpperCase());
  }

  private generateBullCase(
    health: ComponentScore,
    valuation: ComponentScore,
    growth: ComponentScore,
    sentiment: ComponentScore
  ): string {
    const points: string[] = [];

    if (growth.score >= 15) {
      points.push('Strong growth momentum could continue');
    }
    if (valuation.score >= 18) {
      points.push('Valuation attractive relative to fundamentals');
    }
    if (sentiment.score >= 12) {
      points.push('Positive market sentiment and analyst support');
    }
    if (health.score >= 20) {
      points.push('Solid balance sheet provides stability');
    }

    return points.length > 0 ? points.join('. ') + '.' : 'Limited bullish factors identified.';
  }

  private generateBearCase(
    health: ComponentScore,
    valuation: ComponentScore,
    growth: ComponentScore,
    sentiment: ComponentScore
  ): string {
    const points: string[] = [];

    if (growth.score < 12) {
      points.push('Growth slowing or stagnant');
    }
    if (valuation.score < 12) {
      points.push('Premium valuation leaves little room for error');
    }
    if (sentiment.score < 10) {
      points.push('Negative sentiment could pressure stock');
    }
    if (health.score < 18) {
      points.push('Financial health concerns increase risk');
    }

    return points.length > 0 ? points.join('. ') + '.' : 'Limited bearish factors identified.';
  }

  private generateVerdict(symbol: string, total: number, rating: string, metrics: FinancialMetrics): string {
    if (rating === 'BUY') {
      return `${rating}. Strong fundamentals and attractive setup. Consider ${symbol} for portfolio allocation.`;
    } else if (rating === 'HOLD') {
      return `${rating}. Mixed signals - good company but wait for better entry point or clearer catalyst.`;
    } else {
      return `${rating}. Too many red flags. Better opportunities elsewhere.`;
    }
  }
}

export const investmentScoreService = new InvestmentScoreService();
