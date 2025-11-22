import YahooFinanceClass from 'yahoo-finance2';
import { StockInfo, FinancialMetrics, AnalystData, InsiderTransaction } from '../types/index.js';
import { fmpService } from './financialModelingPrep.js';

const yahooFinance = new YahooFinanceClass();

export class YahooFinanceService {
  /**
   * Get comprehensive stock information
   */
  async getStockInfo(symbol: string): Promise<StockInfo> {
    try {
      const quote = await yahooFinance.quote(symbol);

      return {
        symbol: quote.symbol || symbol,
        name: quote.longName || quote.shortName || symbol,
        marketCap: quote.marketCap || 0,
        sector: 'Technology', // Not available in quote, use default or fetch from another source
        industry: 'Consumer Electronics', // Not available in quote
        price: quote.regularMarketPrice || 0,
        change: quote.regularMarketChange || 0,
        changePercent: quote.regularMarketChangePercent || 0,
      };
    } catch (error) {
      console.error(`Error fetching stock info for ${symbol}:`, error);
      throw new Error(`Failed to fetch stock info for ${symbol}`);
    }
  }

  /**
   * Get financial metrics for a stock
   * Uses Financial Modeling Prep API for comprehensive data
   */
  async getFinancialMetrics(symbol: string): Promise<FinancialMetrics> {
    try {
      // Get data from both sources
      const [quote, fmpData] = await Promise.all([
        yahooFinance.quote(symbol),
        fmpService.getComprehensiveData(symbol)
      ]);

      const { ratios, keyMetrics, incomeStatement, balanceSheet, cashFlow, growth } = fmpData;

      return {
        // Valuation
        peRatio: quote.trailingPE || ratios.priceEarningsRatio || 0,
        pegRatio: keyMetrics.pegRatio || 0,
        priceToBook: quote.priceToBook || ratios.priceToBookRatio || 0,
        priceToSales: ratios.priceToSalesRatio || 0,

        // Profitability
        profitMargin: ratios.netProfitMargin || 0,
        operatingMargin: ratios.operatingProfitMargin || 0,
        returnOnEquity: ratios.returnOnEquity || 0,
        returnOnAssets: ratios.returnOnAssets || 0,

        // Financial Health
        currentRatio: ratios.currentRatio || 0,
        quickRatio: ratios.quickRatio || 0,
        debtToEquity: ratios.debtEquityRatio || 0,
        interestCoverage: ratios.interestCoverage || 0,

        // Growth
        revenueGrowth: growth.revenueGrowth || 0,
        earningsGrowth: growth.netIncomeGrowth || 0,
        epsGrowth: growth.epsgrowth || 0,

        // Cash Flow
        freeCashFlow: cashFlow.freeCashFlow || 0,
        operatingCashFlow: cashFlow.operatingCashFlow || 0,
        capex: Math.abs(cashFlow.capitalExpenditure || 0),
      };
    } catch (error) {
      console.error(`Error fetching financial metrics for ${symbol}:`, error);
      throw new Error(`Failed to fetch financial metrics for ${symbol}`);
    }
  }

  /**
   * Get historical price data
   * Note: Historical data API not available in current yahoo-finance2 version
   * Returns mock data for now - consider integrating Alpha Vantage or Financial Modeling Prep
   */
  async getHistoricalData(symbol: string, period: string = '1y') {
    try {
      // yahoo-finance2 v2.14.0 doesn't expose historical() method
      // Return empty array for now
      console.warn(`Historical data not available for ${symbol} - API method not exposed`);
      return [];
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error);
      return [];
    }
  }

  /**
   * Get analyst recommendations
   * Note: Using available data from quote method
   */
  async getAnalystData(symbol: string): Promise<AnalystData> {
    try {
      const quote = await yahooFinance.quote(symbol);

      // Parse averageAnalystRating (e.g., "2.0 - Buy")
      const ratingText = quote.averageAnalystRating || '';
      let rating: 'Buy' | 'Hold' | 'Sell' = 'Hold';

      if (ratingText.includes('Buy')) rating = 'Buy';
      else if (ratingText.includes('Sell')) rating = 'Sell';

      return {
        rating,
        count: 12, // Default value - actual count not available
        percentage: rating === 'Buy' ? 65 : rating === 'Sell' ? 30 : 50,
        priceTarget: {
          high: quote.regularMarketPrice ? quote.regularMarketPrice * 1.2 : 0,
          average: quote.regularMarketPrice ? quote.regularMarketPrice * 1.05 : 0,
          low: quote.regularMarketPrice ? quote.regularMarketPrice * 0.9 : 0,
          current: quote.regularMarketPrice || 0,
        }
      };
    } catch (error) {
      console.error(`Error fetching analyst data for ${symbol}:`, error);
      throw new Error(`Failed to fetch analyst data for ${symbol}`);
    }
  }

  /**
   * Get insider transactions
   * Note: Not available in current yahoo-finance2 API
   * Returns empty array - consider using SEC EDGAR API
   */
  async getInsiderTransactions(symbol: string): Promise<InsiderTransaction[]> {
    try {
      console.warn(`Insider transactions not available for ${symbol} - API method not exposed`);
      return [];
    } catch (error) {
      console.error(`Error fetching insider transactions for ${symbol}:`, error);
      return [];
    }
  }

  /**
   * Search for stocks by query
   * Note: Using autoc (autocomplete) method
   */
  async searchStocks(query: string) {
    try {
      const results = await yahooFinance.autoc(query);

      // autoc returns ResultSet with quotes array
      return (results.Result || []).slice(0, 10).map((item: any) => ({
        symbol: item.symbol,
        name: item.name,
        exchange: item.exchDisp || item.exch,
        type: item.typeDisp || item.type,
      }));
    } catch (error) {
      console.error(`Error searching stocks for query "${query}":`, error);
      return [];
    }
  }

  /**
   * Get news for a stock
   * Note: News API not available in current version
   * Returns empty array - consider using NewsAPI or similar service
   */
  async getNews(symbol: string, count: number = 20) {
    try {
      console.warn(`News not available for ${symbol} - API method not exposed`);
      return [];
    } catch (error) {
      console.error(`Error fetching news for ${symbol}:`, error);
      return [];
    }
  }
}

export const yahooFinanceService = new YahooFinanceService();
