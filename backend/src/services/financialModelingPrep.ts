import axios from 'axios';

/**
 * Financial Modeling Prep API Service
 * Provides comprehensive financial data with better coverage than Yahoo Finance
 *
 * Free tier: 250 requests/day
 * Get your FREE API key at: https://site.financialmodelingprep.com/developer/docs/
 *
 * IMPORTANT: You MUST sign up for a free API key. The "demo" key does NOT work.
 * 1. Visit https://site.financialmodelingprep.com/developer/docs/
 * 2. Click "Get Your Free API Key"
 * 3. Sign up with email
 * 4. Copy your API key and add to backend/.env as FMP_API_KEY=your-key-here
 */

const FMP_API_KEY = process.env.FMP_API_KEY || '';
const FMP_BASE_URL = 'https://financialmodelingprep.com/api/v3';
const FMP_ENABLED = FMP_API_KEY && FMP_API_KEY !== 'demo' && FMP_API_KEY.length > 10;

export class FinancialModelingPrepService {
  private apiKey: string;
  private enabled: boolean;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || FMP_API_KEY;
    this.enabled = !!this.apiKey && this.apiKey !== 'demo' && this.apiKey.length > 10;

    if (!this.enabled) {
      console.warn('⚠️  FMP API key not configured. Financial data will be limited.');
      console.warn('📝 Get free API key at: https://site.financialmodelingprep.com/developer/docs/');
    }
  }

  private isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Get comprehensive company profile
   */
  async getCompanyProfile(symbol: string) {
    if (!this.isEnabled()) {
      return null;
    }

    try {
      const response = await axios.get(
        `${FMP_BASE_URL}/profile/${symbol}?apikey=${this.apiKey}`
      );
      return response.data[0] || null;
    } catch (error: any) {
      if (error.response?.data?.['Error Message']?.includes('Invalid API KEY')) {
        console.error('❌ FMP API key is invalid. Please get a free key at https://site.financialmodelingprep.com/developer/docs/');
        this.enabled = false; // Disable further attempts
      } else {
        console.error(`Error fetching company profile for ${symbol}:`, error.message);
      }
      return null;
    }
  }

  /**
   * Get key financial metrics
   */
  async getKeyMetrics(symbol: string, period: 'annual' | 'quarter' = 'quarter') {
    try {
      const response = await axios.get(
        `${FMP_BASE_URL}/key-metrics/${symbol}?period=${period}&limit=5&apikey=${this.apiKey}`
      );
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching key metrics for ${symbol}:`, error);
      return [];
    }
  }

  /**
   * Get financial ratios
   */
  async getFinancialRatios(symbol: string, period: 'annual' | 'quarter' = 'quarter') {
    try {
      const response = await axios.get(
        `${FMP_BASE_URL}/ratios/${symbol}?period=${period}&limit=5&apikey=${this.apiKey}`
      );
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching financial ratios for ${symbol}:`, error);
      return [];
    }
  }

  /**
   * Get income statement
   */
  async getIncomeStatement(symbol: string, period: 'annual' | 'quarter' = 'quarter') {
    try {
      const response = await axios.get(
        `${FMP_BASE_URL}/income-statement/${symbol}?period=${period}&limit=5&apikey=${this.apiKey}`
      );
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching income statement for ${symbol}:`, error);
      return [];
    }
  }

  /**
   * Get balance sheet
   */
  async getBalanceSheet(symbol: string, period: 'annual' | 'quarter' = 'quarter') {
    try {
      const response = await axios.get(
        `${FMP_BASE_URL}/balance-sheet-statement/${symbol}?period=${period}&limit=5&apikey=${this.apiKey}`
      );
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching balance sheet for ${symbol}:`, error);
      return [];
    }
  }

  /**
   * Get cash flow statement
   */
  async getCashFlowStatement(symbol: string, period: 'annual' | 'quarter' = 'quarter') {
    try {
      const response = await axios.get(
        `${FMP_BASE_URL}/cash-flow-statement/${symbol}?period=${period}&limit=5&apikey=${this.apiKey}`
      );
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching cash flow statement for ${symbol}:`, error);
      return [];
    }
  }

  /**
   * Get financial growth metrics
   */
  async getFinancialGrowth(symbol: string, period: 'annual' | 'quarter' = 'quarter') {
    try {
      const response = await axios.get(
        `${FMP_BASE_URL}/financial-growth/${symbol}?period=${period}&limit=5&apikey=${this.apiKey}`
      );
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching financial growth for ${symbol}:`, error);
      return [];
    }
  }

  /**
   * Get analyst estimates
   */
  async getAnalystEstimates(symbol: string) {
    try {
      const response = await axios.get(
        `${FMP_BASE_URL}/analyst-estimates/${symbol}?limit=5&apikey=${this.apiKey}`
      );
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching analyst estimates for ${symbol}:`, error);
      return [];
    }
  }

  /**
   * Get comprehensive financial data for a symbol
   * Combines multiple endpoints for complete analysis
   */
  async getComprehensiveData(symbol: string) {
    try {
      const [
        profile,
        keyMetrics,
        ratios,
        incomeStatement,
        balanceSheet,
        cashFlow,
        growth,
        estimates
      ] = await Promise.all([
        this.getCompanyProfile(symbol),
        this.getKeyMetrics(symbol),
        this.getFinancialRatios(symbol),
        this.getIncomeStatement(symbol),
        this.getBalanceSheet(symbol),
        this.getCashFlowStatement(symbol),
        this.getFinancialGrowth(symbol),
        this.getAnalystEstimates(symbol)
      ]);

      return {
        profile,
        keyMetrics: keyMetrics[0] || {},
        ratios: ratios[0] || {},
        incomeStatement: incomeStatement[0] || {},
        balanceSheet: balanceSheet[0] || {},
        cashFlow: cashFlow[0] || {},
        growth: growth[0] || {},
        estimates: estimates[0] || {},
      };
    } catch (error) {
      console.error(`Error fetching comprehensive data for ${symbol}:`, error);
      throw error;
    }
  }
}

export const fmpService = new FinancialModelingPrepService();
